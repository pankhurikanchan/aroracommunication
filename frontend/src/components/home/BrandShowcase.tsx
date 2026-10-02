import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import {
  AppleLogo,
  GoogleLogo,
  SamsungLogo,
  OnePlusLogo,
  SonyLogo,
  BoatLogo,
  SpigenLogo,
  AnkerLogo,
  XiaomiLogo,
  RealmeLogo,
  JblLogo,
  NothingLogo,
} from './BrandLogos';

interface BrandItem {
  name: string;
  slug: string;
  badge: string;
  logo: React.ReactNode;
  bgGlow: string;
  accentBorder: string;
  tagColor: string;
  containerBg: string;
}

const TOP_BRANDS: BrandItem[] = [
  {
    name: 'Apple',
    slug: 'apple',
    badge: 'Authorized Retailer',
    logo: <AppleLogo className="w-6 h-6 text-slate-100 group-hover:text-white" />,
    bgGlow: 'from-slate-500 to-indigo-500',
    accentBorder: 'hover:border-slate-400/80',
    tagColor: 'bg-slate-100 text-slate-800',
    containerBg: 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950',
  },
  {
    name: 'Samsung',
    slug: 'samsung',
    badge: 'Galaxy Certified',
    logo: <SamsungLogo className="w-12 h-4 text-blue-400 group-hover:text-white" />,
    bgGlow: 'from-blue-600 to-indigo-700',
    accentBorder: 'hover:border-blue-500/80',
    tagColor: 'bg-blue-50 text-blue-700',
    containerBg: 'bg-gradient-to-br from-blue-950 via-slate-900 to-indigo-950',
  },
  {
    name: 'OnePlus',
    slug: 'oneplus',
    badge: 'Never Settle',
    logo: <OnePlusLogo className="w-7 h-7" />,
    bgGlow: 'from-red-600 to-rose-700',
    accentBorder: 'hover:border-red-500/80',
    tagColor: 'bg-red-50 text-red-700',
    containerBg: 'bg-gradient-to-br from-rose-950 via-slate-900 to-red-950',
  },
  {
    name: 'Google Pixel',
    slug: 'google',
    badge: 'Gemini AI Phones',
    logo: <GoogleLogo className="w-6 h-6" />,
    bgGlow: 'from-blue-500 via-green-500 to-red-500',
    accentBorder: 'hover:border-emerald-400/80',
    tagColor: 'bg-emerald-50 text-emerald-700',
    containerBg: 'bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900',
  },
  {
    name: 'Sony',
    slug: 'sony',
    badge: 'Pro Audio & ANC',
    logo: <SonyLogo className="w-12 h-4 text-slate-100 group-hover:text-cyan-300" />,
    bgGlow: 'from-cyan-600 to-blue-700',
    accentBorder: 'hover:border-cyan-400/80',
    tagColor: 'bg-slate-100 text-slate-800',
    containerBg: 'bg-gradient-to-br from-black via-zinc-900 to-slate-950',
  },
  {
    name: 'boAt',
    slug: 'boat',
    badge: 'Nirvana Series',
    logo: <BoatLogo className="w-7 h-7" />,
    bgGlow: 'from-rose-600 to-red-700',
    accentBorder: 'hover:border-rose-400/80',
    tagColor: 'bg-rose-50 text-rose-700',
    containerBg: 'bg-gradient-to-br from-rose-950 via-slate-900 to-zinc-950',
  },
  {
    name: 'Spigen',
    slug: 'spigen',
    badge: 'Military Armor',
    logo: <SpigenLogo className="w-7 h-7" />,
    bgGlow: 'from-amber-500 to-orange-600',
    accentBorder: 'hover:border-amber-400/80',
    tagColor: 'bg-amber-50 text-amber-700',
    containerBg: 'bg-gradient-to-br from-zinc-950 via-slate-900 to-amber-950',
  },
  {
    name: 'Anker',
    slug: 'anker',
    badge: 'GaN Fast Power',
    logo: <AnkerLogo className="w-7 h-7" />,
    bgGlow: 'from-cyan-500 to-blue-600',
    accentBorder: 'hover:border-cyan-400/80',
    tagColor: 'bg-cyan-50 text-cyan-700',
    containerBg: 'bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-900',
  },
  {
    name: 'Xiaomi',
    slug: 'xiaomi',
    badge: 'HyperOS Flagships',
    logo: <XiaomiLogo className="w-7 h-7" />,
    bgGlow: 'from-orange-500 to-amber-600',
    accentBorder: 'hover:border-orange-400/80',
    tagColor: 'bg-orange-50 text-orange-700',
    containerBg: 'bg-gradient-to-br from-orange-950 via-slate-900 to-amber-950',
  },
  {
    name: 'Realme',
    slug: 'realme',
    badge: 'Speed Edition',
    logo: <RealmeLogo className="w-7 h-7" />,
    bgGlow: 'from-yellow-400 to-amber-500',
    accentBorder: 'hover:border-yellow-400/80',
    tagColor: 'bg-yellow-50 text-yellow-800',
    containerBg: 'bg-gradient-to-br from-zinc-950 via-slate-900 to-amber-950',
  },
  {
    name: 'JBL',
    slug: 'jbl',
    badge: 'Pure Bass Audio',
    logo: <JblLogo className="w-10 h-6" />,
    bgGlow: 'from-orange-600 to-red-600',
    accentBorder: 'hover:border-orange-500/80',
    tagColor: 'bg-orange-50 text-orange-700',
    containerBg: 'bg-gradient-to-br from-zinc-950 via-neutral-900 to-red-950',
  },
  {
    name: 'Nothing',
    slug: 'nothing',
    badge: 'Glyph Design',
    logo: <NothingLogo className="w-12 h-4 text-zinc-100 group-hover:text-white" />,
    bgGlow: 'from-zinc-500 to-slate-400',
    accentBorder: 'hover:border-zinc-400/80',
    tagColor: 'bg-zinc-100 text-zinc-800',
    containerBg: 'bg-gradient-to-br from-black via-zinc-900 to-neutral-950',
  },
];

