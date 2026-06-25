'use client';

import { useState } from 'react';

import Link from 'next/link';

import { useRouter } from 'next/navigation';

import {
  ArrowRight,
  LoaderCircle,
  Phone,
  Search,
  Truck,
} from 'lucide-react';

import { formatCurrency } from '@/lib/utils/format';

type Props = {
  products?: any[];
  categories?: any[];
  trending?: any[];
  storeReviews?: any;
  store?: any;
};

type Order = {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  description?: string | null;
  paid_at?: string | null;
  store_username?: string | null;
  cart_items?: {
    name?: string | null;
    quantity?: number | string | null;
    variant_summary?: string | null;
  }[];
};

function getStatusMeta(status?: string | null) {
  if (status === 'delivered') {
    return {
      label: 'Delivered',
      className: 'bg-emerald-50 text-emerald-700',
    };
  }

  if (status === 'shipped') {
    return {
      label: 'In transit',
      className: 'bg-sky-50 text-sky-700',
    };
  }

  if (status === 'processing') {
    return {
      label: 'Ready to dispatch',
      className: 'bg-indigo-50 text-indigo-700',
    };
  }

  if (status === 'paid') {
    return {
      label: 'Paid',
      className: 'bg-amber-50 text-amber-700',
    };
  }

  return {
    label: 'Order placed',
    className: 'bg-neutral-100 text-neutral-700',
  };
}

