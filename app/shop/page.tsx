import Link from 'next/link';
import SiteHeader from '../components/SiteHeader';
import SiteFooter from '../components/SiteFooter';
import ShopClient from './ShopClient';
import { getCategories, getStore, isLinkpeConfigured, listProducts } from '@/lib/linkpe';

export const revalidate = 60;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { category, search } = await searchParams;

  const configured = isLinkpeConfigured();
  const [store, products, categories] = configured
    ? await Promise.all([
        getStore().catch(() => null),
        listProducts({ limit: 100 }).then((r) => r.data).catch(() => []),
        getCategories().catch(() => []),
      ])
    : [[], []];

  const bannerUrl = store?.store_banner_url ?? null;
  const storeName = store?.business_name ?? 'Store';
  console.log("bannerUrl", storeName)
  return (
    <main className="min-h-screen bg-brand-bg text-brand-dark pb-20">
      <SiteHeader />

      <section
        className="relative w-full h-48 md:h-64 bg-[#c8a98c] flex flex-col items-center justify-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      >
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Shop</h1>
          {/*<div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white">Shop</span>
          </div>*/}
        </div>
      </section>

      <ShopClient
        products={products}
        categories={categories}
        initialCategorySlug={category ?? null}
        initialSearch={search ?? ''}
      />

      <SiteFooter />
    </main>
  );
}
