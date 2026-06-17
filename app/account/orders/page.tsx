'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

// --- MOCK ORDER DATA ---
// Generating enough orders to demonstrate working pagination
const ALL_ORDERS = [
  { id: '1', date: 'Jan 21, 2025', status: 'IN PROGRESS', total: 358.75 },
  { id: '2', date: 'Feb 09, 2025', status: 'CANCELED', total: 760.50 },
  { id: '3', date: 'Jan 15, 2025', status: 'DELAYED', total: 1264.00 },
  { id: '4', date: 'Jan 19, 2025', status: 'DELIVERED', total: 198.35 },
  { id: '5', date: 'Jan 04, 2025', status: 'DELIVERED', total: 2133.90 },
  { id: '6', date: 'Jan 30, 2025', status: 'DELIVERED', total: 86.40 },
  { id: '7', date: 'Jan 21, 2025', status: 'DELIVERED', total: 86.40 },
  { id: '8', date: 'Jan 07, 2025', status: 'DELIVERED', total: 112.40 },
  // Additional mock data for pages 2 and 3
  ...Array.from({ length: 16 }).map((_, i) => ({
    id: `#${Math.random().toString(36).substring(2, 12).toUpperCase()}`,
    date: `Feb ${String((i % 28) + 1).padStart(2, '0')}, 2025`,
    status: ['IN PROGRESS', 'DELIVERED', 'CANCELED', 'DELAYED'][i % 4],
    total: parseFloat((Math.random() * 500 + 50).toFixed(2))
  }))
];

// Helper to get exact badge colors matching your design
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'IN PROGRESS':
      return 'bg-[#4facfe] text-white'; // Blue
    case 'CANCELED':
      return 'bg-[#ff5858] text-white'; // Red
    case 'DELAYED':
      return 'bg-[#f0ad4e] text-white'; // Orange/Yellow
    case 'DELIVERED':
      return 'bg-[#5cb85c] text-white'; // Green
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

export default function OrdersPage() {
  // --- PAGINATION STATE ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Exact number from your screenshot

  const totalPages = Math.ceil(ALL_ORDERS.length / itemsPerPage);

  const currentOrders = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return ALL_ORDERS.slice(start, start + itemsPerPage);
  }, [currentPage]);

  const handlePrev = () => setCurrentPage((p) => Math.max(1, p - 1));
  const handleNext = () => setCurrentPage((p) => Math.min(totalPages, p + 1));

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
                {/* Simulated Avatar - Replace src with actual user avatar */}
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
                  <li>
                    <Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    {/* Active State applies a subtle background or bold text */}
                    <Link href="#" className="block px-2 py-2.5 text-sm font-extrabold text-brand-dark bg-gray-50 rounded-lg">
                      Orders
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">
                      Downloads
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">
                      Return request
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 px-2">Account Settings</h4>
                <ul className="space-y-1">
                  <li>
                    <Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">
                      Address
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">
                      Shipping methods
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">
                      Payment Methods
                    </Link>
                  </li>
                  <li>
                    <Link href="#" className="block px-2 py-2.5 text-sm font-bold text-gray-600 hover:text-brand-red transition-colors">
                      Review
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </aside>

        {/* RIGHT CONTENT: Orders Table */}
        <div className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
            
            {/* Table Container (Allows horizontal scroll on small devices) */}
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[700px]">
                
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-4 pr-4 text-sm font-extrabold text-brand-dark">ORDER #</th>
                    <th className="py-4 px-4 text-sm font-extrabold text-brand-dark">DATE PURCHASED</th>
                    <th className="py-4 px-4 text-sm font-extrabold text-brand-dark">STATUS</th>
                    <th className="py-4 px-4 text-sm font-extrabold text-brand-dark">TOTAL</th>
                    <th className="py-4 pl-4 text-sm font-extrabold text-brand-dark text-right">ACTION</th>
                  </tr>
                </thead>
                
                {/* Table Body */}
                <tbody>
                  {currentOrders.map((order, index) => (
                    <tr 
                      key={order.id} 
                      className={index !== currentOrders.length - 1 ? 'border-b border-gray-100' : ''}
                    >
                      <td className="py-5 pr-4 text-sm font-bold text-brand-dark whitespace-nowrap">
                        {order.id}
                      </td>
                      <td className="py-5 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">
                        {order.date}
                      </td>
                      <td className="py-5 px-4 whitespace-nowrap">
                        <span className={`text-[10px] font-bold px-3 py-1.5 rounded-sm tracking-wider uppercase ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-5 px-4 text-sm font-medium text-gray-500 whitespace-nowrap">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="py-5 pl-4 text-right whitespace-nowrap">
                        <Link href={`/account/orders/${order.id}`} className="text-sm font-bold text-brand-red hover:underline">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8 pt-8 border-t border-gray-100">
                
                <button 
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-4 h-10 rounded-full flex items-center justify-center text-sm font-bold border border-gray-300 text-brand-dark hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  PREV
                </button>
                
                {Array.from({ length: totalPages }).map((_, idx) => {
                  const pageNumber = idx + 1;
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors border ${
                        currentPage === pageNumber 
                          ? 'border-black text-brand-dark' 
                          : 'border-transparent text-gray-500 hover:border-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}

                <button 
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-4 h-10 rounded-full flex items-center justify-center text-sm font-bold border border-gray-300 text-brand-dark hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  NEXT
                </button>

              </div>
            )}

          </div>
        </div>

      </div>

      <Footer />
    </main>
  );
}