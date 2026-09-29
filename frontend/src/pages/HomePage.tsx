import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Product, Category, Banner } from '../types';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { ProductCard } from '../components/product/ProductCard';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import {
  Sparkles,
  ArrowRight,
  Flame,
  Smartphone,
  Headphones,
  Zap,
  Tag,
  PhoneCall,
  MessageCircle,
  MapPin,
  Clock,
  ShieldCheck,
  RotateCcw,
  Truck,
  CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const BRAND_SPOTLIGHTS = [
  { name: 'Apple', slug: 'apple', badge: 'iPhones & M-Series' },
  { name: 'Samsung', slug: 'samsung', badge: 'Galaxy AI' },
  { name: 'OnePlus', slug: 'oneplus', badge: 'Fast OxygenOS' },
  { name: 'Google Pixel', slug: 'google-pixel', badge: 'Pro Camera' },
  { name: 'Sony', slug: 'sony', badge: 'Industry ANC' },
  { name: 'Nothing', slug: 'nothing', badge: 'Glyph Design' },
  { name: 'boAt', slug: 'boat', badge: 'Signature Bass' },
  { name: 'Anker', slug: 'anker', badge: 'GaNPrime Tech' },
];

export const HomePage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPhones, setFeaturedPhones] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [dealsOffers, setDealsOffers] = useState<Product[]>([]);
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [activeTab, setActiveTab] = useState<'bestsellers' | 'smartphones' | 'audio' | 'chargers' | 'deals'>('bestsellers');
  const [loading, setLoading] = useState(true);

  // Simple countdown timer for flash deals
  const [timeLeft, setTimeLeft] = useState({ hours: 7, minutes: 24, seconds: 48 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        setLoading(true);
        const [
          bannersRes,
          catsRes,
          featuredRes,
          bestSellerRes,
          newArrivalsRes,
          dealsRes,
          accessoriesRes,
        ] = await Promise.all([
          api.get('/banners').catch(() => ({ data: { data: [] } })),
          api.get('/categories').catch(() => ({ data: { data: [] } })),
          api.get('/products?featured=true&limit=8').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?bestSeller=true&limit=8').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?newArrival=true&limit=8').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?deals=true&limit=8').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?category=chargers&limit=8').catch(() => ({ data: { data: { products: [] } } })),
        ]);

        setBanners(bannersRes.data.data || []);
        setCategories(catsRes.data.data || []);
        setFeaturedPhones(featuredRes.data.data?.products || []);
        setBestSellers(bestSellerRes.data.data?.products || []);
        setNewArrivals(newArrivalsRes.data.data?.products || []);
        setDealsOffers(dealsRes.data.data?.products || []);
        setAccessories(accessoriesRes.data.data?.products || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Filtered tab products
  const getTabProducts = () => {
    switch (activeTab) {
      case 'bestsellers':
        return {
          title: 'Best Selling Gadgets',
          desc: 'Our customer favorites with highest ratings and thousands of satisfied buyers',
          products: bestSellers.length > 0 ? bestSellers : featuredPhones,
          viewAll: '/products?sort=popular',
        };
      case 'smartphones':
        return {
          title: 'Flagship & 5G Smartphones',
          desc: 'Latest Apple iPhones, Samsung Galaxy AI, OnePlus, and Google Pixel devices',
          products: featuredPhones,
          viewAll: '/category/smartphones',
        };
      case 'audio':
        return {
          title: 'High-Fidelity Audio & TWS',
          desc: 'Active Noise Cancelling earbuds, wireless headphones, and portable speakers',
          products: dealsOffers.filter((p) => p.category?.slug === 'earphones' || p.category?.slug === 'headphones').length > 0
            ? dealsOffers.filter((p) => p.category?.slug === 'earphones' || p.category?.slug === 'headphones')
            : dealsOffers.slice(0, 4),
          viewAll: '/category/earphones',
        };
      case 'chargers':
        return {
          title: 'Fast Chargers & Accessories',
          desc: 'GaN chargers, braided high-wattage cables, and magnetic power banks',
          products: accessories.length > 0 ? accessories : dealsOffers,
          viewAll: '/category/chargers',
        };
      case 'deals':
        return {
          title: 'Special Offers & Big Discounts',
          desc: 'Handpicked electronics on limited-time discounts with genuine brand warranty',
          products: dealsOffers,
          viewAll: '/deals',
        };
      default:
        return {
          title: 'Best Selling Gadgets',
          desc: 'Top trending mobile phones and electronics',
          products: bestSellers,
          viewAll: '/products',
        };
    }
  };

  const currentTabInfo = getTabProducts();

  return (
    <div className="space-y-10 pb-16">
      {/* 1. Hero Banner Carousel */}
      <HeroBanner banners={banners} />

      {/* 2. Top Brands Strip */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              Official Brand Showcase
            </span>
            <span className="text-[11px] font-semibold text-slate-500">100% Genuine Retailer</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
            {BRAND_SPOTLIGHTS.map((brand) => (
              <Link
                key={brand.slug}
                to={`/search?q=${encodeURIComponent(brand.name)}`}
                className="group p-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50/80 border border-slate-200/70 hover:border-indigo-300 transition-all text-center flex flex-col items-center justify-center hover:shadow-sm"
              >
                <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors">
                  {brand.name}
                </span>
                <span className="text-[10px] text-slate-400 group-hover:text-indigo-500 font-medium">
                  {brand.badge}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Shop by Category Grid */}
      <CategoryGrid categories={categories} />

      {/* 4. Interactive Tabbed Product Showcase */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-b from-slate-50 to-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
          {/* Header & Tabs */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 font-extrabold text-[11px] uppercase tracking-wider mb-2">
                <Flame className="w-3.5 h-3.5 text-indigo-600" />
                Featured Collections
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {currentTabInfo.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {currentTabInfo.desc}
              </p>
            </div>

            <Link
              to={currentTabInfo.viewAll}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
            >
              <span>Explore All in Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Interactive Navigation Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar">
            <button
              onClick={() => setActiveTab('bestsellers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm ${
                activeTab === 'bestsellers'
                  ? 'bg-indigo-600 text-white shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>🔥 Best Sellers</span>
            </button>

            <button
              onClick={() => setActiveTab('smartphones')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm ${
                activeTab === 'smartphones'
                  ? 'bg-indigo-600 text-white shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>📱 Smartphones</span>
            </button>

            <button
              onClick={() => setActiveTab('audio')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm ${
                activeTab === 'audio'
                  ? 'bg-indigo-600 text-white shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Headphones className="w-3.5 h-3.5" />
              <span>🎧 Audio & TWS</span>
            </button>

            <button
              onClick={() => setActiveTab('chargers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm ${
                activeTab === 'chargers'
                  ? 'bg-indigo-600 text-white shadow-indigo-500/25 scale-[1.02]'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>⚡ Fast Chargers</span>
            </button>

            <button
              onClick={() => setActiveTab('deals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all shadow-sm ${
                activeTab === 'deals'
                  ? 'bg-rose-600 text-white shadow-rose-500/25 scale-[1.02]'
                  : 'bg-white text-rose-700 hover:bg-rose-50 border border-rose-200'
              }`}
            >
              <Tag className="w-3.5 h-3.5" />
              <span>🏷️ Hot Deals</span>
            </button>
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {currentTabInfo.products.slice(0, 8).map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Flash Deals Strip with Live Countdown */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-10 relative overflow-hidden border border-indigo-800/60 shadow-xl">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-cyan-500/10 to-transparent pointer-events-none" />
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
            <div className="space-y-2 text-center lg:text-left max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-400/30 text-xs font-extrabold uppercase tracking-wider">
                <Flame className="w-4 h-4 text-rose-400 animate-pulse" />
                Limited Time Flash Carnival
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                Up to 35% Off on Flagships + Extra ₹5,000 Exchange Bonus
              </h3>
              <p className="text-xs sm:text-sm text-slate-300">
                Upgrade your old smartphone with genuine brand warranty and same-day express doorstep delivery across Delhi-NCR.
              </p>
            </div>

            {/* Countdown Box & Action */}
            <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
              <div className="flex items-center gap-2 text-center">
                <div className="bg-slate-800/90 border border-slate-700 px-3 py-2 rounded-xl min-w-[54px]">
                  <span className="text-lg font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Hours</span>
                </div>
                <span className="text-slate-500 font-bold">:</span>
                <div className="bg-slate-800/90 border border-slate-700 px-3 py-2 rounded-xl min-w-[54px]">
                  <span className="text-lg font-black text-cyan-400">{String(timeLeft.minutes).padStart(2, '0')}</span>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Mins</span>
                </div>
                <span className="text-slate-500 font-bold">:</span>
                <div className="bg-slate-800/90 border border-slate-700 px-3 py-2 rounded-xl min-w-[54px]">
                  <span className="text-lg font-black text-rose-400">{String(timeLeft.seconds).padStart(2, '0')}</span>
                  <span className="block text-[9px] uppercase font-bold text-slate-400">Secs</span>
                </div>
              </div>

              <Link
                to="/deals"
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 to-indigo-500 hover:from-cyan-300 hover:to-indigo-400 text-slate-950 font-extrabold text-xs sm:text-sm shadow-lg transition flex items-center gap-2 hover:scale-105"
              >
                <span>Claim Deal Now</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Physical Store & Direct WhatsApp Consultation Showcase */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-md">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Store details */}
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Trusted Physical Electronics Retailer
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Visit Arora Communication in Store or Order Online
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Enjoy personalized service from our store experts. Whether you want to test the camera before buying, need instant tempered glass application, or want a live exchange valuation on your old phone, our store team is here to assist you 7 days a week.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <MapPin className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Prime Store Location</span>
                    <span className="text-slate-500">Sector 18, Commercial Market, Noida</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <Clock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-slate-900 block">Open 7 Days a Week</span>
                    <span className="text-slate-500">10:00 AM – 9:30 PM Every Day</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="https://wa.me/919876543210?text=Hello%20Arora%20Communication%2C%20I%20have%20an%20inquiry%20about%20a%20product%20on%20your%20website."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition flex items-center gap-2 hover:scale-105"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>

                <a
                  href="tel:+919876543210"
                  className="px-5 py-3 rounded-xl border border-slate-300 hover:border-indigo-400 text-slate-700 hover:text-indigo-600 font-bold text-xs transition flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-indigo-600" />
                  <span>Call Store: +91 98765 43210</span>
                </a>
              </div>
            </div>

            {/* Visual Store Benefits Card */}
            <div className="bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-5 border border-slate-800">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                The Arora Communication Guarantee
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-cyan-300 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">100% Genuine Sealed Units</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      All products come directly in official brand-sealed packaging with valid manufacturer warranty.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-emerald-300 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">Express Same-Day Dispatch</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Orders placed before 2:00 PM are dispatched on the same day with live courier tracking.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-amber-300 flex items-center justify-center shrink-0">
                    <RotateCcw className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">7-Day Replacement Support</h4>
                    <p className="text-slate-400 text-[11px] mt-0.5">
                      Instant replacement assistance in case of any transit defect or operational issues.
                    </p>
                  </div>
                </div>
              </div>

              {/* Coupon reminder */}
              <div className="p-3 rounded-xl bg-indigo-600/30 border border-indigo-400/40 text-center">
                <span className="text-[11px] text-cyan-200">
                  Use coupon code <strong className="text-white underline">ARORA10</strong> at checkout for 10% instant discount!
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Verified Customer Reviews */}
      <CustomerReviewsSection />

      {/* 8. Why Choose Us Trust Factors */}
      <WhyChooseUs />
    </div>
  );
};
