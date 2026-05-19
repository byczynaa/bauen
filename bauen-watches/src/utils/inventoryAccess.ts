export const INVENTORY_ACCESS_KEY = 'bauen_inventory_access'

export function hasInventoryAccess() {
  if (typeof window === 'undefined') {
    return false
  }
  return window.sessionStorage.getItem(INVENTORY_ACCESS_KEY) === 'granted'
}

export function grantInventoryAccess() {
  if (typeof window === 'undefined') {
    return
  }
  window.sessionStorage.setItem(INVENTORY_ACCESS_KEY, 'granted')
}

export function revokeInventoryAccess() {
  if (typeof window === 'undefined') {
    return
  }
  window.sessionStorage.removeItem(INVENTORY_ACCESS_KEY)
}
