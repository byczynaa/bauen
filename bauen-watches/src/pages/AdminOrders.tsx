import { useEffect, useState } from 'react';
import { apiBaseUrl } from '../utils/api';
import { Navigate, Link } from 'react-router-dom';
import SalesGraph from '../components/SalesGraph';
import { products } from '../data/products';

const productNameMap: Record<number, string> = Object.fromEntries(
  products.map((p) => [p.id, p.name])
);

type OrderItem = { product_id: number; quantity: number };

type Order = {
  order_id: string;
  created_at: string;
  customer_name?: string;
  customer_email: string;
  shipping_address: {
    line1?: string; city?: string; state?: string;
    postal_code?: string; country?: string; [key: string]: any;
  };
  items: OrderItem[];
  total_cents: number;
  status: string;
};

function fmtAddress(a: Order['shipping_address']) {
  if (!a || typeof a !== 'object') return '—';
  return [a.line1, [a.city, a.state, a.postal_code].filter(Boolean).join(', '), a.country]
    .filter(Boolean).join('\n');
}

function OrderModal({ order, onClose, onStatusChange }: {
  order: Order;
  onClose: () => void;
  onStatusChange: (id: string, status: string) => Promise<void>;
}) {
  const [updating, setUpdating] = useState(false);
  const handleStatus = async (status: string) => {
    setUpdating(true);
    await onStatusChange(order.order_id, status);
    setUpdating(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-xl font-serif mb-1">Order Detail</h2>
            <p className="font-mono text-xs text-textSubtle">{order.order_id}</p>
          </div>
          <button onClick={onClose} className="text-textSubtle hover:text-textMain text-2xl leading-none ml-4">×</button>
        </div>
        <div className="space-y-4 text-sm">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-textSubtle text-xs mb-1">Customer</p>
              <p className="font-medium">{order.customer_name || '—'}</p>
              <p className="text-textSubtle">{order.customer_email}</p>
            </div>
            <div>
              <p className="text-textSubtle text-xs mb-1">Date</p>
              <p>{new Date(order.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
              <p className="text-textSubtle">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
          <div>
            <p className="text-textSubtle text-xs mb-1">Shipping Address</p>
            <p className="whitespace-pre-line">{fmtAddress(order.shipping_address)}</p>
          </div>
          <div>
            <p className="text-textSubtle text-xs mb-2">Items</p>
            <ul className="space-y-1">
              {order.items.map((item) => (
                <li key={item.product_id} className="flex justify-between">
                  <span>{productNameMap[item.product_id] || `Product #${item.product_id}`}</span>
                  <span className="text-textSubtle">× {item.quantity}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-medium mt-3 pt-3 border-t border-border">
              <span>Total</span>
              <span>${(order.total_cents / 100).toFixed(2)}</span>
            </div>
          </div>
          <div>
            <p className="text-textSubtle text-xs mb-2">Update Status</p>
            <div className="flex gap-2 flex-wrap">
              {(['paid', 'refunded', 'cancelled'] as const).map((s) => (
                <button
                  key={s}
                  disabled={updating || order.status === s}
                  onClick={() => handleStatus(s)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                    order.status === s
                      ? 'bg-textMain text-white border-textMain'
                      : 'border-border text-textSubtle hover:text-textMain hover:border-textMain disabled:opacity-40'
                  }`}
                >
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sessionChecked, setSessionChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/admin/session`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { setIsAdmin(!!d.authenticated); setSessionChecked(true); });
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    fetch(`${apiBaseUrl}/api/admin/orders`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders || []); setLoading(false); })
      .catch(() => { setError('Failed to load orders'); setLoading(false); });
  }, [isAdmin]);

  const updateStatus = async (orderId: string, status: string) => {
    const res = await fetch(`${apiBaseUrl}/api/admin/orders/${orderId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setOrders((prev) => prev.map((o) => o.order_id === orderId ? { ...o, status } : o));
      setSelectedOrder((prev) => prev?.order_id === orderId ? { ...prev, status } : prev);
    }
  };

  const exportCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Email', 'Address', 'Items', 'Total', 'Status'];
    const rows = orders.map((o) => [
      o.order_id,
      new Date(o.created_at).toLocaleDateString(),
      o.customer_name || '',
      o.customer_email,
      fmtAddress(o.shipping_address).replace(/\n/g, ' '),
      o.items.map((i) => `${productNameMap[i.product_id] || i.product_id} x${i.quantity}`).join('; '),
      `$${(o.total_cents / 100).toFixed(2)}`,
      o.status,
    ]);
    const csv = [headers, ...rows]
      .map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(','))
      .join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!sessionChecked) return <div className="p-10 text-center">Checking admin session...</div>;
  if (!isAdmin) return <Navigate to="/admin-login" replace />;
  if (loading) return <div className="p-10 text-center">Loading orders...</div>;
  if (error) return <div className="p-10 text-center text-red-600">{error}</div>;

  return (
    <section className="bg-base text-textMain min-h-screen py-20 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
          <h1 className="text-4xl font-serif">Orders Dashboard</h1>
          <div className="flex items-center gap-3">
            <button
              onClick={exportCSV}
              disabled={orders.length === 0}
              className="text-sm border border-border rounded px-4 py-2 text-textSubtle hover:text-textMain transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Export CSV
            </button>
            <Link to="/admin" className="text-sm border border-border rounded px-4 py-2 text-textSubtle hover:text-textMain transition-colors">
              ← Admin Menu
            </Link>
          </div>
        </div>

        <SalesGraph />

        <div className="overflow-x-auto">
          <table className="min-w-full border border-border rounded-lg">
            <thead>
              <tr className="bg-surface text-textSubtle text-xs uppercase">
                <th className="px-4 py-2 text-left">Order #</th>
                <th className="px-4 py-2 text-left">Date</th>
                <th className="px-4 py-2 text-left">Customer</th>
                <th className="px-4 py-2 text-left">Items</th>
                <th className="px-4 py-2 text-left">Total</th>
                <th className="px-4 py-2 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.order_id}
                  className="border-t border-border hover:bg-surface transition-colors cursor-pointer"
                  onClick={() => setSelectedOrder(order)}
                >
                  <td className="px-4 py-3 font-mono text-xs">{order.order_id.slice(0, 8)}…</td>
                  <td className="px-4 py-3 text-xs whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    <div className="text-textSubtle">{new Date(order.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div>{order.customer_name || '—'}</div>
                    <div className="text-xs text-textSubtle">{order.customer_email}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">
                    <ul className="space-y-0.5">
                      {order.items.map((item) => (
                        <li key={item.product_id}>
                          <span className="font-medium">{productNameMap[item.product_id] || `#${item.product_id}`}</span>
                          <span className="text-textSubtle"> × {item.quantity}</span>
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td className="px-4 py-3 font-mono text-sm">${(order.total_cents / 100).toFixed(2)}</td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus(order.order_id, e.target.value)}
                      className={`text-xs rounded-full px-2 py-0.5 font-medium border-0 cursor-pointer ${
                        order.status === 'paid' ? 'bg-green-100 text-green-800' :
                        order.status === 'refunded' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      <option value="paid">paid</option>
                      <option value="refunded">refunded</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <p className="text-center text-textSubtle py-12 text-sm">No orders yet.</p>
          )}
        </div>
      </div>

      {selectedOrder && (
        <OrderModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={updateStatus}
        />
      )}
    </section>
  );
}
