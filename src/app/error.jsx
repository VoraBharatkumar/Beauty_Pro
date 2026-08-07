'use client';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

export default function ErrorPage({ error, reset }) {
  return (
    <div className="luna-gradient min-h-screen flex items-center justify-center">
      <div className="luna-container section-padding">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto">
          <div className="text-6xl mb-4">😔</div>
          <h1 className="font-playfair text-4xl md:text-5xl text-luna-dark mb-4">Something went wrong</h1>
          <p className="text-luna-dark/70 mb-8">We apologize for the inconvenience. Please try again.</p>
          <Button variant="primary" size="lg" onClick={reset}>Try Again</Button>
        </motion.div>
      </div>
    </div>
  );
}

