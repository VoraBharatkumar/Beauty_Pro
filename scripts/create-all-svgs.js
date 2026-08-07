const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'public', 'images', 'products');

const products = [
  // Skincare (6 existing + 6 new = 12)
  { file: 'skincare-serum.svg', label: 'GOLD SERUM', sub: 'RADIANCE' },
  { file: 'skincare-cream.svg', label: 'DIAMOND', sub: 'CREAM' },
  { file: 'skincare-mist.svg', label: 'RECOVERY', sub: 'OIL' },
  { file: 'skincare-cleanser.svg', label: 'FOAMING', sub: 'CLEANSER' },
  { file: 'skincare-moisturizer.svg', label: 'HYDRA', sub: 'BOOST' },
  { file: 'skincare-sunscreen.svg', label: 'SPF 50', sub: 'DEFENSE' },
  { file: 'skincare-vitamin-c.svg', label: 'VITAMIN C', sub: 'SERUM' },
  { file: 'skincare-toner.svg', label: 'ROSE', sub: 'TONER' },
  { file: 'skincare-eye-cream.svg', label: 'EYE', sub: 'CREAM' },
  { file: 'skincare-face-wash.svg', label: 'FACE', sub: 'WASH' },
  { file: 'skincare-night-cream.svg', label: 'NIGHT', sub: 'CREAM' },
  { file: 'skincare-mask.svg', label: 'SHEET', sub: 'MASK' },
  // Makeup (6 existing + 6 new = 12)
  { file: 'makeup-lipstick.svg', label: 'MATTE', sub: 'LIPSTICK' },
  { file: 'makeup-foundation.svg', label: 'GLOW', sub: 'FOUNDATION' },
  { file: 'makeup-eyeshadow.svg', label: 'SMOKY', sub: 'PALETTE' },
  { file: 'makeup-blush.svg', label: 'CHEEK', sub: 'TINT' },
  { file: 'makeup-mascara.svg', label: 'LENGTHEN', sub: 'MASCARA' },
  { file: 'makeup-highlighter.svg', label: 'MOONLIGHT', sub: 'GLOW' },
  { file: 'makeup-primer.svg', label: 'SILK', sub: 'PRIMER' },
  { file: 'makeup-concealer.svg', label: 'FULL', sub: 'COVER' },
  { file: 'makeup-lip-gloss.svg', label: 'LIP', sub: 'GLOSS' },
  { file: 'makeup-brow.svg', label: 'BROW', sub: 'PENCIL' },
  { file: 'makeup-setting-spray.svg', label: 'SETTING', sub: 'SPRAY' },
  { file: 'makeup-contour.svg', label: 'CONTOUR', sub: 'STICK' },
  // Haircare (6 existing + 6 new = 12)
  { file: 'haircare-oil.svg', label: 'HAIR', sub: 'ELIXIR' },
  { file: 'haircare-shampoo.svg', label: 'VOLUME', sub: 'SHAMPOO' },
  { file: 'haircare-conditioner.svg', label: 'HYDRA', sub: 'CONDITIONER' },
  { file: 'haircare-serum.svg', label: 'REPAIR', sub: 'SERUM' },
  { file: 'haircare-mask.svg', label: 'DEEP', sub: 'MASK' },
  { file: 'haircare-spray.svg', label: 'SHINE', sub: 'SPRAY' },
  { file: 'haircare-leave-in.svg', label: 'LEAVE IN', sub: 'CONDITIONER' },
  { file: 'haircare-dry-shampoo.svg', label: 'DRY', sub: 'SHAMPOO' },
  { file: 'haircare-hair-cream.svg', label: 'HAIR', sub: 'CREAM' },
  { file: 'haircare-scalp-treatment.svg', label: 'SCALP', sub: 'CARE' },
  // Fragrance (6 existing + 6 new = 12)
  { file: 'fragrance-mist.svg', label: 'ROSE', sub: 'MIST' },
  { file: 'fragrance-perfume.svg', label: 'MIDNIGHT', sub: 'OUD' },
  { file: 'fragrance-body-spray.svg', label: 'VANILLA', sub: 'DREAM' },
  { file: 'fragrance-deodorant.svg', label: 'CITRUS', sub: 'DEO' },
  { file: 'fragrance-candle.svg', label: 'ROSE GOLD', sub: 'CANDLE' },
  { file: 'fragrance-gift-set.svg', label: 'LUXURY', sub: 'GIFT SET' },
  { file: 'fragrance-rose-perfume.svg', label: 'ROSE', sub: 'EDP' },
  { file: 'fragrance-oud-oil.svg', label: 'OUD', sub: 'OIL' },
  { file: 'fragrance-lavender.svg', label: 'LAVENDER', sub: 'MIST' },
  { file: 'fragrance-jasmine.svg', label: 'JASMINE', sub: 'SPRAY' },
  { file: 'fragrance-home-spray.svg', label: 'HOME', sub: 'SPRAY' },
  { file: 'fragrance-solid-perfume.svg', label: 'SOLID', sub: 'PERFUME' },
  // Body Care (6 existing + 6 new = 12)
  { file: 'body-care-lotion.svg', label: 'BODY', sub: 'LOTION' },
  { file: 'body-care-scrub.svg', label: 'SUGAR', sub: 'SCRUB' },
  { file: 'body-care-butter.svg', label: 'SHEA', sub: 'BUTTER' },
  { file: 'body-care-oil.svg', label: 'BODY', sub: 'OIL' },
  { file: 'body-care-soap.svg', label: 'ARTISAN', sub: 'SOAP' },
  { file: 'body-care-cream.svg', label: 'HAND', sub: 'CREAM' },
  { file: 'body-care-shower-gel.svg', label: 'SHOWER', sub: 'GEL' },
  { file: 'body-care-bath-bomb.svg', label: 'BATH', sub: 'BOMB' },
  { file: 'body-care-foot-cream.svg', label: 'FOOT', sub: 'CREAM' },
  { file: 'body-care-massage-oil.svg', label: 'MASSAGE', sub: 'OIL' },
  { file: 'body-care-deodorant.svg', label: 'NATURAL', sub: 'DEO' },
  { file: 'body-care-sunscreen.svg', label: 'BODY', sub: 'SPF' },
];

