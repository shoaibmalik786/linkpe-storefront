'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product, Category } from '@linkpe-storefront/sdk';

export default function PopularProducts({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [activeCat, setActiveCat] = useState<string>('ALL');

  if (!products.length) return null;

  // Only show tabs for categories that actually have products in this set.
  const presentCatIds = new Set(products.map((p) => p.category_id).filter(Boolean) as string[]);
  const tabs = [
    { id: 'ALL', name: 'ALL' },
    ...categories.filter((c) => presentCatIds.has(c.id)).map((c) => ({ id: c.id, name: c.name })),
  ];

  const filtered = activeCat === 'ALL' ? products : products.filter((p) => p.category_id === activeCat);

  return (
    <section className="w-full bg-brand-bg py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-dark">Shop the Collection</h2>

          {tabs.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCat(tab.id)}
                  className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors duration-300 ${
                    activeCat === tab.id ? 'bg-brand-dark text-white shadow-md' : 'bg-transparent text-brand-dark hover:bg-gray-200'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.slice(0, 8).map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
