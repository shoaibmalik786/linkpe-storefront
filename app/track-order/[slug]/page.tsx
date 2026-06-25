import SiteHeader from '../../components/SiteHeader';
import SiteFooter from '../../components/SiteFooter';
import OrderTrackingContent from '../../components/OrderTrackingContent';
import { getStore, isLinkpeConfigured } from '@/lib/linkpe';

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ phone?: string }>;
};

export const revalidate = 60;

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const sp = searchParams ? await searchParams : {};
  const phone = sp?.phone ?? '';
  const configured = isLinkpeConfigured();

  const [store] = configured
    ? await Promise.all([
        getStore().catch(() => null),
      ])
    : [null];

  const bannerUrl = store?.store_banner_url ?? null;
  const storeName = store?.business_name ?? 'Store';

  return (
    <main className="min-h-screen bg-brand-bg text-brand-dark">
      <SiteHeader />

      <section
        className="relative flex h-48 w-full flex-col items-center justify-center bg-[#c8a98c] bg-cover bg-center md:h-64"
        style={{
          backgroundImage: bannerUrl ? `url(${bannerUrl})` : undefined,
        }}
      >
        <div className="absolute inset-0 bg-black/30" />

        <div className="relative z-10 px-4 text-center text-white">
          <h1 className="mb-4 text-3xl font-extrabold md:text-5xl">
            Order Tracking
          </h1>

          <p className="text-sm opacity-90 md:text-base">
            Check your order status and shipment updates
          </p>
        </div>
      </section>

      <OrderTrackingContent
        username={store?.username || ''}
        slug={slug}
        phone={phone}
      />

      <SiteFooter />
    </main>
  );
}
