'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore, useCartStore, useUIStore } from '@/store';
import Button from '@/components/ui/Button';
import { formatPrice, getOrderStatusColor, getPaymentStatusColor, formatDate } from '@/lib/utils';

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders${user?._id ? `?userId=${user._id}` : ''}`);
      const data = await res.json();
      if (data.success && data.orders) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      Confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
      Packed: 'bg-purple-100 text-purple-700 border-purple-200',
      Shipped: 'bg-indigo-100 text-indigo-700 border-indigo-200',
      'Out For Delivery': 'bg-orange-100 text-orange-700 border-orange-200',
      Delivered: 'bg-green-100 text-green-700 border-green-200',
      Cancelled: 'bg-red-100 text-red-700 border-red-200',
      Returned: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const getPaymentColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Paid: 'bg-green-100 text-green-700',
      Failed: 'bg-red-100 text-red-700',
      Refunded: 'bg-blue-100 text-blue-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const handleReorder = (order) => {
    if (!order?.items) return;
    order.items.forEach(item => {
      addItem({
        _id: item.product || item._id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        variant: item.variant || 'Default',
        image: item.image || '',
      });
    });
    useUIStore?.getState()?.showToast('Items added to cart!', 'success');
  };

  const handlePrintInvoice = (order) => {
    if (!order) return;
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to print the invoice.');
      return;
    }
    
    const itemsHtml = order.items?.map((item, idx) => {
      const itemTotal = item.price * item.quantity;
      return `
        <tr>
          <td style="border:1px solid #ddd;padding:6px;text-align:center">${idx + 1}</td>
          <td style="border:1px solid #ddd;padding:6px">${item.name}</td>
          <td style="border:1px solid #ddd;padding:6px;text-align:center">${item.hsnCode || '3304'}</td>
          <td style="border:1px solid #ddd;padding:6px;text-align:center">${item.quantity}</td>
          <td style="border:1px solid #ddd;padding:6px;text-align:right">₹${item.price.toLocaleString()}</td>
          <td style="border:1px solid #ddd;padding:6px;text-align:right">₹${itemTotal.toLocaleString()}</td>
        </tr>
      `;
    }).join('');

    printWindow.document.write(`
      <html>
      <head>
        <title>Invoice - ${order.orderId}</title>
        <style>
          @page { margin: 15mm; size: A4; }
          body { font-family: 'Courier New', monospace; font-size: 12px; color: #333; }
          .invoice { max-width: 800px; margin: 0 auto; padding: 30px; }
          .header { text-align: center; border-bottom: 2px dashed #333; padding-bottom: 20px; margin-bottom: 20px; }
          .header h1 { margin: 0; font-size: 28px; }
          .header p { margin: 3px 0; font-size: 11px; color: #666; }
          table { width: 100%; border-collapse: collapse; margin: 15px 0; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; font-size: 11px; }
          th { background: #f5f5f5; font-weight: bold; }
          .total-row td { font-weight: bold; }
          .footer { margin-top: 40px; text-align: center; font-size: 10px; color: #999; border-top: 1px solid #ddd; padding-top: 15px; }
          .signature { margin-top: 50px; display: flex; justify-content: space-between; }
          .signature div { width: 200px; text-align: center; }
          .signature .line { border-top: 1px solid #333; margin-top: 40px; padding-top: 5px; font-size: 10px; }
          .badge { display: inline-block; padding: 3px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
          .badge-paid { background: #d4edda; color: #155724; }
          .badge-pending { background: #fff3cd; color: #856404; }
        </style>
      </head>
      <body>
        <div class="invoice">
          <div class="header">
            <h1>Beauty_Pro</h1>
            <p>Luxury Cosmetics & Skincare</p>
            <p>GSTIN: ${order.bill?.gstin || '27ABCDE1234F1Z5'} | Email: hello@beautypro.in</p>
            <p>Phone: +91 98765 43210</p>
          </div>
          <h2 style="text-align:center;font-size:18px;margin:15px 0">TAX INVOICE</h2>
          <table style="border:none;margin:10px 0">
            <tr><td style="border:none;padding:2px"><strong>Invoice:</strong> ${order.bill?.billNumber || order.orderId}</td>
                <td style="border:none;padding:2px;text-align:right"><strong>Date:</strong> ${formatDate(order.createdAt)}</td></tr>
            <tr><td style="border:none;padding:2px"><strong>Order ID:</strong> ${order.orderId}</td>
                <td style="border:none;padding:2px;text-align:right"><strong>Payment:</strong> ${order.paymentStatus}</td></tr>
          </table>
          <div style="margin:15px 0;padding:10px;background:#f9f9f9;border-radius:4px">
            <strong style="display:block;margin-bottom:5px">Bill To:</strong>
            <p style="margin:2px 0">${order.shippingAddress?.name || 'Customer'}</p>
            <p style="margin:2px 0">${order.shippingAddress?.address || ''}${order.shippingAddress?.city ? `, ${order.shippingAddress.city}` : ''}</p>
            <p style="margin:2px 0">${order.shippingAddress?.state || ''} ${order.shippingAddress?.pincode || ''}</p>
            <p style="margin:2px 0">Phone: ${order.shippingAddress?.phone || ''}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Item</th>
                <th>HSN</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr class="total-row">
                <td colspan="4" style="text-align:right">Subtotal</td>
                <td colspan="2" style="text-align:right">₹${(order.subtotal || 0).toLocaleString()}</td>
              </tr>
              <tr class="total-row">
                <td colspan="4" style="text-align:right">Shipping</td>
                <td colspan="2" style="text-align:right">${order.shipping === 0 ? 'FREE' : '₹' + (order.shipping || 0).toLocaleString()}</td>
              </tr>
              ${order.discount > 0 ? `<tr class="total-row"><td colspan="4" style="text-align:right">Discount</td><td colspan="2" style="text-align:right;color:green">-₹${(order.discount || 0).toLocaleString()}</td></tr>` : ''}
              <tr class="total-row" style="font-size:14px">
                <td colspan="4" style="text-align:right">Grand Total</td>
                <td colspan="2" style="text-align:right;font-size:16px">₹${(order.total || 0).toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
          <div style="margin:15px 0;font-style:italic;font-size:11px">
            <strong>Amount in Words:</strong> Rupees ${numberToWords(order.total || 0)} Only
          </div>
          <div class="signature">
            <div><div class="line">Customer Signature</div></div>
            <div><div class="line">Authorised Signatory</div></div>
          </div>
          <div class="footer">
            <p>This is a computer generated invoice | Subject to Mumbai jurisdiction</p>
            <p>Thank you for shopping with Beauty_Pro!</p>
          </div>
        </div>
        <script>
          window.onload = function() { window.print(); setTimeout(() => window.close(), 500); }
        <\\/script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!isAuthenticated) {
    return (
      <div className="luna-gradient min-h-screen pt-20">
        <div className="luna-container section-padding text-center py-20">
          <div className="text-6xl mb-4">🔒</div>
          <h1 className="font-playfair text-3xl text-luna-dark mb-4">Please Sign In</h1>
          <p className="text-luna-dark/60 mb-6">You need to sign in to view your orders.</p>
          <Link href="/login"><Button variant="primary" size="lg">Sign In</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="luna-gradient min-h-screen pt-20">
      <div className="luna-container section-padding">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-4 mb-8">
            <Link href="/account" className="text-luna-rose-gold hover:underline text-sm">
              &larr; Back to Account
            </Link>
          </div>

          <h1 className="font-playfair text-4xl md:text-5xl text-luna-dark mb-4">My Orders</h1>
          <p className="text-luna-dark/60 mb-8">View and manage all your orders</p>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-8 h-8 border-2 border-luna-rose-gold border-t-transparent rounded-full animate-spin" />
              <p className="text-luna-dark/60 mt-4">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 glass-card">
              <div className="text-6xl mb-4">📦</div>
              <h2 className="font-playfair text-2xl text-luna-dark mb-2">No Orders Yet</h2>
              <p className="text-luna-dark/60 mb-6">You haven't placed any orders yet.</p>
              <Link href="/shop">
                <Button variant="primary" size="lg">Start Shopping</Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order._id} className="glass-card p-6 hover:shadow-lg transition-all">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                      <Link href={`/account/orders/${order._id}`} className="hover:text-luna-rose-gold transition-colors">
                        <p className="font-semibold text-luna-dark">Order #{order.orderId || order._id.slice(-8)}</p>
                      </Link>
                      <p className="text-sm text-luna-dark/60">{formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-xs px-3 py-1.5 rounded-full font-medium border ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                      <span className={`text-xs px-2.5 py-1.5 rounded-full font-medium ${getPaymentColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                      <span className="font-playfair text-lg text-luna-rose-gold">{formatPrice(order.total)}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="space-y-2">
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 py-2 border-t border-luna-peach/10">
                        <div className="w-12 h-12 bg-luna-beige rounded-lg flex items-center justify-center text-lg flex-shrink-0">
                          {item.image ? (
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                          ) : '✨'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-luna-dark">{item.name}</p>
                          <p className="text-xs text-luna-dark/60">Qty: {item.quantity} {item.variant && `• ${item.variant}`}</p>
                        </div>
                        <p className="text-sm font-medium text-luna-dark">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    ))}
                    {order.items?.length > 3 && (
                      <Link href={`/account/orders/${order._id}`} className="block text-xs text-luna-rose-gold text-center pt-1 hover:underline">
                        +{order.items.length - 3} more items
                      </Link>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-luna-peach/10">
                    <Link href={`/account/orders/${order._id}`} className="flex-1 min-w-[120px]">
                      <Button variant="primary" size="sm" className="w-full">View Details</Button>
                    </Link>
                    {order.paymentStatus === 'Paid' && (
                      <Button variant="outline" size="sm" onClick={() => handlePrintInvoice(order)} className="min-w-[100px]">
                        🖨️ Invoice
                      </Button>
                    )}
                    {order.orderStatus === 'Delivered' && (
                      <Button variant="outline" size="sm" onClick={() => handleReorder(order)} className="min-w-[100px]">
                        🔄 Reorder
                      </Button>
                    )}
                    {order.trackingStatus?.trackingUrl && (
                      <a href={order.trackingStatus.trackingUrl} target="_blank" rel="noopener noreferrer" className="min-w-[100px]">
                        <Button variant="outline" size="sm" className="w-full">📦 Track</Button>
                      </a>
                    )}
                  </div>

                  {/* Delivery Info */}
                  {order.shippingAddress?.address && (
                    <div className="mt-3 pt-3 border-t border-luna-peach/5 text-xs text-luna-dark/50">
                      <span className="font-medium">Deliver to:</span> {order.shippingAddress.name}, {order.shippingAddress.address}
                      {order.shippingAddress.city && `, ${order.shippingAddress.city}`} {order.shippingAddress.pincode || ''}
                      {order.shippingAddress.phone && ` • 📞 ${order.shippingAddress.phone}`}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}

// Simple number to words converter
function numberToWords(num) {
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  if (num === 0) return 'Zero';
  const convert = (n) => {
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : '');
    if (n < 1000) return ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' ' + convert(n % 100) : '');
    if (n < 100000) return convert(Math.floor(n / 1000)) + ' Thousand' + (n % 1000 ? ' ' + convert(n % 1000) : '');
    if (n < 10000000) return convert(Math.floor(n / 100000)) + ' Lakh' + (n % 100000 ? ' ' + convert(n % 100000) : '');
    return convert(Math.floor(n / 10000000)) + ' Crore' + (n % 10000000 ? ' ' + convert(n % 10000000) : '');
  };
  return convert(num);
}
