import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Flame, Clock, Zap, ArrowRight, ShieldCheck, Tag } from 'lucide-react';
import { formatINR } from '../../utils/formatters';

export const FlashDealBanner: React.FC = () => {
  // Live countdown timer state (hours, minutes, seconds)
  const [timeLeft, setTimeLeft] = useState({
    hours: 7,
    minutes: 42,
    seconds: 18,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: 59, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return { hours: 8, minutes: 0, seconds: 0 }; // reset daily deal
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDigit = (n: number) => n.toString().padStart(2, '0');

  return (
    <section className="max-w-7xl mx-auto px-4 my-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950 via-slate-900 to-indigo-950 border border-rose-500/30 shadow-2xl p-6 sm:p-8">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
          {/* Left Column: Deal Header & Countdown */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-400/40 text-rose-300 text-xs font-black uppercase tracking-wider mb-3">
              <Flame className="w-3.5 h-3.5 fill-rose-400 text-rose-400 animate-pulse" />
              <span>FLASH DEAL OF THE DAY &bull; EXCLUSIVE DISCOUNTS</span>
            </div>

            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight leading-snug">
              Save Up to 40% on Premium Audio & Wireless Power
            </h3>

            <p className="text-slate-300 text-xs sm:text-sm mt-2 max-w-xl leading-relaxed">
              Special daily clearance on Apple MagSafe chargers, boAt active noise cancelling TWS, and Spigen rugged cases. All backed by manufacturer warranty.
            </p>

            {/* Countdown Box */}
            <div className="mt-4 flex items-center justify-center lg:justify-start gap-2">
              <span className="text-xs font-bold text-slate-300 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" /> Offer Ends In:
              </span>
              <div className="flex items-center gap-1.5 font-mono text-white text-xs sm:text-sm font-extrabold">
                <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 shadow-inner">
                  {formatDigit(timeLeft.hours)}<span className="text-[10px] text-slate-400 font-sans ml-0.5">h</span>
                </div>
                <span>:</span>
                <div className="px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700/80 shadow-inner">
                  {formatDigit(timeLeft.minutes)}<span className="text-[10px] text-slate-400 font-sans ml-0.5">m</span>
                </div>
                <span>:</span>
                <div className="px-2.5 py-1.5 rounded-lg bg-rose-900/80 border border-rose-500/80 text-rose-200 shadow-inner animate-pulse">
                  {formatDigit(timeLeft.seconds)}<span className="text-[10px] text-rose-400 font-sans ml-0.5">s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Coupon Badge & Claim CTA */}
          <div className="shrink-0 flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            {/* Coupon Code Pill */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md text-center sm:text-left w-full sm:w-auto">
              <div className="text-[10px] font-extrabold text-amber-400 uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1 mb-1">
                <Tag className="w-3 h-3" /> EXTRA 10% COUPON
              </div>
              <div className="font-mono font-black text-lg text-white bg-slate-900/80 px-3 py-1 rounded-lg border border-dashed border-amber-400/50 inline-block tracking-widest">
                ARORA10
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Apply at checkout on any product
              </div>
            </div>

            {/* Action Button */}
            <Link
              to="/deals"
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-gradient-to-r from-rose-500 via-amber-500 to-rose-600 hover:from-rose-600 hover:to-amber-600 text-white font-black text-sm shadow-xl shadow-rose-600/30 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <span>Explore All Deals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
