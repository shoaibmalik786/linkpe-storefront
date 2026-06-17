'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import Image from 'next/image';

// Mock data based on your design
const categories = [
  { id: 1, name: 'Jacket', color: 'bg-purple-400', align: 'mt-0 product-1', img: "https://pixio-react.vercel.app/assets/pic1-eSxHmU7U.jpg" },
  { id: 2, name: 'Jeans', color: 'bg-yellow-400', align: 'mt-0 product-2', img: " https://pixio-react.vercel.app/assets/pic2-DOJ8tY10.jpg" },
  { id: 3, name: 'Shirts', color: 'bg-blue-300', align: 'mt-0 product-3', img: "https://pixio-react.vercel.app/assets/pic3-C8pSbnkc.jpg" },
  { id: 4, name: 'Shorts', color: 'bg-amber-200', align: 'mt-0 product-4', img: " https://pixio-react.vercel.app/assets/pic4-CGn5K9X6.jpg" },
  { id: 5, name: 'T-Shirt', color: 'bg-orange-400', align: 'mt-0 product-5', img: "https://pixio-react.vercel.app/assets/pic5-DCV12LVa.jpg" },
  { id: 6, name: 'Blazer', color: 'bg-rose-700', align: 'mt-0 product-6', img: "https://pixio-react.vercel.app/assets/pic6-D3-6h_oE.jpg" },
];

export default function Categories() {
  return (
    <section className="relative w-full bg-[#fef08a] py-20 lg:py-32 rounded-t-[3rem] -mt-10 z-20">
      
      {/* Rotating Circular Badge */}
      <div className="circular_badge absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-[#fef08a] rounded-full flex items-center justify-center shadow-sm">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
          className="relative w-full h-full flex items-center justify-center text-[10px] font-bold tracking-widest uppercase text-brand-dark"
        >
          {/* We use SVG text to create the circular text effect */}
          <svg viewBox="0 0 100 100" className="w-28 h-28 overflow-visible">
            <path id="circlePath" d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" fill="transparent" />
            <text>
              <textPath href="#circlePath" startOffset="0%">
                CATEGORY • CATEGORY • CATEGORY • 
              </textPath>
            </text>
          </svg>
        </motion.div>
        {/* Center Arrow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md">
          <ArrowDown size={16} className="text-brand-dark" />
        </div>
      </div>

      {/* Grid Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
              className={`relative group rounded-[2.5rem] overflow-hidden cursor-pointer h-[280px] sm:h-[320px] shadow-sm hover:shadow-xl transition-shadow duration-300 border-4 border-white ${cat.align} ${cat.color}} `}
            >
              
              {/*<Image 
                // src={`/cats/${cat.name.toLowerCase()}.jpg`} 
                src={cat.img}
                alt={cat.name} 
                fill 
                className="object-cover group-hover:scale-105 transition-transform duration-500" 
              /> */}
              <img
                src={cat.img}
                alt={cat.name} 
                className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500" 
              />

            
              <div className="w-full h-full opacity-80 mix-blend-multiply group-hover:scale-105 transition-transform duration-700 ease-in-out">
                {/* Image Placeholder */}
                <div className="w-full h-full flex items-center justify-center text-white/50 font-medium">
                  Image: {cat.name}
                </div>
              </div>

              {/* White Pill Label */}
              <div className="absolute bottom-6 left-6 bg-white px-6 py-2.5 rounded-full z-10 shadow-md transform group-hover:-translate-y-1 transition-transform duration-300">
                <span className="font-bold text-sm text-brand-dark">{cat.name}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}