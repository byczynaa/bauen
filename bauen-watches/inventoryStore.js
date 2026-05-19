import crypto from 'crypto';
import ws from 'ws';
import { createClient } from '@supabase/supabase-js';

function normalizeItems(items) {
  return items
    .map((item) => ({
      id: Number(item?.id),
      quantity: Number(item?.quantity),
    }))
    .filter((item) => Number.isInteger(item.id) && Number.isInteger(item.quantity) && item.quantity > 0);
}

function createMemoryInventoryStore({ defaultStock, logger }) {
  const inventory = new Map();
  const catalog = new Map();
  const reservations = new Map();

  function pruneExpiredReservations() {
    const now = Date.now();
    for (const reservation of reservations.values()) {
      if (reservation.status !== 'pending') {
        continue;
      }

      if (reservation.expiresAt.getTime() > now) {
        continue;
      }

      for (const item of reservation.items) {
        inventory.set(item.id, (inventory.get(item.id) ?? defaultStock) + item.quantity);
      }

      reservation.status = 'expired';
      reservation.releasedAt = new Date();
    }
  }

  function getInventoryItems() {
    pruneExpiredReservations();
    return [...catalog.values()].map((product) => ({
      id: product.id,
      name: product.name,
      stock: inventory.get(product.id) ?? defaultStock,
      previewImage: product.previewImage,
    }));
  }

  return {
    async initializeCatalog(productCatalog) {
      for (const [id, product] of Object.entries(productCatalog)) {
        const productId = Number(id);
        catalog.set(productId, { id: productId, ...product });
        if (!inventory.has(productId)) {
          inventory.set(productId, defaultStock);
        }
      }

      logger.warn('SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY not configured. Inventory is using in-memory fallback.');
    },

    async getInventoryItems() {
      return getInventoryItems();
    },

    async getPublicInventoryItems() {
      return getInventoryItems().map((item) => ({
        id: item.id,
        stock: item.stock,
        inStock: item.stock > 0,
      }));
    },

    async setStock(id, stock) {
      pruneExpiredReservations();
      if (!catalog.has(id)) {
        throw new Error('Invalid product id.');
      }

      inventory.set(id, stock);
      const product = catalog.get(id);
      return { id, name: product.name, stock };
    },

    async resetInventory() {
      for (const productId of catalog.keys()) {
        inventory.set(productId, defaultStock);
      }

      for (const reservation of reservations.values()) {
        if (reservation.status === 'pending') {
          reservation.status = 'released';
          reservation.releasedAt = new Date();
        }
      }

      return getInventoryItems();
    },

    async reserveItems(items, reservationMinutes = 15) {
      pruneExpiredReservations();
      const normalizedItems = normalizeItems(items);

      for (const item of normalizedItems) {
        const product = catalog.get(item.id);
        if (!product) {
          throw new Error(`Invalid product id: ${item.id}`);
        }

        const stock = inventory.get(item.id) ?? defaultStock;
        if (stock <= 0) {
          throw new Error(`${product.name} is out of stock.`);
        }
        if (item.quantity > stock) {
          throw new Error(`Only ${stock} ${product.name} left in stock.`);
        }
      }

      for (const item of normalizedItems) {
        inventory.set(item.id, (inventory.get(item.id) ?? defaultStock) - item.quantity);
      }

      const reservationToken = crypto.randomUUID();
      const expiresAt = new Date(Date.now() + reservationMinutes * 60 * 1000);
      reservations.set(reservationToken, {
        reservationToken,
        items: normalizedItems,
        status: 'pending',
        expiresAt,
        paymentIntentId: null,
      });

      return { reservationToken, expiresAt: expiresAt.toISOString() };
    },

    async completeReservation(paymentIntentId, reservationToken) {
      pruneExpiredReservations();
      const reservation = reservations.get(reservationToken);
      if (!reservation) {
        return false;
      }

      if (reservation.status === 'completed' && reservation.paymentIntentId === paymentIntentId) {
        return true;
      }

      if (reservation.status !== 'pending') {
        return false;
      }

      reservation.status = 'completed';
      reservation.paymentIntentId = paymentIntentId;
      reservation.completedAt = new Date();
      return true;
    },

    async releaseReservation(reservationToken) {
      pruneExpiredReservations();
      const reservation = reservations.get(reservationToken);
      if (!reservation) {
        return false;
      }

      if (reservation.status !== 'pending') {
        return reservation.status === 'released' || reservation.status === 'expired';
      }

      for (const item of reservation.items) {
        inventory.set(item.id, (inventory.get(item.id) ?? defaultStock) + item.quantity);
      }

      reservation.status = 'released';
      reservation.releasedAt = new Date();
      return true;
    },
  };
}

