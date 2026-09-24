import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatINR } from '../utils/formatters';
import {
  Trash2,
  ShoppingCart,
  ArrowRight,
  Tag,
  ShieldCheck,
  CheckCircle,
  AlertCircle,
  Truck,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    subtotal,
    discount,
    deliveryCharge,
    finalTotal,
    coupon,
    updateQuantity,
    removeItem,
    clearCart,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [applying, setApplying] = useState(false);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setApplying(true);
    setCouponMessage(null);
    const res = await applyCoupon(couponCode.trim());
    setApplying(false);

    if (res.success) {
      setCouponMessage({ text: res.message, isError: false });
      setCouponCode('');
    } else {
      setCouponMessage({ text: res.message, isError: true });
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto text-indigo-600 mb-6">
          <ShoppingCart className="w-10 h-10" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-8">
          Explore our wide selection of genuine smartphones, high-speed GaN chargers, earbuds, and accessories.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md transition"
        >
          <span>Continue Shopping</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Shopping Cart ({cart.items.length} {cart.items.length === 1 ? 'item' : 'items'})
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review your selected electronics and proceed to secure checkout
          </p>
        </div>

        <button
          onClick={clearCart}
          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {cart.items.map((item) => {
            const itemPrice = item.price;
            const itemTotal = itemPrice * item.quantity;
            const primaryImg =
              item.product?.images?.[0]?.url ||
              'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-4 transition hover:border-slate-300"
              >
                {/* Product Image */}
                <Link
                  to={`/products/${item.product?.slug}`}
                  className="w-20 h-20 sm:w-24 sm:h-24 bg-slate-50 rounded-xl p-2 shrink-0 border border-slate-100 flex items-center justify-center overflow-hidden"
                >
                  <img
                    src={primaryImg}
                    alt={item.product?.name}
                    className="w-full h-full object-contain"
                  />
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase text-indigo-600 tracking-wider">
                    {item.product?.brand?.name}
                  </div>
                  <Link
                    to={`/products/${item.product?.slug}`}
                    className="text-sm font-bold text-slate-800 hover:text-indigo-600 line-clamp-1 transition"
                  >
                    {item.product?.name}
                  </Link>

                  {item.variant && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      Config: {[item.variant.color, item.variant.ram, item.variant.storage].filter(Boolean).join(' / ')}
                    </div>
                  )}

                  <div className="text-sm font-extrabold text-slate-900 mt-1">
                    {formatINR(itemPrice)}
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                  <div className="flex items-center border border-slate-300 rounded-xl bg-slate-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-slate-700 hover:bg-slate-200 font-bold text-xs"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-bold text-slate-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-slate-700 hover:bg-slate-200 font-bold text-xs"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right min-w-[80px]">
                    <div className="text-sm font-extrabold text-slate-900">
                      {formatINR(itemTotal)}
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-[11px] font-semibold text-rose-500 hover:text-rose-700 flex items-center gap-1 ml-auto mt-0.5"
                    >
                      <Trash2 className="w-3 h-3" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          <div className="pt-2 flex justify-between items-center text-xs">
            <Link
              to="/products"
              className="font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              &larr; Continue Shopping
            </Link>
            <div className="flex items-center gap-1.5 text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Free returns within 7 days</span>
            </div>
          </div>
        </div>

        {/* Right Column: Order Summary & Coupon (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Coupon Box */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Tag className="w-4 h-4 text-indigo-600" />
              Have a Promo Code?
            </h3>

            {coupon ? (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-emerald-800 uppercase block">{coupon.code}</span>
                  <span className="text-emerald-700">Coupon applied! You saved {formatINR(coupon.discount)}</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-rose-600 hover:text-rose-800 font-bold text-xs underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter coupon (e.g. ARORA10)"
                    className="flex-1 p-2.5 rounded-xl border border-slate-300 text-xs uppercase font-medium focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={applying}
                    className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition disabled:opacity-50"
                  >
                    {applying ? 'Applying...' : 'Apply'}
                  </button>
                </div>

                {couponMessage && (
                  <div
                    className={`text-xs p-2 rounded-lg flex items-center gap-1.5 ${
                      couponMessage.isError
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {couponMessage.isError ? (
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    ) : (
                      <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                    )}
                    <span>{couponMessage.text}</span>
                  </div>
                )}

                <div className="pt-1 text-[11px] text-slate-500">
                  Tip: Use coupon <code className="text-indigo-600 font-bold">ARORA10</code> for 10% off!
                </div>
              </form>
            )}
          </div>

          {/* Price Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 pb-3 border-b border-slate-100 uppercase tracking-wider">
              Order Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Cart Subtotal</span>
                <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>- {formatINR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5 text-slate-400" />
                  Delivery Charges
                </span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatINR(deliveryCharge)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                <span className="text-sm font-bold">Total Amount</span>
                <span className="text-2xl font-black text-indigo-700">{formatINR(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="text-[11px] text-slate-400 text-center leading-relaxed">
              Safe & Secure Indian Payments &bull; 256-Bit SSL Encryption
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
