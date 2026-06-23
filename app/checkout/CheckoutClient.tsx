'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
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
  firstName: string;
  lastName: string;
  company: string;
  country: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  email: string;
  notes: string;
};

export default function CheckoutClient() {
  // -----------------------------
  // CART STATE
  // -----------------------------
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // -----------------------------
  // CHECKOUT STATE
  // -----------------------------
  const [shippingMethod, setShippingMethod] =
    useState<'free' | 'flat'>('flat');

  const [paymentMethod, setPaymentMethod] =
    useState<'bank' | 'cod' | 'paypal'>(
      'cod'
    );

  const [termsAccepted, setTermsAccepted] =
    useState(false);

  // -----------------------------
  // TOGGLES
  // -----------------------------
  const [showLogin, setShowLogin] =
    useState(false);

  const [showCoupon, setShowCoupon] =
    useState(false);

  // -----------------------------
  // BILLING FORM
  // -----------------------------
  const [billingData, setBillingData] =
    useState<BillingData>({
      firstName: '',
      lastName: '',
      company: '',
      country: 'India',
      address1: '',
      address2: '',
      city: '',
      state: '',
      zip: '',
      phone: '',
      email: '',
      notes: '',
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

  const shippingCost =
    shippingMethod === 'flat'
      ? 25.75
      : 0;

  const finalTotal =
    subtotal + shippingCost;

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

    console.log('Payment:', paymentMethod);

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

        {/* TOGGLES */}
        <div className="space-y-4 mb-8">

          <button
            onClick={() =>
              setShowLogin(!showLogin)
            }
            className="w-full border border-gray-300 rounded-md px-4 py-3 flex items-center justify-between bg-white text-sm font-bold text-gray-600"
          >
            Returning customer? Click here to login

            <ChevronDown
              size={18}
              className={`transition-transform ${
                showLogin
                  ? 'rotate-180'
                  : ''
              }`}
            />
          </button>

          <AnimatePresence>
            {showLogin && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: 'auto',
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="overflow-hidden"
              >
                <div className="border border-gray-200 rounded-md p-4 bg-white">
                  Login form coming soon.
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() =>
              setShowCoupon(!showCoupon)
            }
            className="w-full border border-gray-300 rounded-md px-4 py-3 flex items-center justify-between bg-white text-sm font-bold text-gray-600"
          >
            Have a coupon? Click here to enter your code

            <ChevronDown
              size={18}
              className={`transition-transform ${
                showCoupon
                  ? 'rotate-180'
                  : ''
              }`}
            />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-6">

          {/* FIRST + LAST */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            <div>
              <label className="block text-sm font-bold mb-2">
                First Name *
              </label>

              <input
                type="text"
                value={billingData.firstName}
                onChange={(e) =>
                  handleInputChange(
                    'firstName',
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold mb-2">
                Last Name *
              </label>

              <input
                type="text"
                value={billingData.lastName}
                onChange={(e) =>
                  handleInputChange(
                    'lastName',
                    e.target.value
                  )
                }
                className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none"
              />
            </div>
          </div>

          {/* COMPANY */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Company name
            </label>

            <input
              type="text"
              value={billingData.company}
              onChange={(e) =>
                handleInputChange(
                  'company',
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none"
            />
          </div>

          {/* COUNTRY */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Country
            </label>

            <select
              value={billingData.country}
              onChange={(e) =>
                handleInputChange(
                  'country',
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none"
            >
              <option>India</option>
              <option>United States</option>
              <option>United Kingdom</option>
            </select>
          </div>

          {/* ADDRESS */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Street Address
            </label>

            <input
              type="text"
              placeholder="House number and street name"
              value={billingData.address1}
              onChange={(e) =>
                handleInputChange(
                  'address1',
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none mb-4"
            />

            <input
              type="text"
              placeholder="Apartment, suite, etc."
              value={billingData.address2}
              onChange={(e) =>
                handleInputChange(
                  'address2',
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none"
            />
          </div>

          {/* CITY */}
          <div>
            <label className="block text-sm font-bold mb-2">
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
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none"
            />
          </div>

          {/* STATE */}
          <div>
            <label className="block text-sm font-bold mb-2">
              State
            </label>

            <input
              type="text"
              value={billingData.state}
              onChange={(e) =>
                handleInputChange(
                  'state',
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none"
            />
          </div>

          {/* ZIP */}
          <div>
            <label className="block text-sm font-bold mb-2">
              ZIP Code
            </label>

            <input
              type="text"
              value={billingData.zip}
              onChange={(e) =>
                handleInputChange(
                  'zip',
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none"
            />
          </div>

          {/* PHONE */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Phone
            </label>

            <input
              type="tel"
              value={billingData.phone}
              onChange={(e) =>
                handleInputChange(
                  'phone',
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Email
            </label>

            <input
              type="email"
              value={billingData.email}
              onChange={(e) =>
                handleInputChange(
                  'email',
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none"
            />
          </div>

          {/* NOTES */}
          <div>
            <label className="block text-sm font-bold mb-2">
              Order Notes
            </label>

            <textarea
              rows={4}
              value={billingData.notes}
              onChange={(e) =>
                handleInputChange(
                  'notes',
                  e.target.value
                )
              }
              className="w-full border border-gray-300 rounded-md px-4 py-3 bg-white outline-none resize-none"
            />
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

          {/* SUBTOTAL */}
          <div className="flex justify-between border-b border-gray-200 pb-4 mb-4">
            <span className="font-bold">
              Subtotal
            </span>

            <span className="font-bold">
              ${subtotal.toFixed(2)}
            </span>
          </div>

          {/* SHIPPING */}
          <div className="border-b border-gray-200 pb-4 mb-4">

            <h3 className="font-bold mb-4">
              Shipping
            </h3>

            <div className="space-y-3">

              <label className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={
                      shippingMethod ===
                      'free'
                    }
                    onChange={() =>
                      setShippingMethod(
                        'free'
                      )
                    }
                  />

                  <span>
                    Free Shipping
                  </span>
                </div>
              </label>

              <label className="flex items-center justify-between">

                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    checked={
                      shippingMethod ===
                      'flat'
                    }
                    onChange={() =>
                      setShippingMethod(
                        'flat'
                      )
                    }
                  />

                  <span>
                    Flat Rate
                  </span>
                </div>

                <span>$25.75</span>
              </label>
            </div>
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

          {/* PAYMENT */}
          <div className="space-y-4 mb-6">

            <label className="flex items-center gap-3">
              <input
                type="radio"
                checked={
                  paymentMethod ===
                  'bank'
                }
                onChange={() =>
                  setPaymentMethod(
                    'bank'
                  )
                }
              />

              <span className="font-bold">
                Direct Bank Transfer
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                checked={
                  paymentMethod ===
                  'cod'
                }
                onChange={() =>
                  setPaymentMethod(
                    'cod'
                  )
                }
              />

              <span className="font-bold">
                Cash on Delivery
              </span>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="radio"
                checked={
                  paymentMethod ===
                  'paypal'
                }
                onChange={() =>
                  setPaymentMethod(
                    'paypal'
                  )
                }
              />

              <span className="font-bold">
                PayPal
              </span>
            </label>
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