import express from 'express';
import db from './db.js';

const router = express.Router();

// List all orders with items and shipping info
router.get('/', async (req, res) => {
  try {
    const { rows: orders } = await db.query(`
      select o.*, r.status as reservation_status, array_agg(jsonb_build_object('product_id', i.product_id, 'quantity', i.quantity)) as items
      from orders o
      join inventory_reservations r on o.reservation_token = r.reservation_token
      join inventory_reservation_items i on o.reservation_token = i.reservation_token
      group by o.order_id, r.status
      order by o.created_at desc
      limit 100
    `);
    res.json({ orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Sales totals for analytics (by day, week, month)
router.get('/sales', async (req, res) => {
  try {
    const { rows } = await db.query(`
      select
        date_trunc('day', created_at) as day,
        sum(total_cents) as total_cents,
        count(*) as order_count
      from orders
      where status = 'paid'
      group by day
      order by day desc
      limit 60
    `);
    res.json({ sales: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
