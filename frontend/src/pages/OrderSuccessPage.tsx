import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { Order, OrderStatus } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import {
  CheckCircle,
  Package,
  Truck,
  MapPin,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Phone,
  Mail,
  AlertCircle,
  HelpCircle,
  MessageCircle,
  Copy,
  CheckCheck,
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

const ORDER_STEPS: { status: OrderStatus; label: string }[] = [
  { status: 'ORDER_PLACED', label: 'Order Placed' },
  { status: 'CONFIRMED', label: 'Confirmed' },
  { status: 'PROCESSING', label: 'Processing' },
  { status: 'SHIPPED', label: 'Shipped' },
  { status: 'OUT_FOR_DELIVERY', label: 'Out for Delivery' },
  { status: 'DELIVERED', label: 'Delivered' },
];

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();

  useSEO({
    title: orderId ? `Order #${orderId} Confirmed` : 'Order Confirmation',
    description: 'Thank you for your purchase at Arora Mobile Hub Bareilly. View your order receipt and tracking status.',
  });

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copiedUpi, setCopiedUpi] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/orders/${orderId}`);
        if (res.data.success) {
          setOrder(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching order details:', err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId) fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center animate-pulse">
        <div className="w-16 h-16 bg-violet-900/40 rounded-full mx-auto mb-4 border border-violet-700/50" />
        <div className="h-6 bg-violet-900/30 rounded-xl w-1/3 mx-auto mb-2" />
        <div className="h-4 bg-violet-900/20 rounded-xl w-1/4 mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 bg-rose-950/60 text-rose-400 rounded-full flex items-center justify-center mx-auto border border-rose-600/40">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-extrabold text-white">Order Not Found</h2>
        <p className="text-xs text-slate-400 max-w-md mx-auto">
          We could not locate this order reference. Please check your account dashboard or contact our Bareilly support desk.
        </p>
        <Link
          to="/"
          className="inline-flex px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg hover:scale-105 transition"
        >
          Return to Store Home
        </Link>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.status === order.status);
  const activeStep = currentStepIndex >= 0 ? currentStepIndex : 0;

  const isCOD = order.paymentMethod === 'CASH_ON_DELIVERY';
  const isPaid = order.paymentStatus === 'COMPLETED';
  const isPending = order.paymentStatus === 'PENDING';

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* 1. TOP SUCCESS HERO BANNER (Aurora Velvet 3D Card) */}
      <div className="bg-[#120D2C]/90 backdrop-blur-xl rounded-3xl border border-violet-800/50 p-6 sm:p-8 shadow-2xl text-center space-y-4 relative overflow-hidden">
        {/* Glow ambient background aura */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-36 bg-gradient-to-b from-emerald-500/15 via-violet-500/10 to-transparent blur-2xl pointer-events-none" />

        <div className="w-16 h-16 bg-emerald-950/80 text-emerald-400 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-500/50 shadow-lg shadow-emerald-950/50">
          <CheckCircle className="w-10 h-10 animate-in zoom-in-50 duration-300" />
        </div>

        <div>
          <span className="text-xs font-black uppercase tracking-wider text-emerald-300 bg-emerald-950/80 px-4 py-1 rounded-full border border-emerald-500/40 inline-block shadow-sm">
            ✓ Order Successfully Placed
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            Thank You For Shopping with Arora Mobile Hub!
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto mt-1 leading-relaxed">
            Your electronics order has been registered in our store catalog. Official tax invoice and courier dispatch details will follow shortly.
          </p>
        </div>

        {/* High-Contrast Order Number Badge */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-[#1A123D] border border-cyan-400/50 shadow-lg">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Order Reference:</span>
            <span className="text-base sm:text-lg font-black font-mono text-cyan-300 tracking-wide">
              #{order.orderNumber}
            </span>
          </div>

          <div className="inline-flex items-center gap-2 text-xs font-semibold text-slate-300 bg-violet-950/50 px-4 py-2.5 rounded-2xl border border-violet-800/40">
            <Calendar className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>Placed on {formatDate(order.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* 2. SHIPMENT TRACKER TIMELINE */}
      <div className="bg-[#120D2C]/90 backdrop-blur-xl rounded-3xl border border-violet-800/50 p-6 sm:p-8 shadow-2xl space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-violet-900/40">
          <h2 className="text-xs sm:text-sm font-extrabold text-white uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-cyan-400" />
            <span>Shipment Status & Waybill Tracking</span>
          </h2>
          {order.trackingNumber ? (
            <span className="text-xs text-cyan-300 font-black bg-cyan-950/80 border border-cyan-500/40 px-3 py-1 rounded-xl">
              Waybill: {order.trackingNumber}
            </span>
          ) : (
            <span className="text-[11px] text-amber-300 font-bold bg-amber-950/60 border border-amber-500/40 px-2.5 py-0.5 rounded-lg">
              Courier Dispatched within 24h
            </span>
          )}
        </div>

        {/* Stepper Bar */}
        <div className="overflow-x-auto py-2 no-scrollbar">
          <div className="min-w-[620px] flex items-center justify-between px-2">
            {ORDER_STEPS.map((s, idx) => {
              const isPassed = idx <= activeStep;
              const isCurrent = idx === activeStep;

              return (
                <React.Fragment key={s.status}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-xs transition shadow-md ${
                        isCurrent
                          ? 'bg-violet-600 text-white ring-4 ring-violet-500/40 scale-110 shadow-violet-600/50'
                          : isPassed
                          ? 'bg-emerald-600 text-white shadow-emerald-600/40'
                          : 'bg-violet-950/70 text-slate-400 border border-violet-800/40'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-bold mt-2 text-center whitespace-nowrap ${
                        isPassed ? 'text-white' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {idx < ORDER_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 -mt-5 transition rounded-full ${
                        idx < activeStep ? 'bg-emerald-500' : 'bg-violet-950/80 border border-violet-900/40'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. ORDER DETAILS & DELIVERY ADDRESS (CRYSTAL CLEAR HIGH CONTRAST) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Destination Card */}
        <div className="bg-[#120D2C]/90 backdrop-blur-xl rounded-3xl border border-violet-800/50 p-6 sm:p-7 shadow-2xl space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2 pb-3 border-b border-violet-900/40">
            <MapPin className="w-4 h-4 text-cyan-400" />
            <span>Shipping Destination & Contact</span>
          </h3>

          {order.address ? (
            <div className="space-y-3.5">
              {/* Customer Full Name (Bold, bright white, prominent) */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">
                  Recipient Name
                </span>
                <p className="text-white font-black text-lg tracking-tight">
                  {order.address.fullName}
                </p>
              </div>

              {/* Street Address */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-0.5">
                  Delivery Address
                </span>
                <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed bg-[#161036] p-3 rounded-2xl border border-violet-900/40">
                  {order.address.addressLine}
                  <br />
                  <strong className="text-white font-bold">
                    {order.address.city}, {order.address.state} - {order.address.pinCode}
                  </strong>
                </p>
              </div>

              {/* Clickable Phone Number (Vibrant Emerald Badge) */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                  Recipient Phone Number
                </span>
                <a
                  href={`tel:${order.address.phone}`}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-300 font-extrabold text-sm hover:underline shadow-sm transition"
                  title="Click to dial"
                >
                  <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{order.address.phone}</span>
                </a>
              </div>

              {/* Clickable Email (Vibrant Violet Badge) */}
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider mb-1">
                  Confirmation Email
                </span>
                <a
                  href={`mailto:${order.address.email}`}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-violet-950/70 border border-violet-600/40 text-violet-300 font-bold text-xs hover:underline shadow-sm transition"
                  title="Send email"
                >
                  <Mail className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                  <span>{order.address.email}</span>
                </a>
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-400">Address details unavailable.</p>
          )}
        </div>

        {/* Payment Information Card (Truthful & Accurate Status) */}
        <div className="bg-[#120D2C]/90 backdrop-blur-xl rounded-3xl border border-violet-800/50 p-6 sm:p-7 shadow-2xl space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2 pb-3 border-b border-violet-900/40">
            <CreditCard className="w-4 h-4 text-cyan-400" />
            <span>Payment Breakdown & Status</span>
          </h3>

          <div className="text-xs space-y-2.5 text-slate-300">
            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Items Subtotal:</span>
              <span className="font-bold text-white text-sm">{formatINR(order.subtotal)}</span>
            </div>

            {order.discount > 0 && (
              <div className="flex justify-between items-center text-emerald-400 font-bold py-1">
                <span>Coupon Savings ({order.couponCode || 'APPLIED'}):</span>
                <span>- {formatINR(order.discount)}</span>
              </div>
            )}

            <div className="flex justify-between items-center py-1">
              <span className="text-slate-400">Express Delivery:</span>
              <span className="font-bold text-emerald-400">
                {order.deliveryCharge === 0 ? 'FREE (Store Promotion)' : formatINR(order.deliveryCharge)}
              </span>
            </div>

            {/* Total Row with Truthful Label */}
            <div className="pt-3 border-t border-violet-900/40 flex justify-between items-baseline">
              <span className="text-sm font-extrabold text-white">
                {isPaid ? 'Total Paid:' : isCOD ? 'Amount to Pay on Delivery:' : 'Amount Payable:'}
              </span>
              <span className="text-xl sm:text-2xl font-black text-cyan-300">
                {formatINR(order.totalAmount)}
              </span>
            </div>

            {/* Truthful Payment Status Pill & Detailed Notice */}
            <div className="pt-2 space-y-3">
              {/* STATUS BADGES */}
              {isPaid ? (
                <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 space-y-1">
                  <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-emerald-300">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Payment Status: Paid & Verified</span>
                  </div>
                  <p className="text-[11px] text-emerald-300/90 leading-relaxed">
                    Payment via {order.paymentMethod.replace(/_/g, ' ')} has been verified. Official GST tax invoice is attached with your parcel.
                  </p>
                </div>
              ) : isCOD ? (
                <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-500/50 text-amber-200 space-y-1.5">
                  <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-amber-300">
                    <Clock className="w-4 h-4 text-amber-400" />
                    <span>Payment Status: Pending (Cash on Delivery)</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed font-normal">
                    🚚 Please pay <strong className="text-amber-300 font-extrabold">{formatINR(order.totalAmount)}</strong> in cash or via courier UPI QR scanner when the delivery agent arrives at your door.
                  </p>
                </div>
              ) : (
                /* UPI / Net Banking / Pending Verification */
                <div className="p-3.5 rounded-2xl bg-cyan-950/60 border border-cyan-500/50 text-cyan-200 space-y-2">
                  <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-cyan-300">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>Payment Status: Awaiting Verification</span>
                  </div>
                  <p className="text-[11px] text-slate-200 leading-relaxed font-normal">
                    Mode: <strong className="text-white font-bold">{order.paymentMethod.replace(/_/g, ' ')}</strong>. Our Bareilly billing team matches incoming transfers before dispatch.
                  </p>
                  <div className="p-2.5 rounded-xl bg-[#140F30] border border-violet-800/40 text-[11px] space-y-1">
                    <div className="text-slate-400">If you haven't completed the payment yet:</div>
                    <div className="flex items-center justify-between text-xs font-mono font-bold text-white">
                      <span>UPI ID: 7300791957@kotak</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText('7300791957@kotak');
                          setCopiedUpi(true);
                          setTimeout(() => setCopiedUpi(false), 2000);
                        }}
                        className="px-2 py-0.5 rounded bg-violet-800 text-[10px] text-white hover:bg-violet-700"
                      >
                        {copiedUpi ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="text-[11px] text-slate-300 bg-[#161036] p-2.5 rounded-xl border border-violet-900/40">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block mb-0.5">Order Notes:</span>
                  <span>{order.notes}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 4. ORDERED ELECTRONICS ITEMS LIST */}
      <div className="bg-[#120D2C]/90 backdrop-blur-xl rounded-3xl border border-violet-800/50 p-6 sm:p-7 shadow-2xl space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300 pb-3 border-b border-violet-900/40 flex items-center gap-2">
          <Package className="w-4 h-4 text-cyan-400" />
          <span>Ordered Items in this Package ({order.items.length})</span>
        </h3>

        <div className="divide-y divide-violet-900/30">
          {order.items.map((item) => (
            <div key={item.id} className="py-3.5 flex items-center justify-between text-xs gap-3">
              <div className="flex items-center gap-3.5 min-w-0">
                {item.productImage ? (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-14 h-14 object-contain rounded-xl bg-[#161036] p-1.5 border border-violet-900/40 shrink-0"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-xl bg-[#161036] flex items-center justify-center text-violet-400 border border-violet-900/40 shrink-0">
                    <Package className="w-6 h-6" />
                  </div>
                )}
                <div className="min-w-0">
                  <h4 className="font-extrabold text-white text-sm truncate">{item.productName}</h4>
                  <p className="text-slate-400 text-xs mt-0.5">
                    Qty: <strong className="text-slate-200">{item.quantity}</strong> &times; {formatINR(item.price)}
                  </p>
                </div>
              </div>
              <span className="font-black text-cyan-300 text-sm sm:text-base shrink-0">
                {formatINR(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. HELPDESK & NAVIGATION ACTIONS */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          <Link
            to="/"
            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-violet-800/50 hover:bg-violet-950/60 text-slate-200 font-bold text-xs text-center transition"
          >
            ← Return to Store Home
          </Link>
          <Link
            to="/account?tab=orders"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs text-center shadow-lg shadow-violet-900/40 transition flex items-center justify-center gap-2"
          >
            <span>Track in My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* WhatsApp Helpdesk Button */}
        <a
          href={`https://wa.me/917300791957?text=Hello%20Arora%20Mobile%20Hub%2C%20I%20have%20an%20inquiry%20regarding%20Order%20%23${order.orderNumber}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/50 transition"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Support Desk (+91 73007 91957)</span>
        </a>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
