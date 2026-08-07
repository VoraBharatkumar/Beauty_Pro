'use client';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore } from '@/store';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

const mockSearchResults = [
  { id: 1, name: 'Rose Gold Serum', category: 'Skincare', href: '/product/rose-gold-serum', price: 3499 },
  { id: 2, name: 'Velvet Matte Lipstick', category: 'Makeup', href: '/product/velvet-matte-lipstick', price: 2499 },
  { id: 3, name: 'Silk Hair Elixir', category: 'Haircare', href: '/product/silk-hair-elixir', price: 1999 },
  { id: 4, name: 'Diamond Radiance Cream', category: 'Skincare', href: '/product/diamond-radiance-cream', price: 4999 },
  { id: 5, name: 'Rose Petal Mist', category: 'Fragrance', href: '/product/rose-petal-mist', price: 2999 },
];

export function SearchModal() {
  const isSearchOpen = useUIStore((state) => state.isSearchOpen);
  const closeSearch = useUIStore((state) => state.closeSearch);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const router = useRouter();
  const inputRef = React.useRef(null);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (query.trim()) {
      const filtered = mockSearchResults.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      closeSearch();
      router.push(`/shop?search=${encodeURIComponent(query)}`);
      setQuery('');
    }
  };

  return (
    <AnimatePresence>
      {isSearchOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-luna-dark/30 backdrop-blur-md z-50"
            onClick={closeSearch}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 left-0 right-0 z-50 glass-card rounded-none border-b border-white/20"
          >
            <div className="luna-container">
              <div className="py-6">
                <form onSubmit={handleSearch} className="relative">
                  <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-luna-coffee/60" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for products, brands, categories..."
                    className="w-full pl-12 pr-12 py-4 bg-luna-beige/50 border border-luna-peach/30 rounded-2xl text-lg text-luna-dark placeholder:text-luna-dark/40 focus:border-luna-rose-gold focus:outline-none focus:ring-2 focus:ring-luna-rose-gold/20 transition-all"
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-luna-dark/40 hover:text-luna-dark transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </form>

                {/* Search Results */}
                <AnimatePresence>
                  {results.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 border-t border-luna-peach/20 pt-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {results.map((item, index) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Link
                              href={item.href}
                              onClick={closeSearch}
                              className="flex items-center gap-4 p-3 rounded-xl hover:bg-luna-beige/50 transition-colors group"
                            >
                              <div className="w-16 h-16 rounded-lg bg-luna-beige flex items-center justify-center flex-shrink-0">
                                <MagnifyingGlassIcon className="w-6 h-6 text-luna-coffee/40" />
                              </div>
                              <div>
                                <h4 className="font-medium text-luna-dark group-hover:text-luna-rose-gold transition-colors">
                                  {item.name}
                                </h4>
                                <p className="text-sm text-luna-dark/60">{item.category}</p>
                                <p className="font-playfair text-luna-rose-gold mt-1">
                                  ₹{item.price.toLocaleString()}
                                </p>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Popular Searches */}
                {query === '' && (
                  <div className="mt-6">
                    <h3 className="text-sm font-medium text-luna-dark/60 mb-3">Popular Searches</h3>
                    <div className="flex flex-wrap gap-2">
                      {['Rose Gold Serum', 'Matte Lipstick', 'Hair Oil', 'Face Cream', 'Perfume'].map((term) => (
                        <button
                          key={term}
                          onClick={() => setQuery(term)}
                          className="px-4 py-2 bg-luna-beige/50 rounded-full text-sm text-luna-dark hover:bg-luna-rose-gold hover:text-white transition-colors"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

