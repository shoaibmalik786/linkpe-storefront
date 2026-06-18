import SiteHeader from './components/SiteHeader';
import Hero from './components/Hero';
import Categories from './components/Categories';
import Trending from './components/Trending';
import VideoBanner from './components/VideoBanner';
import PopularProducts from './components/PopularProducts';
import TrustedPartners from './components/TrustedPartners';
import SiteFooter from './components/SiteFooter';
import { getCategories, getStore, isLinkpeConfigured, listProducts } from '@/lib/linkpe';

export const revalidate = 60;

export default async function Home() {
  const configured = isLinkpeConfigured();

  // Fetch the storefront data once on the server and pass it to the sections.
  // Each call is independently guarded so one failure doesn't blank the page.
  const [store, products, categories] = configured
    ? await Promise.all([
        getStore().catch(() => null),
        listProducts({ limit: 24 }).then((r) => r.data).catch(() => []),
        getCategories().catch(() => []),
      ])
    : [null, [], []];

  return (
    <main className="min-h-screen bg-brand-bg text-brand-dark overflow-hidden">
      <SiteHeader />
      <Hero store={store} />
      <Categories categories={categories} />
      <Trending />
      <VideoBanner />
      <PopularProducts products={products} categories={categories} />
      <TrustedPartners />
      <SiteFooter />
    </main>
  );
}