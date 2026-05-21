import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { apiBaseUrl } from '../utils/api'

interface InventoryItem {
  id: number
  name: string
  stock: number
  previewImage?: string
}

function StockBadge({ stock }: { stock: number }) {
  if (stock <= 2) {
    return <span className="text-red-600 text-xs uppercase tracking-wide">Critical</span>
  }
  if (stock <= 8) {
    return <span className="text-orange-600 text-xs uppercase tracking-wide">Low</span>
  }
  return <span className="text-green-700 text-xs uppercase tracking-wide">Healthy</span>
}

export default function InventoryManagement() {
  const navigate = useNavigate()
  const [items, setItems] = useState<InventoryItem[]>([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadInventory = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/inventory`, {
        credentials: 'include',
      })

      if (response.status === 401) {
        navigate('/admin-login')
        return
      }

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Unable to load inventory')
      }

      const body = await response.json()
      setItems(Array.isArray(body.items) ? body.items : [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load inventory')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadInventory()
  }, [])

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return items
    }

    return items.filter((item) => item.name.toLowerCase().includes(q) || String(item.id).includes(q))
  }, [items, query])

  const totalStock = items.reduce((sum, item) => sum + item.stock, 0)
  const lowStockItems = items.filter((item) => item.stock <= 5)

  const updateStock = async (id: number, nextStock: number) => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/inventory/stock`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ id, stock: nextStock }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Unable to update stock')
      }

      setItems((prev) => prev.map((item) => (
        item.id === id ? { ...item, stock: Math.max(0, Math.floor(nextStock)) } : item
      )))
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update stock')
    }
  }

  const handleReset = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/inventory/reset`, {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Unable to reset inventory')
      }

      const body = await response.json()
      setItems(Array.isArray(body.items) ? body.items : [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to reset inventory')
    }
  }

  const handleLock = async () => {
    await fetch(`${apiBaseUrl}/api/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => null)
    navigate('/')
  }

  if (loading) {
    return (
      <section className="bg-base text-textMain min-h-screen py-24 px-6 flex items-center justify-center">
        <p className="text-textSubtle">Loading inventory...</p>
      </section>
    )
  }

  return (
    <section className="bg-base text-textMain min-h-screen py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-serif mb-2">Inventory Management</h1>
            <p className="text-textSubtle">Track stock levels and update quantities in real time.</p>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="text-sm text-textSubtle border border-border rounded px-3 py-2">
              Total Units: <span className="text-textMain font-medium">{totalStock}</span>
            </div>
            <Button variant="outline" onClick={handleLock}>Lock & Exit</Button>
            <Button variant="outline" onClick={handleReset}>Reset Stock</Button>
          </div>
        </div>

        <div className="mb-6">
          <label htmlFor="inventory-search" className="block text-sm mb-2">Search Product</label>
          <input
            id="inventory-search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type product name or ID"
            className="w-full md:w-96 border border-border bg-white rounded px-3 py-2 text-sm"
          />
          {error && <p className="text-red-600 text-sm mt-3">{error}</p>}
        </div>

        {lowStockItems.length > 0 && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-lg px-5 py-4">
            <p className="text-sm font-medium text-amber-800 mb-2">
              ⚠ {lowStockItems.length} product{lowStockItems.length > 1 ? 's' : ''} running low
            </p>
            <ul className="flex flex-wrap gap-2">
              {lowStockItems.map((item) => (
                <li key={item.id} className="text-xs bg-white border border-amber-200 rounded px-2 py-1 text-amber-900">
                  {item.name} — <span className={item.stock <= 2 ? 'text-red-600 font-semibold' : 'text-amber-700'}>{item.stock} left</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border text-xs uppercase tracking-wide text-textSubtle">
            <div className="col-span-1">Image</div>
            <div className="col-span-1">ID</div>
            <div className="col-span-3">Product</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-5">Stock</div>
          </div>

          {filteredItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border/70 last:border-b-0 items-center">
              <div className="col-span-1">
                {item.previewImage && (
                  <img 
                    src={item.previewImage} 
                    alt={item.name}
                    className="w-12 h-12 object-cover rounded border border-border"
                  />
                )}
              </div>
              <div className="col-span-1 text-sm">{item.id}</div>
              <div className="col-span-3 font-medium">{item.name}</div>
              <div className="col-span-2">
                <StockBadge stock={item.stock} />
              </div>
              <div className="col-span-5 flex items-center gap-2">
                <button
                  className="border border-border rounded px-3 py-1 text-sm"
                  onClick={() => updateStock(item.id, item.stock - 1)}
                  aria-label={`Decrease stock for ${item.name}`}
                >
                  -
                </button>
                <input
                  type="number"
                  min={0}
                  value={item.stock}
                  onChange={(e) => updateStock(item.id, Number(e.target.value))}
                  className="w-20 border border-border bg-white rounded px-2 py-1 text-sm text-center"
                  aria-label={`Stock for ${item.name}`}
                />
                <button
                  className="border border-border rounded px-3 py-1 text-sm"
                  onClick={() => updateStock(item.id, item.stock + 1)}
                  aria-label={`Increase stock for ${item.name}`}
                >
                  +
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="px-5 py-10 text-center text-textSubtle">No products match your search.</div>
          )}
        </div>
      </div>
    </section>
  )
}
