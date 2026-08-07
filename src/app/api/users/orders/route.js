/**
 * Beauty_Pro - User Orders API
 * Updates user's orders array when a new order is created
 */

import { connectDB } from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    await connectDB();
    const { userId, orderId } = await request.json();

    if (!userId || !orderId) {
      return Response.json({ success: false, message: 'User ID and Order ID are required' }, { status: 400 });
    }

    // Add order to user's orders array
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $addToSet: { orders: orderId } },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json({ success: false, message: 'User not found' }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      message: 'Order added to user\'s orders list',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Error updating user orders:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}