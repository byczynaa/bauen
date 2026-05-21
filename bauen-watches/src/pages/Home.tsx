import { Link } from 'react-router-dom'
import { artisticPieces } from '../data/frames'

export default function Home() {
  return (
    <div className="bg-base text-textMain">

      {/* Announcement Bar */}
      <div className="bg-[#EDE5D5] text-textMain text-xs font-mono uppercase tracking-widest text-center py-2.5 px-4">
        Free shipping on orders over $150 · 2-year warranty · Easy returns
      </div>

      {/* Hero — full viewport */}
      <section className="relative w-full h-screen overflow-hidden">
        <img
          src="/bauen-content/artistic/close%20deck%20shot%201.jpg"
          alt="Bauen eyewear lifestyle"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-16 left-8 md:left-16 z-10 text-white max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest mb-4 opacity-70">New Arrivals — 2026</p>
          <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">Frames for the streets<br />of LA &amp; Paris.</h1>
          <Link to="/boutique" className="font-mono text-sm uppercase tracking-widest border-b border-white/50 pb-0.5 hover:border-white transition-colors">
            Shop Now →
          </Link>
        </div>
      </section>

      {/* Pacific Collection Banner */}
      <section className="relative w-full h-[75vh] min-h-[500px] overflow-hidden">
        <img
          src="/bauen-content/artistic/IMG_5679.jpg"
          alt="Pacific Collection"
          className="absolute inset-0 w-full h-full object-cover object-center"
          style={{ filter: 'brightness(0.88)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
        <div className="absolute bottom-12 left-8 md:left-16 z-10 text-white">
          <p className="font-mono text-xs uppercase tracking-widest mb-3 opacity-60">The Pacific Collection</p>
          <h2 className="text-4xl md:text-5xl font-serif mb-5 leading-tight">Endless days,<br />sunlit frames.</h2>
          <Link to="/pacific-collection" className="font-mono text-xs uppercase tracking-widest border-b border-white/50 pb-0.5 hover:border-white transition-colors">
            Discover →
          </Link>
        </div>
      </section>

      {/* Paris Collection Banner */}
      <section className="relative w-full h-[75vh] min-h-[500px] overflow-hidden">
        <img
          src="/bauen-content/artistic/IMG_5704.jpg"
          alt="Paris Collection"
          className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
          style={{ filter: 'brightness(0.85)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
        <div className="absolute bottom-12 right-8 md:right-16 z-10 text-white text-right">
          <p className="font-mono text-xs uppercase tracking-widest mb-3 opacity-60">The Paris Collection</p>
          <h2 className="text-4xl md:text-5xl font-serif mb-5 leading-tight">Precision from<br />the 6th arrondissement.</h2>
          <Link to="/paris" className="font-mono text-xs uppercase tracking-widest border-b border-white/50 pb-0.5 hover:border-white transition-colors">
            Discover →
          </Link>
        </div>
      </section>

      {/* Craftsmanship */}
      <section className="max-w-6xl mx-auto py-28 px-6">
        <p className="font-mono text-xs uppercase tracking-widest text-textSubtle mb-4 text-center">Our Process</p>
        <h2 className="text-4xl font-serif mb-4 text-center">Craftsmanship</h2>
        <p className="text-center text-textSubtle mb-16 max-w-2xl mx-auto leading-relaxed text-sm">
          From raw acetate to finished frame — the techniques and processes behind every Bauen piece.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {artisticPieces.map((piece) => (
            <div key={piece.id} className="group overflow-hidden">
              <div className="relative overflow-hidden aspect-[3/4] mb-5">
                <img
                  src={piece.image}
                  alt={piece.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <p className="font-mono text-xs uppercase tracking-widest text-textSubtle mb-2">{piece.technique}</p>
              <h3 className="text-xl font-serif mb-2">{piece.title}</h3>
              <p className="text-textSubtle leading-relaxed text-sm">{piece.description}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}
