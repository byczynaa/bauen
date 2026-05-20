-- Add orders table for finalized customer orders
create table if not exists public.orders (
  order_id uuid primary key default gen_random_uuid(),
  reservation_token uuid not null references public.inventory_reservations(reservation_token) on delete cascade,
  payment_intent_id text not null,
  customer_email text not null,
  customer_name text,
  shipping_address jsonb not null,
  total_cents integer not null,
  currency text not null default 'usd',
  status text not null default 'paid' check (status in ('paid', 'refunded', 'cancelled')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

-- Index for fast lookup by payment intent
create index if not exists idx_orders_payment_intent_id on public.orders(payment_intent_id);

-- Index for fast lookup by created_at
create index if not exists idx_orders_created_at on public.orders(created_at);