products.forEach(p => {
  const filePath = path.join(dir, p.file);
  if (!fs.existsSync(filePath)) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" fill="none">
  <rect width="400" height="500" fill="#FAF8F6" rx="20"/>
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="400" y2="500">
      <stop offset="0%" stop-color="#FDF2F0"/>
      <stop offset="100%" stop-color="#FAF8F6"/>
    </linearGradient>
  </defs>
  <rect width="400" height="500" fill="url(#bg)" rx="20"/>
  <rect x="145" y="120" width="110" height="250" rx="20" fill="#D9B29C" opacity="0.9"/>
  <rect x="155" y="130" width="90" height="230" rx="15" fill="#FAF8F6" opacity="0.3"/>
  <rect x="160" y="85" width="80" height="40" rx="10" fill="#C49A82"/>
  <rect x="170" y="200" width="60" height="80" rx="5" fill="white" opacity="0.8"/>
  <text x="200" y="235" text-anchor="middle" fill="#C49A82" font-size="8" font-family="serif">${p.label}</text>
  <text x="200" y="250" text-anchor="middle" fill="#C49A82" font-size="7" font-family="serif">${p.sub}</text>
  <text x="80" y="300" font-size="60" opacity="0.08">✨</text>
  <text x="280" y="150" font-size="40" opacity="0.06">✨</text>
</svg>`;
    fs.writeFileSync(filePath, svg);
    console.log('Created:', p.file);
  } else {
    console.log('Exists:', p.file);
  }
});
console.log('Done! All SVGs created.');

