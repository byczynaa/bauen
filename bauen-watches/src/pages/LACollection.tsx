import WatchCard from '../components/WatchCard'
import Button from '../components/Button'
import { getProductsByIds, pacificProductIds } from '../data/products'
import { toInventoryMap, usePublicInventory } from '../utils/publicInventory'

import { Link } from 'react-router-dom'

export default function LACollection() {
  const laProducts = getProductsByIds(pacificProductIds)
  const { items } = usePublicInventory()
  const inventoryMap = toInventoryMap(items)

  return (
    <div className="bg-base text-textMain min-h-screen">
      {/* Optional: Minimal Collection Navigation */}
      <nav className="w-full flex justify-center pt-24 pb-4">
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
                  <WatchCard {...product} stock={inventoryMap[product.id]?.stock} />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>


      {/* Editorial Duo — two contrasting campaign shots */}
      <div className="h-16 sm:h-20" />
      <section className="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex gap-1 h-[75vh] min-h-[460px] max-h-[820px] overflow-hidden">
        {/* Left panel — warm / grassy / close-up */}
        <div className="relative flex-1 overflow-hidden group">
          <img
            src="/bauen-content/artistic/IMG_5941.jpg"
            alt="Pacific Collection — sunlit"
            className="absolute inset-0 w-full h-full object-cover object-[center_45%] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent pointer-events-none" />
          <div className="absolute bottom-8 left-8 z-10">
            <span className="text-2xl md:text-4xl font-serif text-white drop-shadow-lg">Worn your way.</span>
          </div>
        </div>
        {/* Right panel — cool / waterfront / standing */}
        <div className="relative flex-1 overflow-hidden group">
          <img
            src="/bauen-content/artistic/IMG_5811.jpg"
            alt="Pacific Collection — waterfront"
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent pointer-events-none" />
          <div className="absolute bottom-8 right-8 z-10 text-right">
            <span className="text-2xl md:text-4xl font-serif text-white drop-shadow-lg">Always in motion.</span>
          </div>
        </div>
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
