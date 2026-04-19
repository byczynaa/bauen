import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { items } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navItems = [
    { name: 'Boutique', path: '/boutique' },
    { name: 'Pacific Collection', path: '/pacific-collection' },
    { name: 'Configurateur', path: '/configurateur' },
    { name: 'À propos', path: '/a-propos' },
  ]

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className={`fixed w-full top-0 z-50 border-b transition-all duration-500 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-accent/40 shadow-lg'
          : 'bg-white/90 backdrop-blur-md border-accent/20 shadow-sm'
      } text-black`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center py-6 px-8 relative">
        <button
          className="hover:text-accent transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} strokeWidth={1.5} />
        </button>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 1 }}
          className="absolute left-1/2 transform -translate-x-1/2"
        >
          <Link to="/" className="text-3xl font-serif tracking-wide no-underline text-black hover:text-accent">
            BAUEN
          </Link>
        </motion.div>

        <button
          className="relative hover:text-accent transition"
          onClick={() => navigate('/cart')}
          aria-label="Panier"
        >
          <ShoppingCart size={24} strokeWidth={1.5} />
          {items.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-accent text-base text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
              {items.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
        </button>

        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={() => setMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: 0 }}
                exit={{ x: '-100%' }}
                transition={{ type: 'spring', stiffness: 80, damping: 20 }}
                className="fixed top-0 left-0 h-full w-72 bg-white shadow-lg z-50 flex flex-col justify-between"
              >
                <div className="p-8">
                  <h2 className="text-lg font-serif mb-10 tracking-wide text-black">Menu</h2>
                  <ul className="flex flex-col gap-6 text-sm uppercase tracking-wide">
                    {navItems.map((item) => (
                      <li key={item.path}>
                        <Link
                          to={item.path}
                          onClick={() => setMenuOpen(false)}
                          className={`block transition ${
                            location.pathname === item.path
                              ? 'text-accent font-medium'
                              : 'text-black hover:text-accent'
                          }`}
                        >
                          {item.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-8 border-t border-border text-xs text-textSubtle">
                  © {new Date().getFullYear()} Bauen Watches
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
      <motion.div
        className="h-[1px] bg-accent absolute bottom-0 left-0"
        initial={{ width: 0 }}
        animate={{ width: scrolled ? '100%' : '0%' }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
      />
    </motion.nav>
  )
}
