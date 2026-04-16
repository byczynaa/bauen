import { Link } from 'react-router-dom'

export default function ShopBanner() {
  return (
    <section className="relative h-[40vh] w-full overflow-hidden mb-8">
      <img
        src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80"
        alt="Horizon mer"
        className="w-full h-full object-cover"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10"></div>
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
        {/* Title removed as requested; banner remains clickable via navbar logo */}
      </div>
    </section>
  )
}
