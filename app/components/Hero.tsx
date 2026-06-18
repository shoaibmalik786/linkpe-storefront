'use client';

import { motion, type Variants } from 'framer-motion';
import { Sparkles, Heart } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Store } from '@linkpe-storefront/sdk';

export default function Hero({ store }: { store?: Store | null }) {
  const hero = store?.hero;
  const eyebrow = hero?.show_eyebrow ? hero?.eyebrow : null;
  const heading = hero?.heading || store?.business_name || 'Your Ultimate Online Store';
  const subheading = hero?.hide_subheading ? null : hero?.subheading;
  const ctaLabel = hero?.cta_label || 'Shop Now';
  const ctaUrl = hero?.cta_url || '/shop';
  const bannerUrl = store?.store_banner_url ?? null;
  const storeName = store?.business_name ?? 'Store';

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
  };
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  };

  // ── Full-bleed banner hero (used when the store has a banner image) ──
  if (bannerUrl) {
    return (
      <section className="relative w-full">
        <div className="relative w-full h-[460px] md:h-[560px] lg:h-[640px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bannerUrl} alt={storeName} className="absolute inset-0 h-full w-full object-cover" />
          {/* Left-to-right dark gradient so the overlaid text stays readable. */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/45 to-black/10" />

          <motion.div
            className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-center px-4 sm:px-6 lg:px-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {eyebrow && (
              <motion.span
                variants={itemVariants}
                className="mb-4 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-red"
              >
                <Sparkles className="h-4 w-4" fill="currentColor" /> {eyebrow}
              </motion.span>
            )}

            <motion.h1
              variants={itemVariants}
              className="mb-5 max-w-2xl text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-7xl"
            >
              {heading}
            </motion.h1>

            {subheading && (
              <motion.p variants={itemVariants} className="mb-8 max-w-xl text-base text-white/80 lg:text-lg">
                {subheading}
              </motion.p>
            )}

            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
              <Link
                href={ctaUrl}
                className="px-8 py-3.5 bg-transparent border-2 border-white text-white text-sm font-bold rounded-full hover:bg-white hover:text-brand-dark transition-colors"
              >
                {ctaLabel}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    );
  }

  // ── Default decorative composition (no store banner set) ──
  return (
    <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 pt-[30px] pb-[50px] h-[700px] flex flex-col lg:flex-row items-center justify-between">
      {/* Left Content */}
      <motion.div className="w-full lg:w-1/2 z-10" variants={containerVariants} initial="hidden" animate="visible">
        {eyebrow && (
          <motion.span
            variants={itemVariants}
            className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-widest text-brand-red mb-4"
          >
            <Sparkles className="w-4 h-4" fill="currentColor" /> {eyebrow}
          </motion.span>
        )}

        <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6">
          {heading}
        </motion.h1>

        {subheading && (
          <motion.p variants={itemVariants} className="text-lg text-gray-600 mb-8 font-medium">
            {subheading}
          </motion.p>
        )}

        <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
          <Link
            href={ctaUrl}
            className="px-8 py-3.5 bg-brand-dark text-white text-sm font-bold rounded-full hover:opacity-90 transition-opacity"
          >
            {ctaLabel}
          </Link>
          <Link
            href="/shop"
            className="px-8 py-3.5 bg-transparent border-2 border-brand-dark text-brand-dark text-sm font-bold rounded-full hover:bg-brand-dark hover:text-white transition-colors"
          >
            VIEW PRODUCTS
          </Link>
        </motion.div>
      </motion.div>

      {/* Right: template decorative composition */}
      <div className="w-full lg:w-1/2 max-w-[41.66666667%] relative mt-16 lg:mt-0 flex justify-center items-center">
        <div className="banner-media">
          <div className="shap" />
          <div className="border-shap" />
          <div className="border-shap2" />
          <div className="img-preview">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/pic1-Dc74E7U4.png" alt={storeName} />
          </div>

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="bnr-content-bx slideskew"
          >
            <div className="dz-media w-16 h-16 bg-purple-200 rounded-lg shrink-0 relative">
              <Image src="/images/1-Cx9eAfJp.png" alt="Featured" fill className="object-cover w-12 h-12 bg-purple-200 rounded-lg shrink-0" />
            </div>
            <div className="dz-info">
              <h5 className="dz-title">Cozy Knit Cardigan</h5>
              <h6 className="price text-primary">$80</h6>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
            className="bnr-customer-bx slideskew"
          >
            <Heart className="w-10 h-10 lg:w-14 lg:h-14 mr-2 dz-heart" fill="currentColor" />
            <ul>
              <li className="customer-image"><img alt="testimonial" src="https://pixio-react.vercel.app/assets/testimonial1-DeRDcKB6.jpg" /></li>
              <li className="customer-image"><img alt="testimonial" src="https://pixio-react.vercel.app/assets/testimonial2-D4YAS0Yr.jpg" /></li>
              <li className="customer-image"><img alt="testimonial" src="https://pixio-react.vercel.app/assets/testimonial3-vzKjBPdX.jpg" /></li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
