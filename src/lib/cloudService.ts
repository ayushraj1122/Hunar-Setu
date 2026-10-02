import {
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  onSnapshot
} from 'firebase/firestore';
import { db } from './firebase';
import { Product, SHGProfile, OrderItem, SHGAllocation, UserAccount, LectureCourse } from '../types';
import { INITIAL_PRODUCTS, SHG_COURSES } from '../data/seedData';

const PRODUCTS_COLLECTION = 'products';
const SHG_COLLECTION = 'shg_profiles';
const ORDERS_COLLECTION = 'orders';
const USER_ACCOUNTS_COLLECTION = 'user_accounts';
const TRAINING_VIDEOS_COLLECTION = 'training_videos';

// Order deduplication helper to ensure no duplicate rows appear across screens
export function deduplicateOrders(orderList: OrderItem[]): OrderItem[] {
  const map = new Map<string, OrderItem>();
  for (const o of orderList) {
    if (!o || !o.id) continue;
    if (map.has(o.id)) {
      const existing = map.get(o.id)!;
      const hasAllocations = (o.allocations && o.allocations.length > 0) || (o.assignedShgId && o.productionStatus !== 'Unassigned');
      const existingHas = (existing.allocations && existing.allocations.length > 0) || (existing.assignedShgId && existing.productionStatus !== 'Unassigned');
      if (hasAllocations && !existingHas) {
        map.set(o.id, o);
      } else if (!existingHas && !hasAllocations) {
        map.set(o.id, o);
      }
    } else {
      map.set(o.id, o);
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
  );
}

// Ensure cloud products are initialized so buyer and admin share real Firestore state
export async function initializeCloudProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (querySnapshot.empty) {
      console.log('Seeding initial products into Firestore...');
      for (const prod of INITIAL_PRODUCTS) {
        await setDoc(doc(db, PRODUCTS_COLLECTION, prod.id), prod.toJSON());
      }
      return INITIAL_PRODUCTS;
    } else {
      const prods: Product[] = [];
      querySnapshot.forEach((snap) => {
        prods.push(new Product({ id: snap.id, ...snap.data() }));
      });
      return prods;
    }
  } catch (err) {
    console.error('Error in initializeCloudProducts:', err);
    return INITIAL_PRODUCTS;
  }
}

// Fetch all products from Firestore
export async function getCloudProducts(): Promise<Product[]> {
  try {
    const querySnapshot = await getDocs(collection(db, PRODUCTS_COLLECTION));
    if (querySnapshot.empty) {
      return await initializeCloudProducts();
    }
    const list: Product[] = [];
    querySnapshot.forEach((d) => {
      list.push(new Product({ id: d.id, ...d.data() }));
    });
    return list;
  } catch (err) {
    console.error('Error fetching cloud products:', err);
    return INITIAL_PRODUCTS;
  }
}

// Admin: Save or update product in Firestore
export async function saveProductToCloud(product: Product): Promise<void> {
  const prodRef = doc(db, PRODUCTS_COLLECTION, product.id);
  await setDoc(prodRef, product.toJSON(), { merge: true });
}

// Subscribe to real-time products
export function subscribeToProducts(callback: (products: Product[]) => void) {
  const q = collection(db, PRODUCTS_COLLECTION);
  return onSnapshot(q, (snapshot) => {
    const prods: Product[] = [];
    snapshot.forEach((docSnap) => {
      prods.push(new Product({ id: docSnap.id, ...docSnap.data() }));
    });
    callback(prods.length > 0 ? prods : INITIAL_PRODUCTS);
  }, (err) => {
    console.warn('Real-time snapshot error, falling back:', err);
    callback(INITIAL_PRODUCTS);
  });
}

// SHG Profiles API
export async function getSHGProfile(shgId: string): Promise<SHGProfile | null> {
  try {
    const docRef = doc(db, SHG_COLLECTION, shgId);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return { id: snap.id, ...snap.data() } as SHGProfile;
    }
    return null;
  } catch (err) {
    console.error('Error getting SHG profile:', err);
    return null;
  }
}

