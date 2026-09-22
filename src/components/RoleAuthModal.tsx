import React, { useState } from 'react';
import {
  Users,
  ShoppingBag,
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  Wand2,
  CheckCircle2,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import {
  authenticateUserWithPassword,
  registerUserAccount,
  findUserAccount
} from '../lib/cloudService';

interface RoleAuthModalProps {
  role: 'shg' | 'buyer';
  onClose: () => void;
  onSuccess: (email: string) => void;
  onGoogleAuth: (role: 'shg' | 'buyer') => Promise<void>;
  googleLoading: boolean;
}

export const RoleAuthModal: React.FC<RoleAuthModalProps> = ({
  role,
  onClose,
  onSuccess,
  onGoogleAuth,
  googleLoading
}) => {
  const [mode, setMode] = useState<'signin' | 'register'>('signin');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isNewUserDetected, setIsNewUserDetected] = useState<boolean>(false);

  const isSHG = role === 'shg';

  const handleFillDemo = () => {
    setError('');
    setIsNewUserDetected(false);
    setMode('signin');
    if (isSHG) {
      setEmail('shg.leader@hunarsetu.org');
      setPassword('shg123');
    } else {
      setEmail('shopper@hunarsetu.org');
      setPassword('buyer123');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsNewUserDetected(false);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError('Please provide a valid email address.');
      return;
    }

    if (!password || password.length < 3) {
      setError('Password must be at least 3 characters.');
      return;
    }

    if (mode === 'signin') {
      setLoading(true);
      try {
        const result = await authenticateUserWithPassword(cleanEmail, password, role);
        setLoading(false);
        if (result.success) {
          onSuccess(cleanEmail);
        } else {
          setError(result.error || 'Invalid credentials.');
          if (result.isNewUser) {
            setIsNewUserDetected(true);
          }
        }
      } catch (err: any) {
        setLoading(false);
        setError('Authentication error. Please try again.');
      }
    } else {
      // Register mode
      if (password !== confirmPassword) {
        setError('Passwords do not match. Please re-enter your confirm password.');
        return;
      }

      setLoading(true);
      try {
        const existing = await findUserAccount(cleanEmail, role);
        if (existing) {
          setLoading(false);
          setError(`An account with "${cleanEmail}" already exists. Please switch to Sign In with your password.`);
          return;
        }

        // Save account credentials in Firestore & local store
        // No email verification required per user specification
        await registerUserAccount(cleanEmail, password, role, name);
        setLoading(false);
        onSuccess(cleanEmail);
      } catch (err: any) {
        setLoading(false);
        setError('Account registration error. Please try again.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${
                isSHG ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-800'
              }`}
            >
              {isSHG ? <Users className="w-4 h-4 text-emerald-700" /> : <ShoppingBag className="w-4 h-4 text-slate-700" />}
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {isSHG ? 'SHG Group Authentication' : 'Buyer Marketplace Access'}
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                {isSHG
                  ? 'Access masterclasses & production batch allocation'
                  : 'Direct store purchase from authentic rural artisans'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 text-sm font-bold"
          >
            ✕
          </button>
        </div>

        {/* Tab Switcher: Sign In vs Create Account */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-4 text-xs font-semibold">
          <button
            type="button"
            id={`${role}-tab-signin`}
            onClick={() => {
              setMode('signin');
              setError('');
              setIsNewUserDetected(false);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
              mode === 'signin'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Sign In with Password
          </button>
          <button
            type="button"
            id={`${role}-tab-register`}
            onClick={() => {
              setMode('register');
              setError('');
              setIsNewUserDetected(false);
            }}
            className={`flex-1 py-1.5 rounded-lg transition-all text-center ${
              mode === 'register'
                ? 'bg-white text-slate-900 shadow-xs font-bold'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Create New Account
          </button>
        </div>

        {/* Informational Guidance Banner */}
        <div className="mb-4">
          {mode === 'signin' ? (
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-2 text-[11px] text-slate-600">
              <span>Enter registered email and password</span>
              <button
                type="button"
                id={`${role}-quick-demo-btn`}
                onClick={handleFillDemo}
                className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 hover:underline"
              >
                <Wand2 className="w-3 h-3 text-emerald-600" />
                Fill Demo Creds
              </button>
            </div>
          ) : (
            <div className="bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-3 py-2 text-[11px] text-emerald-800 flex items-start gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                <strong>Instant Signup:</strong> No email verification link required. Your email & password are saved and validated on future logins.
              </span>
            </div>
          )}
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex flex-col gap-1.5">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div className="leading-snug font-medium">{error}</div>
            </div>
            {isNewUserDetected && (
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                  setIsNewUserDetected(false);
                }}
                className="mt-1 text-left text-xs font-bold text-emerald-700 hover:text-emerald-800 underline flex items-center gap-1"
              >
                Click here to register this new email now <ArrowRight className="w-3 h-3" />
              </button>
            )}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {isSHG ? 'SHG Group / Collective Name' : 'Buyer Full Name'}
              </label>
              <input
                id={`${role}-modal-name-input`}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={isSHG ? 'e.g. Mahila Utthan SHG' : 'e.g. Ayush Raj'}
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {isSHG ? 'SHG Group Email *' : 'Buyer Email *'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id={`${role}-modal-email-input`}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isSHG ? 'shg.leader@hunarsetu.org' : 'shopper@hunarsetu.org'}
                className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Password *
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                id={`${role}-modal-password-input`}
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id={`${role}-modal-confirm-password-input`}
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          <button
            id={`${role}-enter-portal-submit`}
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 mt-4 text-white ${
              isSHG
                ? 'bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-400'
                : 'bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600'
            }`}
          >
            {loading ? (
              <span className="inline-block animate-spin">⟳</span>
            ) : mode === 'signin' ? (
              <>
                Sign In to {isSHG ? 'SHG Portal' : 'Buyer Store'} <ArrowRight className="w-3.5 h-3.5" />
              </>
            ) : (
              <>
                Create Account & Enter <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </button>
        </form>

        {/* Mode Toggle Link */}
        <div className="mt-3 text-center">
          {mode === 'signin' ? (
            <p className="text-xs text-slate-500">
              New to Hunar-Setu?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('register');
                  setError('');
                }}
                className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signin');
                  setError('');
                }}
                className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
              >
                Sign In
              </button>
            </p>
          )}
        </div>

        {/* Google Authentication Alternative */}
        <div className="relative flex py-3 items-center my-2">
          <div className="flex-grow border-t border-slate-200"></div>
          <span className="flex-shrink mx-2 text-[10px] text-slate-400 uppercase font-semibold">Or continue with</span>
          <div className="flex-grow border-t border-slate-200"></div>
        </div>

        <button
          id={`${role}-google-login-btn`}
          onClick={() => onGoogleAuth(role)}
          disabled={googleLoading}
          className="w-full py-2 px-4 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-2xs transition-colors"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};
