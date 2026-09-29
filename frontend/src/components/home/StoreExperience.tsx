import React from 'react';
import {
  MapPin,
  Phone,
  MessageCircle,
  ExternalLink,
  ShieldCheck,
  Smartphone,
  Sparkles,
  ArrowRight,
  Clock,
  CheckCircle,
} from 'lucide-react';

export const StoreExperience: React.FC = () => {
  const storeFeatures = [
    {
      title: 'Live Device Hands-On',
      desc: 'Experience Apple, Samsung, and OnePlus flagships in your hands before buying.',
      icon: '📱',
    },
    {
      title: 'Free Complete Data Transfer',
      desc: 'Our specialists safely migrate your WhatsApp, photos, and apps from your old phone.',
      icon: '🔄',
    },
    {
      title: 'Free Screen Protector Fit',
      desc: 'Dust-free, bubble-free tempered glass installation on every new purchase.',
      icon: '🛡️',
    },
    {
      title: 'Instant Old Phone Exchange',
      desc: 'Bring any old smartphone for an immediate physical valuation and instant cash discount.',
      icon: '💰',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 my-10">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 border border-indigo-900/60 shadow-2xl p-6 sm:p-10 text-white">
        {/* Ambient Decorative Glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Store Value Proposition */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
              <span>THE ARORA PHYSICAL SHOWROOM ADVANTAGE</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-tight">
              Prefer to Touch & Feel? <br />
              <span className="bg-gradient-to-r from-cyan-400 via-indigo-300 to-white bg-clip-text text-transparent">
                Visit Our Flagship Experience Store in Noida
              </span>
            </h2>

            <p className="text-slate-300 text-xs sm:text-sm leading-relaxed max-w-xl">
              Buy online with fast delivery, or visit our retail store in Sector 18 Noida to compare cameras, displays, and audio in person with our certified tech advisors.
            </p>

            {/* 4 Feature Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {storeFeatures.map((feat, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md flex items-start gap-3 hover:bg-white/10 transition"
                >
                  <span className="text-2xl shrink-0">{feat.icon}</span>
                  <div>
                    <h4 className="text-xs sm:text-sm font-extrabold text-white">
                      {feat.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Store Location Card & Action Buttons */}
          <div className="lg:col-span-5 bg-white/10 border border-white/15 rounded-3xl p-6 backdrop-blur-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-cyan-400" />
                <span className="font-extrabold text-sm text-white">Arora Communication Showroom</span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/40">
                Open Today
              </span>
            </div>

            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-slate-400 font-bold shrink-0">Address:</span>
                <span>Shop #14, Arora Complex, Main Commercial Market, Sector 18, Noida, UP 201301 (Near Metro Gate 2)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Open All 7 Days: 10:00 AM – 9:30 PM</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>+91 98765 43210 &bull; 0120-4567890</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <a
                href="https://maps.google.com/?q=Sector+18+Noida+Uttar+Pradesh"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
              >
                <span>Get Directions</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href="https://wa.me/919876543210?text=Hi%20Arora%20Communication%2C%20I%20want%20to%20check%20product%20availability%20at%20your%20Noida%20store."
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-1.5 shadow-lg transition"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp Store</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
