/**
 * Beauty_Pro - Blog Page
 */

'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';

const blogPosts = [
  {
    id: 1,
    title: 'The Secret to Glowing Skin: 5 Essential Tips',
    excerpt: 'Discover the expert skincare routine that will transform your complexion and give you that natural, radiant glow.',
    category: 'Skincare',
    date: 'June 20, 2026',
    readTime: '5 min read',
    image: null,
  },
  {
    id: 2,
    title: 'Summer Makeup Trends 2026',
    excerpt: 'From bold lips to fresh skin, explore the hottest makeup trends that are taking over this summer season.',
    category: 'Makeup',
    date: 'June 18, 2026',
    readTime: '4 min read',
    image: null,
  },
  {
    id: 3,
    title: 'Why Clean Beauty Matters',
    excerpt: 'Learn about the importance of clean ingredients and how Beauty_Pro is leading the way in sustainable beauty.',
    category: 'Lifestyle',
    date: 'June 15, 2026',
    readTime: '6 min read',
    image: null,
  },
];

export default function BlogPage() {
  return (
    <div className="luna-gradient min-h-screen pt-20">
      <div className="luna-container section-padding">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="font-playfair text-5xl md:text-6xl text-luna-dark mb-4">Beauty Journal</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-luna-rose-gold to-transparent mx-auto" />
          <p className="text-luna-dark/60 mt-4 max-w-xl mx-auto">Tips, tricks, and inspiration for your beauty journey.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="glass-card overflow-hidden group"
            >
              <Link href={`/blog/${post.id}`}>
                <div className="aspect-[16/10] bg-luna-beige relative overflow-hidden">
                  <div className="w-full h-full flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-500">
                    📝
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-3 py-1 bg-luna-rose-gold/10 text-luna-rose-gold text-xs font-medium rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs text-luna-dark/50">{post.readTime}</span>
                  </div>
                  <h2 className="font-playfair text-xl text-luna-dark mb-3 group-hover:text-luna-rose-gold transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-luna-dark/60 text-sm leading-relaxed mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-luna-dark/50">{post.date}</span>
                    <span className="text-sm text-luna-rose-gold font-medium">Read More →</span>
                  </div>
                </div>
              </Link>
            </motion.article>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="outline" size="lg">View All Posts</Button>
        </div>
      </div>
    </div>
  );
}

