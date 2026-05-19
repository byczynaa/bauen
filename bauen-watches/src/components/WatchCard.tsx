import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface WatchCardProps {
  id: number
  name: string
  price: number
  image: string
  images?: string[]
  stock?: number
}

export default function WatchCard({ id, name, price, image, images = [], stock }: WatchCardProps) {
  const navigate = useNavigate()
  const [currentImage, setCurrentImage] = useState(image)
  const isOutOfStock = stock === 0

  const handleClick = () => {
    navigate(`/product/${id}`)
  }

  const handleMouseEnter = () => {
    // Swap to second image if available
    if (images.length > 1) {
      setCurrentImage(images[1])
    }
  }

  const handleMouseLeave = () => {
    // Revert to first image
    setCurrentImage(image)
  }

  return (
    <div
      className="group cursor-pointer transition-all duration-500 ease-out hover:scale-[1.025] hover:shadow-xl rounded-3xl bg-surface p-6 flex flex-col gap-6"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Product Image - Large, Editorial */}
      <div className="relative overflow-hidden rounded-2xl aspect-[4/5] bg-base flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow duration-500">
        {isOutOfStock && (
          <div className="absolute left-4 top-4 z-10 rounded-full bg-red-700 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
            Out of stock
          </div>
        )}
        <img
          src={currentImage}
          alt={name}
          className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-700 ease-out"
        />
      </div>

      {/* Product Info - Minimal, Editorial */}
      <div className="flex flex-col items-center gap-1 text-center">
        <h3 className="text-lg md:text-xl font-serif text-textMain tracking-wide leading-tight mb-1">
          {name}
        </h3>
        <p className="text-base text-textSubtle font-normal mb-1">
          ${price.toFixed(2)}
        </p>
        {typeof stock === 'number' && !isOutOfStock && stock <= 3 && (
          <p className="text-xs uppercase tracking-wide text-orange-700">Only {stock} left</p>
        )}
        {isOutOfStock && (
          <p className="text-xs uppercase tracking-wide text-red-700">Unavailable</p>
        )}
        {/* Optional: Show description if present */}
        {typeof (images as any).description === 'string' ? null : null}
      </div>
    </div>
  )
}
