import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import {
  getInventoryItems,
  resetInventory,
  setProductStock,
  type InventoryItem,
} from '../utils/inventory'
import { revokeInventoryAccess } from '../utils/inventoryAccess'

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
  const [items, setItems] = useState<InventoryItem[]>(() => getInventoryItems())
  const [query, setQuery] = useState('')

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) {
      return items
    }

    return items.filter((item) => item.name.toLowerCase().includes(q) || String(item.id).includes(q))
  }, [items, query])

  const totalStock = items.reduce((sum, item) => sum + item.stock, 0)

  const updateStock = (id: number, nextStock: number) => {
    setProductStock(id, nextStock)
    setItems(getInventoryItems())
  }

  const handleReset = () => {
    resetInventory()
    setItems(getInventoryItems())
  }

  const handleLock = () => {
    revokeInventoryAccess()
    navigate('/')
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
        </div>

        <div className="bg-surface border border-border rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-5 py-3 border-b border-border text-xs uppercase tracking-wide text-textSubtle">
            <div className="col-span-2">ID</div>
            <div className="col-span-4">Product</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-4">Stock</div>
          </div>

          {filteredItems.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-4 px-5 py-4 border-b border-border/70 last:border-b-0 items-center">
              <div className="col-span-2 text-sm">{item.id}</div>
              <div className="col-span-4 font-medium">{item.name}</div>
              <div className="col-span-2">
                <StockBadge stock={item.stock} />
              </div>
              <div className="col-span-4 flex items-center gap-2">
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
