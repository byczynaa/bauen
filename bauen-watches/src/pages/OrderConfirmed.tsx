import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import Button from '../components/Button'

export default function OrderConfirmed() {
  const navigate = useNavigate()

  return (
    <section className="bg-base text-textMain min-h-screen flex items-center justify-center px-6 py-20">
      <motion.div
        className="max-w-lg w-full text-center"
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Check icon */}
        <motion.div
          className="flex items-center justify-center mb-8"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 16 }}
        >
          <div className="w-20 h-20 rounded-full border-2 border-accent flex items-center justify-center">
            <svg
              className="w-9 h-9 text-accent"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </motion.div>

        <h1 className="text-4xl font-serif mb-4 tracking-wide">Order Confirmed</h1>
        <p className="text-textSubtle text-base leading-relaxed mb-2">
          Thank you for your purchase. Your order has been placed successfully.
        </p>
        <p className="text-textSubtle text-sm mb-12">
          A confirmation will be sent once your order is processed.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" onClick={() => navigate('/boutique')}>
            Continue Shopping
          </Button>
          <Button variant="outline" onClick={() => navigate('/')}>
            Back to Home
          </Button>
        </div>
      </motion.div>
    </section>
  )
}
