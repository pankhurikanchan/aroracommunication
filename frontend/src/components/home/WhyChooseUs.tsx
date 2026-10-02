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
      icon: <ShieldCheck className="w-6 h-6 text-violet-400" />,
      bg: 'bg-violet-950/60 border-violet-800/40 text-violet-400',
      title: '100% Genuine Sealed Units',
      desc: 'Sourced directly with valid Indian retail barcodes, official brand warranties, and proper GST tax invoices.',
    },
    {
      icon: <Tag className="w-6 h-6 text-cyan-400" />,
      bg: 'bg-cyan-950/60 border-cyan-800/40 text-cyan-400',
      title: 'Competitive Indian Pricing',
      desc: 'Unbeatable street prices, instant bank discounts, and the highest guaranteed exchange values for old handsets.',
    },
    {
      icon: <Lock className="w-6 h-6 text-emerald-400" />,
      bg: 'bg-emerald-950/60 border-emerald-800/40 text-emerald-400',
      title: '100% Secure Payment Gateways',
      desc: 'Pay safely with UPI (Google Pay, PhonePe, Paytm), RuPay, Credit/Debit cards, Net Banking, or Cash on Delivery.',
    },
    {
      icon: <Truck className="w-6 h-6 text-blue-400" />,
      bg: 'bg-blue-950/60 border-blue-800/40 text-blue-400',
      title: 'Fast Pan-India Express Delivery',
      desc: 'Same-day dispatch for orders placed before 2:00 PM with real-time SMS & WhatsApp courier tracking.',
    },
    {
      icon: <Headphones className="w-6 h-6 text-fuchsia-400" />,
      bg: 'bg-fuchsia-950/60 border-fuchsia-800/40 text-fuchsia-400',
      title: 'Dedicated Bareilly Support Desk',
      desc: 'Talk to knowledgeable tech experts 7 days a week via direct phone call (+91 73007 91957), WhatsApp, or in person at our Bareilly store.',
    },
    {
      icon: <Award className="w-6 h-6 text-amber-400" />,
      bg: 'bg-amber-950/60 border-amber-800/40 text-amber-400',
      title: 'Trusted Bareilly Landmark',
      desc: 'A physical landmark mobile & electronics store at C-15 Ekta Nagar, Bareilly, backed by valid GSTIN: 09DIYPA1147P1ZK.',
    },
  ];

  return (
    <section className="bg-transparent py-16 border-t border-violet-950/40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-violet-400 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>The Arora Mobile Hub Standard of Trust</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
            Why Shop at Arora Mobile Hub?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
            The personalized warmth and reliability of your local tech store, coupled with modern e-commerce convenience and transparent pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((p, idx) => (
            <div
              key={idx}
              className="group bg-[#130F2B]/85 backdrop-blur-md p-6 rounded-3xl border border-violet-900/35 hover:border-violet-500/50 hover:shadow-[0_15px_35px_rgba(139,92,246,0.25)] transition-all duration-300 flex items-start gap-4 hover:-translate-y-1"
            >
              <div
                className={`p-3 rounded-2xl border shrink-0 transition-transform duration-300 group-hover:scale-110 shadow-sm ${p.bg}`}
              >
                {p.icon}
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-extrabold text-white mb-1 group-hover:text-violet-300 transition-colors">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed font-normal">
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
