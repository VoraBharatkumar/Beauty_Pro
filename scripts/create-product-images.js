/**
 * Beauty_Pro - Product Images Generator
 * Creates premium, realistic SVG product illustrations for all products
 */

const fs = require('fs');
const path = require('path');

const productsDir = path.join(__dirname, '..', 'public', 'images', 'products');

// Ensure directory exists
if (!fs.existsSync(productsDir)) {
  fs.mkdirSync(productsDir, { recursive: true });
}

// Luxury color palettes by category
const categoryPalettes = {
  skincare: {
    primary: '#F5E6D3',
    secondary: '#E8D4C0',
    accent: '#C9A87C',
    dark: '#8B7355',
    gradient: ['#FDF8F3', '#F0E4D4'],
    bottle: '#F5F0EB',
    cap: '#C9A87C'
  },
  makeup: {
    primary: '#FCE4EC',
    secondary: '#F8BBD0',
    accent: '#D4A5A5',
    dark: '#8B6F6F',
    gradient: ['#FFF5F7', '#FCE4EC'],
    bottle: '#FFFFFF',
    cap: '#D4A5A5'
  },
  haircare: {
    primary: '#F5F0EB',
    secondary: '#E8DDD0',
    accent: '#B8956E',
    dark: '#6B5744',
    gradient: ['#FAF7F2', '#F0E6D8'],
    bottle: '#FAF7F2',
    cap: '#B8956E'
  },
  fragrance: {
    primary: '#FFF8F0',
    secondary: '#FFE8D0',
    accent: '#D4A574',
    dark: '#8B6914',
    gradient: ['#FFFDF7', '#FFF0E1'],
    bottle: '#FFF8F0',
    cap: '#D4A574'
  },
  'body-care': {
    primary: '#F8F4F0',
    secondary: '#E8DCD0',
    accent: '#C4A882',
    dark: '#7A6652',
    gradient: ['#FDFBF7', '#F5EDE3'],
    bottle: '#F8F4F0',
    cap: '#C4A882'
  }
};

