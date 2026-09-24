import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Product, ProductVariant } from '../types';
import { formatINR } from '../utils/formatters';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/product/ProductCard';
import {
  Star,
  Heart,
  ShoppingCart,
  Zap,
  ShieldCheck,
  Truck,
  RotateCcw,
  Box,
  CreditCard,
  Check,
  MapPin,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export const ProductDetailPage: React.FC = () => {
  const { identifier } = useParams<{ identifier: string }>();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [product, setProduct] = useState<Product | null>(null);
  const [similarProducts, setSimilarProducts] = useState<Product[]>([]);
  const [customersAlsoViewed, setCustomersAlsoViewed] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [addedNotice, setAddedNotice] = useState(false);

  // Review submission state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewMessage, setReviewMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/products/${identifier}`);
        if (res.data.success) {
          const p = res.data.data.product;
          setProduct(p);
          setSimilarProducts(res.data.data.similarProducts || []);
          setCustomersAlsoViewed(res.data.data.customersAlsoViewed || []);

          const primary =
            p.images?.find((img: any) => img.isPrimary)?.url ||
            p.images?.[0]?.url ||
            '';
          setSelectedImage(primary);

          if (p.variants && p.variants.length > 0) {
            setSelectedVariant(p.variants[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [identifier]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="w-24 h-24 bg-indigo-50 rounded-full mx-auto mb-4" />
        <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto mb-2" />
        <div className="h-4 bg-slate-100 rounded w-1/4 mx-auto" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Product Not Found</h2>
        <p className="text-xs text-slate-500 mb-6">The product you are looking for may have been moved or discontinued.</p>
        <Link to="/products" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs">
          Browse All Products
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const currentPrice = selectedVariant
    ? (selectedVariant.discountPrice || selectedVariant.price)
    : (product.discountPrice || product.price);

  const originalPrice = selectedVariant ? selectedVariant.price : product.price;
  const hasDiscount = currentPrice < originalPrice;
  const discountPercentage = hasDiscount
    ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
    : 0;

  // EMI calculation (approx 3, 6, 9, 12 months)
  const emiPerMonth = Math.round(currentPrice / 12);

  const handleAddToCart = async () => {
    await addToCart(product.id, selectedVariant?.id || null, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 2500);
  };

  const handleBuyNow = async () => {
    await addToCart(product.id, selectedVariant?.id || null, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setSubmittingReview(true);
      const res = await api.post('/reviews', {
        productId: product.id,
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      });

      if (res.data.success) {
        setReviewMessage('Your review has been published. Thank you!');
        setReviewTitle('');
        setReviewComment('');
        // Refresh product reviews
        const updated = await api.get(`/products/${product.id}`);
        if (updated.data.success) {
          setProduct(updated.data.data.product);
        }
      }
    } catch (err: any) {
      setReviewMessage(err.response?.data?.message || 'Error saving review');
    } finally {
      setSubmittingReview(false);
    }
  };

  // Parse specifications JSON
  let specsObj: Record<string, string> = {};
  if (product.specifications) {
    try {
      specsObj = JSON.parse(product.specifications);
    } catch {
      specsObj = {};
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-12">
      {/* Breadcrumbs */}
      <nav className="text-xs text-slate-500 flex items-center gap-2 flex-wrap">
        <Link to="/" className="hover:text-indigo-600">Home</Link>
        <span>&bull;</span>
        <Link to="/products" className="hover:text-indigo-600">Catalog</Link>
        <span>&bull;</span>
        <Link to={`/category/${product.category?.slug}`} className="hover:text-indigo-600">
          {product.category?.name}
        </Link>
        <span>&bull;</span>
        <span className="text-slate-800 font-medium truncate max-w-[200px]">{product.name}</span>
      </nav>

      {/* Main Product Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Product Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Main Large Image */}
          <div className="relative bg-white rounded-3xl border border-slate-200/80 p-8 shadow-sm overflow-hidden flex items-center justify-center min-h-[380px] sm:min-h-[440px]">
            <img
              src={selectedImage || product.images?.[0]?.url}
              alt={product.name}
              className="max-h-[380px] w-auto object-contain transition-all duration-300 hover:scale-105"
            />

            {/* Floating Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full flex items-center justify-center transition shadow-md ${
                inWishlist
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-white/95 text-slate-400 hover:text-rose-500 border border-slate-200'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-5 h-5 ${inWishlist ? 'fill-rose-500' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row */}
          {product.images && product.images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img.url)}
                  className={`w-16 h-16 rounded-xl border-2 p-1 bg-white shrink-0 overflow-hidden transition ${
                    selectedImage === img.url
                      ? 'border-indigo-600 shadow-md ring-2 ring-indigo-200'
                      : 'border-slate-200 hover:border-slate-400'
                  }`}
                >
                  <img src={img.url} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <ShieldCheck className="w-5 h-5 text-indigo-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">100% Genuine</div>
              <div className="text-[10px] text-slate-500">Official Warranty</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <Truck className="w-5 h-5 text-cyan-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">Free Express</div>
              <div className="text-[10px] text-slate-500">All India Delivery</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <RotateCcw className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
              <div className="text-[11px] font-bold text-slate-800">7-Day Return</div>
              <div className="text-[10px] text-slate-500">Easy Replacement</div>
            </div>
          </div>
        </div>

        {/* Right Column: Product Info & Purchase Form (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            {/* Brand badge */}
            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-indigo-50 text-indigo-700 mb-2">
              {product.brand?.name || 'Electronics'}
            </span>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings & SKU */}
            <div className="flex items-center gap-4 mt-2 text-xs text-slate-500 flex-wrap">
              <div className="flex items-center gap-1.5">
                <div className="flex items-center bg-emerald-700 text-white font-bold px-2 py-0.5 rounded text-xs">
                  <span>{product.rating > 0 ? product.rating.toFixed(1) : '4.8'}</span>
                  <Star className="w-3.5 h-3.5 fill-current ml-1" />
                </div>
                <span className="font-semibold text-slate-700">
                  {product.numReviews} Verified Ratings & Reviews
                </span>
              </div>
              <span>&bull;</span>
              <span>SKU: {selectedVariant?.sku || product.sku}</span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-50 to-indigo-50/40 border border-indigo-100 space-y-2">
            <div className="flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                {formatINR(currentPrice)}
              </span>
              {hasDiscount && (
                <span className="text-base text-slate-600 line-through">
                  {formatINR(originalPrice)}
                </span>
              )}
              {discountPercentage > 0 && (
                <span className="px-2.5 py-1 rounded-lg bg-rose-600 text-white font-extrabold text-xs shadow-sm">
                  {discountPercentage}% OFF
                </span>
              )}
            </div>

            <p className="text-xs text-slate-500 font-medium">
              Inclusive of all taxes &bull; GST invoice provided with warranty registration
            </p>

            {/* EMI options */}
            <div className="pt-2 text-xs flex items-center gap-2 text-slate-700">
              <CreditCard className="w-4 h-4 text-indigo-600" />
              <span>
                Standard EMI starting at <strong>{formatINR(emiPerMonth)}/month</strong> across major Indian banks.
              </span>
            </div>
          </div>

          {/* Variant Selection: Colors, RAM, Storage */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-4 pt-2">
              <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                Select Configuration / Variant:
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setSelectedVariant(v);
                      if (v.imageUrl) setSelectedImage(v.imageUrl);
                    }}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      selectedVariant?.id === v.id
                        ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-500'
                        : 'border-slate-200 bg-white hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-2">
                        {v.colorCode && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-slate-300 inline-block shrink-0 shadow-inner"
                            style={{ backgroundColor: v.colorCode }}
                          />
                        )}
                        <span>{v.color || 'Standard Edition'}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {[v.ram, v.storage].filter(Boolean).join(' | ') || v.sku}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900">
                        {formatINR(v.discountPrice || v.price)}
                      </div>
                      {v.stockQuantity > 0 ? (
                        <span className="text-[10px] text-emerald-600 font-semibold">In Stock</span>
                      ) : (
                        <span className="text-[10px] text-rose-500 font-semibold">Backorder</span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Stock Availability status */}
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold text-slate-700">Availability:</span>
            {product.stockQuantity > 0 ? (
              <span className="flex items-center gap-1 font-bold text-emerald-600">
                <Check className="w-4 h-4 text-emerald-600" /> In Stock (Dispatches within 24 Hours)
              </span>
            ) : (
              <span className="font-bold text-rose-600">Currently Sold Out</span>
            )}
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-slate-300 rounded-xl bg-white overflow-hidden shadow-sm">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="px-4 py-2 text-xs font-bold text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="px-3 py-2 text-slate-600 hover:bg-slate-100 font-bold text-sm"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              {addedNotice && (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 animate-in fade-in">
                  <Check className="w-4 h-4" /> Added to your shopping cart!
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={product.stockQuantity <= 0}
                className="py-3.5 px-6 rounded-xl border-2 border-indigo-600 hover:bg-indigo-50 text-indigo-700 font-bold text-sm flex items-center justify-center gap-2 transition shadow-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              <button
                onClick={handleBuyNow}
                disabled={product.stockQuantity <= 0}
                className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/25 transition transform hover:-translate-y-0.5"
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>

          {/* Delivery & Pincode Checker */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 space-y-2 text-xs">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <MapPin className="w-4 h-4 text-indigo-600" />
              <span>Doorstep Delivery Across India:</span>
            </div>
            <p className="text-slate-600 text-xs">
              {product.deliveryInfo || 'Fast express delivery in 2-3 business days. Same day delivery available in Delhi-NCR.'}
            </p>
          </div>
        </div>
      </div>

      {/* Tabs / Accordion for Specifications, Description, Warranty, Inside the Box */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-8">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 pb-3 border-b border-slate-200">
            Product Overview & Description
          </h2>
          <div className="mt-4 text-sm text-slate-700 leading-relaxed font-normal whitespace-pre-line">
            {product.description}
          </div>
        </div>

        {/* Technical Specifications */}
        {Object.keys(specsObj).length > 0 && (
          <div>
            <h3 className="text-lg font-bold text-slate-900 pb-3 border-b border-slate-200">
              Technical Specifications
            </h3>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-3 gap-x-8 text-xs">
              {Object.entries(specsObj).map(([key, val]) => (
                <div key={key} className="flex justify-between py-2 border-b border-slate-100">
                  <span className="font-semibold text-slate-500">{key}</span>
                  <span className="font-medium text-slate-900 text-right">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Warranty & In the Box & Policy */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-200 text-xs">
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>Warranty Coverage</span>
            </div>
            <p className="text-slate-600">
              {product.warrantyInfo || '1 Year Manufacturer Brand Warranty with service center coverage across India.'}
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <Box className="w-4 h-4 text-cyan-600" />
              <span>What's Inside the Box</span>
            </div>
            <p className="text-slate-600">
              {product.boxContents || 'Product Handset, High Speed Fast Charger, USB Cable, SIM Tray Pin, Quick Start Guide.'}
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
              <RotateCcw className="w-4 h-4 text-emerald-600" />
              <span>Return & Replacement</span>
            </div>
            <p className="text-slate-600">
              {product.returnPolicy || '7 Days Replacement Policy if damaged or defective on delivery.'}
            </p>
          </div>
        </div>
      </div>

      {/* Customer Reviews & Ratings Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-200 gap-3">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900">Customer Ratings & Reviews</h2>
            <p className="text-xs text-slate-500">Real feedback from verified purchasers</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-emerald-700 text-white font-bold px-3 py-1 rounded-lg text-sm">
              <span>{product.rating > 0 ? product.rating.toFixed(1) : '4.8'}</span>
              <Star className="w-4 h-4 fill-current ml-1" />
            </div>
            <span className="text-xs text-slate-500">Based on {product.numReviews} ratings</span>
          </div>
        </div>

        {/* Existing Reviews List */}
        {product.reviews && product.reviews.length > 0 ? (
          <div className="space-y-4">
            {product.reviews.map((rev) => (
              <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-800">{rev.user?.name || 'Customer'}</span>
                    {rev.isVerifiedPurchase && (
                      <span className="bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded text-[10px]">
                        Verified Purchase
                      </span>
                    )}
                  </div>
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </div>
                {rev.title && <h4 className="font-bold text-slate-900">{rev.title}</h4>}
                <p className="text-slate-600 leading-relaxed">{rev.comment}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 italic">No reviews yet for this product. Be the first to share your thoughts!</p>
        )}

        {/* Submit Review Form */}
        <div className="mt-8 pt-6 border-t border-slate-200">
          <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-600" />
            Write a Review
          </h3>

          {reviewMessage && (
            <div className="p-3 mb-4 rounded-xl bg-indigo-50 text-indigo-800 font-semibold text-xs border border-indigo-200">
              {reviewMessage}
            </div>
          )}

          <form onSubmit={handleReviewSubmit} className="space-y-3 max-w-xl">
            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Your Rating:</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewRating(star)}
                    className="p-1 text-amber-400 hover:scale-110 transition"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= reviewRating ? 'fill-amber-400' : 'text-slate-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Review Title:</label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="e.g. Excellent battery and display!"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1">Your Feedback:</label>
              <textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                rows={3}
                required
                placeholder="Share details about performance, delivery, and overall satisfaction..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
            >
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        </div>
      </div>

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Similar Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      {/* Customers Also Viewed */}
      {customersAlsoViewed.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Customers Also Viewed
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {customersAlsoViewed.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
