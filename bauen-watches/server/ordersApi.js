import express from 'express';
import { createClient } from '@supabase/supabase-js';

let _supabase = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false, autoRefreshToken: false } }
    );
  }
  return _supabase;
}

const router = express.Router();

// List all orders with items and shipping info
router.get('/', async (req, res) => {
  try {
    const { data, error } = await getSupabase()
      .from('orders')
      .select(`
        *,
        inventory_reservations ( status ),
        inventory_reservation_items ( product_id, quantity )
      `)
      .order('created_at', { ascending: false })
      .limit(100);
    if (error) throw error;
    const orders = (data || []).map((o) => ({
      ...o,
      reservation_status: o.inventory_reservations?.status ?? null,
      items: (o.inventory_reservation_items || []),
    }));
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sales totals over time - supports ?days=7|30|90|365
router.get('/sales', async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days) || 60, 1), 365);
  try {
    const since = new Date(Date.now() - days * 86400 * 1000).toISOString();
    const { data, error } = await getSupabase()
      .from('orders')
      .select('created_at, total_cents')
      .eq('status', 'paid')
      .gte('created_at', since);
    if (error) throw error;
    // Aggregate by day in JS
    const byDay = {};
    for (const row of data || []) {
      const day = row.created_at.slice(0, 10);
      if (!byDay[day]) byDay[day] = { day, total_cents: 0, order_count: 0 };
      byDay[day].total_cents += row.total_cents;
      byDay[day].order_count += 1;
    }
    const sales = Object.values(byDay).sort((a, b) => a.day.localeCompare(b.day));
    res.json({ sales });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sales by product - supports ?days=
router.get('/sales/by-product', async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days) || 60, 1), 365);
  try {
    const since = new Date(Date.now() - days * 86400 * 1000).toISOString();
    const { data, error } = await getSupabase()
      .from('orders')
      .select('order_id, reservation_token, inventory_reservation_items ( product_id, quantity )')
      .eq('status', 'paid')
      .gte('created_at', since);
    if (error) throw error;
    const byProduct = {};
    for (const order of data || []) {
      for (const item of order.inventory_reservation_items || []) {
        const id = item.product_id;
        if (!byProduct[id]) byProduct[id] = { product_id: id, total_quantity: 0, order_count: 0 };
        byProduct[id].total_quantity += item.quantity;
        byProduct[id].order_count += 1;
      }
    }
    const products = Object.values(byProduct).sort((a, b) => b.total_quantity - a.total_quantity);
    res.json({ products });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sales by city/location - supports ?days=
router.get('/sales/by-city', async (req, res) => {
  const days = Math.min(Math.max(parseInt(req.query.days) || 60, 1), 365);
  try {
    const since = new Date(Date.now() - days * 86400 * 1000).toISOString();
    const { data, error } = await getSupabase()
      .from('orders')
      .select('shipping_address, total_cents')
      .eq('status', 'paid')
      .gte('created_at', since);
    if (error) throw error;
    const byCity = {};
    for (const row of data || []) {
      const addr = row.shipping_address || {};
      const city = addr.city || 'Unknown';
      const country = addr.country || '';
      const key = `${city}|${country}`;
      if (!byCity[key]) byCity[key] = { city, country, order_count: 0, total_cents: 0 };
      byCity[key].order_count += 1;
      byCity[key].total_cents += row.total_cents;
    }
    const cities = Object.values(byCity)
      .sort((a, b) => b.order_count - a.order_count)
      .slice(0, 20);
    res.json({ cities });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update order status
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  if (!['paid', 'refunded', 'cancelled'].includes(status)) {
    return res.status(400).json({ error: 'Invalid status' });
  }
  try {
    const { data, error } = await getSupabase()
      .from('orders')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('order_id', id)
      .select('order_id, status')
      .single();
    if (error) throw error;
    res.json({ order: data });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
