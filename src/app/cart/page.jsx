/**
 * Beauty_Pro - Shopping Cart Page
 * Fully Responsive
 */

'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { useCartStore, useWishlistStore, useUIStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import Image from 'next/image';

export default function CartPage() {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscount = useCartStore((state) => state.getDiscount);
  const getTotal = useCartStore((state) => state.getTotal);
  const openCart = useUIStore((state) => state.openCart);

  if (items.length === 0) {
    return (
      <div className="luna-gradient min-h-screen pt-16 md:pt-20 flex items-center justify-center">
        <div className="text-center px-4">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="font-playfair text-3xl md:text-4xl text-luna-dark mb-4">Your Cart is Empty</h1>
          <p className="text-luna-dark/60 mb-8">Looks like you haven't added any items yet.</p>
          <Link href="/shop">
            <Button variant="primary" size="lg">Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  const subtotal = getSubtotal();
  const discount = getDiscount();
  const shipping = subtotal > 999 ? 0 : 99;
  const total = getTotal();

  return (
    <div className="luna-gradient min-h-screen pt-16 md:pt-20">
      <div className="luna-container section-padding">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 md:mb-12">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-luna-dark mb-4">Shopping Cart</h1>
          <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-transparent via-luna-rose-gold to-transparent mx-auto" />
          <p className="text-luna-dark/60 mt-3 md:mt-4 text-sm md:text-base">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-3 md:space-y-4">
            {items.map((item, index) => (
              <motion.div
                key={`${item._id}-${item.variant}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-4 md:p-6"
              >
                <div className="flex gap-3 md:gap-6">
                  {/* Image */}
                  <div className="relative w-20 h-20 md:w-32 md:h-32 rounded-xl overflow-hidden bg-luna-beige flex-shrink-0">
                    {item.image ? (
                      <Image src={item.image} alt={item.name} fill className="object-cover" sizes="(max-width: 768px) 80px, 128px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl md:text-3xl">✨</div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start gap-2">
                      <div className="min-w-0">
                        <Link href={`/product/${item._id}`}>
                          <h3 className="text-sm md:text-base font-medium text-luna-dark hover:text-luna-rose-gold transition-colors line-clamp-1">
                            {item.name}
                          </h3>
                        </Link>
                        {item.variant && (
                          <p className="text-xs md:text-sm text-luna-dark/60 mt-0.5">Variant: {item.variant}</p>
                        )}
                        <p className="font-playfair text-base md:text-xl text-luna-rose-gold mt-1 md:mt-2">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(item._id, item.variant)}
                        className="text-luna-dark/40 hover:text-red-500 transition-colors p-1 flex-shrink-0"
                        aria-label="Remove item"
                      >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>

                    {/* Quantity and Subtotal */}
                    <div className="flex items-center justify-between mt-3 md:mt-4">
                      <div className="flex items-center gap-2 md:gap-3">
                        <button
                          onClick={() => updateQuantity(item._id, item.variant, item.quantity - 1)}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-luna-peach/30 flex items-center justify-center hover:border-luna-rose-gold transition-colors text-sm"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="w-6 md:w-8 text-center text-sm md:text-base font-medium">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item._id, item.variant, item.quantity + 1)}
                          className="w-7 h-7 md:w-8 md:h-8 rounded-full border border-luna-peach/30 flex items-center justify-center hover:border-luna-rose-gold transition-colors text-sm"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <p className="font-playfair text-sm md:text-lg text-luna-dark">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Coupon */}
            <div className="glass-card p-4 md:p-6">
              <h3 className="font-medium text-luna-dark text-sm md:text-base mb-3 md:mb-4">Apply Coupon</h3>
              <div className="flex gap-2 md:gap-3">
                <input
                  type="text"
                  placeholder="Enter coupon code"
                  className="flex-1 px-3 md:px-4 py-2.5 md:py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none text-sm"
                />
                <Button variant="outline" size="sm">Apply</Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-5 md:p-6 sticky top-20 md:top-24">
              <h3 className="font-playfair text-lg md:text-xl text-luna-dark mb-4 md:mb-6">Order Summary</h3>

              <div className="space-y-2 md:space-y-3 mb-4 md:mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-luna-dark/60">Subtotal</span>
                  <span className="text-luna-dark">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-luna-dark/60">Discount</span>
                    <span className="text-green-600">-{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-luna-dark/60">Shipping</span>
                  <span className="text-luna-dark">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between font-medium text-base md:text-lg pt-2 md:pt-3 border-t border-luna-peach/20">
                  <span className="text-luna-dark">Total</span>
                  <span className="text-luna-rose-gold">{formatPrice(total)}</span>
                </div>
              </div>

              <Link href="/checkout">
                <Button variant="primary" size="lg" className="w-full mb-2 md:mb-3">
                  Proceed to Checkout
                </Button>
              </Link>
              <Link href="/shop">
                <Button variant="ghost" className="w-full">
                  Continue Shopping
                </Button>
              </Link>

              <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-luna-peach/20 space-y-2">
                <div className="flex items-center gap-2 text-xs md:text-sm text-luna-dark/60">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Secure Checkout
                </div>
                <div className="flex items-center gap-2 text-xs md:text-sm text-luna-dark/60">
                  <svg className="w-4 h-4 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free shipping on orders ₹1000+
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

