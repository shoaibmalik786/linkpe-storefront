'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, 
  X, 
  Star, 
  Minus, 
  Plus, 
  Heart, 
  // Facebook, 
  // Twitter, 
  // Youtube, 
  // Linkedin, 
  // Instagram 
} from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import Link from 'next/link';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';


interface QuickViewModalProps {
  product: any;
  onClose: () => void;
}

// Fallback images for the slider if the product doesn't have an array of images
const MOCK_IMAGES = [
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509631179647-0c37cb5378fe?q=80&w=1000&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1529139574466-a303027c028b?q=80&w=1000&auto=format&fit=crop"
];

export default function QuickViewModal({ product, onClose }: QuickViewModalProps) {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Dynamic Price Calculations
  const basePrice = product.price;
  const originalPrice = (basePrice * 1.2).toFixed(2); // Mock original price (20% more)
  const currentTotal = (basePrice * quantity).toFixed(2);
  const originalTotal = (Number(originalPrice) * quantity).toFixed(2);

  const handleDecrease = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  const handleIncrease = () => setQuantity(prev => prev + 1);

  return (
    <>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 py-8"
        onClick={onClose}
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()} // Prevent clicks inside from closing modal
          className="relative w-full max-w-5xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]"
        >
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 z-10 text-gray-400 hover:text-black transition-colors"
          >
            <X size={24} />
          </button>

          {/* LEFT SIDE: Image Gallery */}
          <div className="w-full md:w-1/2 bg-[#7eb6d9] p-4 flex flex-col-reverse md:flex-row gap-4 h-[400px] md:h-auto overflow-hidden">
            
            {/* Thumbnails (Vertical on desktop, Horizontal on mobile) */}
            <div className="w-full md:w-24 h-24 md:h-full shrink-0">
              <Swiper
                onSwiper={setThumbsSwiper}
                direction="horizontal"
                breakpoints={{
                  768: { direction: 'vertical' }
                }}
                spaceBetween={10}
                slidesPerView={4}
                freeMode={true}
                watchSlidesProgress={true}
                modules={[FreeMode, Navigation, Thumbs]}
                className="w-full h-full quickview-thumbs"
              >
                {MOCK_IMAGES.map((img, idx) => (
                  <SwiperSlide key={idx} className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity border-2 border-transparent [&.swiper-slide-thumb-active]:border-black [&.swiper-slide-thumb-active]:opacity-100 rounded-sm overflow-hidden">
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {/* Main Image */}
            <div className="flex-1 h-full rounded-sm overflow-hidden relative group cursor-zoom-in" onClick={() => setIsLightboxOpen(true)}>
              <Swiper
                spaceBetween={10}
                navigation={false}
                thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                modules={[FreeMode, Navigation, Thumbs]}
                onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
                className="w-full h-full"
              >
                {MOCK_IMAGES.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img src={img} alt={product.name} className="w-full h-full object-cover" />
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Zoom overlay hint */}
              <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
                <Search size={32} className="text-white drop-shadow-md" />
              </div>
            </div>
          </div>

          {/* RIGHT SIDE: Product Details */}
          <div className="w-full md:w-1/2 p-3 md:p-6 md:p-8 lg:p-10 flex flex-col overflow-y-auto">
            
            {/* Badge */}
            <span className="bg-black text-white text-[10px] font-bold px-3 py-1.5 rounded-sm w-max mb-4 tracking-wider uppercase">
              SALE 20% OFF
            </span>

            {/* Title & Rating */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-dark mb-3 leading-tight">
              {product.name}
            </h2>
            <div className="flex items-center gap-2 mb-6">
              <div className="flex text-[#fbbf24]">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill={i < 4 ? "currentColor" : "none"} /> // 4 out of 5 stars mock
                ))}
              </div>
              <span className="text-sm font-bold text-gray-700">4.7 Rating</span>
              <span className="text-sm text-gray-500">(5 customer reviews)</span>
            </div>

            {/* Description */}
            <p className="text-gray-500 text-sm leading-relaxed mb-8">
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s.
            </p>

            {/* Price & Quantity Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
              <div>
                <span className="block text-sm font-extrabold text-brand-dark mb-2">Price</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-brand-dark">${currentTotal}</span>
                  <span className="text-lg font-medium text-gray-400 line-through">${originalTotal}</span>
                </div>
              </div>

              <div>
                <span className="block text-sm font-extrabold text-brand-dark mb-2">Quantity</span>
                <div className="flex items-center gap-4">
                  <button onClick={handleDecrease} className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <Minus size={16} />
                  </button>
                  <span className="text-xl font-bold w-6 text-center">{quantity}</span>
                  <button onClick={handleIncrease} className="w-10 h-10 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-colors">
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 mb-8">
              {/*<button className="flex-1 bg-black text-white py-4 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg shadow-black/20">
                ADD TO CART
              </button>*/}
              <Link href="/cart" className="flex-1 flex justify-center bg-black text-white py-4 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg shadow-black/20">ADD TO CART</Link>
              <button className="px-6 py-4 rounded-lg border border-gray-300 font-bold text-sm flex items-center gap-2 hover:border-black transition-colors shrink-0">
                <Heart size={18} />
                <span className="hidden sm:block">Add To Wishlist</span>
              </button>
            </div>

            <hr className="border-gray-200 mb-6" />

            {/* Meta Information */}
            <div className="space-y-3 text-sm mb-6">
              <p><span className="font-extrabold text-brand-dark w-20 inline-block">SKU:</span> <span className="text-gray-500">PRT584E63A</span></p>
              <p><span className="font-extrabold text-brand-dark w-20 inline-block">Category:</span> <span className="text-gray-500">{product.category}, Jeans, Swimwear, Summer</span></p>
              <p><span className="font-extrabold text-brand-dark w-20 inline-block">Tags:</span> <span className="text-gray-500">{product.tag}, Athletic, Workwear, Accessories</span></p>
            </div>

            {/* Social Share */}
            <div className="flex items-center gap-4 text-gray-600 mt-auto">
              {/*<button className="hover:text-brand-dark transition-colors"><Facebook size={18} strokeWidth={2.5}/></button>*/}
              {/*<button className="hover:text-brand-dark transition-colors"><Twitter size={18} strokeWidth={2.5}/></button>*/}
              {/*<button className="hover:text-brand-dark transition-colors"><Youtube size={18} strokeWidth={2.5}/></button>*/}
              {/*<button className="hover:text-brand-dark transition-colors"><Linkedin size={18} strokeWidth={2.5}/></button>*/}
              {/*<button className="hover:text-brand-dark transition-colors"><Instagram size={18} strokeWidth={2.5}/></button>*/}
            </div>

          </div>
        </motion.div>
      </motion.div>

      {/* FULL SCREEN LIGHTBOX */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setIsLightboxOpen(false)}
          >
            <button 
              onClick={() => setIsLightboxOpen(false)}
              className="absolute top-6 right-6 z-10 text-white/50 hover:text-white transition-colors"
            >
              <X size={32} />
            </button>
            <motion.img 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={MOCK_IMAGES[activeImageIndex]} 
              alt="Zoomed Product" 
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}