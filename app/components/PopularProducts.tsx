'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag } from 'lucide-react';

// Mock data with categories for the tab filter
const products = [
  { id: 1, name: 'Cozy Knit Cardigan Sweater', price: 80, discount: '20% OFF', category: 'Outerwear', color: 'bg-[#b886c1]' },
  { id: 2, name: 'Sophisticated Swagger Suit', price: 70, discount: '10% OFF', category: 'Outerwear', color: 'bg-[#5c7a9c]' },
  { id: 3, name: 'Classic Denim Skinny Jeans', price: 50, discount: '15% OFF', category: 'Jeans', color: 'bg-[#6b8cce]' },
  { id: 4, name: 'Athletic Mesh Sports Leggings', price: 30, discount: '40% OFF', category: 'Tops', color: 'bg-[#d97c36]' },
  { id: 5, name: 'Vintage Denim Overalls', price: 55, discount: '25% OFF', category: 'Dresses', color: 'bg-[#e2a8b8]' },
  { id: 6, name: 'Satin Wrap Party Blouse', price: 65, discount: '30% OFF', category: 'Tops', color: 'bg-[#e27c94]' },
  { id: 7, name: 'Plaid Wool Winter Coat', price: 35, discount: '15% OFF', category: 'Jacket', color: 'bg-[#b4c5c2]' },
  { id: 8, name: 'Water-Resistant Windbreaker', price: 75, discount: '25% OFF', category: 'Jacket', color: 'bg-[#e6b3a3]' },
];

const tabs = ['ALL', 'Dresses', 'Tops', 'Outerwear', 'Jacket'];

export default function PopularProducts() {
  const [activeTab, setActiveTab] = useState('ALL');

  // Filter products based on the selected tab
  const filteredProducts = activeTab === 'ALL' 
    ? products 
    : products.filter(product => product.category === activeTab);

  return (
    <section className="w-full bg-brand-bg py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header and Tabs */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-12 gap-6">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-dark">
            Most Popular Products
          </h2>
          
          {/* Tabs Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 hide-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors duration-300 ${
                  activeTab === tab 
                    ? 'bg-brand-dark text-white shadow-md' 
                    : 'bg-transparent text-brand-dark hover:bg-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Animated Product Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout // Enables smooth position animating
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col"
              >
                {/* Product Image Card */}
                <div className="relative group w-full aspect-[4/5] rounded-3xl overflow-hidden mb-4 cursor-pointer">
                  {/* Image Placeholder */}
                  <div className={`w-full h-full ${product.color} transition-transform duration-700 group-hover:scale-105`}></div>
                  
                  {/* Top Left Discount Badge */}
                  {product.discount && (
                    <div className="absolute top-4 left-4 bg-white text-brand-dark text-[10px] font-bold px-3 py-1.5 rounded-sm z-10 shadow-sm">
                      GET {product.discount}
                    </div>
                  )}

                  {/* Top Right Actions */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                    <button className="w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-500 hover:text-brand-red hover:bg-white transition-all shadow-sm">
                      <Heart size={16} />
                    </button>
                    <button className="w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-500 hover:text-brand-dark hover:bg-white transition-all shadow-sm">
                      <ShoppingBag size={16} />
                    </button>
                  </div>

                  {/* Hover "Quick View" Button */}
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <button className="bg-brand-dark text-white text-xs font-bold px-6 py-2.5 rounded-full whitespace-nowrap shadow-xl hover:bg-gray-800">
                      QUICK VIEW
                    </button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex items-start justify-between gap-4 mt-auto">
                  <h3 className="text-brand-dark font-bold text-base leading-tight hover:text-brand-red transition-colors cursor-pointer">
                    {product.name}
                  </h3>
                  <span className="font-extrabold text-brand-dark text-base shrink-0">
                    ${product.price}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

      </div>
    </section>
  );
}