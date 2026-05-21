import { useEffect, useState } from 'react';
import { apiBaseUrl } from '../utils/api';
import { products } from '../data/products';

type DayOption = 7 | 30 | 90 | 365;
type ViewOption = 'revenue' | 'products' | 'cities';

type SaleDay = { day: string; total_cents: string; order_count: string };
type ProductSale = { product_id: number; total_quantity: string; order_count: string };
type CitySale = { city: string; country: string; order_count: string; total_cents: string };

const DAY_LABELS: Record<DayOption, string> = { 7: '7D', 30: '30D', 90: '90D', 365: '1Y' };

const productNameMap: Record<number, string> = Object.fromEntries(
  products.map((p) => [p.id, p.name])
);

function fmtDollars(cents: number) {
  return '$' + (cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function RevenueChart({ data, days }: { data: SaleDay[]; days: DayOption }) {
  if (!data.length) {
    return <p className="text-textSubtle text-sm py-8 text-center">No orders in this period.</p>;
  }

  const totalRevenue = data.reduce((s, d) => s + Number(d.total_cents), 0);
  const totalOrders = data.reduce((s, d) => s + Number(d.order_count), 0);

  const W = 640;
  const H = 200;
  const PAD = { top: 24, right: 20, bottom: 36, left: 64 };
  const chartW = W - PAD.left - PAD.right;
  const chartH = H - PAD.top - PAD.bottom;

  const values = data.map((d) => Number(d.total_cents));
  const maxVal = Math.max(...values, 1);

  const xOf = (i: number) =>
    data.length === 1 ? PAD.left + chartW / 2 : PAD.left + (i / (data.length - 1)) * chartW;
  const yOf = (v: number) => PAD.top + chartH - (v / maxVal) * chartH;

  const polyPoints = data.map((d, i) => `${xOf(i)},${yOf(Number(d.total_cents))}`).join(' ');
  const areaPoints = [
    `${xOf(0)},${PAD.top + chartH}`,
    ...data.map((d, i) => `${xOf(i)},${yOf(Number(d.total_cents))}`),
    `${xOf(data.length - 1)},${PAD.top + chartH}`,
  ].join(' ');

  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((pct) => ({
    y: PAD.top + chartH - pct * chartH,
    label: fmtDollars(maxVal * pct),
  }));

  const labelCount = Math.min(data.length, 6);
  const labelIdxs = Array.from({ length: labelCount }, (_, i) =>
    Math.round((i / Math.max(labelCount - 1, 1)) * (data.length - 1))
  );

  return (
    <div>
      <div className="flex flex-wrap gap-8 mb-6 text-sm">
        <div>
          <div className="text-textSubtle">Total Revenue</div>
          <div className="text-xl font-mono font-semibold">{fmtDollars(totalRevenue)}</div>
        </div>
        <div>
          <div className="text-textSubtle">Orders</div>
          <div className="text-xl font-mono font-semibold">{totalOrders}</div>
        </div>
        {totalOrders > 0 && (
          <div>
            <div className="text-textSubtle">Avg. Order</div>
            <div className="text-xl font-mono font-semibold">{fmtDollars(Math.round(totalRevenue / totalOrders))}</div>
          </div>
        )}
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full rounded" style={{ maxHeight: 220 }}>
        {gridLines.map(({ y, label }) => (
          <g key={y}>
            <line x1={PAD.left} y1={y} x2={W - PAD.right} y2={y} stroke="#e5e7eb" strokeWidth="1" />
            <text x={PAD.left - 6} y={y + 4} textAnchor="end" fontSize="11" fill="#9ca3af">{label}</text>
          </g>
        ))}
        <polygon points={areaPoints} fill="#3b82f6" opacity="0.08" />
        <polyline fill="none" stroke="#3b82f6" strokeWidth="2.5" points={polyPoints} strokeLinejoin="round" />
        {data.map((d, i) => (
          <circle key={i} cx={xOf(i)} cy={yOf(Number(d.total_cents))} r="3.5" fill="#3b82f6" stroke="white" strokeWidth="1.5" />
        ))}
        {labelIdxs.map((idx) => {
          const d = data[idx];
          const label = new Date(d.day).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          return (
            <text key={idx} x={xOf(idx)} y={H - 6} textAnchor="middle" fontSize="11" fill="#9ca3af">{label}</text>
          );
        })}
      </svg>
    </div>
  );
}

function ProductsChart({ data }: { data: ProductSale[]; days: DayOption }) {
  if (!data.length) {
    return <p className="text-textSubtle text-sm py-8 text-center">No product sales in this period.</p>;
  }
  const maxQty = Math.max(...data.map((d) => Number(d.total_quantity)), 1);
  return (
    <div className="space-y-4">
      {data.map((row) => {
        const qty = Number(row.total_quantity);
        const name = productNameMap[row.product_id] || `Product #${row.product_id}`;
        return (
          <div key={row.product_id}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{name}</span>
              <span className="text-textSubtle font-mono">
                {qty} unit{qty !== 1 ? 's' : ''} &middot; {row.order_count} order{Number(row.order_count) !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${(qty / maxQty) * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function CitiesChart({ data }: { data: CitySale[]; days: DayOption }) {
  if (!data.length) {
    return <p className="text-textSubtle text-sm py-8 text-center">No location data in this period.</p>;
  }
  const maxOrders = Math.max(...data.map((d) => Number(d.order_count)), 1);
  return (
    <div className="space-y-4">
      {data.map((row, i) => {
        const orders = Number(row.order_count);
        const location = [row.city, row.country].filter(Boolean).join(', ') || 'Unknown';
        return (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1">
              <span className="font-medium">{location}</span>
              <span className="text-textSubtle font-mono">
                {orders} order{orders !== 1 ? 's' : ''} &middot; {fmtDollars(Number(row.total_cents))}
              </span>
            </div>
            <div className="h-2 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 rounded-full transition-all duration-500" style={{ width: `${(orders / maxOrders) * 100}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function SalesGraph() {
  const [days, setDays] = useState<DayOption>(30);
  const [view, setView] = useState<ViewOption>('revenue');
  const [salesData, setSalesData] = useState<SaleDay[]>([]);
  const [productData, setProductData] = useState<ProductSale[]>([]);
  const [cityData, setCityData] = useState<CitySale[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const _days = days; // suppress unused warning for days prop in charts

  useEffect(() => {
    setLoading(true);
    setError('');
    const endpoint =
      view === 'revenue'
        ? `/api/admin/orders/sales?days=${days}`
        : view === 'products'
        ? `/api/admin/orders/sales/by-product?days=${days}`
        : `/api/admin/orders/sales/by-city?days=${days}`;
    fetch(`${apiBaseUrl}${endpoint}`, { credentials: 'include' })
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((d) => {
        if (view === 'revenue') setSalesData(d.sales || []);
        else if (view === 'products') setProductData(d.products || []);
        else setCityData(d.cities || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load analytics data');
        setLoading(false);
      });
  }, [days, view]);

  return (
    <div className="mb-12 bg-surface border border-border rounded-xl p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <h2 className="text-xl font-serif">Sales Analytics</h2>
        <div className="flex flex-wrap gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5 text-sm gap-0.5">
            {(['revenue', 'products', 'cities'] as ViewOption[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${
                  view === v
                    ? 'bg-white text-textMain shadow-sm'
                    : 'text-textSubtle hover:text-textMain'
                }`}
              >
                {v === 'revenue' ? 'Revenue' : v === 'products' ? 'By Product' : 'By Location'}
              </button>
            ))}
          </div>
          <div className="flex bg-gray-100 rounded-lg p-0.5 text-sm gap-0.5">
            {([7, 30, 90, 365] as DayOption[]).map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap ${
                  days === d
                    ? 'bg-white text-textMain shadow-sm'
                    : 'text-textSubtle hover:text-textMain'
                }`}
              >
                {DAY_LABELS[d]}
              </button>
            ))}
          </div>
        </div>
      </div>
      {loading && <div className="h-40 flex items-center justify-center text-textSubtle text-sm">Loading…</div>}
      {!loading && error && <p className="text-red-500 text-sm">{error}</p>}
      {!loading && !error && view === 'revenue' && <RevenueChart data={salesData} days={_days} />}
      {!loading && !error && view === 'products' && <ProductsChart data={productData} days={_days} />}
      {!loading && !error && view === 'cities' && <CitiesChart data={cityData} days={_days} />}
    </div>
  );
}
