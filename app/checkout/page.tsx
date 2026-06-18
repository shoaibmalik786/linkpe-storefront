'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- MOCK CART DATA ---
const CHECKOUT_ITEMS = [
  { id: 1, name: 'Sophisticated Swagger Suit', price: 40.00, imageColor: 'bg-[#5c7a9c]' },
  { id: 2, name: 'Cozy Knit Cardigan Sweater', price: 60.00, imageColor: 'bg-[#b886c1]' }, // Adjusted to 60 to make subtotal exactly 100 like the screenshot
];

export default function CheckoutPage() {
  // --- STATE MANAGEMENT ---
  const [shippingMethod, setShippingMethod] = useState<'free' | 'flat'>('flat');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'cod' | 'paypal'>('cod');
  const [termsAccepted, setTermsAccepted] = useState(false);

  // Form toggles for the top banners
  const [showLogin, setShowLogin] = useState(false);
  const [showCoupon, setShowCoupon] = useState(false);

  // --- CALCULATIONS ---
  const subtotal = CHECKOUT_ITEMS.reduce((sum, item) => sum + item.price, 0);
  const shippingCost = shippingMethod === 'flat' ? 25.75 : 0.00;
  const finalTotal = subtotal + shippingCost;

  return (
    <main className="min-h-screen bg-[#fefcfa] text-gray-900 pb-24">
      <Header />
      {/* 1. TOP BANNER */}
      <section 
        className="relative w-full h-48 md:h-64 bg-[#c8a98c] flex flex-col items-center justify-center bg-cover bg-center mb-12" 
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Shop Checkout</h1>
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-white">Shop Checkout</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 flex flex-col lg:flex-row gap-12">
        
        {/* LEFT COLUMN: Billing Details */}
        <div className="w-full lg:w-[60%]">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Billing details</h2>
          
          {/* Action Banners */}
          <div className="space-y-4 mb-8">
            <button 
              onClick={() => setShowLogin(!showLogin)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 flex items-center justify-between bg-white text-sm font-bold text-gray-600 hover:border-black transition-colors"
            >
              Returning customer? Click here to login
              <ChevronDown size={18} className={`transition-transform ${showLogin ? 'rotate-180' : ''}`} />
            </button>
            <button 
              onClick={() => setShowCoupon(!showCoupon)}
              className="w-full border border-gray-300 rounded-md px-4 py-3 flex items-center justify-between bg-white text-sm font-bold text-gray-600 hover:border-black transition-colors"
            >
              Have a coupon? Click here to enter your code
              <ChevronDown size={18} className={`transition-transform ${showCoupon ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Billing Form */}
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">First Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-black transition-colors bg-white text-sm" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-800 mb-2">Last Name <span className="text-red-500">*</span></label>
                <input type="text" className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-black transition-colors bg-white text-sm" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Company name (optional)</label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-black transition-colors bg-white text-sm" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Country / Region <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-md px-4 py-3 appearance-none outline-none focus:border-black transition-colors bg-white text-sm cursor-pointer">
                  <option>Another option</option>
                  <option>United States</option>
                  <option>United Kingdom</option>
                  <option>India</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-4">
              <label className="block text-sm font-bold text-gray-800">Street address <span className="text-red-500">*</span></label>
              <input type="text" placeholder="House number and street name" className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-black transition-colors bg-white text-sm" />
              <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-black transition-colors bg-white text-sm" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Town / City <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-md px-4 py-3 appearance-none outline-none focus:border-black transition-colors bg-white text-sm cursor-pointer">
                  <option>Open this select menu</option>
                  <option>New York</option>
                  <option>London</option>
                  <option>Mumbai</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">State <span className="text-red-500">*</span></label>
              <div className="relative">
                <select className="w-full border border-gray-300 rounded-md px-4 py-3 appearance-none outline-none focus:border-black transition-colors bg-white text-sm cursor-pointer">
                  <option>Open this select menu</option>
                  <option>California</option>
                  <option>Texas</option>
                </select>
                <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">ZIP Code <span className="text-red-500">*</span></label>
              <input type="text" className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-black transition-colors bg-white text-sm" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Phone <span className="text-red-500">*</span></label>
              <input type="tel" className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-black transition-colors bg-white text-sm" />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Email address <span className="text-red-500">*</span></label>
              <input type="email" className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-black transition-colors bg-white text-sm" />
            </div>

            <div className="space-y-3 pt-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-black cursor-pointer" />
                <span className="text-sm font-bold text-gray-700">Create an account?</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 accent-black cursor-pointer" />
                <span className="text-sm font-bold text-gray-700">Ship to a different address?</span>
              </label>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">Order notes (optional)</label>
              <textarea 
                rows={4} 
                placeholder="Notes about your order, e.g. special notes for delivery." 
                className="w-full border border-gray-300 rounded-md px-4 py-3 outline-none focus:border-black transition-colors bg-white text-sm resize-none"
              ></textarea>
            </div>
          </form>
        </div>

        {/* RIGHT COLUMN: Your Order */}
        <div className="w-full lg:w-[40%]">
          <h2 className="text-xl font-extrabold text-gray-900 mb-6">Your Order</h2>
          
          <div className="border border-gray-200 rounded-xl p-6 md:p-8 bg-white shadow-sm sticky top-8">
            
            {/* Items */}
            <div className="space-y-4 border-b border-gray-200 pb-6 mb-6">
              {CHECKOUT_ITEMS.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-lg ${item.imageColor}`}></div>
                    <span className="text-sm font-extrabold text-gray-800 w-32 md:w-48 leading-tight">
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-bold text-gray-500">${item.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Subtotal */}
            <div className="flex items-center justify-between text-sm font-bold text-gray-600 mb-6 border-b border-gray-200 pb-6">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(0)}</span>
            </div>

            {/* Shipping Radio Group */}
            <div className="mb-6 border-b border-gray-200 pb-6">
              <span className="block text-sm font-extrabold text-gray-900 mb-4">Shipping</span>
              <div className="space-y-3">
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="shipping" 
                      value="free"
                      checked={shippingMethod === 'free'}
                      onChange={() => setShippingMethod('free')}
                      className="w-4 h-4 accent-black cursor-pointer" 
                    />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">Free shipping</span>
                  </div>
                </label>
                <label className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <input 
                      type="radio" 
                      name="shipping" 
                      value="flat"
                      checked={shippingMethod === 'flat'}
                      onChange={() => setShippingMethod('flat')}
                      className="w-4 h-4 accent-black cursor-pointer" 
                    />
                    <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">Flat Rate:</span>
                  </div>
                  <span className="text-sm font-medium text-gray-600">25.75</span>
                </label>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-sm font-extrabold text-gray-900">Total</span>
              <span className="text-2xl font-extrabold text-gray-900">${finalTotal.toFixed(2)}</span>
            </div>

            {/* Payment Method Radio Group */}
            <div className="space-y-4 mb-6 border-b border-gray-200 pb-6">
              {/* Direct Bank Transfer */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer group mb-2">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={() => setPaymentMethod('bank')}
                    className="w-4 h-4 accent-black cursor-pointer" 
                  />
                  <span className="text-sm font-extrabold text-gray-900">Direct bank transfer</span>
                </label>
                <AnimatePresence>
                  {paymentMethod === 'bank' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed pl-7 py-1">
                        Make your payment directly into our bank account. Please use your Order ID as the payment reference. Your order will not be shipped until the funds have cleared in our account.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Cash on Delivery */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="w-4 h-4 accent-black cursor-pointer" 
                  />
                  <span className="text-sm font-extrabold text-gray-900">Cash on delivery</span>
                </label>
              </div>

              {/* PayPal */}
              <div>
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="radio" 
                    name="payment" 
                    value="paypal"
                    checked={paymentMethod === 'paypal'}
                    onChange={() => setPaymentMethod('paypal')}
                    className="w-4 h-4 accent-black cursor-pointer" 
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-extrabold text-gray-900">PayPal</span>
                    {/* Simulated payment icons */}
                    <div className="flex gap-1">
                      <div className="w-6 h-4 bg-blue-600 rounded-sm"></div>
                      <div className="w-6 h-4 bg-red-500 rounded-sm"></div>
                      <div className="w-6 h-4 bg-orange-400 rounded-sm"></div>
                    </div>
                    <span className="text-[10px] text-blue-500 underline ml-1 hidden sm:inline-block">What is PayPal?</span>
                  </div>
                </label>
              </div>
            </div>

            {/* Privacy Policy & Terms */}
            <div className="mb-6">
              <p className="text-[11px] md:text-xs text-gray-500 leading-relaxed mb-4">
                Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <Link href="#" className="text-red-500 underline font-medium">privacy policy</Link>.
              </p>
              
              <label className="flex items-start gap-3 cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="w-4 h-4 accent-black cursor-pointer mt-0.5 shrink-0" 
                />
                <span className="text-[11px] md:text-xs font-medium text-gray-700">
                  I have read and agree to the website terms and conditions
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <button 
              disabled={!termsAccepted}
              className={`w-full py-4 rounded-lg font-bold text-sm transition-all shadow-md ${
                termsAccepted 
                  ? 'bg-black text-white hover:bg-gray-800 hover:shadow-lg' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              PLACE ORDER
            </button>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}