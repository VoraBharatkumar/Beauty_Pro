/**
 * Beauty_Pro - Fake Payment Confirmation API
 * Simulates payment success and updates order status
 */
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    console.log(`[PAYMENT] Confirming payment for order: ${id}`);

    await connectDB();

    const order = await Order.findById(id);
    if (!order) {
      console.error(`[PAYMENT] Order not found: ${id}`);
      return Response.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Prevent double payment
    if (order.paymentStatus === 'Paid') {
      console.log(`[PAYMENT] Order ${id} already paid`);
      return Response.json({ success: true, message: 'Payment already confirmed', order });
    }

    // Simulate payment processing delay
    await new Promise(resolve => setTimeout(resolve, 500));

    // Update order
    order.paymentStatus = 'Paid';
    order.orderStatus = 'Confirmed';
    order.paidAt = new Date();
    order.statusHistory.push({
      status: 'Paid',
      note: 'Payment confirmed (simulated)',
      timestamp: new Date()
    });
    order.statusHistory.push({
      status: 'Confirmed',
      note: 'Order confirmed after payment',
      timestamp: new Date()
    });

    await order.save();
    console.log(`[PAYMENT] ✅ Payment confirmed for order ${id} (${order.orderId})`);

    return Response.json({
      success: true,
      message: 'Payment confirmed successfully',
      order
    });
  } catch (error) {
    console.error('[PAYMENT] ❌ Error:', error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}