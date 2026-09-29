import React from 'react';
import {
  ShieldCheck,
  Tag,
  Lock,
  Truck,
  Headphones,
  Award,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: <ShieldCheck className="w-6 h-6 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-200 text-indigo-600',
      title: '100% Genuine Sealed Units',
      desc: 'Sourced directly with valid Indian retail barcodes, official brand warranties, and proper GST tax invoices.',
    },
    {
      icon: <Tag className="w-6 h-6 text-cyan-600" />,
      bg: 'bg-cyan-50 border-cyan-200 text-cyan-600',
      title: 'Competitive Indian Pricing',
      desc: 'Unbeatable street prices, instant bank discounts, and the highest guaranteed exchange values for old handsets.',
    },
    {
      icon: <Lock className="w-6 h-6 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200 text-emerald-600',
      title: '100% Secure Payment Gateways',
      desc: 'Pay safely with UPI (Google Pay, PhonePe, Paytm), RuPay, Credit/Debit cards, Net Banking, or Cash on Delivery.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200 text-blue-600',
      title: 'Fast Pan-India Express Delivery',
      desc: 'Same-day dispatch for orders placed before 2:00 PM with real-time SMS & WhatsApp courier tracking.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-200 text-purple-600',
      title: 'Dedicated Bareilly Support Desk',
      desc: 'Talk to knowledgeable tech experts 7 days a week via direct phone call (+91 73007 91957), WhatsApp, or in person at our Bareilly store.',
    },
    {
      icon: <Award className="w-6 h-6 text-amber-600" />,
      bg: 'bg-amber-50 border-amber-200 text-amber-600',
      title: 'Trusted Bareilly Landmark',
      desc: 'A physical landmark mobile & electronics store at C-15 Ekta Nagar, Bareilly, backed by valid GSTIN: 09DIYPA1147P1ZK.',
    },
  ];

  return (
    <section className="bg-slate-100/70 py-16 border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>The Arora Mobile Hub Standard of Trust</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight">
            Why Shop at Arora Mobile Hub?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
            The personalized warmth and reliability of your local tech store, coupled with modern e-commerce convenience and transparent pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((p, idx) => (
            <div
              key={idx}
              className="group bg-white p-6 rounded-3xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 flex items-start gap-4 hover:-translate-y-1"
            >
              <div
                className={`p-3 rounded-2xl border shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${p.bg}`}
              >
                {p.icon}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed font-normal">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
