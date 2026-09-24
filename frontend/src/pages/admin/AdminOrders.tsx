import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { formatINR, formatDate } from '../../utils/formatters';
import {
  ShoppingCart,
  Search,
  Truck,
  CheckCircle,
  X,
  Edit2,
  ExternalLink,
} from 'lucide-react';

const STATUS_LIST: OrderStatus[] = [
  'ORDER_PLACED',
  'CONFIRMED',
  'PROCESSING',
  'SHIPPED',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
];

export const AdminOrders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [search, setSearch] = useState('');

  // Selected Order for Status Update
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('ORDER_PLACED');
  const [newPaymentStatus, setNewPaymentStatus] = useState<string>('PENDING');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params: any = {};
      if (statusFilter) params.status = statusFilter;
      if (search) params.search = search;

      const res = await api.get('/orders/admin', { params });
      if (res.data.success) {
        setOrders(res.data.data.orders);
      }
    } catch (err) {
      console.error('Error fetching admin orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter, search]);

  const handleOpenStatusModal = (ord: Order) => {
    setSelectedOrder(ord);
    setNewStatus(ord.status);
    setNewPaymentStatus(ord.paymentStatus);
    setTrackingNumber(ord.trackingNumber || '');
  };

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    try {
      setUpdating(true);
      const res = await api.put(`/orders/admin/${selectedOrder.id}/status`, {
        status: newStatus,
        paymentStatus: newPaymentStatus,
        trackingNumber: trackingNumber ? trackingNumber : undefined,
      });

      if (res.data.success) {
        setSelectedOrder(null);
        fetchOrders();
      }
    } catch (err) {
      console.error('Error updating status:', err);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Order Fulfillment & Shipping
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Process orders, assign courier tracking numbers, and update shipment statuses
          </p>
        </div>
      </div>

      {/* Filters Strip */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative flex-1 w-full">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order number or customer name..."
            className="w-full pl-8 pr-3 py-2 border border-slate-300 rounded-xl focus:outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-slate-300 rounded-xl px-3 py-2 bg-white text-slate-700 font-semibold w-full sm:w-auto"
        >
          <option value="">All Statuses</option>
          {STATUS_LIST.map((st) => (
            <option key={st} value={st}>
              {st.replace(/_/g, ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                <th className="py-3 px-4">Order Details</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Update</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">Loading orders...</td>
                </tr>
              ) : orders.length > 0 ? (
                orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50 transition">
                    <td className="py-3 px-4">
                      <span className="font-extrabold text-slate-900 block">{ord.orderNumber}</span>
                      <span className="text-[11px] text-slate-400">{formatDate(ord.createdAt)}</span>
                      {ord.trackingNumber && (
                        <span className="text-[10px] text-indigo-600 font-bold block mt-0.5">
                          Waybill: {ord.trackingNumber}
                        </span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-800">{ord.address?.fullName || ord.user?.name || 'Guest'}</p>
                      <p className="text-[11px] text-slate-500">{ord.address?.city}, {ord.address?.state}</p>
                      <p className="text-[11px] text-slate-400">{ord.address?.phone}</p>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-700">{ord.items?.length} items</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-bold text-slate-900">{formatINR(ord.totalAmount)}</span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-medium text-slate-800 block">{ord.paymentMethod}</span>
                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          ord.paymentStatus === 'COMPLETED'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-indigo-50 text-indigo-700">
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => handleOpenStatusModal(ord)}
                        className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs inline-flex items-center gap-1 transition"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>Status</span>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Update Order Status Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-base text-slate-900">
                  Update Order #{selectedOrder.orderNumber}
                </h3>
                <p className="text-xs text-slate-400">Customer: {selectedOrder.address?.fullName}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Shipment Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                >
                  {STATUS_LIST.map((st) => (
                    <option key={st} value={st}>
                      {st.replace(/_/g, ' ')}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Payment Status *</label>
                <select
                  value={newPaymentStatus}
                  onChange={(e) => setNewPaymentStatus(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-300 bg-white font-bold"
                >
                  <option value="PENDING">PENDING</option>
                  <option value="COMPLETED">COMPLETED</option>
                  <option value="FAILED">FAILED</option>
                  <option value="REFUNDED">REFUNDED</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Courier Tracking / Waybill Number</label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DELHIVERY-98172648 or BLUEDART-48192"
                  className="w-full p-2.5 rounded-xl border border-slate-300"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-slate-300 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow"
                >
                  {updating ? 'Updating...' : 'Save Status'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
