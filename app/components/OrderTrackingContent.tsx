'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';

import {
  AlertCircle,
  Check,
  Clock,
  ExternalLink,
  LoaderCircle,
  MapPin,
  Package,
  Truck,
} from 'lucide-react';

import { formatCurrency } from '@/lib/utils/format';

type OrderItem = {
  name?: string | null;
  quantity?: number | string | null;
  variant_summary?: string | null;
  addons?: Array<{
    addon_id: string;
    name: string;
    price: number | string;
    quantity: number;
  }> | null;
};

type Shipment = {
  id: string;
  status: string;
  awb_code?: string | null;
  courier_name?: string | null;
  tracking_url?: string | null;
  expected_delivery_date?: string | null;
  out_for_delivery_at?: string | null;
  delivered_at?: string | null;
  picked_up_at?: string | null;
  in_transit_at?: string | null;
  pickup_scheduled_at?: string | null;
  created_at: string;
} | null;

type TrackingEvent = {
  id: string;
  status: string;
  activity?: string | null;
  location?: string | null;
  event_time?: string | null;
};

type Order = {
  id: string;
  description?: string | null;
  amount: number;
  shipping_cost?: number | null;
  status?: string | null;
  status_notes?: string | null;
  paid_at?: string | null;
  created_at: string;
  customer_name?: string | null;
  customer_phone?: string | null;
  store_username?: string | null;
  cart_items?: OrderItem[] | null;
};

type Step = {
  key: string;
  label: string;
  sublabel: string;
  icon: any;
  completedAt: string | null;
  status: 'done' | 'active' | 'pending';
};

type Props = {
  username: string;
  slug: string;
  phone: string;
};

