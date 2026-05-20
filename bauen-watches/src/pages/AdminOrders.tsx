import { useEffect, useState } from 'react';
import { apiBaseUrl } from '../utils/api';
import { Navigate } from 'react-router-dom';
import SalesGraph from '../components/SalesGraph';

type OrderItem = {
  product_id: number;
  quantity: number;
};

type Order = {
  order_id: string;
  created_at: string;
  customer_name?: string;
  customer_email: string;
  shipping_address: {
    line1?: string;
    city?: string;
    state?: string;
    postal_code?: string;
    country?: string;
    [key: string]: any;
  };
  items: OrderItem[];
  total_cents: number;
  status: string;
};

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/admin/session`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        setIsAdmin(!!d.authenticated);
        setSessionChecked(true);
      });
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${apiBaseUrl}/api/admin/orders`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders || []);
        setLoading(false);
      })
      .catch((e) => {
        setError('Failed to load orders');
        setLoading(false);
      });
  }, [isAdmin]);

  if (!sessionChecked) return <div className="p-10 text-center">Checking admin session...</div>;
  if (!isAdmin) return <Navigate to="/inventory-login" replace />;
  if (loading) return <div className="p-10 text-center">Loading orders...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <section className="bg-base text-textMain min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-serif mb-8">Orders Dashboard</h1>
        <SalesGraph />
        <div className="overflow-x-auto">
          <table className="min-w-full border border-border rounded-lg">
            <thead>
              <tr className="bg-surface text-textSubtle text-xs uppercase">
                <th className="px-4 py-2">Order #</th>
                <th className="px-4 py-2">Date</th>
                <th className="px-4 py-2">Customer</th>
                <th className="px-4 py-2">Email</th>
                <th className="px-4 py-2">Address</th>
                <th className="px-4 py-2">Items</th>
                <th className="px-4 py-2">Total</th>
                <th className="px-4 py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.order_id} className="border-t border-border">
                  <td className="px-4 py-2 font-mono text-xs">{order.order_id.slice(0, 8)}</td>
                  <td className="px-4 py-2 text-xs">{new Date(order.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2">{order.customer_name || '-'}</td>
                  <td className="px-4 py-2">{order.customer_email}</td>
                  <td className="px-4 py-2 text-xs">
                    {order.shipping_address && typeof order.shipping_address === 'object'
                      ? [order.shipping_address.line1, order.shipping_address.city, order.shipping_address.state, order.shipping_address.postal_code, order.shipping_address.country].filter(Boolean).join(', ')
                      : '-'}
                  </td>
                  <td className="px-4 py-2 text-xs">
                    <ul>
                      {order.items.map((item) => (
                        <li key={item.product_id}>
                          {item.product_id} × {item.quantity}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-2 font-mono">${(order.total_cents / 100).toFixed(2)}</td>
                  <td className="px-4 py-2 text-xs">{order.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
