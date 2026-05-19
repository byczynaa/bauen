export interface Product {
  id: number
  name: string
  price: number
  image: string
  description: string
  images: string[]
}

export const products: Product[] = [
  {
    id: 101,
    name: 'Drift',
    price: 79.99,
    image: '/bauen-content/frame01/IMG_2811.jpeg',
    description: 'A frame inspired by movement and freedom, with a design that flows like the Pacific tides.',
    images: [
      '/bauen-content/frame01/IMG_2811.jpeg',
      '/bauen-content/frame01/IMG_2812.jpeg',
      '/bauen-content/frame01/IMG_2813.jpeg',
      '/bauen-content/artistic/Blue%20classic%20folded%20straight%20on.jpg',
      '/bauen-content/artistic/Blue%20classic%20hing%20angle.jpg',
      '/bauen-content/artistic/Blue%20classic%20logo%20closeup.jpg',
    ],
  },
  {
    id: 102,
    name: 'Glow',
    price: 79.99,
    image: '/bauen-content/frame06/IMG_4518.jpeg',
    description: 'Glow shines with subtle highlights and a luminous finish, perfect for nights on the coast.',
    images: [
      '/bauen-content/frame06/IMG_4518.jpeg',
      '/bauen-content/frame06/IMG_4519.jpeg',
      '/bauen-content/frame06/IMG_4520.jpeg',
      '/bauen-content/frame06/IMG_4521.jpeg',
      '/bauen-content/frame06/IMG_4522.jpeg',
      '/bauen-content/frame06/IMG_4525.jpeg',
      '/bauen-content/frame06/IMG_4526.jpeg',
    ],
  },
  {
    id: 201,
    name: 'Ruelles',
    price: 79.99,
    image: '/bauen-content/frame03/IMG_2880.jpeg',
    description: 'The ruelle is the part of Paris tourists miss. Narrow, deliberate, unannounced, a passage that rewards the ones who actually look. These frames carry that same energy: nothing decorative, nothing accidental. Just clean black architecture sitting flush against the bone.',
    images: ['/bauen-content/frame03/IMG_2880.jpeg', '/bauen-content/frame03/IMG_2881.jpeg', '/bauen-content/frame03/IMG_2884.jpeg', '/bauen-content/frame03/IMG_2885.jpeg', '/bauen-content/frame03/IMG_2888.jpeg'],
  },
  {
    id: 202,
    name: 'Sway',
    price: 79.99,
    image: '/bauen-content/frame04/IMG_2893.jpeg',
    description: 'Feel the ocean breeze with Sway. This collection draws inspiration from the coastline with cool ocean blues and minimalist design.',
    images: ['/bauen-content/frame04/IMG_2893.jpeg', '/bauen-content/frame04/IMG_2895.jpeg', '/bauen-content/frame04/IMG_2896.jpeg', '/bauen-content/frame04/IMG_2898.jpeg', '/bauen-content/frame04/IMG_2899.jpeg', '/bauen-content/frame04/IMG_2900.jpeg', '/bauen-content/frame04/IMG_2903.jpeg'],
  },
  {
    id: 203,
    name: 'Roam',
    price: 79.99,
    image: '/bauen-content/frame02/IMG_2815.jpeg',
    description: 'Experience the magic of movement after dark with Roam. Bold frames and sophisticated styling make this collection perfect for nights that stay in motion.',
    images: ['/bauen-content/frame02/IMG_2815.jpeg', '/bauen-content/frame02/IMG_2816.jpeg', '/bauen-content/frame02/IMG_2817.jpeg'],
  },
  {
    id: 204,
    name: 'Impasse',
    price: 79.99,
    image: '/bauen-content/frame07/IMG_4493.jpeg',
    description: 'A dead-end is not a failure of direction. In Paris, it is a destination. The impasse is where the city stops performing and starts existing: quiet, self-contained, indifferent to through-traffic.',
    images: ['/bauen-content/frame07/IMG_4493.jpeg', '/bauen-content/frame07/IMG_4495.jpeg', '/bauen-content/frame07/IMG_4498.jpeg', '/bauen-content/frame07/IMG_4499.jpeg'],
  },
  {
    id: 207,
    name: 'Boulevard',
    price: 79.99,
    image: '/bauen-content/frame05/IMG_4503.jpeg',
    description: 'The one frame that holds two cities at once. Structured, sun-cut, and made for movement.',
    images: ['/bauen-content/frame05/IMG_4503.jpeg', '/bauen-content/frame05/sunnymodelpic1.JPEG', '/bauen-content/frame05/IMG_4504.jpeg', '/bauen-content/frame05/IMG_4506.jpeg', '/bauen-content/frame05/IMG_4510.jpeg', '/bauen-content/frame05/IMG_4511.jpeg', '/bauen-content/frame05/sunnymodelpic2.JPEG', '/bauen-content/frame05/sunnymodelpic3.JPEG'],
  },
]

export const boutiqueProductIds = [101, 102, 201, 202, 203, 204, 207]
export const parisProductIds = [201, 204, 207]
export const pacificProductIds = [101, 102, 202, 203]

export function getProductsByIds(ids: number[]) {
  const idSet = new Set(ids)
  return products.filter((product) => idSet.has(product.id))
}

export function getProductById(id: number) {
  return products.find((product) => product.id === id)
}