'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, List, Grid, LayoutGrid, X, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import Header from '../components/Header';
import Footer from '../components/Footer';
import QuickViewModal from '../components/QuickViewModal';

// --- MOCK DATA ---
const CATEGORIES = [
  { name: 'Dresses', count: 10 }, { name: 'Top & Blouses', count: 5 },
  { name: 'Boots', count: 17 }, { name: 'Jewelry', count: 13 },
  { name: 'Makeup', count: 11 }, { name: 'Fragrances', count: 17 },
  { name: 'Shaving & Grooming', count: 13 }, { name: 'Jacket', count: 12 },
  { name: 'Coat', count: 22 }
];

const COLORS = ['#000000', '#60a5fa', '#34d399', '#f87171', '#fbcfe8', '#a78bfa', '#38bdf8', '#fbbf24', '#2563eb', '#86efac'];
const SIZES = ['4', '6', '8', '10', '12', '14', '16', '18', '20'];
const TAGS = ['Vintage', 'Wedding', 'Cotton', 'Linen', 'Navy', 'Urban', 'Business Meeting', 'Formal'];

// Generate 36 mock products to test pagination and filters
const generateProducts = () => {
  return Array.from({ length: 36 }).map((_, i) => ({
    id: i + 1,
    name: `Product Title ${i + 1}`,
    // price: Math.floor(Math.random() * (350 - 40 + 1) + 40),
    price: 40 + (i * 7) % 310,
    category: CATEGORIES[i % CATEGORIES.length].name,
    color: COLORS[i % COLORS.length],
    size: SIZES[i % SIZES.length],
    tag: TAGS[i % TAGS.length],
    // rating: Math.floor(Math.random() * 5) + 1,
    rating: (i % 5) + 1,
    // dateAdded: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).getTime(),
    dateAdded: 1720000000000 + i * 1000000,
    imageColor: ['bg-[#b886c1]', 'bg-[#5c7a9c]', 'bg-[#d887b4]', 'bg-[#d97c36]', 'bg-[#e2a8b8]'][i % 5],
  }));
};

