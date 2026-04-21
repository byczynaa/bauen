
import WatchCard from '../components/WatchCard';
import Button from '../components/Button';

const parisProducts = [
  {
    id: 201, // Sunset Boulevard
    name: 'Ruelles',
    price: 349,
    image: '/bauen-content/frame03/IMG_2880.jpeg',
    description: `The ruelle is the part of Paris tourists miss. Narrow, deliberate, unannounced—a passage that rewards the ones who actually look. These frames carry that same energy: nothing decorative, nothing accidental. Just clean black architecture sitting flush against the bone.`,
    images: [
      '/bauen-content/frame03/IMG_2880.jpeg',
      '/bauen-content/frame03/IMG_2881.jpeg',
      '/bauen-content/frame03/IMG_2884.jpeg',
      '/bauen-content/frame03/IMG_2885.jpeg',
      '/bauen-content/frame03/IMG_2888.jpeg',
    ],
  },
  {
    id: 204, // Desert Rose
    name: 'Impasse',
    price: 329,
    image: '/bauen-content/frame07/IMG_4493.jpeg',
    description: `A dead-end isn't a failure of direction. In Paris, it's a destination. The impasse is where the city stops performing and starts existing: quiet, self-contained, indifferent to through-traffic. These frames don't ask for your attention. They simply have it.`,
    images: ['/bauen-content/frame07/IMG_4493.jpeg', '/bauen-content/frame07/IMG_4495.jpeg', '/bauen-content/frame07/IMG_4498.jpeg', '/bauen-content/frame07/IMG_4499.jpeg'],
  },
  {
    id: 207, // Venice
    name: 'Boulevard',
    price: 349,
    image: '/bauen-content/frame05/IMG_4503.jpeg',
    description: `The one frame that holds two cities at once. The Haussmannian rigor of the 6th and the loose, sun-cut confidence of West Hollywood. Not a compromise between the two. What happens when both cities agree on what looks good. Black, structured, made for movement.`,
    images: ['/bauen-content/frame05/IMG_4503.jpeg', '/bauen-content/frame05/sunnymodelpic1.JPEG', '/bauen-content/frame05/IMG_4504.jpeg', '/bauen-content/frame05/IMG_4506.jpeg', '/bauen-content/frame05/IMG_4510.jpeg', '/bauen-content/frame05/IMG_4511.jpeg', '/bauen-content/frame05/sunnymodelpic2.JPEG', '/bauen-content/frame05/sunnymodelpic3.JPEG'],
  },
];

export default function Paris() {
  return (
    <div className="text-textMain">
      {/* Hero Section with Lifestyle Image */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80"
          alt="Paris"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <h1 className="relative text-5xl md:text-6xl font-serif text-white tracking-wide">
          Paris Collection
        </h1>
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
                <WatchCard {...product} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-surface py-24 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-4xl font-serif mb-6">Find Your Parisian Style</h3>
          <p className="text-lg text-textSubtle mb-10 max-w-2xl mx-auto leading-relaxed">
            Customize your perfect frame with our Configurator. Create eyewear that embodies the Paris spirit.
          </p>
          <Button variant="primary" className="px-8 py-4 text-lg">Start Customizing</Button>
        </div>
      </section>
    </div>
  );
}
