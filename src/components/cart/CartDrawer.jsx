'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useUIStore, useCartStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import Button from '@/components/ui/Button';
import Link from 'next/link';
import Image from 'next/image';

export function CartDrawer() {
  const isCartOpen = useUIStore((state) => state.isCartOpen);
  const closeCart = useUIStore((state) => state.closeCart);
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getDiscount = useCartStore((state) => state.getDiscount);
  const getTotal = useCartStore((state) => state.getTotal);

  if (!isCartOpen) return null;

  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          onClick={closeCart}
        />
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 250 }}
          className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-white z-50 shadow-2xl flex flex-col"
        >
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-luna-peach/20">
            <h2 className="font-playfair text-lg md:text-2xl text-luna-dark">Shopping Bag</h2>
            <button onClick={closeCart} className="p-2 text-luna-dark hover:text-luna-rose-gold transition-colors" aria-label="Close cart">
              <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 md:p-6">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <h3 className="font-playfair text-lg md:text-xl text-luna-dark mb-2">Your bag is empty</h3>
                <p className="text-luna-dark/60 text-sm mb-6">Looks like you haven't added anything yet.</p>
                <Button variant="primary" onClick={closeCart}>Continue Shopping</Button>
              </div>
            ) : (
              <div className="space-y-4 md:space-y-6">
                <AnimatePresence>
                  {items.map((item, index) => (
                    <motion.div
                      key={`${item._id}-${item.variant}`}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex gap-3 md:gap-4 pb-4 md:pb-6 border-b border-luna-peach/20"
                    >
                      <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden bg-luna-beige flex-shrink-0">
                        {item.image ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="80px" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg">✨</div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-sm md:text-base font-medium text-luna-dark truncate">{item.name}</h3>
                        {item.variant && <p className="text-xs md:text-sm text-luna-dark/60 mt-0.5">{item.variant}</p>}
                        <p className="font-playfair text-base md:text-lg text-luna-rose-gold mt-1 md:mt-2">{formatPrice(item.price)}</p>
                        <div className="flex items-center justify-between mt-2 md:mt-3">
                          <div className="flex items-center gap-1.5 md:gap-2">
                            <button onClick={() => updateQuantity(item._id, item.variant, item.quantity - 1)} className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-luna-peach/30 flex items-center justify-center hover:border-luna-rose-gold transition-colors text-xs" aria-label="Decrease quantity">-</button>
                            <span className="w-6 md:w-8 text-center text-xs md:text-sm">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item._id, item.variant, item.quantity + 1)} className="w-6 h-6 md:w-7 md:h-7 rounded-full border border-luna-peach/30 flex items-center justify-center hover:border-luna-rose-gold transition-colors text-xs" aria-label="Increase quantity">+</button>
                          </div>
                          <button onClick={() => removeItem(item._id, item.variant)} className="text-luna-dark/40 hover:text-red-500 transition-colors p-1" aria-label="Remove item">
                            <svg className="w-3.5 h-3.5 md:w-4 md:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="border-t border-luna-peach/20 p-4 md:p-6 space-y-3 md:space-y-4">
              <div className="flex gap-2">
                <input type="text" placeholder="Coupon code" className="flex-1 px-3 md:px-4 py-2 md:py-2.5 bg-luna-beige/50 border border-luna-peach/30 rounded-full text-xs md:text-sm focus:border-luna-rose-gold focus:outline-none" />
                <Button variant="outline" size="sm">Apply</Button>
              </div>
              <div className="space-y-1.5 md:space-y-2 text-xs md:text-sm">
                <div className="flex justify-between text-luna-dark/70"><span>Subtotal</span><span>{formatPrice(getSubtotal())}</span></div>
                {getDiscount() > 0 && <div className="flex justify-between text-green-600"><span>Discount</span><span>-{formatPrice(getDiscount())}</span></div>}
                <div className="flex justify-between text-luna-dark/70"><span>Shipping</span><span>{getSubtotal() > 999 ? 'FREE' : formatPrice(99)}</span></div>
                <div className="flex justify-between font-medium text-luna-dark text-base md:text-lg pt-2 border-t border-luna-peach/20"><span>Total</span><span>{formatPrice(getTotal())}</span></div>
              </div>
              <Button variant="primary" className="w-full" size="lg" onClick={() => { window.location.href = '/checkout'; closeCart(); }}>Checkout</Button>
              <Button variant="ghost" className="w-full" onClick={closeCart}>Continue Shopping</Button>
            </div>
          )}
        </motion.div>
      </>
    </AnimatePresence>
  );
}

