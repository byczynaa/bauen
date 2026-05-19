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
      <nav className="w-full flex justify-center pt-8 pb-4">
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


      {/* Editorial Campaign Moment - Model Closeup */}
      <div className="h-24 sm:h-32 md:h-40 lg:h-48" /> {/* Intentional vertical space above */}
      <section className="relative w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[60vh] min-h-[380px] max-h-[700px] overflow-hidden flex items-center p-0 m-0">
        <img
          src="/bauen-content/artistic/Model%20closeup%201.jpg"
          alt="Model closeup - Pacific Collection"
          className="absolute inset-0 w-full h-full"
          style={{
            objectFit: 'cover',
            objectPosition: '60% center',
            transform: 'scale(0.92)',
            transition: 'transform 1s cubic-bezier(0.4,0,0.2,1)'
          }}
        />
        {/* Subtle dark gradient for text contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent pointer-events-none"></div>
        <div
          className="absolute left-0 w-full flex"
          style={{
            top: '65%',
            justifyContent: 'flex-start',
            pointerEvents: 'none',
          }}
        >
          <span
            className="ml-8 md:ml-16 text-[2.2rem] md:text-5xl font-serif font-normal tracking-tight select-none text-left"
            style={{
              color: '#F5F5F5',
              textShadow: '0px 2px 8px rgba(0,0,0,0.4)',
              background: 'rgba(0,0,0,0.01)',
              padding: '0.1em 0.5em',
              borderRadius: '0.2em',
              userSelect: 'none',
              maxWidth: 'min(90vw, 600px)',
            }}
          >
            Worn your way.
          </span>
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