export default function TrackOrderClient({
  store,
}: Props) {
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');

  const [loading, setLoading] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);

  const [error, setError] = useState('');

  async function handleTrack(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    setError('');

    setOrders([]);

    if (!/^\d{10}$/.test(phoneNumber)) {
      setError('Please enter a valid 10-digit mobile number');

      setLoading(false);

      return;
    }

    try {
      const response = await fetch('/api/track-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          phoneNumber,
        }),
      });

      const data = await response.json();

      if (data.success) {
        if (data.orders.length === 0) {
          setError(
            'No orders found with this mobile number'
          );
        } else if (data.orders.length === 1) {
          router.push(
            `/track-order/${data.orders[0].id}?phone=${encodeURIComponent(phoneNumber)}`
          );
        } else {
          setOrders(data.orders);
        }
      } else {
        setError(data.error || 'Failed to track order');
      }
    } catch {
      setError(
        'Failed to track order. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-[min(1680px,calc(100vw-32px))] px-4 py-10 sm:px-6 lg:px-8">
      <section className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div className="max-w-xl pt-4">
          <div className="inline-flex rounded-none border border-black/8 bg-white px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-neutral-500 shadow-sm">
            Order tracking
          </div>

          <h1
            className="mt-6 text-5xl font-semibold uppercase leading-[1.05] tracking-wide text-neutral-950 md:text-6xl"
            style={{
              fontFamily:
                'var(--font-cormorant), serif',
            }}
          >
            Track Your Order
          </h1>

          <p className="mt-6 max-w-lg text-base leading-8 text-neutral-600 md:text-lg">
            Enter the mobile number used at checkout
            to find your order and see its latest
            status.
          </p>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <div className="rounded-none border border-black/8 bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-none bg-[var(--theme-surface)] text-neutral-900">
                <Phone className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-neutral-950">
                Use your order phone
              </h3>

              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Search with the same number shared
                during checkout.
              </p>
            </div>

            <div className="rounded-none border border-black/8 bg-white p-5 shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
              <div className="flex h-12 w-12 items-center justify-center rounded-none bg-[var(--theme-surface)] text-neutral-900">
                <Truck className="h-5 w-5" />
              </div>

              <h3 className="mt-4 text-base font-semibold text-neutral-950">
                See shipment progress
              </h3>

              <p className="mt-2 text-sm leading-7 text-neutral-600">
                Open the order page to view the latest
                delivery updates.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white border border-black/10 p-8 shadow-sm">
            <form onSubmit={handleTrack} className="space-y-5">
              <div>
                <label className="block text-sm font-medium mb-2 text-black">
                  Mobile Number
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2">
                    <Phone className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) =>
                      setPhoneNumber(
                        e.target.value.replace(/\D/g, '').slice(0, 10)
                      )
                    }
                    placeholder="Enter 10-digit mobile number"
                    maxLength={10}
                    className="w-full border border-gray-200 pl-12 pr-4 py-4 text-lg text-black outline-none transition-all focus:border-black"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Use the same mobile number used during checkout
                </p>
              </div>
              {error && (
                <div className="border border-red-200 bg-red-50 p-4 text-red-600 text-sm">
                  {error}
                </div>
              )}
              <button
                type="submit"
                disabled={loading || phoneNumber.length !== 10}
                className="w-full bg-black text-white py-4 font-semibold flex items-center justify-center gap-2 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <LoaderCircle className="w-5 h-5 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-5 h-5" />
                    Track Order
                  </>
                )}
              </button>
            </form>
          </div>

          {orders.length > 0 && (
            <div className="rounded-none border border-black/8 bg-white p-6 shadow-[0_22px_60px_rgba(15,23,42,0.06)] md:p-8">
              <h2
                className="text-3xl font-semibold uppercase tracking-wide text-neutral-950"
                style={{
                  fontFamily:
                    'var(--font-cormorant), serif',
                }}
              >
                Your Orders
              </h2>

              <p className="mt-2 text-sm leading-7 text-neutral-600">
                We found {orders.length} order(s)
                with this mobile number.
              </p>

              <div className="mt-6 space-y-3">
                {orders.map((order) => {
                  const orderDate = order.paid_at
                    ? new Date(order.paid_at)
                    : new Date(order.created_at);

                  const statusMeta = getStatusMeta(
                    order.status
                  );

                  return (
                    <Link
                      key={order.id}
                      href={`/track-order/${order.id}?phone=${encodeURIComponent(phoneNumber)}`}
                      className="block rounded-none border border-black/8 bg-[var(--theme-surface)] p-5 transition-all hover:border-black/15 hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="truncate text-base font-semibold text-neutral-950">
                              {order.description ||
                                'Order'}
                            </p>

                            <span
                              className={`rounded-none px-2.5 py-1 text-xs font-medium ${statusMeta.className}`}
                            >
                              {statusMeta.label}
                            </span>
                          </div>

                          {order.cart_items &&
                            order.cart_items.length >
                              0 && (
                              <div className="mt-1.5 space-y-0.5">
                                {order.cart_items.map(
                                  (item, idx) => (
                                    <p
                                      key={idx}
                                      className="text-sm text-neutral-500"
                                    >
                                      {item.name}

                                      {item.quantity &&
                                      Number(
                                        item.quantity
                                      ) > 1
                                        ? ` ×${item.quantity}`
                                        : ''}

                                      {item.variant_summary
                                        ? ` · ${item.variant_summary}`
                                        : ''}
                                    </p>
                                  )
                                )}
                              </div>
                            )}

                          <p className="mt-1.5 text-sm text-neutral-500">
                            Order #
                            {order.id.slice(0, 8)}
                          </p>

                          <p className="mt-0.5 text-sm text-neutral-500">
                            {orderDate.toLocaleDateString(
                              'en-IN',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}
                          </p>
                        </div>

                        <div className="flex items-center justify-between gap-4 md:block md:text-right">
                          <p className="text-xl font-semibold tracking-[-0.03em] text-neutral-950">
                            {formatCurrency(
                              Number(order.amount || 0)
                            )}
                          </p>

                          <div className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-neutral-900">
                            <span>View Order</span>

                            <ArrowRight className="h-4 w-4" />
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="rounded-none border border-black/8 bg-white px-6 py-5 text-center shadow-[0_16px_36px_rgba(15,23,42,0.04)]">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Need help?
            </h3>

            <p className="mt-3 text-sm leading-7 text-neutral-600">
              If you can&apos;t find your order,
              contact{' '}
              {store?.business_name ||
                'our support team'}{' '}
              directly or reopen the checkout link
              you used earlier.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
