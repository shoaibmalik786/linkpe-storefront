'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Sparkles, Package2, MapPin } from 'lucide-react';
import Link from 'next/link';

import {
  CART_CHANGED_EVENT,
  readCart,
} from '@/lib/cart';

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
};

type BillingData = {
  customerName: string;
  customerPhone: string;
  customerAddress: string;
  streetAddress: string;
  city: string;
  deliveryPincode: string;
};

export default function CheckoutClient() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [termsAccepted, setTermsAccepted] =
    useState(false);

  // -----------------------------
  // BILLING FORM
  // -----------------------------
  const [billingData, setBillingData] =
    useState<BillingData>({
      customerName: '',
      customerPhone: '',
      customerAddress: '',
      streetAddress: '',
      city: '',
      deliveryPincode: '',
    });

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

  // -----------------------------
  // CALCULATIONS
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
  // HANDLE INPUT CHANGE
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
  // PLACE ORDER
  // -----------------------------
  const handlePlaceOrder = async () => {
    if (!termsAccepted) return;

    console.log('Billing Data:', billingData);

    console.log('Cart:', cartItems);


    // NEXT STEP:
    // integrate checkout API here
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 flex flex-col lg:flex-row gap-12">

      {/* LEFT COLUMN */}
      <div className="w-full lg:w-[60%]">
        <h2 className="text-xl font-extrabold text-gray-900 mb-6">
          Billing details
        </h2>
        {/* FORM */}
        <div className="border border-gray-200 rounded-xl p-3 md:p-6 bg-white space-y-6">
          <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(var(--theme-primary-rgb),0.16)] bg-[#fefcfa] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--theme-primary)] ">
                <Sparkles className="h-3.5 w-3.5" />
                Secure checkout
              </div>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-600">Complete your contact and delivery details once, then continue to secure payment.</p>
            </div>

            <div className="rounded-[12px] md:rounded-[24px] border border-black/8 bg-[#fefcfa] px-5 py-4 text-right">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Total payable</p>
              { false /*appliedCoupon*/ && (
                <p className="mt-1 text-sm text-gray-400 line-through">
                  {/*{formatCurrency(localTotalPayable)}*/}
                  ₹2,199
                </p>
              )}
              <p className="mt-1 text-4xl font-semibold tracking-[-0.05em] text-gray-950">
                {/*{appliedCoupon
                  ? formatCurrency(appliedCoupon.type === 'free_shipping'
                      ? localProductTotal
                      : appliedCoupon.finalSubtotal + (shippingCost ?? 0))
                  : formatCurrency(localTotalPayable)}*/}
                ₹2,199
              </p>
              {true/*appliedCoupon*/ && (
                <p className="mt-1 text-xs font-semibold text-emerald-600">
                  {/*{appliedCoupon.message}*/}
                </p>
              )}
            </div>
          </div>

          <div className="rounded-[12px] md:rounded-[28px] border border-black/8 bg-[rgba(248,250,252,0.78)] p-3 md:p-5">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fefcfa] text-[var(--theme-primary)]">
                <Package2 className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Contact details</p>
                <p className="text-sm text-gray-500">Used for order updates and payment confirmation.</p>
              </div>
            </div>
            {/* FullName */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold mb-2">
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
                  className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-bold mb-2">
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
                  className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none"
                />
              </div>
            </div>
          </div>

          <div className="rounded-[12px] md:rounded-[28px] border border-black/8 bg-[rgba(248,250,252,0.78)] p-3 md:p-5">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#fefcfa] text-[var(--theme-primary)]">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Delivery address</p>
                <p className="text-sm text-gray-500">Split up for faster checkout and cleaner shipping details.</p>
              </div>
            </div>

            {/* ADDRESS */}
            <div>
              <label className="block text-sm font-bold mb-2">
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
                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none mb-4"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
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
                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none mb-4"
              />
            </div>

            {/* CITY */}
            <div>
              <label className="block text-sm font-bold mb-2">
                Town / City
              </label>
              <input
                type="text"
                placeholder="Enter your city"
                value={billingData.city}
                onChange={(e) =>
                  handleInputChange(
                    'city',
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none mb-4"
              />
            </div>

            {/* ZIP */}
            <div>
              <label className="block text-sm font-bold mb-2">
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
                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none"
              />
            </div>
          </div>

        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="w-full lg:w-[40%]">
        <h2 className="text-xl font-extrabold mb-6">
          Your Order
        </h2>

        <div className="border border-gray-200 rounded-xl p-6 bg-white sticky top-8">

          {/* PRODUCTS */}
          <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">

            {cartItems.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-4">

                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />

                  <div>
                    <h4 className="text-sm font-extrabold leading-tight">
                      {item.name}
                    </h4>

                    <span className="text-xs text-gray-500">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>

                <span className="text-sm font-bold text-gray-500">
                  $
                  {(
                    item.price *
                    item.quantity
                  ).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          {/* Coupon input in sidebar */}
          { true/*!detailsSaved*/ && (
            <div className="my-5 ">
              {true/*!appliedCoupon*/ ? (
                <div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      // value={couponInput}
                      // onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError(''); }}
                      // onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void handleApplyCoupon(); } }}
                      placeholder="Coupon code"
                      className="flex-1 rounded-2xl border border-gray-200 bg-[rgba(248,250,252,0.78)] px-3 py-2.5 text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:border-[var(--theme-primary)] focus:outline-none focus:ring-2 focus:ring-[rgba(var(--theme-primary-rgb),0.12)]"
                    />
                    <button
                      type="button"
                      // onClick={handleApplyCoupon}
                      // disabled={!couponInput.trim() || couponValidating}
                      className="shrink-0 rounded-2xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-40"
                    >
                      {/*{couponValidating ? '...' : 'Apply'}*/}
                      Apply
                    </button>
                  </div>
                  {true/*couponError*/ && 
                    <p className="mt-1.5 text-xs text-red-600">
                      {/*{couponError}*/}
                      errormessage
                    </p>
                  }
                </div>
              ) : (
                <div className="flex items-center justify-between rounded-2xl border border-emerald-200 bg-emerald-50 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                    <div>
                      <p className="text-sm font-semibold text-emerald-800">{appliedCoupon.code}</p>
                      <p className="text-xs text-emerald-700">{appliedCoupon.message}</p>
                    </div>
                  </div>
                  <button type="button" onClick={handleRemoveCoupon} className="ml-2 text-emerald-600 hover:text-emerald-800">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* SUBTOTAL */}
          <div className="flex justify-between border-b border-gray-200 pb-4 mb-4">
            <span className="font-bold">
              Subtotal
            </span>

            <span className="font-bold">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          {/* TOTAL */}
          <div className="flex items-center justify-between mb-8">

            <span className="font-extrabold text-lg">
              Total
            </span>

            <span className="text-2xl font-extrabold">
              ${finalTotal.toFixed(2)}
            </span>
          </div>

          {/* TERMS */}
          <label className="flex items-start gap-3 mb-6">
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

            <span className="text-sm text-gray-600">
              I agree to the website
              terms and conditions
            </span>
          </label>

          {/* BUTTON */}
          <button
            disabled={
              !termsAccepted ||
              cartItems.length === 0
            }
            onClick={handlePlaceOrder}
            className={`w-full py-4 rounded-lg font-bold text-sm transition-all ${
              termsAccepted &&
              cartItems.length > 0
                ? 'bg-black text-white hover:bg-gray-800'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            PLACE ORDER
          </button>
        </div>
      </div>
    </div>
  );
}