'use client';

import { motion } from 'framer-motion';

// Mock data for the logo text to mimic the images
const row1Logos = [
  { name: 'NETFLIX', color: 'text-red-600', font: 'font-black tracking-tighter' },
  { name: 'Google', color: 'text-blue-500', font: 'font-bold' }, // Using multi-color natively requires SVG, simplifying here
  { name: 'YouTube', color: 'text-red-500', font: 'font-bold tracking-tight' },
  { name: 'slack', color: 'text-purple-600', font: 'font-extrabold lowercase' },
  { name: 'dribbble', color: 'text-pink-500', font: 'font-bold' },
  { name: 'amazon', color: 'text-gray-900', font: 'font-bold lowercase' },
];

const row2Logos = [
  { name: 'Lenovo', color: 'text-red-500', font: 'font-black tracking-widest uppercase text-xl' },
  { name: 'Microsoft', color: 'text-gray-600', font: 'font-semibold text-xl' },
  { name: 'amazon', color: 'text-gray-900', font: 'font-bold lowercase' },
  { name: 'NETFLIX', color: 'text-red-600', font: 'font-black tracking-tighter' },
  { name: 'Google', color: 'text-blue-500', font: 'font-bold' },
  { name: 'slack', color: 'text-purple-600', font: 'font-extrabold lowercase' },
];

export default function TrustedPartners() {
  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-10">
      {/* Container with the warm gradient background */}
      <div className="max-w-7xl mx-auto rounded-[3rem] overflow-hidden bg-gradient-to-r from-[#ff9a8b] via-[#ffc3a0] to-[#fef08a] py-16 lg:py-24 relative shadow-sm">
        
        {/* Top Header Section */}
        <div className="px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8 mb-16 relative z-10">
          
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-xl text-center md:text-left drop-shadow-sm">
            We're Just Keep Growing With 6.3k Trusted Companies
          </h2>

          {/* Rotating Black Partner Badge */}
          <div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-brand-dark rounded-full flex items-center justify-center shrink-0 shadow-xl">
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute w-full h-full flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                <path id="partnerCircle" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="transparent" />
                <text className="text-[12px] font-bold tracking-widest uppercase text-white fill-current">
                  <textPath href="#partnerCircle" startOffset="0%">
                    P A R T N E R • P A R T N E R • 
                  </textPath>
                </text>
              </svg>
            </motion.div>
            
            {/* Center Asterisk/Star */}
            <div className="text-white">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Marquee Rows Container */}
        <div className="flex flex-col gap-6 relative z-10">
          
          {/* Row 1: Scrolls Left */}
          <div className="flex overflow-hidden group">
            <motion.div
              className="flex gap-6 whitespace-nowrap pl-6"
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
            >
              {[...row1Logos, ...row1Logos, ...row1Logos].map((logo, index) => (
                <div 
                  key={`row1-${index}`} 
                  className="bg-white rounded-2xl px-10 py-5 flex items-center justify-center min-w-[180px] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <span className={`text-2xl ${logo.font} ${logo.color}`}>
                    {logo.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* Row 2: Scrolls Right */}
          <div className="flex overflow-hidden group">
            <motion.div
              className="flex gap-6 whitespace-nowrap pl-6"
              animate={{ x: ["-50%", "0%"] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 35 }} // Slightly slower for depth
            >
              {[...row2Logos, ...row2Logos, ...row2Logos].map((logo, index) => (
                <div 
                  key={`row2-${index}`} 
                  className="bg-white rounded-2xl px-10 py-5 flex items-center justify-center min-w-[180px] shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <span className={`text-2xl ${logo.font} ${logo.color}`}>
                    {logo.name}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}