export const BrandShowcase: React.FC = () => {
  return (
    <section className="relative max-w-7xl mx-auto px-4 py-8 z-10">
      {/* Brand Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-cyan-500 text-white shadow-lg shadow-violet-500/20 animate-neon-pulse">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Official Brand Partners</span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-950/60 text-emerald-400 border border-emerald-500/40 shadow-xs">
                <Sparkles className="w-3 h-3 text-emerald-400" /> 100% Genuine Warranty
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Authorized brand-sourced inventory with official GST invoice and pan-India warranty
            </p>
          </div>
        </div>

        <Link
          to="/products"
          className="text-xs font-bold text-violet-300 hover:text-white flex items-center gap-1.5 group self-start sm:self-auto bg-[#130E29]/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-violet-800/40 shadow-xs hover:border-violet-500 hover:shadow-md transition-all"
        >
          <span>Explore All Brands</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform text-violet-400" />
        </Link>
      </div>

      {/* 3D Animated Brand Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 perspective-1000">
        {TOP_BRANDS.map((brand) => (
          <Link
            key={brand.slug}
            to={`/products?brand=${encodeURIComponent(brand.name)}`}
            className={`group relative bg-[#130F2B]/85 backdrop-blur-md rounded-2xl p-4 border border-violet-900/35 shadow-lg hover:shadow-[0_15px_40px_rgba(139,92,246,0.3)] transition-all duration-500 flex flex-col justify-between overflow-hidden preserve-3d hover:-translate-y-2 hover:scale-[1.03] ${brand.accentBorder}`}
          >
            {/* 3D Ambient Neon Glow Behind Logo */}
            <div
              className={`absolute -top-10 -right-10 w-28 h-28 rounded-full bg-gradient-to-br ${brand.bgGlow} opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-2xl pointer-events-none`}
            />

            {/* Holographic Shimmer Sweep on Hover */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full duration-1000 bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform pointer-events-none z-20" />

            {/* Top row: Animated Brand Logo Badge */}
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-2xl ${brand.containerBg} flex items-center justify-center shadow-md p-2 group-hover:shadow-xl group-hover:scale-110 group-hover:rotate-[-4deg] transition-all duration-300 relative overflow-hidden border border-white/10`}
              >
                {/* Subtle radial sheen on the badge */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 transition-transform duration-300 group-hover:scale-105">
                  {brand.logo}
                </div>
              </div>

              <div className="flex flex-col items-end">
                <span className="text-[10px] font-black text-violet-400 group-hover:text-violet-200 group-hover:translate-x-0.5 transition-all">
                  &rarr;
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1 opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
              </div>
            </div>

            {/* Bottom info */}
            <div className="space-y-1">
              <h3 className="font-extrabold text-sm text-slate-100 group-hover:text-violet-300 transition-colors tracking-tight flex items-center justify-between">
                <span>{brand.name}</span>
              </h3>
              <div className="flex items-center">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${brand.tagColor} truncate max-w-full block shadow-2xs`}>
                  {brand.badge}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
