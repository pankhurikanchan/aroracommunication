import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingCart, Zap, Check, Eye } from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useQuickView } from '../../context/QuickViewContext';
import { useToast } from '../../context/ToastContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { openQuickView } = useQuickView();
  const { showToast } = useToast();
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
  const savings = hasDiscount ? product.price - product.discountPrice! : 0;

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setAddingToCart(true);
    await addToCart(product.id, product.variants?.[0]?.id || null, 1);
    setAddingToCart(false);
    setJustAdded(true);
    showToast(`Added "${product.name}" to cart successfully`, 'success');
    setTimeout(() => setJustAdded(false), 2000);
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    openQuickView(product);
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist(product.id);
    showToast(
      inWishlist ? 'Removed from Wishlist' : 'Saved to Wishlist!',
      'info'
    );
  };

  return (
    <div className="group relative bg-[#130F2B]/85 backdrop-blur-md rounded-2xl sm:rounded-3xl border border-violet-900/35 hover:border-violet-500/60 shadow-lg hover:shadow-[0_15px_40px_rgba(139,92,246,0.25)] transition-all duration-500 flex flex-col justify-between overflow-hidden card-3d-wrapper perspective-1000">
      {/* 3D Specular Light Glare Overlay */}
      <div className="shine-overlay rounded-2xl sm:rounded-3xl z-20 pointer-events-none" />

      {/* Ambient Glow Aura on Hover */}
      <div className="absolute -inset-0.5 rounded-3xl bg-gradient-to-r from-violet-500/20 via-cyan-500/20 to-fuchsia-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-md pointer-events-none -z-10" />

      {/* Top Floating Badges & Wishlist Button with 3D Elevation */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-10 pointer-events-none" style={{ transform: 'translateZ(20px)' }}>
        <div className="flex flex-col gap-1 items-start">
          {product.isBestSeller && (
            <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-black text-[9px] sm:text-[10px] shadow-sm uppercase tracking-wider animate-pulse-subtle">
              BESTSELLER
            </span>
          )}
          {product.discountPercentage && product.discountPercentage > 0 && (
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-rose-600 to-red-600 text-white font-extrabold text-[10px] sm:text-[11px] shadow-md">
              {product.discountPercentage}% OFF
            </span>
          )}
          {product.isNewArrival && !product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-md bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-extrabold text-[9px] sm:text-[10px] shadow-sm uppercase tracking-wider">
              NEW
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`pointer-events-auto w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-sm ${
            inWishlist
              ? 'bg-rose-950/70 text-rose-400 border border-rose-600/50 scale-105'
              : 'bg-[#181238]/80 text-slate-400 hover:text-rose-400 hover:bg-[#231A4D] border border-violet-800/40 hover:scale-110'
          }`}
          title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>
      </div>

      {/* Product Image Area with 3D Elevation & Quick View */}
      <div className="relative pt-[84%] overflow-hidden bg-[#161135]/60 border-b border-violet-900/25">
        <Link to={`/products/${product.slug}`} className="block absolute inset-0">
          <img
            src={primaryImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-contain p-4 group-hover:scale-110 group-hover:-translate-y-1 transition-transform duration-500 ease-out"
          />
        </Link>

        {product.stockQuantity <= 0 && (
          <div className="absolute inset-0 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center pointer-events-none">
            <span className="bg-red-600 text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow">
              Out of Stock
            </span>
          </div>
        )}

        {/* Hover Quick View Button */}
        <div className="absolute bottom-2.5 inset-x-3 hidden sm:flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-2 group-hover:translate-y-0">
          <button
            onClick={handleQuickView}
            className="w-full py-2 px-3 rounded-xl bg-[#1A143D]/90 hover:bg-[#241C52] text-slate-100 font-extrabold text-xs shadow-md border border-violet-700/40 flex items-center justify-center gap-1.5 backdrop-blur-sm hover:text-violet-300 transition"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand */}
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-violet-400 mb-1">
            {product.brand?.name || 'GENUINE ACCESSORY'}
          </div>

          {/* Title */}
          <Link
            to={`/products/${product.slug}`}
            className="text-xs sm:text-sm font-extrabold text-slate-100 hover:text-violet-300 line-clamp-2 transition leading-snug mb-1.5"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Star Rating & Reviews */}
          <div className="flex items-center gap-1.5 mb-2.5">
            <div className="flex items-center text-amber-400 text-xs font-bold">
              {'★'.repeat(5)}
            </div>
            <span className="text-xs font-bold text-slate-200">
              {product.rating > 0 ? product.rating.toFixed(1) : '4.8'}
            </span>
            <span className="text-[11px] text-slate-400">
              ({product.numReviews || 38})
            </span>
          </div>
        </div>

        {/* Price & Action Buttons */}
        <div>
          <div className="mb-3 pt-2 border-t border-violet-950/60">
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-base sm:text-lg font-black text-white tracking-tight">
                {formatINR(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-500 line-through font-normal">
                  {formatINR(product.price)}
                </span>
              )}
            </div>
            {hasDiscount && savings > 0 && (
              <span className="text-[10px] font-bold text-emerald-400 block mt-0.5">
                Save {formatINR(savings)}
              </span>
            )}
          </div>

          {/* Action Button: Add to Cart */}
          <button
            onClick={handleAddToCart}
            disabled={addingToCart || product.stockQuantity <= 0}
            className={`w-full py-2.5 px-3 rounded-xl font-extrabold text-xs flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm ${
              justAdded
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white shadow-lg shadow-violet-600/30 active:scale-95'
            } disabled:opacity-50`}
          >
            {justAdded ? (
              <>
                <Check className="w-4 h-4" />
                <span>Added to Cart!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
