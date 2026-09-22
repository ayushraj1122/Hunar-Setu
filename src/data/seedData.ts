import { Product, LectureCourse } from '../types';

export const INITIAL_PRODUCTS: Product[] = [
  new Product({
    id: 'prod_1',
    title: 'Handcrafted Terracotta Clay Water Carafe & Tumbler Set',
    brand: 'Mitti Kala Sangam (Bihar SHG)',
    category: 'Pottery & Clay Art',
    shortDescription: 'Naturally cooling, porous unglazed earthen jug with hand-etched tribal motifs.',
    longDescription: 'Handmade by skilled women artisans of rural Bihar using pure riverbed clay. This terracotta carafe naturally chills drinking water without electricity while neutralizing pH levels. Comes with matching tumblers, fired in traditional kiln with zero chemical additives.',
    price: 649,
    imageUrl: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=800&auto=format&fit=crop&q=80',
    materials: '100% Organic Purified Clay, Kiln-fired Terracotta',
    highlights: {
      'Craft Technique': 'Wheel-thrown & Sun-dried',
      'Artisan Collective': 'Mitti Kala Mahila Mandal',
      'Capacity': '1.5 Liters jug + 2 x 250ml tumblers',
      'Origin': 'Madhubani Region, Bihar',
      'Care': 'Rinse with warm water, avoid chemical detergents'
    },
    reviews: [
      {
        id: 'rev_1',
        author: 'Ananya Sharma',
        rating: 5,
        date: '2026-03-02',
        comment: 'Water stays cool and tastes remarkably sweet. Beautiful earthy scent!'
      },
      {
        id: 'rev_2',
        author: 'Vikram Mehta',
        rating: 5,
        date: '2026-03-10',
        comment: 'Packaging was sturdy, finish is remarkably smooth for raw terracotta.'
      }
    ],
    reviewsCount: 28,
    rating: 4.9,
    boughtCount: 230,
    inStock: true
  }),
  new Product({
    id: 'prod_2',
    title: 'Natural Moonj & Golden Grass Handwoven Storage Basket',
    brand: 'Pratibha Weaver SHG',
    category: 'Fiber & Basketry',
    shortDescription: 'Eco-friendly biodegradable coiled storage organizer with fitted lid.',
    longDescription: 'Moonj grass is harvested from wild riverbanks and soaked before artisan mothers coil and stitch it into sturdy storage vessels. Dyed only with vegetable bark and turmeric extracts. Perfect for kitchen storage, textiles, or ornamental bread basket.',
    price: 899,
    imageUrl: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&auto=format&fit=crop&q=80',
    materials: 'Saccharum Bengalense (Moonj wild grass), Natural botanical dyes',
    highlights: {
      'Craft Technique': 'Coiled basketry weaving',
      'Dimensions': '10 inches diameter x 8 inches depth',
      'Weight': '420 grams',
      'Ecological Footprint': '100% Zero Plastic & Compostable',
      'Artisan Group': 'Pratibha Mahila SHG, Prayagraj'
    },
    reviews: [
      {
        id: 'rev_3',
        author: 'Pooja Iyer',
        rating: 5,
        date: '2026-02-18',
        comment: 'Extremely durable and looks very elegant on our dining table.'
      }
    ],
    reviewsCount: 19,
    rating: 4.8,
    boughtCount: 145,
    inStock: true
  }),
  new Product({
    id: 'prod_3',
    title: 'Handspun Eri Silk & Organic Cotton Stole (Ahimsa Silk)',
    brand: 'Arunodaya Weavers (Assam SHG)',
    category: 'Handloom Textiles',
    shortDescription: 'Cruelty-free thermal silk stole hand-dyed with madder root and indigo.',
    longDescription: 'Eri silk, also celebrated as Ahimsa silk, is cultivated without harming the silkworm. Spun on traditional takli spindles and woven on bamboo handlooms by rural Assamese women weavers. Soft, breathable in summer and insulating in winter.',
    price: 1499,
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80',
    materials: 'Pure Handspun Ahimsa Eri Silk (60%), Organic Handloom Cotton (40%)',
    highlights: {
      'Weave Pattern': 'Traditional Tribal Diamond Border',
      'Dye Type': 'Natural Indigo & Wild Madder Root',
      'Dimensions': '200 cm x 70 cm',
      'Fair Trade Certification': 'Direct Producer Certified SHG'
    },
    reviews: [
      {
        id: 'rev_4',
        author: 'Rhea Sen',
        rating: 5,
        date: '2026-01-28',
        comment: 'Such a heavenly texture, you can feel the warmth and human touch behind it.'
      }
    ],
    reviewsCount: 34,
    rating: 4.9,
    boughtCount: 310,
    inStock: true
  }),
  new Product({
    id: 'prod_4',
    title: 'Cold-Pressed Wild Forest Honey & Raw Turmeric Preserve',
    brand: 'Vanashree Tribal Farmers Collective',
    category: 'Organic Agro & Food',
    shortDescription: 'Unpasteurized monofloral honey infused with Lakadong high-curcumin turmeric.',
    longDescription: 'Responsibly gathered from wild Apis dorsata bee combs in sustainable forest buffer zones. Combined with GI-tagged Lakadong raw turmeric slices dried in mountain sunlight. Never heated or chemically filtered, preserving live enzymes.',
    price: 520,
    imageUrl: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=800&auto=format&fit=crop&q=80',
    materials: '100% Wild Raw Honey, Lakadong Turmeric Root',
    highlights: {
      'Curcumin Content': 'High potency ~7.5%',
      'Net Weight': '450 grams jar',
      'Extraction Method': 'Gravity dripped cold filtering',
      'Harvest Season': 'Autumn Wild Blossom'
    },
    reviews: [
      {
        id: 'rev_5',
        author: 'Gaurav Kulkarni',
        rating: 5,
        date: '2026-03-05',
        comment: 'The golden color and rich herbal scent is incomparable to factory honey.'
      }
    ],
    reviewsCount: 42,
    rating: 5.0,
    boughtCount: 420,
    inStock: true
  }),
  new Product({
    id: 'prod_5',
    title: 'Traditional Dokra Bell Metal Tribal Figurine Candle Stand',
    brand: 'Shilpika Metal Crafts SHG',
    category: 'Dokra & Bell Metal',
    shortDescription: 'Lost-wax cast bronze alloy diya and candle stand handcrafted by indigenous artisans.',
    longDescription: 'Dokra is a 4,000-year-old non-ferrous casting art form dating back to the Mohenjo-daro Dancing Girl. Each piece requires hand-modeling beeswax wires, casting in clay molds, and molten metal pouring. No two castings are identical.',
    price: 1150,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    materials: 'Recycled brass and bronze bell-metal alloy',
    highlights: {
      'Casting Technique': 'Cire perdue (Lost-wax casting)',
      'Dimensions': '7 inches tall x 4 inches base',
      'Weight': '680 grams',
      'Heritage': 'Tribal Craft of Bastar & Bankura'
    },
    reviews: [
      {
        id: 'rev_6',
        author: 'Arjun Das',
        rating: 5,
        date: '2026-02-14',
        comment: 'Authentic primitive folk art feel. The detailing is rustic and exquisite.'
      }
    ],
    reviewsCount: 15,
    rating: 4.7,
    boughtCount: 88,
    inStock: true
  }),
  new Product({
    id: 'prod_6',
    title: 'Handblock Printed Dabu Cotton Bedsheet with Pillow Covers',
    brand: 'Surya Kiran Mahila Samiti',
    category: 'Block Print & Textiles',
    shortDescription: 'Mud-resist mud block indigo print made with 200 thread count organic cotton.',
    longDescription: 'Dabu is an ancient mud-resist hand-block printing method practiced in Bagru, Rajasthan. Clay and sawdust resist paste is pressed with carved teak wood blocks, then dip-dyed multiple times in deep natural indigo vats before sun curing.',
    price: 1690,
    imageUrl: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=800&auto=format&fit=crop&q=80',
    materials: '100% Breathable Combed Cotton (200 TC), Natural Indigo',
    highlights: {
      'Size': 'King Size (108 x 108 inches) + 2 Pillow Shams',
      'Print Technique': 'Double Dabu Hand Block Print',
      'Washing Guide': 'Cold delicate hand wash with mild soap'
    },
    reviews: [
      {
        id: 'rev_7',
        author: 'Meenakshi Sundaram',
        rating: 5,
        date: '2026-03-08',
        comment: 'Softest cotton fabric! Color did not bleed on the first wash.'
      }
    ],
    reviewsCount: 31,
    rating: 4.9,
    boughtCount: 260,
    inStock: true
  })
];

