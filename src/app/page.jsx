/**
 * Beauty_Pro - Luxury Cosmetics E-Commerce
 * Cinematic Homepage - Fully Responsive
 */

'use client';
import { useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/shop/ProductCard';

// Best seller products for demo
const ALL_PRODUCT_IMAGE = '/images/products/makeup-eyeshadow.svg';

const bestSellerProducts = [
  { _id: 'demo-1', name: 'Rose Gold Radiance Serum', category: 'Skincare', price: 3499, originalPrice: 4999, badge: 'Best Seller', rating: 4.8, reviewCount: 124, variants: ['30ml', '50ml'], images: [{ url: ALL_PRODUCT_IMAGE, alt: 'Rose Gold Radiance Serum', isPrimary: true }], description: '24k gold serum for radiant skin.' },
  { _id: 'demo-4', name: 'Diamond Radiance Cream', category: 'Skincare', price: 4999, originalPrice: 5999, badge: 'Exclusive', rating: 4.9, reviewCount: 210, variants: ['50ml'], images: [{ url: ALL_PRODUCT_IMAGE, alt: 'Diamond Radiance Cream', isPrimary: true }], description: 'Diamond-infused luxury moisturizer.' },
  { _id: 'demo-19', name: 'Rose Petal Mist', category: 'Fragrance', price: 1299, originalPrice: 1499, rating: 4.5, reviewCount: 34, variants: ['100ml', '150ml'], images: [{ url: ALL_PRODUCT_IMAGE, alt: 'Rose Petal Mist', isPrimary: true }], description: 'Instant hydration with rose water.' },
  { _id: 'demo-25', name: 'Luxe Body Lotion', category: 'Body Care', price: 1799, originalPrice: 2199, badge: 'Sale', rating: 4.4, reviewCount: 67, variants: ['200ml', '400ml'], images: [{ url: ALL_PRODUCT_IMAGE, alt: 'Luxe Body Lotion', isPrimary: true }], description: 'Soft, smooth skin with shea butter.' },
];

export default function HomePage() {
  const [products, setProducts] = useState([]);

  const fetchBestSellers = useCallback(async () => {
    try {
      const res = await fetch('/api/products?filter=bestsellers');
      const data = await res.json();
      if (data.success && data.products && data.products.length > 0) {
        setProducts(data.products);
      } else {
        setProducts(bestSellerProducts);
      }
    } catch (e) {
      setProducts(bestSellerProducts);
    }
  }, [setProducts]);

  useEffect(() => {
    fetchBestSellers();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section with Video */}
      <section className="relative min-h-[90vh] md:min-h-[100vh] flex items-center justify-center overflow-hidden bg-gradient-to-b from-beauty-cream via-beauty-light to-beauty-beige">
        {/* Video Background */}
        <div className="absolute inset-0 w-full h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
            poster="/images/products/placeholder.svg"
          >
            <source src="/videos/homepage.mp4" type="video/mp4" />
          </video>
          {/* Video Overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-beauty-cream/5 via-beauty-light/2.5 to-beauty-beige/5" />
        </div>

        {/* Background Glow */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-0 w-full h-full opacity-40">
            <div className="absolute top-1/4 -left-48 w-96 h-96 bg-beauty-rose-gold/20 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-beauty-gold/20 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-0">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Text Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="text-center lg:text-left space-y-6"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2, duration: 0.8 }}
                className="inline-block px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-beauty-rose-gold/20 mt-10 md:mt-16"
              >
                <span className="text-xs md:text-sm font-medium tracking-[0.2em] uppercase text-beauty-coffee">
                  Premium Beauty Collection
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="font-serif text-5xl sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl text-beauty-dark leading-tight"
              >
                Discover Your
                <span className="block text-gradient mt-2">Radiance</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-base md:text-lg text-beauty-coffee/80 max-w-xl mx-auto lg:mx-0 leading-relaxed"
              >
                Experience luxury cosmetics crafted with passion. Elevate your beauty ritual with our premium skincare, makeup, and fragrance collection.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button variant="primary" size="lg" href="/shop" magnetic>
                  Explore Collection
                </Button>
                <Button variant="outline" size="lg" href="/about" magnetic>
                  Our Story
                </Button>
              </motion.div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-beauty-dark mb-4">
              Shop by Category
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-beauty-rose-gold to-transparent mx-auto" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
            {[
              { name: 'Skincare', icon: '💎', href: '/shop?category=skincare' },
              { name: 'Makeup', icon: '✨', href: '/shop?category=makeup' },
              { name: 'Haircare', icon: '🌿', href: '/shop?category=haircare' },
              { name: 'Fragrance', icon: '🌸', href: '/shop?category=fragrance' },
              { name: 'Body Care', icon: '🧼', href: '/shop?category=body-care' },
              { name: 'Best Sellers', icon: '🏆', href: '/shop?filter=bestsellers' },
              { name: 'New Arrivals', icon: '🌟', href: '/shop?filter=new' },
              { name: 'Sale', icon: '🔥', href: '/shop?filter=sale' },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  href={category.href}
                  className="group block p-6 md:p-8 bg-gradient-to-br from-beauty-light to-white rounded-2xl md:rounded-3xl luxury-shadow hover:luxury-shadow-lg transition-all duration-500 hover:-translate-y-1"
                >
                  <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full bg-gradient-to-br from-beauty-rose-gold/20 to-beauty-gold/20 flex items-center justify-center text-2xl md:text-3xl group-hover:scale-110 transition-transform duration-500">
                    {category.icon}
                  </div>
                  <h3 className="font-serif text-base md:text-lg text-center text-beauty-dark font-medium">
                    {category.name}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Brand Story Section */}
      <section className="py-20 md:py-28 bg-beauty-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-square bg-gradient-to-br from-beauty-peach to-beauty-rose-gold rounded-3xl overflow-hidden luxury-shadow-lg">
                <img src="/images/home/home.jpg" alt="Beauty Pro" className="w-full h-full object-cover" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6 text-center lg:text-left"
            >
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-beauty-dark">
                Crafted with Love, Worn with Pride
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-beauty-rose-gold to-beauty-gold mx-auto lg:mx-0" />
              <p className="text-base md:text-lg text-beauty-coffee/70 leading-relaxed">
                At Beauty_Pro, we believe beauty is more than skin deep. Our products are crafted with the finest ingredients, combining nature's best with advanced science.
              </p>
              <p className="text-base md:text-lg text-beauty-coffee/70 leading-relaxed">
                Every product tells a story of passion, dedication, and the pursuit of perfection. Join us on this journey to discover your most radiant self.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 md:gap-8 pt-6 md:pt-8">
                {[
                  { number: '50K+', label: 'Happy Customers' },
                  { number: '30+', label: 'Products' },
                  { number: '15+', label: 'Years Experience' },
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="font-serif text-2xl md:text-3xl text-gradient mb-1 md:mb-2">
                      {stat.number}
                    </div>
                    <div className="text-xs md:text-sm text-beauty-coffee/60">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="pt-4">
                <Button variant="primary" size="lg" href="/about" magnetic>
                  Learn More
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0 mb-12 md:mb-16"
          >
            <div className="text-center sm:text-left">
              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-beauty-dark mb-3">
                Best Sellers
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-beauty-rose-gold to-beauty-gold mx-auto sm:mx-0" />
            </div>
            <Link href="/shop?filter=bestsellers">
              <Button variant="outline" magnetic>View All</Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {products.length > 0 ? (
              products.slice(0, 4).map((product, index) => (
                <ProductCard key={product._id || product.name} product={product} index={index} />
              ))
            ) : (
              bestSellerProducts.map((product, index) => (
                <ProductCard key={product._id || product.name} product={product} index={index} />
              ))
            )}
          </div>
        </div>
      </section>

      {/* Horizontal Video Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-row gap-6 md:gap-10 items-center justify-center"
          >
            {/* Video 1 */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut" 
              }}
              className="relative w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 rounded-full overflow-hidden luxury-shadow-lg"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/videos/homecontext/vid1.mp4" type="video/mp4" />
              </video>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-full ring-4 ring-beauty-rose-gold/50"
              />
            </motion.div>

            {/* Video 2 */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, -3, 3, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 0.5 
              }}
              className="relative w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 rounded-full overflow-hidden luxury-shadow-lg"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/videos/homecontext/vid2.mp4" type="video/mp4" />
              </video>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute inset-0 rounded-full ring-4 ring-beauty-gold/50"
              />
            </motion.div>

            {/* Video 3 */}
            <motion.div
              animate={{ 
                y: [0, -8, 0],
                rotate: [0, 3, -3, 0]
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity, 
                ease: "easeInOut",
                delay: 1 
              }}
              className="relative w-40 h-40 md:w-52 md:h-52 lg:w-64 lg:h-64 rounded-full overflow-hidden luxury-shadow-lg"
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="/videos/homecontext/vid3.mp4" type="video/mp4" />
              </video>
              <motion.div
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.4, 0.6, 0.4]
                }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute inset-0 rounded-full ring-4 ring-beauty-rose-gold/50"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 md:py-28 bg-beauty-light">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-beauty-dark mb-4">
              Why Choose Us
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-beauty-rose-gold to-transparent mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[
              { icon: '🌿', title: 'Cruelty Free', desc: 'All our products are 100% cruelty-free and ethically sourced.' },
              { icon: '✨', title: 'Premium Quality', desc: 'Only the finest ingredients make it into our formulas.' },
              { icon: '📦', title: 'Free Shipping', desc: 'Free shipping on all orders above ₹1000 across India.' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-8 md:p-10 bg-white rounded-3xl luxury-shadow hover:luxury-shadow-lg transition-all duration-500 hover:-translate-y-1"
              >
                <div className="text-4xl md:text-5xl mb-4 md:mb-5">{feature.icon}</div>
                <h3 className="font-serif text-xl md:text-2xl text-beauty-dark mb-3 md:mb-4">
                  {feature.title}
                </h3>
                <p className="text-sm md:text-base text-beauty-coffee/70 leading-relaxed">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Gallery */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12 md:mb-16"
          >
            <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-beauty-dark mb-4">
              Follow Us @beauty_pro
            </h2>
            <div className="w-20 h-1 bg-gradient-to-r from-transparent via-beauty-rose-gold to-transparent mx-auto" />
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <motion.div
                key={item}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="aspect-square bg-beauty-beige rounded-xl md:rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="w-full h-full flex items-center justify-center text-3xl md:text-4xl">
                  📸
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}