export interface Frame {
  id: number
  title: string
  slug: string
  description: string
  images: string[]
  category: string
}

export const frames: Frame[] = [
  {
    id: 1,
    title: 'Precision Engraving',
    slug: 'precision-engraving',
    description: 'Discover the ancient craft of engraving. Each strike of the burin is a decision, each line a signature. Our experienced engravers create unique patterns that tell the story of your eyewear.',
    images: [
      '/bauen-content/frame01/IMG_2811.jpeg',
      '/bauen-content/frame01/IMG_2812.jpeg',
      '/bauen-content/frame01/IMG_2813.jpeg',
    ],
    category: 'Craftsmanship',
  },
  {
    id: 2,
    title: 'Delicate Assembly',
    slug: 'delicate-assembly',
    description: 'Assembling eyewear is an art that requires patience and precision. Our opticians assemble each component with care, ensuring perfect alignment of every element.',
    images: [
      '/bauen-content/frame02/IMG_2815.jpeg',
      '/bauen-content/frame02/IMG_2816.jpeg',
      '/bauen-content/frame02/IMG_2817.jpeg',
    ],
    category: 'Craftsmanship',
  },
  {
    id: 3,
    title: 'Mirror Polishing',
    slug: 'mirror-polishing',
    description: 'Mirror polishing transforms raw metal into a reflective surface. This technique requires unmatched mastery and specialized tools to achieve the characteristic shine.',
    images: [
      '/bauen-content/frame03/IMG_2880.jpeg',
      '/bauen-content/frame03/IMG_2881.jpeg',
      '/bauen-content/frame03/IMG_2884.jpeg',
      '/bauen-content/frame03/IMG_2885.jpeg',
      '/bauen-content/frame03/IMG_2888.jpeg',
    ],
    category: 'Finishing',
  },
  {
    id: 4,
    title: 'Elegant Tinting',
    slug: 'elegant-tinting',
    description: 'Hand-tinted lenses give each pair of glasses a unique personality. Our artisans apply colors with precision, creating subtle and harmonious gradients.',
    images: [
      '/bauen-content/frame04/IMG_2893.jpeg',
      '/bauen-content/frame04/IMG_2895.jpeg',
      '/bauen-content/frame04/IMG_2896.jpeg',
      '/bauen-content/frame04/IMG_2898.jpeg',
      '/bauen-content/frame04/IMG_2899.jpeg',
      '/bauen-content/frame04/IMG_2900.jpeg',
      '/bauen-content/frame04/IMG_2903.jpeg',
    ],
    category: 'Design',
  },
  {
    id: 5,
    title: 'Quality Control',
    slug: 'quality-control',
    description: 'Each pair of glasses is rigorously tested before leaving our workshop. Our master opticians check the durability, precision, and optical quality.',
    images: [
      '/bauen-content/frame05/IMG_4503.jpeg',
      '/bauen-content/frame05/IMG_4504.jpeg',
      '/bauen-content/frame05/IMG_4506.jpeg',
      '/bauen-content/frame05/IMG_4510.jpeg',
      '/bauen-content/frame05/IMG_4511.jpeg',
      '/bauen-content/frame05/sunnymodelpic1.JPEG',
      '/bauen-content/frame05/sunnymodelpic2.JPEG',
    ],
    category: 'Quality',
  },
  {
    id: 6,
    title: 'Artisanal Temple',
    slug: 'artisanal-temple',
    description: 'Our premium temple pieces are crafted by passionate artisans. Each stitch is hand-adjusted, creating a perfect union between function and beauty.',
    images: [
      '/bauen-content/frame06/IMG_4518.jpeg',
      '/bauen-content/frame06/IMG_4519.jpeg',
      '/bauen-content/frame06/IMG_4520.jpeg',
      '/bauen-content/frame06/IMG_4521.jpeg',
      '/bauen-content/frame06/IMG_4522.jpeg',
      '/bauen-content/frame06/IMG_4525.jpeg',
      '/bauen-content/frame06/IMG_4526.jpeg',
    ],
    category: 'Accessories',
  },
  {
    id: 7,
    title: 'Final Finishing',
    slug: 'final-finishing',
    description: 'The final details make all the difference. Our artisans apply the finishing touches with meticulous attention, ensuring every element meets our demanding standards.',
    images: [
      '/bauen-content/frame07/IMG_4493.jpeg',
      '/bauen-content/frame07/IMG_4495.jpeg',
      '/bauen-content/frame07/IMG_4498.jpeg',
      '/bauen-content/frame07/IMG_4499.jpeg',
    ],
    category: 'Craftsmanship',
  },
]

export interface ArtisticPiece {
  id: number
  title: string
  image: string
  technique: string
  description: string
}

export const artisticPieces: ArtisticPiece[] = [
  {
    id: 1,
    title: 'Modern Aesthetics',
    image: '/bauen-content/artistic/IMG_4499.jpeg',
    technique: 'Design Philosophy',
    description: 'Modern fashion meets timeless elegance in every design we create. Our designers blend contemporary aesthetics with classic sophistication, crafting eyewear that elevates your personal style and captures the essence of refined visual culture.',
  },
  {
    id: 2,
    title: 'Frame Design Harmony',
    image: '/bauen-content/artistic/IMG_4512.jpeg',
    technique: 'Frame Assembly',
    description: 'Perfect symmetry defines our frame construction. Each component is meticulously aligned and assembled, creating eyewear that balances aesthetic beauty with ergonomic comfort and durability.',
  },
  {
    id: 3,
    title: 'Bauen Values',
    image: '/bauen-content/artistic/IMG_4525.jpeg',
    technique: 'Vision & Purpose',
    description: 'Bauen represents freedom of expression, vibrant color, genuine happiness, and unwavering purpose. Every frame we craft embodies these values, empowering you to express your unique style while celebrating the joy and individuality that eyewear brings to your life.',
  },
]