export const SHG_COURSES: LectureCourse[] = [
  {
    id: 'course_1',
    title: 'Professional Terracotta Pottery & Wheel Centering Techniques',
    category: 'Pottery & Ceramic Crafts',
    instructor: 'Master Craftsman Ramu Ji & NID Artisans',
    duration: '18 mins',
    level: 'Beginner',
    youtubeId: '3XyK3x_9v1Y', // Realistic curated craft demonstration
    youtubeUrl: 'https://www.youtube.com/watch?v=3XyK3x_9v1Y',
    thumbnail: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80',
    description: 'Learn step-by-step preparation of clay kneading, eliminating air bubbles, centering clay on the potter wheel, and shaping durable terracotta water carafes.',
    keySkillsTaught: ['Clay wedging & kneading', 'Center alignment', 'Wall pulling & thickness control', 'Spout & handle attachment']
  },
  {
    id: 'course_2',
    title: 'Natural Dyeing Mastery: Indigo, Turmeric, & Madder Extraction',
    category: 'Handloom & Textile Art',
    instructor: 'Sunita Devi (National Master Weaver)',
    duration: '22 mins',
    level: 'Intermediate',
    youtubeId: 'Wd3xQk-P_U0',
    youtubeUrl: 'https://www.youtube.com/watch?v=Wd3xQk-P_U0',
    thumbnail: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&auto=format&fit=crop&q=80',
    description: 'How to build an active reduction indigo fermentation vat without harsh synthetic chemicals. Extracting golden yellows from turmeric and rich reds from rubia cordifolia roots.',
    keySkillsTaught: ['Botanical extraction', 'Mordanting cotton & silk', 'Vat pH maintenance', 'Color fastness testing']
  },
  {
    id: 'course_3',
    title: 'Moonj & Golden Grass Coiled Weaving for Commercial Baskets',
    category: 'Natural Fiber & Basketry',
    instructor: 'Geeta Varma (Rural Livelihood Mission Trainer)',
    duration: '15 mins',
    level: 'Beginner',
    youtubeId: 'a_JkP2cM9G8',
    youtubeUrl: 'https://www.youtube.com/watch?v=a_JkP2cM9G8',
    thumbnail: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80',
    description: 'Harvesting, split softening with water, and precision stitching technique for making high-load capacity storage organizers and decorative hampers.',
    keySkillsTaught: ['Fiber retting & conditioning', 'Base coil start', 'Awl tool threading', 'Rim finishing & lidding']
  },
  {
    id: 'course_4',
    title: 'Export-Quality Quality Control (QC) & Packaging for SHG Goods',
    category: 'Packaging & Quality Assurance',
    instructor: 'Arvind Swamy (Export Promotion Council)',
    duration: '24 mins',
    level: 'Advanced',
    youtubeId: 'b_7vR1v8jF4',
    youtubeUrl: 'https://www.youtube.com/watch?v=b_7vR1v8jF4',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
    description: 'Practical guide to standard dimensional checks, barcode and QR labeling, eco-friendly honeycomb paper cushioning, and transit drop testing.',
    keySkillsTaught: ['Batch QC checklists', 'Damage-resistant packing', 'Fulfillment labeling', 'Return mitigation']
  },
  {
    id: 'course_5',
    title: 'Financial Literacy, Digital Invoicing & GeM Portal Onboarding',
    category: 'Business & Digital Marketing',
    instructor: 'Nisha Singhal (NRLM Banking Correspondent)',
    duration: '20 mins',
    level: 'Beginner',
    youtubeId: 'mN38i_fGvG0',
    youtubeUrl: 'https://www.youtube.com/watch?v=mN38i_fGvG0',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    description: 'Step-by-step orientation on maintaining group ledgers, SHG bank account passbooks, calculating production costs, and pricing products profitably.',
    keySkillsTaught: ['Unit cost calculation', 'Profit margin allocation', 'Digital UPI payments', 'Group ledger auditing']
  }
];
