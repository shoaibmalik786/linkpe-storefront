import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import CheckoutClient from './CheckoutClient';

import {
  getCategories,
  getStore,
  isLinkpeConfigured,
} from '@/lib/linkpe';

export const revalidate = 60;

export default async function CheckoutPage() {
  const configured = isLinkpeConfigured();

  const [store, categories] = configured
    ? await Promise.all([
        getStore().catch(() => null),
        getCategories().catch(() => []),
      ])
    : [null, []];

  const bannerUrl = store?.store_banner_url ?? null;
  const storeName = store?.business_name ?? 'Store';

  return (
    <main className="min-h-screen bg-[#fefcfa] text-gray-900 pb-24">
      <SiteHeader
        store={store}
        categories={categories}
      />

      <section
        className="relative w-full h-48 md:h-64 bg-[#c8a98c] flex flex-col items-center justify-center bg-cover bg-center mb-12"
        style={{
          backgroundImage: `url(${bannerUrl})`,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">
            {storeName}
          </h1>
        </div>
      </section>

      <CheckoutClient />

      <SiteFooter />
    </main>
  );
}