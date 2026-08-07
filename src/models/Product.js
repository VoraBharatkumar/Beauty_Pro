import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, index: true },
  slug: { type: String, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true },
  shortDescription: { type: String, maxlength: 300 },
  price: { type: Number, required: true, min: 0 },
  originalPrice: { type: Number, min: 0 },
  costPrice: { type: Number, min: 0 },
  category: { type: String, required: true, lowercase: true, trim: true, index: true },
  subcategory: { type: String, index: true },
  brand: { type: String, default: 'Beauty_Pro' },
  tags: [{ type: String, lowercase: true }],
  images: [{
    url: String,
    alt: String,
    isPrimary: { type: Boolean, default: false }
  }],
  variants: [{
    name: String,
    value: String,
    price: Number,
    stock: Number,
    sku: String
  }],
  ingredients: { type: String },
  benefits: [String],
  howToUse: { type: String },
  skinType: [String],
  rating: { type: Number, min: 0, max: 5, default: 4.5 },
  reviewCount: { type: Number, default: 0 },
  stock: { type: Number, default: 999, min: 0 },
  inStock: { type: Boolean, default: true },
  badge: { type: String, enum: ['New', 'Best Seller', 'Sale', 'Limited Edition', 'Exclusive'] },
  isFeatured: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isNewProduct: { type: Boolean, default: false },
  discount: { type: Number, min: 0, max: 100 },
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  relatedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  reviews: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: String,
    rating: { type: Number, min: 1, max: 5 },
    title: String,
    comment: String,
    images: [String],
    verified: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
  }],
  faqs: [{
    question: String,
    answer: String
  }],
  shippingInfo: {
    freeShippingThreshold: { type: Number, default: 1000 },
    weight: Number,
    dimensions: {
      length: Number,
      width: Number,
      height: Number
    }
  },
  returnPolicy: {
    days: { type: Number, default: 7 },
    conditions: String
  },
  warranty: String,
  certifications: [String],
  expiryDate: Date,
  batchNumber: String,
  manufacturingDetails: {
    madeIn: { type: String, default: 'India' },
    manufacturedBy: String,
    marketedBy: String
  },
  views: { type: Number, default: 0 },
  soldCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false }
}, { timestamps: true });

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });

productSchema.pre('save', function(next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  }
  if (this.originalPrice && this.originalPrice > this.price && !this.discount) {
    this.discount = Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  next();
});

export default mongoose.models.Product || mongoose.model('Product', productSchema);

