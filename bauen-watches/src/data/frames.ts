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
    title: 'La Gravure Precision',
    slug: 'gravure-precision',
    description: 'Découvrez le métier ancestral de la gravure. Chaque coup de burin est une décision, chaque trait une signature. Nos graveurs expérimentés créent des motifs uniques qui racontent l\'histoire de votre montre.',
    images: [
      '/bauen-content/frame01/IMG_2811.jpeg',
      '/bauen-content/frame01/IMG_2812.jpeg',
      '/bauen-content/frame01/IMG_2813.jpeg',
    ],
    category: 'Craftsmanship',
  },
  {
    id: 2,
    title: 'L\'Assemblage Délicat',
    slug: 'assemblage-delicat',
    description: 'L\'assemblage d\'une montre est un art qui demande patience et précision. Nos horlogers montent chaque composant avec soin, en veillant à l\'alignement parfait de chaque rouage.',
    images: [
      '/bauen-content/frame02/IMG_2815.jpeg',
      '/bauen-content/frame02/IMG_2816.jpeg',
      '/bauen-content/frame02/IMG_2817.jpeg',
    ],
    category: 'Craftsmanship',
  },
  {
    id: 3,
    title: 'Le Polissage Miroir',
    slug: 'polissage-miroir',
    description: 'Le polissage miroir transforme l\'acier brut en surface réfléchissante. Cette technique exige une maîtrise inégalée et des outils spécialisés pour obtenir cet éclat caractéristique.',
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
    title: 'La Teinte Élégante',
    slug: 'teinte-elegante',
    description: 'Les cadrans teintés à main donnent à chaque montre une personnalité unique. Nos artisans appliquent les couleurs avec précision, créant des dégradés subtils et harmonieux.',
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
    title: 'Le Contrôle Qualité',
    slug: 'controle-qualite',
    description: 'Chaque montre est testée rigoureusement avant de quitter notre atelier. Nos maîtres horlogers vérifient l\'étanchéité, la précision et le fonctionnement mécanique.',
    images: [
      '/bauen-content/frame05/IMG_4503.jpeg',
      '/bauen-content/frame05/IMG_4504.jpeg',
      '/bauen-content/frame05/IMG_4506.jpeg',
      '/bauen-content/frame05/IMG_4510.jpeg',
      '/bauen-content/frame05/IMG_4511.jpeg',
      '/bauen-content/frame05/IMG_4512.jpeg',
      '/bauen-content/frame05/IMG_4513.jpeg',
    ],
    category: 'Quality',
  },
  {
    id: 6,
    title: 'Le Bracelet Artisanal',
    slug: 'bracelet-artisanal',
    description: 'Nos bracelets en cuir premium sont façonnés par des artisans passionnés. Chaque point de couture est ajusté à la main, créant une union parfaite entre fonction et beauté.',
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
    title: 'La Finition Finale',
    slug: 'finition-finale',
    description: 'Les derniers détails font toute la différence. Nos artisans appliquent les finitions finales avec une attention méticuleuse, assurant que chaque élément répond à nos standards exigeants.',
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
    title: 'Macro Precision',
    image: '/bauen-content/artistic/IMG_4499.jpeg',
    technique: 'Macro Photography',
    description: 'Capturant les détails infimes de nos mécanismes avec une clarté cristalline. Cette photographie macro révèle la complexité et la beauté de l\'ingénierie horlogère à l\'échelle microscopique.',
  },
  {
    id: 2,
    title: 'Symmetry in Motion',
    image: '/bauen-content/artistic/IMG_4512.jpeg',
    technique: 'High-Speed Photography',
    description: 'Un instant saisi dans le temps, montrant la parfaite symétrie de nos rouages en action. Cette image capte la danse harmonieuse entre la forme et la fonction, figée dans l\'éternité.',
  },
  {
    id: 3,
    title: 'Reflection of Craftsmanship',
    image: '/bauen-content/artistic/IMG_4525.jpeg',
    technique: 'Reflective Lighting',
    description: 'La lumière danse sur les surfaces polies, révélant la finesse du travail artisanal. Cette composition joue avec la réflexion et l\'ombre pour créer une image captivante et intemporelle.',
  },
]
