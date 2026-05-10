import { useEffect, useState } from 'react'
import { apiBaseUrl } from './api'

export interface PublicInventoryItem {
  id: number
  stock: number
  inStock: boolean
}

export function toInventoryMap(items: PublicInventoryItem[]) {
  return items.reduce<Record<number, PublicInventoryItem>>((map, item) => {
    map[item.id] = item
    return map
  }, {})
}

export function usePublicInventory() {
  const [items, setItems] = useState<PublicInventoryItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadInventory = async () => {
    try {
      const response = await fetch(`${apiBaseUrl}/api/inventory/public`)
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

  return { items, loading, error, refresh: loadInventory }
}