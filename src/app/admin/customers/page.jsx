/**
 * Beauty_Pro - Admin Customers Management Panel
 * View and manage all registered users
 */

'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { formatDate } from '@/lib/utils';

export default function AdminCustomersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [error, setError] = useState('');

  const fetchUsers = async (query = '') => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/users?search=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
    fetchUsers(searchInput);
  };

  const stats = {
    total: users.length,
    verified: users.filter((u) => u.isVerified).length,
    active: users.filter((u) => u.isActive).length,
    withOrders: users.filter((u) => u.orders?.length > 0).length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-beauty-beige/30 to-white pt-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="font-playfair text-3xl md:text-4xl text-beauty-dark mb-2">Customers Management</h1>
          <p className="text-beauty-dark/60 mb-6">View all registered users and their activity</p>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: 'Total Users', value: stats.total, color: 'bg-blue-50 text-blue-700' },
              { label: 'Verified', value: stats.verified, color: 'bg-green-50 text-green-700' },
              { label: 'Active', value: stats.active, color: 'bg-emerald-50 text-emerald-700' },
              { label: 'With Orders', value: stats.withOrders, color: 'bg-indigo-50 text-indigo-700' },
            ].map((stat) => (
              <div key={stat.label} className={`rounded-xl p-4 text-center ${stat.color}`}>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-xs font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by name, email, or phone..."
              className="flex-1 px-4 py-2.5 bg-white border border-beauty-peach/30 rounded-xl focus:border-beauty-rose-gold focus:outline-none text-sm"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-beauty-rose-gold text-white text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Search
            </button>
            {search && (
              <button
                type="button"
                onClick={() => {
                  setSearch('');
                  setSearchInput('');
                  fetchUsers();
                }}
                className="px-3 py-2.5 rounded-xl bg-beauty-beige text-beauty-dark text-sm font-medium hover:bg-beauty-peach/50 transition-colors"
              >
                Clear
              </button>
            )}
          </form>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-2 border-beauty-rose-gold border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-beauty-peach/20">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-beauty-beige/30 text-left text-beauty-dark/60">
                      <th className="px-4 py-3 font-medium">User</th>
                      <th className="px-4 py-3 font-medium hidden md:table-cell">Phone</th>
                      <th className="px-4 py-3 font-medium">Status</th>
                      <th className="px-4 py-3 font-medium hidden lg:table-cell">Orders</th>
                      <th className="px-4 py-3 font-medium hidden md:table-cell">Joined</th>
                      <th className="px-4 py-3 font-medium hidden sm:table-cell">Verified</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id} className="border-t border-beauty-peach/10 hover:bg-beauty-beige/20 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full gold-gradient flex items-center justify-center text-white text-sm font-playfair shrink-0">
                              {user.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium text-beauty-dark truncate">{user.name || 'User'}</p>
                              <p className="text-xs text-beauty-dark/50 truncate">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-beauty-dark/70 hidden md:table-cell">
                          {user.phone || '—'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                            user.isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-beauty-dark/70 hidden lg:table-cell">
                          {user.orders?.length || 0}
                        </td>
                        <td className="px-4 py-3 text-beauty-dark/50 hidden md:table-cell">
                          {user.createdAt ? formatDate(user.createdAt) : '—'}
                        </td>
                        <td className="px-4 py-3 hidden sm:table-cell">
                          {user.isVerified ? (
                            <span className="text-green-600">✓ Verified</span>
                          ) : (
                            <span className="text-beauty-dark/40">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {users.length === 0 && (
                <div className="text-center py-12 text-beauty-dark/60">
                  No users found
                  {search && ' for this search query'}
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}