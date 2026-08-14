/**
 * Beauty_Pro - Product Card Component
 * Fully Responsive with mobile-optimized interactions
 * Shows up to 2 images per product with hover swap
 */

'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useUIStore, useCartStore, useWishlistStore } from '@/store';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

const INLINE_IMAGE_FALLBACK =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0%25' stop-color='%23f8ece7'/%3E%3Cstop offset='100%25' stop-color='%23eed7ce'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='800' fill='url(%23g)'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial,sans-serif' font-size='42' fill='%23846b61'%3EBeauty Pro%3C/text%3E%3C/svg%3E";

const CATEGORY_IMAGE_FALLBACKS = {
  skincare: '/images/products/skincare-serum.svg',
  makeup: '/images/products/makeup-lipstick.svg',
  haircare: '/images/products/haircare-oil.svg',
  fragrance: '/images/products/fragrance-mist.svg',
  'body-care': '/images/products/body-care-lotion.svg',
};

const normalizeImageUrl = (value) => {
  if (!value || typeof value !== 'string') {
    return '';
  }

  let normalized = value.trim().replace(/\\/g, '/');
  if (!normalized) {
    return '';
  }

  if (
    normalized.startsWith('http://') ||
    normalized.startsWith('https://') ||
    normalized.startsWith('data:') ||
    normalized.startsWith('blob:')
  ) {
    return normalized;
  }

  normalized = normalized.replace(/^\.+\//, '');

  if (normalized.startsWith('/public/')) {
    normalized = normalized.replace('/public/', '/');
  } else if (normalized.startsWith('public/')) {
    normalized = normalized.replace('public/', '');
  }

  if (!normalized.startsWith('/')) {
    normalized = `/${normalized}`;
  }

  return normalized;
};

export default function ProductCard({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const openQuickView = useUIStore((state) => state.openQuickView);
  const addItem = useCartStore((state) => state.addItem);
  const wishlistItems = useWishlistStore((state) => state.items);
  const addToWishlist = useWishlistStore((state) => state.addItem);

  const data = product || {
    _id: index,
    name: 'Rose Gold Radiance Serum',
    category: 'Skincare',
    price: 3499,
    originalPrice: 4999,
    image: null,
    images: [],
    badge: 'Best Seller',
    rating: 4.8,
    reviewCount: 124,
    variants: ['30ml', '50ml'],
  };

  const isInWishlist = wishlistItems.some((item) => item._id === data._id);
  const discount = data.originalPrice
    ? Math.round(((data.originalPrice - data.price) / data.originalPrice) * 100)
    : 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addItem({
      ...data,
      variant: data.variants?.[0] || '',
      quantity: 1,
      image: data.images?.[0]?.url || data.image || null,
    });
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    openQuickView(data);
  };

  const productSlug = data.slug || data._id;
  const normalizedCategory = (data.category || '').toLowerCase();

  const collectedImages = [
    ...(Array.isArray(data.images) ? data.images.map((item) => item?.url) : []),
    data.image,
  ]
    .map(normalizeImageUrl)
    .filter(Boolean);

  const uniqueImages = [...new Set(collectedImages)];
  const categoryFallback = CATEGORY_IMAGE_FALLBACKS[normalizedCategory] || '/images/products/skincare-serum.svg';
  const primaryImage = uniqueImages[0] || categoryFallback;
  const secondaryImage = uniqueImages[1] || '';
  const showSecondaryImage = Boolean(secondaryImage && secondaryImage !== primaryImage);

  const renderImage = (src, alt, keyPrefix) => {
    const safeSource = normalizeImageUrl(src) || categoryFallback;

    return (
      <img
        key={`${keyPrefix}-${safeSource}`}
        src={safeSource}
        alt={alt}
        loading="lazy"
        className="w-full h-full object-contain"
        onError={(event) => {
          const imageElement = event.currentTarget;

          if (!imageElement.dataset.usedPlaceholder) {
            imageElement.dataset.usedPlaceholder = 'true';
            imageElement.src = '/images/products/placeholder.svg';
            return;
          }

          if (!imageElement.dataset.usedInlineFallback) {
            imageElement.dataset.usedInlineFallback = 'true';
            imageElement.src = INLINE_IMAGE_FALLBACK;
          }
        }}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '50px' }}
      transition={{ delay: index * 0.05, duration: 0.5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group w-full"
    >
      <Link href={`/product/${productSlug}`} className="block">
        <div className="relative aspect-[3/4] bg-luna-beige rounded-2xl md:rounded-3xl overflow-hidden mb-3 md:mb-4">
          {/* Primary Image - always visible */}
          <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-0' : 'opacity-100'}`}>
            {renderImage(primaryImage, data.name, 'primary')}
          </div>

          {/* Secondary Image - shows on hover */}
          {showSecondaryImage && (
            <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              {renderImage(secondaryImage, `${data.name} - View 2`, 'secondary')}
            </div>
          )}

          {/* Badge */}
          {(data.badge || discount > 0) && (
            <span className="absolute top-2 left-2 md:top-3 md:left-3 px-2 md:px-3 py-0.5 md:py-1 bg-luna-rose-gold text-white text-[10px] md:text-xs font-medium rounded-full z-10">
              {data.badge || `-${discount}%`}
            </span>
          )}

          {/* Hover overlay - hidden on mobile, shown on desktop */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 hidden md:block" />

          <div className="absolute bottom-3 left-3 right-3 md:bottom-4 md:left-4 md:right-4 opacity-0 md:group-hover:opacity-100 transition-all duration-300 translate-y-4 md:group-hover:translate-y-0 hidden md:block">
            <Button
              variant="primary"
              size="sm"
              className="w-full mb-2 text-sm"
              onClick={handleQuickView}
            >
              Quick View
            </Button>
          </div>

          {/* Mobile-friendly wishlist button - always visible on mobile */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={(e) => {
              e.preventDefault();
              addToWishlist(data);
            }}
            className="absolute top-2 right-2 md:top-3 md:right-3 w-8 h-8 md:w-10 md:h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 hover:bg-white shadow-md z-10"
            aria-label="Add to wishlist"
          >
            <svg
              className={`w-4 h-4 md:w-5 md:h-5 ${isInWishlist ? 'text-red-500 fill-current' : 'text-luna-dark'}`}
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </motion.button>

        </div>

        <div className="px-0.5">
          <p className="text-[10px] md:text-xs text-luna-coffee tracking-wider uppercase mb-1">
            {data.category}
          </p>
          <h3 className="text-sm md:text-base font-medium text-luna-dark mb-1 md:mb-2 group-hover:text-luna-rose-gold transition-colors line-clamp-1">
            {data.name}
          </h3>

          {/* Rating - simplified on mobile */}
          {data.rating && (
            <div className="flex items-center gap-1 mb-1 md:mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-2.5 h-2.5 md:w-3 md:h-3 ${
                      star <= Math.round(data.rating) ? 'text-yellow-400 fill-current' : 'text-luna-peach'
                    }`}
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-[10px] md:text-xs text-luna-dark/60">
                ({data.reviewCount || 0})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-1.5 md:gap-2">
            <span className="font-playfair text-base md:text-xl text-luna-rose-gold">
              {formatPrice(data.price)}
            </span>
            {data.originalPrice && (
              <span className="text-xs md:text-sm text-luna-dark/40 line-through">
                {formatPrice(data.originalPrice)}
              </span>
            )}
          </div>

          {data.variants && data.variants.length > 0 && (
            <p className="text-[10px] md:text-xs text-luna-dark/60 mt-0.5 md:mt-1">
              {data.variants[0]}
            </p>
          )}
        </div>
      </Link>
    </motion.div>
  );
}