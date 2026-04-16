import { useNavigate } from 'react-router-dom'
import Button from './Button'

interface WatchCardProps {
  id: number
  name: string
  price: number
  image: string
}

export default function WatchCard({ id, name, price, image }: WatchCardProps) {
  const navigate = useNavigate()

  const handleClick = () => {
    navigate(`/product/${id}`)
  }

  return (
    <div className="relative group bg-surface border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-500 cursor-pointer">
      <img
        src={image}
        alt={name}
        className="w-full h-80 object-cover transform group-hover:scale-105 transition-transform duration-700"
      />
      <div className="absolute inset-0 bg-white/95 flex flex-col justify-center items-center text-center px-6 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-out">
        <h3 className="text-lg font-serif text-textMain mb-2 tracking-wide">{name}</h3>
        <p className="text-textSubtle mb-4">{price} €</p>
        <Button variant="outline" onClick={handleClick}>Voir le modèle</Button>
      </div>
    </div>
  )
}
