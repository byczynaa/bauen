create extension if not exists pgcrypto;

create table if not exists public.inventory_items (
  product_id bigint primary key,
  name text not null,
  price_cents integer not null,
  stock integer not null check (stock >= 0),
  image_url text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.inventory_reservations (
  reservation_token uuid primary key default gen_random_uuid(),
  payment_intent_id text unique,
  status text not null default 'pending' check (status in ('pending', 'completed', 'released', 'expired')),
  expires_at timestamptz not null,
  created_at timestamptz not null default timezone('utc', now()),
  completed_at timestamptz,
  released_at timestamptz
);

create table if not exists public.inventory_reservation_items (
  reservation_token uuid not null references public.inventory_reservations(reservation_token) on delete cascade,
  product_id bigint not null references public.inventory_items(product_id) on delete cascade,
  quantity integer not null check (quantity > 0),
  primary key (reservation_token, product_id)
);

create or replace function public.set_inventory_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists inventory_items_set_updated_at on public.inventory_items;
create trigger inventory_items_set_updated_at
before update on public.inventory_items
for each row
execute function public.set_inventory_updated_at();

create or replace function public.sync_inventory_catalog(p_catalog jsonb)
returns void
language plpgsql
security definer
as $$
declare
  item jsonb;
begin
  for item in select * from jsonb_array_elements(coalesce(p_catalog, '[]'::jsonb))
  loop
    insert into public.inventory_items (product_id, name, price_cents, stock, image_url)
    values (
      (item ->> 'product_id')::bigint,
      item ->> 'name',
      (item ->> 'price_cents')::integer,
      coalesce((item ->> 'default_stock')::integer, 25),
      item ->> 'previewImage'
    )
    on conflict (product_id) do update
      set name = excluded.name,
          price_cents = excluded.price_cents,
          image_url = excluded.image_url,
          active = true;
  end loop;
end;
$$;

create or replace function public.expire_inventory_reservations()
returns integer
language plpgsql
security definer
as $$
declare
  reservation record;
  expired_count integer := 0;
begin
  for reservation in
    select reservation_token
    from public.inventory_reservations
    where status = 'pending' and expires_at <= timezone('utc', now())
    for update
  loop
    update public.inventory_items as inventory
    set stock = inventory.stock + reservation_items.quantity
    from public.inventory_reservation_items as reservation_items
    where reservation_items.reservation_token = reservation.reservation_token
      and inventory.product_id = reservation_items.product_id;

    update public.inventory_reservations
    set status = 'expired',
        released_at = timezone('utc', now())
    where reservation_token = reservation.reservation_token;

    expired_count := expired_count + 1;
  end loop;

  return expired_count;
end;
$$;

create or replace function public.reserve_inventory(p_items jsonb, p_expires_minutes integer default 15)
returns table (reservation_token uuid, expires_at timestamptz)
language plpgsql
security definer
as $$
declare
  item jsonb;
  inventory_row public.inventory_items%rowtype;
  new_reservation_token uuid;
  new_expires_at timestamptz := timezone('utc', now()) + make_interval(mins => greatest(p_expires_minutes, 1));
begin
  perform public.expire_inventory_reservations();

  insert into public.inventory_reservations (expires_at)
  values (new_expires_at)
  returning public.inventory_reservations.reservation_token into new_reservation_token;

  begin
    for item in select * from jsonb_array_elements(coalesce(p_items, '[]'::jsonb))
    loop
      if coalesce((item ->> 'quantity')::integer, 0) < 1 then
        raise exception 'Invalid quantity for product id: %', item ->> 'id';
      end if;

      select *
      into inventory_row
      from public.inventory_items
      where product_id = (item ->> 'id')::bigint
      for update;

      if not found then
        raise exception 'Invalid product id: %', item ->> 'id';
      end if;

      if inventory_row.stock <= 0 then
        raise exception '% is out of stock.', inventory_row.name;
      end if;

      if inventory_row.stock < (item ->> 'quantity')::integer then
        raise exception 'Only % % left in stock.', inventory_row.stock, inventory_row.name;
      end if;

      update public.inventory_items
      set stock = stock - (item ->> 'quantity')::integer
      where product_id = inventory_row.product_id;

      insert into public.inventory_reservation_items (reservation_token, product_id, quantity)
      values (new_reservation_token, inventory_row.product_id, (item ->> 'quantity')::integer);
    end loop;
  exception when others then
    update public.inventory_items as inventory
    set stock = inventory.stock + reservation_items.quantity
    from public.inventory_reservation_items as reservation_items
    where reservation_items.reservation_token = new_reservation_token
      and inventory.product_id = reservation_items.product_id;

    delete from public.inventory_reservations where public.inventory_reservations.reservation_token = new_reservation_token;
    raise;
  end;

  reservation_token := new_reservation_token;
  expires_at := new_expires_at;
  return next;
end;
$$;

create or replace function public.complete_inventory_reservation(p_payment_intent_id text, p_reservation_token uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  reservation_status text;
  existing_payment_intent_id text;
begin
  perform public.expire_inventory_reservations();

  select status, payment_intent_id
  into reservation_status, existing_payment_intent_id
  from public.inventory_reservations
  where reservation_token = p_reservation_token
  for update;

  if not found then
    return false;
  end if;

  if reservation_status = 'completed' and existing_payment_intent_id = p_payment_intent_id then
    return true;
  end if;

  if reservation_status <> 'pending' then
    return false;
  end if;

  update public.inventory_reservations
  set status = 'completed',
      payment_intent_id = p_payment_intent_id,
      completed_at = timezone('utc', now())
  where reservation_token = p_reservation_token;

  return true;
end;
$$;

create or replace function public.release_inventory_reservation(p_reservation_token uuid)
returns boolean
language plpgsql
security definer
as $$
declare
  reservation_status text;
begin
  perform public.expire_inventory_reservations();

  select status
  into reservation_status
  from public.inventory_reservations
  where reservation_token = p_reservation_token
  for update;

  if not found then
    return false;
  end if;

  if reservation_status <> 'pending' then
    return reservation_status in ('released', 'expired');
  end if;

  update public.inventory_items as inventory
  set stock = inventory.stock + reservation_items.quantity
  from public.inventory_reservation_items as reservation_items
  where reservation_items.reservation_token = p_reservation_token
    and inventory.product_id = reservation_items.product_id;

  update public.inventory_reservations
  set status = 'released',
      released_at = timezone('utc', now())
  where reservation_token = p_reservation_token;

  return true;
end;
$$;

create or replace function public.reset_inventory_stock(p_default_stock integer default 25)
returns void
language plpgsql
security definer
as $$
begin
  perform public.expire_inventory_reservations();

  update public.inventory_items
  set stock = greatest(p_default_stock, 0);

  update public.inventory_reservations
  set status = 'released',
      released_at = timezone('utc', now())
  where status = 'pending';

  delete from public.inventory_reservation_items
  where reservation_token in (
    select reservation_token from public.inventory_reservations where status = 'released'
  );
end;
$$;