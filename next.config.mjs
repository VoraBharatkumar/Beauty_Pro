/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'res.cloudinary.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '*.amazonaws.com' },
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    qualities: [75, 85],
  },
  reactStrictMode: true,
  allowedDevOrigins: ['192.168.1.69', 'localhost'],
};

export default nextConfig;