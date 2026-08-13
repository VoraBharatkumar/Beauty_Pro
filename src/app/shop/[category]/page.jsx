'use client';
import { useEffect, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '@/components/shop/ProductCard';
import Button from '@/components/ui/Button';

export default function CategoryPage({ params }) {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState('featured');
  
  const productsPerPage = 12;
  const currentCategory = params?.category;

  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const categoryParam = `&category=${currentCategory}`;
      const sortParam = sortBy === 'featured' ? '' : `&sort=${sortBy}`;
      const res = await fetch(`/api/products?${categoryParam}${sortParam}`);
      const data = await res.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  }, [currentCategory, sortBy]);

  useEffect(() => {
    if (currentCategory) {
      loadProducts();
    }
  }, [currentCategory, sortBy, loadProducts]);

  // ... rest of the component remains the same
}