export async function saveSHGProfile(profile: SHGProfile): Promise<void> {
  const docRef = doc(db, SHG_COLLECTION, profile.id);
  await setDoc(docRef, profile, { merge: true });
}

export async function getAllSHGs(): Promise<SHGProfile[]> {
  try {
    const snapshot = await getDocs(collection(db, SHG_COLLECTION));
    const list: SHGProfile[] = [];
    snapshot.forEach((snap) => {
      list.push({ id: snap.id, ...snap.data() } as SHGProfile);
    });
    return list;
  } catch (err) {
    console.error('Error fetching SHGs:', err);
    return [];
  }
}

// Subscribe to all SHGs
export function subscribeToSHGs(callback: (shgs: SHGProfile[]) => void) {
  return onSnapshot(collection(db, SHG_COLLECTION), (snapshot) => {
    const list: SHGProfile[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as SHGProfile);
    });
    callback(list);
  }, (err) => {
    console.warn('SHG subscription error:', err);
  });
}

// Orders API
export async function createOrder(order: OrderItem): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, order.id);
  await setDoc(docRef, order);
}

export async function getAllOrders(): Promise<OrderItem[]> {
  try {
    const snapshot = await getDocs(collection(db, ORDERS_COLLECTION));
    const list: OrderItem[] = [];
    snapshot.forEach((snap) => {
      list.push({ id: snap.id, ...snap.data() } as OrderItem);
    });
    return deduplicateOrders(list);
  } catch (err) {
    console.error('Error getting orders:', err);
    return [];
  }
}

export function subscribeToOrders(callback: (orders: OrderItem[]) => void) {
  return onSnapshot(collection(db, ORDERS_COLLECTION), (snapshot) => {
    const list: OrderItem[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as OrderItem);
    });
    callback(deduplicateOrders(list));
  }, (err) => {
    console.warn('Orders subscription error:', err);
  });
}

// Update single SHG assignment
export async function updateOrderAssignment(orderId: string, shgId: string, shgName: string): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  const snap = await getDoc(docRef);
  const existing = snap.exists() ? (snap.data() as OrderItem) : null;
  const singleAllocation: SHGAllocation = {
    shgId,
    shgName,
    quantity: existing ? existing.quantity : 1,
    productionStatus: 'Assigned',
    assignedAt: new Date().toISOString()
  };

  await updateDoc(docRef, {
    assignedShgId: shgId,
    assignedShgName: shgName,
    productionStatus: 'Assigned',
    allocations: [singleAllocation]
  });
}

// Distribute the same order to multiple SHGs with custom split quantities
export async function updateOrderAllocations(
  orderId: string,
  allocations: SHGAllocation[]
): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  const totalAllocated = allocations.reduce((sum, a) => sum + (Number(a.quantity) || 0), 0);
  
  let overallStatus: OrderItem['productionStatus'] = 'Assigned';
  if (allocations.length === 0 || totalAllocated === 0) {
    overallStatus = 'Unassigned';
  } else if (allocations.every((a) => a.productionStatus === 'Completed')) {
    overallStatus = 'Completed';
  } else if (allocations.every((a) => a.productionStatus === 'Cancelled')) {
    overallStatus = 'Cancelled';
  } else if (allocations.some((a) => a.productionStatus === 'In Production')) {
    overallStatus = 'In Production';
  }

  const primaryName = allocations.length === 1 
    ? allocations[0].shgName 
    : allocations.map((a) => `${a.shgName} (${a.quantity} pcs)`).join(', ');
  const primaryId = allocations.length === 1 ? allocations[0].shgId : (allocations[0]?.shgId || '');

  await updateDoc(docRef, {
    allocations,
    assignedShgId: primaryId || null,
    assignedShgName: primaryName || null,
    productionStatus: overallStatus
  });
}

