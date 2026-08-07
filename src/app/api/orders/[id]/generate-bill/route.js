/**
 * Beauty_Pro - GST Bill Generation API
 * Generates a GST bill / tax invoice for a confirmed order
 */
import { connectDB } from '@/lib/db';
import Order from '@/models/Order';
import { generateBillNumber } from '@/lib/utils';

export const dynamic = 'force-dynamic';

export async function POST(request, { params }) {
  try {
    const { id } = await params;
    console.log(`[BILL] Generating bill for order: ${id}`);

    await connectDB();

    const order = await Order.findById(id).lean();
    if (!order) {
      console.error(`[BILL] Order not found: ${id}`);
      return Response.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // Ensure payment is confirmed
    if (order.paymentStatus !== 'Paid') {
      console.error(`[BILL] Payment not confirmed for order ${id}. Status: ${order.paymentStatus}`);
      return Response.json({
        success: false,
        error: 'Payment not confirmed. Cannot generate bill before payment.',
        step: 'payment_required'
      }, { status: 400 });
    }

    // Prevent duplicate bill generation
    if (order.bill?.billNumber) {
      console.log(`[BILL] Bill already exists for order ${id}: ${order.bill.billNumber}`);
      return Response.json({
        success: true,
        message: 'Bill already generated',
        bill: order.bill,
        order
      });
    }

    // Calculate GST
    const gstRate = 18;
    const cgstRate = gstRate / 2; // 9%
    const sgstRate = gstRate / 2; // 9%

    const taxableItems = order.items.map(item => {
      const itemTotal = item.price * item.quantity;
      const gstAmount = Math.round((itemTotal * gstRate) / 100);
      const cgst = Math.round(gstAmount / 2);
      const sgst = Math.round(gstAmount / 2);
      return {
        ...item,
        itemTotal,
        taxableValue: itemTotal,
        gstRate: item.gstRate || gstRate,
        cgst,
        sgst,
        igst: 0,
      };
    });

    const taxableValue = taxableItems.reduce((sum, i) => sum + i.taxableValue, 0);
    const totalCgst = taxableItems.reduce((sum, i) => sum + i.cgst, 0);
    const totalSgst = taxableItems.reduce((sum, i) => sum + i.sgst, 0);
    const totalGst = totalCgst + totalSgst;

    const billData = {
      billNumber: generateBillNumber(),
      generatedAt: new Date(),
      gstin: '27ABCDE1234F1Z5',
      placeOfSupply: order.shippingAddress?.state || 'Maharashtra',
      taxableValue,
      cgst: totalCgst,
      sgst: totalSgst,
      igst: 0,
      totalGst,
      grandTotal: taxableValue + totalGst,
      items: taxableItems,
    };

    // Save bill to order
    await Order.findByIdAndUpdate(id, {
      $set: {
        'bill.billNumber': billData.billNumber,
        'bill.generatedAt': billData.generatedAt,
        'bill.gstin': billData.gstin,
        'bill.placeOfSupply': billData.placeOfSupply,
      }
    });

    console.log(`[BILL] ✅ Bill ${billData.billNumber} generated for order ${order.orderId}`);

    return Response.json({
      success: true,
      message: 'Bill generated successfully',
      bill: billData,
      order: { ...order, bill: { ...order.bill, ...billData } }
    });
  } catch (error) {
    console.error('[BILL] ❌ Error:', error.message);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}