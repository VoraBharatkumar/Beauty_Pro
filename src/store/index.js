import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      coupon: null,
      giftNote: '',
      isGift: false,

      addItem: (product) => {
        const items = get().items;
        const existing = items.find(
          (item) => item._id === product._id && item.variant === product.variant
        );
        if (existing) {
          set({
            items: items.map((item) =>
              item._id === product._id && item.variant === product.variant
                ? { ...item, quantity: item.quantity + (product.quantity || 1) }
                : item
            ),
          });
        } else {
          set({ items: [...items, { ...product, quantity: product.quantity || 1 }] });
        }
      },

      removeItem: (id, variant) => {
        set({
          items: get().items.filter(
            (item) => !(item._id === id && item.variant === variant)
          ),
        });
      },

      updateQuantity: (id, variant, quantity) => {
        if (quantity < 1) return;
        set({
          items: get().items.map((item) =>
            item._id === id && item.variant === variant
              ? { ...item, quantity }
              : item
          ),
        });
      },

      clearCart: () => set({ items: [], coupon: null, giftNote: '', isGift: false }),

      setCoupon: (coupon) => set({ coupon }),
      setGiftNote: (giftNote) => set({ giftNote }),
      setIsGift: (isGift) => set({ isGift }),

      getTotalItems: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

      getSubtotal: () =>
        get().items.reduce((acc, item) => acc + item.price * item.quantity, 0),

      getDiscount: () => {
        const coupon = get().coupon;
        if (!coupon) return 0;
        const subtotal = get().getSubtotal();
        if (coupon.type === 'percentage') {
          return (subtotal * coupon.discount) / 100;
        }
        return coupon.discount;
      },

      getTotal: () => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount();
        const shipping = subtotal > 999 ? 0 : 99;
        return Math.max(0, subtotal - discount + shipping);
      },
    }),
    { name: 'luna-cart' }
  )
);

export const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        if (get().items.find((item) => item._id === product._id)) return;
        set({ items: [...get().items, product] });
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item._id !== id) });
      },
      isInWishlist: (id) => get().items.some((item) => item._id === id),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: 'luna-wishlist' }
  )
);

export const useUIStore = create(
  persist(
    (set, get) => ({
      isCartOpen: false,
      isSearchOpen: false,
      isMobileMenuOpen: false,
      isQuickViewOpen: false,
      quickViewProduct: null,
      isScrolled: false,
      activeModal: null,
      toast: null,

      toggleCart: () => set({ isCartOpen: !get().isCartOpen }),
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),

      toggleSearch: () => set({ isSearchOpen: !get().isSearchOpen }),
      openSearch: () => set({ isSearchOpen: true }),
      closeSearch: () => set({ isSearchOpen: false }),

      toggleMobileMenu: () => set({ isMobileMenuOpen: !get().isMobileMenuOpen }),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),

      openQuickView: (product) => set({ isQuickViewOpen: true, quickViewProduct: product }),
      closeQuickView: () => set({ isQuickViewOpen: false, quickViewProduct: null }),

      setScrolled: (value) => set({ isScrolled: value }),

      setActiveModal: (modal) => set({ activeModal: modal }),

      showToast: (message, type = 'success') => {
        set({ toast: { message, type, id: Date.now() } });
        setTimeout(() => set({ toast: null }), 3000);
      },
    }),
    { name: 'luna-ui' }
  )
);

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (user, token) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('luna_token', token);
          localStorage.setItem('luna_user', JSON.stringify(user));
        }
        set({ user, token, isAuthenticated: true });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('luna_token');
          localStorage.removeItem('luna_user');
        }
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (user) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('luna_user', JSON.stringify(user));
        }
        set({ user });
      },
    }),
    {
      name: 'luna-auth',
      storage: {
        getItem: (name) => {
          if (typeof window !== 'undefined') {
            const item = localStorage.getItem(name);
            return item ? JSON.parse(item) : null;
          }
          return null;
        },
        setItem: (name, value) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem(name, JSON.stringify(value));
          }
        },
        removeItem: (name) => {
          if (typeof window !== 'undefined') {
            localStorage.removeItem(name);
          }
        },
      },
    }
  )
);

export const useFilterStore = create((set) => ({
  category: 'all',
  priceRange: [0, 50000],
  rating: 0,
  sortBy: 'newest',
  searchQuery: '',
  viewMode: 'grid',

  setCategory: (category) => set({ category }),
  setPriceRange: (priceRange) => set({ priceRange }),
  setRating: (rating) => set({ rating }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setViewMode: (viewMode) => set({ viewMode }),
  resetFilters: () =>
    set({
      category: 'all',
      priceRange: [0, 50000],
      rating: 0,
      sortBy: 'newest',
      searchQuery: '',
    }),
}));

