import React from 'react';
import {
  ShieldCheck,
  Tag,
  Lock,
  Truck,
  Headphones,
  Award,
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const points = [
    {
      icon: <ShieldCheck className="w-8 h-8 text-indigo-600" />,
      title: '100% Genuine Products',
      desc: 'All phones, laptops, and accessories are sourced directly with manufacturer warranties and valid GST tax invoices.',
    },
    {
      icon: <Tag className="w-8 h-8 text-cyan-600" />,
      title: 'Competitive Indian Pricing',
      desc: 'Get unbeatable online and in-store prices, instant bank discounts, and high-value phone exchange bonuses.',
    },
    {
      icon: <Lock className="w-8 h-8 text-emerald-600" />,
      title: '100% Secure Payments',
      desc: 'Pay seamlessly via UPI (Google Pay, PhonePe, Paytm), RuPay, Credit/Debit cards, Net Banking, or Cash on Delivery.',
    },
    {
      icon: <Truck className="w-8 h-8 text-blue-600" />,
      title: 'Fast Pan-India Delivery',
      desc: 'Same-day dispatch for orders before 2:00 PM with real-time SMS & WhatsApp courier tracking right to your doorstep.',
    },
    {
      icon: <Headphones className="w-8 h-8 text-purple-600" />,
      title: 'Dedicated Customer Support',
      desc: 'Speak directly with our experienced Delhi-NCR mobile experts 7 days a week via phone call or WhatsApp.',
    },
    {
      icon: <Award className="w-8 h-8 text-amber-600" />,
      title: 'Trusted Local Retailer',
      desc: 'A real physical mobile & electronics store expanding online with over 10+ years of local customer satisfaction.',
    },
  ];

  return (
    <section className="bg-slate-50 py-14 border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Why Choose Arora Communication?
          </h2>
          <p className="text-sm text-slate-500 mt-2">
            The reliability and personal care of your trusted neighborhood mobile store, combined with the convenience of modern e-commerce.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {points.map((p, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 flex items-start gap-4"
            >
              <div className="p-3 rounded-xl bg-slate-50 shrink-0">
                {p.icon}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  {p.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
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
