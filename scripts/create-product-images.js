/**
 * Beauty_Pro - Product Images Generator
 * Creates SVG placeholder images for all products
 */

const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, '..', 'public', 'images', 'products');

// Ensure directory exists
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

// Category-specific gradient colors and shapes
const categoryGradients = {
  skincare: { from: '#F0D8CC', to: '#D9B29C', shape: 'circle' },
  makeup: { from: '#FADADD', to: '#D9B29C', shape: 'heart' },
  haircare: { from: '#E6D6C9', to: '#A87363', shape: 'leaf' },
  fragrance: { from: '#FFF0E1', to: '#FADADD', shape: 'flower' },
  'body-care': { from: '#F0D8CC', to: '#A87363', shape: 'drop' },
};

// Product data for each category
const categoryProducts = {
  skincare: [
    { id: 'serum', name: 'Rose Gold Radiance Serum' },
    { id: 'cream', name: 'Diamond Radiance Cream' },
    { id: 'mist', name: 'Midnight Recovery Oil' },
    { id: 'cleanser', name: 'Gentle Foaming Cleanser' },
    { id: 'moisturizer', name: 'Hydra Boost Moisturizer' },
    { id: 'sunscreen', name: 'Daily Defense SPF 50' },
  ],
  makeup: [
    { id: 'lipstick', name: 'Velvet Matte Lipstick' },
    { id: 'foundation', name: 'Glow Foundation' },
    { id: 'eyeshadow', name: 'Smoky Eye Palette' },
    { id: 'blush', name: 'Rosy Cheek Tint' },
    { id: 'mascara', name: 'Lengthening Mascara' },
    { id: 'highlighter', name: 'Moonlight Highlighter' },
  ],
  haircare: [
    { id: 'oil', name: 'Silk Hair Elixir' },
    { id: 'shampoo', name: 'Volumizing Shampoo' },
    { id: 'conditioner', name: 'Hydrating Conditioner' },
    { id: 'serum', name: 'Repair Hair Serum' },
    { id: 'mask', name: 'Deep Nourish Hair Mask' },
    { id: 'spray', name: 'Shine Hair Spray' },
  ],
  fragrance: [
    { id: 'mist', name: 'Rose Petal Mist' },
    { id: 'perfume', name: 'Midnight Oud Perfume' },
    { id: 'body-spray', name: 'Vanilla Dream Spray' },
    { id: 'deodorant', name: 'Fresh Citrus Deodorant' },
    { id: 'candle', name: 'Rose Gold Candle' },
    { id: 'gift-set', name: 'Luxury Gift Set' },
  ],
  'body-care': [
    { id: 'lotion', name: 'Luxe Body Lotion' },
    { id: 'scrub', name: 'Rose Sugar Scrub' },
    { id: 'butter', name: 'Shea Body Butter' },
    { id: 'oil', name: 'Relaxing Body Oil' },
    { id: 'soap', name: 'Artisan Soap Bar' },
    { id: 'cream', name: 'Hand Cream' },
  ],
};

function createSVG(productName, categoryId) {
  const cat = categoryGradients[categoryId] || categoryGradients.skincare;
  const nameParts = productName.split(' ');
  const shortName = nameParts.slice(0, 2).join(' ');
  
  // Create simple shape
  let shapeElement = '';
  if (cat.shape === 'circle') {
    shapeElement = `<circle cx="200" cy="200" r="80" fill="#FFFFFF" opacity="0.3"/>`;
  } else if (cat.shape === 'heart') {
    shapeElement = `<path d="M200 130 C170 130, 140 160, 140 200 C140 240, 180 270, 200 300 C220 270, 260 240, 260 200 C260 160, 230 130, 200 130 Z" fill="#FFFFFF" opacity="0.3"/>`;
  } else if (cat.shape === 'leaf') {
    shapeElement = `<path d="M200 120 C160 140, 140 200, 160 260 C180 320, 200 350, 220 320 C240 260, 220 200, 200 120 Z" fill="#FFFFFF" opacity="0.3"/>`;
  } else if (cat.shape === 'flower') {
    shapeElement = `<circle cx="200" cy="200" r="60" fill="#FFFFFF" opacity="0.3"/><circle cx="200" cy="200" r="30" fill="#FFFFFF"/><circle cx="200" cy="170" r="10"/><circle cx="200" cy="230" r="10"/><circle cx="170" cy="200" r="10"/><circle cx="230" cy="200" r="10"/>`;
  } else {
    shapeElement = `<path d="M160 200 Q200 120 240 200 Q200 280 160 200 Z" fill="#FFFFFF" opacity="0.3"/>`;
  }
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
    <defs>
      <linearGradient id="grad-${categoryId}" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${cat.from}" stop-opacity="1" />
        <stop offset="100%" stop-color="${cat.to}" stop-opacity="1" />
      </linearGradient>
    </defs>
    <rect width="400" height="500" fill="url(#grad-${categoryId})" rx="24"/>
    <g transform="translate(0,0)">
      ${shapeElement}
    </g>
    <text x="200" y="320" font-family="Georgia,serif" font-size="24" fill="#1B1B1B" text-anchor="middle">${shortName}</text>
    <text x="200" y="360" font-family="Arial,sans-serif" font-size="14" fill="#A87363" text-anchor="middle">Beauty_Pro</text>
  </svg>`;
}

// Create images for all categories
Object.entries(categoryProducts).forEach(([categoryId, products]) => {
  products.forEach((product, idx) => {
    const filename = `${categoryId}-${product.id}.svg`;
    const filepath = path.join(productsDir, filename);
    const svg = createSVG(product.name, categoryId);
    fs.writeFileSync(filepath, svg);
    console.log(`Created: /images/products/${filename}`);
  });
});

console.log('\nAll product images created successfully!');

