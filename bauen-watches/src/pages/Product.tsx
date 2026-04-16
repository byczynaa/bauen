import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import Button from '../components/Button'
import { useCart } from '../context/CartContext'

const watches = [
  {
    id: 1,
    name: 'Abysse',
    price: 329,
    image: '/images/blue00.jpeg',
    description: 'Plongez dans les profondeurs avec Abysse. Cette collection marine incarne la sérénité des abysses avec ses teintes bleues captivantes et son mécanisme précis. Chaque montre est une porte ouverte sur l\'océan infini.',
    images: ['/images/blue00.jpeg', '/images/blue01.jpeg', '/images/blue02.jpeg', '/images/blue03.jpeg'],
  },
  {
    id: 2,
    name: 'Labeur',
    price: 319,
    image: '/images/brown00.jpeg',
    description: 'Labeur célèbre le travail, la persévérance et l\'excellence. Avec ses nuances chaudes et rustiques, cette collection incarne l\'esprit artisanal. Une montre pour ceux qui créent et construisent avec passion.',
    images: ['/images/brown00.jpeg', '/images/brown01.jpeg'],
  },
]

export default function Product() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [addedToCart, setAddedToCart] = useState(false)
  const product = watches.find((w) => w.id === parseInt(id || '0'))

  if (!product) {
    return (
      <section className="bg-base text-textMain min-h-screen py-20 px-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-serif mb-4">Produit non trouvé</h2>
          <Button variant="outline" onClick={() => navigate('/boutique')}>
            Retour à la boutique
          </Button>
        </div>
      </section>
    )
  }

  return (
    <div className="bg-base text-textMain">
      {/* Product layout: left images, right info */}
      <section className="max-w-6xl mx-auto py-20 px-6 flex flex-col md:flex-row gap-12">
        {/* images column */}
        <div className="md:w-1/2">
          <div className="mb-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
        </div>

        {/* information column */}
        <div className="md:w-1/2 flex flex-col justify-center">
          <h1 className="text-4xl font-serif mb-4">{product.name}</h1>
          <p className="text-2xl text-accent font-light mb-6">{product.price} €</p>
          <p className="text-textSubtle mb-6">{product.description}</p>

          {/* Résumé / caractéristiques */}
          <div className="mb-12">
            <h3 className="text-xl font-serif mb-4">Caractéristiques</h3>
            <ul className="text-textSubtle space-y-2 text-sm">
              <li>✓ Mouvement à quartz haute précision</li>
              <li>✓ Boîtier acier inoxydable 42mm</li>
              <li>✓ Verre minéral résistant aux rayures</li>
              <li>✓ Bracelet cuir premium</li>
              <li>✓ Étanchéité 5ATM</li>
              <li>✓ Garantie 2 ans</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="flex gap-6 mb-12">
            <Button
              variant="primary"
              onClick={() => {
                addToCart({ id: product.id, name: product.name, price: product.price })
                setAddedToCart(true)
                setTimeout(() => setAddedToCart(false), 2000)
              }}
            >
              {addedToCart ? '✓ Ajouté au panier' : 'Ajouter au panier'}
            </Button>
            <Button variant="outline" onClick={() => navigate('/cart')}>
              Voir le panier
            </Button>
          </div>
        </div>
      </section>

      {/* Caractéristiques */}
      <section className="max-w-4xl mx-auto py-20 px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <div>
            <h3 className="text-xl font-serif mb-4">Caractéristiques</h3>
            <ul className="text-textSubtle space-y-2 text-sm">
              <li>✓ Mouvement à quartz haute précision</li>
              <li>✓ Boîtier acier inoxydable 42mm</li>
              <li>✓ Verre minéral résistant aux rayures</li>
              <li>✓ Bracelet cuir premium</li>
              <li>✓ Étanchéité 5ATM</li>
              <li>✓ Garantie 2 ans</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}
