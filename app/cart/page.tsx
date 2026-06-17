'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, Ship, Package, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';

// --- MOCK CART DATA ---
const INITIAL_CART = [
  { id: 1, name: 'Sophisticated Swagger Suit', price: 28.00, quantity: 1, imageColor: 'bg-[#5c7a9c]' },
  { id: 2, name: 'Cozy Knit Cardigan Sweater', price: 56.00, quantity: 1, imageColor: 'bg-[#b886c1]' },
  { id: 3, name: 'Athletic Mesh Sports Leggings', price: 20.00, quantity: 1, imageColor: 'bg-[#d97c36]' },
  { id: 4, name: 'Plaid Wool Winter Coat', price: 42.00, quantity: 1, imageColor: 'bg-[#b4c5c2]' },
  { id: 5, name: 'Satin Wrap Party Blouse', price: 35.00, quantity: 1, imageColor: 'bg-[#e27c94]' },
  { id: 6, name: 'Suede Ankle Booties Collection', price: 38.00, quantity: 1, imageColor: 'bg-[#e62a4d]' },
];

export default function CartPage() {
  // --- STATE MANAGEMENT ---
  const [cartItems, setCartItems] = useState(INITIAL_CART);
  const [couponInput, setCouponInput] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // --- CART FUNCTIONALITY ---
  const updateQuantity = (id: number, delta: number) => {
    setCartItems(prev => prev.map(item => {
      if (item.id === id) {
        const newQuantity = Math.max(1, item.quantity + delta); // Prevent going below 1
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const handleUpdateCart = () => {
    // Simple mock coupon logic
    // If user enters 'SAVE20', they get a flat $20 discount
    if (couponInput.toUpperCase() === 'SAVE20') {
      setAppliedDiscount(20);
    } else {
      setAppliedDiscount(0); // Reset if invalid
      if (couponInput.length > 0) {
        alert("Invalid Coupon Code. Try 'SAVE20'");
      }
    }
  };

  // --- DERIVED CALCULATIONS ---
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const finalTotal = Math.max(0, cartSubtotal - appliedDiscount);

  return (
    <main className="min-h-screen bg-brand-bg text-brand-dark pb-24">
      <Header />
      {/* 1. TOP BANNER */}
      <section 
        className="relative w-full h-48 md:h-64 bg-[#c8a98c] flex flex-col items-center justify-center bg-cover bg-center" 
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop")' }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Shop Cart</h1>
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Link href="/" className="hover:text-brand-yellow transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-brand-yellow">Shop Cart</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 mt-12 flex flex-col lg:flex-row gap-12">
        
        {/* LEFT COLUMN: Cart Table */}
        <div className="w-full lg:w-[65%]">
          
          {/* Table Headers (Hidden on Mobile) */}
          <div className="hidden md:grid grid-cols-12 gap-4 pb-4 border-b border-gray-200 text-sm font-extrabold text-brand-dark mb-4">
            <div className="col-span-6">Product</div>
            <div className="col-span-2 text-center">Price</div>
            <div className="col-span-2 text-center">Quantity</div>
            <div className="col-span-2 text-right">Subtotal</div>
          </div>

          {/* Cart Items */}
          <div className="flex flex-col">
            <AnimatePresence>
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center py-6 border-b border-gray-100 group"
                >
                  {/* Product Info */}
                  <div className="col-span-1 md:col-span-6 flex items-center gap-4">
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-full shrink-0 ${item.imageColor} shadow-inner`}></div>
                    <span className="font-extrabold text-sm md:text-base leading-tight pr-4">
                      {item.name}
                    </span>
                  </div>

                  {/* Price (Hidden on mobile, merged with subtotal usually, but shown as requested) */}
                  <div className="col-span-1 md:col-span-2 flex md:justify-center font-bold text-gray-500 text-sm md:text-base mt-2 md:mt-0">
                    <span className="md:hidden mr-2">Price:</span> ${item.price.toFixed(2)}
                  </div>

                  {/* Quantity Controls */}
                  <div className="col-span-1 md:col-span-2 flex items-center md:justify-center gap-3">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors shrink-0"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="w-8 text-center font-bold">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-colors shrink-0"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Subtotal & Remove Button */}
                  <div className="col-span-1 md:col-span-2 flex items-center justify-between md:justify-end gap-4 mt-4 md:mt-0">
                    <div className="font-extrabold text-brand-dark">
                      <span className="md:hidden mr-2">Subtotal:</span> 
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center hover:bg-red-500 transition-colors shrink-0"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {cartItems.length === 0 && (
              <div className="py-12 text-center text-gray-500 font-bold">
                Your cart is currently empty.
              </div>
            )}
          </div>

          {/* Coupon & Update Cart Section */}
          <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
            {/* Coupon Input */}
            <div className="relative w-full sm:w-[350px]">
              <input 
                type="text" 
                value={couponInput}
                onChange={(e) => setCouponInput(e.target.value)}
                placeholder="Coupon Code" 
                className="w-full border border-gray-300 rounded-lg py-3 px-4 text-sm font-medium outline-none focus:border-black transition-colors bg-transparent"
              />
              <button 
                onClick={handleUpdateCart}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-extrabold text-brand-dark hover:text-brand-red transition-colors"
              >
                Apply Coupon
              </button>
            </div>

            {/* Update Cart Button */}
            <button 
              onClick={handleUpdateCart}
              className="w-full sm:w-auto bg-black text-white px-8 py-3.5 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-md"
            >
              UPDATE CART
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Cart Summary */}
        <div className="w-full lg:w-[35%]">
          <h2 className="text-xl font-extrabold text-brand-dark mb-6">Cart Total</h2>
          
          <div className="border border-gray-200 rounded-2xl p-6 bg-white/50">
            
            {/* Promo Blocks */}
            <div className="space-y-4 mb-6">
              <div className="border border-gray-200 rounded-xl py-3 text-center font-extrabold text-sm">
                Bank Offer 5% Cashback
              </div>

              <div className="border border-gray-200 rounded-xl p-4 flex items-center gap-4">
                <Ship size={32} strokeWidth={1} className="text-gray-500 shrink-0" />
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest">FREE</span>
                  <span className="font-extrabold text-sm">Enjoy The Product</span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-xl p-4 flex gap-4">
                <Package size={32} strokeWidth={1} className="text-gray-500 shrink-0" />
                <div>
                  <span className="font-extrabold text-sm block mb-1">Enjoy The Product</span>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Lorem Ipsum is simply dummy text of the printing and typesetting.
                  </p>
                </div>
              </div>
            </div>

            {/* Savings Indicator */}
            {appliedDiscount > 0 && (
              <div className="flex items-center gap-2 text-green-600 font-bold text-sm mb-6 border-b border-gray-100 pb-6">
                <CheckCircle2 size={18} />
                You will save ${appliedDiscount.toFixed(2)} on this order
              </div>
            )}

            {/* Total Row */}
            <div className="flex items-center justify-between mb-8">
              <span className="font-extrabold text-brand-dark text-lg">Total</span>
              <span className="font-extrabold text-brand-dark text-2xl">
                ${finalTotal.toFixed(2)}
              </span>
            </div>

            {/* Action Button */}
            {/*<button className="w-full bg-black text-white py-4 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg">
              PLACE ORDER
            </button>*/}

            <Link href="/checkout" className="w-full flex justify-center bg-black text-white py-4 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-lg">PLACE ORDER</Link>
          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}