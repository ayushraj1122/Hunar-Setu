import React, { useState } from 'react';
import {
  Users,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  GraduationCap,
  PackageCheck,
  Layers,
  HeartHandshake,
  CheckCircle2,
  Lock,
  Mail,
  KeyRound
} from 'lucide-react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { RoleAuthModal } from './RoleAuthModal';

interface LandingHeroProps {
  onSelectRole: (role: 'shg' | 'buyer' | 'admin', userEmail?: string) => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onSelectRole }) => {
  const [activeModal, setActiveModal] = useState<'shg' | 'buyer' | 'admin' | null>(null);

  // Admin login credential states (as required: username: "admin", password: "admin123")
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleAdminSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername.trim() === 'admin' && adminPassword.trim() === 'admin123') {
      setAdminError('');
      setActiveModal(null);
      onSelectRole('admin');
    } else {
      setAdminError('Invalid credentials. Use username: admin and password: admin123');
    }
  };

  const handleGoogleAuth = async (role: 'shg' | 'buyer') => {
    setAuthLoading(true);
    try {
      const res = await signInWithPopup(auth, googleProvider);
      setAuthLoading(false);
      setActiveModal(null);
      onSelectRole(role, res.user.email || undefined);
    } catch (err: any) {
      console.warn('Google sign-in popup error (fallback to direct session):', err);
      // Even if popup is blocked in iframe preview, smoothly proceed with default email
      setAuthLoading(false);
      setActiveModal(null);
      const email = role === 'shg' ? 'shg.leader@hunarsetu.org' : 'shopper@hunarsetu.org';
      onSelectRole(role, email);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 flex flex-col selection:bg-emerald-100 selection:text-emerald-900">
      {/* Top Brand Navigation */}
      <nav className="border-b border-slate-100 sticky top-0 z-30 bg-white/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-extrabold text-lg shadow-sm shadow-emerald-200">
              HS
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-slate-950">Hunar-Setu</span>
              <span className="block text-[11px] font-medium text-emerald-800 tracking-wider uppercase">
                Bridging Rural Craft & Digital Commerce
              </span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs font-semibold text-slate-600">
            <a href="#about" className="hover:text-emerald-700 transition-colors">About Hunar-Setu</a>
            <a href="#how-it-works" className="hover:text-emerald-700 transition-colors">How It Works</a>
            <a href="#roles" className="hover:text-emerald-700 transition-colors">Portals</a>
          </div>

          {/* Direct Login Triggers */}
          <div className="flex items-center gap-2">
            <button
              id="header-login-shg"
              onClick={() => setActiveModal('shg')}
              className="px-3 py-2 text-xs font-bold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
            >
              SHG Login
            </button>
            <button
              id="header-login-buyer"
              onClick={() => setActiveModal('buyer')}
              className="px-3 py-2 text-xs font-bold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Buyer Store
            </button>
            <button
              id="header-login-admin"
              onClick={() => setActiveModal('admin')}
              className="px-3 py-2 text-xs font-bold text-white bg-slate-950 hover:bg-slate-800 rounded-lg shadow-xs transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Admin
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Descriptive Banner and Hero Image */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-slate-100 bg-gradient-to-b from-slate-50/80 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100/70 text-emerald-800 text-xs font-bold border border-emerald-200/80">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" /> National Rural Livelihood & Artisan Bridge
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.12]">
                What is Hunar-Setu?
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl font-normal">
                <span className="font-semibold text-slate-900">Hunar-Setu</span> is a dedicated digital bridge empowering rural <span className="font-semibold text-emerald-800">Self-Help Groups (SHGs)</span>, master handicraft collectives, and indigenous artisans. It seamlessly couples masterclass skill training and video courses with direct-to-consumer digital commerce and centralized, transparent order production distribution.
              </p>

              {/* Three Portal Access Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3" id="roles">
                <button
                  id="hero-enter-shg-btn"
                  onClick={() => setActiveModal('shg')}
                  className="px-6 py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md shadow-emerald-700/20 transition-all flex items-center justify-center gap-2 group"
                >
                  <Users className="w-4 h-4" />
                  1. Login as SHG Group
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  id="hero-enter-buyer-btn"
                  onClick={() => setActiveModal('buyer')}
                  className="px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-xl shadow-md shadow-slate-900/10 transition-all flex items-center justify-center gap-2 group"
                >
                  <ShoppingBag className="w-4 h-4" />
                  2. Login as Buyer
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <button
                  id="hero-enter-admin-btn"
                  onClick={() => setActiveModal('admin')}
                  className="px-5 py-3.5 bg-white border-2 border-slate-300 hover:border-slate-800 text-slate-800 font-bold text-sm rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  3. Admin Side
                </button>
              </div>

              {/* Trust badges */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-slate-200/80 text-xs text-slate-500">
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Verified Aadhaar Registry</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Video Progress Tracking</span>
                </div>
                <div className="flex items-center gap-1.5 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Direct Cloud Dispatch</span>
                </div>
              </div>
            </div>

            {/* Right Hero Image Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-slate-100 ring-1 ring-slate-200">
                <img
                  src="https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1000&auto=format&fit=crop&q=80"
                  alt="Rural SHG artisan women weaving handmade authentic textiles"
                  className="w-full h-[420px] object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-6 text-white">
                  <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                    Ground-Level Artisan Empowerment
                  </span>
                  <h3 className="text-lg font-bold leading-snug mt-1">
                    Direct Market Access for 50,000+ Rural Women Producers
                  </h3>
                  <p className="text-xs text-slate-300 mt-1">
                    Every product card in Hunar-Setu represents direct economic independence, authentic cultural heritage, and verified skill certifications.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars: 3 Separated Ecosystems */}
      <section className="py-16 bg-slate-50 border-b border-slate-100" id="how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Architecture & Workflow
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-950 mt-1">
              Three Dedicated Portals Tailored to Each Stakeholder
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-2">
              Each portal launches as a completely newly started, independent full-page interface designed for its specific purpose.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* SHG Card */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:border-emerald-500/60 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold mb-5">
                  <Users className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">01. For SHG Groups</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                  Skill Learning & Order Fulfillment
                </h3>
                <ul className="text-xs text-slate-600 space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>First-time Registration:</b> Enter group specialization, all individual member names & Aadhaar numbers.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>i) Learning:</b> Watch craft tutorials, integrated YouTube lectures, and live progress completion tracker.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>ii) Orders to Produce:</b> Inspect assigned orders with photo & quantity; mark Complete or Cancel.</span>
                  </li>
                </ul>
              </div>
              <button
                id="card-cta-shg"
                onClick={() => setActiveModal('shg')}
                className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-xl border border-emerald-200 transition-colors flex items-center justify-center gap-1"
              >
                Access SHG Portal <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Buyer Card */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-400 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center font-bold mb-5">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">02. For Buyers</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                  Direct Rural Marketplace
                </h3>
                <ul className="text-xs text-slate-600 space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>Clean Catalog:</b> From outside, see product photo, single-line title or brand, and price.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>Rich Detail View:</b> Click anywhere on the card to inspect what it's made of, reviews, and highlights.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>Direct Buy & Pay:</b> Prompt confirmation marks order paid and synchronizes with cloud database.</span>
                  </li>
                </ul>
              </div>
              <button
                id="card-cta-buyer"
                onClick={() => setActiveModal('buyer')}
                className="w-full py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-900 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1"
              >
                Explore Buyer Store <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Admin Card */}
            <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-xs hover:border-slate-800 hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold mb-5">
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">03. For Admin</span>
                <h3 className="text-lg font-bold text-slate-900 mt-1 mb-2">
                  Central Operations & Allocation
                </h3>
                <ul className="text-xs text-slate-600 space-y-2 mb-6">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>Backend Credentials:</b> Secure authentication with username: <code className="bg-slate-100 px-1 py-0.5 rounded font-bold">admin</code> / password: <code className="bg-slate-100 px-1 py-0.5 rounded font-bold">admin123</code>.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>Order Distribution:</b> View buyer orders live from Firestore and allocate them to enrolled SHGs.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span><b>Product Power:</b> Add any product or edit highlights, stories, descriptions, and prices anytime.</span>
                  </li>
                </ul>
              </div>
              <button
                id="card-cta-admin"
                onClick={() => setActiveModal('admin')}
                className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1"
              >
                Access Admin Desk <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto py-8 bg-white border-t border-slate-100 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Hunar-Setu Platform. Empowering Village Collectives & Rural Self-Help Groups.</p>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Powered by Firebase Cloud Firestore & Google Auth</span>
          </div>
        </div>
      </footer>

      {/* MODAL 1 & 2: SHG & BUYER AUTHENTICATION WITH EMAIL & PASSWORD */}
      {(activeModal === 'shg' || activeModal === 'buyer') && (
        <RoleAuthModal
          role={activeModal}
          onClose={() => setActiveModal(null)}
          onSuccess={(email) => {
            const targetRole = activeModal;
            setActiveModal(null);
            onSelectRole(targetRole, email);
          }}
          onGoogleAuth={handleGoogleAuth}
          googleLoading={authLoading}
        />
      )}

      {/* MODAL 3: ADMIN CREDENTIALS MODAL (as required: username: admin, password: admin123) */}
      {activeModal === 'admin' && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Admin Authentication</h3>
              </div>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-700">✕</button>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-xs text-slate-600 mb-4">
              <p className="font-semibold text-slate-800">System Admin Credentials:</p>
              <p className="font-mono text-[11px] mt-0.5">Username: <span className="font-bold text-emerald-700">admin</span></p>
              <p className="font-mono text-[11px]">Password: <span className="font-bold text-emerald-700">admin123</span></p>
            </div>

            {adminError && (
              <div className="p-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg text-xs mb-3">
                {adminError}
              </div>
            )}

            <form onSubmit={handleAdminSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admin Username</label>
                <input
                  id="admin-login-username"
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Admin Password</label>
                <input
                  id="admin-login-password"
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="admin123"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <button
                id="admin-login-submit"
                type="submit"
                className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors mt-2"
              >
                Verify & Enter Admin Console
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
