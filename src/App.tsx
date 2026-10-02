import React, { useState, useEffect } from 'react';
import { LandingHero } from './components/LandingHero';
import { SHGPortal } from './components/SHGPortal';
import { BuyerPortal } from './components/BuyerPortal';
import { AdminPortal } from './components/AdminPortal';
import { Product, SHGProfile, OrderItem, SHGAllocation, LectureCourse } from './types';
import {
  initializeCloudProducts,
  getCloudProducts,
  saveProductToCloud,
  subscribeToProducts,
  getAllSHGs,
  saveSHGProfile,
  subscribeToSHGs,
  getAllOrders,
  createOrder,
  subscribeToOrders,
  updateOrderAssignment,
  updateOrderAllocations,
  updateOrderProductionStatus,
  deduplicateOrders,
  initializeCloudTrainingVideos,
  getCloudTrainingVideos,
  saveTrainingVideoToCloud,
  deleteTrainingVideoFromCloud,
  subscribeToTrainingVideos
} from './lib/cloudService';
import { INITIAL_PRODUCTS, SHG_COURSES } from './data/seedData';

export default function App() {
  // Navigation Role state: null (Landing page) | 'shg' | 'buyer' | 'admin'
  // Per requirement: "also it has three login things ..for all three login completely separate the page and make everything fromm newly started page after each three login"
  const [currentRole, setCurrentRole] = useState<'shg' | 'buyer' | 'admin' | null>(null);
  const [activeUserEmail, setActiveUserEmail] = useState<string>('');

  // Data states synced with Cloud Firestore
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [orders, setOrders] = useState<OrderItem[]>([]);
  const [shgList, setShgList] = useState<SHGProfile[]>([]);
  const [courses, setCourses] = useState<LectureCourse[]>(SHG_COURSES);
  const [currentSHG, setCurrentSHG] = useState<SHGProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize and subscribe to Firestore on mount
  useEffect(() => {
    let unsubscribeProducts: (() => void) | undefined;
    let unsubscribeOrders: (() => void) | undefined;
    let unsubscribeSHGs: (() => void) | undefined;
    let unsubscribeCourses: (() => void) | undefined;

    async function initDatabase() {
      try {
        setLoading(true);
        // Ensure products are in cloud
        const initialProds = await initializeCloudProducts();
        setProducts(initialProds);

        // Fetch initial orders & SHGs
        const initialOrders = await getAllOrders();
        setOrders(initialOrders);

        const initialSHGs = await getAllSHGs();
        setShgList(initialSHGs);

        // Initialize and fetch training videos
        const initialCourses = await initializeCloudTrainingVideos();
        setCourses(initialCourses);

        // Realtime Firestore listeners
        unsubscribeProducts = subscribeToProducts((cloudProds) => {
          setProducts(cloudProds);
        });

        unsubscribeOrders = subscribeToOrders((cloudOrders) => {
          setOrders(cloudOrders);
        });

        unsubscribeSHGs = subscribeToSHGs((cloudSHGs) => {
          setShgList(cloudSHGs);
        });

        unsubscribeCourses = subscribeToTrainingVideos((cloudCourses) => {
          setCourses(cloudCourses);
        });
      } catch (err) {
        console.warn('Database initialization caught error, using local fallback:', err);
      } finally {
        setLoading(false);
      }
    }

    initDatabase();

    return () => {
      if (unsubscribeProducts) unsubscribeProducts();
      if (unsubscribeOrders) unsubscribeOrders();
      if (unsubscribeSHGs) unsubscribeSHGs();
      if (unsubscribeCourses) unsubscribeCourses();
    };
  }, []);

  // Update current SHG when shgList changes or email changes
  useEffect(() => {
    if (activeUserEmail) {
      const clean = activeUserEmail.trim().toLowerCase();
      const found = shgList.find(
        (s) => s.leaderEmail && s.leaderEmail.trim().toLowerCase() === clean
      );
      if (found) {
        setCurrentSHG(found);
      } else {
        // Critical: When logging in with a new SHG email, currentSHG MUST be null
        // so that the old SHG data is NOT visible and a fresh registration page opens.
        setCurrentSHG(null);
      }
    } else {
      setCurrentSHG(null);
    }
  }, [shgList, activeUserEmail]);

  // Role selection from landing page
  const handleSelectRole = (role: 'shg' | 'buyer' | 'admin', userEmail?: string) => {
    if (userEmail) {
      const clean = userEmail.trim().toLowerCase();
      setActiveUserEmail(clean);
      if (role === 'shg') {
        const found = shgList.find(
          (s) => s.leaderEmail && s.leaderEmail.trim().toLowerCase() === clean
        );
        setCurrentSHG(found || null);
      }
    } else {
      setActiveUserEmail('');
      setCurrentSHG(null);
    }
    setCurrentRole(role);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentRole(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Buyer placing order (Cloud synchronized)
  const handlePlaceOrder = async (orderData: {
    product: Product;
    quantity: number;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerAddress: string;
  }) => {
    const newOrder: OrderItem = {
      id: 'order_' + Date.now(),
      productId: orderData.product.id,
      productTitle: orderData.product.title,
      productImage: orderData.product.imageUrl,
      productPrice: orderData.product.price,
      quantity: orderData.quantity,
      totalAmount: orderData.product.price * orderData.quantity,
      buyerEmail: orderData.buyerEmail,
      buyerName: orderData.buyerName,
      buyerAddress: orderData.buyerAddress,
      buyerPhone: orderData.buyerPhone,
      paymentStatus: 'Paid', // Per requirement: buyer confirms yes -> considered paid
      productionStatus: 'Unassigned',
      orderDate: new Date().toISOString()
    };

    // Save to Firestore so admin gets the order live
    await createOrder(newOrder);

    // Also update locally with strict deduplication
    setOrders((prev) => deduplicateOrders([newOrder, ...prev]));
  };

  // SHG profile save
  const handleSaveSHGProfile = async (profile: SHGProfile) => {
    await saveSHGProfile(profile);
    setCurrentSHG(profile);
    setShgList((prev) => {
      const idx = prev.findIndex((s) => s.id === profile.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = profile;
        return updated;
      }
      return [...prev, profile];
    });
  };

  // SHG order status change (Complete or Cancel) - supports per-SHG allocation status
  const handleUpdateOrderStatus = async (
    orderId: string,
    status: 'In Production' | 'Completed' | 'Cancelled',
    shgId?: string
  ) => {
    await updateOrderProductionStatus(orderId, status, shgId);
    setOrders((prev) =>
      deduplicateOrders(
        prev.map((o) => {
          if (o.id !== orderId) return o;
          if (shgId && o.allocations && o.allocations.length > 0) {
            const updatedAllocations = o.allocations.map((a) =>
              a.shgId === shgId ? { ...a, productionStatus: status } : a
            );
            const allCompleted = updatedAllocations.every((a) => a.productionStatus === 'Completed');
            const allCancelled = updatedAllocations.every((a) => a.productionStatus === 'Cancelled');
            const anyInProd = updatedAllocations.some((a) => a.productionStatus === 'In Production');
            return {
              ...o,
              allocations: updatedAllocations,
              productionStatus: allCompleted
                ? 'Completed'
                : allCancelled
                ? 'Cancelled'
                : anyInProd
                ? 'In Production'
                : 'Assigned'
            };
          }
          return { ...o, productionStatus: status };
        })
      )
    );
  };

  // Admin save product
  const handleAdminSaveProduct = async (product: Product) => {
    await saveProductToCloud(product);
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === product.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = product;
        return updated;
      }
      return [product, ...prev];
    });
  };

  // Admin distribute order to SHG (supports distributing to single or multiple SHGs)
  const handleDistributeOrder = async (orderId: string, allocations: SHGAllocation[]) => {
    await updateOrderAllocations(orderId, allocations);
    const primaryName =
      allocations.length === 1
        ? allocations[0].shgName
        : allocations.map((a) => `${a.shgName} (${a.quantity} pcs)`).join(', ');
    const primaryId = allocations[0]?.shgId || '';

    setOrders((prev) =>
      deduplicateOrders(
        prev.map((o) =>
          o.id === orderId
            ? {
                ...o,
                allocations,
                assignedShgId: primaryId,
                assignedShgName: primaryName,
                productionStatus: allocations.length > 0 ? 'Assigned' : 'Unassigned'
              }
            : o
        )
      )
    );
  };

  // Admin save training course video
  const handleAdminSaveCourse = async (course: LectureCourse) => {
    await saveTrainingVideoToCloud(course);
    setCourses((prev) => {
      const idx = prev.findIndex((c) => c.id === course.id);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = course;
        return updated;
      }
      return [course, ...prev];
    });
  };

  // Admin delete training course video
  const handleAdminDeleteCourse = async (courseId: string) => {
    await deleteTrainingVideoFromCloud(courseId);
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  // Completely separate page view routing per requirement
  if (currentRole === 'shg') {
    return (
      <SHGPortal
        currentSHG={currentSHG}
        activeUserEmail={activeUserEmail}
        orders={orders}
        courses={courses}
        onSaveProfile={handleSaveSHGProfile}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onBackToHome={handleBackToHome}
      />
    );
  }

  if (currentRole === 'buyer') {
    return (
      <BuyerPortal
        products={products}
        activeUserEmail={activeUserEmail}
        onOrderSuccess={() => {}}
        onPlaceOrder={handlePlaceOrder}
        onBackToHome={handleBackToHome}
      />
    );
  }

  if (currentRole === 'admin') {
    return (
      <AdminPortal
        products={products}
        orders={orders}
        shgList={shgList}
        courses={courses}
        onSaveProduct={handleAdminSaveProduct}
        onDistributeOrder={handleDistributeOrder}
        onSaveCourse={handleAdminSaveCourse}
        onDeleteCourse={handleAdminDeleteCourse}
        onBackToHome={handleBackToHome}
      />
    );
  }

  // Default: Landing Page of Hunar-Setu with Hero image and 3 separate login gateways
  return <LandingHero onSelectRole={handleSelectRole} />;
}
