import WatchCard from '../components/WatchCard'
import ShopBanner from '../components/ShopBanner'
import { frames } from '../data/frames'

const watches = [
  {
    id: 1,
    name: 'Abysse',
    price: 329,
    image: '/images/blue00.jpeg',
    description: 'Plongez dans les profondeurs avec Abysse. Cette collection marine incarne la sérénité des abysses avec ses teintes bleues captivantes et son mécanisme précis. Chaque montre est une porte ouverte sur l\'océan infini.',
    images: ['/images/blue00.jpeg', '/images/blue01.jpeg', '/images/blue02.jpeg', '/images/blue03.jpeg'],
  },
  {
    id: 2,
    name: 'Labeur',
    price: 319,
    image: '/images/brown00.jpeg',
    description: 'Labeur célèbre le travail, la persévérance et l\'excellence. Avec ses nuances chaudes et rustiques, cette collection incarne l\'esprit artisanal. Une montre pour ceux qui créent et construisent avec passion.',
    images: ['/images/brown00.jpeg', '/images/brown01.jpeg'],
  },
  ...frames.map((frame, idx) => ({
    id: 100 + idx,
    name: frame.title,
    price: 299 + idx * 10,
    image: frame.images[0],
    description: frame.description,
    images: frame.images,
  })),
]

export default function Boutique() {
  return (
    <section className="bg-base text-textMain min-h-screen">
      <ShopBanner />
      <div className="py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-serif mb-10 text-center text-textMain">
            Notre Collection
          </h2>
          <p className="text-center text-textSubtle mb-16 max-w-2xl mx-auto leading-relaxed">
            Découvrez nos modèles raffinés, alliant tradition horlogère et design contemporain.
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
