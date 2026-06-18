'use client';

import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import type { Store, StoreReview, StoreReviewsResponse } from '@linkpe-storefront/sdk';

// Social-proof band — keeps the template's gradient card + rotating badge + two
// scrolling rows, but fills them with the store's real reviews. When there are
// no reviews yet, it falls back to trust badges so the section is never empty.
export default function TrustedPartners({
  reviews,
  store,
}: {
  reviews?: StoreReviewsResponse;
  store?: Store | null;
}) {
  const reviewList = reviews?.data ?? [];
  const count = reviews?.summary.count ?? 0;
  const hasReviews = reviewList.length > 0;

  // `fulfilment` may not be declared on the installed SDK's Store type yet.
  const codEnabled = (store as (Store & { fulfilment?: { cod_enabled?: boolean } }) | null | undefined)?.fulfilment?.cod_enabled;
  const badges = [
    codEnabled ? 'Cash on Delivery' : null,
    'Secure Checkout',
    'Fast Delivery',
    'Genuine Products',
    'Easy Returns',
    store?.contact?.phone ? 'Dedicated Support' : null,
  ].filter((b): b is string => Boolean(b));

  const heading = hasReviews
    ? `Loved by ${count}+ Happy Customer${count === 1 ? '' : 's'}`
    : `Why Shop With ${store?.business_name ?? 'Us'}`;
  const badgeWord = hasReviews ? 'REVIEWS' : 'TRUSTED';

  const items = hasReviews ? reviewList : badges;
  if (items.length === 0) return null;

  const ReviewPill = ({ r }: { r: StoreReview }) => (
    <div className="bg-white rounded-2xl px-8 py-4 min-w-[260px] max-w-[340px] shadow-sm flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <span className="flex text-brand-accent">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} size={14} fill={i < Math.round(r.rating) ? 'currentColor' : 'none'} className={i < Math.round(r.rating) ? '' : 'text-gray-300'} />
          ))}
        </span>
        {r.reviewer_name && <span className="text-sm font-bold text-brand-dark truncate">{r.reviewer_name}</span>}
      </div>
      {r.body && <p className="text-xs text-gray-500 truncate max-w-[300px]">{r.body}</p>}
    </div>
  );

  const BadgePill = ({ label }: { label: string }) => (
    <div className="bg-white rounded-2xl px-10 py-5 flex items-center justify-center min-w-[200px] shadow-sm">
      <span className="text-lg font-bold text-brand-dark whitespace-nowrap">{label}</span>
    </div>
  );

  const renderRow = (key: string) =>
    [...items, ...items, ...items].map((item, index) =>
      hasReviews ? (
        <ReviewPill key={`${key}-${index}`} r={item as StoreReview} />
      ) : (
        <BadgePill key={`${key}-${index}`} label={item as string} />
      )
    );

  return (
    <section className="w-full px-4 sm:px-6 lg:px-8 py-10 ">
      <div className="max-w-7xl partner_section mx-auto rounded-[3rem] overflow-hidden bg-brand-dark py-16 lg:py-24 relative">
        <div className="px-8 lg:px-16 flex flex-col md:flex-row items-center justify-between gap-8 mb-16 relative z-10">
          <h2 className="text-4xl lg:text-5xl font-extrabold text-white leading-tight max-w-xl text-center md:text-left drop-shadow-sm">
            {heading}
          </h2>

          <div className="relative w-32 h-32 lg:w-40 lg:h-40 bg-white rounded-full flex items-center justify-center shrink-0 shadow-xl">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: 'linear' }}
              className="absolute w-full h-full flex items-center justify-center"
            >
              <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] overflow-visible">
                <path id="partnerCircle" d="M 50, 50 m -34, 0 a 34,34 0 1,1 68,0 a 34,34 0 1,1 -68,0" fill="transparent" />
                <text className="text-[12px] font-bold tracking-widest uppercase text-brand-dark fill-current">
                  <textPath href="#partnerCircle" startOffset="0%">
                    {`${badgeWord} • ${badgeWord} • `}
                  </textPath>
                </text>
              </svg>
            </motion.div>

            <div className="text-brand-dark">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0L14.59 9.41L24 12L14.59 14.59L12 24L9.41 14.59L0 12L9.41 9.41L12 0Z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 relative z-10">
          <div className="flex overflow-hidden group">
            <motion.div
              className="flex gap-6 whitespace-nowrap pl-6 items-stretch"
              animate={{ x: ['0%', '-50%'] }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 30 }}
            >
              {renderRow('row1')}
            </motion.div>
          </div>

          <div className="flex overflow-hidden group">
            <motion.div
              className="flex gap-6 whitespace-nowrap pl-6 items-stretch"
              animate={{ x: ['-50%', '0%'] }}
              transition={{ repeat: Infinity, ease: 'linear', duration: 35 }}
            >
              {renderRow('row2')}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
