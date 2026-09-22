import React, { useState } from 'react';
import { Product } from '../types';
import {
  Search,
  SlidersHorizontal,
  Star,
  CheckCircle2,
  Sparkles,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Truck,
  HeartHandshake,
  X,
  Plus,
  Minus
} from 'lucide-react';

interface BuyerPortalProps {
  products: Product[];
  activeUserEmail?: string;
  onOrderSuccess: () => void;
  onPlaceOrder: (orderData: {
    product: Product;
    quantity: number;
    buyerName: string;
    buyerEmail: string;
    buyerPhone: string;
    buyerAddress: string;
  }) => Promise<void>;
  onBackToHome: () => void;
}

export const BuyerPortal: React.FC<BuyerPortalProps> = ({
  products,
  activeUserEmail,
  onPlaceOrder,
  onBackToHome
}) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  // Buy confirmation modal state
  const [showBuyModal, setShowBuyModal] = useState<boolean>(false);
  const [buyerName, setBuyerName] = useState<string>('Ayush Raj');
  const [buyerEmail, setBuyerEmail] = useState<string>(activeUserEmail || 'shopper@hunarsetu.org');
  const [buyerPhone, setBuyerPhone] = useState<string>('+91 98765 43210');
  const [buyerAddress, setBuyerAddress] = useState<string>('B-402, Green Glen Heights, Outer Ring Road, Bangalore - 560103');
  const [orderProcessing, setOrderProcessing] = useState<boolean>(false);
  const [orderPlacedSuccess, setOrderPlacedSuccess] = useState<boolean>(false);

  // Categories extracted dynamically
  const categories = ['All', ...Array.from(new Set(products.map((p) => p.category)))];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleOpenDetail = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setShowBuyModal(false);
    setOrderPlacedSuccess(false);
  };

  const handleInitiateBuy = () => {
    setShowBuyModal(true);
  };

  const handleConfirmPurchase = async () => {
    if (!selectedProduct) return;
    setOrderProcessing(true);
    try {
      await onPlaceOrder({
        product: selectedProduct,
        quantity,
        buyerName,
        buyerEmail,
        buyerPhone,
        buyerAddress
      });
      setOrderProcessing(false);
      setOrderPlacedSuccess(true);
      setTimeout(() => {
        setOrderPlacedSuccess(false);
        setShowBuyModal(false);
        setSelectedProduct(null);
      }, 2500);
    } catch (err) {
      console.error(err);
      setOrderProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      {/* Top Buyer Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              id="buyer-back-home-btn"
              onClick={onBackToHome}
              className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                HS
              </div>
              <span className="font-semibold text-slate-900 hidden sm:inline text-base">Hunar-Setu</span>
            </button>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-full border border-emerald-200/60 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Direct Buyer Marketplace
            </span>
          </div>

          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id="buyer-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search authentic handmade SHG creations, weaves, pottery..."
                className="w-full pl-9 pr-4 py-2 bg-slate-100/80 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="buyer-exit-session-btn"
              onClick={onBackToHome}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Switch Portal
            </button>
          </div>
        </div>

        {/* Category Pill Filters */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center gap-2 overflow-x-auto no-scrollbar border-t border-slate-100 text-xs">
          <span className="text-slate-400 flex items-center gap-1 mr-1 shrink-0 font-medium">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Craft:
          </span>
          {categories.map((cat) => (
            <button
              key={cat}
              id={`cat-filter-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Marketplace Banner */}
        <div className="bg-gradient-to-r from-emerald-900 to-teal-800 text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-sm relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-200 text-xs font-medium mb-3 border border-emerald-400/20">
              <Sparkles className="w-3.5 h-3.5" /> 100% Fair-Trade SHG Sourced
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
              Empower Women Artisans with Every Purchase
            </h1>
            <p className="text-emerald-100 text-sm leading-relaxed">
              Every purchase on Hunar-Setu directly feeds rural artisan families. Click any product below to explore the detailed artisan story, natural materials, quality reviews, and place orders directly.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-10 translate-y-10">
            <ShoppingBag className="w-80 h-80" />
          </div>
        </div>

        {/* Product Grid - Per requirements: outside buyer only sees product photo, title or brand in one line, and price */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 tracking-tight">
            Artisan Catalog ({filteredProducts.length} items)
          </h2>
          <span className="text-xs text-slate-500">
            Click any card to inspect full details & buy
          </span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-slate-200">
            <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No handmade products found matching this filter.</p>
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="mt-3 text-xs text-emerald-600 font-semibold hover:underline"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                id={`product-card-${product.id}`}
                onClick={() => handleOpenDetail(product)}
                className="group cursor-pointer bg-white rounded-xl border border-slate-200 hover:border-emerald-500/50 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Product Photo */}
                <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-md text-[11px] font-semibold text-slate-700 shadow-xs flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{product.rating}</span>
                  </div>
                </div>

                {/* Per Requirement: Outside buyer only see product photo and it title or brand in one line, price */}
                <div className="p-4 flex flex-col flex-1 justify-between gap-2">
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wide truncate">
                      {product.brand}
                    </p>
                    <h3 className="text-sm font-medium text-slate-900 truncate mt-0.5 group-hover:text-emerald-700 transition-colors" title={product.title}>
                      {product.title}
                    </h3>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-xs text-slate-400 font-normal">Price </span>
                      <span className="text-base font-bold text-slate-900">₹{product.price.toLocaleString('en-IN')}</span>
                    </div>
                    <span className="text-xs font-semibold text-emerald-600 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                      View Details <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* DETAILED PRODUCT MODAL (Opens on clicking anywhere in card) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-100 overflow-hidden relative max-h-[92vh] flex flex-col">
            {/* Modal Header Bar */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold text-xs">
                  {selectedProduct.category}
                </span>
                <span className="text-xs text-slate-400 font-medium">SHG Collective Product</span>
              </div>
              <button
                id="close-product-detail-btn"
                onClick={() => setSelectedProduct(null)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="overflow-y-auto p-6 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Left Column: Image & Quick Guarantees */}
              <div className="space-y-4">
                <div className="aspect-square rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                  <img
                    src={selectedProduct.imageUrl}
                    alt={selectedProduct.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <p className="text-[11px] font-semibold text-slate-700">100% Authentic</p>
                    <p className="text-[10px] text-slate-400">Rural GI Certified</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <HeartHandshake className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <p className="text-[11px] font-semibold text-slate-700">Direct SHG</p>
                    <p className="text-[10px] text-slate-400">Zero Middlemen</p>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                    <Truck className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                    <p className="text-[11px] font-semibold text-slate-700">Safe Shipping</p>
                    <p className="text-[10px] text-slate-400">Direct Packaging</p>
                  </div>
                </div>

                {/* Material Details */}
                <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-4 text-xs">
                  <span className="font-semibold text-amber-900 block mb-1">What it is made up of:</span>
                  <p className="text-amber-800 leading-relaxed">{selectedProduct.materials}</p>
                </div>
              </div>

              {/* Right Column: Full Specifications, Highlights & Actions */}
              <div className="flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <p className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">
                      {selectedProduct.brand}
                    </p>
                    <span className="text-xs text-slate-500 font-medium">
                      {selectedProduct.boughtCount}+ bought this season
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug mb-3">
                    {selectedProduct.title}
                  </h2>

                  {/* Rating summary */}
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-slate-800">{selectedProduct.rating}</span>
                    <span className="text-xs text-slate-400">({selectedProduct.reviewsCount} verified reviews)</span>
                  </div>

                  {/* Price */}
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 mb-5 flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-slate-900">
                      ₹{selectedProduct.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded-sm">
                      Inclusive of all rural craft cess
                    </span>
                  </div>

                  {/* Short & Long Description */}
                  <div className="space-y-3 mb-5">
                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Overview</h4>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium">
                        {selectedProduct.shortDescription}
                      </p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-1">Story & Craft Details</h4>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {selectedProduct.longDescription}
                      </p>
                    </div>
                  </div>

                  {/* Product Highlights with different title/attributes */}
                  {selectedProduct.highlights && Object.keys(selectedProduct.highlights).length > 0 && (
                    <div className="mb-6">
                      <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider mb-2 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> Product Highlights
                      </h4>
                      <div className="divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden bg-white text-xs">
                        {Object.entries(selectedProduct.highlights).map(([key, value]) => (
                          <div key={key} className="grid grid-cols-2 p-2.5">
                            <span className="font-semibold text-slate-700">{key}</span>
                            <span className="text-slate-600">{value}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Customer Reviews Section */}
                  <div className="mb-6">
                    <h4 className="text-xs font-bold uppercase text-slate-900 tracking-wider mb-2">
                      Customer Reviews ({selectedProduct.reviews?.length || 0})
                    </h4>
                    <div className="space-y-2.5 max-h-36 overflow-y-auto pr-1">
                      {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
                        selectedProduct.reviews.map((rev) => (
                          <div key={rev.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 text-xs">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-slate-800">{rev.author}</span>
                              <div className="flex text-amber-400">
                                {[...Array(rev.rating)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-amber-400" />
                                ))}
                              </div>
                            </div>
                            <p className="text-slate-600 italic font-normal">"{rev.comment}"</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-slate-400 italic">Be the first to review this SHG product.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Bottom Quantity Selection & Buy Now CTA */}
                <div className="pt-4 border-t border-slate-200 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Quantity to Buy:</span>
                    <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
                      <button
                        id="decrease-quantity-btn"
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="px-4 py-1 text-xs font-bold text-slate-800">{quantity}</span>
                      <button
                        id="increase-quantity-btn"
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-3 py-1 text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      id="buyer-buy-now-btn"
                      onClick={handleInitiateBuy}
                      className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow-sm hover:shadow transition-all flex items-center justify-center gap-2 text-sm"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      Buy Now (Total ₹{(selectedProduct.price * quantity).toLocaleString('en-IN')})
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BUY CONFIRMATION & DETAILS MODAL (No payment gateway per prompt: ask confirmation, if yes consider paid and send order to admin) */}
      {showBuyModal && selectedProduct && (
        <div className="fixed inset-0 z-60 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 animate-scale-up">
            {orderPlacedSuccess ? (
              <div className="text-center py-6">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Order Confirmed & Paid!</h3>
                <p className="text-xs text-slate-600 mb-3">
                  Your purchase of <span className="font-semibold text-slate-900">{quantity}x {selectedProduct.title}</span> (₹{(selectedProduct.price * quantity).toLocaleString('en-IN')}) has been marked paid and routed to the Hunar-Setu central Admin for SHG allocation.
                </p>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 inline-block">
                  Thank you for supporting rural artisan livelihood!
                </span>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
                  <h3 className="text-base font-bold text-slate-900">Confirm Direct Order & Payment</h3>
                  <button
                    onClick={() => setShowBuyModal(false)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 text-xs space-y-1.5">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span className="truncate pr-2">{selectedProduct.title}</span>
                    <span>₹{(selectedProduct.price * quantity).toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Quantity:</span>
                    <span>{quantity} unit(s)</span>
                  </div>
                  <div className="flex justify-between text-emerald-700 font-semibold pt-1 border-t border-slate-200">
                    <span>Payment Mode:</span>
                    <span>Direct Artisan Settlement (Pre-Verified)</span>
                  </div>
                </div>

                <div className="space-y-3 text-xs mb-5">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Buyer Full Name</label>
                    <input
                      id="buyer-modal-name"
                      type="text"
                      value={buyerName}
                      onChange={(e) => setBuyerName(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Email</label>
                      <input
                        id="buyer-modal-email"
                        type="email"
                        value={buyerEmail}
                        onChange={(e) => setBuyerEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-slate-700 font-semibold mb-1">Phone</label>
                      <input
                        id="buyer-modal-phone"
                        type="text"
                        value={buyerPhone}
                        onChange={(e) => setBuyerPhone(e.target.value)}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Delivery Address</label>
                    <textarea
                      id="buyer-modal-address"
                      rows={2}
                      value={buyerAddress}
                      onChange={(e) => setBuyerAddress(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs resize-none"
                      required
                    />
                  </div>
                </div>

                <p className="text-[11px] text-slate-500 mb-4 bg-emerald-50/80 p-2.5 rounded-lg border border-emerald-200 text-emerald-900">
                  <span className="font-semibold">Note:</span> By clicking "Confirm & Mark as Paid", this order will be confirmed instantly without a third-party gateway, registered in the cloud database, and forwarded to the admin for SHG assignment.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    id="cancel-order-modal-btn"
                    type="button"
                    onClick={() => setShowBuyModal(false)}
                    className="flex-1 py-2.5 px-3 border border-slate-300 text-slate-700 text-xs font-semibold rounded-xl hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    id="confirm-order-paid-btn"
                    type="button"
                    disabled={orderProcessing}
                    onClick={handleConfirmPurchase}
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1 shadow-sm transition-all"
                  >
                    {orderProcessing ? 'Processing Order...' : 'Yes, Confirm & Pay'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
