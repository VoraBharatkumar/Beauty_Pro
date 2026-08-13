const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// ============================================
// Beauty_Pro - Lotus Flower Favicon Generator
// No letters - pure beauty iconography
// ============================================

// Brand Colors
const CREAM = '#FAF8F6';
const ROSE_GOLD = '#D4A0A0';
const GOLD = '#C9A96E';
const DARK = '#1A1A1A';
const SOFT_BROWN = '#B8A395';

// Beautiful Lotus Flower SVG (scalable, responsive)
function createLotusSVG(size) {
  const scale = size / 192;
  const s = (v) => (v * scale).toFixed(1);

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 192 192">
  <defs>
    <linearGradient id="petalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#E8C4C4"/>
      <stop offset="50%" stop-color="${ROSE_GOLD}"/>
      <stop offset="100%" stop-color="#C48E8E"/>
    </linearGradient>
    <linearGradient id="petalGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${GOLD}"/>
      <stop offset="100%" stop-color="#B8955A"/>
    </linearGradient>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDFBF9"/>
      <stop offset="100%" stop-color="#F5F0EB"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="45%" r="50%">
      <stop offset="0%" stop-color="rgba(212,160,160,0.35)"/>
      <stop offset="100%" stop-color="rgba(212,160,160,0)"/>
    </radialGradient>
  </defs>

  <!-- Rounded background -->
  <rect width="192" height="192" rx="40" fill="url(#bgGrad)"/>
  <rect width="192" height="192" rx="40" fill="url(#glow)"/>

  <!-- Outer petals (5 petals) -->
  <g transform="translate(96,96)">
    <!-- Petal 1 - top -->
    <path d="M0,-78 C18,-70 26,-48 22,-28 C18,-12 8,-4 0,0 C-8,-4 -18,-12 -22,-28 C-26,-48 -18,-70 0,-78Z" fill="url(#petalGrad)" opacity="0.9"/>
    <!-- Petal 2 - right -->
    <path d="M78,0 C70,18 48,26 28,22 C12,18 4,8 0,0 C4,-8 12,-18 28,-22 C48,-26 70,-18 78,0Z" fill="url(#petalGrad)" opacity="0.9" transform="rotate(72)"/>
    <!-- Petal 3 -->
    <path d="M0,-78 C18,-70 26,-48 22,-28 C18,-12 8,-4 0,0 C-8,-4 -18,-12 -22,-28 C-26,-48 -18,-70 0,-78Z" fill="url(#petalGrad)" opacity="0.9" transform="rotate(144)"/>
    <!-- Petal 4 -->
    <path d="M0,-78 C18,-70 26,-48 22,-28 C18,-12 8,-4 0,0 C-8,-4 -18,-12 -22,-28 C-26,-48 -18,-70 0,-78Z" fill="url(#petalGrad)" opacity="0.9" transform="rotate(216)"/>
    <!-- Petal 5 -->
    <path d="M0,-78 C18,-70 26,-48 22,-28 C18,-12 8,-4 0,0 C-8,-4 -18,-12 -22,-28 C-26,-48 -18,-70 0,-78Z" fill="url(#petalGrad)" opacity="0.9" transform="rotate(288)"/>

    <!-- Inner petals (5 petals, gold) -->
    <path d="M0,-52 C12,-46 18,-32 15,-18 C12,-8 5,-2 0,0 C-5,-2 -12,-8 -15,-18 C-18,-32 -12,-46 0,-52Z" fill="url(#petalGrad2)" transform="rotate(36)"/>
    <path d="M0,-52 C12,-46 18,-32 15,-18 C12,-8 5,-2 0,0 C-5,-2 -12,-8 -15,-18 C-18,-32 -12,-46 0,-52Z" fill="url(#petalGrad2)" transform="rotate(108)"/>
    <path d="M0,-52 C12,-46 18,-32 15,-18 C12,-8 5,-2 0,0 C-5,-2 -12,-8 -15,-18 C-18,-32 -12,-46 0,-52Z" fill="url(#petalGrad2)" transform="rotate(180)"/>
    <path d="M0,-52 C12,-46 18,-32 15,-18 C12,-8 5,-2 0,0 C-5,-2 -12,-8 -15,-18 C-18,-32 -12,-46 0,-52Z" fill="url(#petalGrad2)" transform="rotate(252)"/>
    <path d="M0,-52 C12,-46 18,-32 15,-18 C12,-8 5,-2 0,0 C-5,-2 -12,-8 -15,-18 C-18,-32 -12,-46 0,-52Z" fill="url(#petalGrad2)" transform="rotate(324)"/>

    <!-- Center -->
    <circle cx="0" cy="0" r="14" fill="${GOLD}"/>
    <circle cx="0" cy="0" r="8" fill="${ROSE_GOLD}"/>
    <circle cx="0" cy="0" r="4" fill="#FDFBF9"/>
  </g>

  <!-- Sparkle accents -->
  <g fill="${GOLD}" opacity="0.8">
    <path d="M148,38 L150,44 L156,46 L150,48 L148,54 L146,48 L140,46 L146,44 Z"/>
    <path d="M42,52 L43.5,56 L48,57.5 L43.5,59 L42,63 L40.5,59 L36,57.5 L40.5,56 Z" opacity="0.6"/>
    <path d="M152,132 L153.5,136 L158,137.5 L153.5,139 L152,143 L150.5,139 L146,137.5 L150.5,136 Z" opacity="0.5"/>
  </g>
</svg>`;
}

// Generate SVG icons
const sizes = [192, 384, 512];
sizes.forEach((size) => {
  const svg = createLotusSVG(size);
  fs.writeFileSync(path.join('public', 'icons', `icon-${size}.svg`), svg);
  console.log(`Created icon-${size}.svg`);
});

// Generate PNG favicon (32x32) using sharp
async function generatePNGs() {
  const svgBuffer = Buffer.from(createLotusSVG(192));

  // 32x32 favicon.png
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join('public', 'favicon.png'));
  console.log('Created favicon.png (32x32)');

  // 16x16 favicon-16.png
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(path.join('public', 'favicon-16x16.png'));
  console.log('Created favicon-16x16.png');

  // 32x32 favicon-32.png
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(path.join('public', 'favicon-32x32.png'));
  console.log('Created favicon-32x32.png');

  // 180x180 apple-icon.png
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(path.join('public', 'apple-icon.png'));
  console.log('Created apple-icon.png (180x180)');

  // 192x192 android-chrome-192x192.png
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(path.join('public', 'android-chrome-192x192.png'));
  console.log('Created android-chrome-192x192.png');

  // 512x512 android-chrome-512x512.png
  await sharp(Buffer.from(createLotusSVG(512)))
    .resize(512, 512)
    .png()
    .toFile(path.join('public', 'android-chrome-512x512.png'));
  console.log('Created android-chrome-512x512.png');

  // favicon.ico (multi-size)
  const ico16 = await sharp(svgBuffer).resize(16, 16).png().toBuffer();
  const ico32 = await sharp(svgBuffer).resize(32, 32).png().toBuffer();
  const ico48 = await sharp(svgBuffer).resize(48, 48).png().toBuffer();

  // Create ICO file manually (PNG-based ICO)
  const icoHeader = Buffer.alloc(6);
  icoHeader.writeUInt16LE(0, 0); // reserved
  icoHeader.writeUInt16LE(1, 2); // type: icon
  icoHeader.writeUInt16LE(3, 4); // image count

  const entries = [];
  const images = [
    { size: 16, buffer: ico16 },
    { size: 32, buffer: ico32 },
    { size: 48, buffer: ico48 },
  ];

  let offset = 6 + 16 * images.length;
  const imageData = [];

  images.forEach((img) => {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 0); // width
    entry.writeUInt8(img.size === 256 ? 0 : img.size, 1); // height
    entry.writeUInt8(0, 2); // color palette
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(img.buffer.length, 8); // size of image data
    entry.writeUInt32LE(offset, 12); // offset
    entries.push(entry);
    imageData.push(img.buffer);
    offset += img.buffer.length;
  });

  const icoBuffer = Buffer.concat([icoHeader, ...entries, ...imageData]);
  fs.writeFileSync(path.join('public', 'favicon.ico'), icoBuffer);
  console.log('Created favicon.ico (16/32/48)');

  console.log('\nAll favicon files generated successfully!');
}

generatePNGs().catch((err) => {
  console.error('Error generating PNGs:', err);
  process.exit(1);
});