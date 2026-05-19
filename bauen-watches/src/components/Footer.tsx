import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <p className="text-textSubtle text-sm tracking-wide">
          © {new Date().getFullYear()} Bauen — The art of precision.
        </p>
        <nav className="flex flex-wrap gap-4 text-sm text-textSubtle">
          <Link to="/terms" className="hover:text-textMain transition-colors">Terms</Link>
          <Link to="/privacy" className="hover:text-textMain transition-colors">Privacy</Link>
          <Link to="/returns" className="hover:text-textMain transition-colors">Returns</Link>
          <Link to="/contact" className="hover:text-textMain transition-colors">Contact</Link>
        </nav>
      </div>
    </footer>
  )
}
