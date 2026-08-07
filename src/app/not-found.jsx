/**
 * Beauty_Pro - 404 Page
 */

'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="luna-gradient min-h-screen flex items-center justify-center">
      <div className="luna-container section-padding">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-2xl mx-auto"
        >
          <div className="mb-8">
            <span className="font-playfair text-9xl md:text-[12rem] font-bold text-gradient leading-none">
              404
            </span>
          </div>
          <h1 className="font-playfair text-4xl md:text-5xl text-luna-dark mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-luna-dark/70 mb-8 max-w-md mx-auto">
            The page you're looking for seems to have vanished like a perfect lipstick shade. Let us help you find your way back.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/">
              <Button variant="primary" size="lg">
                Back to Home
              </Button>
            </Link>
            <Link href="/shop">
              <Button variant="outline" size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

