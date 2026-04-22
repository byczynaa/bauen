import WatchCard from '../components/WatchCard'
import Button from '../components/Button'

// Refined Pacific Collection frames (short, minimal descriptions)
const laProducts = [
  {
    id: 101,
    name: 'Drift',
    price: 359,
    image: '/bauen-content/frame01/IMG_2811.jpeg',
    description: 'Movement, uninterrupted.',
    images: [
      '/bauen-content/frame01/IMG_2811.jpeg',
      '/bauen-content/frame01/IMG_2812.jpeg',
      '/bauen-content/frame01/IMG_2813.jpeg',
    ],
  },
  {
    id: 102,
    name: 'Glow',
    price: 359,
    image: '/bauen-content/frame06/IMG_4518.jpeg',
    description: 'Soft light, subtle shine.',
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
    id: 202,
    name: 'Sway',
    price: 339,
    image: '/bauen-content/frame04/IMG_2893.jpeg',
    description: 'Effortless, always in motion.',
    images: [
      '/bauen-content/frame04/IMG_2893.jpeg',
      '/bauen-content/frame04/IMG_2895.jpeg',
      '/bauen-content/frame04/IMG_2896.jpeg',
      '/bauen-content/frame04/IMG_2898.jpeg',
      '/bauen-content/frame04/IMG_2899.jpeg',
      '/bauen-content/frame04/IMG_2900.jpeg',
      '/bauen-content/frame04/IMG_2903.jpeg',
    ],
  },
  {
    id: 203,
    name: 'Roam',
    price: 329,
    image: '/bauen-content/frame02/IMG_2815.jpeg',
    description: 'Contours in rhythm.',
    images: [
      '/bauen-content/frame02/IMG_2815.jpeg',
      '/bauen-content/frame02/IMG_2816.jpeg',
      '/bauen-content/frame02/IMG_2817.jpeg',
    ],
  },
];

import { Link } from 'react-router-dom'

export default function LACollection() {
  return (
    <div className="bg-base text-textMain min-h-screen">
      {/* Optional: Minimal Collection Navigation */}
      <nav cxlassName="w-full flex justify-center pt-8 pb-4">
        <div className="flex gap-8 text-sm font-serif text-textSubtle">
          <Link to="/paris" className="hover:text-accent transition">Paris</Link>
          <span className="text-accent">Pacific</span>
        </div>
      </nav>

      {/* Hero Section with Lifestyle Image */}
      <section className="relative h-[70vh] flex items-end justify-center overflow-hidden pb-12">
        <img
          src="/bauen-content/artistic/Cafemodel.JPEG"
          alt="LA lifestyle"
          className="absolute inset-0 w-full h-full object-cover scale-105 transition-transform duration-[2000ms] ease-out"
        />
        {/* Subtle gradient overlay for readability */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/40 via-black/10 to-transparent"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 flex flex-col items-center justify-end w-full min-h-[50vh]">
          <h1 className="text-5xl md:text-6xl font-serif mb-3 text-white tracking-tight leading-none drop-shadow-lg">
            Pacific Collection
          </h1>
          <p className="text-xl md:text-2xl font-light text-white/90 tracking-wide mb-0 mt-2 max-w-2xl mx-auto drop-shadow">
            Sunlit, understated, always in motion.
          </p>
        </div>
      </section>

      {/* Editorial Break - Tagline Section */}
      <section className="bg-surface py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-serif mb-5 text-textMain">
            California, reimagined
          </h2>
          <p className="text-base md:text-lg text-textSubtle leading-relaxed max-w-2xl mx-auto">
            Warmth, movement, and a calm appreciation of the everyday—capturing a sense of ease and the quiet energy of life on the coast.
          </p>
        </div>
      </section>

      {/* Products Section - 2 Column Responsive Grid */}
      <section className="bg-base py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-serif mb-4">
              The Collection
            </h2>
            <p className="text-lg text-textSubtle leading-relaxed max-w-2xl mx-auto">
              Four frames, worn your way.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-14">
            {laProducts.map(product => (
              <div className="group" key={product.id}>
                <Link to={`/product/${product.id}`} className="block no-underline text-inherit">
                  <WatchCard {...product} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Break - Editorial Lifestyle Image */}
      <section className="relative h-[44vh] overflow-hidden">
        <img
          src="/bauen-content/artistic/Cafemodel.JPEG"
          alt="Pacific mood"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
      </section>

      {/* CTA Section hidden until Configurator is ready */}
      {/* <section className="bg-surface py-20 px-6 text-center">
        <div className="max-w-3xl mx-auto">
          <h3 className="text-2xl md:text-3xl font-serif mb-5">Made to be worn your way</h3>
          <p className="text-base text-textSubtle mb-8 max-w-xl mx-auto leading-relaxed">
            Configure your own. Minimal, intentional, yours.
          </p>
          <Button variant="primary" className="px-8 py-4 text-lg">Start Customizing</Button>
        </div>
      </section> */}
    </div>
  )
}
