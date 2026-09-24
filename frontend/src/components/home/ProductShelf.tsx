import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { ProductCard } from '../product/ProductCard';

interface ProductShelfProps {
  title: string;
  subtitle?: string;
  badge?: string;
  products: Product[];
  viewAllLink?: string;
}

export const ProductShelf: React.FC<ProductShelfProps> = ({
  title,
  subtitle,
  badge,
  products,
  viewAllLink = '/products',
}) => {
  if (!products || products.length === 0) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 pb-2 border-b border-slate-200">
        <div>
          {badge && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800 mb-1">
              {badge}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">{subtitle}</p>
          )}
        </div>

        {viewAllLink && (
          <Link
            to={viewAllLink}
            className="mt-2 sm:mt-0 text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-800 hover:underline flex items-center gap-1 shrink-0"
          >
            <span>View All</span>
            <span>&rarr;</span>
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
};
