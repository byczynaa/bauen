import { Navigate } from 'react-router-dom'
import { hasInventoryAccess } from '../utils/inventoryAccess'

export default function InventoryGuard({ children }: { children: React.ReactNode }) {
  if (!hasInventoryAccess()) {
    return <Navigate to="/inventory-login" replace />
  }

  return <>{children}</>
}
