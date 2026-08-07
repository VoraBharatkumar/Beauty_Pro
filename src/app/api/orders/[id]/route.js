/**
 * Beauty_Pro - Single Order API
 * Get, update, or cancel specific orders
 */

import { connectDB } from '@/lib/db';
import Order from '@/models/Order';

export const dynamic = 'force-dynamic';

// Get single order
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return Response.json({ success: false, message: 'Order ID is required' }, { status: 400 });
    }

    const order = await Order.findById(id).lean();

    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return Response.json({ success: true, order });
  } catch (error) {
    console.error('Error fetching order:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Update order (status, payment, etc.)
export async function PATCH(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await request.json();

    if (!id) {
      return Response.json({ success: false, message: 'Order ID is required' }, { status: 400 });
    }

    const allowedUpdates = ['orderStatus', 'paymentStatus', 'statusHistory', 'notes'];
    const updates = {};

    for (const key of allowedUpdates) {
      if (body[key] !== undefined) {
        updates[key] = body[key];
      }
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true }
    );

    if (!updatedOrder) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    return Response.json({ 
      success: true, 
      message: 'Order updated successfully',
      order: updatedOrder 
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// Cancel order
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = await params;

    if (!id) {
      return Response.json({ success: false, message: 'Order ID is required' }, { status: 400 });
    }

    const order = await Order.findById(id);

    if (!order) {
      return Response.json({ success: false, message: 'Order not found' }, { status: 404 });
    }

    // Check if order can be cancelled
    if (['Delivered', 'Cancelled', 'Shipped'].includes(order.orderStatus)) {
      return Response.json({ 
        success: false, 
        message: `Cannot cancel order with status: ${order.orderStatus}` 
      }, { status: 400 });
    }

    // Update order status to cancelled
    order.orderStatus = 'Cancelled';
    order.statusHistory.push({
      status: 'Cancelled',
      note: 'Order cancelled by customer',
      timestamp: new Date()
    });
    await order.save();

    return Response.json({ 
      success: true, 
      message: 'Order cancelled successfully',
      order 
    });
  } catch (error) {
    console.error('Error cancelling order:', error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}