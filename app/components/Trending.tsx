'use client';

import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode } from 'swiper/modules';
import ProductCard from './ProductCard';
import type { Product } from '@linkpe-storefront/sdk';

import 'swiper/css';
import 'swiper/css/free-mode';

// Best-selling products (from the store's cached ranking) shown as a carousel.
export default function Trending({ products }: { products: Product[] }) {
  if (!products.length) return null;

  return (
    <section className="w-full bg-brand-bg py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <h2 className="text-3xl lg:text-4xl font-extrabold text-brand-dark mb-2">What&apos;s Trending Now</h2>
            <p className="text-gray-600 font-medium">Our best-selling products right now.</p>
          </div>
          <Link
            href="/shop"
            className="bg-brand-dark text-white px-8 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity shrink-0"
          >
            View All
          </Link>
        </div>

        <div className="w-full -mx-4 px-4 sm:mx-0 sm:px-0">
          <Swiper
            modules={[FreeMode]}
            spaceBetween={24}
            slidesPerView={1.2}
            freeMode
            breakpoints={{ 640: { slidesPerView: 2.2 }, 768: { slidesPerView: 3.2 }, 1024: { slidesPerView: 4 } }}
            className="w-full pb-8"
          >
            {products.map((p) => (
              <SwiperSlide key={p.id} className="h-auto">
                <ProductCard product={p} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
