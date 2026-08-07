'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/store';
import Button from '@/components/ui/Button';
import {
  UserIcon,
  ShoppingBagIcon,
  HeartIcon,
  MapPinIcon,
  CogIcon,
  BellIcon,
  CreditCardIcon,
  ChevronRightIcon,
  StarIcon,
  ArrowRightOnRectangleIcon,
} from '@heroicons/react/24/outline';

const menuItems = [
  { title: 'Profile', href: '/account', icon: UserIcon },
  { title: 'Orders', href: '/account/orders', icon: ShoppingBagIcon },
  { title: 'Wishlist', href: '/account/wishlist', icon: HeartIcon },
  { title: 'Addresses', href: '/account/address', icon: MapPinIcon },
  { title: 'Payment Methods', href: '/account/cards', icon: CreditCardIcon },
  { title: 'Notifications', href: '/account/notifications', icon: BellIcon },
  { title: 'Settings', href: '/account/settings', icon: CogIcon },
];

const LogoutIcon = ArrowRightOnRectangleIcon;

export default function AccountPage() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`/api/orders${user?._id ? `?userId=${user._id}` : ''}`);
      const data = await res.json();
      if (data.success && data.orders) {
        const orders = data.orders.slice(0, 2).map(order => ({
          id: order.orderId || 'N/A',
          date: new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }),
          status: order.orderStatus || 'Pending',
          total: order.total || 0,
          items: order.items?.length || 0,
        }));
        setRecentOrders(orders);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div className="luna-gradient min-h-screen pt-20">
      <div className="luna-container section-padding">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="font-playfair text-4xl md:text-5xl text-luna-dark">My Account</h1>
              <p className="text-luna-dark/60 mt-2">Welcome back, {user?.name || 'User'}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <LogoutIcon className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="glass-card p-4 space-y-1">
                {menuItems.map((item) => (
                  <Link
                    key={item.title}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-luna-dark hover:bg-luna-beige/50 transition-colors"
                  >
                    <item.icon className="w-5 h-5 text-luna-coffee" />
                    <span className="text-sm font-medium">{item.title}</span>
                    <ChevronRightIcon className="w-4 h-4 ml-auto text-luna-dark/40" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {/* Profile Card */}
              <div className="glass-card p-6">
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full gold-gradient flex items-center justify-center text-white text-2xl font-playfair">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h2 className="font-playfair text-2xl text-luna-dark">{user?.name || 'User'}</h2>
                    <p className="text-luna-dark/60">{user?.email || 'user@email.com'}</p>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Orders', value: recentOrders.length > 0 ? recentOrders.length.toString() : '0', icon: ShoppingBagIcon },
                  { label: 'Wishlist Items', value: '0', icon: HeartIcon },
                  { label: 'Reward Points', value: '0', icon: StarIcon },
                ].map((stat, idx) => (
                  <div key={idx} className="glass-card p-6 text-center">
                    <stat.icon className="w-8 h-8 mx-auto text-luna-rose-gold mb-2" />
                    <div className="font-playfair text-3xl text-luna-dark mb-1">{stat.value}</div>
                    <div className="text-sm text-luna-dark/60">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Recent Orders */}
              <div className="glass-card p-6">
                <h3 className="font-playfair text-xl text-luna-dark mb-4">Recent Orders</h3>
                <div className="space-y-4">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="inline-block w-8 h-8 border-2 border-luna-rose-gold border-t-transparent rounded-full animate-spin" />
                      <p className="text-luna-dark/60 mt-2">Loading orders...</p>
                    </div>
                  ) : recentOrders.length > 0 ? (
                    recentOrders.map((order) => (
                      <Link key={order.id} href="/account/orders" className="block p-4 bg-luna-beige/30 rounded-xl hover:bg-luna-beige/50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-luna-dark">{order.id}</p>
                            <p className="text-sm text-luna-dark/60">{order.date} • {order.items} items</p>
                          </div>
                          <div className="text-right">
                            <p className="font-playfair text-luna-rose-gold">₹{order.total.toLocaleString()}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              order.status === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                            }`}>
                              {order.status}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-luna-dark/60">No orders yet</p>
                      <Link href="/shop">
                        <Button variant="primary" size="sm" className="mt-4">Start Shopping</Button>
                      </Link>
                    </div>
                  )}
                </div>
                {recentOrders.length > 0 && (
                  <Link href="/account/orders">
                    <Button variant="ghost" className="w-full mt-4">View All Orders</Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}