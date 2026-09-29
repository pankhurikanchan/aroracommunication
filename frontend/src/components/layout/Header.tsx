import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  Heart,
  User,
  Menu,
  X,
  PhoneCall,
  ShieldCheck,
  Truck,
  Sparkles,
  ChevronDown,
  LayoutDashboard,
  Package,
  LogOut,
  MapPin,
  Flame,
  ArrowRight,
  Clock,
  Tag,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatINR } from '../../utils/formatters';
import api from '../../services/api';
import { Product } from '../../types';

const NAV_CATEGORIES = [
  { name: 'All Products', slug: '', isAll: true },
  { name: 'Smartphones', slug: 'smartphones' },
  { name: 'iPhones', slug: 'iphones' },
  { name: 'Android Phones', slug: 'android-phones' },
  { name: 'Tablets', slug: 'tablets' },
  { name: 'Laptops', slug: 'laptops' },
  { name: 'Smartwatches', slug: 'smartwatches' },
  { name: 'Earphones', slug: 'earphones' },
  { name: 'Headphones', slug: 'headphones' },
  { name: 'Chargers', slug: 'chargers' },
  { name: 'Power Banks', slug: 'power-banks' },
  { name: 'Cables', slug: 'cables' },
  { name: 'Mobile Covers', slug: 'mobile-covers' },
];

const KNOWN_BRANDS = [
  'Apple',
  'Samsung',
  'OnePlus',
  'Google Pixel',
  'Sony',
  'Nothing',
  'boAt',
  'Anker',
  'Spigen',
  'Xiaomi',
  'Realme',
  'JBL',
];

const ANNOUNCEMENTS = [
  {
    icon: <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />,
    text: 'Special Offer: Use code ARORA10 for 10% OFF',
    link: '/deals',
  },
  {
    icon: <Truck className="w-3.5 h-3.5 text-emerald-400" />,
    text: 'Free Express Delivery on orders above ₹1000',
    link: '/shipping-policy',
  },
  {
    icon: <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />,
    text: '100% Genuine Brand Warranty • Official GST Tax Invoices',
    link: '/about',
  },
];

const TRENDING_SEARCHES = [
  'iPhone 16 Pro Max',
  'Samsung Galaxy S24',
  'OnePlus 12 5G',
  'Sony ANC Headphones',
  '65W GaN Fast Charger',
  'Anker Power Bank',
];

