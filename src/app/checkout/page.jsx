/**
 * Beauty_Pro - Professional Checkout Page
 * Complete Shipping Address, Phone, Order Summary, Payment
 * Product Flow: Order Now → Login Check → Checkout → Address → Payment → Success
 */

'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import GSTBill from '@/components/order/GSTBill';
import { useCartStore, useUIStore, useAuthStore } from '@/store';
import { formatPrice } from '@/lib/utils';
import { triggerLoginRequired } from '@/components/auth/LoginRequiredModal';

const STEPS = ['Shipping', 'Review', 'Payment', 'Success'];

export default function CheckoutPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState(null);
  const [bill, setBill] = useState(null);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [whatsappSending, setWhatsappSending] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const [shippingInfo, setShippingInfo] = useState({
    name: '',
    phone: '',
    alternatePhone: '',
    email: '',
    pincode: '',
    state: '',
    city: '',
    address: '',
    addressLine2: '',
    landmark: '',
    orderNotes: '',
    addressType: 'Home',
  });
  const [fieldErrors, setFieldErrors] = useState({});

  const items = useCartStore((state) => state.items);
  const getSubtotal = useCartStore((state) => state.getSubtotal);
  const getTotal = useCartStore((state) => state.getTotal);
  const clearCart = useCartStore((state) => state.clearCart);
  const closeCart = useUIStore((state) => state.closeCart);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Check authentication on mount
  useEffect(() => {
    if (!isAuthenticated) {
      triggerLoginRequired('/checkout');
    }
  }, [isAuthenticated]);

  // Clear error when step changes
  useEffect(() => { setError(''); }, [step]);

  // Pre-fill user data
  useEffect(() => {
    if (user) {
      setShippingInfo(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const updateField = (field, value) => {
    setShippingInfo(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateStep1 = () => {
    const errors = {};
    if (!shippingInfo.name.trim()) errors.name = 'Full name is required';
    if (!shippingInfo.phone.trim()) errors.phone = 'Phone number is required';
    else if (!/^[0-9]{10}$/.test(shippingInfo.phone.replace(/\D/g, '')))
      errors.phone = 'Enter a valid 10-digit phone number';
    if (!shippingInfo.pincode.trim()) errors.pincode = 'PIN code is required';
    else if (!/^[0-9]{6}$/.test(shippingInfo.pincode.replace(/\D/g, '')))
      errors.pincode = 'Enter a valid 6-digit PIN code';
    if (!shippingInfo.state.trim()) errors.state = 'State is required';
    if (!shippingInfo.city.trim()) errors.city = 'City is required';
    if (!shippingInfo.address.trim()) errors.address = 'Address is required';
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ── Step 1 → Step 2: Validate & Continue ──
  const handleContinueToReview = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  // ── Step 2 → Step 3: Place Order ──
  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const subtotal = getSubtotal();
      const shipping = subtotal > 999 ? 0 : 99;
      const total = getTotal();

      const orderData = {
        userId: user?._id || null,
        items: items.map(item => ({
          product: item._id,
          name: item.name || 'Unknown Product',
          price: Number(item.price) || 0,
          quantity: Math.max(1, Number(item.quantity) || 1),
          variant: item.variant || 'Default',
          image: item.image || '',
          hsnCode: item.hsnCode || '3304',
          gstRate: item.gstRate || 18,
        })),
        subtotal: Number(subtotal) || 0,
        discount: 0,
        shipping: Number(shipping) || 0,
        total: Number(total) || 0,
        paymentMethod: 'Razorpay',
        shippingAddress: {
          name: shippingInfo.name,
          phone: shippingInfo.phone,
          alternatePhone: shippingInfo.alternatePhone,
          email: shippingInfo.email,
          address: shippingInfo.address,
          addressLine2: shippingInfo.addressLine2,
          landmark: shippingInfo.landmark,
          city: shippingInfo.city,
          state: shippingInfo.state,
          pincode: shippingInfo.pincode,
          addressType: shippingInfo.addressType,
        },
        whatsappNumber: shippingInfo.phone,
        orderNotes: shippingInfo.orderNotes,
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!data.success || !data.order) {
        throw new Error(data.error || 'Failed to create order');
      }

      setOrder(data.order);
      setStep(3);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Step 3: Simulated Payment ──
  const handleConfirmPayment = async () => {
    if (!order?._id) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${order._id}/confirm-payment`, {
        method: 'POST',
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Payment confirmation failed');
      }

      setOrder(data.order);
      setPaymentConfirmed(true);

      // Auto-generate bill
      await generateBill();
      setStep(4);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ── Generate GST Bill ──
  const generateBill = async () => {
    if (!order?._id) return;
    try {
      const res = await fetch(`/api/orders/${order._id}/generate-bill`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.bill) {
        setBill(data.bill);
        setOrder(data.order);
      }
    } catch (err) {
      console.error('[CHECKOUT] Bill generation error:', err);
    }
  };

  // ── Send WhatsApp Bill ──
  const handleSendWhatsApp = async () => {
    if (!order?._id) return;
    setWhatsappSending(true);
    setError('');

    try {
      const res = await fetch(`/api/orders/${order._id}/send-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: shippingInfo.phone,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        // Non-blocking: show message but don't block order completion
        console.warn('[CHECKOUT] WhatsApp send warning:', data.error);
      } else {
        setWhatsappSent(true);
      }
    } catch (err) {
      console.error('[CHECKOUT] WhatsApp error:', err);
    } finally {
      setWhatsappSending(false);
    }
  };

  // ── Finalize Order ──
  const handleViewOrder = () => {
    clearCart();
    closeCart();
    if (order?._id) {
      router.push(`/account/orders/${order._id}`);
    } else {
      router.push('/account/orders');
    }
  };

  // ── Empty Cart State ──
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
  const shipping = subtotal > 999 ? 0 : 99;
  const total = getTotal();

  return (
    <div className="luna-gradient min-h-screen pt-16 md:pt-20">
      <div className="luna-container section-padding">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8 md:mb-12">
          <h1 className="font-playfair text-3xl sm:text-4xl md:text-5xl text-luna-dark mb-4">Checkout</h1>
          <div className="w-20 md:w-24 h-1 bg-gradient-to-r from-transparent via-luna-rose-gold to-transparent mx-auto" />
        </motion.div>

        {/* Progress Stepper */}
        <div className="flex justify-center mb-8 md:mb-12 overflow-x-auto px-2">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            {STEPS.map((label, idx) => (
              <div key={label} className="flex items-center gap-2 md:gap-4">
                <div className={`flex items-center gap-2`}>
                  <div className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs md:text-sm font-medium flex-shrink-0 transition-all ${
                    step > idx + 1
                      ? 'bg-green-500 text-white shadow-lg'
                      : step === idx + 1
                        ? 'bg-luna-rose-gold text-white shadow-lg ring-2 ring-luna-rose-gold/30'
                        : 'bg-luna-peach/30 text-luna-dark/60'
                  }`}>
                    {step > idx + 1 ? (
                      <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
                    ) : (
                      idx + 1
                    )}
                  </div>
                  <span className={`text-xs md:text-sm hidden sm:block whitespace-nowrap font-medium ${step >= idx + 1 ? 'text-luna-dark' : 'text-luna-dark/40'}`}>
                    {label}
                  </span>
                </div>
                {idx < STEPS.length - 1 && (
                  <div className={`w-6 md:w-12 h-0.5 flex-shrink-0 transition-colors ${
                    step > idx + 1 ? 'bg-green-400' : 'bg-luna-peach/30'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-4xl mx-auto mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm"
            >
              ❌ {error}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* ── Main Content ── */}
          <div className="lg:col-span-2">
            <div className="glass-card p-5 md:p-8">
              <AnimatePresence mode="wait">
                {/* ═══ Step 1: Shipping Address ═══ */}
                {step === 1 && (
                  <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 md:space-y-5">
                    <h2 className="font-playfair text-xl md:text-2xl text-luna-dark mb-4 md:mb-6">Shipping Address</h2>

                    {/* Name & Phone */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-luna-dark mb-1.5">Full Name *</label>
                        <input type="text" value={shippingInfo.name} onChange={(e) => updateField('name', e.target.value)}
                          className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-luna-beige/50 border rounded-xl focus:outline-none text-sm transition-colors ${fieldErrors.name ? 'border-red-400' : 'border-luna-peach/30 focus:border-luna-rose-gold'}`} placeholder="John Doe" />
                        {fieldErrors.name && <p className="text-xs text-red-500 mt-1">{fieldErrors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-luna-dark mb-1.5">Phone Number *</label>
                        <input type="tel" value={shippingInfo.phone} onChange={(e) => updateField('phone', e.target.value)}
                          className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-luna-beige/50 border rounded-xl focus:outline-none text-sm transition-colors ${fieldErrors.phone ? 'border-red-400' : 'border-luna-peach/30 focus:border-luna-rose-gold'}`} placeholder="9876543210" />
                        {fieldErrors.phone && <p className="text-xs text-red-500 mt-1">{fieldErrors.phone}</p>}
                      </div>
                    </div>

                    {/* Alternate Phone & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-luna-dark mb-1.5">Alternate Phone</label>
                        <input type="tel" value={shippingInfo.alternatePhone} onChange={(e) => updateField('alternatePhone', e.target.value)}
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none text-sm" placeholder="Optional" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-luna-dark mb-1.5">Email</label>
                        <input type="email" value={shippingInfo.email} onChange={(e) => updateField('email', e.target.value)}
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none text-sm" placeholder="email@example.com" />
                      </div>
                    </div>

                    {/* PIN Code, State, City */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-luna-dark mb-1.5">PIN Code *</label>
                        <input type="text" value={shippingInfo.pincode} onChange={(e) => updateField('pincode', e.target.value)} maxLength={6}
                          className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-luna-beige/50 border rounded-xl focus:outline-none text-sm transition-colors ${fieldErrors.pincode ? 'border-red-400' : 'border-luna-peach/30 focus:border-luna-rose-gold'}`} placeholder="400001" />
                        {fieldErrors.pincode && <p className="text-xs text-red-500 mt-1">{fieldErrors.pincode}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-luna-dark mb-1.5">State *</label>
                        <input type="text" value={shippingInfo.state} onChange={(e) => updateField('state', e.target.value)}
                          className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-luna-beige/50 border rounded-xl focus:outline-none text-sm transition-colors ${fieldErrors.state ? 'border-red-400' : 'border-luna-peach/30 focus:border-luna-rose-gold'}`} placeholder="Maharashtra" />
                        {fieldErrors.state && <p className="text-xs text-red-500 mt-1">{fieldErrors.state}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-luna-dark mb-1.5">City *</label>
                        <input type="text" value={shippingInfo.city} onChange={(e) => updateField('city', e.target.value)}
                          className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-luna-beige/50 border rounded-xl focus:outline-none text-sm transition-colors ${fieldErrors.city ? 'border-red-400' : 'border-luna-peach/30 focus:border-luna-rose-gold'}`} placeholder="Mumbai" />
                        {fieldErrors.city && <p className="text-xs text-red-500 mt-1">{fieldErrors.city}</p>}
                      </div>
                    </div>

                    {/* Address Line 1 */}
                    <div>
                      <label className="block text-sm font-medium text-luna-dark mb-1.5">Address Line 1 *</label>
                      <input type="text" value={shippingInfo.address} onChange={(e) => updateField('address', e.target.value)}
                        className={`w-full px-3 md:px-4 py-2.5 md:py-3 bg-luna-beige/50 border rounded-xl focus:outline-none text-sm transition-colors ${fieldErrors.address ? 'border-red-400' : 'border-luna-peach/30 focus:border-luna-rose-gold'}`} placeholder="House/Flat No., Street, Area" />
                      {fieldErrors.address && <p className="text-xs text-red-500 mt-1">{fieldErrors.address}</p>}
                    </div>

                    {/* Address Line 2 & Landmark */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <label className="block text-sm font-medium text-luna-dark mb-1.5">Address Line 2</label>
                        <input type="text" value={shippingInfo.addressLine2} onChange={(e) => updateField('addressLine2', e.target.value)}
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none text-sm" placeholder="Apartment, Suite, etc." />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-luna-dark mb-1.5">Landmark</label>
                        <input type="text" value={shippingInfo.landmark} onChange={(e) => updateField('landmark', e.target.value)}
                          className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none text-sm" placeholder="Near by landmark" />
                      </div>
                    </div>

                    {/* Address Type */}
                    <div>
                      <label className="block text-sm font-medium text-luna-dark mb-2">Address Type</label>
                      <div className="flex gap-3">
                        {['Home', 'Office', 'Other'].map((type) => (
                          <button
                            key={type}
                            onClick={() => updateField('addressType', type)}
                            className={`px-5 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
                              shippingInfo.addressType === type
                                ? 'border-luna-rose-gold bg-luna-rose-gold/10 text-luna-rose-gold'
                                : 'border-luna-peach/30 hover:border-luna-rose-gold text-luna-dark'
                            }`}
                          >
                            {type}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Order Notes */}
                    <div>
                      <label className="block text-sm font-medium text-luna-dark mb-1.5">Order Notes</label>
                      <textarea
                        value={shippingInfo.orderNotes}
                        onChange={(e) => updateField('orderNotes', e.target.value)}
                        rows={2}
                        className="w-full px-3 md:px-4 py-2.5 md:py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none text-sm resize-none"
                        placeholder="Any special instructions for delivery (optional)"
                      />
                    </div>

                    <Button variant="primary" size="lg" onClick={handleContinueToReview} className="w-full mt-2 md:mt-4">
                      Continue to Review Order
                    </Button>
                  </motion.div>
                )}

                {/* ═══ Step 2: Review Order ═══ */}
                {step === 2 && (
                  <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <h2 className="font-playfair text-xl md:text-2xl text-luna-dark mb-4">Review Your Order</h2>

                    {/* Shipping Address Summary */}
                    <div className="bg-luna-beige/30 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-luna-dark text-sm">Shipping Address</h3>
                        <button onClick={() => setStep(1)} className="text-xs text-luna-rose-gold hover:underline">Edit</button>
                      </div>
                      <div className="text-sm text-luna-dark/70 space-y-0.5">
                        <p className="font-medium text-luna-dark">{shippingInfo.name}</p>
                        <p>{shippingInfo.address}{shippingInfo.addressLine2 ? `, ${shippingInfo.addressLine2}` : ''}</p>
                        <p>{shippingInfo.city}, {shippingInfo.state} - {shippingInfo.pincode}</p>
                        {shippingInfo.landmark && <p>Near: {shippingInfo.landmark}</p>}
                        <p>📞 {shippingInfo.phone}{shippingInfo.alternatePhone ? ` / ${shippingInfo.alternatePhone}` : ''}</p>
                        <p className="text-xs mt-1">
                          <span className="bg-luna-rose-gold/10 text-luna-rose-gold px-2 py-0.5 rounded text-xs">{shippingInfo.addressType}</span>
                        </p>
                      </div>
                    </div>

                    {/* Order Items */}
                    <div>
                      <h3 className="font-medium text-luna-dark text-sm mb-3">Items ({items.length})</h3>
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={`${item._id}-${item.variant}`} className="flex items-center gap-3 pb-3 border-b border-luna-peach/10">
                            <div className="w-12 h-12 bg-luna-beige rounded-lg flex items-center justify-center text-lg flex-shrink-0">✨</div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-luna-dark truncate">{item.name}</p>
                              <p className="text-xs text-luna-dark/60">Qty: {item.quantity} {item.variant && `• ${item.variant}`}</p>
                            </div>
                            <p className="text-sm font-medium text-luna-rose-gold">{formatPrice(item.price * item.quantity)}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Order Notes */}
                    {shippingInfo.orderNotes && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
                        <span className="font-medium">Notes:</span> {shippingInfo.orderNotes}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button variant="outline" onClick={() => setStep(1)} className="w-full sm:w-auto">Back to Shipping</Button>
                      <Button variant="primary" size="lg" onClick={handlePlaceOrder} loading={loading} className="w-full sm:flex-1">
                        {loading ? 'Placing Order...' : `Place Order • ${formatPrice(total)}`}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ═══ Step 3: Payment ═══ */}
                {step === 3 && (
                  <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <h2 className="font-playfair text-xl md:text-2xl text-luna-dark mb-2">Payment</h2>
                    <p className="text-luna-dark/60 text-sm mb-4">
                      💡 Test Mode: Payment is simulated. No actual charge will be made.
                    </p>

                    {order && (
                      <div className="bg-luna-beige/30 rounded-xl p-4 mb-4 space-y-2 text-sm">
                        <div className="flex justify-between"><span>Order ID</span><span className="font-medium">{order.orderId}</span></div>
                        <div className="flex justify-between"><span>Amount to Pay</span><span className="text-luna-rose-gold font-playfair text-lg font-bold">{formatPrice(order.total || total)}</span></div>
                        <div className="flex justify-between text-xs text-luna-dark/60"><span>Payment Method</span><span>Razorpay (Test Mode)</span></div>
                      </div>
                    )}

                    {/* Payment Options */}
                    <div className="space-y-3">
                      {[
                        { id: 'razorpay', name: 'Razorpay (Cards, UPI, Netbanking)', icon: '💳', desc: 'Credit Card, Debit Card, UPI, Netbanking' },
                        { id: 'cod', name: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive', disabled: true },
                      ].map((option) => (
                        <label key={option.id} className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${option.id === 'razorpay' ? 'border-luna-rose-gold bg-luna-rose-gold/5' : 'border-luna-peach/30'} ${option.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <input type="radio" name="payment" defaultChecked={option.id === 'razorpay'} disabled={option.disabled} className="w-4 h-4 text-luna-rose-gold flex-shrink-0" />
                          <span className="text-2xl">{option.icon}</span>
                          <div>
                            <span className="font-medium text-luna-dark text-sm md:text-base block">{option.name}</span>
                            <span className="text-xs text-luna-dark/60">{option.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button variant="outline" onClick={() => setStep(2)} className="w-full sm:w-auto">Back to Review</Button>
                      <Button variant="primary" size="lg" onClick={handleConfirmPayment} loading={loading} className="w-full sm:flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-0">
                        {loading ? 'Processing...' : '✅ Pay Now • Test Mode'}
                      </Button>
                    </div>
                  </motion.div>
                )}

                {/* ═══ Step 4: Success ═══ */}
                {step === 4 && (
                  <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                    <div className="text-center mb-6">
                      <div className="w-20 h-20 mx-auto bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h2 className="font-playfair text-2xl md:text-3xl text-luna-dark mb-2">Order Placed Successfully!</h2>
                      <p className="text-luna-dark/60">
                        Order <strong>#{order?.orderId}</strong> has been confirmed.
                      </p>
                      {order?.paymentStatus === 'Paid' && (
                        <span className="inline-block mt-2 px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full font-medium">✅ Payment Successful</span>
                      )}
                    </div>

                    {/* WhatsApp Bill Section */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                      <h3 className="font-playfair text-lg text-luna-dark mb-3">📱 Get Bill on WhatsApp</h3>
                      <p className="text-sm text-luna-dark/60 mb-4">
                        Send your GST bill to <strong>{shippingInfo.phone}</strong>
                      </p>

                      {whatsappSent ? (
                        <div className="bg-green-100 text-green-700 rounded-xl p-4 text-sm font-medium">
                          ✅ Bill sent to WhatsApp successfully!
                        </div>
                      ) : (
                        <Button
                          variant="primary"
                          onClick={handleSendWhatsApp}
                          loading={whatsappSending}
                          className="w-full"
                        >
                          {whatsappSending ? 'Sending...' : '📲 Send Bill on WhatsApp'}
                        </Button>
                      )}
                      <p className="text-xs text-luna-dark/40 mt-2">
                        WhatsApp integration is in test mode. Bill message will be logged.
                      </p>
                    </div>

                    {/* Order Summary */}
                    <div className="bg-luna-beige/30 rounded-xl p-4 space-y-2 text-sm">
                      <h4 className="font-medium text-luna-dark mb-2">Order Summary</h4>
                      <div className="flex justify-between"><span className="text-luna-dark/60">Order ID</span><span className="text-luna-dark font-medium">{order?.orderId}</span></div>
                      {bill?.billNumber && <div className="flex justify-between"><span className="text-luna-dark/60">Bill Number</span><span className="text-luna-dark font-medium">{bill.billNumber}</span></div>}
                      <div className="flex justify-between"><span className="text-luna-dark/60">Payment Status</span><span className="text-green-600 font-medium">{paymentConfirmed ? 'Paid' : 'Pending'}</span></div>
                      <div className="flex justify-between"><span className="text-luna-dark/60">Total Paid</span><span className="text-luna-rose-gold font-playfair text-lg font-bold">{formatPrice(order?.total || total)}</span></div>
                      <div className="flex justify-between"><span className="text-luna-dark/60">Delivering to</span><span className="text-luna-dark font-medium">{shippingInfo.name}</span></div>
                      <div className="flex justify-between"><span className="text-luna-dark/60">Address</span><span className="text-luna-dark font-medium text-right max-w-[200px]">{shippingInfo.city}, {shippingInfo.state}</span></div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button variant="outline" onClick={() => { clearCart(); router.push('/shop'); }} className="w-full sm:w-auto">
                        Continue Shopping
                      </Button>
                      <Button variant="primary" size="lg" onClick={handleViewOrder} className="w-full sm:flex-1">
                        View Order Details
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* ── Order Summary Sidebar ── */}
          <div className="lg:col-span-1">
            <div className="glass-card p-5 md:p-6 sticky top-20 md:top-24">
              <h3 className="font-playfair text-lg md:text-xl text-luna-dark mb-4">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={`${item._id}-${item.variant}`} className="flex gap-3 pb-3 border-b border-luna-peach/10 last:border-b-0">
                    <div className="w-10 h-10 bg-luna-beige rounded-lg flex items-center justify-center text-lg flex-shrink-0">✨</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-luna-dark truncate">{item.name}</p>
                      <p className="text-xs text-luna-dark/60">Qty: {item.quantity} {item.variant && `• ${item.variant}`}</p>
                      <p className="text-sm text-luna-rose-gold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="space-y-1.5 md:space-y-2 text-sm">
                <div className="flex justify-between text-luna-dark/70"><span>Subtotal ({items.length})</span><span>{formatPrice(subtotal)}</span></div>
                <div className="flex justify-between text-luna-dark/70"><span>Shipping</span><span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span></div>
                <div className="flex justify-between font-medium text-base pt-2 border-t border-luna-peach/20">
                  <span className="text-luna-dark">Total</span><span className="text-luna-rose-gold">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="mt-6 pt-4 border-t border-luna-peach/20 space-y-2">
                <div className="flex items-center gap-2 text-xs text-luna-dark/50">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-luna-dark/50">
                  <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  <span>Free shipping on orders ₹999+</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}