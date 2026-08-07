/**
 * Beauty_Pro - Contact Page
 */

'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { MapPinIcon, PhoneIcon, EnvelopeIcon, ClockIcon } from '@heroicons/react/24/outline';

export default function ContactPage() {
  return (
    <div className="luna-gradient min-h-screen pt-20">
      <div className="luna-container section-padding">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-playfair text-5xl md:text-6xl text-luna-dark mb-4">Get in Touch</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luna-rose-gold to-transparent mx-auto" />
          <p className="text-luna-dark/60 mt-4 max-w-xl mx-auto">We're here to help and answer any questions you might have.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6 md:p-8">
              <h2 className="font-playfair text-2xl text-luna-dark mb-6">Send us a Message</h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-luna-dark mb-2">First Name</label>
                    <input type="text" required className="w-full px-4 py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-luna-dark mb-2">Last Name</label>
                    <input type="text" required className="w-full px-4 py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-luna-dark mb-2">Email Address</label>
                  <input type="email" required className="w-full px-4 py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luna-dark mb-2">Subject</label>
                  <input type="text" required className="w-full px-4 py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-luna-dark mb-2">Message</label>
                  <textarea rows="5" required className="w-full px-4 py-3 bg-luna-beige/50 border border-luna-peach/30 rounded-xl focus:border-luna-rose-gold focus:outline-none resize-none"></textarea>
                </div>
                <Button variant="primary" size="lg">Send Message</Button>
              </form>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-luna-rose-gold/10 flex items-center justify-center flex-shrink-0">
                  <MapPinIcon className="w-6 h-6 text-luna-rose-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-luna-dark mb-1">Visit Us</h3>
                  <p className="text-sm text-luna-dark/70">123 Luxury Avenue, Bandra West, Mumbai, Maharashtra 400050</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-luna-rose-gold/10 flex items-center justify-center flex-shrink-0">
                  <PhoneIcon className="w-6 h-6 text-luna-rose-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-luna-dark mb-1">Call Us</h3>
                  <p className="text-sm text-luna-dark/70">+91 98765 43210</p>
                  <p className="text-sm text-luna-dark/70">+91 22 1234 5678</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-luna-rose-gold/10 flex items-center justify-center flex-shrink-0">
                  <EnvelopeIcon className="w-6 h-6 text-luna-rose-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-luna-dark mb-1">Email Us</h3>
                  <p className="text-sm text-luna-dark/70">care@lunabeauty.com</p>
                  <p className="text-sm text-luna-dark/70">support@lunabeauty.com</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-luna-rose-gold/10 flex items-center justify-center flex-shrink-0">
                  <ClockIcon className="w-6 h-6 text-luna-rose-gold" />
                </div>
                <div>
                  <h3 className="font-medium text-luna-dark mb-1">Business Hours</h3>
                  <p className="text-sm text-luna-dark/70">Mon - Fri: 9:00 AM - 8:00 PM</p>
                  <p className="text-sm text-luna-dark/70">Sat - Sun: 10:00 AM - 6:00 PM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

