import { Link } from 'react-router-dom'

export default function CityBanner() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2 h-[80vh]">
      {/* Los Angeles */}
      <Link to="/la" className="relative group overflow-hidden">
        <img
          src="/images/la-palm.jpg"
          alt="Los Angeles beach"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 active:scale-98 active:duration-150"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>
        <h2 className="absolute inset-0 flex items-center justify-center text-white text-5xl font-serif tracking-widest group-hover:text-accent transition">
          Los Angeles
        </h2>
      </Link>

      {/* Paris */}
      <Link to="/paris" className="relative group overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80"
          alt="Paris"
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 active:scale-98 active:duration-150"
          draggable={false}
        />
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors duration-500"></div>
        <h2 className="absolute inset-0 flex items-center justify-center text-white text-5xl font-serif tracking-widest group-hover:text-accent transition">
          Paris
        </h2>
      </Link>
    </section>
  )
}
