import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import { Banner } from '../../types';

interface HeroBannerProps {
  banners: Banner[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const fallbackBanners = [
    {
      id: 'default-1',
      title: 'Latest Smartphones at Great Prices',
      subtitle: 'Explore. Compare. Buy. Genuine Warranty & Same-Day Dispatch from Arora Communication.',
      badge: 'FLAT 10% OFF WITH CODE: ARORA10',
      buttonText: 'Shop Smartphones',
      buttonLink: '/category/smartphones',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
      bgGradient: 'from-blue-900 via-indigo-950 to-slate-900',
    },
    {
      id: 'default-2',
      title: 'Flagship Audio & Smart Wearables',
      subtitle: 'Experience high-fidelity sound with Sony, Apple AirPods, and boAt active noise cancellation.',
      badge: 'AUDIO FESTIVAL - UP TO 60% OFF',
      buttonText: 'Explore Audio Gear',
      buttonLink: '/category/earphones',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      bgGradient: 'from-purple-900 via-indigo-900 to-slate-900',
    },
    {
      id: 'default-3',
      title: 'GaN Chargers & Armor Phone Cases',
      subtitle: 'Keep your devices energized and military-grade protected with Spigen and Anker essentials.',
      badge: 'PREMIUM ACCESSORIES',
      buttonText: 'Browse Accessories',
      buttonLink: '/category/accessories',
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80',
      bgGradient: 'from-cyan-950 via-slate-900 to-indigo-950',
    },
  ];

  const activeBanners = banners.length > 0 ? banners : fallbackBanners;

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeBanners.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [activeBanners.length]);

  const current = activeBanners[currentIndex] || activeBanners[0];

  return (
    <div className="relative overflow-hidden bg-slate-900 rounded-3xl mx-4 my-6 shadow-2xl border border-slate-800">
      <div className={`relative min-h-[420px] md:min-h-[480px] flex items-center bg-gradient-to-r ${current.bgGradient || 'from-blue-950 via-indigo-950 to-slate-900'} transition-all duration-700`}>
        {/* Background Overlay image with fade */}
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-3/5 opacity-40 md:opacity-75 overflow-hidden">
          <img
            src={current.imageUrl}
            alt={current.title}
            className="w-full h-full object-cover object-center transform scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        </div>

        {/* Banner Text Content */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 py-12 z-10 w-full">
          <div className="max-w-xl space-y-4">
            {current.badge && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
                <span>{current.badge}</span>
              </div>
            )}

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight">
              {current.title}
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
              {current.subtitle}
            </p>

            {/* Features checkmarks */}
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-slate-300 font-medium">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Official Warranty
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" /> Express Dispatch
              </span>
            </div>

            {/* Call to action buttons */}
            <div className="pt-3 flex flex-wrap gap-3">
              <Link
                to={current.buttonLink || '/products'}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/30 transition transform hover:-translate-y-0.5"
              >
                <span>{current.buttonText || 'Shop Now'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <Link
                to="/deals"
                className="inline-flex items-center gap-2 px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-md border border-white/20 transition"
              >
                View Today's Offers
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Prev/Next Buttons */}
        <button
          onClick={() => setCurrentIndex((prev) => (prev - 1 + activeBanners.length) % activeBanners.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-white/10 flex items-center justify-center backdrop-blur-md transition z-20"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white border border-white/10 flex items-center justify-center backdrop-blur-md transition z-20"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-cyan-400' : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
