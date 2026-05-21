import { useNavigate } from 'react-router-dom'
import { apiBaseUrl } from '../utils/api'

export default function AdminMenu() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await fetch(`${apiBaseUrl}/api/admin/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => null)
    navigate('/admin-login')
  }

  return (
    <section className="bg-base text-textMain min-h-screen py-24 px-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <h1 className="text-4xl font-serif mb-2">Admin</h1>
        <p className="text-textSubtle text-sm mb-10">Select a section to manage.</p>

        <div className="grid gap-4">
          <button
            onClick={() => navigate('/inventory')}
            className="group flex items-center justify-between bg-surface border border-border rounded-lg px-6 py-5 text-left hover:border-textMain transition-colors"
          >
            <div>
              <div className="text-lg font-medium mb-1">Inventory</div>
              <div className="text-sm text-textSubtle">Manage stock, prices and product visibility</div>
            </div>
            <span className="text-textSubtle group-hover:text-textMain transition-colors text-xl">→</span>
          </button>

          <button
            onClick={() => navigate('/admin/orders')}
            className="group flex items-center justify-between bg-surface border border-border rounded-lg px-6 py-5 text-left hover:border-textMain transition-colors"
          >
            <div>
              <div className="text-lg font-medium mb-1">Orders</div>
              <div className="text-sm text-textSubtle">View sales, analytics and order history</div>
            </div>
            <span className="text-textSubtle group-hover:text-textMain transition-colors text-xl">→</span>
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="mt-10 text-sm text-textSubtle hover:text-textMain transition-colors"
        >
          Sign out
        </button>
      </div>
    </section>
  )
}
