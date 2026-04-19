import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Boutique from './pages/Boutique'
import Product from './pages/Product'
import Checkout from './pages/Checkout'
import Cart from './pages/Cart'
import Article from './pages/Article'
import Configurateur from './pages/Configurateur'
import Apropos from './pages/Apropos'
import Paris from './pages/Paris'
import LA from './pages/LA'
import LACollection from './pages/LACollection'
import { AnimatePresence, motion } from 'framer-motion'
import { CartProvider } from './context/CartContext'

export default function App() {
  return (
    <CartProvider>
      <Router>
        <AppRoutes />
      </Router>
    </CartProvider>
  )
}

function AppRoutes() {
  const location = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-base text-textMain">
      <Navbar />

      <AnimatePresence mode="wait">
        <motion.main
          className="flex-1"
          key={location.pathname}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.45 }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/boutique" element={<Boutique />} />
            <Route path="/product/:id" element={<Product />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/article/:slug" element={<Article />} />
            <Route path="/configurateur" element={<Configurateur />} />
            <Route path="/a-propos" element={<Apropos />} />
            <Route path="/paris" element={<Paris />} />
            <Route path="/la" element={<LA />} />
            <Route path="/pacific-collection" element={<LACollection />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  )
}
