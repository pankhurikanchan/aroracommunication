import React from 'react';
import { Star, CheckCircle, Quote, ThumbsUp, Sparkles } from 'lucide-react';

export const CustomerReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Vikram Malhotra',
      city: 'Noida Sector 50, Delhi-NCR',
      rating: 5,
      date: '2 days ago',
      avatar: 'VM',
      avatarBg: 'from-blue-600 to-indigo-600',
      title: 'Genuine Indian retail unit with official Apple warranty!',
      comment:
        'Ordered the iPhone 16 Pro Max from Arora Communication. The phone arrived in a sealed box with Indian retail barcodes and official AppleCare warranty active immediately. Same day delivery in Noida. Unbeatable experience!',
      product: 'Apple iPhone 16 Pro Max (Desert Titanium)',
      verifiedPurchase: true,
      helpfulCount: 38,
    },
    {
      id: 2,
      name: 'Priya Iyer',
      city: 'Indiranagar, Bengaluru',
      rating: 5,
      date: '1 week ago',
      avatar: 'PI',
      avatarBg: 'from-purple-600 to-pink-600',
      title: 'Fast delivery & prompt WhatsApp customer support',
      comment:
        'Purchased the Sony WH-1000XM5 headphones. The noise cancellation is phenomenal. When I had a query regarding GST billing for my firm, their WhatsApp support team resolved it within 5 minutes. Highly recommended!',
      product: 'Sony WH-1000XM5 ANC Headphones',
      verifiedPurchase: true,
      helpfulCount: 24,
    },
    {
      id: 3,
      name: 'Amitabh Sharma',
      city: 'DLF CyberCity, Gurugram',
      rating: 5,
      date: '2 weeks ago',
      avatar: 'AS',
      avatarBg: 'from-amber-600 to-orange-600',
      title: 'Best smartphone deals & hassle-free payment',
      comment:
        'Got the Samsung Galaxy S25 Ultra with coupon ARORA10. Saved significant money compared to other big platforms, and got a genuine Spigen rugged case bundled. Arora Communication is now my go-to electronics retailer!',
      product: 'Samsung Galaxy S25 Ultra 5G (Titanium Gray)',
      verifiedPurchase: true,
      helpfulCount: 42,
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* Header with ratings summary */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>Real Customer Experiences</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Loved by 5,000+ Tech Enthusiasts
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Read verified reviews from customers across Noida, Delhi-NCR, and Pan-India
          </p>
        </div>

        {/* Aggregate Score Pill */}
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-200/90 shadow-sm self-start md:self-auto">
          <div className="text-2xl font-black text-slate-900">4.9</div>
          <div>
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <div className="text-[10px] text-slate-500 font-semibold mt-0.5">
              Based on 3,840+ verified buyer ratings
            </div>
          </div>
        </div>
      </div>

      {/* Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="group relative bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1"
          >
            <div>
              {/* Star Rating & Verified Pill */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Verified Purchase
                </span>
              </div>

              {/* Title & Comment */}
              <h4 className="text-sm font-extrabold text-slate-900 mb-2 leading-snug">
                "{rev.title}"
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed italic mb-4 font-normal">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-9 h-9 rounded-full bg-gradient-to-tr ${rev.avatarBg} text-white font-extrabold text-xs flex items-center justify-center shadow-md`}
                >
                  {rev.avatar}
                </div>
                <div>
                  <p className="text-xs font-extrabold text-slate-800">{rev.name}</p>
                  <p className="text-[10px] text-slate-400 font-medium">
                    {rev.city} &bull; {rev.date}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-semibold bg-slate-50 px-2 py-1 rounded-lg">
                <ThumbsUp className="w-3 h-3 text-indigo-500" />
                <span>{rev.helpfulCount}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
