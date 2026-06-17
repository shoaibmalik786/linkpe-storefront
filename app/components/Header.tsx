'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, Headset, ChevronDown, Menu, User, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import type { Store, Category } from '@linkpe-storefront/sdk';
import { cartCount, CART_CHANGED_EVENT } from '@/lib/cart';

export default function Header({ store, categories = [] }: { store?: Store | null; categories?: Category[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [browseOpen, setBrowseOpen] = useState(false);
  const [count, setCount] = useState(0);
  const catRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const update = () => setCount(cartCount());
    update();
    window.addEventListener(CART_CHANGED_EVENT, update);
    window.addEventListener('storage', update);
    return () => {
      window.removeEventListener(CART_CHANGED_EVENT, update);
      window.removeEventListener('storage', update);
    };
  }, []);

  function submitSearch(e: React.FormEvent) {
    e.preventDefault();
    const q = query.trim();
    router.push(q ? `/shop?search=${encodeURIComponent(q)}` : '/shop');
  }

  const showSupport = !!store?.contact?.phone;
  const logoUrl = store?.store_logo_url ?? null;
  const storeName = store?.business_name ?? 'Store';

  return (
    <header className="w-full bg-brand-bg relative z-50">
      {/* Top Bar */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-gray-200 flex items-center justify-between gap-4 bg-[var(--light-dark)]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={storeName} className="h-9 w-auto max-w-[160px] object-contain" />
          ) : (
            <>
              <div className="w-8 h-8 bg-brand-yellow rounded-full flex items-center justify-center">
                <span className="font-extrabold text-brand-dark text-lg leading-none">{storeName.charAt(0).toUpperCase()}</span>
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-brand-dark">{storeName}</span>
            </>
          )}
        </Link>

        {/* Search */}
        <form onSubmit={submitSearch} className="hidden lg:flex flex-1 max-w-2xl border border-gray-300 rounded-full overflow-hidden bg-white items-center h-14 shadow-sm">
          <div className="relative h-full">
            <button
              type="button"
              onClick={() => setCatOpen((o) => !o)}
              className="flex items-center gap-2 px-5 h-full text-sm font-medium text-gray-700 hover:text-brand-dark bg-gray-50 border-r border-gray-300 transition-colors"
            >
              All Categories <ChevronDown size={16} className="text-gray-400" />
            </button>
            {catOpen && categories.length > 0 && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setCatOpen(false)} />
                <div ref={catRef} className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 max-h-80 overflow-y-auto">
                  {categories.map((c) => (
                    <Link key={c.id} href={`/shop?category=${encodeURIComponent(c.slug)}`} onClick={() => setCatOpen(false)} className="block px-4 py-2 text-sm text-brand-dark hover:bg-gray-50">
                      {c.name}
                    </Link>
                  ))}
                </div>
              </>
            )}
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products"
            className="flex-1 px-5 h-full outline-none text-sm text-brand-dark placeholder-gray-400"
          />
          <button type="submit" className="px-5 h-full text-gray-500 hover:text-brand-dark transition-colors bg-white">
            <Search size={20} />
          </button>
        </form>

        {/* Support */}
        {showSupport && (
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
              <Headset size={20} className="text-yellow-600" />
            </div>
            <div className="flex flex-col justify-center">
              <span className="text-[10px] text-gray-500 font-bold tracking-wider">SUPPORT</span>
              <a href={`tel:${store?.contact?.phone}`} className="text-sm font-extrabold text-brand-dark">{store?.contact?.phone}</a>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-col md:flex-row gap-4 md:gap-0">
        {/* Browse Categories */}
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setBrowseOpen((o) => !o)}
            className="flex items-center gap-2 bg-brand-yellow text-brand-dark px-6 py-3 rounded-full font-bold text-sm hover:bg-yellow-400 transition-colors shadow-sm bg-[var(--light-dark)]"
          >
            <Menu size={20} strokeWidth={2.5} />
            BROWSE CATEGORIES
            <ChevronDown size={16} strokeWidth={2.5} />
          </button>
          {browseOpen && categories.length > 0 && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setBrowseOpen(false)} />
              <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20 max-h-96 overflow-y-auto">
                {categories.map((c) => (
                  <Link key={c.id} href={`/shop?category=${encodeURIComponent(c.slug)}`} onClick={() => setBrowseOpen(false)} className="block px-4 py-2.5 text-sm font-medium text-brand-dark hover:bg-gray-50">
                    {c.name}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Nav */}
        <nav className="hidden lg:flex items-center gap-8">
          <Link href="/" className="text-sm font-bold text-brand-dark hover:text-brand-red transition-colors">Home</Link>
          <Link href="/shop" className="text-sm font-bold text-brand-dark hover:text-brand-red transition-colors">Shop</Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center gap-5 shrink-0">
          <Link href="/login" className="text-brand-dark hover:text-brand-red transition-colors"><User size={24} strokeWidth={2} /></Link>
          <button className="text-brand-dark hover:text-brand-red transition-colors"><Heart size={24} strokeWidth={2} /></button>
          <Link href="/cart" className="relative text-brand-dark hover:text-brand-red transition-colors">
            <ShoppingBag size={24} strokeWidth={2} />
            <span className="absolute -top-2 -right-2 bg-brand-red text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {count}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
