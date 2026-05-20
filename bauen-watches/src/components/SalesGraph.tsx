import { useEffect, useState } from 'react';
import { apiBaseUrl } from '../utils/api';

export default function SalesGraph() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${apiBaseUrl}/api/admin/orders/sales`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => {
        setSales(d.sales || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load sales data');
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="mb-8">Loading sales graph...</div>;
  if (error) return <div className="mb-8 text-red-600">{error}</div>;
  if (!sales.length) return <div className="mb-8">No sales data available.</div>;

  // Simple SVG line graph (no external chart lib)
  const max = Math.max(...sales.map((s) => Number(s.total_cents)));
  const width = 600;
  const height = 180;
  const points = sales.map((s, i) => {
    const x = (i / (sales.length - 1)) * (width - 40) + 20;
    const y = height - 20 - (Number(s.total_cents) / max) * (height - 40);
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-serif mb-4">Sales (Last 60 Days)</h2>
      <svg width={width} height={height} className="bg-surface border border-border rounded">
        <polyline
          fill="none"
          stroke="#2563eb"
          strokeWidth="3"
          points={points}
        />
        {/* X-axis */}
        <line x1="20" y1={height - 20} x2={width - 20} y2={height - 20} stroke="#ccc" />
        {/* Y-axis */}
        <line x1="20" y1="20" x2="20" y2={height - 20} stroke="#ccc" />
        {/* Labels */}
        <text x="24" y="32" fontSize="12" fill="#888">${(max / 100).toFixed(0)}</text>
        <text x="24" y={height - 24} fontSize="12" fill="#888">$0</text>
      </svg>
    </div>
  );
}
