/**
 * Beauty_Pro - Login Required Modal
 * Shows when a guest user tries to Order, Checkout, or Wishlist
 * After login, redirects back to the product/page
 */

'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuthStore, useUIStore } from '@/store';
import Button from '@/components/ui/Button';

export default function LoginRequiredModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [redirectPath, setRedirectPath] = useState('/');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const router = useRouter();
  const login = useAuthStore((state) => state.login);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Listen for login-required events
  useEffect(() => {
    const handler = (event) => {
      const path = event.detail?.redirectPath || window.location.pathname;
      setRedirectPath(path);
      setIsOpen(true);
    };
    window.addEventListener('open-login-required', handler);
    return () => window.removeEventListener('open-login-required', handler);
  }, []);

  // Close if user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      setIsOpen(false);
    }
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'login',
          email,
          password,
        }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        login(data.user, data.token);
        setIsOpen(false);
        // Redirect back to the original path
        router.push(redirectPath);
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] w-[95vw] max-w-md"
          >
            <div className="bg-white rounded-3xl shadow-2xl p-8 relative">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-beauty-beige/50 hover:bg-beauty-beige transition-colors"
              >
                <XMarkIcon className="w-5 h-5 text-beauty-dark" />
              </button>

              {/* Icon */}
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-beauty-rose-gold to-beauty-gold rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h2 className="font-playfair text-2xl text-beauty-dark mb-2">Login Required</h2>
                <p className="text-beauty-dark/60 text-sm">
                  Please sign in to continue with your order
                </p>
              </div>

              {/* Error */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-4">
                  {error}
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-beauty-dark mb-1.5">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-beauty-beige/50 border border-beauty-peach/30 rounded-xl focus:border-beauty-rose-gold focus:outline-none focus:ring-1 focus:ring-beauty-rose-gold/20 transition-colors"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-beauty-dark mb-1.5">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-beauty-beige/50 border border-beauty-peach/30 rounded-xl focus:border-beauty-rose-gold focus:outline-none focus:ring-1 focus:ring-beauty-rose-gold/20 transition-colors"
                    placeholder="••••••••"
                  />
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-beauty-peach/30"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-beauty-dark/40">Don't have an account?</span>
                </div>
              </div>

              {/* Sign Up Link */}
              <Link
                href={`/signup?redirect=${encodeURIComponent(redirectPath)}`}
                onClick={handleClose}
                className="block w-full px-5 py-3 rounded-xl text-center text-sm font-semibold bg-gradient-to-r from-beauty-rose-gold to-beauty-gold text-white shadow-md hover:shadow-lg transition-all"
              >
                Create New Account
              </Link>

              {/* Continue as Guest */}
              <button
                onClick={handleClose}
                className="block w-full mt-3 text-center text-sm text-beauty-dark/50 hover:text-beauty-dark transition-colors"
              >
                Continue as Guest (Limited Access)
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// Helper function to trigger the modal from anywhere
export function triggerLoginRequired(redirectPath) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-login-required', {
      detail: { redirectPath },
    }));
  }
}