export default function ShopPage() {
  // --- STATE MANAGEMENT ---
  const MOCK_PRODUCTS = useMemo(() => generateProducts(), []);

  // Mobile Drawer
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState<[number, number]>([40, 350]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  
  // Toolbar Options
  const [sortBy, setSortBy] = useState('Latest');
  const [itemsPerPage, setItemsPerPage] = useState<number | 'all'>(9);
  const [viewMode, setViewMode] = useState<'list' | 'grid' | 'max-grid'>('max-grid'); 
  const [currentPage, setCurrentPage] = useState(1);
  
  // Quick View
  const [quickViewProduct, setQuickViewProduct] = useState<any | null>(null);

  // --- FILTERING LOGIC ---
  const filteredAndSortedProducts = useMemo(() => {
    let result = MOCK_PRODUCTS;

    if (searchTerm) result = result.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    result = result.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1]);
    if (selectedColors.length > 0) result = result.filter(p => selectedColors.includes(p.color));
    if (selectedSizes.length > 0) result = result.filter(p => selectedSizes.includes(p.size));
    if (selectedCategories.length > 0) result = result.filter(p => selectedCategories.includes(p.category));
    if (selectedTags.length > 0) result = result.filter(p => selectedTags.includes(p.tag));

    switch (sortBy) {
      case 'Price: Low to High': result.sort((a, b) => a.price - b.price); break;
      case 'Price: High to Low': result.sort((a, b) => b.price - a.price); break;
      case 'Average rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'Popularity': break;
      case 'Latest': default: result.sort((a, b) => b.dateAdded - a.dateAdded); break;
    }
    return result;
  }, [searchTerm, priceRange, selectedColors, selectedSizes, selectedCategories, selectedTags, sortBy]);

  // --- PAGINATION LOGIC ---
  const totalItems = filteredAndSortedProducts.length;
  const perPage = itemsPerPage === 'all' ? 36 : itemsPerPage;
  const totalPages = Math.ceil(totalItems / perPage);
  
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * perPage;
    return filteredAndSortedProducts.slice(start, start + perPage);
  }, [filteredAndSortedProducts, currentPage, perPage]);

  // Reset function
  const handleResetFilters = () => {
    setSearchTerm('');
    setPriceRange([40, 350]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedCategories([]);
    setSelectedTags([]);
    setCurrentPage(1);
  };

  // View Mode Classes
  const gridClass = 
    viewMode === 'list' ? 'grid-cols-1' :
    viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2' :
    'grid-cols-2 md:grid-cols-3 lg:grid-cols-5';

  // --- REUSABLE FILTER CONTENT ---
  // Extracted so we don't write it twice for mobile and desktop
  const FilterContent = () => (
    <div className="space-y-8 pb-10 lg:pb-0">
      <div className="flex items-center justify-between text-lg font-bold border-b border-gray-200 pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={20} /> Filter
        </div>
        {/* Close button only visible on mobile drawer */}
        <button className="lg:hidden text-gray-500 hover:text-black" onClick={() => setIsMobileFilterOpen(false)}>
          <X size={24} />
        </button>
      </div>

      {/* Search */}
      <div>
        <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 bg-white focus-within:border-brand-dark transition-colors">
          <input 
            type="text" 
            placeholder="Search Product" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 outline-none text-sm bg-transparent"
          />
          <Search size={16} className="text-gray-400" />
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="font-bold mb-4">Price</h3>
        <input 
          type="range" 
          min="40" 
          max="350" 
          value={priceRange[1]} 
          onChange={(e) => setPriceRange([40, parseInt(e.target.value)])}
          className="w-full accent-brand-dark mb-2"
        />
        <div className="flex justify-between text-xs font-bold text-gray-500">
          <span>Min Price: 40</span>
          <span>Max Price: {priceRange[1]}</span>
        </div>
      </div>

      {/* Color Filter */}
      <div>
        <h3 className="font-bold mb-4">Color</h3>
        <div className="flex flex-wrap gap-2">
          {COLORS.map(color => (
            <button 
              key={color} 
              onClick={() => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color])}
              className={`w-5 h-5 rounded-full border-2 transition-transform ${selectedColors.includes(color) ? 'scale-125 border-brand-dark' : 'border-transparent'}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h3 className="font-bold mb-4">Size</h3>
        <div className="flex flex-wrap gap-2">
          {SIZES.map(size => (
            <button 
              key={size}
              onClick={() => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size])}
              className={`w-9 h-9 rounded-full text-xs font-bold border transition-colors flex items-center justify-center
                ${selectedSizes.includes(size) ? 'bg-black text-white border-black' : 'bg-white text-gray-700 border-gray-300 hover:border-brand-dark'}`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h3 className="font-bold mb-4">Category</h3>
        <ul className="space-y-2">
          {CATEGORIES.map(cat => (
            <li key={cat.name} className="flex justify-between items-center cursor-pointer group" onClick={() => setSelectedCategories(prev => prev.includes(cat.name) ? prev.filter(c => c !== cat.name) : [...prev, cat.name])}>
              <span className={`text-sm font-medium transition-colors ${selectedCategories.includes(cat.name) ? 'text-[var(--primary)] font-bold' : 'text-gray-600 group-hover:text-brand-dark'}`}>
                {cat.name}
              </span>
              <span className="text-xs text-gray-400">({cat.count})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Tags Filter */}
      <div>
        <h3 className="font-bold mb-4">Tags</h3>
        <div className="flex flex-wrap gap-2">
          {TAGS.map(tag => (
            <button 
              key={tag}
              onClick={() => setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
              className={`px-4 py-1.5 border rounded-sm text-xs font-medium transition-colors
                ${selectedTags.includes(tag) ? 'bg-black text-white border-black' : 'bg-white text-gray-600 border-gray-300 hover:border-brand-dark'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <button onClick={handleResetFilters} className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-gray-800 transition-colors w-full lg:w-auto">
        RESET ALL
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-brand-bg text-brand-dark pb-20">
      <Header />
      
      {/* 1. TOP BANNER */}
      <section className="relative w-full h-48 md:h-64 bg-[#c8a98c] flex flex-col items-center justify-center bg-cover bg-center" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=2000&auto=format&fit=crop")' }}>
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4">Shop With Category</h1>
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Link href="/" className="hover:text-brand-yellow transition-colors">Home</Link>
            <span>&gt;</span>
            <span className="text-brand-yellow">Shop With Category</span>
          </div>
        </div>
      </section>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-8 lg:mt-12 flex flex-col lg:flex-row gap-8 pb-[50px]">
        
        {/* 2. DESKTOP SIDEBAR (Hidden on Mobile/iPad Portrait, Visible on iPad Pro/Desktop) */}
        <aside className="hidden lg:block w-[280px] shrink-0">
          <FilterContent />
        </aside>

        {/* 2.5 MOBILE/TABLET FILTER DRAWER */}
        <AnimatePresence>
          {isMobileFilterOpen && (
            <>
              {/* Dark Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                onClick={() => setIsMobileFilterOpen(false)}
                className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
              />
              {/* Sliding Drawer */}
              <motion.aside 
                initial={{ x: '-100%' }} 
                animate={{ x: 0 }} 
                exit={{ x: '-100%' }} 
                transition={{ type: 'tween', duration: 0.3 }}
                className="fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-50 p-6 overflow-y-auto lg:hidden shadow-2xl"
              >
                <FilterContent />
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        {/* 3. RIGHT CONTENT AREA */}
        <div className="flex-1 flex flex-col gap-8">
          {/* Top Category Visual Row */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 hidden sm:grid">
            {['Bliss Dress', 'Glam Pants', 'Leggings', 'Classic Capri', 'Dapper Coat'].map((item, idx) => (
              <div key={item} className="flex flex-col gap-2 group cursor-pointer">
                <div className="aspect-[3/4] bg-gray-200 rounded-2xl overflow-hidden">
                   <div className={`w-full h-full ${['bg-[#8b72be]', 'bg-[#c99580]', 'bg-[#89a8c7]', 'bg-[#d89759]', 'bg-[#e5b3c3]'][idx]} group-hover:scale-105 transition-transform duration-500`}>
                     <img src="https://pixio-react.vercel.app/assets/1-DUSobqN6.png" alt="img" />
                   </div>
                </div>
                <span className="text-xs lg:text-sm font-extrabold text-center group-hover:text-brand-red transition-colors">{item}</span>
              </div>
            ))}
          </div>

          {/* Toolbar */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/50 p-3 lg:p-2 rounded-lg border border-gray-100">
            
            <div className="flex items-center justify-between w-full md:w-auto">
              <p className="text-sm font-medium text-gray-500">
                Showing {Math.min((currentPage - 1) * perPage + 1, totalItems)}–{Math.min(currentPage * perPage, totalItems)} Of {totalItems}
              </p>
              
              {/* Mobile Filter Button */}
              <button 
                onClick={() => setIsMobileFilterOpen(true)}
                className="lg:hidden flex items-center gap-2 bg-brand-dark text-black px-4 py-2 rounded-full text-xs font-bold shadow-md hover:bg-gray-800 transition-colors ml-4"
              >
                <SlidersHorizontal size={14} /> FILTERS
              </button>
            </div>
            
            <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-between md:justify-end">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-sm font-medium border-b border-gray-300 outline-none pb-1 cursor-pointer">
                <option>Latest</option>
                <option>Popularity</option>
                <option>Average rating</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>

              <select value={itemsPerPage} onChange={(e) => setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value))} className="bg-transparent text-sm font-medium border-b border-gray-300 outline-none pb-1 cursor-pointer">
                <option value="all">Products</option>
                <option value={9}>9 Products</option>
                <option value={12}>12 Products</option>
                <option value={14}>14 Products</option>
                <option value={18}>18 Products</option>
                <option value={24}>24 Products</option>
              </select>

              <div className="flex items-center gap-2 text-gray-400">
                <button onClick={() => setViewMode('list')} className={`hover:text-brand-dark transition-colors ${viewMode === 'list' ? 'text-brand-dark' : ''}`}><List size={20} /></button>
                <button onClick={() => setViewMode('grid')} className={`hover:text-brand-dark transition-colors ${viewMode === 'grid' ? 'text-brand-dark' : ''}`}><LayoutGrid size={20} /></button>
                <button onClick={() => setViewMode('max-grid')} className={`hover:text-brand-dark transition-colors ${viewMode === 'max-grid' ? 'text-brand-dark' : ''}`}><Grid size={20} /></button>
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <motion.div layout className={`grid ${gridClass} gap-4 lg:gap-6`}>
            <AnimatePresence mode="popLayout">
              {currentProducts.map(product => (
                <motion.div 
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className={`group flex ${viewMode === 'list' ? 'flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6' : 'flex-col'} cursor-pointer`}
                >
                  <div className={`relative rounded-3xl overflow-hidden ${viewMode === 'list' ? 'w-full sm:w-48 aspect-[4/5] shrink-0' : 'w-full aspect-[4/5] mb-3 lg:mb-4'}`}>
                    <div className={`w-full h-full ${product.imageColor} group-hover:scale-105 transition-transform duration-700 flex item-center justify-center m-auto`}>
                      <img src="https://pixio-react.vercel.app/assets/9-Cmgnlp8l.png" alt="img" />
                    </div>
                    
                    <div className="absolute top-4 left-4 bg-white text-brand-dark text-[10px] font-bold px-3 py-1.5 rounded-sm z-10">GET 20% OFF</div>
                    
                    <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
                      <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:text-brand-red shadow-sm"><Heart size={14} /></button>
                      <button className="w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-gray-500 hover:text-brand-dark shadow-sm"><ShoppingBag size={14} /></button>
                    </div>

                    {/* Quick View Button */}
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <button 
                        onClick={(e) => { e.stopPropagation(); setQuickViewProduct(product); }}
                        className="bg-black text-white text-[10px] font-bold px-4 py-2 rounded-full whitespace-nowrap hover:bg-gray-800"
                      >
                        QUICK VIEW
                      </button>
                    </div>
                  </div>

                  <div className={`flex flex-col ${viewMode === 'list' ? 'flex-1 justify-center' : 'justify-between items-start'}`}>
                    <h3 className="text-sm lg:text-base font-extrabold text-brand-dark leading-tight group-hover:text-brand-red transition-colors line-clamp-2 mb-1 lg:mb-2">
                      {product.name}
                    </h3>
                    <span className="font-extrabold text-brand-dark">${product.price}.00</span>
                    {viewMode === 'list' && <p className="text-sm text-gray-500 mt-2 sm:mt-4 line-clamp-3">This is a beautiful product perfectly designed for your fashion needs. Made with high quality materials.</p>}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* No Results Fallback */}
          {currentProducts.length === 0 && (
             <div className="w-full py-20 flex flex-col items-center justify-center text-gray-400">
                <Search size={48} className="mb-4 opacity-20" />
                <p className="text-lg font-bold">No products found matching your filters.</p>
                <button onClick={handleResetFilters} className="mt-4 text-brand-red hover:underline font-medium">Clear filters</button>
             </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8 pt-8 flex-wrap">
              {Array.from({ length: totalPages }).map((_, idx) => (
                <button
                  key={idx + 1}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-8 h-8 lg:w-10 lg:h-10 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold transition-colors ${
                    currentPage === idx + 1 ? 'bg-black text-white' : 'bg-transparent border border-gray-300 text-brand-dark hover:border-black'
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button 
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 h-8 lg:h-10 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold border border-gray-300 bg-transparent text-brand-dark hover:border-black disabled:opacity-50 disabled:cursor-not-allowed transition-colors ml-2"
              >
                NEXT
              </button>
            </div>
          )}

        </div>
      </div>

      {/* 4. QUICK VIEW POPUP PLACEHOLDER */}
      {/*<AnimatePresence>
        {quickViewProduct && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl p-6 lg:p-8 flex flex-col md:flex-row gap-6 lg:gap-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            >
              <button 
                onClick={() => setQuickViewProduct(null)}
                className="absolute top-4 right-4 lg:top-6 lg:right-6 text-gray-400 hover:text-black transition-colors z-10 bg-white rounded-full p-1 shadow-sm"
              >
                <X size={20} />
              </button>
              
              <div className={`w-full md:w-1/2 aspect-[4/5] rounded-2xl ${quickViewProduct.imageColor}`}></div>
              
              <div className="w-full md:w-1/2 flex flex-col justify-center">
                <h2 className="text-2xl lg:text-3xl font-extrabold mb-4">{quickViewProduct.name}</h2>
                <span className="text-xl lg:text-2xl font-bold text-brand-red mb-6">${quickViewProduct.price}.00</span>
                <p className="text-gray-500 mb-8 text-sm lg:text-base">Detailed design for the quick view modal will go here in the next update. This validates the state is working perfectly!</p>
                <button className="bg-black text-white py-3 lg:py-4 rounded-full font-bold w-full hover:bg-gray-800 transition-colors text-sm lg:text-base">ADD TO CART</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>*/}

      {/* 4. QUICK VIEW POPUP */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal 
            product={quickViewProduct} 
            onClose={() => setQuickViewProduct(null)} 
          />
        )}
      </AnimatePresence>

      <Footer />
    </main>
  );
}