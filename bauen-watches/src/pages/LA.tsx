import Button from '../components/Button'

export default function LA() {
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
          L'innovation californienne au poignet
        </h2>
        <p className="text-textSubtle leading-relaxed mb-12">
          Inspirée par l'esprit créatif de Los Angeles, la collection <span className="font-semibold">Bauen LA</span> 
          fusionne modernité, liberté et audace. Chaque montre incarne le rêve californien et l'innovation sans limites.
        </p>
        <Button variant="outline">Découvrir la collection Los Angeles</Button>
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
          Créez la montre qui incarne votre style californien.
        </p>
        <Button variant="primary">Accéder au configurateur</Button>
      </section>
    </div>
  )
}
