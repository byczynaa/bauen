import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '../context/CartContext'
import Button from '../components/Button'

// Remplace par ta clé publique Stripe
const stripePromise = loadStripe('VITE_STRIPE_PUBLIC_KEY_REMOVED')

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
      setError('Stripe est en cours de chargement...')
      return
    }

    setLoading(true)
    setError(null)

    const cardElement = elements.getElement(CardElement)

    try {
      // Appel à ton backend pour créer le PaymentIntent
      const response = await fetch('http://localhost:4242/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(total * 100), // Stripe utilise les centimes
          items,
        }),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du paiement')
      }

      const { clientSecret } = await response.json()

      // Confirme le paiement côté client
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
          billing_details: {
            name: 'Customer',
          },
        },
      })

      if (result.error) {
        setError(result.error.message || 'Erreur de paiement')
      } else if (result.paymentIntent?.status === 'succeeded') {
        setSuccess(true)
        clearCart()
        setTimeout(() => {
          navigate('/boutique')
        }, 2000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <section className="bg-base text-textMain min-h-screen py-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Votre panier est vide</h2>
          <Button variant="outline" onClick={() => navigate('/boutique')}>
            Retour à la boutique
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-base text-textMain min-h-screen py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-4xl font-serif mb-10 text-center">Paiement sécurisé</h2>

        {/* Résumé du panier */}
        <div className="bg-surface border border-border rounded-lg p-6 mb-8">
          <h3 className="text-xl font-serif mb-6">Résumé de la commande</h3>
          {items.map((item) => (
            <div key={item.id} className="flex justify-between mb-4 text-textSubtle">
              <span>
                {item.name} × {item.quantity}
              </span>
              <span>{(item.price * item.quantity).toFixed(2)} €</span>
            </div>
          ))}
          <div className="border-t border-border mt-6 pt-6 flex justify-between font-serif text-lg">
            <span>Total :</span>
            <span>{total.toFixed(2)} €</span>
          </div>
        </div>

        {/* Formulaire Stripe */}
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-lg p-8">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">Carte bancaire</label>
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
            <div className="text-green-500 mb-4 text-sm">Paiement réussi ! Redirection...</div>
          )}

          <div className="flex gap-4">
            <Button variant="primary" disabled={!stripe || loading}>
              {loading ? 'Traitement...' : `Payer ${total.toFixed(2)} €`}
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/boutique')}
              disabled={loading}
            >
              Annuler
            </Button>
          </div>
        </form>

        <p className="text-textSubtle text-sm mt-8 text-center">
          Ceci est un formulaire de test. Utilise la carte 4242 4242 4242 4242 pour tester.
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
