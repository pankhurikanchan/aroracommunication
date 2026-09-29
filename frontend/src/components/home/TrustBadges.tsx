import React from 'react';
import { Truck, ShieldCheck, RotateCcw, CreditCard, Headphones } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const usps = [
    {
      icon: <Truck className="w-5 h-5 text-indigo-600" />,
      title: 'Fast & Secure Delivery',
      desc: 'Express delivery across India',
      bg: 'bg-indigo-50/70',
      border: 'hover:border-indigo-300',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-600" />,
      title: 'Genuine Products',
      desc: '100% authentic branded products',
      bg: 'bg-emerald-50/70',
      border: 'hover:border-emerald-300',
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-blue-600" />,
      title: 'Easy Returns',
      desc: 'Simple and transparent returns',
      bg: 'bg-blue-50/70',
      border: 'hover:border-blue-300',
    },
    {
      icon: <CreditCard className="w-5 h-5 text-amber-600" />,
      title: 'Secure Payments',
      desc: 'Safe & secure checkout',
      bg: 'bg-amber-50/70',
      border: 'hover:border-amber-300',
    },
    {
      icon: <Headphones className="w-5 h-5 text-purple-600" />,
      title: 'Customer Support',
      desc: 'Dedicated customer assistance',
      bg: 'bg-purple-50/70',
      border: 'hover:border-purple-300',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 my-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {usps.map((usp, idx) => (
          <div
            key={idx}
            className={`group bg-white p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex items-start gap-3 hover:-translate-y-0.5 ${usp.border}`}
          >
            <div className={`p-2.5 rounded-xl ${usp.bg} shrink-0 group-hover:scale-110 transition-transform duration-200`}>
              {usp.icon}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                {usp.title}
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                {usp.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
