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
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/bauen-content/artistic/IMG_6885.jpg"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
          style={{ filter: 'brightness(1.22) contrast(0.95) saturate(1.1) sepia(0.3) hue-rotate(-15deg)' }}
        >
          <source src="/bauen-content/artistic/IMG_6858.mp4" type="video/mp4" />
        </video>
        {/* VHS scan lines */}
        <div
          className="absolute inset-0 pointer-events-none z-[1]"
          style={{
            background: 'repeating-linear-gradient(to bottom, transparent 0px, transparent 2px, rgba(0,0,0,0.07) 2px, rgba(0,0,0,0.07) 4px)',
          }}
        />
        {/* VHS tape grain */}
        <div
          className="absolute inset-0 pointer-events-none z-[2]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E")`,
            backgroundSize: '180px 180px',
            opacity: 0.2,
            mixBlendMode: 'overlay',
            animation: 'vhsGrain 0.25s steps(2) infinite',
          }}
        />
        {/* VHS warm color bleed */}
        <div
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{
            background: 'linear-gradient(160deg, rgba(255,210,80,0.07) 0%, rgba(255,80,30,0.05) 60%, rgba(0,180,200,0.04) 100%)',
            mixBlendMode: 'screen',
          }}
        />
        {/* VHS tracking artifact */}
        <div
          className="absolute left-0 w-full pointer-events-none z-[4]"
          style={{
            height: '6px',
            background: 'linear-gradient(to right, rgba(255,255,255,0.18), rgba(0,220,255,0.12), rgba(255,80,80,0.1), transparent)',
            filter: 'blur(1px)',
            animation: 'vhsTracking 7s linear infinite',
            top: '-20%',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <div className="absolute bottom-16 left-8 md:left-16 z-10 text-white max-w-xl">
          <p className="font-mono text-xs uppercase tracking-widest mb-4 opacity-70">New Arrivals — 2026</p>
          <h1 className="text-5xl md:text-6xl font-serif mb-6 leading-tight">Frames from the streets<br />of LA &amp; Paris.</h1>
          <Link to="/boutique" className="font-mono text-sm uppercase tracking-widest border-b border-white/50 pb-0.5 hover:border-white transition-colors">
            Shop Now →
          </Link>
        </div>
      </section>

      {/* LA Banner */}
      <section className="relative w-full h-[75vh] min-h-[500px] overflow-hidden">
        <img
          src="/bauen-content/artistic/IMG_5862.jpg"
          alt="LA"
          className="absolute inset-0 w-full h-full object-cover object-[center_40%]"
          style={{ filter: 'brightness(0.82) contrast(1.08) saturate(1.25)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
        <div className="absolute bottom-12 left-8 md:left-16 z-10 text-white">
          <p className="font-mono text-sm uppercase tracking-widest mb-4 opacity-90">Pacific Collection</p>
          <Link to="/pacific-collection" className="font-mono text-xs uppercase tracking-widest border-b border-white/50 pb-0.5 hover:border-white transition-colors">
            Discover →
          </Link>
        </div>
      </section>

      {/* Paris Collection Banner */}
      <section className="relative w-full h-[75vh] min-h-[500px] overflow-hidden">
        <img
          src="/bauen-content/artistic/IMG_6880.jpg"
          alt="Paris Collection"
          className="absolute inset-0 w-full h-full object-cover object-[center_30%]"
          style={{ filter: 'brightness(0.85)' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/5 to-transparent" />
        <div className="absolute bottom-12 right-8 md:right-16 z-10 text-white text-right">
          <p className="font-mono text-sm uppercase tracking-widest mb-4 opacity-90">La Collection Parisienne</p>
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

      {/* Big wordmark + footer */}
      <div className="w-full overflow-hidden border-t border-border pt-10 select-none">
        <p
          className="text-center font-serif leading-none tracking-tighter text-textMain whitespace-nowrap"
          style={{ fontSize: 'clamp(5rem, 22vw, 20rem)', opacity: 0.08 }}
        >
          BAUEN
        </p>
        <div className="flex flex-wrap justify-center gap-x-8 gap-y-2 pb-10 -mt-4 px-6">
          <Link to="/terms" className="font-mono text-xs uppercase tracking-widest text-textSubtle hover:text-textMain transition-colors">Terms of Service</Link>
          <Link to="/privacy" className="font-mono text-xs uppercase tracking-widest text-textSubtle hover:text-textMain transition-colors">Privacy Policy</Link>
          <Link to="/returns" className="font-mono text-xs uppercase tracking-widest text-textSubtle hover:text-textMain transition-colors">Returns & Refunds</Link>
          <Link to="/contact" className="font-mono text-xs uppercase tracking-widest text-textSubtle hover:text-textMain transition-colors">Contact</Link>
          <span className="font-mono text-xs uppercase tracking-widest text-textSubtle/50">© 2026 Bauen</span>
        </div>
      </div>

    </div>
  )
}
