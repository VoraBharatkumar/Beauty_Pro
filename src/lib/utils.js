import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
}

export function truncate(str, length = 100) {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.substring(0, length) + '...';
}

export function generateOrderId() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LUNA-${timestamp}-${random}`;
}

export function generateBillNumber() {
  const year = new Date().getFullYear();
  const month = String(new Date().getMonth() + 1).padStart(2, '0');
  const seq = Math.floor(Math.random() * 9000) + 1000;
  return `GST/${year}${month}/${seq}`;
}

export function generateInvoiceNumber() {
  const year = new Date().getFullYear();
  const dayOfYear = Math.floor((new Date() - new Date(year, 0, 0)) / (1000 * 60 * 60 * 24));
  const seq = String(Math.floor(Math.random() * 9000) + 1000).padStart(4, '0');
  return `BP-INV-${year}-${String(dayOfYear).padStart(3, '0')}-${seq}`;
}

export function getOrderStatusColor(status) {
  const colors = {
    'Pending': 'bg-yellow-100 text-yellow-700 border-yellow-200',
    'Confirmed': 'bg-blue-100 text-blue-700 border-blue-200',
    'Packed': 'bg-purple-100 text-purple-700 border-purple-200',
    'Shipped': 'bg-indigo-100 text-indigo-700 border-indigo-200',
    'Out For Delivery': 'bg-orange-100 text-orange-700 border-orange-200',
    'Delivered': 'bg-green-100 text-green-700 border-green-200',
    'Cancelled': 'bg-red-100 text-red-700 border-red-200',
    'Returned': 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return colors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
}

export function getPaymentStatusColor(status) {
  const colors = {
    'Pending': 'bg-yellow-100 text-yellow-700',
    'Paid': 'bg-green-100 text-green-700',
    'Failed': 'bg-red-100 text-red-700',
    'Refunded': 'bg-blue-100 text-blue-700',
    'Partially Refunded': 'bg-purple-100 text-purple-700',
  };
  return colors[status] || 'bg-gray-100 text-gray-700';
}

export function getInitials(name) {
  if (!name) return '?';
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export function ratingToStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
}

export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