function createSupabaseInventoryStore({ supabaseUrl, supabaseKey, defaultStock }) {
  const supabase = createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    realtime: {
      transport: ws,
    },
  });

  async function releaseExpiredReservations() {
    const { error } = await supabase.rpc('expire_inventory_reservations');
    if (error) {
      throw error;
    }
  }

  return {
    async initializeCatalog(productCatalog) {
      const catalog = Object.entries(productCatalog).map(([id, product]) => ({
        product_id: Number(id),
        name: product.name,
        price_cents: product.priceCents,
        default_stock: defaultStock,
        previewImage: product.previewImage ?? null,
      }));

      const { error } = await supabase.rpc('sync_inventory_catalog', {
        p_catalog: catalog,
      });

      if (error) {
        throw error;
      }
    },

    async getInventoryItems() {
      await releaseExpiredReservations();
      const { data, error } = await supabase
        .from('inventory_items')
        .select('product_id, name, stock, image_url')
        .order('product_id', { ascending: true });

      if (error) {
        throw error;
      }

      return (data ?? []).map((item) => ({
        id: item.product_id,
        name: item.name,
        stock: item.stock,
        previewImage: item.image_url,
      }));
    },

    async getPublicInventoryItems() {
      await releaseExpiredReservations();
      const { data, error } = await supabase
        .from('inventory_items')
        .select('product_id, stock')
        .order('product_id', { ascending: true });

      if (error) {
        throw error;
      }

      return (data ?? []).map((item) => ({
        id: item.product_id,
        stock: item.stock,
        inStock: item.stock > 0,
      }));
    },

    async setStock(id, stock) {
      await releaseExpiredReservations();
      const { data, error } = await supabase
        .from('inventory_items')
        .update({ stock })
        .eq('product_id', id)
        .select('product_id, name, stock')
        .single();

      if (error) {
        throw error;
      }

      return {
        id: data.product_id,
        name: data.name,
        stock: data.stock,
      };
    },

    async resetInventory() {
      const { error } = await supabase.rpc('reset_inventory_stock', {
        p_default_stock: defaultStock,
      });

      if (error) {
        throw error;
      }

      return this.getInventoryItems();
    },

    async reserveItems(items, reservationMinutes = 15) {
      await releaseExpiredReservations();
      const { data, error } = await supabase.rpc('reserve_inventory', {
        p_items: normalizeItems(items),
        p_expires_minutes: reservationMinutes,
      });

      if (error) {
        throw error;
      }

      const reservation = Array.isArray(data) ? data[0] : data;
      return {
        reservationToken: reservation.reservation_token,
        expiresAt: reservation.expires_at,
      };
    },

    async completeReservation(paymentIntentId, reservationToken) {
      await releaseExpiredReservations();
      const { data, error } = await supabase.rpc('complete_inventory_reservation', {
        p_payment_intent_id: paymentIntentId,
        p_reservation_token: reservationToken,
      });

      if (error) {
        throw error;
      }

      return Boolean(data);
    },

    async releaseReservation(reservationToken) {
      await releaseExpiredReservations();
      const { data, error } = await supabase.rpc('release_inventory_reservation', {
        p_reservation_token: reservationToken,
      });

      if (error) {
        throw error;
      }

      return Boolean(data);
    },
  };
}

export function createInventoryStore({ supabaseUrl, supabaseKey, defaultStock, logger = console }) {
  if (supabaseUrl && supabaseKey) {
    return createSupabaseInventoryStore({ supabaseUrl, supabaseKey, defaultStock });
  }

  return createMemoryInventoryStore({ defaultStock, logger });
}