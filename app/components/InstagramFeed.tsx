'use client';

import { motion } from 'framer-motion';
// import { Instagram } from 'lucide-react';

// Mock data for the 6 edge-to-edge square images
// Use distinct colors to simulate different posts
const instaPosts = [
  { id: 1, color: 'bg-[#5c7a9c]', img: 'https://pixio-react.vercel.app/assets/1-Bvl3F8fR.png' }, // Blue
  { id: 2, color: 'bg-[#b886c1]', img: 'https://pixio-react.vercel.app/assets/2-jLyTz6xG.png' }, // Purple
  { id: 3, color: 'bg-[#ff9a8b]', img: 'https://pixio-react.vercel.app/assets/3-B5W7BQtI.png' }, // Pink/Orange
  { id: 4, color: 'bg-[#fde047]', img: 'https://pixio-react.vercel.app/assets/4-CfSZrjjc.png' }, // Yellow
  { id: 5, color: 'bg-[#d97c36]', img: 'https://pixio-react.vercel.app/assets/5-BvDoC1hM.png' }, // Orange
  { id: 6, color: 'bg-[#e27c94]', img: 'https://pixio-react.vercel.app/assets/6--3TYks_0.png' }, // Pink
];

export default function InstagramFeed() {
  return (
    <section className="w-full relative overflow-hidden">
      
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
              <img src={post.img} className="w-full h-full object-cover" />


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
          className="bg-white text-black hover:text-white px-8 py-3.5 rounded-full flex items-center gap-3 font-bold text-sm shadow-2xl hover:bg-gray-800 transition-colors whitespace-nowrap cursor-pointer"
        >
          <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center text-brand-dark">
            {/*<Instagram size={20} strokeWidth={2.5} />*/}
            <img src="https://pixio-react.vercel.app/assets/insta-follow-CH1S7YNq.png" alt="icon" />
          </div>
          Follow @brand
        </motion.button>
      </div>

    </section>
  );
}