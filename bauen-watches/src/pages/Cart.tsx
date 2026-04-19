import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useCart } from '../context/CartContext'

export default function Cart() {
  const { items, removeFromCart, total, clearCart } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <section className="bg-base text-textMain min-h-screen py-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Your cart is empty</h2>
          <Button variant="outline" onClick={() => navigate('/boutique')}>
            Back to shop
          </Button>
        </div>
      </section>
    )
  }

  return (
    <section className="bg-base text-textMain min-h-screen py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-serif mb-8 text-center">My cart</h2>
        <ul className="space-y-6 mb-8">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between items-center">
              <span>
                {item.name} × {item.quantity}
              </span>
              <div className="flex items-center gap-4">
                <span>{(item.price * item.quantity).toFixed(2)} €</span>
                <button
                  className="text-red-500 hover:underline text-sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center mb-8">
          <span className="text-xl font-medium">Total:</span>
          <span className="text-2xl font-serif">{total.toFixed(2)} €</span>
        </div>

        <div className="flex gap-4 justify-center">
          <Button variant="primary" onClick={() => navigate('/checkout')}>
            Passer au paiement
          </Button>
          <Button variant="outline" onClick={clearCart}>
            Vider le panier
          </Button>
        </div>
      </div>
    </section>
  )
}