export const Header: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount, finalTotal } = useCart();
  const { wishlistIds } = useWishlist();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  // Live autocomplete results
  const [suggestedProducts, setSuggestedProducts] = useState<Product[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Rotate announcement ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentAnnouncement((prev) => (prev + 1) % ANNOUNCEMENTS.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  // Live product search with debounce
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setSuggestedProducts([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        setSearchLoading(true);
        const res = await api.get(`/products?search=${encodeURIComponent(searchQuery.trim())}&limit=4`);
        if (res.data?.success) {
          setSuggestedProducts(res.data.data.products || []);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setSearchLoading(false);
      }
    }, 250);

    return () => clearTimeout(delay);
  }, [searchQuery]);

  // Close search suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(e.target as Node)
      ) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard shortcut '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
      setSearchFocused(false);
    }
  };

  const handleQuickSearchClick = (term: string) => {
    setSearchQuery(term);
    setSearchFocused(false);
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSuggestedProducts([]);
    searchInputRef.current?.focus();
  };

  // Filter matching categories & brands
  const matchingCategories = searchQuery.trim()
    ? NAV_CATEGORIES.filter(
        (c) => !c.isAll && c.name.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  const matchingBrands = searchQuery.trim()
    ? KNOWN_BRANDS.filter((b) =>
        b.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 3)
    : [];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 transition-all">
      {/* 1. TOP OFFER BAR */}
      <div className="bg-gradient-to-r from-slate-950 via-indigo-950 to-blue-950 text-white text-xs py-2 px-4 border-b border-indigo-950">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Animated Announcement Carousel */}
          <div className="flex items-center gap-3 overflow-hidden min-h-[20px]">
            <div className="flex items-center gap-2 transition-all duration-500 ease-in-out">
              {ANNOUNCEMENTS[currentAnnouncement].icon}
              <Link
                to={ANNOUNCEMENTS[currentAnnouncement].link}
                className="font-medium text-slate-200 hover:text-cyan-300 transition text-[11px] sm:text-xs tracking-wide"
              >
                {ANNOUNCEMENTS[currentAnnouncement].text}
              </Link>
            </div>
          </div>

          {/* Right Utility Links */}
          <div className="flex items-center gap-3 text-slate-300 text-[11px]">
            <Link
              to="/admin"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-400/40 font-bold transition shadow-sm"
              title="Store Owner & Admin Panel"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Owner Portal</span>
            </Link>

            <a
              href="tel:+919876543210"
              className="hidden sm:flex items-center gap-1 hover:text-white transition font-medium"
            >
              <PhoneCall className="w-3 h-3 text-cyan-400" />
              <span>+91 98765 43210</span>
            </a>

            <span className="hidden md:inline text-slate-600">|</span>

            <span className="hidden md:inline-flex items-center gap-1 text-slate-400">
              <Clock className="w-3 h-3 text-slate-500" />
              <span>Open 7 Days &bull; 10 AM - 9:30 PM</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-3 sm:gap-6">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 opacity-60 blur-sm group-hover:opacity-100 transition duration-300" />
            <div className="relative w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-950 p-1.5 shadow-md flex items-center justify-center border border-indigo-400/40 group-hover:scale-105 transition-transform duration-200">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <path
                  d="M22 68 C 30 52, 45 42, 60 42 C 72 42, 80 50, 84 58"
                  stroke="#38bdf8"
                  strokeWidth="8"
                  strokeLinecap="round"
                  opacity="0.6"
                />
                <path
                  d="M18 52 C 30 32, 50 24, 70 26 C 80 27, 86 34, 88 40"
                  stroke="#818cf8"
                  strokeWidth="8"
                  strokeLinecap="round"
                />
                <path
                  d="M36 68 L50 32 L64 68"
                  stroke="#ffffff"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path d="M42 56 L58 56" stroke="#06b6d4" strokeWidth="7" strokeLinecap="round" />
                <circle cx="76" cy="30" r="5" fill="#38bdf8" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-black tracking-tight bg-gradient-to-r from-slate-900 via-indigo-900 to-blue-700 bg-clip-text text-transparent flex items-center gap-1.5">
              <span>ARORA</span>
              <span className="font-light text-indigo-600">COMMUNICATION</span>
            </div>
            <div className="flex items-center gap-1.5 text-[9px] uppercase tracking-wider font-bold text-slate-500 -mt-0.5">
              <span className="text-cyan-600 font-extrabold">NOIDA SEC 18</span>
              <span>&bull;</span>
              <span>100% GENUINE ELECTRONICS</span>
            </div>
          </div>
        </Link>

        {/* LARGE SMART SEARCH BAR WITH AUTOCOMPLETE */}
        <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-xl mx-2 relative">
          <form onSubmit={handleSearch} className="relative w-full">
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search iPhones, Samsung Galaxy, smartwatches, chargers..."
              className="w-full pl-11 pr-24 py-2.5 rounded-full border border-slate-300/90 bg-slate-50/80 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-600 text-xs sm:text-sm text-slate-800 placeholder-slate-400 shadow-inner transition-all duration-200"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />

            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
              {searchQuery && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="p-1 text-slate-400 hover:text-slate-600 transition"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
              <kbd className="hidden lg:inline-block px-1.5 py-0.5 text-[10px] font-semibold text-slate-400 bg-slate-200/60 rounded border border-slate-300">
                /
              </kbd>
              <button
                type="submit"
                className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm transition"
              >
                Search
              </button>
            </div>
          </form>

          {/* Autocomplete Suggestions Dropdown */}
          {searchFocused && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-200/90 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150 max-h-[460px] overflow-y-auto">
              {searchQuery.trim().length >= 2 ? (
                <div className="space-y-3.5">
                  {/* Matching Products */}
                  <div>
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-2">
                      Matching Products
                    </span>
                    {searchLoading ? (
                      <div className="py-4 text-center text-xs text-slate-400">Searching products...</div>
                    ) : suggestedProducts.length > 0 ? (
                      <div className="space-y-1.5">
                        {suggestedProducts.map((p) => {
                          const primaryImg = p.images?.find((img) => img.isPrimary)?.url || p.images?.[0]?.url;
                          const currentP = p.discountPrice && p.discountPrice < p.price ? p.discountPrice : p.price;
                          return (
                            <Link
                              key={p.id}
                              to={`/products/${p.slug}`}
                              onClick={() => setSearchFocused(false)}
                              className="flex items-center gap-3 p-2 rounded-xl hover:bg-indigo-50/70 transition group"
                            >
                              <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-200 p-1 shrink-0 overflow-hidden">
                                {primaryImg ? (
                                  <img src={primaryImg} alt="" className="w-full h-full object-contain" />
                                ) : (
                                  <Package className="w-full h-full text-slate-300" />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 truncate">
                                  {p.name}
                                </p>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-extrabold text-slate-900">{formatINR(currentP)}</span>
                                  {p.discountPercentage && p.discountPercentage > 0 && (
                                    <span className="text-[10px] font-bold text-rose-600">{p.discountPercentage}% OFF</span>
                                  )}
                                </div>
                              </div>
                              <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 shrink-0" />
                            </Link>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="py-2 text-xs text-slate-500">No products matching "{searchQuery}"</div>
                    )}
                  </div>

                  {/* Matching Categories */}
                  {matchingCategories.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Categories
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchingCategories.map((c) => (
                          <Link
                            key={c.slug}
                            to={`/category/${c.slug}`}
                            onClick={() => setSearchFocused(false)}
                            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-semibold text-slate-700 transition flex items-center gap-1.5"
                          >
                            <Tag className="w-3 h-3 text-indigo-500" />
                            <span>{c.name}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Matching Brands */}
                  {matchingBrands.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Brands
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {matchingBrands.map((b) => (
                          <Link
                            key={b}
                            to={`/search?q=${encodeURIComponent(b)}`}
                            onClick={() => setSearchFocused(false)}
                            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-xs font-semibold text-slate-700 transition"
                          >
                            {b}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 text-center">
                    <button
                      type="button"
                      onClick={() => handleSearch({ preventDefault: () => {} } as any)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      View all results for "{searchQuery}" &rarr;
                    </button>
                  </div>
                </div>
              ) : (
                /* Empty state: Trending suggestions */
                <div>
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <Flame className="w-3.5 h-3.5 text-rose-500" /> Popular Searches
                    </span>
                    <span className="text-[10px] text-slate-400">Press / to focus</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2.5 pb-2">
                    {TRENDING_SEARCHES.map((term, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleQuickSearchClick(term)}
                        className="px-3 py-1 rounded-full bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-medium transition border border-slate-200/60"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT ACTION ICONS: WISHLIST, CART, ACCOUNT */}
        <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
          {/* Wishlist Icon */}
          <Link
            to="/account?tab=wishlist"
            className="relative p-2.5 text-slate-700 hover:text-rose-600 hover:bg-rose-50 rounded-full transition group"
            title="Wishlist"
            aria-label="Wishlist"
          >
            <Heart className={`w-5 h-5 transition-transform group-hover:scale-110 ${wishlistIds.size > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistIds.size > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse">
                {wishlistIds.size}
              </span>
            )}
          </Link>

          {/* Cart Icon with Live Subtotal */}
          <Link
            to="/cart"
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-50 via-blue-50 to-indigo-100 hover:from-indigo-100 hover:to-blue-100 text-indigo-950 px-3.5 py-2 rounded-full border border-indigo-200/80 transition-all duration-200 shadow-sm hover:shadow group"
            aria-label="Shopping Cart"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-2.5 -right-2.5 bg-indigo-600 text-white text-[10px] font-extrabold w-4 h-4 rounded-full flex items-center justify-center shadow-md">
                  {itemCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[9px] uppercase font-bold text-slate-500 leading-tight">My Cart</span>
              <span className="text-xs font-extrabold text-indigo-700 leading-tight">
                {formatINR(finalTotal)}
              </span>
            </div>
          </Link>

          {/* Account / User Profile Menu */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 py-1.5 px-2.5 rounded-xl hover:bg-slate-100 transition border border-transparent hover:border-slate-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-indigo-600 font-semibold leading-tight">
                      {user.role === 'ADMIN' ? 'Owner / Admin' : 'My Account'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2.5 border-b border-slate-100 bg-slate-50/50 rounded-t-2xl">
                      <p className="text-xs font-extrabold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2.5 text-xs font-bold text-amber-700 hover:bg-amber-50 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-600" />
                        Admin Dashboard & Catalog
                      </Link>
                    )}

                    <Link
                      to="/account?tab=orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      My Orders & Trackers
                    </Link>

                    <Link
                      to="/account?tab=addresses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      <MapPin className="w-4 h-4 text-slate-400" />
                      Delivery Addresses
                    </Link>

                    <Link
                      to="/account?tab=profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 transition"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Account Settings
                    </Link>

                    <div className="border-t border-slate-100 mt-1.5 pt-1.5">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left font-medium transition"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex items-center px-4 py-1.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phones, accessories, electronics..."
            className="w-full pl-9 pr-10 py-2 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 text-indigo-600 font-bold text-xs px-2 py-0.5 hover:bg-indigo-50 rounded"
          >
            Go
          </button>
        </form>
      </div>

      {/* 3. STICKY CATEGORY NAVIGATION STRIP */}
      <nav className="bg-slate-900 text-slate-200 border-t border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center overflow-x-auto no-scrollbar py-2 space-x-1 sm:space-x-2 text-xs font-semibold whitespace-nowrap">
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug || 'all'}
                to={cat.isAll ? '/products' : `/category/${cat.slug}`}
                className={`px-3 py-1 rounded-lg transition ${
                  cat.isAll
                    ? 'text-cyan-300 font-extrabold hover:bg-slate-800'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
              >
                {cat.name}
              </Link>
            ))}

            <Link
              to="/deals"
              className="px-3 py-1 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white font-extrabold hover:opacity-95 transition ml-2 shadow-sm flex items-center gap-1"
            >
              <Flame className="w-3.5 h-3.5 fill-white" />
              <span>Deals & Offers</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[115px] bg-slate-950/70 z-40 backdrop-blur-sm animate-in fade-in">
          <div className="w-72 h-full bg-white shadow-2xl p-5 overflow-y-auto">
            <div className="font-extrabold text-xs text-slate-400 mb-3 uppercase tracking-wider">
              Browse Categories
            </div>
            <div className="space-y-1">
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug || 'all'}
                  to={cat.isAll ? '/products' : `/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-sm font-semibold transition ${
                    cat.isAll
                      ? 'text-indigo-700 bg-indigo-50 font-bold'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-200 mt-5 pt-4 space-y-2.5">
              <Link
                to="/admin"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 font-bold text-xs shadow-sm hover:scale-[1.01] transition"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>👑 Store Owner / Admin Portal</span>
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1"
              >
                About Arora Communication
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1"
              >
                Store Location & Noida Showroom
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
