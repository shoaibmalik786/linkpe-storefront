'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import Header from '../../../components/Header';
import Footer from '../../../components/Footer';

// Mock data to match the screenshots exactly
const ORDER_DATA = {
  id: '1',
  status: 'IN PROGRESS',
  item: 'casual shirt',
  startTime: '05 April 2024, 15:43:23',
  courier: 'casual shirt',
  address: 'Address 451 Wall Street UK, London',
  timeline: [
    { 
      status: 'Product Shipped', 
      date: '08/04/2024 5:23pm', 
      details: [
        { label: 'Courier Service', value: 'UPS, R. Gosling' },
        { label: 'Estimated Delivery Date', value: '09/04/2024' }
      ],
      state: 'completed', // Green dot
      isLastCompleted: false
    },
    { 
      status: 'Product Shipped', 
      date: '08/04/2024 5:23pm', 
      details: [
        { label: 'Tracking Number', value: '3409-4216-8759' },
        { label: 'Warehouse', value: 'Top Shirt 12b' }
      ],
      state: 'current', // Red dot
      isLastCompleted: true
    },
    { 
      status: 'Product Packaging', 
      date: '09/04/2024 4:34pm', 
      details: [],
      state: 'pending' // Empty dot
    },
    { 
      status: 'Order Placed', 
      date: '10/04/2024 2:36pm', 
      details: [],
      state: 'pending' // Empty dot
    }
  ]
};

const TABS = ['Order History', 'Item Details', 'Courier', 'Receiver'];