// Complete product catalog with 54 products
const allProducts = [
  // SKINCARE (12 products)
  { id: 'skincare-serum', name: 'Rose Gold Radiance Serum', category: 'skincare', type: 'dropper-bottle' },
  { id: 'skincare-cream', name: 'Diamond Radiance Cream', category: 'skincare', type: 'jar' },
  { id: 'skincare-mist', name: 'Midnight Recovery Oil', category: 'skincare', type: 'dropper-bottle' },
  { id: 'skincare-cleanser', name: 'Gentle Foaming Cleanser', category: 'skincare', type: 'tube' },
  { id: 'skincare-moisturizer', name: 'Hydra Boost Moisturizer', category: 'skincare', type: 'jar' },
  { id: 'skincare-sunscreen', name: 'Daily Defense SPF 50', category: 'skincare', type: 'tube' },
  { id: 'skincare-vitamin-c', name: 'Vitamin C Brightening Serum', category: 'skincare', type: 'dropper-bottle' },
  { id: 'skincare-toner', name: 'Rose Petal Toner Mist', category: 'skincare', type: 'spray-bottle' },
  { id: 'skincare-eye-cream', name: 'Golden Eye Cream', category: 'skincare', type: 'jar-small' },
  { id: 'skincare-face-wash', name: 'Gentle Face Wash', category: 'skincare', type: 'tube' },
  { id: 'skincare-night-cream', name: 'Luxe Night Cream', category: 'skincare', type: 'jar' },
  { id: 'skincare-mask', name: 'Glow Sheet Mask Pack', category: 'skincare', type: 'packet' },
  
  // MAKEUP (12 products)
  { id: 'makeup-lipstick', name: 'Velvet Matte Lipstick', category: 'makeup', type: 'lipstick' },
  { id: 'makeup-foundation', name: 'Glow Foundation SPF 25', category: 'makeup', type: 'bottle' },
  { id: 'makeup-eyeshadow', name: 'Smoky Eye Palette', category: 'makeup', type: 'palette' },
  { id: 'makeup-blush', name: 'Rosy Cheek Tint', category: 'makeup', type: 'compact' },
  { id: 'makeup-mascara', name: 'Lengthening Mascara', category: 'makeup', type: 'tube-slender' },
  { id: 'makeup-highlighter', name: 'Moonlight Highlighter', category: 'makeup', type: 'compact' },
  { id: 'makeup-primer', name: 'Silk Priming Mist', category: 'makeup', type: 'spray-bottle' },
  { id: 'makeup-concealer', name: 'Full Coverage Concealer', category: 'makeup', type: 'tube-small' },
  { id: 'makeup-lip-gloss', name: 'Lip Gloss Shine', category: 'makeup', type: 'tube-slender' },
  { id: 'makeup-brow', name: 'Precision Brow Pencil', category: 'makeup', type: 'pencil' },
  { id: 'makeup-setting-spray', name: 'Makeup Setting Spray', category: 'makeup', type: 'spray-bottle' },
  { id: 'makeup-contour', name: 'Contour Stick', category: 'makeup', type: 'stick' },
  
  // HAIRCARE (10 products)
  { id: 'haircare-oil', name: 'Silk Hair Elixir', category: 'haircare', type: 'bottle' },
  { id: 'haircare-shampoo', name: 'Volumizing Shampoo', category: 'haircare', type: 'bottle' },
  { id: 'haircare-conditioner', name: 'Hydrating Conditioner', category: 'haircare', type: 'bottle' },
  { id: 'haircare-serum', name: 'Repair Hair Serum', category: 'haircare', type: 'dropper-bottle' },
  { id: 'haircare-mask', name: 'Deep Nourish Hair Mask', category: 'haircare', type: 'tube' },
  { id: 'haircare-spray', name: 'Shine Hair Spray', category: 'haircare', type: 'spray-bottle' },
  { id: 'haircare-leave-in', name: 'Leave-In Conditioner', category: 'haircare', type: 'spray-bottle' },
  { id: 'haircare-dry-shampoo', name: 'Dry Shampoo', category: 'haircare', type: 'spray-bottle' },
  { id: 'haircare-hair-cream', name: 'Smoothing Hair Cream', category: 'haircare', type: 'jar' },
  { id: 'haircare-scalp-treatment', name: 'Scalp Treatment Serum', category: 'haircare', type: 'dropper-bottle' },
  
  // FRAGRANCE (10 products)
  { id: 'fragrance-mist', name: 'Rose Petal Mist', category: 'fragrance', type: 'spray-bottle' },
  { id: 'fragrance-perfume', name: 'Midnight Oud Perfume', category: 'fragrance', type: 'perfume-bottle' },
  { id: 'fragrance-body-spray', name: 'Vanilla Dream Spray', category: 'fragrance', type: 'spray-bottle' },
  { id: 'fragrance-deodorant', name: 'Fresh Citrus Deodorant', category: 'fragrance', type: 'roll-on' },
  { id: 'fragrance-candle', name: 'Rose Gold Candle', category: 'fragrance', type: 'candle' },
  { id: 'fragrance-gift-set', name: 'Luxury Gift Set', category: 'fragrance', type: 'gift-box' },
  { id: 'fragrance-rose-perfume', name: 'Rose Intense EDP', category: 'fragrance', type: 'perfume-bottle' },
  { id: 'fragrance-oud-oil', name: 'Premium Oud Oil Roll-On', category: 'fragrance', type: 'roll-on' },
  { id: 'fragrance-lavender', name: 'Lavender Relax Mist', category: 'fragrance', type: 'spray-bottle' },
  { id: 'fragrance-jasmine', name: 'Jasmine Bloom Spray', category: 'fragrance', type: 'spray-bottle' },
  
  // BODY CARE (10 products)
  { id: 'body-care-lotion', name: 'Luxe Body Lotion', category: 'body-care', type: 'bottle' },
  { id: 'body-care-scrub', name: 'Rose Sugar Scrub', category: 'body-care', type: 'jar' },
  { id: 'body-care-butter', name: 'Shea Body Butter', category: 'body-care', type: 'jar' },
  { id: 'body-care-oil', name: 'Relaxing Body Oil', category: 'body-care', type: 'dropper-bottle' },
  { id: 'body-care-soap', name: 'Artisan Soap Bar', category: 'body-care', type: 'bar-soap' },
  { id: 'body-care-cream', name: 'Hand Cream', category: 'body-care', type: 'tube-small' },
  { id: 'body-care-shower-gel', name: 'Luxe Shower Gel', category: 'body-care', type: 'bottle' },
  { id: 'body-care-bath-bomb', name: 'Rose Bath Bomb Set', category: 'body-care', type: 'bath-bomb' },
  { id: 'body-care-foot-cream', name: 'Cooling Foot Cream', category: 'body-care', type: 'tube' },
  { id: 'body-care-massage-oil', name: 'Relaxing Massage Oil', category: 'body-care', type: 'bottle' }
];

