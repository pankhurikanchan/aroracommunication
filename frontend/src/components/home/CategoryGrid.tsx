import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Category } from '../../types';
import { getAnimatedCategoryIcon } from './CategoryIcons';

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
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
            className="group shrink-0 flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#130E29]/80 border border-violet-800/40 hover:border-violet-400 hover:shadow-lg hover:shadow-violet-600/20 transition-all duration-200 text-xs font-bold text-slate-200 hover:text-white"
          >
            <span className="text-base group-hover:scale-125 group-hover:rotate-6 transition-transform duration-200">
              {pill.emoji}
            </span>
            <span>{pill.label}</span>
          </Link>
        ))}
      </div>

      {/* 2. Category Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-widest text-violet-400 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>Curated Collections</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Explore by Tech Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-0.5">
            Discover verified flagship smartphones, smart electronics, and original accessories
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs sm:text-sm font-bold text-violet-400 hover:text-violet-200 flex items-center gap-1 hover:underline group shrink-0"
        >
          <span>All Categories</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 3. Category Grid with 3D Perspective & Animated Icons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4 perspective-1000">
        {categories.slice(0, 12).map((cat) => {
          const details = getAnimatedCategoryIcon(cat.slug);
          return (
            <Link
              key={cat.id}
              to={`/category/${cat.slug}`}
              className={`group relative bg-[#130F2B]/85 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-violet-900/35 hover:border-violet-500/60 hover:shadow-[0_15px_40px_rgba(139,92,246,0.3)] transition-all duration-500 flex flex-col items-center text-center card-3d-wrapper preserve-3d ${details.glowColor} overflow-hidden`}
            >
              {/* 3D Light Sheen Overlay */}
              <div className="shine-overlay rounded-2xl" />

              {/* Card top accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-violet-500/0 to-transparent group-hover:via-violet-400 transition-all duration-500" />

              {/* Animated Category Icon Container */}
              <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 mb-3 group-hover:scale-110 group-hover:-translate-y-1 shadow-sm group-hover:shadow-lg ${details.bg}`}
                style={{ transform: 'translateZ(15px)' }}
              >
                {details.icon}
              </div>

              <h3 className="text-xs sm:text-sm font-extrabold text-slate-100 group-hover:text-violet-300 transition-colors line-clamp-1 flex items-center justify-center gap-1">
                <span>{cat.name}</span>
                <ArrowRight className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-violet-400" />
              </h3>

              <span className="text-[11px] text-violet-300/60 font-medium mt-1">
                {cat._count?.products ? `${cat._count.products} products` : 'Browse Store'}
              </span>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

