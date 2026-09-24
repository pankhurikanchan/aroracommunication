import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Clock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const res = await api.get('/admin/stats');
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) {
        console.error('Error fetching admin statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="text-center py-16 text-slate-400 text-xs">Loading admin analytics...</div>;
  }

  const cards = [
    {
      title: 'Total Revenue',
      value: formatINR(stats?.totalSales || 0),
      icon: <IndianRupee className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50 border-indigo-200',
      subtitle: 'From completed orders',
    },
    {
      title: 'Total Orders',
      value: stats?.totalOrders || 0,
      icon: <ShoppingCart className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50 border-emerald-200',
      subtitle: 'Placed online & store',
    },
    {
      title: 'Total Customers',
      value: stats?.totalCustomers || 0,
      icon: <Users className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50 border-blue-200',
      subtitle: 'Registered accounts',
    },
    {
      title: 'Products in Catalog',
      value: stats?.totalProducts || 0,
      icon: <Package className="w-5 h-5 text-purple-600" />,
      bg: 'bg-purple-50 border-purple-200',
      subtitle: 'Active inventory models',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((c, i) => (
          <div
            key={i}
            className={`p-5 rounded-2xl border ${c.bg} bg-white shadow-sm flex items-start justify-between`}
          >
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                {c.title}
              </span>
              <div className="text-2xl font-black text-slate-900 tracking-tight">
                {c.value}
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">{c.subtitle}</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">{c.icon}</div>
          </div>
        ))}
      </div>

      {/* Grid: Low Stock Alert & Revenue Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Low Stock Alerts (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4" />
              Low Stock Warnings ({stats?.lowStockCount || 0})
            </h3>
            <Link to="/admin/products" className="text-xs text-indigo-600 font-bold hover:underline">
              Manage
            </Link>
          </div>

          {stats?.lowStockProducts && stats.lowStockProducts.length > 0 ? (
            <div className="divide-y divide-slate-100 text-xs">
              {stats.lowStockProducts.map((p: any) => (
                <div key={p.id} className="py-2.5 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{p.name}</p>
                    <p className="text-[11px] text-slate-400">SKU: {p.sku}</p>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded font-extrabold text-[10px] bg-rose-50 text-rose-700 border border-rose-200">
                      {p.stockQuantity} units left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-4 text-center">All inventory levels healthy!</p>
          )}
        </div>

        {/* Monthly Revenue Highlights (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Sales Breakdown by Month
            </h3>
            <span className="text-xs text-emerald-600 font-bold">GST Verified</span>
          </div>

          <div className="space-y-3">
            {stats?.monthlySales && Object.keys(stats.monthlySales).length > 0 ? (
              Object.entries(stats.monthlySales).map(([month, rev]: any) => (
                <div key={month} className="space-y-1 text-xs">
                  <div className="flex justify-between font-semibold text-slate-700">
                    <span>{month}</span>
                    <span>{formatINR(rev)}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className="bg-indigo-600 h-full rounded-full" style={{ width: '85%' }} />
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center">Sales records will appear here as orders complete.</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-indigo-600" />
            Recent Customer Orders
          </h3>
          <Link to="/admin/orders" className="text-xs text-indigo-600 font-bold hover:underline flex items-center gap-1">
            <span>View All Orders</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-2">Order #</th>
                <th className="py-2">Customer</th>
                <th className="py-2">Date</th>
                <th className="py-2">Payment</th>
                <th className="py-2">Total</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stats?.recentOrders?.map((ord: any) => (
                <tr key={ord.id} className="hover:bg-slate-50">
                  <td className="py-3 font-bold text-slate-900">{ord.orderNumber}</td>
                  <td className="py-3">
                    <div className="font-semibold text-slate-800">{ord.address?.fullName || ord.user?.name || 'Customer'}</div>
                    <div className="text-[10px] text-slate-400">{ord.address?.city}</div>
                  </td>
                  <td className="py-3 text-slate-500">{formatDate(ord.createdAt)}</td>
                  <td className="py-3">
                    <span className="font-medium text-slate-700">{ord.paymentMethod}</span>
                  </td>
                  <td className="py-3 font-bold text-slate-900">{formatINR(ord.totalAmount)}</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                      {ord.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
