import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const images = [
  '/bauen-content/frame07/IMG_4493.jpeg',
  '/bauen-content/frame07/IMG_4495.jpeg',
  '/bauen-content/frame07/IMG_4498.jpeg',
  '/bauen-content/frame07/IMG_4499.jpeg',
];

export default function Impasse() {
  const navigate = useNavigate();
  return (
    <div className="bg-base text-textMain min-h-screen py-20 px-6 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <div className="mb-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-4">
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`Impasse ${idx + 1}`} className="rounded-lg shadow-lg w-full object-cover" />
            ))}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-serif mb-4">Impasse</h1>
            <p className="text-2xl text-accent font-light mb-6">329 €</p>
            <p className="text-textSubtle mb-6">
              A dead-end isn't a failure of direction. In Paris, it's a destination. The impasse is where the city stops performing and starts existing: quiet, self-contained, indifferent to through-traffic. These frames don't ask for your attention. They simply have it.
            </p>
            <Button variant="outline" onClick={() => navigate('/boutique')}>Go back to shop</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
