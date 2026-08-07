'use client';
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store';
import { UserIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { user, isAuthenticated, logout } = useAuthStore();

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 50);
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const toggleMenu = useCallback(() => setIsOpen(prev => !prev), []);
  const closeMenu = useCallback(() => setIsOpen(false), []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/shop', label: 'Shop' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl md:text-3xl font-bold">
              <span className="text-gradient">Beauty</span>
              <span className={scrolled ? 'text-beauty-dark' : 'text-beauty-dark'}>Pro</span>
            </span>
            <span className="text-xl opacity-80 group-hover:scale-110 transition-transform">✨</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  scrolled
                    ? 'text-beauty-dark hover:bg-beauty-beige/50'
                    : 'text-beauty-dark hover:bg-white/10'
                }`}
              >
                {link.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-beauty-rose-gold rounded-full transition-all duration-300 group-hover:w-8" />
              </Link>
            ))}
            
            <div className="ml-4 pl-4 border-l border-beauty-soft-brown/20 flex items-center gap-3">
              {isAuthenticated && user ? (
                <div className="flex items-center gap-1.5">
                  <Link
                    href="/account/orders"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      scrolled
                        ? 'text-beauty-dark hover:bg-beauty-beige/50'
                        : 'text-beauty-dark hover:bg-white/10'
                    }`}
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    <span className="hidden lg:inline">Orders</span>
                  </Link>
                  <Link
                    href="/account"
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      scrolled
                        ? 'text-beauty-dark hover:bg-beauty-beige/50'
                        : 'text-beauty-dark hover:bg-white/10'
                    }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span className="hidden lg:inline">{user.name}</span>
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      window.location.href = '/';
                    }}
                    className="px-4 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-beauty-rose-gold to-beauty-gold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                      scrolled
                        ? 'text-beauty-dark hover:bg-beauty-beige/50'
                        : 'text-beauty-dark hover:bg-white/10'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    className="px-5 py-2 rounded-full text-sm font-semibold bg-gradient-to-r from-beauty-rose-gold to-beauty-gold text-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className={`md:hidden w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              scrolled ? 'text-beauty-dark hover:bg-beauty-beige/50' : 'text-beauty-dark'
            }`}
            aria-label="Toggle menu"
          >
            <motion.div animate={{ rotate: isOpen ? 90 : 0 }} transition={{ duration: 0.3 }}>
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </motion.div>
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-beauty-peach/20"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  className="block px-4 py-3 rounded-xl text-base font-medium text-beauty-dark hover:bg-beauty-beige/50 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
               <div className="pt-4 mt-4 border-t border-beauty-peach/20 space-y-2">
                {isAuthenticated && user ? (
                  <>
                    <Link
                      href="/account"
                      onClick={closeMenu}
                      className="block w-full px-4 py-3 rounded-xl text-center text-base font-medium text-beauty-dark border border-beauty-soft-brown/30 hover:border-beauty-rose-gold transition-colors"
                    >
                      My Account
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        closeMenu();
                        window.location.href = '/';
                      }}
                      className="block w-full px-4 py-3 rounded-xl text-center text-base font-semibold bg-gradient-to-r from-beauty-rose-gold to-beauty-gold text-white shadow-md"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      onClick={closeMenu}
                      className="block w-full px-4 py-3 rounded-xl text-center text-base font-medium text-beauty-dark border border-beauty-soft-brown/30 hover:border-beauty-rose-gold transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      href="/signup"
                      onClick={closeMenu}
                      className="block w-full px-4 py-3 rounded-xl text-center text-base font-semibold bg-gradient-to-r from-beauty-rose-gold to-beauty-gold text-white shadow-md"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}