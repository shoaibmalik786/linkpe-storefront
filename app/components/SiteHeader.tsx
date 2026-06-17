// Server wrapper that loads store branding + categories once and renders the
// interactive Header. Used on every page instead of <Header /> directly, so the
// header stays data-driven without prop-drilling. Reads are request-deduped via
// React cache() in lib/linkpe, so rendering this alongside a page that also
// fetches store/categories doesn't double-hit the API.
import Header from './Header';
import { getCategories, getStore, isLinkpeConfigured } from '@/lib/linkpe';

export default async function SiteHeader() {
  const configured = isLinkpeConfigured();
  const [store, categories] = configured
    ? await Promise.all([getStore().catch(() => null), getCategories().catch(() => [])])
    : [null, []];

  return <Header store={store} categories={categories} />;
}
