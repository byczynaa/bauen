import WatchCard from '../components/WatchCard'
import ShopBanner from '../components/ShopBanner'

const watches = [
  {
    id: 1,
    name: 'Abysse',
    price: 329,
    image: '/bauen-content/frame01/IMG_2811.jpeg',
    description: 'Dive into the depths with Abysse. This marine collection embodies the serenity of the abyss with its captivating blue tones and precise craftsmanship. Each frame opens a window to the infinite ocean.',
    images: ['/bauen-content/frame01/IMG_2811.jpeg', '/bauen-content/frame01/IMG_2812.jpeg', '/bauen-content/frame01/IMG_2813.jpeg'],
  },
  {
    id: 2,
    name: 'Labeur',
    price: 319,
    image: '/bauen-content/frame02/IMG_2815.jpeg',
    description: 'Labeur celebrates work, perseverance and excellence. With its warm and rustic nuances, this collection embodies the artisanal spirit. A frame for those who create and build with passion.',
    images: ['/bauen-content/frame02/IMG_2815.jpeg', '/bauen-content/frame02/IMG_2816.jpeg', '/bauen-content/frame02/IMG_2817.jpeg'],
  },
  {
    id: 201,
    name: 'Sunset Boulevard',
    price: 349,
    image: '/bauen-content/frame03/IMG_2880.jpeg',
    description: 'Inspired by the golden hour over Los Angeles, Sunset Boulevard captures the vibrant warmth of California sunsets. With warm amber tones and sleek modern frames, this piece celebrates LA\'s iconic style.',
    images: ['/bauen-content/frame03/IMG_2880.jpeg', '/bauen-content/frame03/IMG_2881.jpeg', '/bauen-content/frame03/IMG_2884.jpeg', '/bauen-content/frame03/IMG_2885.jpeg', '/bauen-content/frame03/IMG_2888.jpeg'],
  },
  {
    id: 202,
    name: 'Pacific Dreams',
    price: 339,
    image: '/bauen-content/frame04/IMG_2893.jpeg',
    description: 'Feel the ocean breeze with Pacific Dreams. This collection draws inspiration from LA\'s stunning coastline with cool ocean blues and minimalist design. Perfect for those who embrace the California beach lifestyle.',
    images: ['/bauen-content/frame04/IMG_2893.jpeg', '/bauen-content/frame04/IMG_2895.jpeg', '/bauen-content/frame04/IMG_2896.jpeg', '/bauen-content/frame04/IMG_2898.jpeg', '/bauen-content/frame04/IMG_2899.jpeg', '/bauen-content/frame04/IMG_2900.jpeg', '/bauen-content/frame04/IMG_2903.jpeg'],
  },
  {
    id: 203,
    name: 'City Lights',
    price: 359,
    image: '/bauen-content/frame06/IMG_4518.jpeg',
    description: 'Experience the magic of LA\'s vibrant nightlife with City Lights. Bold frames and sophisticated styling make this collection perfect for those who own the night. Symbol of LA\'s creative energy.',
    images: ['/bauen-content/frame06/IMG_4518.jpeg', '/bauen-content/frame06/IMG_4519.jpeg', '/bauen-content/frame06/IMG_4520.jpeg', '/bauen-content/frame06/IMG_4521.jpeg', '/bauen-content/frame06/IMG_4522.jpeg', '/bauen-content/frame06/IMG_4525.jpeg', '/bauen-content/frame06/IMG_4526.jpeg'],
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

export default function Boutique() {
  return (
    <section className="bg-base text-textMain min-h-screen">
      <ShopBanner />
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif mb-10 text-center text-textMain">
            Our Collection
          </h2>
          <p className="text-center text-textSubtle mb-16 max-w-2xl mx-auto leading-relaxed">
            Discover our refined eyewear models, combining timeless craftsmanship with contemporary design.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {watches.map((w) => (
              <WatchCard key={w.id} {...w} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