function createProductSVG(product) {
  const palette = categoryPalettes[product.category] || categoryPalettes.skincare;
  const p = product;
  
  // Professional studio background
  const bgGradient = `<linearGradient id="bg-${p.id}" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stop-color="#FAFAFA" />
    <stop offset="50%" stop-color="#F5F5F5" />
    <stop offset="100%" stop-color="#EBEBEB" />
  </linearGradient>`;
  
  // Realistic bottle/container gradients with lighting
  const bottleGradient = `<linearGradient id="bottle-${p.id}" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="${palette.bottle}" />
    <stop offset="15%" stop-color="#FFFFFF" />
    <stop offset="30%" stop-color="${palette.bottle}" />
    <stop offset="70%" stop-color="${adjustColor(palette.bottle, -10)}" />
    <stop offset="100%" stop-color="${adjustColor(palette.bottle, -20)}" />
  </linearGradient>`;
  
  // Metallic cap gradient
  const capGradient = `<linearGradient id="cap-${p.id}" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="${adjustColor(palette.cap, -30)}" />
    <stop offset="25%" stop-color="${adjustColor(palette.cap, 15)}" />
    <stop offset="50%" stop-color="${adjustColor(palette.cap, 30)}" />
    <stop offset="75%" stop-color="${adjustColor(palette.cap, 15)}" />
    <stop offset="100%" stop-color="${adjustColor(palette.cap, -30)}" />
  </linearGradient>`;
  
  // Reflection gradient for glass effects
  const reflectionGradient = `<linearGradient id="reflection-${p.id}" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0"/>
    <stop offset="40%" stop-color="#FFFFFF" stop-opacity="0.3"/>
    <stop offset="60%" stop-color="#FFFFFF" stop-opacity="0.3"/>
    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
  </linearGradient>`;

  let productShape = '';
  let details = '';
  
  // Generate different product shapes based on type
  switch(p.type) {
    case 'dropper-bottle':
      productShape = `
        <!-- Bottle body with glass effect -->
        <rect x="145" y="160" width="110" height="180" rx="20" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Liquid inside -->
        <rect x="150" y="220" width="100" height="115" rx="15" fill="${palette.accent}" opacity="0.2"/>
        <!-- Bottle neck -->
        <rect x="175" y="130" width="50" height="40" rx="5" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Dropper -->
        <rect x="195" y="90" width="10" height="50" rx="5" fill="${palette.dark}" opacity="0.4"/>
        <circle cx="200" cy="85" r="8" fill="${palette.dark}" opacity="0.5"/>
        <!-- Cap with metallic finish -->
        <rect x="180" y="110" width="40" height="25" rx="8" fill="url(#cap-${p.id})"/>
        <!-- Label -->
        <rect x="155" y="200" width="90" height="100" rx="10" fill="#FFFFFF" opacity="0.95"/>
        <rect x="160" y="210" width="80" height="1" fill="${palette.accent}" opacity="0.4"/>
        <rect x="160" y="285" width="80" height="1" fill="${palette.accent}" opacity="0.4"/>
        <!-- Glass reflection -->
        <rect x="150" y="170" width="20" height="160" rx="10" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="255" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="275" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'jar':
      productShape = `
        <!-- Jar body with glass effect -->
        <rect x="135" y="170" width="130" height="140" rx="15" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Product inside visible through glass -->
        <rect x="140" y="200" width="120" height="105" rx="10" fill="${palette.accent}" opacity="0.25"/>
        <!-- Jar lid with metallic finish -->
        <rect x="140" y="140" width="120" height="35" rx="10" fill="url(#cap-${p.id})"/>
        <!-- Label -->
        <rect x="145" y="195" width="110" height="90" rx="8" fill="#FFFFFF" opacity="0.95"/>
        <rect x="150" y="205" width="100" height="1" fill="${palette.accent}" opacity="0.4"/>
        <rect x="150" y="270" width="100" height="1" fill="${palette.accent}" opacity="0.4"/>
        <!-- Glass reflection -->
        <rect x="145" y="180" width="25" height="120" rx="12" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="245" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="265" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'bottle':
      productShape = `
        <!-- Bottle body with glass effect -->
        <rect x="140" y="150" width="120" height="200" rx="15" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Liquid inside -->
        <rect x="145" y="220" width="110" height="125" rx="10" fill="${palette.accent}" opacity="0.2"/>
        <!-- Bottle neck -->
        <rect x="180" y="120" width="40" height="35" rx="5" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Cap with metallic finish -->
        <rect x="175" y="100" width="50" height="25" rx="8" fill="url(#cap-${p.id})"/>
        <!-- Label -->
        <rect x="150" y="200" width="100" height="120" rx="10" fill="#FFFFFF" opacity="0.95"/>
        <rect x="155" y="210" width="90" height="1" fill="${palette.accent}" opacity="0.4"/>
        <rect x="155" y="305" width="90" height="1" fill="${palette.accent}" opacity="0.4"/>
        <!-- Glass reflection -->
        <rect x="150" y="160" width="25" height="180" rx="12" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="260" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="285" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'tube':
      productShape = `
        <!-- Tube body with squeeze effect -->
        <rect x="150" y="180" width="100" height="150" rx="10" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Tube cap with metallic finish -->
        <rect x="185" y="150" width="30" height="35" rx="5" fill="url(#cap-${p.id})"/>
        <!-- Label -->
        <rect x="155" y="200" width="90" height="110" rx="5" fill="#FFFFFF" opacity="0.95"/>
        <rect x="160" y="210" width="80" height="1" fill="${palette.accent}" opacity="0.4"/>
        <rect x="160" y="295" width="80" height="1" fill="${palette.accent}" opacity="0.4"/>
        <!-- Tube highlight -->
        <rect x="155" y="185" width="15" height="140" rx="7" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="255" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="275" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'lipstick':
      productShape = `
        <!-- Lipstick tube with metallic finish -->
        <rect x="175" y="180" width="50" height="140" rx="8" fill="url(#cap-${p.id})"/>
        <!-- Lipstick bullet with gradient -->
        <path d="M180 180 L200 120 L220 180 Z" fill="${palette.accent}"/>
        <path d="M185 180 L200 135 L215 180 Z" fill="${adjustColor(palette.accent, 30)}" opacity="0.6"/>
        <rect x="195" y="100" width="10" height="25" rx="5" fill="${palette.dark}"/>
        <!-- Cap bottom -->
        <rect x="175" y="300" width="50" height="20" rx="5" fill="${palette.dark}" opacity="0.2"/>
        <!-- Tube highlight -->
        <rect x="180" y="185" width="8" height="130" rx="4" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="260" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="280" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'palette':
      productShape = `
        <!-- Palette case with premium finish -->
        <rect x="140" y="160" width="120" height="100" rx="10" fill="url(#cap-${p.id})" stroke="${palette.accent}" stroke-width="1"/>
        <!-- Palette lid -->
        <rect x="140" y="160" width="120" height="100" rx="10" fill="url(#bottle-${p.id})" opacity="0.9"/>
        <!-- Mirror with reflection -->
        <rect x="150" y="170" width="100" height="80" rx="5" fill="#E8E8E8" opacity="0.6"/>
        <rect x="150" y="170" width="100" height="40" rx="5" fill="#FFFFFF" opacity="0.3"/>
        <!-- Eyeshadow pans with realistic colors -->
        <circle cx="175" cy="220" r="15" fill="${palette.accent}" opacity="0.8"/>
        <circle cx="175" cy="220" r="12" fill="${adjustColor(palette.accent, 20)}" opacity="0.4"/>
        <circle cx="215" cy="220" r="15" fill="${palette.dark}" opacity="0.7"/>
        <circle cx="195" cy="245" r="12" fill="${palette.secondary}" opacity="0.8"/>
        <!-- Case highlight -->
        <rect x="145" y="165" width="30" height="90" rx="5" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="290" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="310" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'compact':
      productShape = `
        <!-- Compact case with premium metallic finish -->
        <circle cx="200" cy="230" r="60" fill="url(#cap-${p.id})" stroke="${palette.accent}" stroke-width="1"/>
        <!-- Mirror with reflection -->
        <circle cx="200" cy="230" r="50" fill="#F0F0F0" opacity="0.7"/>
        <ellipse cx="190" cy="220" rx="25" ry="15" fill="#FFFFFF" opacity="0.4"/>
        <!-- Product inside with gradient -->
        <circle cx="200" cy="230" r="35" fill="${palette.accent}" opacity="0.8"/>
        <circle cx="200" cy="230" r="28" fill="${adjustColor(palette.accent, 15)}" opacity="0.5"/>
        <!-- Case highlight -->
        <circle cx="180" cy="210" r="20" fill="url(#reflection-${p.id})" opacity="0.3"/>
      `;
      details = `
        <text x="200" y="320" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="340" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'spray-bottle':
      productShape = `
        <!-- Bottle body with glass effect -->
        <rect x="160" y="160" width="80" height="180" rx="15" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Liquid inside -->
        <rect x="165" y="230" width="70" height="105" rx="10" fill="${palette.accent}" opacity="0.2"/>
        <!-- Spray nozzle -->
        <rect x="185" y="120" width="30" height="45" rx="5" fill="${palette.dark}" opacity="0.3"/>
        <rect x="195" y="100" width="10" height="25" rx="5" fill="${palette.dark}"/>
        <!-- Cap with metallic finish -->
        <rect x="185" y="90" width="30" height="15" rx="5" fill="url(#cap-${p.id})"/>
        <!-- Label -->
        <rect x="165" y="200" width="70" height="110" rx="8" fill="#FFFFFF" opacity="0.95"/>
        <rect x="170" y="210" width="60" height="1" fill="${palette.accent}" opacity="0.4"/>
        <rect x="170" y="295" width="60" height="1" fill="${palette.accent}" opacity="0.4"/>
        <!-- Glass reflection -->
        <rect x="165" y="170" width="18" height="160" rx="9" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="255" font-family="Georgia,serif" font-size="11" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="275" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'perfume-bottle':
      productShape = `
        <!-- Bottle body - elegant shape with glass effect -->
        <path d="M160 280 L160 180 Q160 160 180 160 L220 160 Q240 160 240 180 L240 280 Q240 300 220 300 L180 300 Q160 300 160 280 Z" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Liquid inside with gradient -->
        <path d="M165 250 L165 185 Q165 170 180 170 L220 170 Q235 170 235 185 L235 250 Q235 265 220 265 L180 265 Q165 265 165 250 Z" fill="${palette.accent}" opacity="0.3"/>
        <!-- Bottle neck -->
        <rect x="190" y="120" width="20" height="45" rx="3" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Cap with metallic finish -->
        <rect x="185" y="100" width="30" height="25" rx="5" fill="url(#cap-${p.id})"/>
        <!-- Glass reflection -->
        <path d="M170 180 L170 250 Q170 260 180 260 L180 180 Q180 170 170 180 Z" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="230" font-family="Georgia,serif" font-size="11" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="280" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'candle':
      productShape = `
        <!-- Candle jar with glass effect -->
        <rect x="155" y="180" width="90" height="120" rx="10" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Candle wax with texture -->
        <rect x="160" y="200" width="80" height="80" rx="5" fill="${palette.gradient[0]}"/>
        <rect x="160" y="200" width="80" height="20" rx="5" fill="${palette.accent}" opacity="0.1"/>
        <!-- Wick -->
        <rect x="197" y="190" width="6" height="15" fill="${palette.dark}"/>
        <!-- Flame with glow -->
        <ellipse cx="200" cy="185" rx="12" ry="16" fill="#FFA500" opacity="0.3"/>
        <ellipse cx="200" cy="185" rx="8" ry="12" fill="#FFA500" opacity="0.8"/>
        <ellipse cx="200" cy="183" rx="5" ry="8" fill="#FFD700"/>
        <!-- Lid with metallic finish -->
        <rect x="150" y="170" width="100" height="15" rx="5" fill="url(#cap-${p.id})"/>
        <!-- Glass reflection -->
        <rect x="160" y="185" width="20" height="110" rx="10" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="265" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="285" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'gift-box':
      productShape = `
        <!-- Gift box with premium finish -->
        <rect x="150" y="190" width="100" height="90" rx="5" fill="url(#cap-${p.id})" stroke="${palette.accent}" stroke-width="1"/>
        <!-- Box lid -->
        <rect x="145" y="180" width="110" height="15" rx="3" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Ribbon vertical with shine -->
        <rect x="195" y="185" width="10" height="95" fill="${palette.accent}"/>
        <rect x="196" y="185" width="3" height="95" fill="${adjustColor(palette.accent, 30)}" opacity="0.6"/>
        <!-- Ribbon horizontal with shine -->
        <rect x="150" y="225" width="100" height="10" fill="${palette.accent}"/>
        <rect x="150" y="226" width="100" height="3" fill="${adjustColor(palette.accent, 30)}" opacity="0.6"/>
        <!-- Bow with 3D effect -->
        <circle cx="200" cy="180" r="10" fill="${palette.accent}"/>
        <circle cx="185" cy="175" r="8" fill="${palette.accent}" opacity="0.9"/>
        <circle cx="215" cy="175" r="8" fill="${palette.accent}" opacity="0.9"/>
        <circle cx="200" cy="178" r="4" fill="${adjustColor(palette.accent, 20)}"/>
        <!-- Box highlight -->
        <rect x="155" y="195" width="30" height="80" rx="3" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="310" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="330" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'roll-on':
      productShape = `
        <!-- Roll-on bottle with glass effect -->
        <rect x="175" y="180" width="50" height="130" rx="25" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Liquid inside -->
        <rect x="180" y="230" width="40" height="75" rx="20" fill="${palette.accent}" opacity="0.2"/>
        <!-- Roller ball with metallic finish -->
        <circle cx="200" cy="165" r="12" fill="${palette.dark}" opacity="0.4"/>
        <circle cx="200" cy="165" r="8" fill="${palette.cap}" opacity="0.7"/>
        <circle cx="198" cy="163" r="3" fill="#FFFFFF" opacity="0.5"/>
        <!-- Cap with metallic finish -->
        <rect x="180" y="140" width="40" height="30" rx="8" fill="url(#cap-${p.id})"/>
        <!-- Glass reflection -->
        <rect x="178" y="185" width="12" height="120" rx="6" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="250" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="270" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'bar-soap':
      productShape = `
        <!-- Soap bar with premium texture -->
        <rect x="160" y="200" width="80" height="100" rx="15" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Soap texture and depth -->
        <circle cx="180" cy="230" r="3" fill="${palette.accent}" opacity="0.5"/>
        <circle cx="220" cy="250" r="3" fill="${palette.accent}" opacity="0.5"/>
        <circle cx="200" cy="270" r="3" fill="${palette.accent}" opacity="0.5"/>
        <circle cx="190" cy="290" r="3" fill="${palette.accent}" opacity="0.5"/>
        <!-- Soap highlight -->
        <rect x="165" y="205" width="20" height="90" rx="10" fill="url(#reflection-${p.id})"/>
        <!-- Label -->
        <rect x="165" y="220" width="70" height="60" rx="5" fill="#FFFFFF" opacity="0.95"/>
      `;
      details = `
        <text x="200" y="255" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="275" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'bath-bomb':
      productShape = `
        <!-- Bath bomb with premium spherical shape -->
        <circle cx="200" cy="240" r="55" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="1"/>
        <!-- 3D sphere effect -->
        <circle cx="185" cy="225" r="20" fill="${adjustColor(palette.bottle, 10)}" opacity="0.5"/>
        <!-- Texture/sparkle -->
        <circle cx="180" cy="220" r="4" fill="${palette.accent}" opacity="0.7"/>
        <circle cx="220" cy="240" r="4" fill="${palette.accent}" opacity="0.7"/>
        <circle cx="190" cy="260" r="4" fill="${palette.accent}" opacity="0.7"/>
        <circle cx="210" cy="230" r="3" fill="${palette.accent}" opacity="0.6"/>
        <circle cx="200" cy="250" r="2" fill="${palette.accent}" opacity="0.5"/>
        <!-- Label -->
        <rect x="165" y="255" width="70" height="40" rx="5" fill="#FFFFFF" opacity="0.95"/>
      `;
      details = `
        <text x="200" y="275" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="330" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'stick':
      productShape = `
        <!-- Contour stick with premium finish -->
        <rect x="180" y="160" width="40" height="150" rx="20" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Product tip with gradient -->
        <path d="M185 160 L200 120 L215 160 Z" fill="${palette.accent}"/>
        <path d="M190 160 L200 135 L210 160 Z" fill="${adjustColor(palette.accent, 20)}" opacity="0.5"/>
        <!-- Cap bottom -->
        <rect x="180" y="290" width="40" height="15" rx="5" fill="${palette.dark}" opacity="0.2"/>
        <!-- Stick highlight -->
        <rect x="183" y="165" width="8" height="140" rx="4" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="240" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="260" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'pencil':
      productShape = `
        <!-- Brow pencil with premium finish -->
        <rect x="190" y="140" width="20" height="180" rx="3" fill="${palette.bottle}" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Pencil tip with sharpened effect -->
        <path d="M192 140 L200 110 L208 140 Z" fill="${palette.dark}"/>
        <path d="M194 140 L200 120 L206 140 Z" fill="${adjustColor(palette.dark, 20)}" opacity="0.5"/>
        <!-- Cap with metallic finish -->
        <rect x="188" y="105" width="24" height="15" rx="3" fill="url(#cap-${p.id})"/>
        <!-- Pencil highlight -->
        <rect x="193" y="145" width="4" height="170" rx="2" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="250" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="270" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'tube-small':
      productShape = `
        <!-- Small tube with squeeze effect -->
        <rect x="180" y="190" width="40" height="110" rx="8" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Cap with metallic finish -->
        <rect x="185" y="170" width="30" height="25" rx="5" fill="url(#cap-${p.id})"/>
        <!-- Label -->
        <rect x="183" y="210" width="34" height="70" rx="3" fill="#FFFFFF" opacity="0.95"/>
        <!-- Tube highlight -->
        <rect x="182" y="195" width="10" height="100" rx="5" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="250" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="270" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'tube-slender':
      productShape = `
        <!-- Slender tube with premium finish -->
        <rect x="185" y="180" width="30" height="140" rx="8" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Cap with metallic finish -->
        <rect x="188" y="160" width="24" height="25" rx="5" fill="url(#cap-${p.id})"/>
        <!-- Label -->
        <rect x="187" y="200" width="26" height="100" rx="3" fill="#FFFFFF" opacity="0.95"/>
        <!-- Tube highlight -->
        <rect x="186" y="185" width="8" height="130" rx="4" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="255" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="275" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'jar-small':
      productShape = `
        <!-- Small jar with glass effect -->
        <rect x="160" y="190" width="80" height="100" rx="12" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Product inside visible -->
        <rect x="165" y="220" width="70" height="65" rx="8" fill="${palette.accent}" opacity="0.2"/>
        <!-- Lid with metallic finish -->
        <rect x="165" y="170" width="70" height="25" rx="8" fill="url(#cap-${p.id})"/>
        <!-- Label -->
        <rect x="165" y="205" width="70" height="70" rx="6" fill="#FFFFFF" opacity="0.95"/>
        <!-- Glass reflection -->
        <rect x="163" y="195" width="18" height="90" rx="9" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="245" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="265" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    case 'packet':
      productShape = `
        <!-- Sheet mask packet with premium finish -->
        <rect x="150" y="200" width="100" height="130" rx="10" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <!-- Mask inside visible through window -->
        <rect x="160" y="210" width="80" height="100" rx="5" fill="#FFFFFF" opacity="0.9"/>
        <!-- Mask texture and pattern -->
        <circle cx="180" cy="240" r="10" fill="${palette.accent}" opacity="0.3"/>
        <circle cx="220" cy="270" r="10" fill="${palette.accent}" opacity="0.3"/>
        <circle cx="200" cy="290" r="10" fill="${palette.accent}" opacity="0.3"/>
        <!-- Packet highlight -->
        <rect x="155" y="205" width="25" height="120" rx="5" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="255" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="275" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
      break;
      
    default:
      productShape = `
        <!-- Default bottle with premium finish -->
        <rect x="160" y="160" width="80" height="180" rx="15" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <rect x="180" y="120" width="40" height="45" rx="5" fill="url(#bottle-${p.id})" stroke="${palette.accent}" stroke-width="0.5"/>
        <rect x="175" y="100" width="50" height="25" rx="8" fill="url(#cap-${p.id})"/>
        <rect x="165" y="200" width="70" height="110" rx="8" fill="#FFFFFF" opacity="0.95"/>
        <!-- Glass reflection -->
        <rect x="165" y="170" width="18" height="160" rx="9" fill="url(#reflection-${p.id})"/>
      `;
      details = `
        <text x="200" y="255" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" font-weight="600">${p.name.split(' ').slice(0,2).join(' ')}</text>
        <text x="200" y="275" font-family="Arial,sans-serif" font-size="9" fill="${palette.accent}" text-anchor="middle">Beauty_Pro</text>
      `;
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
    <defs>
      ${bgGradient}
      ${bottleGradient}
      ${capGradient}
      ${reflectionGradient}
      <filter id="shadow-${p.id}" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.15"/>
      </filter>
      <radialGradient id="light-${p.id}" cx="30%" cy="30%" r="70%">
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.4"/>
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <!-- Background -->
    <rect width="400" height="500" fill="url(#bg-${p.id})" rx="24"/>
    
    <!-- Subtle decorative elements -->
    <circle cx="80" cy="80" r="40" fill="${palette.accent}" opacity="0.05"/>
    <circle cx="340" cy="420" r="50" fill="${palette.accent}" opacity="0.05"/>
    
    <!-- Product with realistic shadow -->
    <g filter="url(#shadow-${p.id})">
      ${productShape}
    </g>
    
    <!-- Professional lighting overlay -->
    <rect width="400" height="500" fill="url(#light-${p.id})" rx="24"/>
    
    <!-- Product details/label text -->
    ${details}
    
    <!-- Subtle brand signature -->
    <text x="200" y="420" font-family="Georgia,serif" font-size="12" fill="${palette.dark}" text-anchor="middle" opacity="0.3" font-weight="300">Beauty_Pro</text>
  </svg>`;
}

function adjustColor(hex, percent) {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, (num >> 16) + amt);
  const G = Math.min(255, ((num >> 8) & 0x00FF) + amt);
  const B = Math.min(255, (num & 0x0000FF) + amt);
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

// Create images for all products
console.log('Generating premium product images...\n');
allProducts.forEach((product) => {
  const filename = `${product.id}.svg`;
  const filepath = path.join(productsDir, filename);
  const svg = createProductSVG(product);
  fs.writeFileSync(filepath, svg);
  console.log(`✓ Created: /images/products/${filename}`);
});

console.log(`\n✨ Successfully generated ${allProducts.length} unique product images!`);