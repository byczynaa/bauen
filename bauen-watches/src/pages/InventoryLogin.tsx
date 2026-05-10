import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { apiBaseUrl } from '../utils/api'

export default function InventoryLogin() {
  const navigate = useNavigate()
  const [passcode, setPasscode] = useState('')
  const [error, setError] = useState<string | null>(null)

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`${apiBaseUrl}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ passcode }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Unable to sign in')
      }

      navigate('/inventory')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to sign in')
    } finally {
      setLoading(false)
    }
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
            <Button variant="primary" type="submit">Unlock</Button>
            <Button variant="outline" type="button" onClick={() => navigate('/')}>
              Cancel
            </Button>
          </div>

          {loading && <div className="text-textSubtle text-sm">Signing in...</div>}
        </form>
      </div>
    </section>
  )
}
