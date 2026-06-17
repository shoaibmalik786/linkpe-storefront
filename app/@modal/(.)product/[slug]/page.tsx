// Intercepted product route. On client-side navigation (clicking a product card
// that links to /product/[slug]), this renders the product as a quick-view modal
// over the current page. On hard navigation / refresh / shared link, the real
// app/product/[slug]/page.tsx renders the full page instead.

import { notFound } from 'next/navigation';
import ProductModal from '@/app/components/ProductModal';
import ProductDetailView from '@/app/components/ProductDetailView';
import { getProductByHandle, getProductReviews, isLinkpeConfigured } from '@/lib/linkpe';

type Params = { slug: string };

export default async function InterceptedProductModal({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  if (!isLinkpeConfigured()) notFound();

  const product = await getProductByHandle(slug);
  if (!product) notFound();

  const reviews = await getProductReviews(product.id).catch(() => null);

  return (
    <ProductModal>
      <div className="overflow-y-auto max-h-[90vh] rounded-xl">
        <ProductDetailView product={product} reviews={reviews?.summary} variant="modal" />
      </div>
    </ProductModal>
  );
}
