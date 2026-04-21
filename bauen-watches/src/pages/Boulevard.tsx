import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';

const images = [
  '/bauen-content/frame05/IMG_4503.jpeg',
  '/bauen-content/frame05/sunnymodelpic1.JPEG',
  '/bauen-content/frame05/IMG_4504.jpeg',
  '/bauen-content/frame05/IMG_4506.jpeg',
  '/bauen-content/frame05/IMG_4510.jpeg',
  '/bauen-content/frame05/IMG_4511.jpeg',
  '/bauen-content/frame05/sunnymodelpic2.JPEG',
  '/bauen-content/frame05/sunnymodelpic3.JPEG',
];

export default function Boulevard() {
  const navigate = useNavigate();
  return (
    <div className="bg-base text-textMain min-h-screen py-20 px-6 flex flex-col items-center">
      <div className="max-w-3xl w-full">
        <div className="mb-8 flex flex-col md:flex-row gap-8">
          <div className="flex-1 flex flex-col gap-4">
            {images.map((img, idx) => (
              <img key={idx} src={img} alt={`Boulevard ${idx + 1}`} className="rounded-lg shadow-lg w-full object-cover" />
            ))}
          </div>
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-4xl font-serif mb-4">Boulevard</h1>
            <p className="text-2xl text-accent font-light mb-6">349 €</p>
            <p className="text-textSubtle mb-6">
              The one frame that holds two cities at once. The Haussmannian rigor of the 6th and the loose, sun-cut confidence of West Hollywood. Not a compromise between the two. What happens when both cities agree on what looks good. Black, structured, made for movement.
            </p>
            <Button variant="outline" onClick={() => navigate('/boutique')}>Go back to shop</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
