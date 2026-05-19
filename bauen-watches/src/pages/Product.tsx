import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Button from '../components/Button'
import { useCart } from '../context/CartContext'
import { getProductById } from '../data/products'
import { toInventoryMap, usePublicInventory } from '../utils/publicInventory'

export default function Product() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart, items } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const { items: inventoryItems, loading: inventoryLoading } = usePublicInventory()
  const inventoryMap = toInventoryMap(inventoryItems)
  const product = getProductById(parseInt(id || '0'))
  const stock = product ? inventoryMap[product.id]?.stock : undefined
  const inCartQuantity = items.find((item) => item.id === product?.id)?.quantity ?? 0
  const availableToAdd = typeof stock === 'number' ? Math.max(0, stock - inCartQuantity) : null
  const isOutOfStock = typeof stock === 'number' && stock <= 0

  // Navigation functions
  const goToNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product!.images.length)
  }

  const goToPrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product!.images.length) % product!.images.length)
  }

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        goToPrevImage()
      } else if (e.key === 'ArrowRight') {
        goToNextImage()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [product])

  if (!product) {
    return (
      <section className="bg-base text-textMain min-h-screen py-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Product not found</h2>
          <Button variant="outline" onClick={() => navigate('/boutique')}>
            Back to shop
          </Button>
        </div>
      </section>
    )
  }

  return (
    <div className="bg-base text-textMain">
      {/* Product layout: left images, right info */}
      <section className="max-w-6xl mx-auto py-20 px-6 flex flex-col md:flex-row gap-12">
        {/* images column */}
        <div className="md:w-1/2 relative">
          {/* Desktop: Vertical thumbnail sidebar */}
          <div className="hidden md:flex md:flex-col gap-3 mr-6 absolute left-0 top-0 h-full overflow-y-auto">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                  currentImageIndex === index
                    ? 'border-accent shadow-lg scale-105'
                    : 'border-border hover:border-accent/70 hover:shadow-md'
                }`}
                aria-label={`View ${product.name} image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          {/* Main image container */}
          <div className="md:ml-24 relative group">
            <div className="relative overflow-hidden rounded-lg shadow-lg">
              <img
                src={product.images[currentImageIndex]}
                alt={`${product.name} - view ${currentImageIndex + 1}`}
                className="w-full h-auto object-cover transition-opacity duration-300"
              />

              {/* Overlay navigation arrows - only show on hover/focus */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={goToPrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-textMain rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>

                  <button
                    onClick={goToNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-textMain rounded-full p-2 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-accent"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}

              {/* Image counter */}
              <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {product.images.length}
              </div>
            </div>
          </div>

          {/* Mobile: Horizontal thumbnail row below image */}
          <div className="md:hidden mt-4 flex gap-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentImageIndex(index)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2 ${
                  currentImageIndex === index
                    ? 'border-accent shadow-lg scale-105'
                    : 'border-border hover:border-accent/70 hover:shadow-md'
                }`}
                aria-label={`View ${product.name} image ${index + 1}`}
              >
                <img
                  src={image}
                  alt={`${product.name} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* information column */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-serif mb-4">{product.name}</h1>
          <p className="text-2xl text-accent font-light mb-6">{product.price} €</p>
          <p className={`mb-3 text-sm uppercase tracking-wide ${isOutOfStock ? 'text-red-700' : 'text-green-700'}`}>
            {inventoryLoading
              ? 'Checking availability...'
              : isOutOfStock
                ? 'Out of stock'
                : typeof stock === 'number'
                  ? `${stock} in stock`
                  : 'Availability unavailable'}
          </p>
          {availableToAdd === 0 && !isOutOfStock && (
            <p className="mb-3 text-sm text-orange-700">You already have the remaining stock in your cart.</p>
          )}
          <p className="text-textSubtle mb-6">{product.description}</p>

          {/* Features */}
          <div className="mb-12">
            <h3 className="text-xl font-serif mb-4">Features</h3>
            <ul className="text-textSubtle space-y-2 text-sm">
              <li>✓ High-quality acetate and metal materials</li>
              <li>✓ Compatible with prescription lenses</li>
              <li>✓ Beautiful unique colors</li>
              <li>✓ Lightweight and comfortable design</li>
              <li>✓ UV protection coating</li>
              <li>✓ 2-year warranty</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="flex gap-6 mb-12">
            <Button
              variant="primary"
              type="button"
              disabled={inventoryLoading || isOutOfStock || availableToAdd === 0}
              onClick={() => {
                addToCart({ id: product.id, name: product.name, price: product.price, image: product.image })
                setAddedToCart(true)
                setTimeout(() => setAddedToCart(false), 2000)
              }}
            >
              {isOutOfStock ? 'Out of stock' : addedToCart ? '✓ Added to cart' : 'Add to cart'}
            </Button>
            <Button variant="outline" type="button" onClick={() => navigate('/cart')}>
              View cart
            </Button>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-4xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div>
            <h3 className="text-xl font-serif mb-4">Features</h3>
            <ul className="text-textSubtle space-y-2 text-sm">
              <li>✓ High-quality acetate and metal materials</li>
              <li>✓ Compatible with prescription lenses</li>
              <li>✓ Beautiful unique colors</li>
              <li>✓ Lightweight and comfortable design</li>
              <li>✓ UV protection coating</li>
              <li>✓ 2-year warranty</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
