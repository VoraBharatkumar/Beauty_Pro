/**
 * Beauty_Pro - Razorpay Order Creation API
 * DISABLED by default - ready for Razorpay integration
 * When enabled, creates a Razorpay order for payment
 */

import { connectDB } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    const body = await request.json();
    const { amount, currency, receipt, notes } = body;

    // Check if Razorpay is enabled
    const isRazorpayEnabled = process.env.RAZORPAY_ENABLED === 'true';

    if (!isRazorpayEnabled) {
      return Response.json({
        success: true,
        testMode: true,
        message: 'Razorpay is in test mode. Payment will be simulated.',
        order: {
          id: `test_order_${Date.now()}`,
          amount: amount,
          currency: currency || 'INR',
          status: 'created',
        },
      });
    }

    // TODO: Integrate Razorpay API
    // const Razorpay = require('razorpay');
    // const razorpay = new Razorpay({
    //   key_id: process.env.RAZORPAY_KEY_ID,
    //   key_secret: process.env.RAZORPAY_KEY_SECRET,
    // });
    // const razorpayOrder = await razorpay.orders.create({
    //   amount: amount * 100, // Amount in paise
    //   currency: currency || 'INR',
    //   receipt,
    //   notes,
    // });

    return Response.json({
      success: true,
      message: 'Razorpay integration is not active. Please enable it in environment settings.',
      testMode: true,
      order: {
        id: `test_order_${Date.now()}`,
        amount,
        currency: currency || 'INR',
        status: 'created',
      },
    });
  } catch (error) {
    console.error('[PAYMENT] Error creating Razorpay order:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}