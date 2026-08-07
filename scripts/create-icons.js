const fs = require('fs');

const svg192 = `<svg xmlns="http://www.w3.org/2000/svg" width="192" height="192" viewBox="0 0 192 192">
  <rect width="192" height="192" rx="32" fill="#FAF8F6"/>
  <text x="96" y="110" font-family="Georgia,serif" font-size="72" font-weight="bold" fill="#1B1B1B" text-anchor="middle">L</text>
  <text x="96" y="140" font-family="Arial,sans-serif" font-size="14" fill="#A87363" text-anchor="middle" letter-spacing="4">BEAUTY</text>
</svg>`;

const svg384 = svg192
  .replace('width="192" height="192"', 'width="384" height="384"')
  .replace('viewBox="0 0 192 192"', 'viewBox="0 0 384 384"')
  .replace('font-size="72"', 'font-size="144"')
  .replace('font-size="14"', 'font-size="28"');

const svg512 = svg192
  .replace('width="192" height="192"', 'width="512" height="512"')
  .replace('viewBox="0 0 192 192"', 'viewBox="0 0 512 512"')
  .replace('font-size="72"', 'font-size="192"')
  .replace('font-size="14"', 'font-size="36"');

fs.writeFileSync('public/icons/icon-192.svg', svg192);
fs.writeFileSync('public/icons/icon-384.svg', svg384);
fs.writeFileSync('public/icons/icon-512.svg', svg512);
console.log('Icons created successfully');

