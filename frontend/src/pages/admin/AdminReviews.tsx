import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Star, MessageSquare } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export const AdminReviews: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        const res = await api.get('/reviews/admin/all');
        if (res.data.success) setReviews(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">Customer Reviews</h1>
        <p className="text-xs text-slate-500">Monitor product ratings, customer opinions, and verified buyer reviews</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase text-[10px]">
              <th className="py-3 px-4">Product</th>
              <th className="py-3 px-4">Customer</th>
              <th className="py-3 px-4">Rating</th>
              <th className="py-3 px-4">Review Title & Comment</th>
              <th className="py-3 px-4">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {reviews.map((r) => (
              <tr key={r.id} className="hover:bg-slate-50">
                <td className="py-3 px-4 font-bold text-slate-900 max-w-[180px] truncate">
                  {r.product?.name}
                </td>
                <td className="py-3 px-4">
                  <div className="font-semibold text-slate-800">{r.user?.name}</div>
                  <div className="text-[10px] text-slate-400">{r.user?.email}</div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center text-amber-400">
                    {[...Array(r.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                </td>
                <td className="py-3 px-4 max-w-sm">
                  {r.title && <div className="font-bold text-slate-800 mb-0.5">{r.title}</div>}
                  <p className="text-slate-600 leading-snug line-clamp-2">{r.comment}</p>
                </td>
                <td className="py-3 px-4 text-slate-400 text-[11px] whitespace-nowrap">
                  {formatDate(r.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
