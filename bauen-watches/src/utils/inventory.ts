export interface InventoryItem {
  id: number
  name: string
  stock: number
}

export interface PurchaseItem {
  id: number
  quantity: number
}

const STORAGE_KEY = 'bauen_inventory_v1'
const DEFAULT_STOCK = 25

const INVENTORY_CATALOG = [
  { id: 1, name: 'Abysse' },
  { id: 2, name: 'Chance' },
  { id: 101, name: 'Drift' },
  { id: 102, name: 'Glow' },
  { id: 201, name: 'Ruelles' },
  { id: 202, name: 'Sway' },
  { id: 203, name: 'Roam' },
  { id: 204, name: 'Impasse' },
  { id: 207, name: 'Boulevard' },
]

type InventoryMap = Record<number, number>

function createDefaultInventoryMap(): InventoryMap {
  const map: InventoryMap = {}
  for (const product of INVENTORY_CATALOG) {
    map[product.id] = DEFAULT_STOCK
  }
  return map
}

function hasWindow() {
  return typeof window !== 'undefined'
}

export function readInventoryMap(): InventoryMap {
  const defaults = createDefaultInventoryMap()

  if (!hasWindow()) {
    return defaults
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return defaults
    }

    const parsed = JSON.parse(raw) as Record<string, unknown>
    const merged: InventoryMap = { ...defaults }

    for (const [key, value] of Object.entries(parsed)) {
      const id = Number(key)
      if (!Number.isInteger(id) || !(id in merged)) {
        continue
      }

      const stock = Number(value)
      merged[id] = Number.isFinite(stock) && stock >= 0 ? Math.floor(stock) : merged[id]
    }

    return merged
  } catch {
    return defaults
  }
}

export function writeInventoryMap(map: InventoryMap) {
  if (!hasWindow()) {
    return
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(map))
}

export function getInventoryItems(): InventoryItem[] {
  const stockMap = readInventoryMap()
  return INVENTORY_CATALOG.map((product) => ({
    id: product.id,
    name: product.name,
    stock: stockMap[product.id] ?? DEFAULT_STOCK,
  }))
}

export function setProductStock(id: number, stock: number) {
  const map = readInventoryMap()
  if (!(id in map)) {
    return
  }

  map[id] = Math.max(0, Math.floor(stock))
  writeInventoryMap(map)
}

export function decrementInventoryFromOrder(items: PurchaseItem[]) {
  const map = readInventoryMap()

  for (const item of items) {
    if (!(item.id in map)) {
      continue
    }

    const qty = Number.isFinite(item.quantity) ? Math.max(0, Math.floor(item.quantity)) : 0
    map[item.id] = Math.max(0, (map[item.id] ?? DEFAULT_STOCK) - qty)
  }

  writeInventoryMap(map)
}

export function resetInventory() {
  writeInventoryMap(createDefaultInventoryMap())
}
