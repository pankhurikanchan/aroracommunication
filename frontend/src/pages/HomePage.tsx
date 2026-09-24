import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { Product, Category, Banner } from '../types';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryGrid } from '../components/home/CategoryGrid';
import { ProductShelf } from '../components/home/ProductShelf';
import { WhyChooseUs } from '../components/home/WhyChooseUs';
import { CustomerReviewsSection } from '../components/home/CustomerReviewsSection';
import { Sparkles, ArrowRight } from 'lucide-react';
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
          api.get('/products?featured=true&limit=4').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?bestSeller=true&limit=4').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?newArrival=true&limit=4').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?deals=true&limit=4').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?category=accessories&limit=4').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?premium=true&limit=4').catch(() => ({ data: { data: { products: [] } } })),
          api.get('/products?sort=newest&limit=4').catch(() => ({ data: { data: { products: [] } } })),
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
    <div className="space-y-4 pb-12">
      {/* 1. Hero Banner */}
      <HeroBanner banners={banners} />

      {/* 2. Shop by Category */}
      <CategoryGrid categories={categories} />

      {/* Special Offer Strip */}
      <div className="max-w-7xl mx-auto px-4 my-2">
        <div className="bg-gradient-to-r from-indigo-900 via-blue-900 to-indigo-950 text-white rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md border border-indigo-700/50">
          <div className="space-y-1 text-center md:text-left">
            <span className="text-cyan-400 font-extrabold text-xs uppercase tracking-widest flex items-center justify-center md:justify-start gap-1.5">
              <Sparkles className="w-4 h-4" /> Limited Period Exchange Carnival
            </span>
            <h3 className="text-xl sm:text-2xl font-bold">
              Upgrade to the Latest Flagship with Extra ₹5,000 Exchange Bonus
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Bring your old smartphone to Arora Communication or exchange online during checkout.
            </p>
          </div>
          <Link
            to="/category/smartphones"
            className="shrink-0 px-6 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-2"
          >
            <span>Check Exchange Rates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 3. Featured Smartphones */}
      <ProductShelf
        title="Featured Smartphones"
        subtitle="Handpicked top devices with cutting-edge cameras and performance"
        badge="FLAGSHIP PICKS"
        products={featuredPhones}
        viewAllLink="/category/smartphones"
      />

      {/* 4. Best Sellers */}
      <ProductShelf
        title="Best Sellers"
        subtitle="Customer favorites backed by thousands of 5-star ratings"
        badge="TOP TRENDING"
        products={bestSellers}
        viewAllLink="/products?sort=popular"
      />

      {/* 5. New Arrivals */}
      <ProductShelf
        title="New Arrivals"
        subtitle="Fresh launches just unpacked at Arora Communication store"
        badge="JUST LAUNCHED"
        products={newArrivals}
        viewAllLink="/products?newArrival=true"
      />

      {/* 6. Deals & Offers */}
      <ProductShelf
        title="Deals & Special Offers"
        subtitle="Deep discounts on phones, audio gadgets, and daily accessories"
        badge="SAVE BIG"
        products={dealsOffers}
        viewAllLink="/deals"
      />

      {/* 7. Mobile Accessories */}
      <ProductShelf
        title="Mobile Accessories"
        subtitle="Certified fast GaN chargers, braided cables, MagSafe cases, and power banks"
        badge="ESSENTIAL GEAR"
        products={accessories}
        viewAllLink="/category/accessories"
      />

      {/* 8. Premium Smartphones */}
      <ProductShelf
        title="Premium Flagship Smartphones"
        subtitle="Titanium frames, periscope telephoto zoom, and generative AI processors"
        badge="PREMIUM COLLECTION"
        products={premiumPhones}
        viewAllLink="/products?premium=true"
      />

      {/* 9. Recently Added Products */}
      <ProductShelf
        title="Recently Added to Store"
        subtitle="Explore our growing catalog of consumer electronics"
        badge="EXPLORE NEW"
        products={recentProducts}
        viewAllLink="/products?sort=newest"
      />

      {/* 10. Customer Reviews */}
      <CustomerReviewsSection />

      {/* 11. Why Choose Arora Communication? */}
      <WhyChooseUs />
    </div>
  );
};
