/**
 * Beauty_Pro - Order Detail Page
 * Shows full order info, GST bill, WhatsApp status
 */
'use client';
import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store';
import Button from '@/components/ui/Button';
import GSTBill from '@/components/order/GSTBill';
import { formatPrice } from '@/lib/utils';

export default function OrderDetailPage({ params }) {
  const { orderId } = use(params);
  const [order, setOrder] = useState(null);
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [whatsappSent, setWhatsappSent] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      // Try by MongoDB _id first, then by orderId
      let res = await fetch(`/api/orders/${orderId}`);
      let data = await res.json();

      // If not found by _id, try querying by orderId string
      if (!data.success) {
        res = await fetch(`/api/orders?userId=${user?._id || ''}`);
        data = await res.json();
        if (data.success && data.orders) {
          const found = data.orders.find(o => o.orderId === orderId || o._id === orderId);
          if (found) {
            setOrder(found);
            if (found.bill?.billNumber) setBill(found.bill);
            return;
          }
        }
        throw new Error(data.error || 'Order not found');
      }

      setOrder(data.order);
      if (data.order.bill?.billNumber) setBill(data.order.bill);
    } catch (err) {
      console.error('[ORDER] Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async () => {
    if (!order?._id) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${order._id}/confirm-payment`, { method: 'POST' });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Payment failed');
      setOrder(data.order);
      setSuccessMsg('✅ Payment confirmed successfully!');
      // Auto-generate bill
      await handleGenerateBill();
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateBill = async () => {
    if (!order?._id) return;
    try {
      const res = await fetch(`/api/orders/${order._id}/generate-bill`, { method: 'POST' });
      const data = await res.json();
      if (data.success && data.bill) {
        setBill(data.bill);
        setOrder(prev => ({ ...prev, bill: data.bill }));
        setSuccessMsg('✅ GST Bill generated!');
      }
    } catch (err) {
      console.error('[ORDER] Bill generation error:', err);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!order?._id) return;
    setActionLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/orders/${order._id}/send-whatsapp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phoneNumber: order.whatsappNumber || order.shippingAddress?.phone || '',
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'WhatsApp send failed');
      setWhatsappSent(true);
      setSuccessMsg('✅ Bill sent to WhatsApp!');
    } catch (err) {
      setError(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Pending: 'bg-yellow-100 text-yellow-700',
      Confirmed: 'bg-blue-100 text-blue-700',
      Processing: 'bg-purple-100 text-purple-700',
      Shipped: 'bg-indigo-100 text-indigo-700',
      Delivered: 'bg-green-100 text-green-700',
      Cancelled: 'bg-red-100 text-red-700',
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="luna-gradient min-h-screen pt-20">
        <div className="luna-container section-padding">
          <div className="text-center py-20">
            <div className="w-10 h-10 border-4 border-luna-rose-gold/30 border-t-luna-rose-gold rounded-full animate-spin mx-auto mb-4" />
            <p className="text-luna-dark/60">Loading order...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="luna-gradient min-h-screen pt-20">
        <div className="luna-container section-padding">
          <div className="text-center py-20 glass-card">
            <div className="text-6xl mb-4">🔍</div>
            <h2 className="font-playfair text-2xl text-luna-dark mb-2">Order Not Found</h2>
            <p className="text-luna-dark/60 mb-6">{error}</p>
            <Link href="/account/orders"><Button variant="primary">Back to Orders</Button></Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="luna-gradient min-h-screen pt-20">
      <div className="luna-container section-padding">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Link href="/account/orders" className="text-luna-rose-gold hover:underline text-sm">&larr; Back to Orders</Link>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-playfair text-3xl md:text-4xl text-luna-dark">Order #{order?.orderId}</h1>
              <p className="text-luna-dark/60 text-sm mt-1">
                Placed on {new Date(order?.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <span className={`text-sm px-4 py-2 rounded-full font-medium self-start ${getStatusColor(order?.orderStatus)}`}>
              {order?.orderStatus}
            </span>
          </div>

          {/* Messages */}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm">{successMsg}</div>
          )}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Items */}
              <div className="glass-card p-6">
                <h3 className="font-playfair text-lg text-luna-dark mb-4">Items</h3>
                <div className="space-y-3">
                  {order?.items?.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 py-3 border-b border-luna-peach/10 last:border-b-0">
                      <div className="w-14 h-14 bg-luna-beige rounded-xl flex items-center justify-center text-xl flex-shrink-0">✨</div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-luna-dark">{item.name}</p>
                        <p className="text-xs text-luna-dark/60">Qty: {item.quantity} {item.variant && `• ${item.variant}`} | HSN: {item.hsnCode || '3304'}</p>
                      </div>
                      <p className="font-medium text-luna-rose-gold">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Section */}
              <div className="glass-card p-6">
                <h3 className="font-playfair text-lg text-luna-dark mb-4">Payment</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-luna-dark/60">Subtotal</span><span>{formatPrice(order?.subtotal)}</span></div>
                  <div className="flex justify-between"><span className="text-luna-dark/60">Shipping</span><span>{order?.shipping === 0 ? 'FREE' : formatPrice(order?.shipping)}</span></div>
                  {order?.discount > 0 && <div className="flex justify-between"><span className="text-luna-dark/60">Discount</span><span className="text-green-600">-{formatPrice(order?.discount)}</span></div>}
                  <div className="flex justify-between font-bold text-base pt-2 border-t border-luna-peach/20">
                    <span>Total</span><span className="text-luna-rose-gold">{formatPrice(order?.total)}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <span className="text-xs text-luna-dark/60">Payment Status:</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    order?.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {order?.paymentStatus}
                  </span>
                  {order?.paidAt && (
                    <span className="text-xs text-luna-dark/40">
                      at {new Date(order.paidAt).toLocaleTimeString('en-IN')}
                    </span>
                  )}
                </div>

                {/* Payment Action */}
                {order?.paymentStatus !== 'Paid' && (
                  <Button variant="primary" size="sm" onClick={handleConfirmPayment} loading={actionLoading} className="mt-4">
                    Confirm Payment (Simulated)
                  </Button>
                )}
              </div>

              {/* Bill Section */}
              <div className="glass-card p-6">
                <h3 className="font-playfair text-lg text-luna-dark mb-4">GST Invoice</h3>
                {bill ? (
                  <>
                    <div className="mb-3 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                      ✅ Bill generated: <strong>{bill.billNumber}</strong>
                      {bill.generatedAt && (
                        <span className="text-green-600"> on {new Date(bill.generatedAt).toLocaleDateString('en-IN')}</span>
                      )}
                    </div>
                    <GSTBill order={order} bill={bill} />
                  </>
                ) : order?.paymentStatus === 'Paid' ? (
                  <div className="text-center py-6">
                    <Button variant="primary" onClick={handleGenerateBill} loading={actionLoading}>
                      Generate GST Bill
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-6 text-luna-dark/60 text-sm">
                    💡 Bill will be available after payment is confirmed.
                  </div>
                )}
              </div>

              {/* WhatsApp Section */}
              <div className="glass-card p-6">
                <h3 className="font-playfair text-lg text-luna-dark mb-4">📱 WhatsApp Bill</h3>
                {order?.paymentStatus === 'Paid' && bill ? (
                  <div className="space-y-3">
                    <p className="text-sm text-luna-dark/60">
                      Send the GST bill to:{' '}
                      <strong>{order.whatsappNumber || order.shippingAddress?.phone || 'Not provided'}</strong>
                    </p>
                    {order.bill?.whatsappSentAt || whatsappSent ? (
                      <div className="bg-green-100 text-green-700 rounded-xl p-4 text-sm font-medium">
                        ✅ Bill sent to WhatsApp
                        {order.bill?.whatsappSentAt && (
                          <span className="text-green-600 font-normal"> on {new Date(order.bill.whatsappSentAt).toLocaleString('en-IN')}</span>
                        )}
                      </div>
                    ) : (
                      <Button variant="primary" onClick={handleSendWhatsApp} loading={actionLoading}>
                        📲 Send Bill on WhatsApp
                      </Button>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-6 text-luna-dark/60 text-sm">
                    💡 WhatsApp bill will be available after payment and bill generation.
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Shipping Address */}
              <div className="glass-card p-6">
                <h3 className="font-playfair text-lg text-luna-dark mb-4">Shipping Address</h3>
                <div className="text-sm space-y-1">
                  <p className="font-medium text-luna-dark">{order?.shippingAddress?.name}</p>
                  <p className="text-luna-dark/70">{order?.shippingAddress?.address}</p>
                  <p className="text-luna-dark/70">
                    {order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.pincode}
                  </p>
                  <p className="text-luna-dark/70">📞 {order?.shippingAddress?.phone}</p>
                </div>
              </div>

              {/* Status History */}
              <div className="glass-card p-6">
                <h3 className="font-playfair text-lg text-luna-dark mb-4">Status History</h3>
                <div className="space-y-3">
                  {order?.statusHistory?.length > 0 ? (
                    order.statusHistory.map((entry, idx) => (
                      <div key={idx} className="flex gap-3 text-sm">
                        <div className="flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full mt-1.5 ${idx === 0 ? 'bg-luna-rose-gold' : 'bg-luna-peach'}`} />
                          {idx < order.statusHistory.length - 1 && <div className="w-0.5 h-full bg-luna-peach/30 min-h-[20px]" />}
                        </div>
                        <div>
                          <p className="font-medium text-luna-dark">{entry.status}</p>
                          {entry.note && <p className="text-xs text-luna-dark/60">{entry.note}</p>}
                          <p className="text-xs text-luna-dark/40">
                            {new Date(entry.timestamp).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-luna-dark/60">No status updates yet</p>
                  )}
                </div>
              </div>

              {/* Bill Info */}
              {bill && (
                <div className="glass-card p-6">
                  <h3 className="font-playfair text-lg text-luna-dark mb-4">Bill Details</h3>
                  <div className="text-xs space-y-2">
                    <div className="flex justify-between"><span className="text-luna-dark/60">Bill No</span><span className="font-medium">{bill.billNumber}</span></div>
                    <div className="flex justify-between"><span className="text-luna-dark/60">GSTIN</span><span className="font-medium">{bill.gstin}</span></div>
                    <div className="flex justify-between"><span className="text-luna-dark/60">Place</span><span className="font-medium">{bill.placeOfSupply}</span></div>
                    <div className="flex justify-between"><span className="text-luna-dark/60">CGST</span><span className="font-medium">₹{(bill.cgst || 0).toLocaleString()}</span></div>
                    <div className="flex justify-between"><span className="text-luna-dark/60">SGST</span><span className="font-medium">₹{(bill.sgst || 0).toLocaleString()}</span></div>
                    <div className="flex justify-between font-bold pt-2 border-t border-luna-peach/20"><span>Grand Total</span><span className="text-luna-rose-gold">₹{((bill.grandTotal || order?.total) || 0).toLocaleString()}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}