function fmt(dateStr?: string | null) {
  if (!dateStr) return null;

  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function fmtDate(dateStr?: string | null) {
  if (!dateStr) return null;

  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function buildSteps(order: Order, shipment: Shipment): Step[] {
  const s = order.status ?? '';
  const ss = shipment?.status ?? '';

  const isPaid =
    !!order.paid_at ||
    ['paid', 'processing', 'shipped', 'delivered'].includes(s);

  const isPickedUp = shipment
    ? ['picked_up', 'in_transit', 'out_for_delivery', 'delivered'].includes(ss)
    : s === 'shipped' || s === 'delivered';

  const shipmentPending = !!shipment && !isPickedUp;

  const isPrepared = isPickedUp;

  const isOutForDelivery = shipment
    ? ['out_for_delivery', 'delivered'].includes(ss)
    : false;

  const isDelivered = s === 'delivered' || ss === 'delivered';

  const steps: Step[] = [
    {
      key: 'placed',
      label: 'Order Placed',
      sublabel: fmt(order.created_at) ?? '',
      icon: Package,
      completedAt: order.created_at,
      status: 'done',
    },
    {
      key: 'paid',
      label: 'Payment Confirmed',
      sublabel: isPaid
        ? (fmt(order.paid_at) ?? 'Confirmed')
        : 'Awaiting payment',
      icon: Check,
      completedAt: order.paid_at ?? null,
      status: isPaid ? 'done' : 'active',
    },
    {
      key: 'prepared',
      label: 'Being Prepared',
      sublabel: isPrepared
        ? (fmt(shipment?.picked_up_at) ?? 'Packed & ready')
        : shipmentPending
          ? 'Packed · waiting for courier pickup'
          : 'Seller is packing your order',
      icon: Package,
      completedAt: shipment?.picked_up_at ?? null,
      status:
        isPrepared
          ? 'done'
          : (isPaid || shipmentPending)
            ? 'active'
            : 'pending',
    },
    {
      key: 'shipped',
      label: 'Shipped',
      sublabel: isPickedUp
        ? shipment?.courier_name
          ? `${shipment.courier_name}${shipment.awb_code ? ` · ${shipment.awb_code}` : ''}`
          : (fmt(
              shipment?.picked_up_at ?? shipment?.in_transit_at
            ) ?? 'Picked up by courier')
        : 'Courier will pick up from seller',
      icon: Truck,
      completedAt:
        shipment?.picked_up_at ??
        shipment?.in_transit_at ??
        null,
      status: isPickedUp ? 'done' : isPrepared ? 'active' : 'pending',
    },
    {
      key: 'out',
      label: 'Out for Delivery',
      sublabel: isOutForDelivery
        ? (fmt(shipment?.out_for_delivery_at) ??
            'On the way to you')
        : 'En route to your address',
      icon: Truck,
      completedAt: shipment?.out_for_delivery_at ?? null,
      status:
        isOutForDelivery
          ? 'done'
          : isPickedUp
            ? 'active'
            : 'pending',
    },
    {
      key: 'delivered',
      label: 'Delivered',
      sublabel: isDelivered
        ? (fmt(shipment?.delivered_at) ??
            'Delivered successfully')
        : shipment?.expected_delivery_date
          ? `Expected by ${fmtDate(shipment.expected_delivery_date)}`
          : 'Delivery pending',
      icon: Check,
      completedAt: shipment?.delivered_at ?? null,
      status:
        isDelivered
          ? 'done'
          : isOutForDelivery
            ? 'active'
            : 'pending',
    },
  ];

  let foundActive = false;

  return steps.map((step) => {
    if (step.status === 'done') return step;

    if (!foundActive) {
      foundActive = true;

      return {
        ...step,
        status: 'active',
      };
    }

    return {
      ...step,
      status: 'pending',
    };
  });
}

export default function OrderTrackingContent({
  username,
  slug,
  phone,
}: Props) {
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<Order | null>(null);
  const [shipment, setShipment] = useState<Shipment>(null);
  const [trackingEvents, setTrackingEvents] = useState<TrackingEvent[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchOrder() {
      try {
        setLoading(true);

        const res = await fetch(`/api/track-order/${slug}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            phoneNumber: phone,
          }),
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(
            json?.error || 'Failed to fetch order'
          );
        }

        const data = json?.data;

        setOrder({
          id: data.id,
          status: data.status,
          status_notes: data.status_notes,
          customer_name: data.customer?.name,
          customer_phone: data.customer?.phone,
          store_username: data.store_username,
          amount: data.total,
          shipping_cost: data.shipping_cost,
          paid_at: data.payment?.paid_at,
          created_at: data.created_at,
          cart_items: data.cart_items,
        });

        setShipment(data.shipping || null);

        setTrackingEvents(data.tracking_events || []);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchOrder();
  }, [slug, phone]);

  const steps = useMemo(() => {
    if (!order) return [];

    return buildSteps(order, shipment);
  }, [order, shipment]);

  const currentStep =
    steps.find((s) => s.status === 'active') ??
    steps.findLast((s) => s.status === 'done') ??
    steps[0];

  if (loading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20">
        <div className="rounded-[24px] border border-black/8 bg-white p-10 shadow-[0_20px_50px_rgba(15,23,42,0.06)] text-center">
          <LoaderCircle className="mx-auto h-5 w-5 animate-spin text-neutral-500" />
          <p className="mt-3 text-sm text-neutral-500">
            Loading order...
          </p>
        </div>
      </main>
    );
  }

  if (!order || error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-20">
        <div className="rounded-[24px] border border-red-200 bg-white p-10 text-center shadow-[0_20px_50px_rgba(15,23,42,0.06)]">
          <AlertCircle className="mx-auto h-10 w-10 text-red-500" />

          <h2 className="mt-4 text-xl font-semibold text-neutral-950">
            Order Not Found
          </h2>

          <p className="mt-2 text-sm text-neutral-500">
            {error}
          </p>
        </div>
      </main>
    );
  }

  const orderTitle =
    order.cart_items && order.cart_items.length > 0
      ? order.cart_items
          .map((i) => i.name)
          .filter(Boolean)
          .join(', ')
      : order.description ?? 'Your Order';

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
      <div className="rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
              Order #{order.id.slice(0, 8).toUpperCase()}
            </p>

            <h1 className="mt-2 text-xl font-bold tracking-[-0.03em] text-neutral-950 sm:text-2xl">
              {orderTitle}
            </h1>

            {order.cart_items &&
              order.cart_items.length > 1 && (
                <div className="mt-2 space-y-1">
                  {order.cart_items.map((item, i) => (
                    <div key={i}>
                      <p className="text-sm text-neutral-500">
                        {item.name}

                        {item.quantity &&
                          Number(item.quantity) > 1 &&
                          ` ×${item.quantity}`}

                        {item.variant_summary &&
                          ` · ${item.variant_summary}`}
                      </p>

                      {Array.isArray(item.addons) &&
                        item.addons.length > 0 && (
                          <ul className="ml-3 mt-0.5 space-y-0.5">
                            {item.addons.map((a) => (
                              <li
                                key={a.addon_id}
                                className="text-xs text-neutral-400"
                              >
                                + {a.quantity}× {a.name}
                              </li>
                            ))}
                          </ul>
                        )}
                    </div>
                  ))}
                </div>
              )}
          </div>

          <div className="flex-shrink-0 text-right">
            <p className="text-2xl font-bold tracking-[-0.04em] text-neutral-950">
              {formatCurrency(Number(order.amount))}
            </p>

            {order.shipping_cost &&
              Number(order.shipping_cost) > 0 && (
                <p className="mt-0.5 text-xs text-neutral-500">
                  +
                  {formatCurrency(
                    Number(order.shipping_cost)
                  )}{' '}
                  shipping
                </p>
              )}
          </div>
        </div>

        {order.status === 'cancelled' ? (
          <div className="mt-5 rounded-[14px] border border-red-200 bg-red-50 px-4 py-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-red-500" />

              <div>
                <p className="text-sm font-semibold text-red-700">
                  Order Cancelled
                </p>

                <p className="mt-0.5 text-sm text-red-600">
                  This order has been cancelled.
                </p>

                {order.status_notes && (
                  <p className="mt-2 text-sm text-red-700">
                    <span className="font-medium">
                      Reason:
                    </span>{' '}
                    {order.status_notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="mt-5 inline-flex items-center gap-2 rounded-full bg-[var(--theme-primary)] px-4 py-2">
            <span
              className="text-sm font-semibold"
              style={{
                color:
                  'var(--theme-primary-foreground)',
              }}
            >
              {currentStep.label}
            </span>
          </div>
        )}

        {shipment?.awb_code && (
          <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-neutral-600">
            <span className="font-mono text-xs font-medium text-neutral-500">
              AWB: {shipment.awb_code}
            </span>

            {shipment.courier_name && (
              <span>· {shipment.courier_name}</span>
            )}

            {shipment.tracking_url && (
              <a
                href={shipment.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-full border border-black/8 bg-neutral-50 px-3 py-1 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100"
              >
                Track on courier site

                <ExternalLink className="h-3 w-3" />
              </a>
            )}
          </div>
        )}

        {shipment?.expected_delivery_date &&
          steps.find((s) => s.key === 'delivered')
            ?.status !== 'done' && (
            <div className="mt-4 flex items-center gap-2 rounded-[14px] bg-indigo-50 px-4 py-3 text-sm font-medium text-indigo-700">
              <Clock className="h-4 w-4 flex-shrink-0" />

              Expected delivery by{' '}
              {fmtDate(
                shipment.expected_delivery_date
              )}
            </div>
          )}
      </div>

      {order.status !== 'cancelled' && (
        <div className="mt-6 rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-8">
          <h2 className="text-base font-semibold tracking-[-0.02em] text-neutral-950">
            Delivery Status
          </h2>

          <div className="mt-6">
            {steps.map((step, index) => {
              const isLast =
                index === steps.length - 1;

              const StepIcon = step.icon;

              return (
                <div
                  key={step.key}
                  className="flex gap-4"
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                        step.status === 'done'
                          ? 'border-transparent bg-[var(--theme-primary)] [color:var(--theme-primary-foreground)]'
                          : step.status === 'active'
                            ? 'border-[var(--theme-primary)] bg-white text-[var(--theme-primary)]'
                            : 'border-neutral-200 bg-white text-neutral-300'
                      }`}
                    >
                      {step.status === 'done' ? (
                        <Check className="h-5 w-5" />
                      ) : step.key === 'shipped' ||
                        step.key === 'out' ? (
                        <Truck className="h-5 w-5" />
                      ) : step.key ===
                        'prepared' ? (
                        <Package className="h-5 w-5" />
                      ) : step.key ===
                        'delivered' ? (
                        <MapPin className="h-5 w-5" />
                      ) : (
                        <StepIcon className="h-5 w-5" />
                      )}
                    </div>

                    {!isLast && (
                      <div
                        className={`mt-1 w-0.5 flex-1 min-h-[32px] rounded-full transition-colors ${
                          step.status === 'done'
                            ? 'bg-[var(--theme-primary)]'
                            : 'bg-neutral-100'
                        }`}
                      />
                    )}
                  </div>

                  <div
                    className={`pb-8 pt-1.5 ${
                      isLast ? 'pb-0' : ''
                    }`}
                  >
                    <p
                      className={`text-sm font-semibold ${
                        step.status === 'done'
                          ? 'text-neutral-950'
                          : step.status === 'active'
                            ? 'text-[var(--theme-primary)]'
                            : 'text-neutral-400'
                      }`}
                    >
                      {step.label}

                      {step.status === 'active' && (
                        <span className="ml-2 inline-flex items-center rounded-full bg-[var(--theme-primary)]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[var(--theme-primary)]">
                          Current
                        </span>
                      )}
                    </p>

                    <p
                      className={`mt-0.5 text-xs ${
                        step.status === 'pending'
                          ? 'text-neutral-300'
                          : 'text-neutral-500'
                      }`}
                    >
                      {step.sublabel}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {trackingEvents.length > 0 && (
        <div className="mt-6 rounded-[24px] border border-black/8 bg-white p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] sm:p-8">
          <h2 className="text-base font-semibold tracking-[-0.02em] text-neutral-950">
            Shipment Updates
          </h2>

          <div className="mt-5 space-y-4">
            {trackingEvents.map((event, index) => (
              <div
                key={event.id}
                className="flex gap-4"
              >
                <div className="flex flex-col items-center">
                  <div
                    className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                      index === 0
                        ? 'bg-[var(--theme-primary)]'
                        : 'bg-neutral-300'
                    }`}
                  />

                  {index <
                    trackingEvents.length - 1 && (
                    <div className="mt-1 min-h-[24px] flex-1 w-px bg-neutral-100" />
                  )}
                </div>

                <div className="pb-4">
                  <p
                    className={`text-sm font-medium ${
                      index === 0
                        ? 'text-neutral-950'
                        : 'text-neutral-600'
                    }`}
                  >
                    {event.activity ?? event.status}
                  </p>

                  <div className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                    {event.event_time && (
                      <span>
                        {fmt(event.event_time)}
                      </span>
                    )}

                    {event.location && (
                      <>
                        <span>·</span>

                        <span className="flex items-center gap-0.5">
                          <MapPin className="h-3 w-3" />

                          {event.location}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-8 text-center">
        <Link
          href="/track-order"
          className="text-sm font-medium text-neutral-500 underline underline-offset-4 hover:text-neutral-950"
        >
          Track another order
        </Link>
      </div>
    </main>
  );
}
