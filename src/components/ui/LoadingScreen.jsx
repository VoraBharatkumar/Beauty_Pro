'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          key="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(8px)', scale: 1.05 }}
          transition={{ duration: 0.8, ease: [0.45, 0, 0.55, 1] }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: '#FDFBF9' }}
        >
          {/* Animated background gradient orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
              opacity: [0.03, 0.06, 0.03],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[600px] h-[600px] rounded-full"
            style={{
              background: 'radial-gradient(circle, #D4A0A0 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              rotate: [360, 180, 0],
              opacity: [0.02, 0.05, 0.02],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="absolute w-[400px] h-[400px] rounded-full"
            style={{
              background: 'radial-gradient(circle, #C9A96E 0%, transparent 70%)',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />

          {/* Decorative gold ring */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-48 h-48 md:w-64 md:h-64 rounded-full border border-beauty-rose-gold/20"
          />
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute w-36 h-36 md:w-48 md:h-48 rounded-full border border-beauty-gold/15"
          />

          {/* Logo Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-center relative z-10"
          >
            {/* Glow behind logo */}
            <motion.div
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 -z-10 blur-3xl"
              style={{
                background: 'radial-gradient(ellipse at center, #D4A0A0 0%, transparent 70%)',
                transform: 'scale(2)',
              }}
            />

            <span className="font-playfair text-4xl md:text-6xl font-bold text-beauty-dark tracking-[0.15em] block">
              Beauty_Pro
            </span>
            <span className="block text-[10px] md:text-xs tracking-[0.4em] text-beauty-coffee uppercase mt-2 font-light">
              Premium Cosmetics
            </span>

            {/* Loading bar with shimmer */}
            <div className="flex justify-center mt-8">
              <div className="relative w-32 h-[2px] bg-beauty-beige/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ x: '-100%' }}
                  animate={{ x: '200%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute inset-0 w-full h-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent, #C9A96E, #D4A0A0, transparent)',
                  }}
                />
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-[10px] md:text-xs text-beauty-soft-brown/60 tracking-[0.2em] uppercase mt-6 font-light"
            >
              Experience Luxury
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}