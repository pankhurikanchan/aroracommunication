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
} from 'lucide-react';
import { Category } from '../../types';

interface CategoryGridProps {
  categories: Category[];
}

export const CategoryGrid: React.FC<CategoryGridProps> = ({ categories }) => {
  const getCategoryIcon = (slug: string) => {
    switch (slug) {
      case 'smartphones':
      case 'iphones':
      case 'android-phones':
        return <Smartphone className="w-6 h-6 text-indigo-600" />;
      case 'tablets':
        return <Tablet className="w-6 h-6 text-cyan-600" />;
      case 'laptops':
        return <Laptop className="w-6 h-6 text-blue-600" />;
      case 'smartwatches':
        return <Watch className="w-6 h-6 text-purple-600" />;
      case 'earphones':
      case 'headphones':
        return <Headphones className="w-6 h-6 text-rose-600" />;
      case 'chargers':
      case 'cables':
        return <Zap className="w-6 h-6 text-amber-600" />;
      case 'power-banks':
        return <BatteryCharging className="w-6 h-6 text-emerald-600" />;
      case 'mobile-covers':
      case 'screen-protectors':
        return <Shield className="w-6 h-6 text-teal-600" />;
      case 'speakers':
        return <Speaker className="w-6 h-6 text-violet-600" />;
      case 'electronics':
        return <Tv className="w-6 h-6 text-indigo-500" />;
      default:
        return <Cpu className="w-6 h-6 text-slate-600" />;
    }
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Shop by Category
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Explore authentic mobile technology, wearables, and electronics
          </p>
        </div>
        <Link
          to="/products"
          className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 hover:underline flex items-center gap-1"
        >
          View All Categories &rarr;
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {categories.slice(0, 12).map((cat) => (
          <Link
            key={cat.id}
            to={`/category/${cat.slug}`}
            className="group bg-white rounded-2xl p-4 border border-slate-200 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 flex flex-col items-center text-center"
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-50/80 group-hover:bg-indigo-100/80 flex items-center justify-center transition-colors mb-3 group-hover:scale-110 duration-200">
              {getCategoryIcon(cat.slug)}
            </div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 group-hover:text-indigo-600 transition-colors line-clamp-1">
              {cat.name}
            </h3>
            <span className="text-[11px] text-slate-400 mt-0.5">
              {cat._count?.products ? `${cat._count.products} products` : 'Explore'}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};
