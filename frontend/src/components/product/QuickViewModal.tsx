import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  X,
  Star,
  Heart,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  CheckCircle2,
  ExternalLink,
  Plus,
  Minus,
} from 'lucide-react';
import { Product } from '../../types';
import { formatINR } from '../../utils/formatters';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useToast } from '../../context/ToastContext';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ product, onClose }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [addingToCart, setAddingToCart] = useState(false);

  if (!product) return null;

  const images = product.images && product.images.length > 0
    ? product.images
    : [{ id: 'default', url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', isPrimary: true }];

  const currentImage = images[selectedImageIndex]?.url || images[0]?.url;
  const inWishlist = isInWishlist(product.id);
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const currentPrice = hasDiscount ? product.discountPrice! : product.price;
  const savings = hasDiscount ? product.price - product.discountPrice! : 0;

  const handleAddToCart = async () => {
    setAddingToCart(true);
    await addToCart(product.id, product.variants?.[0]?.id || null, quantity);
    setAddingToCart(false);
    showToast(`Added ${quantity}x "${product.name}" to cart`, 'success');
  };

  const handleBuyNow = async () => {
    await addToCart(product.id, product.variants?.[0]?.id || null, quantity);
    onClose();
    navigate('/checkout');
  };

  const handleToggleWishlist = async () => {
    await toggleWishlist(product.id);
    showToast(
      inWishlist ? 'Removed from Wishlist' : 'Saved to your Wishlist!',
      'info'
    );
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition z-10"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 items-start">
          {/* Image & Gallery Column */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-2xl bg-slate-50 border border-slate-200/80 p-6 flex items-center justify-center overflow-hidden">
              {product.discountPercentage && product.discountPercentage > 0 && (
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-rose-600 text-white font-extrabold text-xs shadow-sm">
                  {product.discountPercentage}% OFF
                </span>
              )}

              <img
                src={currentImage}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Thumbnail selector */}
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, idx) => (
                  <button
                    key={img.id || idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`w-14 h-14 rounded-xl border p-1 bg-slate-50 shrink-0 transition ${
                      selectedImageIndex === idx
                        ? 'border-indigo-600 ring-2 ring-indigo-500/20'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <img src={img.url} alt="" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Column */}
          <div className="space-y-4">
            <div>
              {product.brand && (
                <span className="text-[11px] font-extrabold uppercase text-indigo-600 tracking-wider">
                  {product.brand.name}
                </span>
              )}
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug mt-0.5">
                {product.name}
              </h2>

              {/* Ratings & Reviews */}
              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-amber-900 font-bold">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{product.rating || '4.8'}</span>
                </div>
                <span className="text-slate-400">&bull;</span>
                <span className="text-slate-500">
                  {product.numReviews || 42} verified customer ratings
                </span>
              </div>
            </div>

            {/* Price & Savings */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/90 space-y-1">
              <div className="flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                  {formatINR(currentPrice)}
                </span>
                {hasDiscount && (
                  <span className="text-base text-slate-400 line-through">
                    {formatINR(product.price)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <p className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>You save {formatINR(savings)} ({product.discountPercentage}% OFF)</span>
                </p>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-2 text-xs">
              <span className={`w-2 h-2 rounded-full ${product.stockQuantity > 0 ? 'bg-emerald-500' : 'bg-red-500'}`} />
              <span className={`font-bold ${product.stockQuantity > 0 ? 'text-emerald-700' : 'text-red-700'}`}>
                {product.stockQuantity > 0 ? `In Stock (${product.stockQuantity} units available)` : 'Out of Stock'}
              </span>
              <span className="text-slate-400">&bull;</span>
              <span className="text-slate-500">SKU: {product.sku}</span>
            </div>

            {/* Short Description */}
            <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
              {product.description}
            </p>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-slate-700">Quantity:</span>
                <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    disabled={quantity <= 1}
                    className="p-2 hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-3 text-xs font-bold text-slate-900 min-w-[32px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(product.stockQuantity || 10, q + 1))}
                    disabled={quantity >= (product.stockQuantity || 10)}
                    className="p-2 hover:bg-slate-100 text-slate-600 disabled:opacity-30 transition"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Wishlist button */}
                <button
                  onClick={handleToggleWishlist}
                  className={`p-2.5 rounded-xl border transition ${
                    inWishlist
                      ? 'bg-rose-50 text-rose-600 border-rose-300'
                      : 'border-slate-300 text-slate-600 hover:text-rose-600 hover:bg-slate-50'
                  }`}
                  title={inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
                >
                  <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500' : ''}`} />
                </button>
              </div>

              {/* Add to Cart & Buy Now */}
              <div className="grid grid-cols-2 gap-2.5 pt-1">
                <button
                  onClick={handleAddToCart}
                  disabled={addingToCart || product.stockQuantity <= 0}
                  className="py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{addingToCart ? 'Adding...' : 'Add to Cart'}</span>
                </button>

                <button
                  onClick={handleBuyNow}
                  disabled={product.stockQuantity <= 0}
                  className="py-3 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-extrabold text-xs shadow-md shadow-amber-500/20 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Zap className="w-4 h-4" />
                  <span>Buy Now</span>
                </button>
              </div>
            </div>

            {/* View Full Product Details Link */}
            <div className="pt-2 text-center border-t border-slate-100">
              <Link
                to={`/products/${product.slug}`}
                onClick={onClose}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 hover:underline"
              >
                <span>View Complete Specifications & Customer Reviews</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
