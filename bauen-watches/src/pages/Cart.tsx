import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import { useCart } from '../context/CartContext'
import { toInventoryMap, usePublicInventory } from '../utils/publicInventory'

export default function Cart() {
  const { items, updateQuantity, removeFromCart, total, clearCart } = useCart()
  const navigate = useNavigate()
  const { items: inventoryItems, loading: inventoryLoading } = usePublicInventory()
  const inventoryMap = toInventoryMap(inventoryItems)
  const unavailableItems = items.filter((item) => {
    const stock = inventoryMap[item.id]?.stock
    return typeof stock === 'number' && stock < item.quantity
  })
  const checkoutBlocked = unavailableItems.length > 0

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
        {checkoutBlocked && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            One or more items in your cart are no longer available in the selected quantity. Adjust your cart before checkout.
          </div>
        )}
        <ul className="space-y-6 mb-8">
          {items.map((item) => (
            <li key={item.id} className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-14 h-14 object-cover rounded-lg border border-border bg-white" />
                <div>
                  <span className="font-serif text-base">{item.name} × {item.quantity}</span>
                  {typeof inventoryMap[item.id]?.stock === 'number' && inventoryMap[item.id].stock < item.quantity && (
                    <p className="mt-1 text-sm text-red-600">
                      Only {inventoryMap[item.id].stock} left in stock.
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    className="h-8 w-8 rounded border border-border text-sm disabled:opacity-50"
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    aria-label={`Decrease quantity for ${item.name}`}
                  >
                    -
                  </button>
                  <span className="min-w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    className="h-8 w-8 rounded border border-border text-sm disabled:opacity-50"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    aria-label={`Increase quantity for ${item.name}`}
                    disabled={inventoryLoading || (typeof inventoryMap[item.id]?.stock === 'number' && item.quantity >= inventoryMap[item.id].stock)}
                  >
                    +
                  </button>
                </div>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button
                  className="text-red-500 hover:underline text-sm"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>

        <div className="flex justify-between items-center mb-8">
          <span className="text-xl font-medium">Total:</span>
          <span className="text-2xl font-serif">${total.toFixed(2)}</span>
        </div>

        <div className="flex gap-4 justify-center">
          <Button
            variant="primary"
            type="button"
            onClick={() => navigate('/checkout')}
            disabled={inventoryLoading || checkoutBlocked}
          >
            {checkoutBlocked ? 'Unavailable items in cart' : 'Proceed to Checkout'}
          </Button>
          <Button variant="outline" type="button" onClick={clearCart}>
            Empty Cart
          </Button>
        </div>
      </div>
    </section>
  )
}