// Update order status - supports updating a specific SHG's allocation
export async function updateOrderProductionStatus(
  orderId: string,
  status: 'In Production' | 'Completed' | 'Cancelled',
  specificShgId?: string
): Promise<void> {
  const docRef = doc(db, ORDERS_COLLECTION, orderId);
  if (specificShgId) {
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      const data = snap.data() as OrderItem;
      let allocations = data.allocations || [];
      if (allocations.length > 0) {
        allocations = allocations.map((a) =>
          a.shgId === specificShgId ? { ...a, productionStatus: status } : a
        );
        let overallStatus: OrderItem['productionStatus'] = 'Assigned';
        if (allocations.every((a) => a.productionStatus === 'Completed')) {
          overallStatus = 'Completed';
        } else if (allocations.every((a) => a.productionStatus === 'Cancelled')) {
          overallStatus = 'Cancelled';
        } else if (allocations.some((a) => a.productionStatus === 'In Production')) {
          overallStatus = 'In Production';
        }

        await updateDoc(docRef, {
          allocations,
          productionStatus: overallStatus
        });
        return;
      }
    }
  }

  // General update if not multi-SHG specific
  await updateDoc(docRef, {
    productionStatus: status
  });
}

// ==================== SHG TRAINING VIDEOS / CURRICULUM ====================

// Initialize training videos in Firestore if not already present
export async function initializeCloudTrainingVideos(): Promise<LectureCourse[]> {
  try {
    const querySnapshot = await getDocs(collection(db, TRAINING_VIDEOS_COLLECTION));
    if (querySnapshot.empty) {
      console.log('Seeding initial SHG training videos into Firestore...');
      for (const course of SHG_COURSES) {
        await setDoc(doc(db, TRAINING_VIDEOS_COLLECTION, course.id), course);
      }
      return SHG_COURSES;
    } else {
      const courses: LectureCourse[] = [];
      querySnapshot.forEach((snap) => {
        courses.push({ id: snap.id, ...snap.data() } as LectureCourse);
      });
      return courses;
    }
  } catch (err) {
    console.error('Error in initializeCloudTrainingVideos:', err);
    return SHG_COURSES;
  }
}

// Fetch all training videos from Firestore
export async function getCloudTrainingVideos(): Promise<LectureCourse[]> {
  try {
    const querySnapshot = await getDocs(collection(db, TRAINING_VIDEOS_COLLECTION));
    if (querySnapshot.empty) {
      return await initializeCloudTrainingVideos();
    }
    const list: LectureCourse[] = [];
    querySnapshot.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as LectureCourse);
    });
    return list;
  } catch (err) {
    console.error('Error fetching training videos:', err);
    return SHG_COURSES;
  }
}

// Save or update a training video in Firestore
export async function saveTrainingVideoToCloud(video: LectureCourse): Promise<void> {
  const docRef = doc(db, TRAINING_VIDEOS_COLLECTION, video.id);
  await setDoc(docRef, video, { merge: true });
}

// Delete a training video from Firestore
export async function deleteTrainingVideoFromCloud(videoId: string): Promise<void> {
  const docRef = doc(db, TRAINING_VIDEOS_COLLECTION, videoId);
  await deleteDoc(docRef);
}

// Subscribe to real-time updates for training videos
export function subscribeToTrainingVideos(callback: (courses: LectureCourse[]) => void): () => void {
  return onSnapshot(collection(db, TRAINING_VIDEOS_COLLECTION), (snapshot) => {
    if (snapshot.empty) {
      // If collection was cleared or not yet seeded
      callback(SHG_COURSES);
      return;
    }
    const list: LectureCourse[] = [];
    snapshot.forEach((docSnap) => {
      list.push({ id: docSnap.id, ...docSnap.data() } as LectureCourse);
    });
    callback(list);
  }, (err) => {
    console.warn('Training videos subscription error, using local fallback:', err);
    callback(SHG_COURSES);
  });
}

