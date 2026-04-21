import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const images = [
  '/bauen-content/frame03/IMG_2880.jpeg',
  '/bauen-content/frame03/IMG_2881.jpeg',
  '/bauen-content/frame03/IMG_2884.jpeg',
  '/bauen-content/frame03/IMG_2885.jpeg',
  '/bauen-content/frame03/IMG_2888.jpeg',
];

export default function Ruelles() {
  const navigate = useNavigate();
  return (
    <div className="bg-base text-textMain min-h-screen py-20 px-6 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <div className="mb-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-4">
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`Ruelles ${idx + 1}`} className="rounded-lg shadow-lg w-full object-cover" />
            ))}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-serif mb-4">Ruelles</h1>
            <p className="text-2xl text-accent font-light mb-6">349 €</p>
            <p className="text-textSubtle mb-6">
              The ruelle is the part of Paris tourists miss. Narrow, deliberate, unannounced—a passage that rewards the ones who actually look. These frames carry that same energy: nothing decorative, nothing accidental. Just clean black architecture sitting flush against the bone.
            </p>
            <Button variant="outline" onClick={() => navigate('/boutique')}>Go back to shop</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
