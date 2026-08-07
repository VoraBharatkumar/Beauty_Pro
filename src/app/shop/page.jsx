'use client';
import { useEffect, useState, useCallback } from 'react';
import ProductCard from '@/components/shop/ProductCard';
import Button from '@/components/ui/Button';

export default function ShopPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');

  const loadProducts = useCallback(async () => {
    try {
      const url = selectedCategory === 'all' ? '/api/products' : `/api/products?category=${selectedCategory}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const categories = [
    { id: 'all', name: 'All Products', icon: '✨' },
    { id: 'skincare', name: 'Skincare', icon: '💎' },
    { id: 'makeup', name: 'Makeup', icon: '💄' },
    { id: 'haircare', name: 'Haircare', icon: '🌿' },
    { id: 'fragrance', name: 'Fragrance', icon: '🌸' },
    { id: 'body-care', name: 'Body Care', icon: '🧼' },
  ];

  return (
    <div className="min-h-screen bg-beauty-warm-white">
      {/* Header */}
      <div className="bg-white border-b border-beauty-peach/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-beauty-dark text-center mb-3">
            Our Collection
          </h1>
          <p className="text-beauty-coffee/70 text-center max-w-2xl mx-auto">
            Discover our complete range of luxury cosmetics and skincare essentials
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-16 md:top-20 z-40 bg-beauty-warm-white/95 backdrop-blur-md border-b border-beauty-peach/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(category.id);
                  setLoading(true);
                }}
                className={`flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                  selectedCategory === category.id
                    ? 'bg-beauty-rose-gold text-white shadow-md'
                    : 'bg-white text-beauty-dark hover:bg-beauty-beige border border-beauty-soft-brown/20'
                }`}
              >
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-beauty-beige rounded-2xl md:rounded-3xl mb-4" />
                <div className="h-4 bg-beauty-beige rounded w-3/4 mb-2" />
                <div className="h-3 bg-beauty-beige rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product, index) => (
              <ProductCard key={product._id} product={product} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 md:py-24">
            <div className="text-6xl mb-4">😢</div>
            <h3 className="font-serif text-2xl text-beauty-dark mb-2">No products found</h3>
            <p className="text-beauty-coffee/70 mb-6">Try selecting a different category</p>
            <Button variant="primary" onClick={() => setSelectedCategory('all')}>
              View All Products
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}