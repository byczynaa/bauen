import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-textMain text-white">
      <div className="max-w-6xl mx-auto px-8 pt-16 pb-10">
        <nav className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs uppercase tracking-widest text-white/50 mb-14">
          <Link to="/boutique" className="hover:text-white transition-colors">Shop</Link>
          <Link to="/paris" className="hover:text-white transition-colors">Paris</Link>
          <Link to="/pacific-collection" className="hover:text-white transition-colors">Pacific</Link>
          <Link to="/a-propos" className="hover:text-white transition-colors">About</Link>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
          <Link to="/returns" className="hover:text-white transition-colors">Returns</Link>
        </nav>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <p className="font-mono text-xs text-white/30 uppercase tracking-widest">
            © {new Date().getFullYear()} Bauen — The art of precision.
          </p>
          <p className="font-mono text-xs text-white/20 max-w-sm text-right">
            Frames intended for fashion and optical use. Prescription lenses by a licensed optician.
          </p>
        </div>
      </div>
      {/* Oversized wordmark */}
      <div className="overflow-hidden">
        <p
          className="font-serif leading-none text-white/[0.06] select-none text-center"
          style={{ fontSize: 'clamp(80px, 18vw, 240px)', paddingBottom: '0.05em' }}
        >
          BAUEN
        </p>
      </div>
    </footer>
  )
}
