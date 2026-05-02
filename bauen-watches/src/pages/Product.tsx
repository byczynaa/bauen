import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import Button from '../components/Button'
import { useCart } from '../context/CartContext'

const watches = [
    {
      id: 101,
      name: 'Drift',
      price: 79.99,
      image: '/bauen-content/frame01/IMG_2811.jpeg',
      description: 'A frame inspired by movement and freedom, with a design that flows like the Pacific tides.',
      images: [
        '/bauen-content/frame01/IMG_2811.jpeg',
        '/bauen-content/frame01/IMG_2812.jpeg',
        '/bauen-content/frame01/IMG_2813.jpeg',
        '/bauen-content/artistic/Blue%20classic%20folded%20straight%20on.jpg',
        '/bauen-content/artistic/Blue%20classic%20hing%20angle.jpg',
        '/bauen-content/artistic/Blue%20classic%20logo%20closeup.jpg',
      ],
    },
    {
      id: 102,
      name: 'Glow',
      price: 79.99,
      image: '/bauen-content/frame06/IMG_4518.jpeg',
      description: 'Glow shines with subtle highlights and a luminous finish, perfect for nights on the coast.',
      images: [
        '/bauen-content/frame06/IMG_4518.jpeg',
        '/bauen-content/frame06/IMG_4519.jpeg',
        '/bauen-content/frame06/IMG_4520.jpeg',
        '/bauen-content/frame06/IMG_4521.jpeg',
        '/bauen-content/frame06/IMG_4522.jpeg',
        '/bauen-content/frame06/IMG_4525.jpeg',
        '/bauen-content/frame06/IMG_4526.jpeg',
      ],
    },
  {
    id: 1,
    name: 'Abysse',
    price: 79.99,
    image: '/bauen-content/frame01/IMG_2811.jpeg',
    description: 'Dive into the depths with Abysse. This marine collection embodies the serenity of the abyss with its captivating blue tones and precise craftsmanship. Each frame opens a window to the infinite ocean.',
    images: ['/bauen-content/frame01/IMG_2811.jpeg', '/bauen-content/frame01/IMG_2812.jpeg', '/bauen-content/frame01/IMG_2813.jpeg'],
  },
  {
    id: 2,
    name: 'Labeur',
    price: 79.99,
    image: '/bauen-content/frame02/IMG_2815.jpeg',
    description: 'Labeur celebrates work, perseverance and excellence. With its warm and rustic nuances, this collection embodies the artisanal spirit. A frame for those who create and build with passion.',
    images: ['/bauen-content/frame02/IMG_2815.jpeg', '/bauen-content/frame02/IMG_2816.jpeg', '/bauen-content/frame02/IMG_2817.jpeg'],
  },
  {
    id: 201,
    name: 'Sunset Boulevard',
    price: 79.99,
    image: '/bauen-content/frame03/IMG_2880.jpeg',
    description: 'Inspired by the golden hour over Los Angeles, Sunset Boulevard captures the vibrant warmth of California sunsets. With warm amber tones and sleek modern frames, this piece celebrates LA\'s iconic style.',
    images: ['/bauen-content/frame03/IMG_2880.jpeg', '/bauen-content/frame03/IMG_2881.jpeg', '/bauen-content/frame03/IMG_2884.jpeg', '/bauen-content/frame03/IMG_2885.jpeg', '/bauen-content/frame03/IMG_2888.jpeg'],
  },
  {
    id: 202,
    name: 'Pacific Dreams',
    price: 79.99,
    image: '/bauen-content/frame04/IMG_2893.jpeg',
    description: 'Feel the ocean breeze with Pacific Dreams. This collection draws inspiration from LA\'s stunning coastline with cool ocean blues and minimalist design. Perfect for those who embrace the California beach lifestyle.',
    images: ['/bauen-content/frame04/IMG_2893.jpeg', '/bauen-content/frame04/IMG_2895.jpeg', '/bauen-content/frame04/IMG_2896.jpeg', '/bauen-content/frame04/IMG_2898.jpeg', '/bauen-content/frame04/IMG_2899.jpeg', '/bauen-content/frame04/IMG_2900.jpeg', '/bauen-content/frame04/IMG_2903.jpeg'],
  },
  {
    id: 203,
    name: 'City Lights',
    price: 79.99,
    image: '/bauen-content/frame06/IMG_4518.jpeg',
    description: 'Experience the magic of LA\'s vibrant nightlife with City Lights. Bold frames and sophisticated styling make this collection perfect for those who own the night. Symbol of LA\'s creative energy.',
    images: ['/bauen-content/frame06/IMG_4518.jpeg', '/bauen-content/frame06/IMG_4519.jpeg', '/bauen-content/frame06/IMG_4520.jpeg', '/bauen-content/frame06/IMG_4521.jpeg', '/bauen-content/frame06/IMG_4522.jpeg', '/bauen-content/frame06/IMG_4525.jpeg', '/bauen-content/frame06/IMG_4526.jpeg'],
  },
  {
    id: 204,
    name: 'Desert Rose',
    price: 79.99,
    image: '/bauen-content/frame07/IMG_4493.jpeg',
    description: 'Blend the warm desert landscape with modern elegance. Desert Rose combines earthy tones with contemporary design, capturing the essence of LA\'s diverse natural beauty.',
    images: ['/bauen-content/frame07/IMG_4493.jpeg', '/bauen-content/frame07/IMG_4495.jpeg', '/bauen-content/frame07/IMG_4498.jpeg', '/bauen-content/frame07/IMG_4499.jpeg'],
  },
  {
    id: 207,
    name: 'Venice',
    price: 79.99,
    image: '/bauen-content/frame05/IMG_4503.jpeg',
    description: 'Capture the bohemian spirit of Venice Beach with Venice sunglasses. These modern shades embody the eclectic, artistic vibe of LA\'s iconic beach community with vibrant colors and free-spirited design. Featuring a subtle red glow that becomes clear in the California sun.',
    images: ['/bauen-content/frame05/IMG_4503.jpeg', '/bauen-content/frame05/sunnymodelpic1.JPEG', '/bauen-content/frame05/IMG_4504.jpeg', '/bauen-content/frame05/IMG_4506.jpeg', '/bauen-content/frame05/IMG_4510.jpeg', '/bauen-content/frame05/IMG_4511.jpeg', '/bauen-content/frame05/sunnymodelpic2.JPEG', '/bauen-content/frame05/sunnymodelpic3.JPEG'],
  },
]