// ==================== USER ACCOUNTS (EMAIL & PASSWORD) ====================

const DEFAULT_ACCOUNTS: UserAccount[] = [
  {
    id: 'acc_demo_shg',
    email: 'shg.leader@hunarsetu.org',
    password: 'shg123',
    role: 'shg',
    name: 'Pratibha Mahila SHG',
    createdAt: new Date().toISOString()
  },
  {
    id: 'acc_demo_buyer',
    email: 'shopper@hunarsetu.org',
    password: 'buyer123',
    role: 'buyer',
    name: 'Handicraft Enthusiast',
    createdAt: new Date().toISOString()
  }
];

function getLocalAccounts(): UserAccount[] {
  try {
    const raw = localStorage.getItem('hunarsetu_accounts');
    if (raw) return JSON.parse(raw);
  } catch (e) {
    // Ignore localStorage errors
  }
  return DEFAULT_ACCOUNTS;
}

function saveLocalAccount(acc: UserAccount) {
  try {
    const current = getLocalAccounts();
    const filtered = current.filter(
      (a) => !(a.email.toLowerCase() === acc.email.toLowerCase() && a.role === acc.role)
    );
    filtered.push(acc);
    localStorage.setItem('hunarsetu_accounts', JSON.stringify(filtered));
  } catch (e) {
    // Ignore
  }
}

/**
 * Find user account by email and role in Firestore (with local fallback)
 */
export async function findUserAccount(
  email: string,
  role: 'shg' | 'buyer'
): Promise<UserAccount | null> {
  const cleanEmail = email.trim().toLowerCase();
  const docId = `${role}_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;

  try {
    const snap = await getDoc(doc(db, USER_ACCOUNTS_COLLECTION, docId));
    if (snap.exists()) {
      return snap.data() as UserAccount;
    }
  } catch (err) {
    console.warn('Firestore findUserAccount fetch error, checking local store:', err);
  }

  // Fallback to local accounts
  const localList = getLocalAccounts();
  const match = localList.find(
    (a) => a.email.toLowerCase() === cleanEmail && a.role === role
  );
  return match || null;
}

/**
 * Save new user account to Firestore and local storage without requiring email verification
 */
export async function registerUserAccount(
  email: string,
  password: string,
  role: 'shg' | 'buyer',
  name?: string
): Promise<UserAccount> {
  const cleanEmail = email.trim().toLowerCase();
  const docId = `${role}_${cleanEmail.replace(/[^a-z0-9]/g, '_')}`;
  const newAccount: UserAccount = {
    id: 'acc_' + Date.now(),
    email: cleanEmail,
    password,
    role,
    name: name?.trim() || (role === 'shg' ? 'Self-Help Group Leader' : 'Artisan Supporter'),
    createdAt: new Date().toISOString()
  };

  try {
    await setDoc(doc(db, USER_ACCOUNTS_COLLECTION, docId), newAccount);
  } catch (err) {
    console.warn('Firestore setDoc error for user account:', err);
  }

  saveLocalAccount(newAccount);
  return newAccount;
}

/**
 * Validate credentials: checks if email exists and if password is correct
 */
export async function authenticateUserWithPassword(
  email: string,
  password: string,
  role: 'shg' | 'buyer'
): Promise<{ success: boolean; account?: UserAccount; error?: string; isNewUser?: boolean }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 3) {
    return { success: false, error: 'Password must be at least 3 characters.' };
  }

  const existingAccount = await findUserAccount(cleanEmail, role);

  if (!existingAccount) {
    return {
      success: false,
      isNewUser: true,
      error: `No ${role.toUpperCase()} account found with "${cleanEmail}". Click "Create Account" below to register instantly.`
    };
  }

  if (existingAccount.password !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please verify and try again.'
    };
  }

  return { success: true, account: existingAccount };
}

