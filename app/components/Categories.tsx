'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Link from 'next/link';
import type { Category, Product } from '@linkpe-storefront/sdk';

export default function Categories({
  categories,
  products,
}: {
  categories: Category[];
  products: Product[];
}) {
  if (!categories.length) return null;

  // Use the first product in each category as its tile image.
  const imageFor = (categoryId: string): string | null => {
    const p = products.find((x) => x.category_id === categoryId);
    if (!p) return null;
    return (p.images ?? []).slice().sort((a, b) => a.display_order - b.display_order)[0]?.url ?? p.image_url ?? null;
  };

  return (
    <section className="relative w-full bg-brand-accent py-20 lg:py-32 rounded-t-[3rem] -mt-10 z-20">
      <div className="circular_badge absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-brand-accent rounded-full flex items-center justify-center shadow-sm">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
          className="relative w-full h-full flex items-center justify-center text-[10px] font-bold tracking-widest uppercase text-brand-dark"
        >
          <svg viewBox="0 0 100 100" className="w-28 h-28 overflow-visible">
            <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
            <text>
              <textPath href="#circlePath" startOffset="0%">
                CATEGORY • CATEGORY • CATEGORY •
              </textPath>
            </text>
          </svg>
        </motion.div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
          <ArrowDown size={16} className="text-brand-dark" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, index) => {
            const img = imageFor(cat.id);
            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              >
                <Link
                  href={`/shop?category=${encodeURIComponent(cat.slug)}`}
                  className="relative group rounded-[2.5rem] overflow-hidden cursor-pointer h-[280px] sm:h-[320px] shadow-sm hover:shadow-xl transition-shadow duration-300 border-4 border-white block bg-white/40"
                >
                  {img ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img} alt={cat.name} className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-brand-dark/40 font-medium">{cat.name}</div>
                  )}
                  <div className="absolute bottom-6 left-6 bg-white px-6 py-2.5 rounded-full z-10 shadow-md transform group-hover:-translate-y-1 transition-transform duration-300">
                    <span className="font-bold text-sm text-brand-dark">{cat.name}</span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
