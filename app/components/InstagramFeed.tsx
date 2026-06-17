'use client';

import { motion } from 'framer-motion';
// import { Instagram } from 'lucide-react';

// Mock data for the 6 edge-to-edge square images
// Use distinct colors to simulate different posts
const instaPosts = [
  { id: 1, color: 'bg-[#5c7a9c]' }, // Blue
  { id: 2, color: 'bg-[#b886c1]' }, // Purple
  { id: 3, color: 'bg-[#ff9a8b]' }, // Pink/Orange
  { id: 4, color: 'bg-[#fde047]' }, // Yellow
  { id: 5, color: 'bg-[#d97c36]' }, // Orange
  { id: 6, color: 'bg-[#e27c94]' }, // Pink
];

export default function InstagramFeed() {
  return (
    <section className="w-full relative py-16 lg:py-24 overflow-hidden">
      
      {/* Edge-to-Edge Grid Container */}
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 border-t border-gray-100">
        {instaPosts.map((post) => (
          <div 
            key={post.id} 
            className="relative w-full aspect-square overflow-hidden group cursor-pointer"
          >
            {/* The Image (simulated with color div) */}
            <motion.div
              // Hover Animation Specification
              whileHover={{ scale: 1.1, rotate: -30 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className={`absolute inset-0 w-full h-full ${post.color} z-0`}
            >
              {/* Image placeholder text */}
              <div className="w-full h-full flex items-center justify-center text-white/30 font-bold text-lg">
                Post {post.id}
              </div>
            </motion.div>
            
            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-center justify-center">
              {/*<Instagram size={32} className="text-white" />*/}
            </div>
          </div>
        ))}
      </div>

      {/* Floating "Follow @Pixio" Button */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="bg-brand-dark text-white px-8 py-3.5 rounded-full flex items-center gap-3 font-bold text-sm shadow-2xl hover:bg-gray-800 transition-colors whitespace-nowrap"
        >
          <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark">
            {/*<Instagram size={20} strokeWidth={2.5} />*/}
          </div>
          Follow @Pixio
        </motion.button>
      </div>

    </section>
  );
}