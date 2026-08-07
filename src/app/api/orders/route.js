/**
 * Beauty_Pro - Orders API
 * Creates and reads orders from MongoDB
 */

import mongoose from 'mongoose';
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { generateOrderId } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    let query = {};
    if (userId && userId !== 'undefined' && userId !== 'null' && mongoose.Types.ObjectId?.isValid(userId)) {
      query.user = new mongoose.Types.ObjectId(userId);
    } else if (userId && userId !== 'undefined' && userId !== 'null') {
      query.user = userId;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 }).lean();
    return Response.json({ success: true, orders });
  } catch (error) {
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { userId, items, subtotal, discount, shipping, total, coupon, shippingAddress, paymentMethod, notes, isGift, giftNote } = body;

    await connectDB();

    // Validate required fields
    if (!items || !Array.isArray(items) || items.length === 0) {
      return Response.json({ success: false, error: 'Order must contain at least one item' }, { status: 400 });
    }

    if (!total || total <= 0) {
      return Response.json({ success: false, error: 'Invalid order total' }, { status: 400 });
    }

    // Convert userId to ObjectId if it's a valid format
    let userIdToSave = null;
    if (userId && mongoose.Types.ObjectId?.isValid(userId)) {
      userIdToSave = new mongoose.Types.ObjectId(userId);
    }

    // Process items - extract image URL string if image is an object
    const processedItems = (items || []).map(item => {
      const rawImage = item.image;
      let imageUrl = '';
      if (typeof rawImage === 'string') {
        imageUrl = rawImage;
      } else if (rawImage && typeof rawImage === 'object') {
        imageUrl = rawImage.url || '';
      } else if (item.images && Array.isArray(item.images) && item.images.length > 0) {
        imageUrl = typeof item.images[0] === 'string' ? item.images[0] : (item.images[0].url || '');
      }

      return {
        name: item.name || 'Unknown Product',
        price: Number(item.price) || 0,
        quantity: Math.max(1, Number(item.quantity) || 1),
        variant: item.variant || 'Default',
        image: imageUrl,
        product: (item.product && mongoose.Types.ObjectId?.isValid(item.product)) 
          ? new mongoose.Types.ObjectId(item.product) 
          : null,
      };
    });

    const order = await Order.create({
      orderId: generateOrderId(),
      user: userIdToSave,
      items: processedItems,
      subtotal: Number(subtotal) || 0,
      discount: Number(discount) || 0,
      shipping: Number(shipping) || 0,
      total: Number(total) || 0,
      coupon: coupon || null,
      shippingAddress: shippingAddress || {},
      whatsappNumber: body.whatsappNumber || shippingAddress?.phone || '',
      paymentMethod: paymentMethod || 'Razorpay',
      paymentStatus: 'Pending',
      orderStatus: 'Pending',
      notes: notes || '',
      isGift: !!isGift,
      giftNote: giftNote || '',
      statusHistory: [{
        status: 'Pending',
        note: 'Order created, awaiting payment',
        timestamp: new Date()
      }]
    });

    // Link order to user if user is logged in
    if (userIdToSave) {
      try {
        const User = (await import('@/models/User')).default;
        await User.findByIdAndUpdate(
          userIdToSave,
          { $addToSet: { orders: order._id } },
          { new: true }
        );
      } catch (userUpdateError) {
        console.error('Failed to link order to user:', userUpdateError);
        // Don't fail the order creation if user linking fails
      }
    }

    return Response.json({ success: true, message: 'Order created', order }, { status: 201 });
  } catch (error) {
    console.error('Order creation error:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}