import React, { useState, useMemo } from 'react';
import { Product, SHGProfile, OrderItem, SHGAllocation, LectureCourse } from '../types';
import { deduplicateOrders } from '../lib/cloudService';
import { SHG_COURSES } from '../data/seedData';
import { fetchYouTubeMetadata, extractYouTubeId } from '../lib/youtubeService';
import {
  Package,
  ShoppingBag,
  Users,
  Plus,
  Edit,
  Save,
  Check,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Truck,
  DollarSign,
  Search,
  X,
  Layers,
  Image as ImageIcon,
  Split,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Video,
  Play,
  Film,
  ExternalLink,
  Clock,
  RefreshCw,
  Eye,
  GraduationCap
} from 'lucide-react';

interface AdminPortalProps {
  products: Product[];
  orders: OrderItem[];
  shgList: SHGProfile[];
  courses?: LectureCourse[];
  onSaveProduct: (product: Product) => Promise<void>;
  onDistributeOrder: (orderId: string, allocations: SHGAllocation[]) => Promise<void>;
  onSaveCourse?: (course: LectureCourse) => Promise<void>;
  onDeleteCourse?: (courseId: string) => Promise<void>;
  onBackToHome: () => void;
}

interface AllocationRowState {
  shgId: string;
  quantity: number;
}

const VIDEO_CATEGORIES = [
  'कुम्हारी व मिट्टी कला (Pottery & Terracotta)',
  'हथकरघा व वस्त्र प्रिंटिंग (Handloom & Textile Art)',
  'प्राकृतिक फाइबर व टोकरी निर्माण (Natural Fiber & Basketry)',
  'परिधान एवं सिलाई कार्य (Apparel & Tailoring)',
  'समूह प्रबंधन एवं वित्तीय साक्षरता (SHG Management & Finance)',
  'गुणवत्ता नियंत्रण व पैकेजिंग (Quality Assurance & Packaging)',
  'Other'
];

