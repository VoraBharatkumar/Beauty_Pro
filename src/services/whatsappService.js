/**
 * Beauty_Pro - WhatsApp Integration Service
 * Architecture-ready for WhatsApp Business API
 * DISABLED by default - enable when ready to integrate
 */

class WhatsAppService {
  constructor() {
    this.isEnabled = false;
    this.apiEndpoint = process.env.WHATSAPP_API_ENDPOINT || '';
    this.apiToken = process.env.WHATSAPP_API_TOKEN || '';
    this.businessPhoneId = process.env.WHATSAPP_BUSINESS_PHONE_ID || '';
  }

  /**
   * Generate WhatsApp bill message for an order
   * @param {Object} order - The order object
   * @returns {String} Formatted WhatsApp message
   */
  generateBillMessage(order) {
    if (!order) return '';

    const itemsList = (order.items || [])
      .map((item, idx) => `${idx + 1}. ${item.name} x${item.quantity} - ₹${(item.price * item.quantity).toLocaleString()}`)
      .join('\n');

    const message = `
🛍️ *Beauty_Pro - Order Confirmed*

*Order Number:* ${order.orderId || 'N/A'}
*Date:* ${new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}

*Items:*
${itemsList}

*Order Summary:*
Subtotal: ₹${(order.subtotal || 0).toLocaleString()}
Shipping: ${order.shipping === 0 ? 'FREE' : '₹' + (order.shipping || 0).toLocaleString()}
${order.discount > 0 ? `Discount: -₹${(order.discount || 0).toLocaleString()}` : ''}
*Grand Total: ₹${(order.total || 0).toLocaleString()}*

*Payment Status:* ${order.paymentStatus || 'Pending'}
*Order Status:* ${order.orderStatus || 'Pending'}

*Shipping Address:*
${order.shippingAddress?.name || ''}
${order.shippingAddress?.address || ''}
${order.shippingAddress?.city || ''}, ${order.shippingAddress?.state || ''} - ${order.shippingAddress?.pincode || ''}
📞 ${order.shippingAddress?.phone || ''}

${order.bill?.billNumber ? `📄 *Invoice:* ${order.bill.billNumber}` : ''}

Thank you for shopping with Beauty_Pro! ✨
    `.trim();

    return message;
  }

  /**
   * Send WhatsApp message (disabled - ready for integration)
   * @param {Object} options - { phoneNumber, message, order }
   * @returns {Promise<Object>} Send result
   */
  async sendMessage(options) {
    if (!this.isEnabled) {
      console.log('[WHATSAPP] Service is disabled. Message would be sent:', {
        to: options.phoneNumber,
        message: options.message || this.generateBillMessage(options.order),
      });
      return {
        success: false,
        message: 'WhatsApp service is disabled. Enable when ready.',
        disabled: true,
        preview: options.message || this.generateBillMessage(options.order),
      };
    }

    try {
      const message = options.message || this.generateBillMessage(options.order);
      
      // TODO: Integrate with WhatsApp Business API
      // This will use the official WhatsApp Business API or a third-party service
      const response = await fetch(`${this.apiEndpoint}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: options.phoneNumber,
          type: 'text',
          text: { body: message },
        }),
      });

      const data = await response.json();
      return {
        success: true,
        messageId: data.messages?.[0]?.id || `WA_${Date.now()}`,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error('[WHATSAPP] Send error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  /**
   * Send bill as document (PDF) via WhatsApp
   * @param {Object} options - { phoneNumber, pdfUrl, order }
   */
  async sendBillDocument(options) {
    if (!this.isEnabled) {
      console.log('[WHATSAPP] Document send disabled. Would send PDF to:', options.phoneNumber);
      return { success: false, disabled: true };
    }

    // TODO: Implement document sending via WhatsApp Business API
    return { success: false, message: 'Not yet implemented' };
  }

  /**
   * Enable WhatsApp service
   */
  enable() {
    this.isEnabled = true;
    console.log('[WHATSAPP] Service enabled');
  }

  /**
   * Disable WhatsApp service
   */
  disable() {
    this.isEnabled = false;
    console.log('[WHATSAPP] Service disabled');
  }
}

export const whatsappService = new WhatsAppService();
export default whatsappService;