import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { grantInventoryAccess } from '../utils/inventoryAccess'

export default function InventoryLogin() {
  const navigate = useNavigate()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const expectedPasscode = import.meta.env.VITE_INVENTORY_PASSCODE

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!expectedPasscode) {
      setError('Inventory passcode is not configured. Add VITE_INVENTORY_PASSCODE in .env.')
      return
    }

    if (passcode.trim() !== expectedPasscode) {
      setError('Invalid passcode.')
      return
    }

    grantInventoryAccess()
    navigate('/inventory')
  }

  return (
    <section className="bg-base text-textMain min-h-screen py-24 px-6 flex items-center justify-center">
      <div className="max-w-md w-full bg-surface border border-border rounded-lg p-8">
        <h1 className="text-3xl font-serif mb-3">Inventory Access</h1>
        <p className="text-textSubtle text-sm mb-8">
          Enter your admin passcode to open Inventory Management.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="inventory-passcode" className="block text-sm mb-2">Admin Passcode</label>
            <input
              id="inventory-passcode"
              type="password"
              value={passcode}
              onChange={(e) => {
                setPasscode(e.target.value)
                if (error) {
                  setError(null)
                }
              }}
              className="w-full border border-border bg-white rounded px-3 py-2 text-sm"
              placeholder="Enter passcode"
              autoComplete="off"
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <div className="flex gap-3">
            <Button variant="primary">Unlock</Button>
            <Button variant="outline" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}
