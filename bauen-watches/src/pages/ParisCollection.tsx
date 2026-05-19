import React from 'react';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

export default function ParisCollection() {
  return (
    <div className="collection-page text-textMain">
      <section className="hero bg-white py-12 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">Paris Collection</h1>
        <p className="max-w-2xl mx-auto mb-6 text-lg">
          Frames inspired by the hidden corners and grand boulevards of Paris. Discover the collection that captures the city’s quiet elegance and bold spirit.
        </p>
        <Link to="/paris">
          <Button>View Paris Frames</Button>
        </Link>
      </section>
      {/* Add more storytelling, images, and details here as needed */}
    </div>
  );
}
