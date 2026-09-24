import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Zap, Check } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  const [addingToCart, setAddingToCart] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const primaryImage =
    product.images?.find((img) => img.isPrimary)?.url ||
    product.images?.[0]?.url ||
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80';

  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCart(true);
    await addToCart(product.id, product.variants?.[0]?.id || null, 1);
    setAddingToCart(false);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1800);
  };

  const handleBuyNow = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await addToCart(product.id, product.variants?.[0]?.id || null, 1);
    navigate('/checkout');
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product.id);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 hover:border-indigo-300 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden">
      {/* Top Badges & Wishlist Button */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex flex-col gap-1 items-start">
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-rose-600 text-white font-extrabold text-[11px] shadow-sm">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-bold text-[10px] shadow-sm">
              BESTSELLER
            </span>
          )}
          {product.isNewArrival && (
            <span className="px-2 py-0.5 rounded-md bg-indigo-600 text-white font-bold text-[10px] shadow-sm">
              NEW
            </span>
          )}
        </div>

        <button
          onClick={handleWishlistToggle}
          className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition shadow-sm ${
            inWishlist
              ? 'bg-rose-50 text-rose-600 border border-rose-200'
              : 'bg-white/90 text-slate-400 hover:text-rose-500 hover:bg-white border border-slate-200'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Clickable Link */}
      <Link to={`/products/${product.slug}`} className="block relative pt-[85%] overflow-hidden bg-slate-50">
        <img
          src={primaryImage}
          alt={product.name}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
        />
        {product.stockQuantity <= 0 && (
          <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded">Out of Stock</span>
          </div>
        )}
      </Link>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 mb-1">
            {product.brand?.name || 'Electronics'}
          </div>

          {/* Product Name */}
          <Link
            to={`/products/${product.slug}`}
            className="text-sm font-bold text-slate-800 hover:text-indigo-600 line-clamp-2 transition leading-snug mb-1.5"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Star Rating & Review Count */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center bg-emerald-700 text-white text-[11px] font-bold px-1.5 py-0.5 rounded">
              <span>{product.rating > 0 ? product.rating.toFixed(1) : '4.5'}</span>
              <Star className="w-3 h-3 fill-current ml-0.5" />
            </div>
            <span className="text-[11px] text-slate-600">
              ({product.numReviews || 12} reviews)
            </span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div>
          {/* Price Container */}
          <div className="mb-3.5 pt-2 border-t border-slate-100 flex items-baseline gap-2 flex-wrap">
            <span className="text-lg font-extrabold text-slate-900">
              {formatINR(currentPrice)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-slate-600 line-through">
                {formatINR(product.price)}
              </span>
            )}
            {product.discountPercentage && product.discountPercentage > 0 && (
              <span className="text-xs font-bold text-rose-600">
                {product.discountPercentage}% OFF
              </span>
            )}
          </div>

          {/* Action Buttons: Add to Cart & Buy Now */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleAddToCart}
              disabled={addingToCart || product.stockQuantity <= 0}
              className={`py-2 px-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition border ${
                justAdded
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-300 hover:border-slate-400'
              }`}
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingCart className="w-3.5 h-3.5 text-slate-600" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleBuyNow}
              disabled={product.stockQuantity <= 0}
              className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition"
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Buy Now</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
