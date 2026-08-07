/**
 * Beauty_Pro - FAQ Page
 */

'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Button from '@/components/ui/Button';

const faqs = [
  { q: 'How long does shipping take?', a: 'Standard shipping takes 5-7 business days. Express delivery (2-3 days) is available for ₹149. Free shipping on orders above ₹1000.' },
  { q: 'What is your return policy?', a: 'We offer a 7-day easy return policy. Products must be unused and in original packaging. Contact us at support@lunabeauty.com to initiate a return.' },
  { q: 'Are your products cruelty-free?', a: 'Yes! All Beauty_Pro products are 100% cruelty-free. We never test on animals, and we work only with suppliers who share our values.' },
  { q: 'How do I track my order?', a: 'Once shipped, you will receive a tracking link via email and SMS. You can also track your order from your account dashboard.' },
  { q: 'Do you ship internationally?', a: 'Currently, we ship across India. International shipping will be available soon. Sign up for our newsletter to be notified.' },
  { q: 'How can I become a Beauty_Pro affiliate?', a: 'We love collaborations! Email us at care@lunabeauty.com with details about your platform and audience.' },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="luna-gradient min-h-screen pt-20">
      <div className="luna-container section-padding">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-playfair text-5xl md:text-6xl text-luna-dark mb-4">Frequently Asked Questions</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luna-rose-gold to-transparent mx-auto" />
          <p className="text-luna-dark/60 mt-4 max-w-xl mx-auto">Find quick answers to common questions about our products and services.</p>
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card overflow-hidden"
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full px-6 py-5 text-left flex items-center justify-between hover:bg-luna-beige/30 transition-colors"
                >
                  <span className="font-medium text-luna-dark pr-4">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-luna-rose-gold transition-transform flex-shrink-0 ${openIndex === index ? 'rotate-180' : ''}`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="px-6 pb-5">
                    <p className="text-luna-dark/70 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-luna-dark/60 mb-4">Still have questions?</p>
            <Button variant="primary" size="lg" href="/contact">Contact Us</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

