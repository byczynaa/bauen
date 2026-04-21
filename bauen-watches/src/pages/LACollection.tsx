import WatchCard from '../components/WatchCard'
import Button from '../components/Button'

// New Pacific Collection frames using unused models
const laProducts = [
  {
    id: 101,
    name: 'Drift',
    price: 359,
    image: '/bauen-content/frame01/IMG_2811.jpeg',
    description: 'A frame inspired by movement and freedom, with a design that flows like the Pacific tides.',
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
    id: 202,
    name: 'Sway',
    price: 339,
    image: '/bauen-content/frame04/IMG_2893.jpeg',
    description: 'Sway is for those who move with the breeze—light, effortless, and always in motion.',
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
    description: 'Roam captures the rhythm and energy of the coast, with contours that echo the ocean’s pulse.',
    images: [
      '/bauen-content/frame02/IMG_2815.jpeg',
      '/bauen-content/frame02/IMG_2816.jpeg',
      '/bauen-content/frame02/IMG_2817.jpeg',
    ],
  },
];

export default function LACollection() {
  return (
    <div className="text-textMain">
      {/* Hero Section with Lifestyle Image */}
      <section className="relative h-[90vh] flex items-end justify-center overflow-hidden pb-16">
        <img
          src="/bauen-content/artistic/Cafemodel.JPEG"
          alt="LA lifestyle"
          className="absolute inset-0 w-full h-full object-cover transform scale-105 group-hover:scale-110 transition-transform duration-[2000ms] ease-out"
        />
        {/* Stronger gradient overlay for readability */}
        <div className="absolute inset-0 pointer-events-none" style={{background: 'linear-gradient(to top, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.18) 40%, rgba(0,0,0,0) 100%)'}}></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6 flex flex-col items-center justify-end w-full" style={{minHeight: '60vh'}}>
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-serif mb-4 text-white tracking-tight leading-none" style={{textShadow: '0px 2px 10px rgba(0,0,0,0.5)'}}>
            Pacific Collection
          </h1>
          <p
            className="text-2xl md:text-3xl leading-tight max-w-3xl mx-auto font-light tracking-wide mb-2 md:mb-0"
            style={{
              color: '#F5F5F5',
              textShadow: '0px 2px 10px rgba(0,0,0,0.5)',
              marginTop: '2.5rem',
              marginBottom: '0',
              position: 'relative',
              left: '0',
              maxWidth: '90%',
            }}
          >
            For endless days and sunlit hours.
          </p>
        </div>
      </section>

      {/* Editorial Break - Tagline Section */}
      <section className="bg-surface py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-textMain">
            California Dream
          </h2>
          <p className="text-[1.15rem] md:text-[1.25rem] text-[#232323] leading-[1.65] max-w-2xl mx-auto" style={{color:'#232323', lineHeight:1.65}}>
            Defined by warmth, movement, and a calm appreciation of the everyday—capturing a carefree sense of ease, expression, and the understated energy of life on the coast.
          </p>
        </div>
      </section>

      {/* Products Section - Original Responsive Grid */}
      <section className="bg-base py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif mb-6">
              The Collection
            </h2>
            <p className="text-xl text-textSubtle leading-relaxed max-w-2xl mx-auto">
              Four frames, worn your way.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {laProducts.map(product => (
              <div className="group" key={product.id}>
                <a href={`/product/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <WatchCard {...product} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Break - Full Width Image */}
      <section className="relative h-[50vh] overflow-hidden">
        <img
          src="/bauen-content/frame04/IMG_2893.jpeg"
          alt="Pacific Coast landscape"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20"></div>
      </section>

      {/* CTA Section */}
      <section className="bg-surface py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-serif mb-6">Find Your California Style</h3>
          <p className="text-lg text-textSubtle mb-10 max-w-2xl mx-auto leading-relaxed">
            Customize your perfect frame with our Configurator. Create eyewear that embodies the LA spirit.
          </p>
          <Button variant="primary" className="px-8 py-4 text-lg">Start Customizing</Button>
        </div>
      </section>
    </div>
  )
}
