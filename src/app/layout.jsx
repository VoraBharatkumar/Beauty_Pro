/**
 * Beauty_Pro - Luxury Cosmetics E-Commerce Platform
 * Production-Ready Application Layout
 */

import './globals.css';
import { Inter, Playfair_Display, Cormorant_Garamond, Poppins } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Lenis from 'lenis';
import { Providers } from './providers';
import Header from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { LoadingScreen } from '@/components/ui/LoadingScreen';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { SearchModal } from '@/components/ui/SearchModal';
import { QuickView } from '@/components/product/QuickView';
import LoginRequiredModal from '@/components/auth/LoginRequiredModal';
import { ToastContainer } from '@/components/ui/ToastContainer';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-playfair',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-cormorant',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-poppins',
});

export const metadata = {
  title: {
    default: 'Beauty_Pro | Luxury Cosmetics & Skincare',
    template: '%s | Beauty_Pro',
  },
  description: 'Discover luxury cosmetics, premium skincare, and exclusive beauty collections at Beauty_Pro. Indulge in elegance with our curated selection of high-end makeup, skincare, and fragrance.',
  keywords: ['luxury cosmetics', 'premium skincare', 'high-end makeup', 'beauty products', 'skincare', 'makeup', 'fragrance', 'luxury beauty', 'organic skincare', 'professional makeup'],
  authors: [{ name: 'Beauty_Pro' }],
  creator: 'Beauty_Pro',
  publisher: 'Beauty_Pro',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    title: 'Beauty_Pro | Luxury Cosmetics & Skincare',
    description: 'Discover luxury cosmetics, premium skincare, and exclusive beauty collections at Beauty_Pro.',
    siteName: 'Beauty_Pro',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Beauty_Pro - Luxury Cosmetics',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Beauty_Pro | Luxury Cosmetics & Skincare',
    description: 'Discover luxury cosmetics, premium skincare, and exclusive beauty collections.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '48x48', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icons/icon-192.svg', color: '#D4A0A0' },
    ],
  },
  manifest: '/manifest.json',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#FAF8F6',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable} ${cormorant.variable} ${poppins.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="antialiased">
        <Providers>
          <LoadingScreen />
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <CartDrawer />
          <SearchModal />
          <QuickView />
          <LoginRequiredModal />
          <ToastContainer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1B1B1B',
                color: '#FAF8F6',
                padding: '16px 24px',
                borderRadius: '12px',
                fontFamily: 'var(--font-poppins)',
              },
              success: {
                iconTheme: {
                  primary: '#D9B29C',
                  secondary: '#FAF8F6',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FAF8F6',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}

