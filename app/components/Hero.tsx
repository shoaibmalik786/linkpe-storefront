'use client';

import { motion } from 'framer-motion';
import { Sparkles, Heart, ShoppingBasket } from 'lucide-react';
import Image from 'next/image';

export default function Hero() {
  // Animation variants for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 pt-[30px] pb-[50px] h-[700px] flex flex-col lg:flex-row items-center justify-between">
      
      {/* Left Content */}
      <motion.div 
        className="w-full lg:w-1/2 z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.h1 
          variants={itemVariants}
          className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6"
        >
          Your Ultimate <br />
          <span className="inline-flex items-center text-brand-red text-[var(--primary)]">
            <Sparkles className="w-10 h-10 lg:w-14 lg:h-14 mr-2" fill="currentColor" />
            Online Store
          </span> <br />
          for All Your Needs.
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 font-medium">
          No code need. Plus free shipping on <span className="text-brand-red font-bold">$99+</span> orders!
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          <button className="px-8 py-3.5 bg-black text-white text-sm font-bold rounded-full bg-black hover:bg-gray-800 transition-colors">
            ADD TO CART
          </button>
          <button className="px-8 py-3.5 bg-transparent border-2 border-brand-dark text-brand-dark text-sm font-bold rounded-full hover:bg-black hover:text-white transition-colors">
            VIEW DETAILS
          </button>
        </motion.div>
      </motion.div>

      {/* Right Image & Floating Elements Composition */}
      <div className="w-full lg:w-1/2 max-w-[41.66666667%] relative mt-16 lg:mt-0 flex justify-center items-center">
        <div className="banner-media">
          <div className="shap" />
          <div className="border-shap" />
          <div className="border-shap2" />
          <div className="img-preview" >
            {/*<img alt="banner-media" src="/assets/pic1-Dc74E7U4.png" />*/}
            <img src="/images/pic1-Dc74E7U4.png" alt="Fashion Model" className="" /> 
          </div>

          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="bnr-content-bx slideskew"
          >
            <div className="dz-media w-16 h-16 bg-purple-200 rounded-lg shrink-0 relative">
              {/*<img alt="shirt" src="/assets/1-Cx9eAfJp.png" />*/}
              <Image src="/images/1-Cx9eAfJp.png" alt="Fashion Model" fill className="object-cover w-12 h-12 bg-purple-200 rounded-lg shrink-0" /> 
            </div>
            <div className="dz-info">
              <h5 className="dz-title">Cozy Knit Cardigan</h5>
              <h6 className="price text-primary">$80</h6>
              {/*<div className="meta-icon">
                <ShoppingBasket className="w-10 h-10 lg:w-14 lg:h-14 mr-2" fill="currentColor" />
              </div>*/}
            </div>
          </motion.div>
          
          <motion.div 
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="bnr-customer-bx slideskew"
          >
            <Heart className="w-10 h-10 lg:w-14 lg:h-14 mr-2 dz-heart" fill="currentColor" />
            <ul>
              <li className="customer-image">
                <img alt="testimonial" src="https://pixio-react.vercel.app/assets/testimonial1-DeRDcKB6.jpg" />
              </li>
              <li className="customer-image">
                <img alt="testimonial" src="https://pixio-react.vercel.app/assets/testimonial2-D4YAS0Yr.jpg" />
              </li>
              <li className="customer-image">
                <img alt="testimonial" src="https://pixio-react.vercel.app/assets/testimonial3-vzKjBPdX.jpg" />
              </li>
            </ul>
          </motion.div>
          <ul className="star-list">
            <motion.li 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="star-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={57}
                height={57}
                viewBox="0 0 57 57"
                fill="none"
              >
                <path
                  d="M28.5 0L33.3366 23.6634L57 28.5L33.3366 33.3366L28.5 57L23.6634 33.3366L0 28.5L23.6634 23.6634L28.5 0Z"
                  fill="var(--rgba-primary-2)"
                />
              </svg>
            </motion.li>
            <motion.li 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="star-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={57}
                height={57}
                viewBox="0 0 57 57"
                fill="none"
              >
                <path
                  d="M28.5 0L33.3366 23.6634L57 28.5L33.3366 33.3366L28.5 57L23.6634 33.3366L0 28.5L23.6634 23.6634L28.5 0Z"
                  fill="var(--rgba-primary-2)"
                />
              </svg>
            </motion.li>
            <motion.li 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="star-3"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width={57}
                height={57}
                viewBox="0 0 57 57"
                fill="none"
              >
                <path
                  d="M28.5 0L33.3366 23.6634L57 28.5L33.3366 33.3366L28.5 57L23.6634 33.3366L0 28.5L23.6634 23.6634L28.5 0Z"
                  fill="var(--rgba-primary-2)"
                />
              </svg>
            </motion.li>
          </ul>
        </div>
      </div>
    </section>
  );
}