/**
 * LUNA BEAUTY - Product Detail Page
 * Fixed for Next.js 16 params Promise API
 */

'use client';
import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useUIStore, useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function ProductPage({ params }) {
  // Unwrap params Promise (Next.js 16)
  const { id } = use(params);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedVariant, setSelectedVariant] = useState('');
  const openQuickView = useUIStore((state) => state.openQuickView);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (data.success && data.product) {
          setProduct(data.product);
        }
      } catch (e) {
        console.error('Failed to load product:', e);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Redirect to slug URL if product has slug but different ID
  useEffect(() => {
    if (product && product.slug && product.slug !== id && !product._id.includes('-')) {
      window.history.replaceState({}, '', `/product/${product.slug}`);
    }
  }, [product, id]);

  if (loading) {
    return (
      <div className="luna-gradient min-h-screen pt-16 md:pt-20">
        <div className="luna-container section-padding">
          <div className="text-center text-luna-dark/70 py-20">
            <div className="w-12 h-12 border-4 border-luna-rose-gold/30 border-t-luna-rose-gold rounded-full animate-spin mx-auto mb-4" />
            <p>Loading product...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="luna-gradient min-h-screen pt-16 md:pt-20">
        <div className="luna-container section-padding">
          <div className="text-center space-y-4 py-20">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-luna-dark/70 text-lg">Product not found</p>
            <Link href="/shop">
              <Button variant="primary">Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const isSvgImage = (url) => url?.endsWith('.svg') || url?.endsWith('.webp');
  const imageFitClass = (url) => isSvgImage(url) ? 'object-contain' : 'object-cover';

  const handleAddToCart = () => {
    addItem({
      ...product,
      variant: selectedVariant || product.variants[0],
      quantity,
      image: product.images[0]?.url,
    });
  };

  const relatedProducts = [1, 2, 3, 4].map((i) => ({
    _id: `${id}-${i}`,
    name: `Related Product ${i}`,
    category: product.category,
    price: 1999 + i * 500,
    badge: i === 1 ? 'New' : undefined,
  }));

  return (
    <div className="luna-gradient min-h-screen pt-16 md:pt-20">
      <div className="luna-container section-padding">
        {/* Breadcrumb - Responsive */}
        <nav className="text-xs md:text-sm text-luna-dark/60 mb-6 md:mb-8 flex flex-wrap gap-1">
          <Link href="/" className="hover:text-luna-rose-gold">Home</Link>
          <span className="mx-1">/</span>
          <Link href="/shop" className="hover:text-luna-rose-gold">Shop</Link>
          <span className="mx-1">/</span>
          <Link href={`/shop?category=${product.category.toLowerCase()}`} className="hover:text-luna-rose-gold">
            {product.category}
          </Link>
          <span className="mx-1">/</span>
          <span className="text-luna-dark line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16">
          {/* Product Images */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-3 md:space-y-4"
          >
            {/* Main Image */}
            <div className="relative aspect-square bg-luna-beige rounded-2xl md:rounded-3xl overflow-hidden">
              {product.images[selectedImage]?.url ? (
                <Image
                  src={product.images[selectedImage].url}
                  alt={product.images[selectedImage].alt || product.name}
                  fill
                  className={imageFitClass(product.images[selectedImage].url)}
                  priority
                  quality={80}
                  decoding="async"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-luna-peach to-luna-rose-gold">
                  <span className="font-playfair text-6xl md:text-8xl text-white/50">L</span>
                </div>
              )}
              {discount > 0 && (
                <span className="absolute top-3 left-3 md:top-4 md:left-4 px-3 md:px-4 py-1.5 md:py-2 bg-red-500 text-white text-xs md:text-sm font-medium rounded-full">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all ${
                    selectedImage === idx ? 'border-luna-rose-gold' : 'border-transparent'
                  }`}
                >
                  {img.url ? (
                    <div className="w-full h-full relative">
                      <Image
                        src={img.url}
                        alt={img.alt || `${product.name} - Image ${idx + 1}`}
                        fill
                        sizes="(max-width: 640px) 25vw, 25vw"
                        className={imageFitClass(img.url)}
                      />
                    </div>
                  ) : (
                    <div className="w-full h-full bg-luna-peach/50 flex items-center justify-center">
                      <span className="text-lg md:text-2xl">✨</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </motion.div>

          {/* Product Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4 md:space-y-6"
          >
            <div>
              <p className="text-xs md:text-sm text-luna-coffee tracking-wider uppercase mb-1 md:mb-2">
                {product.category}
              </p>
              <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-luna-dark mb-3 md:mb-4">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                      key={star}
                      className={`w-4 h-4 md:w-5 md:h-5 ${
                        star <= Math.round(product.rating) ? 'text-yellow-400 fill-current' : 'text-luna-peach'
                      }`}
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs md:text-sm text-luna-dark/60">
                  {product.rating} ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-2 md:gap-3">
                <span className="font-playfair text-3xl md:text-4xl text-luna-dark">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg md:text-xl text-luna-dark/40 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-sm md:text-base text-luna-dark/70 leading-relaxed">
              {product.description}
            </p>

            {/* Variants */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-2 md:space-y-3">
                <label className="text-sm font-medium text-luna-dark">
                  Size: {selectedVariant || product.variants[0]}
                </label>
                <div className="flex flex-wrap gap-2 md:gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-4 md:px-6 py-2.5 md:py-3 rounded-xl border-2 font-medium text-sm md:text-base transition-all ${
                        (selectedVariant || product.variants[0]) === variant
                          ? 'border-luna-rose-gold bg-luna-rose-gold/10 text-luna-rose-gold'
                          : 'border-luna-peach/30 hover:border-luna-rose-gold text-luna-dark'
                      }`}
                    >
                      {variant}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="space-y-2 md:space-y-3">
              <label className="text-sm font-medium text-luna-dark">Quantity</label>
              <div className="flex items-center gap-3 md:gap-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-luna-peach/30 flex items-center justify-center hover:border-luna-rose-gold transition-colors text-base md:text-lg"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="w-12 md:w-16 text-center text-lg md:text-xl font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-luna-peach/30 flex items-center justify-center hover:border-luna-rose-gold transition-colors text-base md:text-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                {product.inStock ? (
                  <span className="text-xs md:text-sm text-green-600 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-600 rounded-full" />
                    In Stock
                  </span>
                ) : (
                  <span className="text-xs md:text-sm text-red-500">Out of Stock</span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 md:gap-4 pt-3 md:pt-4">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                onClick={handleAddToCart}
                disabled={!product.inStock}
              >
                Add to Cart
              </Button>
              <Button variant="outline" size="lg" className="px-4 md:px-6">
                <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </Button>
            </div>

            {/* Benefits */}
            <div className="pt-6 md:pt-8 border-t border-luna-peach/20">
              <h3 className="font-playfair text-lg md:text-xl text-luna-dark mb-3 md:mb-4">Key Benefits</h3>
              <ul className="space-y-1.5 md:space-y-2">
                {product.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-center gap-2 md:gap-3 text-sm md:text-base text-luna-dark/70">
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-luna-rose-gold flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>

            {/* Shipping Info */}
            <div className="grid grid-cols-2 gap-3 md:gap-4 pt-4 md:pt-6">
              <div className="p-3 md:p-4 bg-luna-beige/50 rounded-xl text-center">
                <div className="text-xl md:text-2xl mb-1 md:mb-2">🚚</div>
                <p className="text-[10px] md:text-xs text-luna-dark/60">Free Shipping</p>
                <p className="text-xs md:text-sm font-medium text-luna-dark">On orders ₹1000+</p>
              </div>
              <div className="p-3 md:p-4 bg-luna-beige/50 rounded-xl text-center">
                <div className="text-xl md:text-2xl mb-1 md:mb-2">↩️</div>
                <p className="text-[10px] md:text-xs text-luna-dark/60">Easy Returns</p>
                <p className="text-xs md:text-sm font-medium text-luna-dark">7 Day Policy</p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-12 md:mt-20 border-t border-luna-peach/20 pt-10 md:pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
            <div>
              <h3 className="font-playfair text-xl md:text-2xl text-luna-dark mb-3 md:mb-4">Ingredients</h3>
              <p className="text-sm md:text-base text-luna-dark/70 leading-relaxed">{product.ingredients}</p>
            </div>
            <div>
              <h3 className="font-playfair text-xl md:text-2xl text-luna-dark mb-3 md:mb-4">How to Use</h3>
              <p className="text-sm md:text-base text-luna-dark/70 leading-relaxed">{product.howToUse}</p>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-12 md:mt-20">
          <h2 className="font-playfair text-2xl md:text-3xl lg:text-4xl text-luna-dark mb-6 md:mb-8 text-center">
            You May Also Like
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {relatedProducts.map((prod, idx) => (
              <Link key={prod._id} href={`/product/${prod._id}`}>
                <div className="aspect-[3/4] bg-luna-beige rounded-2xl md:rounded-3xl flex items-center justify-center text-3xl md:text-4xl hover:scale-105 transition-transform duration-300">
                  ✨
                </div>
                <h3 className="text-sm md:text-base font-medium text-luna-dark mt-2 md:mt-3 line-clamp-1">{prod.name}</h3>
                <p className="font-playfair text-sm md:text-base text-luna-rose-gold">{formatPrice(prod.price)}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}