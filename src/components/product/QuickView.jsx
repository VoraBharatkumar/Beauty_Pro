/**
 * Beauty_Pro - Enhanced Quick View Modal
 * Features: Gallery, Variants, Quantity, Add to Cart, Wishlist, Order Now
 * Order Now checks login and redirects to checkout
 */

'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useUIStore, useCartStore, useWishlistStore, useAuthStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import { triggerLoginRequired } from '@/components/auth/LoginRequiredModal';
import { XMarkIcon, HeartIcon as HeartOutline, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';

export function QuickView() {
  const router = useRouter();
  const isQuickViewOpen = useUIStore((state) => state.isQuickViewOpen);
  const closeQuickView = useUIStore((state) => state.closeQuickView);
  const quickViewProduct = useUIStore((state) => state.quickViewProduct);
  const addItem = useCartStore((state) => state.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, items: wishlistItems } = useWishlistStore();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [addedToCart, setAddedToCart] = useState(false);

  // Early return AFTER all hooks are called
  if (!quickViewProduct) return null;

  const images = quickViewProduct.images || [];
  const variants = quickViewProduct.variants || [];
  const isInWishlist = wishlistItems.some((item) => item._id === quickViewProduct._id);
  const inStock = quickViewProduct.inStock !== false && quickViewProduct.stock > 0;
  const stockCount = quickViewProduct.stock || 0;
  const deliveryEstimate = inStock ? '3-5 Business Days' : 'Out of Stock';

  const handleAddToCart = () => {
    addItem({
      ...quickViewProduct,
      variant: selectedVariant || quickViewProduct.variant || 'Default',
      quantity,
      image: images[0]?.url || quickViewProduct.image || '',
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
    useUIStore.getState().showToast('Added to cart!', 'success');
  };

  const handleOrderNow = () => {
    addItem({
      ...quickViewProduct,
      variant: selectedVariant || quickViewProduct.variant || 'Default',
      quantity,
      image: images[0]?.url || quickViewProduct.image || '',
    });

    if (!isAuthenticated) {
      closeQuickView();
      triggerLoginRequired('/checkout');
      return;
    }

    closeQuickView();
    router.push('/checkout');
  };

  const handleWishlistToggle = () => {
    if (!isAuthenticated) {
      triggerLoginRequired(window.location.pathname);
      return;
    }
    if (isInWishlist) {
      removeFromWishlist(quickViewProduct._id);
      useUIStore.getState().showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(quickViewProduct);
      useUIStore.getState().showToast('Added to wishlist!', 'success');
    }
  };

  const nextImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const prevImage = () => {
    if (images.length > 1) {
      setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
    }
  };

  return (
    <AnimatePresence>
      {isQuickViewOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-luna-dark/30 backdrop-blur-sm z-50"
            onClick={closeQuickView}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-[95vw] max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl"
          >
            <button
              onClick={closeQuickView}
              className="absolute top-4 right-4 z-20 p-2 bg-white/90 rounded-full shadow-lg text-luna-dark hover:text-luna-rose-gold transition-colors"
              aria-label="Close quick view"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* ── Image Gallery ── */}
              <div className="relative aspect-square bg-luna-beige/30">
                {images.length > 0 ? (
                  <>
                    <Image
                      src={images[currentImageIndex]?.url || images[0]?.url}
                      alt={images[currentImageIndex]?.alt || quickViewProduct.name}
                      fill
                      className="object-cover transition-all duration-300"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    {images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                        {images.map((img, idx) => (
                          <button
                            key={idx}
                            onClick={() => setCurrentImageIndex(idx)}
                            className={`w-2.5 h-2.5 rounded-full transition-all ${
                              idx === currentImageIndex
                                ? 'bg-white w-6'
                                : 'bg-white/50 hover:bg-white/80'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                    {images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow"
                        >
                          <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white/80 rounded-full flex items-center justify-center hover:bg-white transition-colors shadow"
                        >
                          <ChevronRightIcon className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-luna-dark/30">
                    <svg className="w-20 h-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex gap-2">
                  {quickViewProduct.badge && (
                    <span className="px-3 py-1 bg-luna-rose-gold text-white text-xs font-medium rounded-full">
                      {quickViewProduct.badge}
                    </span>
                  )}
                  {quickViewProduct.discount > 0 && (
                    <span className="px-3 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                      -{quickViewProduct.discount}% OFF
                    </span>
                  )}
                </div>
              </div>

              {/* ── Product Details ── */}
              <div className="p-6 md:p-8 space-y-5 overflow-y-auto max-h-[90vh]">
                <div>
                  {quickViewProduct.category && (
                    <p className="text-xs text-luna-coffee tracking-wider uppercase mb-1 font-medium">
                      {quickViewProduct.category}
                      {quickViewProduct.subcategory && ` / ${quickViewProduct.subcategory}`}
                    </p>
                  )}
                  <h2 className="font-playfair text-2xl md:text-3xl text-luna-dark leading-tight">
                    {quickViewProduct.name}
                  </h2>
                </div>

                {quickViewProduct.rating && (
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${star <= Math.round(quickViewProduct.rating || 0) ? 'text-yellow-400' : 'text-gray-200'}`}
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-luna-dark/60">
                      {quickViewProduct.rating} ({quickViewProduct.reviewCount || 0} reviews)
                    </span>
                  </div>
                )}

                {quickViewProduct.shortDescription && (
                  <p className="text-luna-dark/70 leading-relaxed text-sm">
                    {quickViewProduct.shortDescription}
                  </p>
                )}

                {variants.length > 0 && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-luna-dark">
                      {selectedVariant ? `Selected: ${selectedVariant}` : 'Select Variant'}
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {variants.map((variant) => {
                        const vName = typeof variant === 'string' ? variant : variant.name || variant.value || '';
                        return (
                          <button
                            key={vName}
                            onClick={() => setSelectedVariant(vName)}
                            className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all ${
                              selectedVariant === vName
                                ? 'border-luna-rose-gold bg-luna-rose-gold/10 text-luna-rose-gold'
                                : 'border-luna-peach/30 hover:border-luna-rose-gold text-luna-dark'
                            }`}
                          >
                            {vName}
                            {variant.price && ` (+₹${variant.price})`}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="font-playfair text-3xl text-luna-dark">
                    {formatPrice(quickViewProduct.price)}
                  </span>
                  {quickViewProduct.originalPrice && quickViewProduct.originalPrice > quickViewProduct.price && (
                    <span className="text-lg text-luna-dark/40 line-through">
                      {formatPrice(quickViewProduct.originalPrice)}
                    </span>
                  )}
                  {quickViewProduct.discount > 0 && (
                    <span className="px-2.5 py-1 bg-red-50 text-red-600 text-xs font-semibold rounded-full border border-red-100">
                      Save {quickViewProduct.discount}%
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <div className={`flex items-center gap-1.5 text-sm ${inStock ? 'text-green-600' : 'text-red-500'}`}>
                    <span className={`w-2 h-2 rounded-full ${inStock ? 'bg-green-500' : 'bg-red-500'}`} />
                    <span className="font-medium">{inStock ? 'In Stock' : 'Out of Stock'}</span>
                  </div>
                  {inStock && stockCount <= 10 && stockCount > 0 && (
                    <span className="text-xs text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                      Only {stockCount} left
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-luna-beige/30 rounded-xl p-3 text-center">
                    <svg className="w-5 h-5 mx-auto text-luna-coffee mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <div className="text-xs text-luna-dark/60">Delivery Estimate</div>
                    <div className="text-sm font-medium text-luna-dark">{deliveryEstimate}</div>
                  </div>
                  <div className="bg-luna-beige/30 rounded-xl p-3 text-center">
                    <svg className="w-5 h-5 mx-auto text-luna-coffee mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <div className="text-xs text-luna-dark/60">Return Policy</div>
                    <div className="text-sm font-medium text-luna-dark">
                      {quickViewProduct.returnPolicy?.days || 7} Days Easy Return
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="text-sm font-medium text-luna-dark">Quantity:</label>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-full border-2 border-luna-peach/30 flex items-center justify-center hover:border-luna-rose-gold hover:bg-luna-rose-gold/5 transition-all"
                      disabled={!inStock}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
                    </button>
                    <span className="w-12 text-center text-lg font-medium text-luna-dark">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 rounded-full border-2 border-luna-peach/30 flex items-center justify-center hover:border-luna-rose-gold hover:bg-luna-rose-gold/5 transition-all"
                      disabled={!inStock}
                    >
                      <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    variant={addedToCart ? 'primary' : 'outline'}
                    size="lg"
                    className={`flex-1 ${addedToCart ? 'bg-green-500 hover:bg-green-600 border-green-500' : ''}`}
                    onClick={handleAddToCart}
                    disabled={!inStock}
                  >
                    {addedToCart ? '✓ Added to Cart' : 'Add to Cart'}
                  </Button>

                  <Button
                    variant="primary"
                    size="lg"
                    className="flex-1"
                    onClick={handleOrderNow}
                    disabled={!inStock}
                  >
                    Order Now
                  </Button>

                  <button
                    onClick={handleWishlistToggle}
                    className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                      isInWishlist
                        ? 'border-red-300 bg-red-50 text-red-500'
                        : 'border-luna-peach/30 hover:border-luna-rose-gold text-luna-dark/60 hover:text-luna-rose-gold'
                    }`}
                    aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {isInWishlist ? (
                      <HeartSolid className="w-5 h-5" />
                    ) : (
                      <HeartOutline className="w-5 h-5" />
                    )}
                  </button>
                </div>

                {quickViewProduct.shippingInfo?.freeShippingThreshold && (
                  <div className="text-xs text-center text-luna-dark/50 bg-luna-beige/20 rounded-lg py-2">
                    Free shipping on orders over {formatPrice(quickViewProduct.shippingInfo.freeShippingThreshold)}
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