import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface WatchCardProps {
  id: number
  name: string
  price: number
  image: string
  images?: string[]
}

export default function WatchCard({ id, name, price, image, images = [] }: WatchCardProps) {
  const navigate = useNavigate()
  const [currentImage, setCurrentImage] = useState(image)

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
      className="group cursor-pointer transform transition-all duration-500 ease-out hover:scale-105 hover:-translate-y-2 hover:shadow-2xl rounded-2xl"
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Product Image */}
      <div className="relative overflow-hidden rounded-2xl mb-6 bg-gray-50 shadow-lg group-hover:shadow-xl transition-shadow duration-500">
        <img
          src={currentImage}
          alt={name}
          className="w-full h-96 object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out rounded-2xl"
        />
      </div>

      {/* Product Info */}
      <div className="space-y-2 text-center">
        <h3 className="text-xl font-serif text-textMain tracking-wide leading-tight">
          {name}
        </h3>
        <p className="text-base text-textSubtle font-medium">
          €{price}
        </p>
      </div>
    </div>
  )
}
