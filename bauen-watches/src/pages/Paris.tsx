
import WatchCard from '../components/WatchCard';
import Button from '../components/Button';
import { getProductsByIds, parisProductIds } from '../data/products';
import { toInventoryMap, usePublicInventory } from '../utils/publicInventory';

export default function Paris() {
  const parisProducts = getProductsByIds(parisProductIds)
  const { items } = usePublicInventory()
  const inventoryMap = toInventoryMap(items)

  return (
    <div className="text-textMain">
      {/* Hero Section with Lifestyle Image */}
      <section className="relative h-[90vh] flex items-end justify-start overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/bauen-content/artistic/IMG_6885.jpg"
          className="absolute inset-0 w-full h-full object-cover object-center"
        >
          <source src="/bauen-content/artistic/IMG_6906.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
        <div className="relative z-10 pb-16 pl-8 md:pl-16 max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest mb-4 text-white/70">Paris Collection — 2026</p>
          <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight mb-6">
            Precision from<br />the 6th arrondissement.
          </h1>
        </div>
      </section>

      {/* Editorial Break - Tagline Section */}
      <section className="max-w-4xl mx-auto py-24 px-6 text-center">
        <h2 className="text-3xl font-serif mb-6">
          The Paris Collection : Bauen
        </h2>
        <p className="text-textSubtle leading-relaxed mb-12">
          There is a particular kind of beauty that does not announce itself. It lives in the mineral grey of a cut-stone building at seven in the morning, in the negative space between a balcony railing and the sky behind it. Paris is not a city that decorates. It is a city that structures, and in that structure finds something closer to art than most art does. The Paris Collection was built inside that understanding. Black frames, each one a study in restraint, each one carrying the geometry of a city that has spent centuries learning what to keep and what to leave out. To wear them is not to reference Paris. It is to think the way Paris thinks: with intention, with economy, with the quiet confidence of something that does not need to explain itself.
        </p>
        <Button variant="outline">Discover the Paris collection</Button>
      </section>

      {/* Products Section */}
      <section className="bg-base py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-serif mb-6">
              The Collection
            </h2>
            <p className="text-xl text-textSubtle leading-relaxed max-w-2xl mx-auto">
              Three frames, three stories of Parisian life.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {parisProducts.map((product) => (
              <div key={product.id} className="group">
                <WatchCard {...product} stock={inventoryMap[product.id]?.stock} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section hidden until Configurator is ready */}
      {/* <section className="bg-surface py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-serif mb-6">Find Your Parisian Style</h3>
          <p className="text-lg text-textSubtle mb-10 max-w-2xl mx-auto leading-relaxed">
            Customize your perfect frame with our Configurator. Create eyewear that embodies the Paris spirit.
          </p>
          <Button variant="primary" className="px-8 py-4 text-lg">Start Customizing</Button>
        </div>
      </section> */}

      {/* Editorial Duo — new Paris model campaign shots */}
      <section className="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] flex gap-1 h-[80vh] min-h-[500px] overflow-hidden">
        <div className="relative flex-1 overflow-hidden group">
          <img
            src="/bauen-content/artistic/IMG_6884.jpg"
            alt="Paris Collection — arch"
            className="absolute inset-0 w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent pointer-events-none" />
          <div className="absolute bottom-8 left-8 z-10">
            <span className="text-2xl md:text-4xl font-serif text-white drop-shadow-lg">Worn in the city.</span>
          </div>
        </div>
        <div className="relative flex-1 overflow-hidden group">
          <img
            src="/bauen-content/artistic/IMG_6857.jpg"
            alt="Paris Collection — street"
            className="absolute inset-0 w-full h-full object-cover object-[center_20%] transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent pointer-events-none" />
          <div className="absolute bottom-8 right-8 z-10 text-right">
            <span className="text-2xl md:text-4xl font-serif text-white drop-shadow-lg">Built for Paris.</span>
          </div>
        </div>
      </section>

      {/* Full-width campaign image */}
      <section className="relative w-full h-[75vh] min-h-[480px] overflow-hidden">
        <img
          src="/bauen-content/artistic/IMG_6851.jpg"
          alt="Paris Collection — campaign"
          className="absolute inset-0 w-full h-full object-cover object-[center_15%]"
          style={{ filter: 'brightness(0.9)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-8 md:left-16 z-10 text-white max-w-md">
          <p className="font-mono text-xs uppercase tracking-widest mb-3 opacity-60">The Paris Collection</p>
          <h2 className="text-3xl md:text-4xl font-serif leading-tight">Every detail,<br />considered.</h2>
        </div>
      </section>
    </div>
  );
}
