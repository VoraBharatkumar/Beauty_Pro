/**
 * Beauty_Pro - WhatsApp Bill Sending API
 * Sends the GST bill to customer's WhatsApp number
 *
 * === INTEGRATION CONTRACT ===
 * To plug in a real WhatsApp provider, replace the sendWhatsAppMessage()
 * function below with your provider's SDK/API call.
 *
 * Expected provider API:
 *   POST https://api.your-provider.com/v1/messages
 *   Headers: { Authorization: 'Bearer YOUR_API_KEY' }
 *   Body: {
 *     to: '911234567890',
 *     type: 'document',
 *     document: { url: billPdfUrl, filename: 'GST_Bill.pdf' },
 *     caption: 'Your GST bill from LUNA Beauty'
 *   }
 *   Response: { messageId: '...', status: 'sent' }
 *
 * Supported providers: Twilio, MessageBird, WATI, Gupshup, green-api, etc.
 * Configure via: WHATSAPP_PROVIDER, WHATSAPP_API_KEY env vars
 */
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

/**
 * Stub function to send WhatsApp message.
 * Replace this with your actual provider integration.
 */
async function sendWhatsAppMessage(phoneNumber, billData, order) {
  const formattedPhone = phoneNumber.replace(/[^0-9]/g, '');
  
  console.log(`[WHATSAPP] === SENDING TO ${formattedPhone} ===`);
  console.log(`[WHATSAPP] Provider: ${process.env.WHATSAPP_PROVIDER || 'stub (no provider configured)'}`);
  console.log(`[WHATSAPP] Bill: ${billData.billNumber} for order ${order.orderId}`);
  console.log(`[WHATSAPP] Amount: ₹${billData.grandTotal}`);
  
  // Stub: simulate API call
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Build the message payload that a real provider would receive
  const messagePayload = {
    to: `91${formattedPhone}`,
    type: 'template',
    template: {
      name: 'gst_bill',
      language: { code: 'en' },
      components: [{
        type: 'body',
        parameters: [
          { type: 'text', text: order.shippingAddress?.name || 'Customer' },
          { type: 'text', text: order.orderId },
          { type: 'text', text: billData.billNumber },
          { type: 'text', text: `₹${billData.grandTotal}` },
        ]
      }]
    }
  };

  console.log(`[WHATSAPP] Payload:`, JSON.stringify(messagePayload, null, 2));
  console.log(`[WHATSAPP] ✅ Simulated send success`);
  
  return {
    success: true,
    messageId: `WA_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    status: 'sent',
    provider: process.env.WHATSAPP_PROVIDER || 'stub',
  };
}

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const customPhone = body.phoneNumber;

    console.log(`[WHATSAPP] Sending bill for order: ${id}`);

    await connectDB();

    const order = await Order.findById(id).lean();
    if (!order) {
      console.error(`[WHATSAPP] Order not found: ${id}`);
      return Response.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Validate bill exists
    if (!order.bill?.billNumber) {
      console.error(`[WHATSAPP] Bill not generated for order ${id}`);
      return Response.json({
        success: false,
        error: 'Bill not generated yet. Generate bill first.',
        step: 'bill_required'
      }, { status: 400 });
    }

    // Determine phone number: custom > whatsappNumber on order > shippingAddress phone
    const phoneNumber = customPhone || order.whatsappNumber || order.shippingAddress?.phone;
    if (!phoneNumber) {
      console.error(`[WHATSAPP] No phone number for order ${id}`);
      return Response.json({
        success: false,
        error: 'Customer phone number not found. Please provide a WhatsApp number.',
        step: 'phone_required'
      }, { status: 400 });
    }

    // Send the message (stub)
    const result = await sendWhatsAppMessage(phoneNumber, order.bill, order);

    // Update order bill status
    const updateFields = {
      'bill.whatsappSentAt': new Date(),
      'bill.whatsappStatus': result.success ? 'sent' : 'failed',
    };

    await Order.findByIdAndUpdate(id, { $set: updateFields });

    console.log(`[WHATSAPP] ✅ Status updated for order ${order.orderId}: ${result.status}`);

    return Response.json({
      success: true,
      message: result.success
        ? `Bill sent to WhatsApp at ${phoneNumber}`
        : 'Failed to send via WhatsApp',
      whatsapp: {
        phoneNumber,
        messageId: result.messageId,
        status: result.status,
        provider: result.provider,
        sentAt: new Date(),
      }
    });
  } catch (error) {
    console.error('[WHATSAPP] ❌ Error:', error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}