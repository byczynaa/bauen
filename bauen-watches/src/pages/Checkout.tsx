import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import Button from '../components/Button'
import { decrementInventoryFromOrder } from '../utils/inventory'

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)
const apiBaseUrl = import.meta.env.VITE_API_URL ?? 'http://localhost:4242'
const isTestMode = import.meta.env.VITE_STRIPE_PUBLIC_KEY?.startsWith('pk_test_')

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { items, total, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

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

      const { clientSecret } = await response.json()

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
        setError(result.error.message || 'Payment error')
      } else if (result.paymentIntent?.status === 'succeeded') {
        setSuccess(true)
        decrementInventoryFromOrder(
          items.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
        )
        clearCart()
        navigate('/order-confirmed')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
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

        {/* Order Summary */}
        <div className="bg-surface border border-border rounded-lg p-6 mb-8">
          <h3 className="text-xl font-serif mb-6">Order Summary</h3>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between mb-4 text-textSubtle">
              <span>
                {item.name} × {item.quantity}
              </span>
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
          </div>

          {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

          {success && (
            <div className="text-green-500 mb-4 text-sm">Payment successful! Redirecting...</div>
          )}

          <div className="flex gap-4">
            <Button variant="primary" disabled={!stripe || loading}>
              {loading ? 'Processing...' : `Pay ${total.toFixed(2)} €`}
            </Button>
            <Button
              variant="outline"
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
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  )
}
