import React, { useState, useEffect } from 'react';
import { useSearchParams, useParams } from 'react-router-dom';
import api from '../services/api';
import { Product, Category, Brand } from '../types';
import { ProductCard } from '../components/product/ProductCard';
import {
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
  Star,
  Check,
} from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const ProductsPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { categorySlug } = useParams<{ categorySlug?: string }>();

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState<string>(
    categorySlug || searchParams.get('category') || ''
  );
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.get('brand') ? searchParams.get('brand')!.split(',') : []
  );
  const [searchQuery, setSearchQuery] = useState<string>(
    searchParams.get('q') || searchParams.get('search') || ''
  );
  const [priceMin, setPriceMin] = useState<string>(searchParams.get('minPrice') || '');
  const [priceMax, setPriceMax] = useState<string>(searchParams.get('maxPrice') || '');
  const [minRating, setMinRating] = useState<string>(searchParams.get('minRating') || '');
  const [inStockOnly, setInStockOnly] = useState<boolean>(searchParams.get('inStock') === 'true');
  const [selectedRam, setSelectedRam] = useState<string>(searchParams.get('ram') || '');
  const [selectedStorage, setSelectedStorage] = useState<string>(searchParams.get('storage') || '');
  const [sortBy, setSortBy] = useState<string>(searchParams.get('sort') || 'newest');

  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Fetch filter metadata (categories, brands)
  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [catsRes, brandsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/brands'),
        ]);
        setCategories(catsRes.data.data || []);
        setBrands(brandsRes.data.data || []);
      } catch (err) {
        console.error('Error fetching filter metadata:', err);
      }
    };
    fetchMeta();
  }, []);

  // Update category when URL param changes
  useEffect(() => {
    if (categorySlug) {
      setSelectedCategory(categorySlug);
    }
  }, [categorySlug]);

  // Main product fetch
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const params: any = {
          page: currentPage,
          limit: 12,
          sort: sortBy,
        };

        if (searchQuery) params.search = searchQuery;
        if (selectedCategory) params.category = selectedCategory;
        if (selectedBrands.length > 0) params.brand = selectedBrands.join(',');
        if (priceMin) params.minPrice = priceMin;
        if (priceMax) params.maxPrice = priceMax;
        if (minRating) params.minRating = minRating;
        if (inStockOnly) params.inStock = 'true';
        if (selectedRam) params.ram = selectedRam;
        if (selectedStorage) params.storage = selectedStorage;

        if (searchParams.get('deals') === 'true') params.deals = 'true';
        if (searchParams.get('premium') === 'true') params.premium = 'true';
        if (searchParams.get('newArrival') === 'true') params.newArrival = 'true';

        const res = await api.get('/products', { params });
        if (res.data.success) {
          setProducts(res.data.data.products);
          setTotalCount(res.data.data.pagination.total);
          setTotalPages(res.data.data.pagination.totalPages);
        }
      } catch (err) {
        console.error('Error fetching catalog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [
    currentPage,
    searchQuery,
    selectedCategory,
    selectedBrands,
    priceMin,
    priceMax,
    minRating,
    inStockOnly,
    selectedRam,
    selectedStorage,
    sortBy,
    searchParams,
  ]);

  const handleBrandToggle = (slug: string) => {
    setSelectedBrands((prev) =>
      prev.includes(slug) ? prev.filter((b) => b !== slug) : [...prev, slug]
    );
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setSelectedCategory('');
    setSelectedBrands([]);
    setPriceMin('');
    setPriceMax('');
    setMinRating('');
    setInStockOnly(false);
    setSelectedRam('');
    setSelectedStorage('');
    setSortBy('newest');
    setCurrentPage(1);
  };

  const currentCategoryName =
    categories.find((c) => c.slug === selectedCategory)?.name ||
    (selectedCategory ? selectedCategory.replace(/-/g, ' ').toUpperCase() : 'All Products');

  const ramOptions = ['4 GB', '6 GB', '8 GB', '12 GB', '16 GB'];
  const storageOptions = ['64 GB', '128 GB', '256 GB', '512 GB', '1 TB'];

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
          Filter Products
        </h3>
        <button
          onClick={handleClearFilters}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Categories
        </h4>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-2 no-scrollbar text-xs">
          <label className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
            <input
              type="radio"
              name="catFilter"
              checked={selectedCategory === ''}
              onChange={() => {
                setSelectedCategory('');
                setCurrentPage(1);
              }}
              className="text-indigo-600 focus:ring-indigo-500 rounded"
            />
            <span className={selectedCategory === '' ? 'font-bold text-indigo-600' : 'text-slate-600'}>
              All Categories
            </span>
          </label>
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
              <input
                type="radio"
                name="catFilter"
                checked={selectedCategory === cat.slug}
                onChange={() => {
                  setSelectedCategory(cat.slug);
                  setCurrentPage(1);
                }}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className={selectedCategory === cat.slug ? 'font-bold text-indigo-600' : 'text-slate-600'}>
                {cat.name}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Brand Filter */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Brands
        </h4>
        <div className="space-y-1.5 max-h-44 overflow-y-auto pr-2 no-scrollbar text-xs">
          {brands.map((b) => (
            <label key={b.id} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
              <input
                type="checkbox"
                checked={selectedBrands.includes(b.slug)}
                onChange={() => handleBrandToggle(b.slug)}
                className="text-indigo-600 focus:ring-indigo-500 rounded"
              />
              <span className="text-slate-600">{b.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Price Range (₹)
        </h4>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <label className="text-[10px] text-slate-500">Min Price</label>
            <input
              type="number"
              value={priceMin}
              onChange={(e) => {
                setPriceMin(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="₹ 0"
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>
          <div>
            <label className="text-[10px] text-slate-500">Max Price</label>
            <input
              type="number"
              value={priceMax}
              onChange={(e) => {
                setPriceMax(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="₹ 150000"
              className="w-full p-2 border border-slate-300 rounded-lg text-xs"
            />
          </div>
        </div>
      </div>

      {/* RAM Filter */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          RAM Memory
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {ramOptions.map((ram) => (
            <button
              key={ram}
              onClick={() => {
                setSelectedRam(selectedRam === ram ? '' : ram);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 text-xs rounded-lg border transition ${
                selectedRam === ram
                  ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {ram}
            </button>
          ))}
        </div>
      </div>

      {/* Storage Filter */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Internal Storage
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {storageOptions.map((st) => (
            <button
              key={st}
              onClick={() => {
                setSelectedStorage(selectedStorage === st ? '' : st);
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 text-xs rounded-lg border transition ${
                selectedStorage === st
                  ? 'bg-indigo-600 text-white border-indigo-600 font-bold'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="pt-4 border-t border-slate-200">
        <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
          Customer Rating
        </h4>
        <div className="space-y-1 text-xs">
          {['4.5', '4.0', '3.5'].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer hover:text-indigo-600">
              <input
                type="radio"
                name="ratingFilter"
                checked={minRating === r}
                onChange={() => {
                  setMinRating(minRating === r ? '' : r);
                  setCurrentPage(1);
                }}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className="flex items-center gap-1 text-slate-700">
                <span>{r}★ & above</span>
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Stock Availability */}
      <div className="pt-4 border-t border-slate-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              setCurrentPage(1);
            }}
            className="text-indigo-600 focus:ring-indigo-500 rounded"
          />
          <span className="text-xs font-semibold text-slate-700">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Header Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-200">
        <div>
          <div className="text-xs text-slate-400 mb-1">
            Home &bull; Catalog &bull; <span className="text-slate-700 font-medium">{currentCategoryName}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight capitalize">
            {searchQuery ? `Search Results for "${searchQuery}"` : currentCategoryName}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Showing {products.length} of {totalCount} authentic mobile & electronics products
          </p>
        </div>

        {/* Sort and Mobile Filter Toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 rounded-xl bg-white border border-slate-300 text-slate-700 font-semibold text-xs flex items-center gap-2 shadow-sm"
          >
            <Filter className="w-4 h-4 text-indigo-600" />
            <span>Filters</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-500 font-medium hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="newest">Newest Launches</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid with Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-sm h-fit sticky top-28">
          <FilterSidebar />
        </aside>

        {/* Product Cards Container */}
        <main className="lg:col-span-3">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-4 animate-pulse space-y-4">
                  <div className="w-full h-44 bg-slate-200 rounded-xl" />
                  <div className="h-4 bg-slate-200 rounded w-2/3" />
                  <div className="h-6 bg-slate-200 rounded w-1/2" />
                  <div className="h-8 bg-slate-200 rounded" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                  >
                    Previous
                  </button>

                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                        currentPage === idx + 1
                          ? 'bg-indigo-600 text-white shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-bold text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-4">
                <SlidersHorizontal className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-1">
                No matching electronics found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                We couldn't find any products matching your current search or filter criteria. Try adjusting the price range, brand, or search terms.
              </p>
              <button
                onClick={handleClearFilters}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md transition"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-80 max-w-[85vw] h-full bg-white shadow-2xl p-6 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-4">
              <h3 className="font-bold text-sm text-slate-900">Filters</h3>
              <button onClick={() => setMobileFilterOpen(false)} className="p-1 text-slate-500 hover:text-slate-800">
                <X className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar />
            <div className="mt-6 pt-4 border-t border-slate-200">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-indigo-600 text-white rounded-xl font-bold text-xs shadow-md"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
