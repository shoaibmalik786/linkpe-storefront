import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import TrackOrderClient from '../components/TrackOrderClient';

import {
  getStore,
  getStoreReviews,
  isLinkpeConfigured,
  listProducts,
} from '@/lib/linkpe';

export const revalidate = 60;

export default async function TrackOrderPage() {
  const configured = isLinkpeConfigured();

  const [store, products, categories, trending, storeReviews] =
    configured
      ? await Promise.all([
          getStore().catch(() => null),

          listProducts({ limit: 24 })
            .then((r) => r.data)
            .catch(() => []),

          listProducts({
            sort: 'best_selling',
            limit: 8,
          })
            .then((r) => r.data)
            .catch(() => []),
        ])
      : [null, [], [], [], null];

  const bannerUrl = store?.store_banner_url ?? null;
  const storeName = store?.business_name ?? 'Store';

  return (
    <main className="min-h-screen bg-brand-bg text-brand-dark">
      <SiteHeader />
      <section
        className="relative w-full h-48 md:h-64 bg-[#c8a98c] flex flex-col items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url(${bannerUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            Track Your Order
          </h1>
          <p className="text-sm md:text-base opacity-90">
            Check your latest order status and shipment updates
          </p>
        </div>
      </section>
      <TrackOrderClient
        products={products}
        categories={categories}
        trending={trending}
        storeReviews={storeReviews}
      />
      <SiteFooter />
    </main>
  );
}