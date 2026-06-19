'use client';

import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, List, Grid, LayoutGrid, X, SlidersHorizontal } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import type { Product, Category } from '@linkpe-storefront/sdk';

type SortKey = 'latest' | 'price_asc' | 'price_desc';

export default function ShopClient({
  products,
  categories,
  initialCategorySlug,
  initialSearch,
}: {
  products: Product[];
  categories: Category[];
  initialCategorySlug?: string | null;
  initialSearch?: string;
}) {
  // Price bounds from the real catalog.
  const [priceMin, priceMax] = useMemo(() => {
    if (!products.length) return [0, 0];
    const prices = products.map((p) => p.price);
    return [Math.floor(Math.min(...prices)), Math.ceil(Math.max(...prices))];
  }, [products]);

  // Variant facets (Size / Color / …) derived from the products' variant groups.
  const variantFacets = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const p of products) {
      for (const g of p.variant_groups ?? []) {
        const set = map.get(g.name) ?? new Set<string>();
        for (const o of g.options) if (o.is_active !== false && o.label) set.add(o.label);
        if (set.size) map.set(g.name, set);
      }
    }
    return [...map.entries()].map(([name, set]) => ({ name, options: [...set] }));
  }, [products]);

  // Category counts.
  const categoryCounts = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of products) if (p.category_id) counts.set(p.category_id, (counts.get(p.category_id) ?? 0) + 1);
    return counts;
  }, [products]);

  const initialCatId = useMemo(
    () => categories.find((c) => c.slug === initialCategorySlug)?.id ?? null,
    [categories, initialCategorySlug]
  );

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(initialSearch ?? '');
  const [maxPrice, setMaxPrice] = useState<number>(priceMax);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(initialCatId ? [initialCatId] : []);
  const [selectedVariants, setSelectedVariants] = useState<Record<string, string[]>>({});
  const [sortBy, setSortBy] = useState<SortKey>('latest');
  const [itemsPerPage, setItemsPerPage] = useState<number>(24);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'max-grid'>('max-grid');
  const [currentPage, setCurrentPage] = useState(1);

  const currency = products[0]?.currency ?? 'INR';
  const fmt = (n: number) => `${currency === 'INR' ? '₹' : ''}${n.toLocaleString('en-IN')}`;

  function toggle(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  function productMatchesVariants(p: Product): boolean {
    for (const [groupName, labels] of Object.entries(selectedVariants)) {
      if (!labels.length) continue;
      const g = (p.variant_groups ?? []).find((vg) => vg.name === groupName);
      if (!g || !g.options.some((o) => labels.includes(o.label))) return false;
    }
    return true;
  }

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (searchTerm && !p.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
      if (p.price > maxPrice) return false;
      if (selectedCategories.length && !(p.category_id && selectedCategories.includes(p.category_id))) return false;
      if (!productMatchesVariants(p)) return false;
      return true;
    });
    if (sortBy === 'price_asc') result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === 'price_desc') result = [...result].sort((a, b) => b.price - a.price);
    // 'latest' keeps the API order (newest first)
    return result;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, searchTerm, maxPrice, selectedCategories, selectedVariants, sortBy]);

  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const page = Math.min(currentPage, totalPages);
  const pageProducts = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  function resetFilters() {
    setSearchTerm('');
    setMaxPrice(priceMax);
    setSelectedCategories([]);
    setSelectedVariants({});
    setCurrentPage(1);
  }

  const gridClass =
    viewMode === 'list' ? 'grid-cols-1' : viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4';

  const FilterContent = () => (
    <div className="space-y-8 pb-10 lg:pb-0">
      <div className="flex items-center justify-between text-lg font-bold border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2"><SlidersHorizontal size={20} /> Filter</div>
        <button className="lg:hidden text-gray-500 hover:text-black" onClick={() => setIsMobileFilterOpen(false)}><X size={24} /></button>
      </div>

      <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white focus-within:border-brand-dark transition-colors">
        <input
          type="text"
          placeholder="Search Product"
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="flex-1 outline-none text-sm bg-transparent"
        />
        <Search size={16} className="text-gray-400" />
      </div>

      {priceMax > priceMin && (
        <div>
          <h3 className="font-bold mb-4">Price</h3>
          <input
            type="range"
            min={priceMin}
            max={priceMax}
            value={maxPrice}
            onChange={(e) => { setMaxPrice(parseInt(e.target.value)); setCurrentPage(1); }}
            className="w-full accent-brand-dark mb-2"
          />
          <div className="flex justify-between text-xs font-bold text-gray-500">
            <span>Min: {fmt(priceMin)}</span>
            <span>Max: {fmt(maxPrice)}</span>
          </div>
        </div>
      )}

      {variantFacets.map((facet) => (
        <div key={facet.name}>
          <h3 className="font-bold mb-4">{facet.name}</h3>
          <div className="flex flex-wrap gap-2">
            {facet.options.map((label) => {
              const selected = (selectedVariants[facet.name] ?? []).includes(label);
              return (
                <button
                  key={label}
                  onClick={() => { setSelectedVariants((prev) => ({ ...prev, [facet.name]: toggle(prev[facet.name] ?? [], label) })); setCurrentPage(1); }}
                  className={`min-w-9 h-9 px-3 rounded-full text-xs font-bold border transition-colors flex items-center justify-center ${
                    selected ? 'bg-brand-dark text-white border-brand-dark' : 'bg-white text-gray-700 border-gray-300 hover:border-brand-dark'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {categories.length > 0 && (
        <div>
          <h3 className="font-bold mb-4">Category</h3>
          <ul className="space-y-2">
            {categories.map((cat) => (
              <li
                key={cat.id}
                className="flex justify-between items-center cursor-pointer group"
                onClick={() => { setSelectedCategories((prev) => toggle(prev, cat.id)); setCurrentPage(1); }}
              >
                <span className={`text-sm font-medium transition-colors ${selectedCategories.includes(cat.id) ? 'text-brand-dark font-bold' : 'text-gray-600 group-hover:text-brand-dark'}`}>
                  {cat.name}
                </span>
                <span className="text-xs text-gray-400">({categoryCounts.get(cat.id) ?? 0})</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button onClick={resetFilters} className="bg-brand-dark text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:opacity-90 transition-colors w-full lg:w-auto">
        RESET ALL
      </button>
    </div>
  );

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 lg:mt-12 flex flex-col lg:flex-row gap-8 pb-[50px]">
      <aside className="hidden lg:block w-[280px] shrink-0 md:bg-white/50 md:p-4 md:rounded-lg md:h-full md:shadow-lg sticky top-5"><FilterContent /></aside>

      <AnimatePresence>
        {isMobileFilterOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsMobileFilterOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" />
            <motion.aside initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'tween', duration: 0.3 }} className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-50 p-6 overflow-y-auto lg:hidden shadow-2xl">
              <FilterContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 p-3 lg:p-2 rounded-lg border border-gray-100">
          <div className="flex items-center justify-between w-full md:w-auto">
            <p className="text-sm font-medium text-gray-500">
              {totalItems > 0 ? `Showing ${(page - 1) * itemsPerPage + 1}–${Math.min(page * itemsPerPage, totalItems)} of ${totalItems}` : 'No products'}
            </p>
            <button onClick={() => setIsMobileFilterOpen(true)} className="lg:hidden flex items-center gap-2 bg-brand-dark text-white px-4 py-2 rounded-full text-xs font-bold shadow-md hover:opacity-90 transition-colors ml-4">
              <SlidersHorizontal size={14} /> FILTERS
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortKey)} className="bg-transparent text-sm font-medium border-b border-gray-300 outline-none pb-1 cursor-pointer">
              <option value="latest">Latest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
            {/*<select value={itemsPerPage} onChange={(e) => { setItemsPerPage(Number(e.target.value)); setCurrentPage(1); }} className="bg-transparent text-sm font-medium border-b border-gray-300 outline-none pb-1 cursor-pointer">
              <option value={9}>9 Products</option>
              <option value={12}>12 Products</option>
              <option value={24}>24 Products</option>
              <option value={48}>48 Products</option>
            </select>*/}
            <div className="flex items-center gap-2 text-gray-400">
              {/*<button onClick={() => setViewMode('list')} className={viewMode === 'list' ? 'text-brand-dark' : 'hover:text-brand-dark transition-colors'}><List size={20} /></button>*/}
              <button onClick={() => setViewMode('grid')} className={viewMode === 'grid' ? 'text-brand-dark' : 'hover:text-brand-dark transition-colors'}><LayoutGrid size={20} /></button>
              <button onClick={() => setViewMode('max-grid')} className={viewMode === 'max-grid' ? 'text-brand-dark' : 'hover:text-brand-dark transition-colors'}><Grid size={20} /></button>
            </div>
          </div>
        </div>

        <motion.div layout className={`grid ${gridClass} gap-4 lg:gap-6`}>
          <AnimatePresence mode="popLayout">
            {pageProducts.map((product) => (
              <motion.div key={product.id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} transition={{ duration: 0.3 }}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {totalItems === 0 && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-gray-400">
            <Search size={48} className="mb-4 opacity-20" />
            <p className="text-lg font-bold">No products found matching your filters.</p>
            <button onClick={resetFilters} className="mt-4 text-brand-red hover:underline font-medium">Clear filters</button>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8 pt-8 flex-wrap">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx + 1}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold transition-colors ${
                  page === idx + 1 ? 'bg-brand-dark text-white' : 'bg-transparent border border-gray-300 text-brand-dark hover:border-brand-dark'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
