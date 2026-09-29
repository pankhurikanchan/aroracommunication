import React from 'react';
import { Link } from 'react-router-dom';
import {
  Smartphone,
  Tablet,
  Laptop,
  Watch,
  Headphones,
  Zap,
  BatteryCharging,
  Shield,
  Speaker,
  Tv,
  Cpu,
  ArrowRight,
  Flame,
  Sparkles,
} from 'lucide-react';
import { Category } from '../../types';

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const getCategoryDetails = (slug: string) => {
    switch (slug) {
      case 'smartphones':
      case 'iphones':
      case 'android-phones':
        return {
          icon: <Smartphone className="w-6 h-6 text-indigo-600" />,
          bg: 'bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white',
          glow: 'group-hover:border-indigo-400',
        };
      case 'tablets':
        return {
          icon: <Tablet className="w-6 h-6 text-cyan-600" />,
          bg: 'bg-cyan-50 group-hover:bg-cyan-600 group-hover:text-white',
          glow: 'group-hover:border-cyan-400',
        };
      case 'laptops':
        return {
          icon: <Laptop className="w-6 h-6 text-blue-600" />,
          bg: 'bg-blue-50 group-hover:bg-blue-600 group-hover:text-white',
          glow: 'group-hover:border-blue-400',
        };
      case 'smartwatches':
        return {
          icon: <Watch className="w-6 h-6 text-purple-600" />,
          bg: 'bg-purple-50 group-hover:bg-purple-600 group-hover:text-white',
          glow: 'group-hover:border-purple-400',
        };
      case 'earphones':
      case 'headphones':
        return {
          icon: <Headphones className="w-6 h-6 text-rose-600" />,
          bg: 'bg-rose-50 group-hover:bg-rose-600 group-hover:text-white',
          glow: 'group-hover:border-rose-400',
        };
      case 'chargers':
      case 'cables':
        return {
          icon: <Zap className="w-6 h-6 text-amber-600" />,
          bg: 'bg-amber-50 group-hover:bg-amber-600 group-hover:text-white',
          glow: 'group-hover:border-amber-400',
        };
      case 'power-banks':
        return {
          icon: <BatteryCharging className="w-6 h-6 text-emerald-600" />,
          bg: 'bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white',
          glow: 'group-hover:border-emerald-400',
        };
      case 'mobile-covers':
      case 'screen-protectors':
        return {
          icon: <Shield className="w-6 h-6 text-teal-600" />,
          bg: 'bg-teal-50 group-hover:bg-teal-600 group-hover:text-white',
          glow: 'group-hover:border-teal-400',
        };
      case 'speakers':
        return {
          icon: <Speaker className="w-6 h-6 text-violet-600" />,
          bg: 'bg-violet-50 group-hover:bg-violet-600 group-hover:text-white',
          glow: 'group-hover:border-violet-400',
        };
      case 'electronics':
        return {
          icon: <Tv className="w-6 h-6 text-indigo-500" />,
          bg: 'bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white',
          glow: 'group-hover:border-indigo-400',
        };
      default:
        return {
          icon: <Cpu className="w-6 h-6 text-slate-600" />,
          bg: 'bg-slate-100 group-hover:bg-slate-800 group-hover:text-white',
          glow: 'group-hover:border-slate-400',
        };
    }
  };

  const quickPills = [
    { label: 'Smartphones', slug: 'smartphones', emoji: '📱' },
    { label: 'Apple iPhones', slug: 'iphones', emoji: '🍏' },
    { label: 'Audio & TWS', slug: 'earphones', emoji: '🎧' },
    { label: 'Smartwatches', slug: 'smartwatches', emoji: '⌚' },
    { label: 'Fast Chargers', slug: 'chargers', emoji: '🔌' },
    { label: 'Laptops', slug: 'laptops', emoji: '💻' },
    { label: 'Power Banks', slug: 'power-banks', emoji: '🔋' },
    { label: 'Phone Covers', slug: 'mobile-covers', emoji: '🛡️' },
    { label: 'Mega Deals', slug: '../deals', emoji: '🔥' },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {/* 1. Quick Story-like Circular Pills (Horizontal Scrolling) */}
      <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pb-4 mb-4">
        {quickPills.map((pill, idx) => (
          <Link
            key={idx}
            to={pill.slug.startsWith('../') ? pill.slug.replace('../', '/') : `/category/${pill.slug}`}
            className="group shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-white border border-slate-200 hover:border-indigo-500 hover:shadow-md transition-all duration-200 text-xs font-bold text-slate-700 hover:text-indigo-600"
          >
            <span className="text-base group-hover:scale-125 transition-transform duration-200">
              {pill.emoji}
            </span>
            <span>{pill.label}</span>
          </Link>
        ))}
      </div>

      {/* 2. Category Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-indigo-600 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Explore by Tech Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Discover verified flagship smartphones, smart electronics, and original accessories
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline group shrink-0"
        >
          <span>All Categories</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 3. Category Grid with Modern Card Visuals */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.slice(0, 12).map((cat) => {
          const details = getCategoryDetails(cat.slug);
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={`group relative bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center hover:-translate-y-1.5 ${details.glow} overflow-hidden`}
            >
              {/* Subtle card top gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500 transition-all duration-300" />

              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 mb-3 group-hover:scale-110 shadow-sm ${details.bg}`}
              >
                {details.icon}
              </div>

              <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1 flex items-center justify-center gap-1">
                <span>{cat.name}</span>
                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-600" />
              </h3>

              <span className="text-[11px] text-slate-400 font-medium mt-1">
                {cat._count?.products ? `${cat._count.products} products` : 'Browse Store'}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};
