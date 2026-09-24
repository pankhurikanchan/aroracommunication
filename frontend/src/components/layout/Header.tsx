import React, { useState } from 'react';
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
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { formatINR } from '../../utils/formatters';

const NAV_CATEGORIES = [
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
  { name: 'Screen Protectors', slug: 'screen-protectors' },
  { name: 'Speakers', slug: 'speakers' },
  { name: 'Accessories', slug: 'accessories' },
  { name: 'Electronics', slug: 'electronics' },
];

export const Header: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const { itemCount, finalTotal } = useCart();
  const { wishlistIds } = useWishlist();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
      {/* Top Utility Announcement Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 font-medium text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              Special Offer: Use code <strong className="text-white underline">ARORA10</strong> for 10% OFF!
            </span>
            <span className="hidden md:inline-flex items-center gap-1.5 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-emerald-400" />
              Free Express Delivery on Orders &gt; ₹1,000
            </span>
            <span className="hidden lg:inline-flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              100% Genuine Brand Warranty
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-300">
            <a href="tel:+919876543210" className="flex items-center gap-1 hover:text-white transition">
              <PhoneCall className="w-3 h-3 text-cyan-400" />
              <span>+91 98765 43210</span>
            </a>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline text-slate-400">Open 7 Days: 10:00 AM - 9:30 PM</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-3.5 flex items-center justify-between gap-4">
        {/* Mobile menu trigger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-slate-700 hover:text-indigo-600 focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>

        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 p-0.5 shadow-md group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center p-1.5">
              <svg viewBox="0 0 100 100" fill="none" className="w-full h-full">
                <path d="M22 68 C 30 52, 45 42, 60 42 C 72 42, 80 50, 84 58" stroke="#38bdf8" strokeWidth="8" strokeLinecap="round" opacity="0.5" />
                <path d="M18 52 C 30 32, 50 24, 70 26 C 80 27, 86 34, 88 40" stroke="#818cf8" strokeWidth="8" strokeLinecap="round" />
                <path d="M36 68 L50 32 L64 68" stroke="#ffffff" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M42 56 L58 56" stroke="#06b6d4" strokeWidth="7" strokeLinecap="round" />
                <circle cx="76" cy="30" r="5" fill="#38bdf8" />
              </svg>
            </div>
          </div>
          <div>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-900 via-indigo-900 to-indigo-700 bg-clip-text text-transparent">
              ARORA <span className="font-light text-indigo-600">COMMUNICATION</span>
            </div>
            <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-600 -mt-0.5">
              Mobiles &bull; Electronics &bull; Accessories
            </div>
          </div>
        </Link>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-4">
          <div className="relative w-full flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search smartphones, iPhones, chargers, earphones, brands..."
              className="w-full pl-4 pr-11 py-2.5 rounded-full border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 bottom-1.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full flex items-center justify-center transition"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Right Action Icons: Account, Wishlist, Cart */}
        <div className="flex items-center gap-3 sm:gap-4 shrink-0">
          {/* Wishlist */}
          <Link
            to="/account?tab=wishlist"
            className="relative p-2 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition"
            title="Wishlist"
          >
            <Heart className="w-5 h-5 sm:w-6 sm:h-6" />
            {wishlistIds.size > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white text-[11px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                {wishlistIds.size}
              </span>
            )}
          </Link>

          {/* Cart */}
          <Link
            to="/cart"
            className="flex items-center gap-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-900 px-3 py-2 rounded-full transition group"
          >
            <div className="relative">
              <ShoppingCart className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
              {itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-[10px] uppercase font-bold text-slate-500 leading-tight">My Cart</span>
              <span className="text-xs font-bold text-indigo-700 leading-tight">
                {formatINR(finalTotal)}
              </span>
            </div>
          </Link>

          {/* User Account / Dropdown */}
          <div className="relative">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 text-slate-700 hover:text-indigo-600 py-1 px-2 rounded-lg hover:bg-slate-100 transition"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden xl:flex flex-col text-left">
                    <span className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[100px]">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-slate-600 font-medium leading-tight">
                      {user.role === 'ADMIN' ? 'Admin Panel' : 'My Account'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                    onMouseLeave={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    </div>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-indigo-700 hover:bg-indigo-50"
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Admin Dashboard
                      </Link>
                    )}

                    <Link
                      to="/account?tab=orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <Package className="w-4 h-4 text-slate-400" />
                      My Orders
                    </Link>

                    <Link
                      to="/account?tab=addresses"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <MapPin className="w-4 h-4 text-slate-400" />
                      Saved Addresses
                    </Link>

                    <Link
                      to="/account?tab=profile"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      Account Settings
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 text-left font-medium"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-block px-3 py-1.5 text-xs font-semibold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-sm transition"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden px-4 pb-2.5">
        <form onSubmit={handleSearch} className="relative w-full">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phones, accessories, electronics..."
            className="w-full pl-3.5 pr-10 py-2 rounded-lg border border-slate-300 bg-slate-50 focus:bg-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="absolute right-2 top-2 text-slate-400 hover:text-indigo-600"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* Horizontal Scrollable Categories Navigation Bar */}
      <nav className="bg-slate-900 text-slate-200 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center overflow-x-auto no-scrollbar py-2.5 space-x-1 sm:space-x-2 text-xs font-medium whitespace-nowrap">
            <Link
              to="/products"
              className="px-2.5 py-1 rounded text-cyan-400 font-bold hover:bg-slate-800 transition flex items-center gap-1"
            >
              <span>🔥</span>
              <span>All Products</span>
            </Link>

            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                to={`/category/${cat.slug}`}
                className="px-2.5 py-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition"
              >
                {cat.name}
              </Link>
            ))}

            <Link
              to="/deals"
              className="px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold hover:opacity-90 transition ml-2 shadow-sm"
            >
              Hot Deals & Offers
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[112px] bg-slate-900/60 z-40 backdrop-blur-sm">
          <div className="w-72 h-full bg-white shadow-2xl p-4 overflow-y-auto">
            <div className="font-bold text-sm text-slate-900 mb-3 uppercase tracking-wider">
              Browse Categories
            </div>
            <div className="space-y-1">
              <Link
                to="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm font-semibold text-indigo-700 bg-indigo-50"
              >
                All Products
              </Link>
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg text-sm text-slate-700 hover:bg-slate-100"
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-200 mt-4 pt-4 space-y-2">
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs text-slate-600 hover:text-indigo-600"
              >
                About Arora Communication
              </Link>
              <Link
                to="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block text-xs text-slate-600 hover:text-indigo-600"
              >
                Store Location & Contact
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
