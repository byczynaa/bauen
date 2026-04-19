import Button from '../components/Button'
import { useNavigate } from 'react-router-dom'

export default function LA() {
  const navigate = useNavigate()
  return (
    <div className="bg-base text-textMain">
      {/* Image hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img
          src="/images/la-palm.jpg"
          alt="Los Angeles beach"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <h1 className="relative text-5xl md:text-6xl font-serif text-white tracking-wide">
          Los Angeles
        </h1>
      </section>

      {/* Section d'intention */}
      <section className="max-w-4xl mx-auto py-24 px-6 text-center">
        <h2 className="text-3xl font-serif mb-6">
          California Innovation at Your Eyes
        </h2>
        <p className="text-textSubtle leading-relaxed mb-12">
          Inspired by the creative spirit of Los Angeles, the Bauen Pacific collection blends modernity, freedom, and boldness. Each frame embodies the California dream and limitless innovation.
        </p>
        <Button variant="outline" onClick={() => navigate('/pacific-collection')}>Discover the Pacific Collection</Button>
      </section>

      {/* Photo ambiance */}
      {/* Photo ambiance */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1000&q=80"
          alt="Los Angeles Skyline"
          className="w-full h-full object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=80"
          alt="Plage de LA"
          className="w-full h-full object-cover"
        />
      </section>
      {/* Bouton configurateur */}
      <section className="text-center py-20">
        <p className="text-textSubtle mb-6">
          Create the eyewear that embodies your California style.
        </p>
        <Button variant="primary">Access the Configurator</Button>
      </section>
    </div>
  )
}
