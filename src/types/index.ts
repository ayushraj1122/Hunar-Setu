export interface ProductHighlight {
  [key: string]: string;
}

export interface ReviewItem {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
}

export class Product {
  id: string;
  title: string;
  brand: string;
  category: string;
  shortDescription: string;
  longDescription: string;
  price: number;
  imageUrl: string;
  materials: string;
  highlights: Record<string, string>;
  reviews: ReviewItem[];
  reviewsCount: number;
  rating: number;
  boughtCount: number;
  inStock: boolean;
  createdAt: string;

  constructor(data: Partial<Product>) {
    this.id = data.id || '';
    this.title = data.title || '';
    this.brand = data.brand || 'Hunar Artisan SHG';
    this.category = data.category || 'Handicrafts';
    this.shortDescription = data.shortDescription || '';
    this.longDescription = data.longDescription || '';
    this.price = Number(data.price || 0);
    this.imageUrl = data.imageUrl || 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&auto=format&fit=crop&q=60';
    this.materials = data.materials || 'Eco-friendly natural fibers & terracotta';
    this.highlights = data.highlights || {};
    this.reviews = data.reviews || [];
    this.reviewsCount = data.reviewsCount || (this.reviews.length || 0);
    this.rating = data.rating || 4.8;
    this.boughtCount = data.boughtCount || 120;
    this.inStock = data.inStock !== false;
    this.createdAt = data.createdAt || new Date().toISOString();
  }

  toJSON() {
    return {
      id: this.id,
      title: this.title,
      brand: this.brand,
      category: this.category,
      shortDescription: this.shortDescription,
      longDescription: this.longDescription,
      price: this.price,
      imageUrl: this.imageUrl,
      materials: this.materials,
      highlights: this.highlights,
      reviews: this.reviews,
      reviewsCount: this.reviewsCount,
      rating: this.rating,
      boughtCount: this.boughtCount,
      inStock: this.inStock,
      createdAt: this.createdAt
    };
  }
}

export interface SHGMember {
  id: string;
  name: string;
  aadhaarNumber: string; // 12-digit format masked or noted
  skill: string;
  experienceYears?: number;
  phone?: string;
}

export interface SHGProfile {
  id: string;
  groupName: string;
  regNumber: string;
  district: string;
  state: string;
  contactPhone: string;
  leaderEmail: string;
  leaderUid?: string;
  overallSkill: string;
  members: SHGMember[];
  videoProgress: Record<string, number>; // lectureId -> percent 0-100
  completedLectures: string[];
  createdAt: string;
}

export interface LectureCourse {
  id: string;
  title: string;
  category: string;
  instructor: string;
  duration: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  youtubeId: string;
  youtubeUrl: string;
  thumbnail: string;
  description: string;
  keySkillsTaught: string[];
}

export interface SHGAllocation {
  shgId: string;
  shgName: string;
  quantity: number; // Allocated quantity to this specific SHG
  productionStatus: 'Assigned' | 'In Production' | 'Completed' | 'Cancelled';
  assignedAt?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  productPrice: number;
  quantity: number; // Overall total order quantity
  totalAmount: number;
  buyerEmail: string;
  buyerName: string;
  buyerAddress: string;
  buyerPhone: string;
  paymentStatus: 'Paid' | 'Processing' | 'Pending';
  assignedShgId?: string;
  assignedShgName?: string;
  productionStatus: 'Unassigned' | 'Assigned' | 'In Production' | 'Completed' | 'Cancelled';
  allocations?: SHGAllocation[]; // Support distributing the same order to multiple SHGs
  orderDate: string;
}

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  role: 'shg' | 'buyer';
  name?: string;
  createdAt: string;
}
