import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from '../components/Button'
import { frames } from '../data/frames'

export default function Article() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  
  const article = frames.find((f) => f.slug === slug)

  if (!article) {
    return (
      <section className="bg-base text-textMain min-h-screen py-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Article non trouvé</h2>
          <Button variant="outline" onClick={() => navigate('/')}>
            Retour à l'accueil
          </Button>
        </div>
      </section>
    )
  }

  return (
    <div className="bg-base text-textMain">
      {/* Hero image */}
      <section className="relative h-[70vh] flex items-end justify-center overflow-hidden">
        <img
          src={article.images[currentImageIndex]}
          alt={article.title}
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center pb-12">
          <span className="text-accent text-sm uppercase tracking-widest">{article.category}</span>
          <h1 className="text-5xl md:text-6xl font-serif text-white tracking-wide mt-4">{article.title}</h1>
        </div>
      </section>

      {/* Article content */}
      <section className="max-w-4xl mx-auto py-20 px-6">
        <p className="text-textSubtle leading-relaxed mb-12 text-lg">{article.description}</p>

        {/* Image gallery */}
        <div className="mb-16">
          <div className="mb-6">
            <img
              src={article.images[currentImageIndex]}
              alt={`${article.title} ${currentImageIndex + 1}`}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          {article.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-4">
              {article.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIndex(idx)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                    currentImageIndex === idx ? 'border-accent scale-110' : 'border-border'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-6 justify-center">
          <Button
            variant="outline"
            onClick={() => navigate('/')}
          >
            Retour aux histoires
          </Button>
        </div>
      </section>
    </div>
  )
}
