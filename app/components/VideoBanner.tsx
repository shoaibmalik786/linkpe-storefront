'use client';

import { motion } from 'framer-motion';
import { Play } from 'lucide-react';

// Fallback marquee items when the store has no categories yet.
const fallbackItems = ['T-SHIRT', 'BLAZER', 'JACKET', 'JEANS', 'SHIRTS', 'SHORTS', 'DRESSES'];

export default function VideoBanner({
  categories = [],
  storeName = 'Shop',
  bannerUrl = null,
}: {
  categories?: { name: string }[];
  storeName?: string;
  bannerUrl?: string | null;
}) {
  const marqueeItems = categories.length ? categories.map((c) => c.name.toUpperCase()) : fallbackItems;
  // Repeat the store name around the rotating ring.
  const ringText = `${storeName.toUpperCase()} - `.repeat(3);
  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center mt-10">
      
      {/* Static Background Image Container */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat bg-fixed"
        // Replace this inline style with your actual image path once you have it
        style={{
          backgroundImage: `url("${bannerUrl || '/images/bg2.jpg'}")`,
          backgroundColor: '#d1bfae', // Fallback color matching the vibe
        }}
      >
        {/* Subtle overlay to ensure the center button pops */}
        <div className="absolute inset-0 bg-black/10"></div>
      </div>

      {/* Center Animated Play Button */}
      <div className="relative z-10 flex items-center justify-center cursor-pointer group">
        {/* Rotating Text Ring */}
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 30, ease: "linear" }}
          className="absolute w-32 h-32 md:w-40 md:h-40 bg-white rounded-full flex items-center justify-center shadow-lg"
        >
          <svg viewBox="0 0 100 100" className="w-[90%] h-[90%] overflow-visible">
            <path id="shopCirclePath" d="M 50, 50 m -32, 0 a 32,32 0 1,1 64,0 a 32,32 0 1,1 -64,0" fill="transparent" />
            <text className="text-[11px] font-bold tracking-widest uppercase text-brand-dark">
              <textPath href="#shopCirclePath" startOffset="0%">
                {ringText}
              </textPath>
            </text>
          </svg>
        </motion.div>

        {/* Center Play Icon */}
        <div className="relative w-16 h-16 md:w-20 md:h-20 bg-transparent border-2 border-white rounded-full flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
          <Play size={24} className="text-white ml-1" fill="currentColor" />
        </div>
      </div>

      {/* Angled Marquee Belt */}
      <div className="absolute bottom-[-35px] left-[-5%] w-[110%] bg-[#fef08a] py-3 md:py-6 z-20 transform -rotate-2 shadow-sm overflow-hidden flex items-center">
        <motion.div
          className="flex whitespace-nowrap items-center"
          animate={{ x: [0, "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }} // Adjust duration for speed
        >
          {/* We render the array twice to create a seamless infinite scroll effect */}
          {[...marqueeItems, ...marqueeItems].map((item, index) => (
            <div key={index} className="flex items-center shrink-0">
              <span className="text-xl md:text-3xl font-bold text-brand-dark tracking-widest mx-6 md:mx-10">
                {item}
              </span>
              {/* The 4-point star separator */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-[#c0af82] w-6 h-6 md:w-8 md:h-8">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" fill="currentColor" />
              </svg>
            </div>
          ))}
        </motion.div>
      </div>

    </section>
  );
}