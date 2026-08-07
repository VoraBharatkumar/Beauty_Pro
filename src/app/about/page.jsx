/**
 * Beauty_Pro - About Page
 */

'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function AboutPage() {
  return (
    <div className="luna-gradient min-h-screen pt-20">
      <div className="luna-container section-padding">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-playfair text-5xl md:text-6xl text-luna-dark mb-4">Our Story</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luna-rose-gold to-transparent mx-auto" />
        </motion.div>

        {/* Story */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
          <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="aspect-square bg-gradient-to-br from-luna-peach to-luna-rose-gold rounded-3xl flex items-center justify-center">
              <span className="font-playfair text-9xl text-white/30">L</span>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <h2 className="font-playfair text-4xl text-luna-dark">Crafted with Love, Worn with Pride</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-luna-rose-gold to-luna-coffee" />
            <p className="text-lg text-luna-dark/70 leading-relaxed">
              Beauty_Pro was born from a passion for creating luxurious, high-performance beauty products that empower every individual to feel confident and radiant.
            </p>
            <p className="text-lg text-luna-dark/70 leading-relaxed">
              Founded in 2010, we combine the finest natural ingredients with cutting-edge science to deliver exceptional results. Our commitment to quality, sustainability, and cruelty-free practices defines everything we do.
            </p>
            <Button variant="primary" size="lg" href="/shop">Shop Our Products</Button>
          </motion.div>
        </div>

        {/* Values */}
        <div className="mb-24">
          <h2 className="font-playfair text-4xl text-luna-dark text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: 'Quality', desc: 'Premium ingredients sourced responsibly from around the world.', icon: '✨' },
              { title: 'Integrity', desc: 'Transparent formulas, honest pricing, and ethical practices.', icon: '🤝' },
              { title: 'Innovation', desc: 'Constantly evolving to bring you the best in beauty technology.', icon: '💡' },
            ].map((value, idx) => (
              <motion.div key={value.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: idx * 0.2 }} className="glass-card p-8 text-center">
                <div className="text-5xl mb-4">{value.icon}</div>
                <h3 className="font-playfair text-2xl text-luna-dark mb-3">{value.title}</h3>
                <p className="text-luna-dark/70">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center bg-luna-dark rounded-3xl p-12 md:p-16">
          <h2 className="font-playfair text-4xl text-white mb-4">Experience Beauty_Pro</h2>
          <p className="text-white/70 max-w-xl mx-auto mb-8">Join thousands of happy customers who have transformed their beauty routine with our premium products.</p>
          <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-luna-dark" href="/shop">
            Shop Now
          </Button>
        </motion.div>
      </div>
    </div>
  );
}

