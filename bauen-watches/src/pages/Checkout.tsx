import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import Button from '../components/Button'
import { apiBaseUrl } from '../utils/api'
import { toInventoryMap, usePublicInventory } from '../utils/publicInventory'

const stripePublicKey = import.meta.env.VITE_STRIPE_PUBLIC_KEY
const stripePromise = stripePublicKey ? loadStripe(stripePublicKey) : null
const isTestMode = stripePublicKey?.startsWith('pk_test_')

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const { items: inventoryItems, loading: inventoryLoading, refresh } = usePublicInventory()
  const inventoryMap = toInventoryMap(inventoryItems)
  const unavailableItems = items.filter((item) => {
    const stock = inventoryMap[item.id]?.stock
    return typeof stock === 'number' && stock < item.quantity
  })
  const checkoutBlocked = unavailableItems.length > 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (checkoutBlocked) {
      setError('One or more items are no longer available in the selected quantity.')
      return
    }

    if (!stripe || !elements) {
      setError('Stripe is still loading, please try again.')
      return
    }

    setLoading(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)
    if (!cardElement) {
      setError('Card field not found.')
      setLoading(false)
      return
    }

    try {
      // Appel à ton backend pour créer le PaymentIntent
      const response = await fetch(`${apiBaseUrl}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        }),
      })

      if (!response.ok) {
        const body = await response.json().catch(() => null)
        throw new Error(body?.error || 'Failed to create payment')
      }

      const { clientSecret, reservationToken } = await response.json()

      // Confirm payment on the client side
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: 'Customer',
          },
        },
      })

      if (result.error) {
        if (reservationToken) {
          await fetch(`${apiBaseUrl}/api/inventory/release-reservation`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reservationToken }),
          }).catch(() => null)
        }
        setError(result.error.message || 'Payment error')
      } else if (result.paymentIntent?.status === 'succeeded') {
        const decrementResponse = await fetch(`${apiBaseUrl}/api/inventory/decrement-order`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentIntentId: result.paymentIntent.id,
            reservationToken,
          }),
        })

        if (!decrementResponse.ok) {
          const body = await decrementResponse.json().catch(() => null)
          throw new Error(body?.error || 'Payment succeeded, but inventory update failed.')
        }

        setSuccess(true)
        clearCart()
        navigate('/order-confirmed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      await refresh()
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="bg-base text-textMain min-h-screen py-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Your cart is empty</h2>
          <Button variant="outline" onClick={() => navigate('/boutique')}>
            Back to Boutique
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-base text-textMain min-h-screen py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-serif mb-10 text-center">Secure Payment</h2>

        {checkoutBlocked && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            Checkout is blocked because one or more items no longer have enough stock.
          </div>
        )}

        {/* Order Summary */}
        <div className="bg-surface border border-border rounded-lg p-6 mb-8">
          <h3 className="text-xl font-serif mb-6">Order Summary</h3>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between mb-4 text-textSubtle">
              <div>
                <span>
                  {item.name} × {item.quantity}
                </span>
                {typeof inventoryMap[item.id]?.stock === 'number' && inventoryMap[item.id].stock < item.quantity && (
                  <p className="mt-1 text-sm text-red-600">
                    Only {inventoryMap[item.id].stock} left in stock.
                  </p>
                )}
              </div>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t border-border mt-6 pt-6 flex justify-between font-serif text-lg">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        {/* Stripe Form */}
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Credit Card</label>
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#333333',
                    '::placeholder': {
                      color: '#999999',
                    },
                  },
                  invalid: {
                    color: '#ff6b6b',
                  },
                },
              }}
              className="border border-border rounded p-3 bg-white"
            />
            {inventoryLoading && <p className="mt-2 text-sm text-textSubtle">Checking live stock...</p>}
          </div>

          {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

          {success && (
            <div className="text-green-500 mb-4 text-sm">Payment successful! Redirecting...</div>
          )}

          <div className="flex gap-4">
            <Button variant="primary" type="submit" disabled={!stripe || loading || inventoryLoading || checkoutBlocked}>
              {loading ? 'Processing...' : `Pay ${total.toFixed(2)} €`}
            </Button>
            <Button
              variant="outline"
              type="button"
              onClick={() => navigate('/boutique')}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </form>

        <p className="text-textSubtle text-sm mt-8 text-center">
          {isTestMode
            ? 'Test mode active: use card 4242 4242 4242 4242 to test.'
            : 'Live mode active: use a real credit card.'}
        </p>
      </div>
    </section>
  )
}

export default function Checkout() {
  if (!stripePromise) {
    return (
      <section className="bg-base text-textMain min-h-screen py-20 px-6 flex items-center justify-center">
        <div className="max-w-xl text-center">
          <h2 className="text-3xl font-serif mb-4">Checkout unavailable</h2>
          <p className="text-textSubtle mb-6">
            Payments are disabled because VITE_STRIPE_PUBLIC_KEY is not configured.
          </p>
          <Button variant="outline" onClick={() => window.history.back()}>
            Go back
          </Button>
        </div>
      </section>
    )
  }

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}
