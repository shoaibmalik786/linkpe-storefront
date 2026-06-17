// Server wrapper that loads store branding + categories and renders the Footer.
// Mirrors SiteHeader; reads are request-deduped via React cache() in lib/linkpe.
import Footer from './Footer';
import { getCategories, getStore, isLinkpeConfigured } from '@/lib/linkpe';

export default async function SiteFooter() {
  const configured = isLinkpeConfigured();
  const [store, categories] = configured
    ? await Promise.all([getStore().catch(() => null), getCategories().catch(() => [])])
    : [null, []];

  return <Footer store={store} categories={categories} />;
}
