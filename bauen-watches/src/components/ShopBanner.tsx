import { Link } from 'react-router-dom'

export default function ShopBanner() {
  return (
    <section className="relative h-[40vh] w-full overflow-hidden mb-8">
      <img
        src="/bauen-content/artistic/Model closeup 1.jpg"
        alt="Bauen eyewear"
        className="w-full h-full object-cover object-[center_35%]"
        draggable={false}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10"></div>
      <div className="absolute inset-0 flex items-center justify-center" aria-hidden>
        {/* Title removed as requested; banner remains clickable via navbar logo */}
      </div>
    </section>
  )
}
