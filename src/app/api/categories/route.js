/**
 * Beauty_Pro - Categories API
 */

import { connectDB } from '@/lib/db';
import Category from '@/models/Category';
import Product from '@/models/Product';

export const dynamic = 'force-dynamic';

const demoCategories = [
  { name: 'Skincare', slug: 'skincare', description: 'Premium skincare essentials for radiant skin', icon: 'skin' },
  { name: 'Makeup', slug: 'makeup', description: 'Luxury makeup for every occasion', icon: 'makeup' },
  { name: 'Haircare', slug: 'haircare', description: 'Nourishing hair care solutions', icon: 'hair' },
  { name: 'Fragrance', slug: 'fragrance', description: 'Elegant fragrances that captivate', icon: 'fragrance' },
  { name: 'Body Care', slug: 'body-care', description: 'Pampering body care products', icon: 'body' },
];

export async function GET(request) {
  try {
    let categories = [];
    let usedFallback = false;
    
    try {
      await connectDB();
      categories = await Category.find({}).sort({ sortOrder: 1 }).lean();
    } catch (e) {
      categories = demoCategories;
      usedFallback = true;
    }

    if (!usedFallback && categories.length === 0) {
      categories = demoCategories;
      usedFallback = true;
    }

    return Response.json({ success: true, categories, fallback: usedFallback });
  } catch (error) {
    return Response.json({ success: true, categories: demoCategories, fallback: true });
  }
}

