import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Product, Category, Banner } from '../types';
import { HeroBanner } from '../components/home/HeroBanner';
import { TrustBadges } from '../components/home/TrustBadges';
import { BrandShowcase } from '../components/home/BrandShowcase';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { FlashDealBanner } from '../components/home/FlashDealBanner';
import { ProductShelf } from '../components/home/ProductShelf';
import { StoreExperience } from '../components/home/StoreExperience';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

export const HomePage: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredPhones, setFeaturedPhones] = useState<Product[]>([]);
  const [bestSellers, setBestSellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [dealsOffers, setDealsOffers] = useState<Product[]>([]);
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [premiumPhones, setPremiumPhones] = useState<Product[]>([]);
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

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
          premiumRes,
          recentRes,
        ] = await Promise.all([
          api.get('/banners').catch(() => ({ data: { data: [] } })),
          api.get('/categories').catch(() => ({ data: { data: [] } })),
          api.get('/products?featured=true&limit=8').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?bestSeller=true&limit=8').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?newArrival=true&limit=8').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?deals=true&limit=8').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?category=accessories&limit=8').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?premium=true&limit=8').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?sort=newest&limit=8').catch(() => ({ data: { data: { products: [] } } })),
        ]);

        setBanners(bannersRes.data.data || []);
        setCategories(catsRes.data.data || []);
        setFeaturedPhones(featuredRes.data.data?.products || []);
        setBestSellers(bestSellerRes.data.data?.products || []);
        setNewArrivals(newArrivalsRes.data.data?.products || []);
        setDealsOffers(dealsRes.data.data?.products || []);
        setAccessories(accessoriesRes.data.data?.products || []);
        setPremiumPhones(premiumRes.data.data?.products || []);
        setRecentProducts(recentRes.data.data?.products || []);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <div className="space-y-2 sm:space-y-4 pb-12">
      {/* 1. Cinema-grade Hero Banner */}
      <HeroBanner banners={banners} />

      {/* 2. Trust & Service Guarantees */}
      <TrustBadges />

      {/* 3. Shop by Category with Quick Story Pills */}
      <CategoryGrid categories={categories} />

      {/* 4. Official Tech Brands Showcase */}
      <BrandShowcase />

      {/* 5. Today's Best Sellers */}
      <ProductShelf
        title="Today's Best Selling Gadgets"
        subtitle="Customer favorites backed by thousands of verified reviews"
        badge="TOP TRENDING"
        products={bestSellers}
        viewAllLink="/products?sort=popular"
      />

      {/* 6. Live Daily Flash Sale & Countdown Timer */}
      <FlashDealBanner />

      {/* 7. Featured Smartphones */}
      <ProductShelf
        title="Featured Smartphones"
        subtitle="Handpicked top devices with pro cameras and high-performance chipsets"
        badge="FLAGSHIP PICKS"
        products={featuredPhones}
        viewAllLink="/category/smartphones"
      />

      {/* 6. High-Impact Exchange Carnival Promo Strip */}
      <div className="max-w-7xl mx-auto px-4 my-6">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-950 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl border border-indigo-700/50">
          <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-1.5 text-center md:text-left">
            <span className="text-cyan-400 font-black text-xs uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-4 h-4 text-cyan-300" /> Limited Period Exchange Carnival
            </span>
            <h3 className="text-xl sm:text-2xl lg:text-3xl font-black text-white">
              Upgrade to the Latest Flagship with Extra ₹5,000 Exchange Bonus
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              Bring any working phone to Arora Mobile Hub Bareilly (C-15 Ekta Nagar) or select online exchange during checkout. Instant doorstep pickup and valuation.
            </p>
          </div>

          <Link
            to="/category/smartphones"
            className="relative z-10 shrink-0 px-6 py-3.5 rounded-2xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-cyan-400/20 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <span>Check Exchange Rates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 8. Trending Deals */}
      <ProductShelf
        title="Super Deals & Limited Offers"
        subtitle="Exclusive price drops on top-rated electronics and accessories"
        badge="SUPER SAVER"
        products={dealsOffers}
        viewAllLink="/products?deals=true"
      />

      {/* 8. New Arrivals */}
      <ProductShelf
        title="New Launches & Fresh Stock"
        subtitle="Latest gadgets just unpacked at Arora Mobile Hub store"
        badge="JUST LAUNCHED"
        products={newArrivals}
        viewAllLink="/products?newArrival=true"
      />

      {/* 9. Mobile Accessories */}
      <ProductShelf
        title="Certified Mobile Accessories"
        subtitle="GaN chargers, braided cables, MagSafe cases, and power banks"
        badge="ESSENTIAL GEAR"
        products={accessories}
        viewAllLink="/category/accessories"
      />

      {/* 10. Visit Bareilly Showroom Section */}
      <StoreExperience />

      {/* 11. Premium Flagship Smartphones */}
      <ProductShelf
        title="Premium Flagship Smartphones"
        subtitle="Titanium frames, periscope telephoto zoom, and generative AI processors"
        badge="PREMIUM COLLECTION"
        products={premiumPhones}
        viewAllLink="/products?premium=true"
      />

      {/* 12. Verified Customer Reviews */}
      <CustomerReviewsSection />

      {/* 13. Why Choose Arora Mobile Hub? */}
      <WhyChooseUs />
    </div>
  );
};
