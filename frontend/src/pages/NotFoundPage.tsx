import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, ShoppingBag, ArrowLeft, PhoneCall, HelpCircle } from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export const NotFoundPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useSEO({
    title: '404 - Page Not Found',
    description: 'The requested page or product was not found on Arora Mobile Hub. Search our catalog or return to our homepage.',
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 relative overflow-hidden">
      {/* Background ambient radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-violet-600/15 via-fuchsia-600/10 to-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-xl w-full text-center relative z-10 space-y-6">
        {/* Glow 404 Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-950/70 border border-violet-700/50 text-violet-300 text-xs font-bold tracking-wider uppercase shadow-inner">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          <span>Error 404 • Missing Link</span>
        </div>

        {/* 3D Giant 404 Heading */}
        <div className="relative">
          <h1 className="text-7xl sm:text-9xl font-black tracking-tighter bg-gradient-to-r from-violet-400 via-fuchsia-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl select-none">
            404
          </h1>
          <p className="text-xl sm:text-2xl font-extrabold text-white mt-2">
            Oops! Gadget or Page Not Found
          </p>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
          The page or product you are looking for might have been moved, renamed, or is temporarily out of stock in our Bareilly showroom.
        </p>

        {/* In-page Search Box */}
        <form onSubmit={handleSearch} className="max-w-md mx-auto relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search phones, laptops, smartwatches, chargers..."
            className="w-full pl-11 pr-24 py-3 rounded-2xl border border-violet-800/50 bg-[#120D2C] focus:bg-[#1A133D] text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-lg"
          />
          <Search className="w-4 h-4 text-violet-400 absolute left-4 top-1/2 -translate-y-1/2" />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-md transition"
          >
            Search
          </button>
        </form>

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-violet-700/30 transition hover:scale-105"
          >
            <Home className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-violet-950/70 hover:bg-violet-900/80 text-violet-200 border border-violet-800/50 font-bold text-xs transition hover:scale-105"
          >
            <ShoppingBag className="w-4 h-4 text-cyan-400" />
            <span>Browse Products</span>
          </Link>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900/60 hover:bg-slate-800/80 text-slate-300 border border-slate-800 font-bold text-xs transition"
          >
            <PhoneCall className="w-4 h-4 text-emerald-400" />
            <span>Contact Helpdesk</span>
          </Link>
        </div>

        {/* Store Helpline Info */}
        <div className="pt-6 border-t border-violet-900/30 text-xs text-slate-400">
          <span>Need immediate assistance? Call our Bareilly store at </span>
          <a href="tel:+917300791957" className="text-cyan-300 font-bold hover:underline">
            +91 73007 91957
          </a>{' '}
          or{' '}
          <a href="tel:+919027122120" className="text-emerald-300 font-bold hover:underline">
            +91 90271 22120
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
