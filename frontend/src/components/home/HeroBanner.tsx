import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Flame,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Banner } from '../../types';

interface HeroBannerProps {
  banners: Banner[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const showcaseSlides = [
    {
      id: 'slide-audio',
      tag: 'PREMIUM SOUND EXPERIENCE',
      title: 'Flagship Audio & Smart Wearables',
      highlight: 'Sony ANC, Apple AirPods, boAt Nirvana & Samsung Buds',
      subtitle: 'Immerse yourself in premium sound and smart technology.',
      badge: 'UP TO 55% OFF AUDIO',
      buttonText: 'Shop Audio',
      buttonLink: '/category/earphones',
      secondaryLink: '/deals',
      secondaryText: "View Today's Offers",
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80',
      gradient: 'from-slate-950 via-indigo-950 to-blue-950',
      accentColor: 'text-cyan-300',
    },
    {
      id: 'slide-smartphones',
      tag: 'AUTHORIZED FLAGSHIP RETAILER',
      title: 'Upgrade Your Smartphone',
      highlight: 'iPhone 16 Pro, Galaxy S25 & OnePlus 13 5G',
      subtitle: 'Latest smartphones. Genuine products. Best deals.',
      badge: 'FLAT ₹5,000 EXCHANGE BONUS',
      buttonText: 'Shop Smartphones',
      buttonLink: '/category/smartphones',
      secondaryLink: '/deals',
      secondaryText: 'Compare Deals',
      imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=1200&q=80',
      gradient: 'from-slate-950 via-slate-900 to-indigo-950',
      accentColor: 'text-amber-300',
    },
    {
      id: 'slide-accessories',
      tag: 'ORIGINAL POWER & PROTECTION',
      title: 'Power Up Your Devices',
      highlight: 'Anker GaNPrime, Spigen Armor & Magnetic Power Banks',
      subtitle: 'Fast chargers, power banks and essential accessories.',
      badge: 'CERTIFIED ACCESSORIES',
      buttonText: 'Shop Accessories',
      buttonLink: '/category/accessories',
      secondaryLink: '/category/chargers',
      secondaryText: 'Fast Chargers',
      imageUrl: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1200&q=80',
      gradient: 'from-slate-950 via-indigo-950/90 to-purple-950',
      accentColor: 'text-emerald-300',
    },
    {
      id: 'slide-laptops',
      tag: 'WORK & CREATIVE PERFORMANCE',
      title: 'High-Performance Laptops & Tablets',
      highlight: 'Apple MacBook Pro M3, iPad Air & Galaxy Tab S9',
      subtitle: 'Unmatched performance for work, study, and creative productivity.',
      badge: 'NO COST EMI AVAILABLE',
      buttonText: 'Shop Laptops',
      buttonLink: '/category/laptops',
      secondaryLink: '/category/tablets',
      secondaryText: 'Explore Tablets',
      imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1200&q=80',
      gradient: 'from-slate-950 via-blue-950 to-slate-900',
      accentColor: 'text-cyan-300',
    },
  ];

  const activeSlides = banners.length > 0
    ? banners.map((b, i) => ({
        ...showcaseSlides[i % showcaseSlides.length],
        title: b.title || showcaseSlides[i % showcaseSlides.length].title,
        subtitle: b.subtitle || showcaseSlides[i % showcaseSlides.length].subtitle,
        badge: b.badge || showcaseSlides[i % showcaseSlides.length].badge,
        buttonText: b.buttonText || showcaseSlides[i % showcaseSlides.length].buttonText,
        buttonLink: b.buttonLink || showcaseSlides[i % showcaseSlides.length].buttonLink,
        imageUrl: b.imageUrl || showcaseSlides[i % showcaseSlides.length].imageUrl,
      }))
    : showcaseSlides;

  // Autoplay with pause on hover
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [activeSlides.length, isPaused]);

  const current = activeSlides[currentIndex] || activeSlides[0];

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + activeSlides.length) % activeSlides.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % activeSlides.length);
  };

  return (
    <div
      className="relative max-w-7xl mx-auto px-4 my-4 sm:my-6"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Outer Carousel Container */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 shadow-2xl border border-slate-800/80">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0">
          <img
            src={current.imageUrl}
            alt={current.title}
            className="w-full h-full object-cover object-center transform scale-105 transition-all duration-700 ease-out opacity-45 sm:opacity-60"
          />
          {/* Gradients */}
          <div className={`absolute inset-0 bg-gradient-to-r ${current.gradient} opacity-90 mix-blend-multiply`} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 px-6 sm:px-12 py-10 sm:py-16 md:py-20 max-w-2xl">
          {/* Badge & Tag */}
          <div className="flex flex-wrap items-center gap-2 mb-3.5">
            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-white/10 text-cyan-300 border border-cyan-400/30 backdrop-blur-md flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>{current.tag}</span>
            </span>

            {current.badge && (
              <span className="px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-gradient-to-r from-rose-600 to-amber-600 text-white shadow-md flex items-center gap-1">
                <Flame className="w-3 h-3 fill-white" />
                <span>{current.badge}</span>
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] mb-2 drop-shadow-md">
            {current.title}
          </h1>

          {/* Highlight Subtitle */}
          <p className={`text-sm sm:text-base font-bold ${current.accentColor} mb-2`}>
            {current.highlight}
          </p>

          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6 font-normal max-w-xl">
            {current.subtitle}
          </p>

          {/* Trust points */}
          <div className="flex flex-wrap gap-4 mb-6 text-xs text-slate-300 font-medium">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Genuine Warranty
            </span>
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-400" /> Express Same-Day Dispatch
            </span>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={current.buttonLink}
              className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs sm:text-sm shadow-xl shadow-indigo-600/30 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>{current.buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            {current.secondaryLink && (
              <Link
                to={current.secondaryLink}
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm backdrop-blur-md transition-all hover:scale-105 active:scale-95"
              >
                {current.secondaryText}
              </Link>
            )}
          </div>
        </div>

        {/* Carousel Navigation Arrows */}
        <div className="absolute right-4 sm:right-6 bottom-6 z-20 flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 flex items-center justify-center transition shadow-lg hover:scale-110 active:scale-95"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={handleNext}
            className="w-10 h-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 flex items-center justify-center transition shadow-lg hover:scale-110 active:scale-95"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="absolute bottom-6 left-6 sm:left-12 z-20 flex items-center gap-2">
          {activeSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === idx
                  ? 'w-8 bg-cyan-400'
                  : 'w-2 bg-white/40 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
