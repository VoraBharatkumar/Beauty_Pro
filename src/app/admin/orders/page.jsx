/**
 * Beauty_Pro - Admin Orders Management Panel
 * Manage: Orders, Payments, Customers, Invoices, Shipping
 */

'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';
import { formatPrice, formatDate, getOrderStatusColor, getPaymentStatusColor } from '@/lib/utils';

const ORDER_STATUSES = ['Pending', 'Confirmed', 'Packed', 'Shipped', 'Out For Delivery', 'Delivered', 'Cancelled', 'Returned'];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    setStatusUpdateLoading(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderStatus: newStatus,
          statusHistory: [{
            status: newStatus,
            note: `Status updated to ${newStatus} by admin`,
            timestamp: new Date(),
          }],
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchOrders();
        if (selectedOrder?._id === orderId) setSelectedOrder(data.order);
      }
    } catch (error) {
      console.error('Failed to update order:', error);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  const filteredOrders = statusFilter === 'all'
    ? orders
    : orders.filter(o => o.orderStatus === statusFilter);

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.orderStatus === 'Pending').length,
    paid: orders.filter(o => o.paymentStatus === 'Paid').length,
    shipped: orders.filter(o => o.orderStatus === 'Shipped').length,
    delivered: orders.filter(o => o.orderStatus === 'Delivered').length,
    cancelled: orders.filter(o => o.orderStatus === 'Cancelled').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beauty-beige/30 to-white pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-playfair text-3xl md:text-4xl text-beauty-dark mb-2">Orders Management</h1>
          <p className="text-beauty-dark/60 mb-6">Manage all orders, status, and tracking</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 mb-6">
            {[
              { label: 'Total', value: stats.total, color: 'bg-blue-50 text-blue-700' },
              { label: 'Pending', value: stats.pending, color: 'bg-yellow-50 text-yellow-700' },
              { label: 'Paid', value: stats.paid, color: 'bg-green-50 text-green-700' },
              { label: 'Shipped', value: stats.shipped, color: 'bg-indigo-50 text-indigo-700' },
              { label: 'Delivered', value: stats.delivered, color: 'bg-emerald-50 text-emerald-700' },
              { label: 'Cancelled', value: stats.cancelled, color: 'bg-red-50 text-red-700' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl p-4 text-center ${stat.color}`}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                statusFilter === 'all' ? 'bg-beauty-rose-gold text-white' : 'bg-beauty-beige text-beauty-dark hover:bg-beauty-peach/50'
              }`}
            >
              All ({stats.total})
            </button>
            {ORDER_STATUSES.map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  statusFilter === status ? 'bg-beauty-rose-gold text-white' : 'bg-beauty-beige text-beauty-dark hover:bg-beauty-peach/50'
                }`}
              >
                {status} ({orders.filter(o => o.orderStatus === status).length})
              </button>
            ))}
          </div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-beauty-rose-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              {filteredOrders.map((order) => (
                <div key={order._id} className="bg-white rounded-xl p-4 shadow-sm border border-beauty-peach/20 hover:shadow-md transition-all">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-beauty-dark">#{order.orderId}</span>
                        <span className="text-xs text-beauty-dark/40">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-beauty-dark/70">
                        <span>{order.shippingAddress?.name || 'Guest'}</span>
                        <span>•</span>
                        <span>{order.items?.length || 0} items</span>
                        <span>•</span>
                        <span className="font-playfair text-beauty-rose-gold font-semibold">{formatPrice(order.total)}</span>
                      </div>
                      {order.shippingAddress?.phone && (
                        <div className="text-xs text-beauty-dark/50 mt-0.5">📞 {order.shippingAddress.phone}</div>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                        {order.paymentStatus}
                      </span>
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                        disabled={statusUpdateLoading}
                        className={`text-xs px-2 py-1.5 rounded-lg font-medium border cursor-pointer ${getOrderStatusColor(order.orderStatus).split(' ').slice(0, 2).join(' ')}`}
                      >
                        {ORDER_STATUSES.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Items Preview */}
                  <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-beauty-peach/10">
                    {order.items?.slice(0, 3).map((item, idx) => (
                      <span key={idx} className="text-xs bg-beauty-beige/50 px-2 py-1 rounded text-beauty-dark/70">
                        {item.name} x{item.quantity}
                      </span>
                    ))}
                    {order.items?.length > 3 && (
                      <span className="text-xs text-beauty-rose-gold">+{order.items.length - 3} more</span>
                    )}
                  </div>
                </div>
              ))}

              {filteredOrders.length === 0 && (
                <div className="text-center py-12 text-beauty-dark/60">
                  No orders found for this status.
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}