import Link from 'next/link';
import { Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@linkpe-storefront/sdk';

function formatPrice(amount: number, currency: string): string {
  return `${currency === 'INR' ? '₹' : ''}${amount.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function productImage(p: Product): string | null {
  const fromImages = (p.images ?? []).slice().sort((a, b) => a.display_order - b.display_order)[0]?.url;
  return fromImages ?? p.image_url ?? null;
}

/**
 * Storefront product card. Links to /product/[slug] — on in-app navigation this
 * opens the quick-view modal (intercepting route); direct/refresh hits the full page.
 */
export default function ProductCard({ product }: { product: Product }) {
  const handle = product.slug ?? product.id;
  const img = productImage(product);
  const hasMrp = product.mrp != null && product.mrp > product.price;
  const discountPct = hasMrp ? Math.round((1 - product.price / (product.mrp as number)) * 100) : 0;

  return (
    <div className="flex flex-col">
      <Link
        href={`/product/${handle}`}
        className="relative group w-full aspect-[4/5] rounded-3xl overflow-hidden mb-4 cursor-pointer block bg-gray-100"
      >
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={img} alt={product.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">{product.name}</div>
        )}

        {discountPct > 0 && (
          <div className="absolute top-4 left-4 bg-white text-brand-dark text-[10px] font-bold px-3 py-1.5 rounded-sm z-10 shadow-sm">
            GET {discountPct}% OFF
          </div>
        )}

        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          <span className="w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-500 shadow-sm">
            <Heart size={16} />
          </span>
          <span className="w-9 h-9 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-500 shadow-sm">
            <ShoppingBag size={16} />
          </span>
        </div>

        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <span className="bg-brand-dark text-white text-xs font-bold px-6 py-2.5 rounded-full whitespace-nowrap shadow-xl">
            QUICK VIEW
          </span>
        </div>
      </Link>

      <div className="flex items-start justify-between gap-4 mt-auto">
        <Link href={`/product/${handle}`} className="text-brand-dark font-bold text-base leading-tight hover:text-brand-red transition-colors">
          {product.name}
        </Link>
        <div className="shrink-0 text-right">
          <span className="font-extrabold text-brand-dark text-base">{formatPrice(product.price, product.currency)}</span>
          {hasMrp && (
            <span className="block text-xs text-gray-400 line-through">{formatPrice(product.mrp as number, product.currency)}</span>
          )}
        </div>
      </div>
    </div>
  );
}
