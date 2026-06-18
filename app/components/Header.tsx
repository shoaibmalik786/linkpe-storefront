'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ChevronDown, Heart, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import type { Store, Category } from '@linkpe-storefront/sdk';
import { cartCount, CART_CHANGED_EVENT } from '@/lib/cart';

export default function Header({ store, categories = [] }: { store?: Store | null; categories?: Category[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [selectedCat, setSelectedCat] = useState<Category | null>(null);
  const [count, setCount] = useState(0);

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
    const params = new URLSearchParams();
    if (selectedCat) params.set('category', selectedCat.slug);
    const q = query.trim();
    if (q) params.set('search', q);
    const qs = params.toString();
    router.push(qs ? `/shop?${qs}` : '/shop');
  }

  const showSupport = !!store?.contact?.phone;
  const logoUrl = store?.store_logo_url ?? null;
  const storeName = store?.business_name ?? 'Store';

  return (
    <header className="w-full bg-brand-bg relative z-50">
      {/* Top Bar — primary-colored band */}
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-4 border-b border-white/10 flex items-center justify-between gap-4 bg-brand-dark text-white">
        {/* Logo — sits on a white plaque so it stays visible on the dark band */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={storeName} className="h-14 md:h-16 w-auto max-w-[240px] object-contain bg-white rounded-lg" />
          ) : (
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">{storeName}</span>
          )}
        </Link>

        {/* Search — white pill with a working category scope + accent submit */}
        <form
          onSubmit={submitSearch}
          className="hidden lg:flex flex-1 max-w-2xl items-center h-14 rounded-full bg-white pr-1.5 shadow-[0_10px_30px_rgba(0,0,0,0.28)] ring-1 ring-black/5"
        >
          <div className="relative h-full">
            <button
              type="button"
              onClick={() => setCatOpen((o) => !o)}
              className="flex items-center gap-2 h-full pl-6 pr-4 text-sm font-semibold text-brand-dark rounded-l-full hover:bg-gray-50 transition-colors"
            >
              <span className="max-w-[150px] truncate">{selectedCat?.name ?? 'All Categories'}</span>
              <ChevronDown size={16} className={`text-gray-400 transition-transform ${catOpen ? 'rotate-180' : ''}`} />
            </button>
            {catOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setCatOpen(false)} />
                <div className="absolute top-[calc(100%+0.75rem)] left-0 w-60 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-20 max-h-80 overflow-y-auto">
                  <button
                    type="button"
                    onClick={() => { setSelectedCat(null); setCatOpen(false); }}
                    className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${!selectedCat ? 'text-brand-accent font-semibold' : 'text-brand-dark'}`}
                  >
                    All Categories
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => { setSelectedCat(c); setCatOpen(false); }}
                      className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 ${selectedCat?.id === c.id ? 'text-brand-accent font-semibold' : 'text-brand-dark'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          <span className="h-7 w-px bg-gray-200 shrink-0" />

          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for products"
            className="flex-1 px-5 h-full outline-none text-sm text-brand-dark placeholder-gray-400 bg-transparent"
          />

          <button
            type="submit"
            aria-label="Search"
            className="h-11 w-11 rounded-full bg-brand-accent text-white flex items-center justify-center hover:opacity-90 transition-opacity shrink-0"
          >
            <Search size={18} />
          </button>
        </form>

        {/* Icons — sit on the dark band, so light with an accent hover */}
        <div className="flex items-center gap-5 shrink-0">
          <Link href="/cart" className="relative text-white hover:text-brand-accent transition-colors">
            <ShoppingBag size={24} strokeWidth={2} />
            <span className="absolute -top-2 -right-2 bg-brand-accent text-white text-[10px] font-bold w-[18px] h-[18px] rounded-full flex items-center justify-center">
              {count}
            </span>
          </Link>
        </div>
      </div>

      {/* Bottom Bar */}
      {/*<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between flex-col md:flex-row gap-4 md:gap-0">
        <div className="relative shrink-0">
          <button
            type="button"
            onClick={() => setBrowseOpen((o) => !o)}
            className="flex items-center gap-2 bg-brand-dark text-white px-6 py-3 rounded-full font-bold text-sm hover:opacity-90 transition-opacity shadow-sm"
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
      </div>*/}
    </header>
  );
}
