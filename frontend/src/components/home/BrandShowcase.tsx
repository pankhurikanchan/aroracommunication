import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const TOP_BRANDS = [
  { name: 'Apple', slug: 'apple', badge: 'Official Warranty', icon: '', color: 'from-slate-700 to-slate-900', border: 'hover:border-slate-400' },
  { name: 'Samsung', slug: 'samsung', badge: 'Galaxy Authorized', icon: '✦', color: 'from-blue-600 to-indigo-900', border: 'hover:border-blue-400' },
  { name: 'OnePlus', slug: 'oneplus', badge: 'Never Settle', icon: '1+', color: 'from-red-600 to-rose-900', border: 'hover:border-red-400' },
  { name: 'Google Pixel', slug: 'google', badge: 'Pixel Studio', icon: 'G', color: 'from-emerald-600 to-teal-900', border: 'hover:border-emerald-400' },
  { name: 'Sony', slug: 'sony', badge: 'Pro Audio & ANC', icon: 'SONY', color: 'from-neutral-800 to-black', border: 'hover:border-neutral-400' },
  { name: 'boAt', slug: 'boat', badge: 'True Wireless', icon: '⚓', color: 'from-rose-600 to-red-800', border: 'hover:border-rose-400' },
  { name: 'Spigen', slug: 'spigen', badge: 'Armor Cases', icon: '🛡️', color: 'from-amber-600 to-orange-800', border: 'hover:border-amber-400' },
  { name: 'Anker', slug: 'anker', badge: 'GaN Fast Power', icon: '⚡', color: 'from-cyan-600 to-blue-800', border: 'hover:border-cyan-400' },
  { name: 'Xiaomi', slug: 'xiaomi', badge: 'Smart Flagships', icon: 'mi', color: 'from-orange-500 to-amber-700', border: 'hover:border-orange-400' },
  { name: 'Realme', slug: 'realme', badge: 'Performance Tech', icon: 'R', color: 'from-yellow-500 to-amber-600', border: 'hover:border-yellow-400' },
  { name: 'JBL', slug: 'jbl', badge: 'Pure Bass Audio', icon: 'JBL', color: 'from-orange-600 to-red-600', border: 'hover:border-orange-400' },
  { name: 'Nothing', slug: 'nothing', badge: 'Glyph Design', icon: '( )', color: 'from-zinc-800 to-zinc-950', border: 'hover:border-zinc-400' },
];

export const BrandShowcase: React.FC = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      {/* Brand Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-600">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Official Authorized Retailer Brands</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-100 text-emerald-800">
                100% Genuine Warranty
              </span>
            </h2>
            <p className="text-xs text-slate-500">
              Direct brand-sourced retail inventory with official GST invoice & service support
            </p>
          </div>
        </div>

        <Link
          to="/products"
          className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>All 20+ Brands</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* Brand Grid / Horizontal Scroll */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {TOP_BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            to={`/products?brand=${encodeURIComponent(brand.name)}`}
            className={`group relative bg-white rounded-2xl p-3.5 border border-slate-200/90 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden hover:-translate-y-1 ${brand.border}`}
          >
            {/* Ambient Background Gradient on Hover */}
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full bg-gradient-to-br ${brand.color} opacity-0 group-hover:opacity-10 transition-opacity blur-xl pointer-events-none`} />

            <div className="flex items-center justify-between mb-3">
              {/* Brand Logo/Icon Avatar */}
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-black text-sm flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <span>{brand.icon}</span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-400 group-hover:text-indigo-600 transition-colors">
                View &rarr;
              </span>
            </div>

            <div>
              <h3 className="font-extrabold text-sm text-slate-800 group-hover:text-indigo-600 transition-colors">
                {brand.name}
              </h3>
              <p className="text-[10px] text-slate-400 font-medium truncate mt-0.5">
                {brand.badge}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
