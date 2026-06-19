'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, X, Ship, Package } from 'lucide-react';
import Link from 'next/link';
import {
  CART_CHANGED_EVENT,
  readCart,
  updateCartQuantity,
  removeCartItem,
} from '@/lib/cart';

export default function CartClient() {

  const [cartItems, setCartItems] = useState<any[]>([]);
  
  // --- CART FUNCTIONALITY ---
  useEffect(() => {
    const loadCart = () => {
      const cart = readCart();

      const formattedCart = cart.map((item) => ({
        id: item.product_id,
        name: item.name,
        price: item.unit_price,
        quantity: item.quantity,
        image:
          item.image_url || '/placeholder.png',
      }));

      setCartItems(formattedCart);
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


  const updateQuantity = (
    id: string,
    delta: number
  ) => {
    const updatedCart = cartItems.map((item) => {
      if (item.id === id) {
        const newQuantity = Math.max(
          1,
          item.quantity + delta
        );

        return {
          ...item,
          quantity: newQuantity,
        };
      }

      return item;
    });

    setCartItems(updatedCart);

    const updatedItem = updatedCart.find(
      (item) => item.id === id
    );

    if (updatedItem) {
      updateCartQuantity(
        id,
        updatedItem.quantity
      );
    }
  };

  const removeItem = (id: string) => {
    const updatedCart = cartItems.filter(
      (item) => item.id !== id
    );

    setCartItems(updatedCart);

    removeCartItem(id);
  };


  // --- DERIVED CALCULATIONS ---
  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }, [cartItems]);

  const finalTotal = cartSubtotal;

  return (
    <>
      {cartItems.length === 0 ? (
        <div className="py-12 text-center text-gray-500 font-bold">
          Your cart is currently empty.
        </div>
      ) : (
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
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover shrink-0"
                      />
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
            </div>

            {/* Coupon & Update Cart Section */}
            {/*<div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
          
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
              <button 
                onClick={handleUpdateCart}
                className="w-full sm:w-auto bg-black text-white px-8 py-3.5 rounded-lg font-bold text-sm hover:bg-gray-800 transition-colors shadow-md"
              >
                UPDATE CART
              </button>
            </div>*/}
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
      )}
    </>
  );
}