import WatchCard from '../components/WatchCard'
import Button from '../components/Button'

const laProducts = [
  {
    id: 201,
    name: 'Sunset Boulevard',
    price: 349,
    image: '/images/blue00.jpeg',
    description: 'Inspired by the golden hour over Los Angeles, Sunset Boulevard captures the vibrant warmth of California sunsets. With warm amber tones and sleek modern frames, this piece celebrates LA\'s iconic style.',
    images: ['/images/blue00.jpeg', '/images/blue01.jpeg', '/images/blue02.jpeg'],
  },
  {
    id: 202,
    name: 'Pacific Dreams',
    price: 339,
    image: '/images/blue01.jpeg',
    description: 'Feel the ocean breeze with Pacific Dreams. This collection draws inspiration from LA\'s stunning coastline with cool ocean blues and minimalist design. Perfect for those who embrace the California beach lifestyle.',
    images: ['/images/blue01.jpeg', '/images/blue02.jpeg', '/images/blue03.jpeg'],
  },
  {
    id: 203,
    name: 'City Lights',
    price: 359,
    image: '/images/brown00.jpeg',
    description: 'Experience the magic of LA\'s vibrant nightlife with City Lights. Bold frames and sophisticated styling make this collection perfect for those who own the night. Symbol of LA\'s creative energy.',
    images: ['/images/brown00.jpeg', '/images/brown01.jpeg'],
  },
  {
    id: 204,
    name: 'Desert Rose',
    price: 329,
    image: '/bauen-content/frame07/IMG_4493.jpeg',
    description: 'Blend the warm desert landscape with modern elegance. Desert Rose combines earthy tones with contemporary design, capturing the essence of LA\'s diverse natural beauty.',
    images: ['/bauen-content/frame07/IMG_4493.jpeg', '/bauen-content/frame07/IMG_4495.jpeg', '/bauen-content/frame07/IMG_4498.jpeg', '/bauen-content/frame07/IMG_4499.jpeg'],
  },
  {
    id: 207,
    name: 'Venice',
    price: 349,
    image: '/bauen-content/frame05/IMG_4503.jpeg',
    description: 'Capture the bohemian spirit of Venice Beach with Venice sunglasses. These modern shades embody the eclectic, artistic vibe of LA\'s iconic beach community with vibrant colors and free-spirited design. Featuring a subtle red glow that becomes clear in the California sun.',
    images: ['/bauen-content/frame05/IMG_4503.jpeg', '/bauen-content/frame05/sunnymodelpic1.JPEG', '/bauen-content/frame05/IMG_4504.jpeg', '/bauen-content/frame05/IMG_4506.jpeg', '/bauen-content/frame05/IMG_4510.jpeg', '/bauen-content/frame05/IMG_4511.jpeg', '/bauen-content/frame05/sunnymodelpic2.JPEG', '/bauen-content/frame05/sunnymodelpic3.JPEG'],
  },
]

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
        <div className="absolute inset-0 bg-black/25"></div>
        <div className="relative z-10 max-w-5xl mx-auto text-center px-6">
          <h1 className="text-7xl md:text-8xl lg:text-9xl font-serif mb-4 text-white tracking-tight leading-none">
            Pacific Collection
          </h1>
          <p className="text-2xl md:text-3xl text-white/90 leading-tight max-w-3xl mx-auto font-light tracking-wide">
            Eyewear for Los Angeles living.
          </p>
        </div>
      </section>

      {/* Editorial Break - Tagline Section */}
      <section className="bg-surface py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif mb-6 text-textMain">
            California Dream
          </h2>
          <p className="text-lg text-textSubtle leading-relaxed max-w-2xl mx-auto">
            From Venice Beach boardwalks to Hollywood Hills sunsets, each frame captures the essence of LA living.
          </p>
        </div>
      </section>

      {/* Products Section */}
      <section className="bg-base py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif mb-6">
              The Collection
            </h2>
            <p className="text-xl text-textSubtle leading-relaxed max-w-2xl mx-auto">
              Seven frames, seven stories of California life.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {laProducts.map((product) => (
              <div key={product.id} className="group">
                <WatchCard {...product} />
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
