import CityBanner from '../components/CityBanner'
import Button from '../components/Button'
import { artisticPieces } from '../data/frames'

export default function Home() {
  return (
    <div className="bg-base text-textMain">
      {/* Bandeau double Los Angeles / Paris */}
      <CityBanner />

      {/* Section slogan */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-6">
        <h1 className="text-5xl font-serif mb-6 tracking-tight">
          L'élégance à votre poignet
        </h1>
        <p className="max-w-xl text-textSubtle mb-12 leading-relaxed">
          Des montres façonnées entre Los Angeles et Paris : l'union du
          savoir-faire et de la créativité.
        </p>
        <div className="flex gap-6">
          <Button variant="outline">Découvrir la collection</Button>
          <Button variant="primary">Personnaliser la vôtre</Button>
        </div>
      </section>

      {/* Artistic Gallery */}
      <section className="max-w-6xl mx-auto py-20 px-6">
        <h2 className="text-4xl font-serif mb-4 text-center">Le Savoir-Faire</h2>
        <p className="text-center text-textSubtle mb-16 max-w-2xl mx-auto">
          Explorez les techniques et procédés qui transforment chaque matière brute en œuvre d'art horlogère.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {artisticPieces.map((piece) => (
            <div key={piece.id} className="group overflow-hidden rounded-lg">
              <div className="relative overflow-hidden h-96 mb-4">
                <img
                  src={piece.image}
                  alt={piece.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h3 className="text-2xl font-serif mb-2">{piece.title}</h3>
              <p className="text-accent text-sm uppercase tracking-widest mb-3">{piece.technique}</p>
              <p className="text-textSubtle leading-relaxed text-sm">{piece.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
