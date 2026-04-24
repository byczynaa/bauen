import CityBanner from '../components/CityBanner'
import Button from '../components/Button'
import { artisticPieces } from '../data/frames'

export default function Home() {
  return (
    <div className="bg-base text-textMain">
      {/* Bandeau double Los Angeles / Paris */}
      <CityBanner />

      {/* Section slogan */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6">
        <h1 className="text-5xl font-serif mb-6 tracking-tight">
          Elegance on your eyes
        </h1>
        <p className="max-w-xl text-textSubtle mb-12 leading-relaxed">
          Eyewear crafted between Los Angeles and Paris: the union of
          craftsmanship and creativity.
        </p>
        <div className="flex gap-6">
          <Button variant="outline">Discover the collection</Button>
          <Button variant="primary">Create your own</Button>
        </div>
      </section>

      {/* Pacific Collection Editorial Section */}
      <section className="relative w-[100vw] left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] h-[54vh] min-h-[320px] max-h-[600px] flex items-center justify-center overflow-hidden mb-24">
        <img
          src="/bauen-content/artistic/Deck%20shot%201.jpg"
          alt="Pacific Collection deck shot"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.93) contrast(1.04)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/5 to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-6">
          <h2 className="text-4xl md:text-5xl font-serif mb-3 text-[#F5F5F5] drop-shadow-lg tracking-tight">Pacific Collection</h2>
          <p className="text-lg md:text-2xl text-[#F5F5F5] font-light mb-8 drop-shadow" style={{textShadow:'0 2px 8px rgba(0,0,0,0.32)'}}>For endless days and sunlit hours.</p>
          <a
              href="/pacific-collection"
            className="inline-block text-base font-serif text-[#F5F5F5] border-b border-[#F5F5F5]/40 hover:border-accent hover:text-accent transition px-2 pb-1 drop-shadow"
            style={{textShadow:'0 2px 8px rgba(0,0,0,0.32)'}}
          >
            View Collection
          </a>
        </div>
      </section>

      {/* Artistic Gallery */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-4xl font-serif mb-4 text-center">Craftsmanship</h2>
        <p className="text-center text-textSubtle mb-16 max-w-2xl mx-auto">
          Explore the techniques and processes that transform raw materials into optical artistry and timeless eyewear.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artisticPieces.map((piece) => (
            <div key={piece.id} className="group overflow-hidden rounded-lg">
              <div className="relative overflow-hidden h-96 mb-4">
                <img
                  src={piece.image}
                  alt={piece.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h3 className="text-2xl font-serif mb-2">{piece.title}</h3>
              <p className="text-accent text-sm uppercase tracking-widest mb-3">{piece.technique}</p>
              <p className="text-textSubtle leading-relaxed text-sm">{piece.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
