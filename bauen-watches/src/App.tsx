import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Boutique from './pages/Boutique'
import Product from './pages/Product'
import Checkout from './pages/Checkout'
import Cart from './pages/Cart'
import Article from './pages/Article'
import OrderConfirmed from './pages/OrderConfirmed'
import InventoryManagement from './pages/InventoryManagement'
import InventoryLogin from './pages/InventoryLogin'
import AdminOrders from './pages/AdminOrders'
import AdminMenu from './pages/AdminMenu'
import InventoryGuard from './components/InventoryGuard'
// import Configurateur from './pages/Configurateur'
import Apropos from './pages/Apropos'
import Paris from './pages/Paris'
import LA from './pages/LA'
import LACollection from './pages/LACollection'
import Terms from './pages/Terms'
import Privacy from './pages/Privacy'
import Returns from './pages/Returns'
import Contact from './pages/Contact'
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
            <Route path="/order-confirmed" element={<OrderConfirmed />} />
            <Route path="/admin-login" element={<InventoryLogin />} />
            <Route
              path="/inventory"
              element={(
                <InventoryGuard>
                  <InventoryManagement />
                </InventoryGuard>
              )}
            />
            <Route path="/article/:slug" element={<Article />} />
            {/* <Route path="/configurateur" element={<Configurateur />} /> */}
            <Route path="/a-propos" element={<Apropos />} />
            <Route path="/paris" element={<Paris />} />
            <Route path="/la" element={<LA />} />
            <Route path="/pacific-collection" element={<LACollection />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/admin"
              element={(
                <InventoryGuard>
                  <AdminMenu />
                </InventoryGuard>
              )}
            />
            <Route path="/admin/orders" element={<AdminOrders />} />
          </Routes>
        </motion.main>
      </AnimatePresence>

      <Footer />
    </div>
  )
}