export default function OrderDetailsPage() {
  const [activeTab, setActiveTab] = useState('Order History');

  // --- TAB RENDER LOGIC ---
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Order History':
        return (
          <div className="pt-6 relative">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-10 bottom-8 w-[2px] bg-gray-200 border-l border-dashed border-gray-300"></div>
            
            <div className="space-y-8 relative z-10">
              {ORDER_DATA.timeline.map((step, idx) => (
                <div key={idx} className="flex items-start gap-6">
                  {/* Timeline Indicator */}
                  <div className="mt-1 flex-shrink-0 relative">
                    <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center shadow-sm z-10 relative">
                      {step.state === 'completed' && <div className="w-2.5 h-2.5 rounded-full bg-[#5cb85c]"></div>}
                      {step.state === 'current' && <div className="w-2.5 h-2.5 rounded-full bg-[#ff5858]"></div>}
                      {step.state === 'pending' && <div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div>}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div>
                    <h4 className="text-sm font-extrabold text-brand-dark mb-1">{step.status}</h4>
                    <p className="text-[11px] text-gray-500 font-medium mb-2">{step.date}</p>
                    
                    {step.details.length > 0 && (
                      <div className="space-y-1">
                        {step.details.map((detail, dIdx) => (
                          <p key={dIdx} className="text-[11px] text-gray-800">
                            <span className="font-extrabold">{detail.label} : </span> 
                            {detail.value}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Item Details':
        return (
          <div className="pt-6">
            <h3 className="text-lg font-extrabold text-brand-dark mb-6">Item Details</h3>
            
            {/* Product Card */}
            <div className="flex items-center gap-6 mb-10">
              <div className="w-24 h-24 rounded-xl border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center p-2 bg-white">
                <img 
                  src="https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=200&auto=format&fit=crop" 
                  alt="Collar Casual Shirt" 
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <h4 className="text-base font-extrabold text-brand-dark">Collar Casual Shirt</h4>
                <p className="text-sm font-bold text-gray-800"><span className="font-extrabold text-brand-dark">Price : </span>$150</p>
                <p className="text-sm font-bold text-gray-500"><span className="font-extrabold text-brand-dark">Size : </span>Xl</p>
              </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm font-bold text-gray-600">
                <span>Total Price</span>
                <span className="text-brand-dark">+ $150</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-[#5cb85c]">
                <span>Total Discounts</span>
                <span className="text-brand-dark">- $55</span>
              </div>
              <hr className="border-gray-100" />
              <div className="flex justify-between items-center text-sm font-extrabold text-gray-600">
                <span>Order Total</span>
                <span className="text-brand-dark text-lg">$95</span>
              </div>
            </div>
          </div>
        );

      case 'Courier':
        return (
          <div className="pt-8">
            <p className="text-sm text-gray-600 font-medium leading-relaxed">
              Commyolk Suspendisse et justo. Praesent mattis augue Aliquam ornare hendrerit augue Cras tellus In pulvinar lectus a est Curabitur eget orci Cras laoreet. Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Suspendisse et justo. Praesent mattis commyolk augue aliquam ornare.
            </p>
          </div>
        );

      case 'Receiver':
        return (
          <div className="pt-6">
            <h3 className="text-lg font-extrabold text-[#00b573] mb-8">
              Thank you Your order has been received
            </h3>
            
            <div className="space-y-4 text-sm">
              <p><span className="text-gray-500">Order Number : </span><span className="font-extrabold text-brand-dark">#17493</span></p>
              <p><span className="text-gray-500">Date : </span><span className="font-extrabold text-brand-dark">17/04/2024, 02:34pm</span></p>
              <p><span className="text-gray-500">Total : </span><span className="font-extrabold text-brand-dark">$95</span></p>
              <p><span className="text-gray-500">Payment Methods : </span><span className="font-extrabold text-brand-dark">Cash on Delivery</span></p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

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
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Orders</h1>
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Link href="/" className="hover:text-brand-yellow transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-brand-yellow">Orders</span>
          </div>
        </div>
      </section>

      {/* 2. MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-8">
        
        {/* LEFT SIDEBAR: Account Navigation */}
        <aside className="w-full lg:w-[300px] shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            
            {/* User Profile Info */}
            <div className="p-8 text-center border-b border-gray-100 flex flex-col items-center">
              <div className="w-20 h-20 rounded-full bg-pink-100 overflow-hidden mb-4 shadow-inner border-2 border-white">
                <img 
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop" 
                  alt="Ronald M. Spino" 
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-extrabold text-brand-dark">Ronald M. Spino</h3>
              <p className="text-sm text-brand-red font-medium">info@example.com</p>
            </div>

            {/* Navigation Menus */}
            <div className="p-6">
              <div className="mb-8">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Dashboard</h4>
                <ul className="space-y-1">
                  <li><Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">Dashboard</Link></li>
                  <li><Link href="#" className="block px-2 py-2.5 text-sm font-extrabold text-brand-dark bg-gray-50 rounded-lg">Orders</Link></li>
                  <li><Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">Downloads</Link></li>
                  <li><Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">Return request</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Account Settings</h4>
                <ul className="space-y-1">
                  <li><Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">Profile</Link></li>
                  <li><Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">Address</Link></li>
                  <li><Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">Shipping methods</Link></li>
                  <li><Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">Payment Methods</Link></li>
                  <li><Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">Review</Link></li>
                </ul>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT: Order Details */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-10">
            
            {/* Header: Item Image & Title */}
            <div className="flex items-center gap-6 pb-8 border-b border-gray-200 border-dashed">
              <div className="w-16 h-16 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden shrink-0 bg-white">
                 <img src="https://images.unsplash.com/photo-1596755094514-f87e32f85e2c?q=80&w=200&auto=format&fit=crop" alt="Shirt" className="w-full h-full object-contain p-1" />
              </div>
              <div>
                <span className="inline-block bg-[#ff5858] text-white text-[10px] font-bold px-2 py-1 rounded-sm tracking-wider uppercase mb-2">
                  {ORDER_DATA.status}
                </span>
                <h2 className="text-xl font-extrabold text-brand-dark leading-tight">
                  Order {ORDER_DATA.id}
                </h2>
              </div>
            </div>

            {/* Meta Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 py-8 border-b border-gray-200 border-dashed">
              <div>
                <span className="block text-xs font-medium text-gray-500 mb-1">Item</span>
                <span className="block text-sm font-extrabold text-brand-dark">{ORDER_DATA.item}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-500 mb-1">Courier</span>
                <span className="block text-sm font-extrabold text-brand-dark">{ORDER_DATA.courier}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-500 mb-1">Start Time</span>
                <span className="block text-sm font-extrabold text-brand-dark">{ORDER_DATA.startTime}</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-500 mb-1">Address</span>
                <span className="block text-sm font-extrabold text-brand-dark">{ORDER_DATA.address}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 py-8">
              <button className="bg-black text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">
                Export Details
              </button>
              <button className="bg-white text-brand-dark border border-gray-300 px-6 py-3 rounded-lg text-sm font-bold hover:border-black transition-colors">
                Request Confirmation
              </button>
              <button className="bg-white text-brand-red border border-gray-300 px-6 py-3 rounded-lg text-sm font-bold hover:border-brand-red transition-colors">
                Cancel Order
              </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex items-center gap-6 border-b border-gray-200 overflow-x-auto hide-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-4 text-sm font-extrabold whitespace-nowrap transition-colors relative ${
                    activeTab === tab 
                      ? 'text-[#ec003f]' 
                      : 'text-gray-900 hover:text-[#ec003f]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTabIndicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#ec003f]"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content Area */}
            <div className="min-h-[250px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}