import React from 'react';
import { Star, CheckCircle, Quote } from 'lucide-react';

export const CustomerReviewsSection: React.FC = () => {
  const reviews = [
    {
      id: 1,
      name: 'Vikram Malhotra',
      city: 'Delhi NCR',
      rating: 5,
      date: '2 days ago',
      title: 'Genuine Indian unit with official Apple warranty!',
      comment:
        'Ordered the iPhone 16 Pro Max from Arora Communication. The phone arrived in a sealed box with Indian retail barcodes and official warranty. Same day delivery in Noida. Unbeatable experience!',
      product: 'Apple iPhone 16 Pro Max',
    },
    {
      id: 2,
      name: 'Priya Iyer',
      city: 'Bengaluru',
      rating: 5,
      date: '1 week ago',
      title: 'Fast delivery & responsive customer support',
      comment:
        'Purchased the Sony WH-1000XM5 headphones. The sound cancellation is breathtaking. When I had a query regarding billing, their WhatsApp support resolved it within 5 minutes.',
      product: 'Sony WH-1000XM5 Headphones',
    },
    {
      id: 3,
      name: 'Amitabh Sharma',
      city: 'Gurugram',
      rating: 5,
      date: '2 weeks ago',
      title: 'Best smartphone deals & hassle-free payment',
      comment:
        'Got the Samsung Galaxy S25 Ultra with coupon ARORA10. Saved significant money compared to other big sites and got a genuine Spigen case bundled too. Arora Communication is now my go-to shop!',
      product: 'Samsung Galaxy S25 Ultra 5G',
    },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
        <div>
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
            What Our Customers Say
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Customer Reviews & Ratings
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Read authentic experiences from tech enthusiasts across India
          </p>
        </div>
        <div className="mt-3 sm:mt-0 flex items-center gap-2">
          <div className="flex text-amber-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-current" />
            ))}
          </div>
          <span className="text-sm font-bold text-slate-800">4.8 / 5.0</span>
          <span className="text-xs text-slate-400">(Over 5,000+ happy buyers)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm hover:shadow-md transition flex flex-col justify-between"
          >
            <div>
              {/* Star Rating & Verified Purchase */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex text-amber-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  <CheckCircle className="w-3 h-3 text-emerald-600" />
                  Verified Buyer
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mb-2">
                "{rev.title}"
              </h4>

              <p className="text-xs text-slate-600 leading-relaxed italic mb-4">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-slate-800">{rev.name}</p>
                <p className="text-[11px] text-slate-400">{rev.city} &bull; {rev.date}</p>
              </div>
              <span className="text-[10px] font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded max-w-[120px] truncate">
                {rev.product}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
