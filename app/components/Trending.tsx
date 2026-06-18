'use client';

import { Heart, ShoppingBag } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';

// Mock data based on your screenshots
const trendingProducts = [
  { id: 1, name: 'Cozy Knit Cardigan Sweater', price: 78, discount: '20% OFF', color: 'bg-[#b886c1]', img: "https://pixio-react.vercel.app/assets/3-DFzNmbxq.png" }, // Purple
  { id: 2, name: 'Sophisticated Swagger Suit', price: 63, discount: '20% OFF', color: 'bg-[#5c7a9c]', img: "https://pixio-react.vercel.app/assets/3-DFzNmbxq.png" }, // Blue
  { id: 3, name: 'Classic Denim Skinny Jeans', price: 75, discount: '20% OFF', color: 'bg-[#d887b4]', img: "https://pixio-react.vercel.app/assets/3-DFzNmbxq.png" }, // Pink
  { id: 4, name: 'Athletic Mesh Sports Leggings', price: 74, discount: '20% OFF', color: 'bg-[#d97c36]', img: "https://pixio-react.vercel.app/assets/3-DFzNmbxq.png" }, // Orange
  { id: 5, name: 'Vintage Denim Overalls', price: 55, discount: '25% OFF', color: 'bg-[#e2a8b8]', img: "https://pixio-react.vercel.app/assets/3-DFzNmbxq.png" },
];

export default function Trending() {
  return (
    <section className="w-full bg-brand-bg py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-dark mb-2">
              What's Trending Now
            </h2>
            <p className="text-gray-600 font-medium">
              Discover the most trending products in Pixio.
            </p>
          </div>
          <button className="bg-black text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-gray-800 transition-colors shrink-0">
            View All
          </button>
        </div>

        {/* Swiper Carousel */}
        <div className="w-full -mx-4 px-4 sm:mx-0 sm:px-0">
          <Swiper
            modules={[FreeMode]}
            spaceBetween={24}
            slidesPerView={1.2} // Shows a peek of the next slide on mobile
            freeMode={true}
            breakpoints={{
              640: { slidesPerView: 2.2 },
              768: { slidesPerView: 3.2 },
              1024: { slidesPerView: 4 },
            }}
            className="w-full pb-8"
          >
            {trendingProducts.map((product) => (
              <SwiperSlide key={product.id} className="h-auto flex flex-col">
                
                {/* Product Image Card */}
                <div className="relative group w-full aspect-[4/5] rounded-3xl overflow-hidden mb-4 cursor-pointer">
                  {/* Placeholder for Image - Replace with next/image */}
                  {/*<div className={`w-full h-full ${product.color} transition-transform duration-700 group-hover:scale-105`}></div>*/}
                  <img
                    src={product.img}
                    alt={product.name} 
                    className="object-cover h-full w-full group-hover:scale-105 transition-transform duration-500" 
                  />
                  
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
                    <button className="bg-black text-white text-xs font-bold px-6 py-2.5 rounded-full whitespace-nowrap shadow-xl hover:bg-gray-800">
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
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

      </div>
    </section>
  );
}