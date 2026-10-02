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
    title: 'मिट्टी की हांडी और बर्तन बनाने की कला (Pottery & Clay Pot Making in Hindi)',
    category: 'कुम्हारी व मिट्टी कला (Pottery & Terracotta)',
    instructor: 'Craft With Sagar (मास्टर पॉटर सागर जी)',
    duration: '29:38',
    level: 'Beginner',
    youtubeId: 'OkerUP6_Y3U',
    youtubeUrl: 'https://www.youtube.com/watch?v=OkerUP6_Y3U',
    thumbnail: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=600&auto=format&fit=crop&q=80',
    description: 'पारंपरिक चाक पर मिट्टी गूंथने, सेंटरिंग करने, और मजबूत मिट्टी की हांडी/बर्तन तैयार करने की पूरी तकनीक हिंदी में।',
    keySkillsTaught: ['Clay Wedging & Kneading', 'Potter Wheel Centering', 'Wall Pulling & Thickness', 'Handi Neck & Kiln Firing']
  },
  {
    id: 'course_2',
    title: 'साड़ी और कपड़ों पर ब्लॉक प्रिंटिंग (Saree & Fabric Block Printing Part 1)',
    category: 'हथकरघा व वस्त्र प्रिंटिंग (Handloom & Textile Art)',
    instructor: 'Sri Om Traditions (श्री ओम ट्रैडिशन्स)',
    duration: '16:19',
    level: 'Intermediate',
    youtubeId: 'pr8yDXUPZw0',
    youtubeUrl: 'https://www.youtube.com/watch?v=pr8yDXUPZw0',
    thumbnail: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&auto=format&fit=crop&q=80',
    description: 'लकड़ी के नक्काशीदार ब्लॉक्स से कॉटन व सिल्क कपड़ों पर कलर पैड तैयार करने, संरेखण और सटीक ब्लॉक प्रिंटिंग की विधि।',
    keySkillsTaught: ['Color Tray & Sponge Prep', 'Teak Block Stamping', 'Pattern Alignment & Registration', 'Color Fastness & Washing']
  },
  {
    id: 'course_3',
    title: 'पारंपरिक बांस व मूंज की टोकरी निर्माण (Bamboo & Grass Basket Craft)',
    category: 'प्राकृतिक फाइबर व टोकरी निर्माण (Natural Fiber & Basketry)',
    instructor: 'P Craft Shannel (पी क्राफ्ट चैनल)',
    duration: '16:24',
    level: 'Beginner',
    youtubeId: '5dlY686nJlk',
    youtubeUrl: 'https://www.youtube.com/watch?v=5dlY686nJlk',
    thumbnail: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=600&auto=format&fit=crop&q=80',
    description: 'बांस की तीलियां छीलना, लचीला बनाना, गोलाकार बुनाई और मजबूत किनारी (rim finishing) तैयार करने का व्यावहारिक प्रशिक्षण।',
    keySkillsTaught: ['Bamboo Splitting & Shaving', 'Base Radial Weaving', 'Vertical Stiffening', 'Rim & Handle Binding']
  },
  {
    id: 'course_4',
    title: 'सिलाई और कटिंग मास्टरक्लास (Complete Tailoring & Stitching Course Class 1)',
    category: 'परिधान एवं सिलाई कार्य (Apparel & Tailoring)',
    instructor: 'JIGYASA STITCHING (जिज्ञासा स्टिचिंग)',
    duration: '26:30',
    level: 'Beginner',
    youtubeId: 'Jv9hpPmcMMU',
    youtubeUrl: 'https://www.youtube.com/watch?v=Jv9hpPmcMMU',
    thumbnail: 'https://images.unsplash.com/photo-1528458908811-9a7f34c56e30?w=600&auto=format&fit=crop&q=80',
    description: 'सिलाई मशीन की सेटिंग, बॉबिन भरना, सीधी व गोल सिलाई, कपड़ों की कटिंग और फिनिशिंग टांके लगाने की बुनियादी से एडवांस तकनीक।',
    keySkillsTaught: ['Machine Threading & Tension', 'Straight & Curved Seams', 'Fabric Measurement & Cutting', 'Finishing & Hemming']
  },
  {
    id: 'course_5',
    title: 'SHG बही-खाता एवं पांच सूत्र प्रशिक्षण (NRLM SHG Bookkeeping & Register Training)',
    category: 'समूह प्रबंधन एवं वित्तीय साक्षरता (SHG Management & Finance)',
    instructor: 'M2 Official (एम२ ऑफिशियल - SHG ट्रेनर)',
    duration: '24:45',
    level: 'Beginner',
    youtubeId: 'ZGCMcbJ13QA',
    youtubeUrl: 'https://www.youtube.com/watch?v=ZGCMcbJ13QA',
    thumbnail: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    description: 'स्वयं सहायता समूह (SHG) के पांच सूत्र, बैठक कार्यवाही रजिस्टर, बचत व ऋण बही, रोकड़ बही (Cash Book) और बैंक लेनदेन का संधारण।',
    keySkillsTaught: ['SHG 5-Sutra Governance', 'Meeting Register Protocol', 'Savings & Loan Ledger', 'Cash Book Auditing']
  },
  {
    id: 'course_6',
    title: 'मल्टीकलर ब्लॉक प्रिंटिंग व बॉर्डर डिजाइन (Advanced Saree Block Printing Part 2)',
    category: 'हथकरघा व वस्त्र प्रिंटिंग (Handloom & Textile Art)',
    instructor: 'Sri Om Traditions (श्री ओम ट्रैडिशन्स)',
    duration: '14:52',
    level: 'Advanced',
    youtubeId: 'OjQWGpvnifM',
    youtubeUrl: 'https://www.youtube.com/watch?v=OjQWGpvnifM',
    thumbnail: 'https://images.unsplash.com/photo-1607344645866-009c320b5ab8?w=600&auto=format&fit=crop&q=80',
    description: 'दोहरे व तीहरे रंगों का सामंजस्य, बॉर्डर व पल्लू पर जटिल पैटर्न प्रिंटिंग और डाई सुखाने का सुरक्षित तरीका।',
    keySkillsTaught: ['Multi-color Registration', 'Border & Pallu Stamping', 'Pigment Fixation', 'Quality Inspection']
  }
];
