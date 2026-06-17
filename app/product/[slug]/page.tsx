import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import SiteHeader from '@/app/components/SiteHeader';
import SiteFooter from '@/app/components/SiteFooter';
import ProductDetailView from '@/app/components/ProductDetailView';
import { getProductByHandle, getProductReviews, isLinkpeConfigured } from '@/lib/linkpe';

// Re-render at most once a minute (ISR). Cache Components is off, so this is the
// caching lever; cart/checkout stay dynamic via their own route handlers.
export const revalidate = 60;

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  if (!isLinkpeConfigured()) return { title: 'Product' };

  const product = await getProductByHandle(slug).catch(() => null);
  if (!product) return { title: 'Product not found' };

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || '';
  const url = `${siteUrl}/product/${product.slug ?? product.id}`;
  const image = product.images?.[0]?.url ?? product.image_url ?? undefined;
  const description =
    product.description?.slice(0, 160) ?? `Buy ${product.name} online.`;

  return {
    title: product.name,
    description,
    alternates: siteUrl ? { canonical: url } : undefined,
    openGraph: {
      type: 'website',
      title: product.name,
      description,
      url: siteUrl ? url : undefined,
      images: image ? [{ url: image }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  if (!isLinkpeConfigured()) {
    return (
      <>
        <SiteHeader />
        <main className="flex-1 max-w-3xl mx-auto px-4 py-24 text-center">
          <h1 className="text-2xl font-extrabold text-brand-dark mb-3">Storefront not configured</h1>
          <p className="text-gray-500">
            Add <code className="font-mono">LINKPE_KEY_ID</code> and <code className="font-mono">LINKPE_KEY_SECRET</code>{' '}
            to <code className="font-mono">.env.local</code> (see <code className="font-mono">.env.example</code>) to load products.
          </p>
        </main>
        <SiteFooter />
      </>
    );
  }

  const product = await getProductByHandle(slug);
  if (!product) notFound();

  const reviews = await getProductReviews(product.id).catch(() => null);

  return (
    <>
      <SiteHeader />
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
        <nav className="text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-brand-dark">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/shop" className="hover:text-brand-dark">Shop</Link>
          <span className="mx-2">/</span>
          <span className="text-brand-dark font-semibold">{product.name}</span>
        </nav>
        <ProductDetailView product={product} reviews={reviews?.summary} variant="page" />
      </main>
      <SiteFooter />
    </>
  );
}
