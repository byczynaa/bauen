import Button from '../components/Button'

export default function Paris() {
  return (
    <div className="bg-base text-textMain">
      {/* Image hero */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1600&q=80"
          alt="Paris"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40"></div>
        <h1 className="relative text-5xl md:text-6xl font-serif text-white tracking-wide">
          Paris
        </h1>
      </section>

      {/* Section d'intention */}
      <section className="max-w-4xl mx-auto py-24 px-6 text-center">
        <h2 className="text-3xl font-serif mb-6">
          The art of vision crafted in the French tradition
        </h2>
        <p className="text-textSubtle leading-relaxed mb-12">
          Between tradition and modernity, the <span className="font-semibold">Bauen Paris</span> 
          collection celebrates precision, rigor and timeless elegance.  
          Inspired by European optical workshops, it pays homage to French craftsmanship and style.
        </p>
        <Button variant="outline">Discover the Paris collection</Button>
      </section>

      {/* Photo ambiance */}
      <section className="grid grid-cols-1 md:grid-cols-2">
        <img
          src="https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=1000&q=80"
          alt="Atelier Paris"
          className="w-full h-full object-cover"
        />
        <img
          src="https://images.unsplash.com/photo-1500048993953-d23a436266cf?auto=format&fit=crop&w=1000&q=80"
          alt="Architecture Parisienne"
          className="w-full h-full object-cover"
        />
      </section>

      {/* Bouton configurateur */}
      <section className="text-center py-20">
        <p className="text-textSubtle mb-6">
          Create the eyewear that embodies your elegance.
        </p>
        <Button variant="primary">Access the configurator</Button>
      </section>
    </div>
  )
}
