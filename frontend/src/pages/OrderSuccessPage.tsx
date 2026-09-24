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
} from 'lucide-react';

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
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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
        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-4" />
        <div className="h-6 bg-slate-200 rounded w-1/3 mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Order Not Found</h2>
        <Link to="/" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs">
          Return to Home
        </Link>
      </div>
    );
  }

  const currentStepIndex = ORDER_STEPS.findIndex((s) => s.status === order.status);
  const activeStep = currentStepIndex >= 0 ? currentStepIndex : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      {/* Top Success Banner */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-8 shadow-sm text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
          <CheckCircle className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full inline-block">
          Order Successfully Placed!
        </span>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Thank You For Shopping with Arora Communication
        </h1>

        <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto">
          We have received your order <strong>#{order.orderNumber}</strong>. A confirmation email and tracking link have been dispatched.
        </p>

        <div className="pt-2 flex items-center justify-center gap-4 text-xs font-semibold text-slate-700">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-indigo-600" /> {formatDate(order.createdAt)}
          </span>
          <span>&bull;</span>
          <span className="flex items-center gap-1.5">
            <CreditCard className="w-4 h-4 text-emerald-600" /> Mode: {order.paymentMethod.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* Visual Tracking Progress Timeline */}
      <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h2 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
            <Truck className="w-4 h-4 text-indigo-600" />
            Live Shipment Tracker
          </h2>
          {order.trackingNumber && (
            <span className="text-xs text-indigo-600 font-bold bg-indigo-50 px-2.5 py-1 rounded-lg">
              Waybill: {order.trackingNumber}
            </span>
          )}
        </div>

        {/* Stepper Bar */}
        <div className="overflow-x-auto py-2">
          <div className="min-w-[600px] flex items-center justify-between">
            {ORDER_STEPS.map((s, idx) => {
              const isPassed = idx <= activeStep;
              const isCurrent = idx === activeStep;

              return (
                <React.Fragment key={s.status}>
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-4 ring-indigo-100'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </div>
                    <span
                      className={`text-[11px] font-semibold mt-1.5 text-center whitespace-nowrap ${
                        isPassed ? 'text-slate-900 font-bold' : 'text-slate-400'
                      }`}
                    >
                      {s.label}
                    </span>
                  </div>

                  {idx < ORDER_STEPS.length - 1 && (
                    <div
                      className={`flex-1 h-1 mx-2 -mt-4 transition ${
                        idx < activeStep ? 'bg-emerald-500' : 'bg-slate-200'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      {/* Order Details & Delivery Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Shipping Address */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <MapPin className="w-4 h-4 text-indigo-600" />
            Shipping Destination
          </h3>
          {order.address && (
            <div className="text-xs space-y-1 text-slate-600">
              <p className="font-bold text-slate-900 text-sm">{order.address.fullName}</p>
              <p>{order.address.addressLine}</p>
              <p>{order.address.city}, {order.address.state} - {order.address.pinCode}</p>
              <p className="pt-1 text-slate-500">Phone: {order.address.phone}</p>
              <p className="text-slate-500">Email: {order.address.email}</p>
            </div>
          )}
        </div>

        {/* Payment & Charges summary */}
        <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 pb-2 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            Payment Information
          </h3>
          <div className="text-xs space-y-2 text-slate-600">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold text-slate-900">{formatINR(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount ({order.couponCode || 'PROMO'}):</span>
                <span>- {formatINR(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery:</span>
              <span>{order.deliveryCharge === 0 ? 'FREE' : formatINR(order.deliveryCharge)}</span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
              <span>Total Paid:</span>
              <span className="text-indigo-700">{formatINR(order.totalAmount)}</span>
            </div>
            <div className="pt-1">
              <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Payment Status: {order.paymentStatus}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Ordered Items List */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-2 border-b border-slate-100 flex items-center gap-1.5">
          <Package className="w-4 h-4 text-indigo-600" />
          Ordered Electronics ({order.items.length})
        </h3>

        <div className="divide-y divide-slate-100">
          {order.items.map((item) => (
            <div key={item.id} className="py-3 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                {item.productImage && (
                  <img
                    src={item.productImage}
                    alt={item.productName}
                    className="w-12 h-12 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100 shrink-0"
                  />
                )}
                <div>
                  <h4 className="font-bold text-slate-800">{item.productName}</h4>
                  <p className="text-slate-500">Qty: {item.quantity} &times; {formatINR(item.price)}</p>
                </div>
              </div>
              <span className="font-bold text-slate-900 text-sm">
                {formatINR(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Navigation CTAs */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
        <Link
          to="/"
          className="w-full sm:w-auto px-6 py-3 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs text-center transition"
        >
          Return to Home
        </Link>
        <Link
          to="/account?tab=orders"
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs text-center shadow-md transition flex items-center justify-center gap-2"
        >
          <span>View All My Orders</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
