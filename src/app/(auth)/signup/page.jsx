/**
 * Beauty_Pro - Signup Page
 */

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store';
import Button from '@/components/ui/Button';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'signup',
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (data.success && data.token) {
        login(data.user, data.token);
        window.location.href = '/account';
      } else {
        setError(data.message || 'Failed to create account');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="luna-gradient min-h-screen pt-20 flex items-center justify-center">
      <div className="luna-container section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="glass-card p-8 md:p-12">
            <div className="text-center mb-8">
              <Link href="/" className="inline-block mb-6">
                <span className="font-playfair text-3xl font-bold text-luna-dark tracking-wider">LUNA</span>
                <span className="block text-[10px] tracking-[0.3em] text-luna-coffee uppercase -mt-1">Beauty</span>
              </Link>
              <h1 className="font-playfair text-3xl md:text-4xl text-luna-dark mb-2">Create Account</h1>
              <p className="text-luna-dark/60">Join the Beauty_Pro community</p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-luna-dark mb-2">Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-luna-dark mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-luna-dark mb-2">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-luna-dark mb-2">Password</label>
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-luna-dark mb-2">Confirm Password</label>
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full px-4 py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none"
                  placeholder="••••••••"
                />
              </div>

              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" required className="w-4 h-4 text-luna-rose-gold rounded mt-0.5" />
                <span className="text-sm text-luna-dark/70">
                  I agree to the Terms of Service and Privacy Policy
                </span>
              </label>

              <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                Create Account
              </Button>

              <p className="text-center text-sm text-luna-dark/60 mt-6">
                Already have an account? <Link href="/login" className="text-luna-rose-gold hover:text-luna-coffee font-medium">Sign in</Link>
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