export default function Product() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  let product = watches.find((w) => w.id === parseInt(id || '0'));

  // Paris & Pacific Collection customizations
  if (product) {
    // Paris Collection
    if (product.id === 201) {
      product = {
        ...product,
        name: 'Ruelles',
        description: `The ruelle is the part of Paris tourists miss. Narrow, deliberate, unannounced—a passage that rewards the ones who actually look. These frames carry that same energy: nothing decorative, nothing accidental. Just clean black architecture sitting flush against the bone.`
      };
    } else if (product.id === 204) {
      product = {
        ...product,
        name: 'Impasse',
        description: `A dead-end isn't a failure of direction. In Paris, it's a destination. The impasse is where the city stops performing and starts existing: quiet, self-contained, indifferent to through-traffic. These frames don't ask for your attention. They simply have it.`
      };
    } else if (product.id === 207) {
      product = {
        ...product,
        name: 'Boulevard',
        description: `The one frame that holds two cities at once. The Haussmannian rigor of the 6th and the loose, sun-cut confidence of West Hollywood. Not a compromise between the two. What happens when both cities agree on what looks good. Black, structured, made for movement.`
      };
    }
    // Pacific Collection
    else if (product.id === 101) {
      product = {
        ...product,
        name: 'Drift',
      };
    } else if (product.id === 102) {
      product = {
        ...product,
        name: 'Glow',
      };
    } else if (product.id === 202) {
      product = {
        ...product,
        name: 'Sway',
      };
    } else if (product.id === 203) {
      product = {
        ...product,
        name: 'Roam',
      };
    }
  }

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
              onClick={() => {
                addToCart({ id: product.id, name: product.name, price: product.price })
                setAddedToCart(true)
                setTimeout(() => setAddedToCart(false), 2000)
              }}
            >
              {addedToCart ? '✓ Added to cart' : 'Add to cart'}
            </Button>
            <Button variant="outline" onClick={() => navigate('/cart')}>
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
