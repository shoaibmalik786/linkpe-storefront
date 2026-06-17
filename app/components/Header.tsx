'use client';

import { Search, Headset, ChevronDown, Menu, User, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Shop', href: '/shop' },
  { name: 'Blog', href: '/blog' },
  { name: 'Post Layout', href: '/post-layout' },
  { name: 'Portfolio', href: '/portfolio' },
  { name: 'Pages', href: '/pages' },
];

export default function Header() {
  return (
    <header className="w-full bg-brand-bg relative z-50">
      {/* Top Bar: Search and Support */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 flex items-center justify-between gap-4 bg-[var(--light-dark)]">
        
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
            <span className="font-extrabold text-brand-dark text-lg leading-none">P</span>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-brand-dark">Logo</span>
        </Link>

        {/* Search Bar (Hidden on Mobile) */}
        <div className="hidden lg:flex flex-1 max-w-2xl border border-gray-300 rounded-full overflow-hidden bg-white items-center h-14 shadow-sm">
          <button className="flex items-center gap-2 px-5 h-full text-sm font-medium text-gray-700 hover:text-brand-dark bg-gray-50 border-r border-gray-300 transition-colors">
            All Categories <ChevronDown size={16} className="text-gray-400" />
          </button>
          <input 
            type="text" 
            placeholder="Search for products" 
            className="flex-1 px-5 h-full outline-none text-sm text-brand-dark placeholder-gray-400"
          />
          <button className="px-5 h-full text-gray-500 hover:text-brand-dark transition-colors bg-white">
            <Search size={20} />
          </button>
        </div>

        {/* Support Section (Hidden on Mobile) */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
            <Headset size={20} className="text-yellow-600" />
          </div>
          <div className="flex flex-col justify-center">
            <span className="text-[10px] text-gray-500 font-bold tracking-wider">24/7 SUPPORT</span>
            <span className="text-sm font-extrabold text-brand-dark">+123 456 789</span>
          </div>
        </div>
      </div>

      {/* Bottom Bar: Navigation and Icons */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-col md:flex-row">
        
        {/* Browse Categories Button */}
        <button className="flex items-center gap-2 bg-brand-yellow text-brand-dark px-6 py-3 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors shadow-sm shrink-0 bg-[var(--light-dark)]">
          <Menu size={20} strokeWidth={2.5} />
          BROWSE CATEGORIES
          <ChevronDown size={16} strokeWidth={2.5} />
        </button>

        {/* Main Navigation Links (Hidden on Mobile) */}
        <nav className="hidden lg:flex items-center gap-8">
          {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="flex items-center gap-1 text-sm font-bold text-brand-dark hover:text-brand-red transition-colors"
              >
                {item.name}
                <span className="text-gray-400 text-xs font-normal">+</span>
              </Link>
            ))}
        </nav>

        {/* Action Icons */}
        <div className="flex items-center gap-5 shrink-0">
          {/* Mobile Search Icon */}
          <button className="lg:hidden text-brand-dark hover:text-brand-red transition-colors">
            <Search size={24} strokeWidth={2} />
          </button>
          
          <button className="text-brand-dark hover:text-brand-red transition-colors">
            <User size={24} strokeWidth={2} />
          </button>
          <button className="text-brand-dark hover:text-brand-red transition-colors">
            <Heart size={24} strokeWidth={2} />
          </button>
          
          {/* Cart Icon with Badge */}
          <button className="relative text-brand-dark hover:text-brand-red transition-colors">
            <ShoppingBag size={24} strokeWidth={2} />
            <span className="absolute -top-2 -right-2 bg-brand-red text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              0
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}