export const AdminPortal: React.FC<AdminPortalProps> = ({
  products,
  orders,
  shgList,
  courses,
  onSaveProduct,
  onDistributeOrder,
  onSaveCourse,
  onDeleteCourse,
  onBackToHome
}) => {
  const coursesList = courses && courses.length > 0 ? courses : SHG_COURSES;
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'shgs' | 'videos'>('orders');

  // Product Editing / Creation Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Form states for product
  const [formTitle, setFormTitle] = useState('');
  const [formBrand, setFormBrand] = useState('');
  const [formCategory, setFormCategory] = useState('');
  const [formPrice, setFormPrice] = useState<number>(500);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formLongDesc, setFormLongDesc] = useState('');
  const [formMaterials, setFormMaterials] = useState('');
  const [formHighlights, setFormHighlights] = useState<Array<{ key: string; value: string }>>([
    { key: 'Craft Technique', value: 'Traditional Handloom' },
    { key: 'Origin', value: 'India' }
  ]);

  // Multi-SHG Order Distribution selection modal
  const [distributingOrder, setDistributingOrder] = useState<OrderItem | null>(null);
  const [allocationRows, setAllocationRows] = useState<AllocationRowState[]>([]);
  const [distributeError, setDistributeError] = useState<string>('');

  const openProductModal = (prod?: Product) => {
    if (prod) {
      setIsCreatingNew(false);
      setEditingProduct(prod);
      setFormTitle(prod.title);
      setFormBrand(prod.brand);
      setFormCategory(prod.category);
      setFormPrice(prod.price);
      setFormImageUrl(prod.imageUrl);
      setFormShortDesc(prod.shortDescription);
      setFormLongDesc(prod.longDescription);
      setFormMaterials(prod.materials);
      const hlArray = Object.entries(prod.highlights || {}).map(([k, v]) => ({ key: k, value: v }));
      setFormHighlights(hlArray.length > 0 ? hlArray : [{ key: 'Craft Technique', value: '' }]);
    } else {
      setIsCreatingNew(true);
      setEditingProduct(null);
      setFormTitle('');
      setFormBrand('Maitri Mahila SHG');
      setFormCategory('Handicrafts');
      setFormPrice(750);
      setFormImageUrl('https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&auto=format&fit=crop&q=80');
      setFormShortDesc('');
      setFormLongDesc('');
      setFormMaterials('Organic cotton & plant dye');
      setFormHighlights([
        { key: 'Craft Technique', value: 'Handmade' },
        { key: 'Material Origin', value: 'Rural India' }
      ]);
    }
  };

  const handleAddHighlightRow = () => {
    setFormHighlights([...formHighlights, { key: '', value: '' }]);
  };

  const handleRemoveHighlightRow = (index: number) => {
    setFormHighlights(formHighlights.filter((_, i) => i !== index));
  };

  const handleHighlightChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...formHighlights];
    updated[index][field] = val;
    setFormHighlights(updated);
  };

  const handleSaveProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const highlightsObj: Record<string, string> = {};
    formHighlights.forEach((item) => {
      if (item.key.trim()) {
        highlightsObj[item.key.trim()] = item.value.trim();
      }
    });

    const targetProduct = new Product({
      id: editingProduct?.id || 'prod_' + Date.now(),
      title: formTitle,
      brand: formBrand,
      category: formCategory,
      price: Number(formPrice),
      imageUrl: formImageUrl || 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=800&auto=format&fit=crop&q=80',
      shortDescription: formShortDesc,
      longDescription: formLongDesc,
      materials: formMaterials,
      highlights: highlightsObj,
      reviews: editingProduct?.reviews || [],
      reviewsCount: editingProduct?.reviewsCount || 0,
      rating: editingProduct?.rating || 4.9,
      boughtCount: editingProduct?.boughtCount || 0,
      inStock: true,
      createdAt: editingProduct?.createdAt || new Date().toISOString()
    });

    await onSaveProduct(targetProduct);
    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  // Strictly deduplicate orders so no duplicate row ever appears in the admin screen
  const uniqueOrders = useMemo(() => deduplicateOrders(orders), [orders]);

  // Open distribution modal: initialize rows with existing allocations or default single SHG
  const openDistributeModal = (order: OrderItem) => {
    setDistributingOrder(order);
    setDistributeError('');

    if (order.allocations && order.allocations.length > 0) {
      setAllocationRows(
        order.allocations.map((a) => ({
          shgId: a.shgId,
          quantity: a.quantity
        }))
      );
    } else if (order.assignedShgId) {
      setAllocationRows([
        {
          shgId: order.assignedShgId,
          quantity: order.quantity
        }
      ]);
    } else {
      setAllocationRows([
        {
          shgId: shgList[0]?.id || '',
          quantity: order.quantity
        }
      ]);
    }
  };

  const totalAllocated = allocationRows.reduce((sum, r) => sum + (Number(r.quantity) || 0), 0);
  const remainingQty = (distributingOrder?.quantity || 0) - totalAllocated;

  const handleAddAllocationRow = () => {
    if (!distributingOrder) return;
    const usedIds = new Set(allocationRows.map((r) => r.shgId));
    const nextAvailable = shgList.find((s) => !usedIds.has(s.id)) || shgList[0];
    const defaultQty = remainingQty > 0 ? remainingQty : 1;
    setAllocationRows([
      ...allocationRows,
      {
        shgId: nextAvailable?.id || '',
        quantity: defaultQty
      }
    ]);
  };

  const handleRemoveAllocationRow = (index: number) => {
    if (allocationRows.length <= 1) return;
    setAllocationRows(allocationRows.filter((_, idx) => idx !== index));
  };

  const handleUpdateRowShg = (index: number, shgId: string) => {
    setAllocationRows(
      allocationRows.map((r, idx) => (idx === index ? { ...r, shgId } : r))
    );
  };

  const handleUpdateRowQuantity = (index: number, quantity: number) => {
    setAllocationRows(
      allocationRows.map((r, idx) => (idx === index ? { ...r, quantity: Math.max(1, quantity) } : r))
    );
  };

  const handleSplitEvenly = () => {
    if (!distributingOrder || allocationRows.length === 0) return;
    const count = allocationRows.length;
    const base = Math.floor(distributingOrder.quantity / count);
    let remainder = distributingOrder.quantity % count;
    setAllocationRows(
      allocationRows.map((r) => {
        const qty = base + (remainder > 0 ? 1 : 0);
        if (remainder > 0) remainder--;
        return { ...r, quantity: Math.max(1, qty) };
      })
    );
  };

  const handleAssignAllToSingle = () => {
    if (!distributingOrder) return;
    const targetShgId = allocationRows[0]?.shgId || shgList[0]?.id || '';
    setAllocationRows([
      {
        shgId: targetShgId,
        quantity: distributingOrder.quantity
      }
    ]);
  };

  const handleConfirmDistribution = async () => {
    if (!distributingOrder) return;

    if (allocationRows.length === 0) {
      setDistributeError('Please add at least one SHG group to allocate this order.');
      return;
    }

    if (allocationRows.some((r) => !r.shgId)) {
      setDistributeError('Please select a valid SHG collective for each allocation row.');
      return;
    }

    if (allocationRows.some((r) => Number(r.quantity) <= 0)) {
      setDistributeError('Each allocated quantity must be at least 1 unit.');
      return;
    }

    if (totalAllocated !== distributingOrder.quantity) {
      setDistributeError(
        `Total allocated count (${totalAllocated} pcs) does not equal the order requirement (${distributingOrder.quantity} pcs). Please balance the quantities so the overall count remains exactly ${distributingOrder.quantity} pcs.`
      );
      return;
    }

    const allocations: SHGAllocation[] = allocationRows.map((r) => {
      const shg = shgList.find((s) => s.id === r.shgId);
      const existingStatus =
        distributingOrder.allocations?.find((a) => a.shgId === r.shgId)?.productionStatus ||
        'Assigned';
      return {
        shgId: r.shgId,
        shgName: shg ? shg.groupName : 'Assigned SHG Collective',
        quantity: Number(r.quantity),
        productionStatus: existingStatus,
        assignedAt: new Date().toISOString()
      };
    });

    await onDistributeOrder(distributingOrder.id, allocations);
    setDistributingOrder(null);
    setAllocationRows([]);
    setDistributeError('');
  };

  // ==================== TRAINING VIDEO MANAGEMENT STATES ====================
  const [editingVideo, setEditingVideo] = useState<LectureCourse | null>(null);
  const [isCreatingNewVideo, setIsCreatingNewVideo] = useState<boolean>(false);
  const [videoToDelete, setVideoToDelete] = useState<LectureCourse | null>(null);
  const [previewingVideo, setPreviewingVideo] = useState<LectureCourse | null>(null);
  const [videoNotification, setVideoNotification] = useState<string | null>(null);

  // Search and filter for videos
  const [videoSearchQuery, setVideoSearchQuery] = useState<string>('');
  const [videoCategoryFilter, setVideoCategoryFilter] = useState<string>('All');

  // Form states for training video
  const [videoInputUrl, setVideoInputUrl] = useState<string>('');
  const [isFetchingVideo, setIsFetchingVideo] = useState<boolean>(false);
  const [fetchVideoError, setFetchVideoError] = useState<string>('');
  const [fetchVideoSuccess, setFetchVideoSuccess] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [videoCategory, setVideoCategory] = useState<string>(VIDEO_CATEGORIES[0]);
  const [videoCustomCategory, setVideoCustomCategory] = useState<string>('');
  const [videoLevel, setVideoLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced'>('Beginner');
  const [videoDuration, setVideoDuration] = useState<string>('15 mins');
  const [videoInstructor, setVideoInstructor] = useState<string>('');
  const [videoYoutubeId, setVideoYoutubeId] = useState<string>('');
  const [videoYoutubeUrl, setVideoYoutubeUrl] = useState<string>('');
  const [videoThumbnail, setVideoThumbnail] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [videoSkillsString, setVideoSkillsString] = useState<string>('');

  // Auto-fetch YouTube metadata
  const handleAutoFetchVideoDetails = async (urlOrId: string) => {
    if (!urlOrId || !urlOrId.trim()) {
      setFetchVideoError('Please paste a YouTube video link or 11-character video ID.');
      return;
    }
    const detectedId = extractYouTubeId(urlOrId);
    if (!detectedId) {
      setFetchVideoError('Could not recognize a valid YouTube URL or video ID. Example: https://www.youtube.com/watch?v=pr8yDXUPZw0');
      return;
    }

    setIsFetchingVideo(true);
    setFetchVideoError('');
    setFetchVideoSuccess('');

    try {
      const meta = await fetchYouTubeMetadata(urlOrId);
      setVideoYoutubeId(meta.youtubeId);
      setVideoYoutubeUrl(meta.youtubeUrl);
      setVideoThumbnail(meta.thumbnail);
      setVideoInstructor(meta.instructor || 'Crafts Instructor');

      // Autofill title if newly adding or empty
      if (!videoTitle || isCreatingNewVideo) {
        setVideoTitle(meta.title);
      }
      // Set the exact retrieved YouTube duration in MM:SS format
      if (meta.duration) {
        setVideoDuration(meta.duration);
      }
      if (!videoDescription) {
        setVideoDescription(`व्यावहारिक शिल्प प्रशिक्षण सत्र: ${meta.title}। कारीगरों के लिए विशेष मार्गदर्शन।`);
      }
      setFetchVideoSuccess(
        `✓ Video stream verified! Channel: "${meta.instructor}" • Exact Duration: ${meta.duration}`
      );
    } catch (err) {
      console.error('Error fetching YouTube metadata:', err);
      setFetchVideoError(err instanceof Error ? err.message : 'Failed to fetch YouTube details.');
    } finally {
      setIsFetchingVideo(false);
    }
  };

  const openVideoModal = (video?: LectureCourse) => {
    setFetchVideoError('');
    setFetchVideoSuccess('');
    if (video) {
      setIsCreatingNewVideo(false);
      setEditingVideo(video);
      setVideoInputUrl(video.youtubeUrl);
      setVideoTitle(video.title);
      const isKnownCategory = VIDEO_CATEGORIES.includes(video.category);
      setVideoCategory(isKnownCategory ? video.category : 'Other');
      setVideoCustomCategory(isKnownCategory ? '' : video.category);
      setVideoLevel(video.level || 'Beginner');
      setVideoDuration(video.duration || '15:00');
      setVideoInstructor(video.instructor || 'Crafts Instructor');
      setVideoYoutubeId(video.youtubeId);
      setVideoYoutubeUrl(video.youtubeUrl);
      setVideoThumbnail(video.thumbnail);
      setVideoDescription(video.description || '');
      setVideoSkillsString((video.keySkillsTaught || []).join(', '));
    } else {
      setIsCreatingNewVideo(true);
      setEditingVideo(null);
      setVideoInputUrl('');
      setVideoTitle('');
      setVideoCategory(VIDEO_CATEGORIES[0]);
      setVideoCustomCategory('');
      setVideoLevel('Beginner');
      setVideoDuration('');
      setVideoInstructor('');
      setVideoYoutubeId('');
      setVideoYoutubeUrl('');
      setVideoThumbnail('');
      setVideoDescription('');
      setVideoSkillsString('पारंपरिक शिल्प कला, सामग्री चयन, गुणवत्ता मानक');
    }
  };

  const handleSaveVideoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoYoutubeId) {
      setFetchVideoError('Please enter a valid YouTube link or fetch details before saving.');
      return;
    }
    if (!videoTitle.trim()) {
      setFetchVideoError('Video title is required.');
      return;
    }

    const finalCategory = videoCategory === 'Other' && videoCustomCategory.trim()
      ? videoCustomCategory.trim()
      : videoCategory;

    const skillsArray = videoSkillsString
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const targetVideo: LectureCourse = {
      id: editingVideo?.id || 'lec_' + Date.now(),
      title: videoTitle.trim(),
      category: finalCategory,
      instructor: videoInstructor || 'Master Artisan Instructor',
      duration: videoDuration.trim() || '15:00',
      level: videoLevel,
      youtubeId: videoYoutubeId,
      youtubeUrl: videoYoutubeUrl || `https://www.youtube.com/watch?v=${videoYoutubeId}`,
      thumbnail: videoThumbnail || `https://img.youtube.com/vi/${videoYoutubeId}/hqdefault.jpg`,
      description: videoDescription.trim() || `Masterclass craft lecture for self-help group artisans.`,
      keySkillsTaught: skillsArray.length > 0 ? skillsArray : ['Craft Skills', 'Technique']
    };

    if (onSaveCourse) {
      await onSaveCourse(targetVideo);
    }

    setEditingVideo(null);
    setIsCreatingNewVideo(false);
    setVideoNotification(`Video "${targetVideo.title}" has been saved and published to all SHGs!`);
    setTimeout(() => setVideoNotification(null), 4500);
  };

  const handleConfirmDeleteVideo = async () => {
    if (!videoToDelete) return;
    const title = videoToDelete.title;
    if (onDeleteCourse) {
      await onDeleteCourse(videoToDelete.id);
    }
    setVideoToDelete(null);
    setVideoNotification(`Video "${title}" was permanently removed from all SHG curriculums.`);
    setTimeout(() => setVideoNotification(null), 4500);
  };

  // Filtered training videos
  const filteredVideos = useMemo(() => {
    return coursesList.filter((c) => {
      const q = videoSearchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.title.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.keySkillsTaught?.some((s) => s.toLowerCase().includes(q));

      const matchesCategory =
        videoCategoryFilter === 'All' || c.category === videoCategoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [coursesList, videoSearchQuery, videoCategoryFilter]);

  // Metrics using deduplicated orders
  const totalRevenue = uniqueOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);
  const pendingOrders = uniqueOrders.filter(
    (o) =>
      (!o.assignedShgId && (!o.allocations || o.allocations.length === 0)) ||
      o.productionStatus === 'Unassigned'
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Admin Header Bar */}
      <header className="sticky top-0 z-40 bg-slate-900 text-white border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500 text-white flex items-center justify-center font-bold text-sm">
                HS
              </div>
              <span className="font-bold text-lg text-white">Hunar-Setu</span>
            </button>
            <span className="text-slate-600">/</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-500/20 text-emerald-300 rounded-md border border-emerald-500/30">
              Admin Control Center
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Logged in as: <span className="text-white font-mono font-semibold">admin</span>
            </span>
            <button
              id="admin-logout-btn"
              onClick={onBackToHome}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 border-t border-slate-800/80">
          <button
            id="admin-tab-orders"
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'orders'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            Buyer Orders ({uniqueOrders.length})
            {pendingOrders.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-900 text-[10px] font-extrabold">
                {pendingOrders.length} Unassigned
              </span>
            )}
          </button>

          <button
            id="admin-tab-products"
            onClick={() => setActiveTab('products')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'products'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Product Catalog Management ({products.length})
          </button>

          <button
            id="admin-tab-shgs"
            onClick={() => setActiveTab('shgs')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'shgs'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" />
            Registered SHG Groups ({shgList.length})
          </button>

          <button
            id="admin-tab-videos"
            onClick={() => setActiveTab('videos')}
            className={`py-3 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'videos'
                ? 'border-emerald-500 text-emerald-400 bg-slate-800/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Video className="w-4 h-4" />
            SHG Training Videos ({coursesList.length})
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Metric Overview Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase">Total Buyer Gross Value</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">₹{totalRevenue.toLocaleString('en-IN')}</p>
            <span className="text-[11px] text-emerald-600 font-medium">Cloud synchronized</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase">Active Orders In Pipeline</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{uniqueOrders.length}</p>
            <span className="text-[11px] text-amber-600 font-medium">{pendingOrders.length} pending SHG allocation</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase">Connected SHG Collectives</span>
            <p className="text-2xl font-bold text-slate-900 mt-1">{shgList.length}</p>
            <span className="text-[11px] text-slate-500 font-medium">Ready for order distribution</span>
          </div>
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <span className="text-xs text-slate-500 font-semibold uppercase">Published Training Videos</span>
            <p className="text-2xl font-bold text-emerald-700 mt-1">{coursesList.length}</p>
            <span className="text-[11px] text-emerald-600 font-medium">Synced across all SHGs</span>
          </div>
        </div>

        {/* TAB 1: BUYER ORDERS & SHG DISTRIBUTION */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Buyer Orders (Cloud Live)</h2>
                <p className="text-xs text-slate-500">
                  Every order submitted by buyers is stored in Firestore and queued here for SHG production allocation.
                </p>
              </div>
            </div>

            {uniqueOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <ShoppingBag className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-600 font-semibold text-sm">No Buyer Orders Placed Yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  When a buyer clicks Buy Now in the buyer portal, the order appears right here.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-semibold">
                      <tr>
                        <th className="py-3 px-4">Order ID & Date</th>
                        <th className="py-3 px-4">Product Details</th>
                        <th className="py-3 px-4">Qty & Total</th>
                        <th className="py-3 px-4">Buyer Info</th>
                        <th className="py-3 px-4">Payment</th>
                        <th className="py-3 px-4">Assigned SHG</th>
                        <th className="py-3 px-4">Production Status</th>
                        <th className="py-3 px-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {uniqueOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-slate-600">
                            #{order.id.slice(-6)}
                            <span className="block text-[10px] text-slate-400">
                              {new Date(order.orderDate).toLocaleDateString()}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img
                                src={order.productImage}
                                alt={order.productTitle}
                                className="w-10 h-10 rounded-md object-cover border border-slate-200"
                              />
                              <div>
                                <p className="font-semibold text-slate-900 line-clamp-1 max-w-[180px]">
                                  {order.productTitle}
                                </p>
                                <span className="text-[10px] text-slate-400">₹{order.productPrice} / unit</span>
                              </div>
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="font-bold text-slate-900">{order.quantity} pcs</span>
                            <span className="block text-[11px] text-emerald-700 font-semibold">
                              ₹{order.totalAmount.toLocaleString('en-IN')}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            <p className="font-medium text-slate-800">{order.buyerName}</p>
                            <span className="text-[10px] text-slate-400 block truncate max-w-[140px]">{order.buyerAddress}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-[10px]">
                              {order.paymentStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {order.allocations && order.allocations.length > 1 ? (
                              <div className="space-y-1.5 max-w-[240px]">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-2 py-0.5 rounded bg-purple-100 text-purple-900 font-bold text-[10px] flex items-center gap-1">
                                    <Split className="w-3 h-3 text-purple-700" /> Distributed ({order.allocations.length} SHGs)
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-semibold">
                                    {order.allocations.reduce((s, a) => s + (a.quantity || 0), 0)}/{order.quantity} pcs
                                  </span>
                                </div>
                                <div className="space-y-1">
                                  {order.allocations.map((alloc) => (
                                    <div
                                      key={alloc.shgId}
                                      className="flex items-center justify-between text-[11px] bg-slate-50 px-2 py-1 rounded border border-slate-200 gap-2"
                                    >
                                      <span className="font-semibold text-slate-800 truncate" title={alloc.shgName}>
                                        {alloc.shgName}
                                      </span>
                                      <div className="flex items-center gap-1 shrink-0">
                                        <span className="font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                                          {alloc.quantity} pcs
                                        </span>
                                        <span
                                          className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                                            alloc.productionStatus === 'Completed'
                                              ? 'bg-emerald-100 text-emerald-800'
                                              : alloc.productionStatus === 'Cancelled'
                                              ? 'bg-rose-100 text-rose-800'
                                              : alloc.productionStatus === 'In Production'
                                              ? 'bg-blue-100 text-blue-800'
                                              : 'bg-amber-100 text-amber-800'
                                          }`}
                                        >
                                          {alloc.productionStatus}
                                        </span>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : order.allocations && order.allocations.length === 1 ? (
                              <div className="flex items-center gap-1.5">
                                <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded text-[11px]">
                                  {order.allocations[0].shgName}
                                </span>
                                <span className="font-bold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 text-[10px]">
                                  {order.allocations[0].quantity} pcs
                                </span>
                              </div>
                            ) : order.assignedShgName ? (
                              <span className="font-semibold text-slate-800 bg-slate-100 px-2 py-1 rounded text-[11px]">
                                {order.assignedShgName}
                              </span>
                            ) : (
                              <span className="text-amber-700 font-semibold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[10px]">
                                Needs Allocation
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <span
                              className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                                order.productionStatus === 'Completed'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.productionStatus === 'Cancelled'
                                  ? 'bg-rose-100 text-rose-800'
                                  : order.productionStatus === 'In Production'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.productionStatus}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              id={`distribute-btn-${order.id}`}
                              onClick={() => openDistributeModal(order)}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-[11px] transition-colors inline-flex items-center gap-1.5"
                            >
                              <Split className="w-3.5 h-3.5 text-emerald-400" />
                              {order.allocations && order.allocations.length > 0 ? 'Edit Distribution' : 'Distribute to SHG'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: PRODUCT CATALOG MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Artisan Product Directory</h2>
                <p className="text-xs text-slate-500">
                  Admin has the complete authority to add products, modify descriptions, highlights, or pricing visible to buyers.
                </p>
              </div>
              <button
                id="admin-add-product-btn"
                onClick={() => openProductModal()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" /> Add New Product
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((prod) => (
                <div
                  key={prod.id}
                  id={`admin-product-card-${prod.id}`}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-video w-full relative bg-slate-100 overflow-hidden">
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 rounded text-[11px] font-bold text-slate-800">
                        ₹{prod.price}
                      </span>
                    </div>

                    <div className="p-4 space-y-2">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
                        {prod.category} • {prod.brand}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 leading-snug line-clamp-1">
                        {prod.title}
                      </h3>
                      <p className="text-xs text-slate-500 line-clamp-2">
                        {prod.shortDescription}
                      </p>

                      {/* Highlights preview */}
                      {prod.highlights && Object.keys(prod.highlights).length > 0 && (
                        <div className="pt-2">
                          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                            Highlights:
                          </span>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(prod.highlights).slice(0, 3).map(([k, v]) => (
                              <span
                                key={k}
                                className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded"
                              >
                                {k}: {v}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between">
                    <span className="text-xs text-slate-400 font-medium">
                      {prod.boughtCount} sold • ⭐ {prod.rating}
                    </span>
                    <button
                      id={`edit-product-btn-${prod.id}`}
                      onClick={() => openProductModal(prod)}
                      className="px-3 py-1.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold rounded-lg text-xs flex items-center gap-1 transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> Edit Product
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: REGISTERED SHGs */}
        {activeTab === 'shgs' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Connected Self-Help Groups (Cloud Live)</h2>
              <p className="text-xs text-slate-500">
                All SHG registrations with member Aadhaar numbers, individual artisan skills, and overall group specialties.
              </p>
            </div>

            {shgList.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
                <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-slate-600 font-semibold text-sm">No SHGs Enrolled Yet</p>
                <p className="text-xs text-slate-400 mt-1">
                  Once an SHG leader signs in and registers their group, their full details will be listed here.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {shgList.map((shg) => (
                  <div
                    key={shg.id}
                    id={`admin-shg-card-${shg.id}`}
                    className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{shg.groupName}</h3>
                        <p className="text-xs text-slate-500">
                          {shg.district}, {shg.state} • Reg: <span className="font-mono">{shg.regNumber}</span>
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                        {shg.members?.length || 0} Members
                      </span>
                    </div>

                    <div className="p-3 bg-emerald-50/50 rounded-lg border border-emerald-100 text-xs">
                      <span className="text-emerald-900 font-bold block mb-0.5">Overall Group Skill Specialization:</span>
                      <p className="text-emerald-800">{shg.overallSkill}</p>
                    </div>

                    <div>
                      <span className="text-xs font-bold text-slate-800 block mb-2">
                        Enrolled Artisans & Aadhaar Verification:
                      </span>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {shg.members?.map((m) => (
                          <div
                            key={m.id}
                            className="p-2 bg-slate-50 rounded-md border border-slate-100 text-xs flex items-center justify-between"
                          >
                            <div>
                              <span className="font-bold text-slate-800">{m.name}</span>
                              <span className="text-slate-400 font-mono text-[10px] ml-2">
                                (UID: {m.aadhaarNumber})
                              </span>
                              <p className="text-[11px] text-slate-600">{m.skill}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span>Contact: {shg.contactPhone}</span>
                      <span>{shg.leaderEmail}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: SHG TRAINING VIDEOS & CURRICULUM MANAGEMENT */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            {/* Notification Banner */}
            {videoNotification && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{videoNotification}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setVideoNotification(null)}
                  className="text-emerald-700 hover:text-emerald-900"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                    <Video className="w-5 h-5" />
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      SHG Artisan Training & Curriculum Videos
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Live Cloud Management • Add, edit titles/details, or delete YouTube masterclass videos across all Self-Help Groups.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="admin-add-video-btn"
                  type="button"
                  onClick={() => openVideoModal()}
                  className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  Add New Video
                </button>
              </div>
            </div>

            {/* Filter and Search Toolbar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1">
                  <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
                  <input
                    id="admin-video-search"
                    type="text"
                    placeholder="Search videos by title, channel/instructor, craft or skills..."
                    value={videoSearchQuery}
                    onChange={(e) => setVideoSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  {videoSearchQuery && (
                    <button
                      type="button"
                      onClick={() => setVideoSearchQuery('')}
                      className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <div className="text-xs text-slate-500 font-medium shrink-0">
                  Showing <strong className="text-slate-900">{filteredVideos.length}</strong> of{' '}
                  <strong className="text-slate-900">{coursesList.length}</strong> videos
                </div>
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-thin">
                <button
                  type="button"
                  onClick={() => setVideoCategoryFilter('All')}
                  className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                    videoCategoryFilter === 'All'
                      ? 'bg-emerald-700 text-white shadow-2xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  All Categories ({coursesList.length})
                </button>
                {VIDEO_CATEGORIES.filter((c) => c !== 'Other').map((cat) => {
                  const count = coursesList.filter((c) => c.category === cat).length;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setVideoCategoryFilter(cat)}
                      className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                        videoCategoryFilter === cat
                          ? 'bg-emerald-700 text-white shadow-2xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {cat.split('(')[0].trim()} ({count})
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Video Cards Grid */}
            {filteredVideos.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-dashed border-slate-300 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                  <Film className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-700">No training videos found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {videoSearchQuery || videoCategoryFilter !== 'All'
                    ? 'No videos match your active search or filter. Try clearing the filter.'
                    : 'No training videos in the catalog. Click "Add New Video" to paste a YouTube link and publish curriculum.'}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setVideoSearchQuery('');
                    setVideoCategoryFilter('All');
                    openVideoModal();
                  }}
                  className="px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg hover:bg-emerald-700 transition-colors"
                >
                  + Add Video Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVideos.map((video) => (
                  <div
                    key={video.id}
                    id={`admin-video-card-${video.id}`}
                    className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
                  >
                    <div>
                      {/* Thumbnail Container */}
                      <div className="relative aspect-video bg-slate-900 overflow-hidden group">
                        <img
                          src={video.thumbnail || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`;
                          }}
                        />

                        {/* Play overlay button */}
                        <button
                          type="button"
                          onClick={() => setPreviewingVideo(video)}
                          title="Watch Preview"
                          className="absolute inset-0 bg-black/40 group-hover:bg-black/20 flex items-center justify-center transition-all cursor-pointer"
                        >
                          <span className="w-12 h-12 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <Play className="w-5 h-5 fill-current ml-0.5" />
                          </span>
                        </button>

                        {/* Duration badge */}
                        <span className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 backdrop-blur-xs">
                          <Clock className="w-3 h-3" /> {video.duration}
                        </span>

                        {/* Level badge */}
                        <span className="absolute top-2 left-2 bg-slate-900/80 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                          {video.level}
                        </span>
                      </div>

                      {/* Video Info */}
                      <div className="p-4 space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                            {video.category.split('(')[0].trim()}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">
                            ID: {video.youtubeId}
                          </span>
                        </div>

                        {/* Editable Video Title */}
                        <h3 className="font-bold text-slate-900 text-sm leading-snug line-clamp-2">
                          {video.title}
                        </h3>

                        {/* Channel / Instructor */}
                        <div className="flex items-center gap-1.5 text-xs text-slate-600">
                          <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">Instructor: <strong className="text-slate-800">{video.instructor}</strong></span>
                        </div>

                        {/* Skills */}
                        {video.keySkillsTaught && video.keySkillsTaught.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {video.keySkillsTaught.slice(0, 3).map((skill, sIdx) => (
                              <span
                                key={sIdx}
                                className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                              >
                                {skill}
                              </span>
                            ))}
                            {video.keySkillsTaught.length > 3 && (
                              <span className="text-[10px] text-slate-400 self-center">
                                +{video.keySkillsTaught.length - 3} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Description */}
                        <p className="text-xs text-slate-500 line-clamp-2 pt-1 border-t border-slate-100">
                          {video.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Actions Footer */}
                    <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2">
                      <button
                        id={`admin-preview-video-btn-${video.id}`}
                        type="button"
                        onClick={() => setPreviewingVideo(video)}
                        className="px-2.5 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5 text-slate-500" />
                        Preview
                      </button>

                      <div className="flex items-center gap-1.5">
                        <button
                          id={`admin-edit-video-btn-${video.id}`}
                          type="button"
                          onClick={() => openVideoModal(video)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                          title="Edit video title and options"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          Edit Title
                        </button>

                        <button
                          id={`admin-delete-video-btn-${video.id}`}
                          type="button"
                          onClick={() => setVideoToDelete(video)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                          title="Delete video from all SHGs"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* PRODUCT CREATE / EDIT MODAL */}
      {(editingProduct !== null || isCreatingNew) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {isCreatingNew ? 'Add New SHG Artisan Product' : `Edit Product: ${editingProduct?.title}`}
              </h3>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsCreatingNew(false);
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Product Title *</label>
                <input
                  id="admin-form-title"
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Handcrafted Terracotta Water Carafe"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Brand / SHG Producer *</label>
                  <input
                    id="admin-form-brand"
                    type="text"
                    required
                    value={formBrand}
                    onChange={(e) => setFormBrand(e.target.value)}
                    placeholder="e.g. Pratibha Weaver SHG"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category *</label>
                  <input
                    id="admin-form-category"
                    type="text"
                    required
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    placeholder="e.g. Pottery, Textiles, Basketry"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Price (₹ INR) *</label>
                  <input
                    id="admin-form-price"
                    type="number"
                    required
                    min={10}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Image URL *</label>
                <input
                  id="admin-form-image"
                  type="url"
                  required
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Short Description (for Cards) *</label>
                <input
                  id="admin-form-short-desc"
                  type="text"
                  required
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  placeholder="1-2 lines shown in summary cards"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Long Description & Story *</label>
                <textarea
                  id="admin-form-long-desc"
                  rows={3}
                  required
                  value={formLongDesc}
                  onChange={(e) => setFormLongDesc(e.target.value)}
                  placeholder="Full background, artisan context, and specifications"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs resize-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Materials Used (What it is made of)</label>
                <input
                  id="admin-form-materials"
                  type="text"
                  value={formMaterials}
                  onChange={(e) => setFormMaterials(e.target.value)}
                  placeholder="e.g. 100% Organic Purified Clay, Kiln-fired Terracotta"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              {/* Product Highlights Section with Dynamic Title & Value */}
              <div className="pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <label className="font-bold text-slate-800">
                    Product Highlights (Different titles/attributes & values)
                  </label>
                  <button
                    type="button"
                    onClick={handleAddHighlightRow}
                    className="text-xs text-emerald-600 hover:text-emerald-700 font-semibold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Attribute
                  </button>
                </div>

                <div className="space-y-2">
                  {formHighlights.map((hl, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="text"
                        value={hl.key}
                        onChange={(e) => handleHighlightChange(index, 'key', e.target.value)}
                        placeholder="Attribute Title (e.g. Craft Technique)"
                        className="w-1/2 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                      <input
                        type="text"
                        value={hl.value}
                        onChange={(e) => handleHighlightChange(index, 'value', e.target.value)}
                        placeholder="Value (e.g. Hand-spun Eri Silk)"
                        className="w-1/2 px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveHighlightRow(index)}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct(null);
                    setIsCreatingNew(false);
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  id="admin-save-product-submit"
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-all flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" /> Save & Update Cloud
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DISTRIBUTE ORDER MODAL: Distribute same order across multiple SHGs with count preservation */}
      {distributingOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-800 flex items-center justify-center">
                  <Split className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Distribute Order to SHG Collectives</h3>
                  <p className="text-[11px] text-slate-500">
                    Assign to one or distribute to multiple SHGs while preserving the overall quantity
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setDistributingOrder(null);
                  setDistributeError('');
                }}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto py-4 space-y-4 flex-1">
              {/* Product & Order Requirement Summary */}
              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex items-center gap-3">
                <img
                  src={distributingOrder.productImage}
                  alt={distributingOrder.productTitle}
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200"
                />
                <div className="flex-1 min-w-0 text-xs">
                  <p className="font-bold text-slate-900 truncate">{distributingOrder.productTitle}</p>
                  <p className="text-slate-600 mt-0.5">
                    Total Order Quantity: <span className="font-bold text-slate-900">{distributingOrder.quantity} pcs</span> • Total Value: <span className="font-bold text-emerald-700">₹{distributingOrder.totalAmount.toLocaleString('en-IN')}</span>
                  </p>
                  <p className="text-slate-400 text-[11px] truncate">
                    Buyer: {distributingOrder.buyerName} • Delivery: {distributingOrder.buyerAddress}
                  </p>
                </div>
              </div>

              {/* Quantity Balance & Progress Tracker */}
              <div className="p-3.5 rounded-xl border bg-slate-50/70 space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Overall Batch Allocation Tracker</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] ${
                      totalAllocated === distributingOrder.quantity
                        ? 'bg-emerald-100 text-emerald-800'
                        : totalAllocated > distributingOrder.quantity
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {totalAllocated} / {distributingOrder.quantity} pcs assigned
                  </span>
                </div>

                {/* Visual Progress bar */}
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${
                      totalAllocated === distributingOrder.quantity
                        ? 'bg-emerald-500'
                        : totalAllocated > distributingOrder.quantity
                        ? 'bg-rose-500'
                        : 'bg-amber-500'
                    }`}
                    style={{
                      width: `${Math.min(100, (totalAllocated / distributingOrder.quantity) * 100)}%`
                    }}
                  />
                </div>

                <div className="flex items-center justify-between text-[11px]">
                  {totalAllocated === distributingOrder.quantity ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Total order count perfectly balanced ({distributingOrder.quantity} pcs).
                    </span>
                  ) : totalAllocated < distributingOrder.quantity ? (
                    <span className="text-amber-700 font-semibold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Remaining to allocate: {remainingQty} pcs.
                    </span>
                  ) : (
                    <span className="text-rose-700 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" /> Over-allocated by {Math.abs(remainingQty)} pcs! Please reduce quantities.
                    </span>
                  )}

                  {/* Quick helper links */}
                  <div className="flex items-center gap-2.5">
                    {allocationRows.length > 1 && (
                      <button
                        type="button"
                        onClick={handleSplitEvenly}
                        className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-[11px]"
                      >
                        Split Evenly
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={handleAssignAllToSingle}
                      className="text-slate-600 hover:text-slate-900 font-semibold underline text-[11px]"
                    >
                      Assign All to 1 SHG
                    </button>
                  </div>
                </div>
              </div>

              {/* Error warning */}
              {distributeError && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{distributeError}</span>
                </div>
              )}

              {/* Allocation Rows */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-800">
                    SHG Collectives Participating in this Order:
                  </label>
                  <button
                    id="add-shg-split-btn"
                    type="button"
                    onClick={handleAddAllocationRow}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add Another SHG
                  </button>
                </div>

                {shgList.length === 0 ? (
                  <div className="p-3 bg-amber-50 rounded-lg text-amber-800 text-xs border border-amber-200">
                    No SHG groups found registered in cloud. Please register SHGs first to assign orders.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {allocationRows.map((row, idx) => {
                      const currentSelectedShg = shgList.find((s) => s.id === row.shgId);
                      const rowPcs = Number(row.quantity) || 0;
                      const rowVal = rowPcs * distributingOrder.productPrice;

                      return (
                        <div
                          key={idx}
                          className="p-3 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-2"
                        >
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-slate-700 flex items-center gap-1.5">
                              <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-mono text-[10px] border border-slate-200">
                                {idx + 1}
                              </span>
                              Allocation Batch #{idx + 1}
                            </span>

                            {allocationRows.length > 1 && (
                              <button
                                type="button"
                                onClick={() => handleRemoveAllocationRow(idx)}
                                className="text-slate-400 hover:text-rose-600 p-1 transition-colors flex items-center gap-1 text-[11px]"
                                title="Remove this SHG allocation"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                <span>Remove</span>
                              </button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                            {/* SHG Select */}
                            <div className="sm:col-span-8">
                              <select
                                id={`shg-select-${idx}`}
                                value={row.shgId}
                                onChange={(e) => handleUpdateRowShg(idx, e.target.value)}
                                className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                              >
                                <option value="" disabled>-- Select SHG Collective --</option>
                                {shgList.map((s) => (
                                  <option key={s.id} value={s.id}>
                                    {s.groupName} ({s.district}, {s.state}) • Skill: {s.overallSkill}
                                  </option>
                                ))}
                              </select>
                            </div>

                            {/* Quantity Input */}
                            <div className="sm:col-span-4 flex items-center gap-1.5">
                              <div className="relative flex-1">
                                <input
                                  id={`shg-qty-${idx}`}
                                  type="number"
                                  min="1"
                                  max={distributingOrder.quantity}
                                  value={row.quantity}
                                  onChange={(e) => handleUpdateRowQuantity(idx, parseInt(e.target.value) || 0)}
                                  className="w-full p-2 bg-slate-50 border border-slate-300 rounded-lg text-xs font-bold text-slate-900 text-center focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                                />
                                <span className="absolute right-2 top-2 text-[10px] text-slate-400 pointer-events-none">
                                  pcs
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Row metadata */}
                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-0.5">
                            <span>
                              {currentSelectedShg ? (
                                <span>
                                  Specialty: <strong className="text-slate-700">{currentSelectedShg.overallSkill}</strong> ({currentSelectedShg.members?.length || 0} artisans)
                                </span>
                              ) : (
                                <span>Select an SHG group</span>
                              )}
                            </span>
                            <span className="font-semibold text-emerald-700">
                              Batch Share: ₹{rowVal.toLocaleString('en-IN')}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100 shrink-0">
              <span className="text-xs text-slate-600">
                Total Allocated: <strong className="text-slate-900">{totalAllocated}</strong> of <strong className="text-slate-900">{distributingOrder.quantity} pcs</strong>
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setDistributingOrder(null);
                    setDistributeError('');
                  }}
                  className="px-4 py-2 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100"
                >
                  Cancel
                </button>
                <button
                  id="confirm-distribute-btn"
                  type="button"
                  onClick={handleConfirmDistribution}
                  disabled={totalAllocated !== distributingOrder.quantity || allocationRows.some((r) => !r.shgId || r.quantity <= 0)}
                  className={`px-4 py-2 text-xs font-bold rounded-xl shadow-sm transition-all ${
                    totalAllocated === distributingOrder.quantity && !allocationRows.some((r) => !r.shgId || r.quantity <= 0)
                      ? 'bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  Confirm Distribution
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TRAINING VIDEO CREATE / EDIT MODAL */}
      {(editingVideo !== null || isCreatingNewVideo) && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 my-8 max-h-[92vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                  <Video className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isCreatingNewVideo ? 'Add New Training Video to SHG Panel' : `Edit Video: ${editingVideo?.title}`}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isCreatingNewVideo
                      ? 'Paste a YouTube video link to automatically fetch metadata, thumbnail, duration & channel.'
                      : 'Customize video title, category, skills taught, and artisan instructions.'}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setEditingVideo(null);
                  setIsCreatingNewVideo(false);
                  setFetchVideoError('');
                  setFetchVideoSuccess('');
                }}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVideoSubmit} className="space-y-4 text-xs">
              {/* YouTube Link Input & Auto-Fetch */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <ExternalLink className="w-4 h-4 text-rose-600" />
                    Paste YouTube Video Link or 11-digit Video ID *
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">
                    e.g. https://www.youtube.com/watch?v=...
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    id="admin-form-video-url"
                    type="text"
                    required
                    value={videoInputUrl}
                    onChange={(e) => {
                      const val = e.target.value;
                      setVideoInputUrl(val);
                      // If 11 chars or valid youtube link, quick test
                      const extracted = extractYouTubeId(val);
                      if (extracted && extracted !== videoYoutubeId) {
                        handleAutoFetchVideoDetails(val);
                      }
                    }}
                    onPaste={(e) => {
                      const pasted = e.clipboardData.getData('text');
                      if (pasted) {
                        setVideoInputUrl(pasted);
                        handleAutoFetchVideoDetails(pasted);
                      }
                    }}
                    placeholder="https://www.youtube.com/watch?v=pr8yDXUPZw0 or https://youtu.be/..."
                    className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs font-mono text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />

                  <button
                    type="button"
                    onClick={() => handleAutoFetchVideoDetails(videoInputUrl)}
                    disabled={isFetchingVideo || !videoInputUrl.trim()}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-2xs"
                  >
                    {isFetchingVideo ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        Fetching Data...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        Auto-Fetch Details
                      </>
                    )}
                  </button>
                </div>

                {/* Status Messages */}
                {isFetchingVideo && (
                  <div className="p-2.5 bg-blue-50 border border-blue-200 rounded-lg text-blue-700 text-xs flex items-center gap-2 animate-pulse">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin shrink-0" />
                    <span>Contacting YouTube service to fetch video thumbnail, duration, title and channel...</span>
                  </div>
                )}

                {fetchVideoSuccess && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{fetchVideoSuccess}</span>
                  </div>
                )}

                {fetchVideoError && (
                  <div className="p-2.5 bg-rose-50 border border-rose-300 rounded-lg text-rose-800 text-xs flex items-center gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                    <span>{fetchVideoError}</span>
                  </div>
                )}

                {/* Auto-Fetched Live Preview Box */}
                {videoYoutubeId && (
                  <div className="mt-2 p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative w-full sm:w-36 aspect-video bg-black rounded-lg overflow-hidden shrink-0">
                      <img
                        src={videoThumbnail || `https://img.youtube.com/vi/${videoYoutubeId}/hqdefault.jpg`}
                        alt="Thumbnail"
                        className="w-full h-full object-cover"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[9px] px-1 rounded font-bold">
                        {videoDuration}
                      </span>
                    </div>

                    <div className="space-y-1 w-full text-left">
                      <span className="text-[10px] font-bold text-emerald-700 uppercase bg-emerald-50 px-1.5 py-0.5 rounded">
                        YouTube Auto-Verified
                      </span>
                      <p className="font-bold text-slate-800 text-xs line-clamp-1">
                        {videoTitle || 'Fetched Video'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                        <span>Channel: <strong className="text-slate-700">{videoInstructor || 'YouTube Channel'}</strong></span>
                        <span>•</span>
                        <span className="font-mono text-[10px]">ID: {videoYoutubeId}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* EDITABLE FIELDS SECTION */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-1">
                  <span className="font-bold text-slate-800 text-xs">
                    Customizable Curriculum Settings (Admin Controlled)
                  </span>
                  <span className="text-[10px] text-slate-400">
                    Modify title and learning details for artisans
                  </span>
                </div>

                {/* Video Title (Can be changed per user requirement) */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Video Title (Artisan Course Name) *
                  </label>
                  <input
                    id="admin-form-video-title"
                    type="text"
                    required
                    value={videoTitle}
                    onChange={(e) => setVideoTitle(e.target.value)}
                    placeholder="Enter or modify video title in Hindi/English..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-900 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">
                    You can edit the title to include Hindi explanations, craft context, or SHG training notes.
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* Category Dropdown */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Craft Category *</label>
                    <select
                      id="admin-form-video-category"
                      value={videoCategory}
                      onChange={(e) => setVideoCategory(e.target.value)}
                      className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs font-medium bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      {VIDEO_CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Skill Level */}
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Artisan Skill Level</label>
                    <select
                      id="admin-form-video-level"
                      value={videoLevel}
                      onChange={(e) => setVideoLevel(e.target.value as any)}
                      className="w-full px-2.5 py-2 border border-slate-300 rounded-lg text-xs font-medium bg-white text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    >
                      <option value="Beginner">Beginner (बुनियादी)</option>
                      <option value="Intermediate">Intermediate (मध्यम स्तर)</option>
                      <option value="Advanced">Advanced (कुशल/उन्नत)</option>
                    </select>
                  </div>

                  {/* Video Duration (YouTube Minutes & Seconds format) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block font-bold text-slate-700">Video Duration (MM:SS) *</label>
                      <span className="text-[10px] text-emerald-600 font-semibold font-mono">
                        YouTube Format
                      </span>
                    </div>
                    <input
                      id="admin-form-video-duration"
                      type="text"
                      required
                      value={videoDuration}
                      onChange={(e) => setVideoDuration(e.target.value)}
                      placeholder="e.g. 16:19 or 1:04:22"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-medium text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400 mt-1 block">
                      Auto-fetched exact duration in minutes and seconds (e.g. 16:19).
                    </span>
                  </div>
                </div>

                {/* Custom category if 'Other' selected */}
                {videoCategory === 'Other' && (
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Specify Custom Category *</label>
                    <input
                      id="admin-form-custom-category"
                      type="text"
                      required
                      value={videoCustomCategory}
                      onChange={(e) => setVideoCustomCategory(e.target.value)}
                      placeholder="e.g. बांस शिल्प (Bamboo Craft)"
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                )}

                {/* Key Skills Taught */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Key Skills Taught (Comma-separated)
                  </label>
                  <input
                    id="admin-form-video-skills"
                    type="text"
                    value={videoSkillsString}
                    onChange={(e) => setVideoSkillsString(e.target.value)}
                    placeholder="e.g. Clay kneading, Wheel centering, Glaze preparation, Quality inspection"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    Tags will display as skill pills on the SHG learning dashboard.
                  </span>
                </div>

                {/* Learning Description */}
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Artisan Learning Guidance & Description
                  </label>
                  <textarea
                    id="admin-form-video-desc"
                    rows={3}
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    placeholder="Provide a short overview of tools, raw materials and key steps for SHG artisans..."
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Form Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingVideo(null);
                    setIsCreatingNewVideo(false);
                    setFetchVideoError('');
                    setFetchVideoSuccess('');
                  }}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>

                <button
                  id="admin-save-video-btn"
                  type="submit"
                  disabled={!videoYoutubeId || isFetchingVideo}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  {isCreatingNewVideo ? 'Add to SHG Panel' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE VIDEO CONFIRMATION MODAL */}
      {videoToDelete !== null && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center gap-3">
              <span className="p-3 bg-rose-100 text-rose-600 rounded-full shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </span>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Delete Training Video for All SHGs?
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center gap-3">
              <img
                src={videoToDelete.thumbnail || `https://img.youtube.com/vi/${videoToDelete.youtubeId}/hqdefault.jpg`}
                alt={videoToDelete.title}
                className="w-16 h-12 object-cover rounded-lg bg-black shrink-0"
              />
              <div className="min-w-0">
                <p className="font-bold text-xs text-slate-900 line-clamp-1">
                  {videoToDelete.title}
                </p>
                <p className="text-[11px] text-slate-500 truncate">
                  Instructor: {videoToDelete.instructor}
                </p>
                <span className="text-[10px] text-rose-600 font-semibold">
                  Will be removed from all SHG curriculums
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to delete this lecture video from the cloud? All registered Self-Help Groups will immediately lose this lesson from their learning dashboards.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setVideoToDelete(null)}
                className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                id="admin-confirm-delete-video-btn"
                type="button"
                onClick={handleConfirmDeleteVideo}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
              >
                Yes, Delete Video for Every SHG
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LIVE IN-PORTAL VIDEO PREVIEW MODAL */}
      {previewingVideo !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="bg-slate-900 rounded-2xl max-w-3xl w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-4 py-3 bg-slate-800 border-b border-slate-700 flex items-center justify-between text-white">
              <div className="flex items-center gap-2 min-w-0">
                <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg">
                  <Play className="w-4 h-4 fill-current" />
                </span>
                <div className="truncate">
                  <h4 className="font-bold text-xs sm:text-sm truncate">
                    {previewingVideo.title}
                  </h4>
                  <span className="text-[11px] text-slate-400">
                    Channel: {previewingVideo.instructor} • {previewingVideo.duration}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewingVideo(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Embedded Video Player */}
            <div className="relative aspect-video bg-black w-full">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${previewingVideo.youtubeId}?autoplay=1&rel=0`}
                title={previewingVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>

            {/* Footer */}
            <div className="px-4 py-3 bg-slate-800 border-t border-slate-700 flex items-center justify-between text-xs text-slate-300">
              <span className="text-[11px] text-emerald-400 font-semibold">
                ✓ Verified YouTube Stream • Ready for SHG artisan viewing
              </span>
              <a
                href={previewingVideo.youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1 font-medium"
              >
                Open on YouTube <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
