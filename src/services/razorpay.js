/**
 * Beauty_Pro - Razorpay Utility
 * Architecture-ready for Razorpay payment gateway
 * DISABLED by default - enable when ready to integrate
 */

class RazorpayUtility {
  constructor() {
    this.isEnabled = false;
    this.keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '';
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || '';
  }

  /**
   * Load Razorpay SDK
   */
  async loadSDK() {
    if (typeof window === 'undefined') return null;
    if (window.Razorpay) return window.Razorpay;

    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        if (window.Razorpay) {
          resolve(window.Razorpay);
        } else {
          reject(new Error('Razorpay SDK failed to load'));
        }
      };
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.head.appendChild(script);
    });
  }

  /**
   * Create a Razorpay order via backend API
   * @param {Object} options - { amount, currency, receipt, notes }
   * @returns {Promise<Object>} Razorpay order
   */
  async createOrder(options) {
    try {
      const res = await fetch('/api/payments/create-razorpay-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(options),
      });
      const data = await res.json();
      return data;
    } catch (error) {
      console.error('[RAZORPAY] Order creation error:', error);
      throw error;
    }
  }

  /**
   * Open Razorpay checkout
   * @param {Object} options - { orderId, amount, customer, handler }
   */
  async openCheckout(options) {
    if (!this.isEnabled) {
      console.warn('[RAZORPAY] Razorpay is disabled. Enable when ready.');
      return null;
    }

    try {
      const Razorpay = await this.loadSDK();
      
      const checkoutOptions = {
        key: this.keyId,
        amount: options.amount,
        currency: options.currency || 'INR',
        name: 'Beauty_Pro',
        description: options.description || 'Payment for order',
        image: '/logo.png',
        order_id: options.orderId,
        prefill: {
          name: options.customer?.name || '',
          email: options.customer?.email || '',
          contact: options.customer?.phone || '',
        },
        notes: options.notes || {},
        theme: {
          color: '#D9B29C',
        },
        handler: async (response) => {
          if (options.handler) {
            options.handler(response);
          }
        },
        modal: {
          ondismiss: () => {
            console.log('[RAZORPAY] Checkout closed');
          },
        },
      };

      const razorpay = new Razorpay(checkoutOptions);
      razorpay.open();
      
      return razorpay;
    } catch (error) {
      console.error('[RAZORPAY] Checkout error:', error);
      throw error;
    }
  }

  /**
   * Verify payment signature
   * @param {Object} paymentData - { orderId, paymentId, signature }
   * @returns {Boolean}
   */
  verifySignature(paymentData) {
    // TODO: Implement server-side signature verification
    // This should match Razorpay's official verification method
    return true;
  }
}

export const razorpayUtility = new RazorpayUtility();
export default razorpayUtility;