'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useWishlistStore, useCartStore, useUIStore } from '@/store';
import { formatPrice } from '@/lib/utils';

export default function AccountWishlistPage() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);
  const addItem = useCartStore((state) => state.addItem);
  const showToast = useUIStore((state) => state.showToast);

  const handleMoveToCart = (item) => {
    addItem({ ...item, variant: item.variants?.[0] || '', quantity: 1 });
    removeItem(item._id);
    showToast('Moved to cart!', 'success');
  };

  if (items.length === 0) {
    return (
      <div className="luna-gradient min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🤍</div>
          <h1 className="font-playfair text-3xl md:text-4xl text-luna-dark mb-4">Your Wishlist is Empty</h1>
          <p className="text-luna-dark/60 mb-8">Save your favorite items and shop them later.</p>
          <Link href="/shop">
            <Button variant="primary" size="lg">Explore Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="luna-gradient min-h-screen pt-20">
      <div className="luna-container section-padding">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="font-playfair text-3xl md:text-5xl text-luna-dark mb-4">My Wishlist</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luna-rose-gold to-transparent mx-auto" />
          <p className="text-luna-dark/60 mt-4">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
          {items.map((item, index) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <div className="relative aspect-[3/4] bg-luna-beige rounded-2xl md:rounded-3xl overflow-hidden mb-3 md:mb-4">
                <div className="w-full h-full flex items-center justify-center text-4xl md:text-6xl bg-gradient-to-br from-luna-peach to-luna-rose-gold">
                  ✨
                </div>
                <button
                  onClick={() => removeItem(item._id)}
                  className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-md transition-colors"
                  aria-label="Remove from wishlist"
                >
                  <svg className="w-4 h-4 md:w-5 md:h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div>
                <p className="text-[10px] md:text-xs text-luna-coffee tracking-wider uppercase mb-1">{item.category || 'Category'}</p>
                <h3 className="text-sm md:text-base font-medium text-luna-dark mb-1 md:mb-2 line-clamp-1">{item.name}</h3>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-playfair text-base md:text-lg text-luna-rose-gold">{formatPrice(item.price)}</span>
                  {item.originalPrice && (
                    <span className="text-xs md:text-sm text-luna-dark/40 line-through">{formatPrice(item.originalPrice)}</span>
                  )}
                </div>
                <Button variant="primary" size="sm" className="w-full" onClick={() => handleMoveToCart(item)}>
                  Move to Cart
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

