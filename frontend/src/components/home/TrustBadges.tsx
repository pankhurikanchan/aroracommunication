import React from 'react';
import { Truck, ShieldCheck, RotateCcw, CreditCard, Headphones } from 'lucide-react';

export const TrustBadges: React.FC = () => {
  const usps = [
    {
      icon: <Truck className="w-5 h-5 text-violet-400" />,
      title: 'Fast & Secure Delivery',
      desc: 'Express delivery across India',
      bg: 'bg-violet-950/60 border border-violet-800/40',
      border: 'hover:border-violet-500/60',
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      title: 'Genuine Products',
      desc: '100% authentic branded products',
      bg: 'bg-emerald-950/60 border border-emerald-800/40',
      border: 'hover:border-emerald-500/60',
    },
    {
      icon: <RotateCcw className="w-5 h-5 text-cyan-400" />,
      title: 'Easy Returns',
      desc: 'Simple and transparent returns',
      bg: 'bg-cyan-950/60 border border-cyan-800/40',
      border: 'hover:border-cyan-500/60',
    },
    {
      icon: <CreditCard className="w-5 h-5 text-amber-400" />,
      title: 'Secure Payments',
      desc: 'Safe & secure checkout',
      bg: 'bg-amber-950/60 border border-amber-800/40',
      border: 'hover:border-amber-500/60',
    },
    {
      icon: <Headphones className="w-5 h-5 text-fuchsia-400" />,
      title: 'Customer Support',
      desc: 'Dedicated customer assistance',
      bg: 'bg-fuchsia-950/60 border border-fuchsia-800/40',
      border: 'hover:border-fuchsia-500/60',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 my-6">
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {usps.map((usp, idx) => (
          <div
            key={idx}
            className={`group bg-[#130F2B]/85 backdrop-blur-md p-4 rounded-2xl border border-violet-900/35 shadow-sm hover:shadow-[0_10px_25px_rgba(139,92,246,0.25)] transition-all duration-300 flex items-start gap-3 hover:-translate-y-0.5 ${usp.border}`}
          >
            <div className={`p-2.5 rounded-xl ${usp.bg} shrink-0 group-hover:scale-110 transition-transform duration-200`}>
              {usp.icon}
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold text-white leading-tight">
                {usp.title}
              </h3>
              <p className="text-[11px] text-slate-300 mt-0.5 leading-snug">
                {usp.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
