'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  LoaderCircle,
  MapPin,
  Package2,
  Sparkles,
} from 'lucide-react';

import {
  CART_CHANGED_EVENT,
  clearCart,
  readCart,
} from '@/lib/cart';

declare global {
  interface Window {
    Razorpay: any;
  }
}

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  selected_variants?: any[];
  addons?: any[];
};

type BillingData = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  streetAddress: string;
  city: string;
  deliveryPincode: string;
};

type CheckoutDraft = BillingData;

type Props = {
  store?: any;
};

function parseStoredAddress(address: string, landmark?: string | null) {
  let addressToParse = address;

  if (landmark && address.includes(`, ${landmark}`)) {
    addressToParse = address.replace(`, ${landmark}`, '');
  }

  const parts = addressToParse
    .replace(/\n/g, ',')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    streetAddress:
      parts.length > 1
        ? parts.slice(0, -1).join(', ')
        : addressToParse.trim(),
    city: parts.length > 1 ? parts[parts.length - 1] : '',
  };
}

export default function CheckoutClient({ store }: Props) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [verifyingPayment, setVerifyingPayment] = useState(false);
  const [error, setError] = useState('');
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [draftLoaded, setDraftLoaded] = useState(false);
  const autoFilledPhoneRef = useRef<string | null>(null);
  const cacheKey = `linkpe-checkout:${store?.id || store?.username || store?.store_username || store?.business_name || 'store'}`;
  const [billingData, setBillingData] =
    useState<BillingData>({
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      streetAddress: '',
      city: '',
      deliveryPincode: '',
    });

  useEffect(() => {
    try {
      const cached = window.localStorage.getItem(cacheKey);

      if (cached) {
        const parsed = JSON.parse(cached) as Partial<CheckoutDraft>;

        setBillingData((prev) => {
          if ('streetAddress' in parsed || 'city' in parsed) {
            return {
              ...prev,
              customerName: parsed.customerName || '',
              customerPhone: parsed.customerPhone || '',
              customerAddress: parsed.customerAddress || '',
              streetAddress:
                parsed.streetAddress && !parsed.streetAddress.includes(',')
                  ? parsed.streetAddress
                  : '',
              city: parsed.city || '',
              deliveryPincode: parsed.deliveryPincode || '',
            };
          }

          if (parsed.customerAddress) {
            const migrated = parseStoredAddress(parsed.customerAddress);

            return {
              ...prev,
              customerName: parsed.customerName || '',
              customerPhone: parsed.customerPhone || '',
              customerAddress: migrated.streetAddress,
              streetAddress: '',
              city: migrated.city,
              deliveryPincode: parsed.deliveryPincode || '',
            };
          }

          return {
            ...prev,
            customerName: parsed.customerName || '',
            customerPhone: parsed.customerPhone || '',
            customerAddress: parsed.customerAddress || '',
            streetAddress: parsed.streetAddress || '',
            city: parsed.city || '',
            deliveryPincode: parsed.deliveryPincode || '',
          };
        });
      }
    } catch (storageError) {
      console.error('Checkout cache read error:', storageError);
    } finally {
      setDraftLoaded(true);
    }
  }, [cacheKey]);

  useEffect(() => {
    if (!draftLoaded) return;

    const draft: CheckoutDraft = {
      customerName: billingData.customerName,
      customerPhone: billingData.customerPhone,
      customerAddress: billingData.customerAddress,
      streetAddress: billingData.streetAddress,
      city: billingData.city,
      deliveryPincode: billingData.deliveryPincode,
    };

    try {
      window.localStorage.setItem(cacheKey, JSON.stringify(draft));
    } catch (storageError) {
      console.error('Checkout cache write error:', storageError);
    }
  }, [billingData, cacheKey, draftLoaded]);

  // -----------------------------
  // LOAD CART
  // -----------------------------
  useEffect(() => {
    const loadCart = () => {
      const cart = readCart();
      const formatted = cart.map(
        (item) => ({
          id: item.product_id,
          name: item.name,
          price: item.unit_price,
          quantity: item.quantity,
          image:
            item.image_url ||
            '/placeholder.png',
          selected_variants: item.selected_variants,
          addons: item.addons,
        })
      );

      setCartItems(formatted);
    };

    loadCart();

    window.addEventListener(
      CART_CHANGED_EVENT,
      loadCart
    );

    return () => {
      window.removeEventListener(
        CART_CHANGED_EVENT,
        loadCart
      );
    };
  }, []);

  useEffect(() => {
    const phone = billingData.customerPhone.replace(/\D/g, '').slice(-10);

    if (!/^\d{10}$/.test(phone)) {
      return;
    }

    if (autoFilledPhoneRef.current && autoFilledPhoneRef.current !== phone) {
      setBillingData((prev) => ({
        ...prev,
        customerName: '',
        customerAddress: '',
        streetAddress: '',
        city: '',
        deliveryPincode: '',
      }));
      autoFilledPhoneRef.current = null;
      return;
    }

    const addressEmpty =
      !billingData.customerAddress &&
      !billingData.streetAddress &&
      !billingData.city &&
      !billingData.deliveryPincode;

    if (!addressEmpty && billingData.customerName) return;

    let cancelled = false;

    fetch('/api/buyer/lookup-address', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ phone }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (cancelled || !data.found || !data.data) return;

        const { name, address, landmark, pincode } = data.data;
        const parsedAddress = address
          ? parseStoredAddress(address, landmark)
          : null;

        setBillingData((prev) => ({
          ...prev,
          customerName: prev.customerName || name || '',
          customerAddress:
            addressEmpty && parsedAddress
              ? parsedAddress.streetAddress
              : prev.customerAddress,
          streetAddress:
            addressEmpty && landmark && !landmark.includes(',')
              ? landmark
              : prev.streetAddress,
          city:
            addressEmpty && parsedAddress
              ? parsedAddress.city
              : prev.city,
          deliveryPincode:
            addressEmpty && pincode
              ? pincode
              : prev.deliveryPincode,
        }));
        autoFilledPhoneRef.current = phone;
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [
    billingData.city,
    billingData.customerAddress,
    billingData.customerName,
    billingData.customerPhone,
    billingData.deliveryPincode,
    billingData.streetAddress,
  ]);

  useEffect(() => {
    if (window.Razorpay) {
      setRazorpayLoaded(true);

      return;
    }

    const script =
      document.createElement(
        'script'
      );

    script.src =
      'https://checkout.razorpay.com/v1/checkout.js';

    script.async = true;

    script.onload = () => {
      setRazorpayLoaded(true);
    };

    document.body.appendChild(script);
  }, []);

  // -----------------------------
  // TOTALS
  // -----------------------------
  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (sum, item) =>
        sum +
        item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const finalTotal = subtotal;

  // -----------------------------
  // INPUT CHANGE
  // -----------------------------
  const handleInputChange = (
    field: keyof BillingData,
    value: string
  ) => {
    setBillingData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // -----------------------------
  // OPEN RAZORPAY
  // -----------------------------
  const openRazorpayModal = async (checkout: any, razorpay: any) => {
    const razorpayInstance = new window.Razorpay({
      key: razorpay.key,
      amount: razorpay.amount,
      currency: razorpay.currency,
      order_id: razorpay.orderId,
      name: store?.business_name || 'Store',
      description: 'Secure Checkout',
      theme: {
        color: '#000000',
      },
      prefill: {
        name: billingData.customerName,
        contact: billingData.customerPhone,
      },
      handler: async (response: any) => {
        try {
          setVerifyingPayment(true);

          const orderResponse = await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              order_id: checkout.order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const result = await orderResponse.json();

          if (!result.success) {
            setError(result.error || 'Order creation failed');
            return;
          }

          clearCart();

          window.location.href = `/track-order/${result.order.id}?phone=${encodeURIComponent(
            billingData.customerPhone
          )}`;
        } catch (error: any) {
          setError(error.message || 'Payment verification failed');
        } finally {
          setVerifyingPayment(false);
        }
      },
      modal: {
        ondismiss: () => {
          setLoading(false);
        },
      },
    });

    razorpayInstance.open();
  };

  // -----------------------------
  // PLACE ORDER
  // -----------------------------
  const handlePlaceOrder = async () => {
    if (!termsAccepted) return;

    setError('');

    if (!billingData.customerName) {
      setError('Please enter full name');
      return;
    }

    if (!/^\d{10}$/.test(billingData.customerPhone)) {
      setError('Please enter valid phone number');
      return;
    }

    if (!billingData.customerAddress) {
      setError('Please enter address');
      return;
    }

    if (!billingData.city) {
      setError('Please enter city');
      return;
    }

    if (!/^\d{6}$/.test(billingData.deliveryPincode)) {
      setError('Please enter valid pincode');
      return;
    }

    try {
      setLoading(true);

      const response = await fetch('/api/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checkout: {
            items: cartItems.map((item) => ({
              product_id: item.id,
              quantity: item.quantity,
              selected_variants: item.selected_variants,
              addons: item.addons,
            })),
            customer: {
              name: billingData.customerName,
              phone: billingData.customerPhone,
              address: [
                billingData.customerAddress,
                billingData.streetAddress,
                billingData.city,
              ]
                .filter(Boolean)
                .join(', '),
              pincode: billingData.deliveryPincode,
              landmark: billingData.streetAddress || null,
            },
          },
          idempotencyKey: `checkout_${Date.now()}_${Math.random().toString(36).slice(2)}`,
        }),
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.error || 'Failed to initialize payment');
        return;
      }

      if (!data.razorpay) {
        setError('Razorpay is not available for this order');
        return;
      }

      await openRazorpayModal(data.checkout, data.razorpay);
    } catch (error: any) {
      setError(error.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // -----------------------------
  // VERIFYING UI
  // -----------------------------
  if (verifyingPayment) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-7xl flex-col items-center justify-center px-4 py-16 text-center">
        <LoaderCircle className="h-12 w-12 animate-spin text-black" />

        <p className="mt-6 text-xl font-semibold text-black">
          Verifying payment...
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Please do not refresh this page
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="overflow-hidden rounded-[32px] border border-black/8 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.10)]">
        <div className="grid lg:grid-cols-[1.2fr_0.8fr]">

          {/* LEFT SECTION */}
          <section className="border-b border-black/8 px-3 py-6 md:p-8 lg:border-b-0 lg:border-r">

            {/* TOP */}
            <div className="mb-8 flex flex-wrap items-start justify-between gap-4">

              <div>
                <div className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-primary)]"
                  style={{
                    border:
                      '1px solid var(--theme-primary-soft-border)',
                    background:
                      'var(--theme-primary-soft)',
                  }}>
                  <Sparkles className="h-3.5 w-3.5" />
                  Secure checkout
                </div>

                <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">
                  Complete your contact and delivery details once, then continue to secure payment.
                </p>
              </div>

              <div className="rounded-[24px] border border-black/8 px-5 py-4 text-right"
                style={{
                  background:
                    'var(--theme-primary-gradient)',
                }}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">
                  Total payable
                </p>

                <p className="mt-1 text-4xl font-semibold tracking-[-0.05em] text-gray-950">
                  ₹{finalTotal.toFixed(2)}
                </p>
              </div>
            </div>

            {/* ERROR */}
            {error && (
              <div className="mb-5 flex items-start gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                <AlertCircle className="mt-0.5 h-4 w-4" />

                <span>{error}</span>
              </div>
            )}

            {/* FORM */}
            <div className="space-y-6">

              {/* CONTACT */}
              <div className="rounded-[28px] border border-black/8 bg-[rgba(248,250,252,0.72)] p-3 md:p-5">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--theme-primary)]">
                    <Package2 className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Contact details
                    </p>

                    <p className="text-sm text-gray-500">
                      Used for order updates and payment confirmation.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Full Name *
                    </label>

                    <input
                      type="text"
                      value={billingData.customerName}
                      onChange={(e) =>
                        handleInputChange(
                          'customerName',
                          e.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[rgba(var(--theme-primary-rgb),0.10)]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Phone
                    </label>

                    <input
                      type="tel"
                      value={billingData.customerPhone}
                      onChange={(e) =>
                        handleInputChange(
                          'customerPhone',
                          e.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[rgba(var(--theme-primary-rgb),0.10)]"
                    />
                  </div>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="rounded-[28px] border border-black/8 bg-[rgba(248,250,252,0.72)] p-3 md:p-5">
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[var(--theme-primary)]">
                    <MapPin className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Delivery address
                    </p>

                    <p className="text-sm text-gray-500">
                      Split up for faster checkout and cleaner shipping details.
                    </p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Street Address
                    </label>

                    <input
                      type="text"
                      placeholder="House / flat no., building, street, area"
                      value={billingData.customerAddress}
                      onChange={(e) =>
                        handleInputChange(
                          'customerAddress',
                          e.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[rgba(var(--theme-primary-rgb),0.10)]"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-semibold text-gray-800">
                      Apartment, area, or landmark
                    </label>

                    <input
                      type="text"
                      placeholder="Flat no., floor, landmark or delivery note"
                      value={billingData.streetAddress}
                      onChange={(e) =>
                        handleInputChange(
                          'streetAddress',
                          e.target.value
                        )
                      }
                      className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[rgba(var(--theme-primary-rgb),0.10)]"
                    />
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-800">
                        Town / City
                      </label>

                      <input
                        type="text"
                        value={billingData.city}
                        onChange={(e) =>
                          handleInputChange(
                            'city',
                            e.target.value
                          )
                        }
                        className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[rgba(var(--theme-primary-rgb),0.10)]"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-semibold text-gray-800">
                        PIN Code
                      </label>

                      <input
                        type="text"
                        value={billingData.deliveryPincode}
                        onChange={(e) =>
                          handleInputChange(
                            'deliveryPincode',
                            e.target.value
                          )
                        }
                        className="w-full rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[rgba(var(--theme-primary-rgb),0.10)]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT SECTION */}
          <aside className="bg-[linear-gradient(180deg,var(--theme-surface)_0%,rgba(255,255,255,0.96)_100%)] px-3 py-6 md:p-8">
            <div className="rounded-[28px] border border-black/8 bg-white p-3 md:p-5 shadow-[0_18px_45px_rgba(15,23,42,0.05)]">

              {/* PRODUCTS */}
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-2xl border border-black/8 bg-[rgba(248,250,252,0.72)] px-3 py-4"
                  >
                    <div className="flex items-start justify-between gap-3">

                      <div className="flex items-start gap-3">

                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-14 w-14 rounded-xl object-cover"
                        />

                        <div>
                          <h4 className="text-sm font-semibold leading-5 text-gray-900">
                            {item.name}
                          </h4>

                          <p className="mt-1 text-xs text-gray-500">
                            Qty: {item.quantity}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm font-semibold text-gray-900">
                        ₹
                        {(
                          item.price *
                          item.quantity
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* COUPON */}
              <div className="my-5 border-t border-dashed border-black/10 pt-5">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Coupon code"
                    className="flex-1 rounded-2xl border border-black/8 bg-[rgba(248,250,252,0.72)] px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-[var(--theme-primary)] focus:ring-4 focus:ring-[rgba(var(--theme-primary-rgb),0.10)]"
                  />

                  <button
                    type="button"
                    className="rounded-2xl border border-black/8 bg-white px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* SUMMARY */}
              <div className="border-t border-dashed border-black/10 pt-5">

                <div className="mb-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-500">
                    Subtotal
                  </span>

                  <span className="text-sm font-semibold text-gray-900">
                    ₹{subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold text-gray-950">
                    Total
                  </span>

                  <span className="text-3xl font-semibold tracking-[-0.05em] text-gray-950">
                    ₹{finalTotal.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* TERMS */}
              <label className="mt-6 flex items-start gap-3">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) =>
                    setTermsAccepted(
                      e.target.checked
                    )
                  }
                  className="mt-1"
                />

                <span className="text-sm leading-6 text-gray-600">
                  I agree to the website terms and conditions
                </span>
              </label>

              {error && (
                <div className="m-2 border border-red-200 bg-red-50 p-2 text-sm text-red-600">
                  {error}
                </div>
              )}

              {/* BUTTON */}
              <button
                disabled={
                  !termsAccepted ||
                  cartItems.length ===
                    0 ||
                  loading ||
                  verifyingPayment ||
                  !razorpayLoaded
                }
                onClick={
                  handlePlaceOrder
                }
                className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-4 text-base font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${
                  termsAccepted &&
                  cartItems.length >
                    0
                    ? 'bg-black text-white hover:bg-gray-800'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                {loading ? (
                  <>
                    <LoaderCircle className="h-5 w-5 animate-spin" />
                    Opening secure
                    payment...
                  </>
                ) : (
                  <>
                    Pay ₹
                    {finalTotal.toFixed(
                      2
                    )}
                  </>
                )}
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
