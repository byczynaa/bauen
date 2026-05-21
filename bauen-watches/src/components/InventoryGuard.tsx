import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { apiBaseUrl } from '../utils/api'

export default function InventoryGuard({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<'loading' | 'granted' | 'denied'>('loading')

  useEffect(() => {
    let isMounted = true

    const checkSession = async () => {
      try {
        const response = await fetch(`${apiBaseUrl}/api/admin/session`, {
          credentials: 'include',
        })

        if (!response.ok) {
          if (isMounted) {
            setStatus('denied')
          }
          return
        }

        const body = await response.json()
        if (isMounted) {
          setStatus(body.authenticated ? 'granted' : 'denied')
        }
      } catch {
        if (isMounted) {
          setStatus('denied')
        }
      }
    }

    checkSession()
    return () => {
      isMounted = false
    }
  }, [])

  if (status === 'loading') {
    return (
      <section className="bg-base text-textMain min-h-screen py-24 px-6 flex items-center justify-center">
        <p className="text-textSubtle">Checking admin session...</p>
      </section>
    )
  }

  if (status === 'denied') {
    return <Navigate to="/admin-login" replace />
  }

  return <>{children}</>
}
