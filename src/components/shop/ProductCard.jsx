/**
 * Beauty_Pro - Product Card Component
 * Fully Responsive with mobile-optimized interactions
 * Shows up to 2 images per product with hover swap
 */

'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useUIStore, useCartStore, useWishlistStore } from '@/store';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/lib/utils';

export default function ProductCard({ product, index = 0 }) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState({ primary: false, secondary: false });
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

  // Collect up to 2 image URLs from all possible sources
  const allImages = [];
  
  // From images array (limit to 2)
  if (Array.isArray(data.images) && data.images.length > 0) {
    data.images.slice(0, 2).forEach((img) => {
      if (img && img.url && img.url.trim() !== '') {
        allImages.push(img.url);
      }
    });
  }
  
  // From legacy image field
  if (data.image && data.image.trim() !== '' && !allImages.includes(data.image)) {
    allImages.unshift(data.image);
  }

  // Build a category-based fallback image path
  const categoryKey = (data.category || '').toLowerCase().trim().replace(/\s+/g, '-');
  const fallbackImages = [
    `/images/products/${categoryKey}-product.svg`,
    '/images/products/placeholder.svg'
  ];

  // Ensure exactly 2 images with fallbacks
  const primaryImage = allImages[0] || fallbackImages[0];
  const secondaryImage = allImages[1] || primaryImage;
  const validImages = [primaryImage, secondaryImage];

  const isExternal = (url) => url.startsWith('http');
  const isLocalSvg = (url) => url.endsWith('.svg') || url.endsWith('.webp');

  // Reset image error when product or image changes
  useEffect(() => {
    setImageError({ primary: false, secondary: false });
  }, [data._id, primaryImage, secondaryImage]);

  const handleImageError = (position) => {
    setImageError((prev) => ({ ...prev, [position]: true }));
  };

  // Render image based on type
  const renderImage = (src, alt, position) => {
    if (imageError[position]) {
      return (
        <div className="w-full h-full flex items-center justify-center text-4xl md:text-6xl bg-gradient-to-br from-luna-peach to-luna-rose-gold">
          ✨
        </div>
      );
    }

    if (isExternal(src) || isLocalSvg(src)) {
      return (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className="w-full h-full object-cover"
          onError={() => handleImageError(position)}
        />
      );
    }

    return (
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
        className="object-cover"
        loading="lazy"
        decoding="async"
        quality={75}
        onError={() => handleImageError(position)}
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
            {renderImage(validImages[0], data.name, 'primary')}
          </div>

          {/* Secondary Image - shows on hover */}
          {validImages[1] && validImages[1] !== validImages[0] && (
            <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
              {renderImage(validImages[1], `${data.name} - View 2`, 'secondary')}
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

          {/* Image counter dots */}
          {validImages[1] && validImages[1] !== validImages[0] && (
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isHovered ? 'bg-white/40' : 'bg-white'}`} />
              <span className={`w-1.5 h-1.5 rounded-full transition-colors ${isHovered ? 'bg-white' : 'bg-white/40'}`} />
            </div>
          )}
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