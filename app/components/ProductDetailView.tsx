'use client';

import { useMemo, useState } from 'react';
import { Search, Star, Minus, Plus, Heart, Check } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper';
import { motion, AnimatePresence } from 'framer-motion';
import type { ProductDetail, VariantGroup, ProductAddon } from '@linkpe-storefront/sdk';
import { addToCart } from '@/lib/cart';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

const PLACEHOLDER_IMAGE =
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop';

type ReviewsSummary = { count: number; average_rating: number };

interface ProductDetailViewProps {
  product: ProductDetail;
  reviews?: ReviewsSummary;
  /** 'page' renders the standalone product page; 'modal' is used inside the quick-view overlay. */
  variant?: 'page' | 'modal';
}

function optionIsSelectable(o: VariantGroup['options'][number]): boolean {
  if (o.is_active === false) return false;
  if (o.stock_quantity !== null && o.stock_quantity !== undefined && o.stock_quantity <= 0) return false;
  return true;
}

export default function ProductDetailView({ product, reviews, variant = 'page' }: ProductDetailViewProps) {
  const galleryImages = useMemo(() => {
    const fromImages = (product.images ?? [])
      .slice()
      .sort((a, b) => a.display_order - b.display_order)
      .map((i) => i.url)
      .filter(Boolean);
    if (fromImages.length) return fromImages;
    if (product.image_url) return [product.image_url];
    return [PLACEHOLDER_IMAGE];
  }, [product.images, product.image_url]);

  const variantGroups = product.variant_groups ?? [];
  const addons = product.addons ?? [];

  // Default each variant group to its default (or first selectable) option.
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const g of variantGroups) {
      const def = g.options.find((o) => o.is_default && optionIsSelectable(o))
        ?? g.options.find(optionIsSelectable)
        ?? g.options[0];
      if (def) init[g.id] = def.id;
    }
    return init;
  });
  const [addonQty, setAddonQty] = useState<Record<string, number>>({});
  const [quantity, setQuantity] = useState(1);
  const [thumbsSwiper, setThumbsSwiper] = useState<SwiperClass | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [added, setAdded] = useState(false);

  // Resolve selected variant objects + their price adjustments.
  const selectedVariants = useMemo(() => {
    return variantGroups
      .map((g) => {
        const opt = g.options.find((o) => o.id === selectedOptions[g.id]);
        if (!opt) return null;
        return {
          group_id: g.id,
          group_name: g.name,
          option_id: opt.id,
          option_label: opt.label,
          price_adjustment: opt.price_adjustment ?? 0,
        };
      })
      .filter((v): v is NonNullable<typeof v> => v !== null);
  }, [variantGroups, selectedOptions]);

  const variantAdjustment = selectedVariants.reduce((sum, v) => sum + (v.price_adjustment ?? 0), 0);
  const addonSubtotal = addons.reduce((sum, a) => sum + a.price * (addonQty[a.id] ?? 0), 0);

  const unitPrice = product.price + variantAdjustment;
  const lineTotal = unitPrice * quantity + addonSubtotal * quantity;
  const hasMrp = product.mrp != null && product.mrp > product.price;
  const mrpTotal = hasMrp ? (product.mrp as number) * quantity : null;
  const discountPct = hasMrp ? Math.round((1 - product.price / (product.mrp as number)) * 100) : 0;

  const rating = reviews?.average_rating ?? 0;
  const reviewCount = reviews?.count ?? 0;

  function setAddon(addon: ProductAddon, qty: number) {
    const max = addon.max_quantity ?? Infinity;
    const clamped = Math.max(0, Math.min(qty, max));
    setAddonQty((prev) => ({ ...prev, [addon.id]: clamped }));
  }

  function handleAddToCart() {
    addToCart({
      product_id: product.id,
      quantity,
      selected_variants: selectedVariants.length ? selectedVariants : undefined,
      addons: addons
        .filter((a) => (addonQty[a.id] ?? 0) > 0)
        .map((a) => ({ addon_id: a.id, quantity: addonQty[a.id] })),
      name: product.name,
      slug: product.slug,
      unit_price: unitPrice,
      image_url: galleryImages[0] ?? null,
      variant_summary: selectedVariants.map((v) => v.option_label).join(' • ') || null,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  }

  const fmt = (n: number) =>
    `${product.currency === 'INR' ? '₹' : ''}${n.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;

  return (
    <div className={`relative w-full bg-white ${variant === 'modal' ? 'rounded-xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]' : 'flex flex-col md:flex-row gap-8'}`}>
      {/* LEFT: gallery */}
      <div className={`w-full md:w-1/2 bg-brand-secondary p-4 flex flex-col-reverse md:flex-row gap-4 ${variant === 'modal' ? 'h-[400px] md:h-auto' : 'rounded-xl md:h-[560px]'} overflow-hidden`}>
        <div className="w-full md:w-24 h-24 md:h-full shrink-0">
          <Swiper
            onSwiper={setThumbsSwiper}
            direction="horizontal"
            breakpoints={{ 768: { direction: 'vertical' } }}
            spaceBetween={10}
            slidesPerView={4}
            freeMode
            watchSlidesProgress
            modules={[FreeMode, Navigation, Thumbs]}
            className="w-full h-full quickview-thumbs"
          >
            {galleryImages.map((img, idx) => (
              <SwiperSlide
                key={idx}
                className="cursor-pointer opacity-60 hover:opacity-100 transition-opacity border-2 border-transparent [&.swiper-slide-thumb-active]:border-black [&.swiper-slide-thumb-active]:opacity-100 rounded-sm overflow-hidden"
              >
                <img src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div
          className="flex-1 h-full rounded-sm overflow-hidden relative group cursor-zoom-in"
          onClick={() => setIsLightboxOpen(true)}
        >
          <Swiper
            spaceBetween={10}
            navigation={false}
            thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
            modules={[FreeMode, Navigation, Thumbs]}
            onSlideChange={(swiper) => setActiveImageIndex(swiper.activeIndex)}
            className="w-full h-full"
          >
            {galleryImages.map((img, idx) => (
              <SwiperSlide key={idx}>
                <img src={img} alt={product.name} className="w-full h-full object-cover" />
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none z-10">
            <Search size={32} className="text-white drop-shadow-md" />
          </div>
        </div>
      </div>

      {/* RIGHT: details */}
      <div className={`w-full md:w-1/2 flex flex-col overflow-y-auto ${variant === 'modal' ? 'p-3 md:p-6 lg:p-10' : 'py-2'}`}>
        {discountPct > 0 && (
          <span className="bg-brand-accent text-white text-[10px] font-bold px-3 py-1.5 rounded-sm w-max mb-4 tracking-wider uppercase">
            SALE {discountPct}% OFF
          </span>
        )}

        <h1 className="text-2xl md:text-3xl font-extrabold text-brand-dark mb-3 leading-tight">{product.name}</h1>

        <div className="flex items-center gap-2 mb-6">
          <div className="flex text-[#fbbf24]">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill={i < Math.round(rating) ? 'currentColor' : 'none'} />
            ))}
          </div>
          {reviewCount > 0 ? (
            <>
              <span className="text-sm font-bold text-gray-700">{rating.toFixed(1)} Rating</span>
              <span className="text-sm text-gray-500">({reviewCount} customer review{reviewCount === 1 ? '' : 's'})</span>
            </>
          ) : (
            <span className="text-sm text-gray-500">No reviews yet</span>
          )}
        </div>

        {product.description && (
          <p className="text-gray-500 text-sm leading-relaxed mb-8 whitespace-pre-line">{product.description}</p>
        )}

        {/* Variant groups */}
        {variantGroups.map((g) => (
          <div key={g.id} className="mb-6">
            <span className="block text-sm font-extrabold text-brand-dark mb-2">{g.name}</span>
            <div className="flex flex-wrap gap-2">
              {g.options.map((o) => {
                const selectable = optionIsSelectable(o);
                const isSelected = selectedOptions[g.id] === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    disabled={!selectable}
                    onClick={() => setSelectedOptions((prev) => ({ ...prev, [g.id]: o.id }))}
                    className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${
                      isSelected ? 'border-brand-dark bg-brand-dark text-white' : 'border-gray-300 text-brand-dark hover:border-brand-dark'
                    } ${!selectable ? 'opacity-40 cursor-not-allowed line-through' : ''}`}
                  >
                    {o.label}
                    {o.price_adjustment ? ` (+${fmt(o.price_adjustment)})` : ''}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        {/* Add-ons */}
        {addons.length > 0 && (
          <div className="mb-6">
            <span className="block text-sm font-extrabold text-brand-dark mb-2">Add-ons</span>
            <div className="space-y-2">
              {addons.map((a) => {
                const qty = addonQty[a.id] ?? 0;
                return (
                  <div key={a.id} className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2">
                    <span className="text-sm text-brand-dark">
                      {a.name} <span className="text-gray-400">· {fmt(a.price)}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => setAddon(a, qty - 1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                        <Minus size={14} />
                      </button>
                      <span className="w-6 text-center text-sm font-bold">{qty}</span>
                      <button type="button" onClick={() => setAddon(a, qty + 1)} className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200">
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Price + quantity */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div>
            <span className="block text-sm font-extrabold text-brand-dark mb-2">Price</span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-brand-dark">{fmt(lineTotal)}</span>
              {mrpTotal != null && <span className="text-lg font-medium text-gray-400 line-through">{fmt(mrpTotal)}</span>}
            </div>
          </div>
          <div>
            <span className="block text-sm font-extrabold text-brand-dark mb-2">Quantity</span>
            <div className="flex items-center gap-4">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-10 h-10 bg-brand-dark text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                <Minus size={16} />
              </button>
              <span className="text-xl font-bold w-6 text-center">{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)} className="w-10 h-10 bg-brand-dark text-white rounded-full flex items-center justify-center hover:opacity-90 transition-opacity">
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={handleAddToCart}
            className="flex-1 flex justify-center items-center gap-2 bg-brand-dark text-white py-4 rounded-lg font-bold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-black/20"
          >
            {added ? (<><Check size={18} /> ADDED TO CART</>) : 'ADD TO CART'}
          </button>
          <button className="px-6 py-4 rounded-lg border border-gray-300 font-bold text-sm flex items-center gap-2 hover:border-brand-dark transition-colors shrink-0">
            <Heart size={18} />
            <span className="hidden sm:block">Add To Wishlist</span>
          </button>
        </div>

        <hr className="border-gray-200 mb-6" />

        <div className="space-y-3 text-sm">
          {product.brand_name && (
            <p><span className="font-extrabold text-brand-dark w-20 inline-block">Brand:</span> <span className="text-gray-500">{product.brand_name}</span></p>
          )}
          {product.stock_quantity != null && (
            <p><span className="font-extrabold text-brand-dark w-20 inline-block">Stock:</span> <span className="text-gray-500">{product.stock_quantity > 0 ? `${product.stock_quantity} available` : 'Out of stock'}</span></p>
          )}
          {product.pricing_type === 'recurring' && product.recurring_frequency && (
            <p><span className="font-extrabold text-brand-dark w-20 inline-block">Billing:</span> <span className="text-gray-500 capitalize">{product.recurring_frequency} subscription</span></p>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.img
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              src={galleryImages[activeImageIndex] ?? galleryImages[0]}
              alt={product.name}
              className="max-w-full max-h-full object-contain shadow-2xl rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
