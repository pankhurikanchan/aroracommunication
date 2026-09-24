import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { Order, Address } from '../types';
import { formatINR, formatDate } from '../utils/formatters';
import {
  Package,
  MapPin,
  Heart,
  User as UserIcon,
  Shield,
  Trash2,
  Plus,
  Truck,
  ExternalLink,
  ShoppingCart,
  Calendar,
  CreditCard,
  CheckCircle,
} from 'lucide-react';

export const AccountPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get('tab') || 'orders';
  const { user, updateUser, logout } = useAuth();
  const { wishlistProducts, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  // Orders State
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Addresses State
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    addressLine: '',
    city: '',
    state: '',
    pinCode: '',
  });

  // Profile Form State
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [profileMsg, setProfileMsg] = useState<{ text: string; error?: boolean } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/account');
      return;
    }

    if (activeTab === 'orders') {
      setLoadingOrders(true);
      api.get('/orders')
        .then((res) => {
          if (res.data.success) setOrders(res.data.data);
        })
        .finally(() => setLoadingOrders(false));
    } else if (activeTab === 'addresses') {
      api.get('/users/addresses').then((res) => {
        if (res.data.success) setAddresses(res.data.data);
      });
    }
  }, [user, activeTab, navigate]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileMsg(null);
    try {
      const res = await api.put('/users/profile', {
        name,
        phone,
        password: password ? password : undefined,
      });
      if (res.data.success) {
        updateUser(res.data.data);
        setProfileMsg({ text: 'Profile updated successfully!' });
        setPassword('');
      }
    } catch (err: any) {
      setProfileMsg({ text: err.response?.data?.message || 'Error updating profile', error: true });
    }
  };

  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/users/addresses', addressForm);
      if (res.data.success) {
        setAddresses([res.data.data, ...addresses]);
        setShowAddressModal(false);
        setAddressForm({
          fullName: user?.name || '',
          phone: user?.phone || '',
          email: user?.email || '',
          addressLine: '',
          city: '',
          state: '',
          pinCode: '',
        });
      }
    } catch (err) {
      console.error('Error adding address:', err);
    }
  };

  const handleDeleteAddress = async (id: string) => {
    try {
      await api.delete(`/users/addresses/${id}`);
      setAddresses(addresses.filter((a) => a.id !== id));
    } catch (err) {
      console.error('Error deleting address:', err);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DELIVERED':
        return 'bg-emerald-100 text-emerald-800';
      case 'SHIPPED':
      case 'OUT_FOR_DELIVERY':
        return 'bg-blue-100 text-blue-800';
      case 'PROCESSING':
      case 'CONFIRMED':
        return 'bg-indigo-100 text-indigo-800';
      case 'CANCELLED':
        return 'bg-rose-100 text-rose-800';
      default:
        return 'bg-amber-100 text-amber-800';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Top Banner with User Greeting */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-md mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center font-black text-xl text-white shadow-lg">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <span className="text-cyan-300 text-xs font-bold uppercase tracking-wider">
              {user?.role === 'ADMIN' ? 'Store Administrator' : 'Valued Customer'}
            </span>
            <h1 className="text-xl sm:text-2xl font-extrabold">{user?.name}</h1>
            <p className="text-xs text-slate-300">{user?.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {user?.role === 'ADMIN' && (
            <Link
              to="/admin"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow transition"
            >
              Open Admin Dashboard
            </Link>
          )}
          <button
            onClick={logout}
            className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-sm transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-slate-200 mb-8 overflow-x-auto no-scrollbar gap-2 sm:gap-4 text-xs font-bold">
        <button
          onClick={() => setSearchParams({ tab: 'orders' })}
          className={`pb-3 px-3 sm:px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'orders'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'wishlist' })}
          className={`pb-3 px-3 sm:px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'wishlist'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          <span>Wishlist ({wishlistProducts.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'addresses' })}
          className={`pb-3 px-3 sm:px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'addresses'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <MapPin className="w-4 h-4" />
          <span>Saved Addresses ({addresses.length})</span>
        </button>

        <button
          onClick={() => setSearchParams({ tab: 'profile' })}
          className={`pb-3 px-3 sm:px-4 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
            activeTab === 'profile'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          <UserIcon className="w-4 h-4" />
          <span>Account Settings</span>
        </button>
      </div>

      {/* Tab 1: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="text-center py-12 text-slate-400 text-xs">Loading your orders...</div>
          ) : orders.length > 0 ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4 hover:border-slate-300 transition"
              >
                {/* Order Top Strip */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 text-sm">
                      #{order.orderNumber}
                    </span>
                    <span className="text-slate-400 ml-2">Placed on {formatDate(order.createdAt)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wide ${getStatusBadge(
                        order.status
                      )}`}
                    >
                      {order.status.replace(/_/g, ' ')}
                    </span>
                    <Link
                      to={`/order-confirmation/${order.orderNumber}`}
                      className="text-indigo-600 hover:underline font-bold flex items-center gap-1"
                    >
                      <span>Track Order</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

                {/* Ordered Items */}
                <div className="divide-y divide-slate-50 text-xs">
                  {order.items.map((item) => (
                    <div key={item.id} className="py-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {item.productImage && (
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-10 h-10 object-contain rounded-lg bg-slate-50 p-1 border border-slate-100"
                          />
                        )}
                        <div>
                          <p className="font-bold text-slate-800">{item.productName}</p>
                          <p className="text-slate-500">Qty: {item.quantity} &times; {formatINR(item.price)}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Order Total & Destination */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-slate-500">
                    Delivering to: <strong className="text-slate-800">{order.address?.fullName}</strong> ({order.address?.city})
                  </div>
                  <div className="flex items-center gap-3 font-bold text-sm">
                    <span className="text-slate-500 text-xs font-normal">Order Total:</span>
                    <span className="text-indigo-700">{formatINR(order.totalAmount)}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Package className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-sm mb-1">No Orders Yet</h3>
              <p className="text-xs text-slate-500 mb-4">You have not placed any orders with Arora Communication yet.</p>
              <Link to="/products" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                Start Shopping
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlistProducts.map((p) => (
                <div
                  key={p.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-4 shadow-sm flex flex-col justify-between"
                >
                  <Link to={`/products/${p.slug}`} className="block relative pt-[80%] bg-slate-50 rounded-xl overflow-hidden mb-3">
                    <img
                      src={p.images?.[0]?.url}
                      alt={p.name}
                      className="absolute inset-0 w-full h-full object-contain p-3"
                    />
                  </Link>

                  <div className="space-y-1 mb-4">
                    <span className="text-[10px] font-bold text-indigo-600 uppercase">{p.brand?.name}</span>
                    <Link to={`/products/${p.slug}`} className="text-xs font-bold text-slate-800 line-clamp-2 hover:text-indigo-600">
                      {p.name}
                    </Link>
                    <div className="text-sm font-extrabold text-slate-900 pt-1">
                      {formatINR(p.discountPrice || p.price)}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => addToCart(p.id, null, 1)}
                      className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Move to Cart
                    </button>
                    <button
                      onClick={() => toggleWishlist(p.id)}
                      className="p-2 rounded-xl border border-slate-200 text-rose-500 hover:bg-rose-50"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <Heart className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-sm mb-1">Your Wishlist is Empty</h3>
              <p className="text-xs text-slate-500 mb-4">Save products you love and track their prices anytime.</p>
              <Link to="/products" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold">
                Explore Products
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Saved Addresses */}
      {activeTab === 'addresses' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Saved Delivery Addresses
            </h2>
            <button
              onClick={() => setShowAddressModal(true)}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Address</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {addresses.map((a) => (
              <div
                key={a.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-2 text-xs relative"
              >
                <div className="flex items-center justify-between font-bold text-slate-900">
                  <span className="text-sm">{a.fullName}</span>
                  {a.isDefault && (
                    <span className="bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded text-[10px] font-bold">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-slate-600">{a.addressLine}</p>
                <p className="text-slate-600">{a.city}, {a.state} - {a.pinCode}</p>
                <p className="text-slate-500 pt-1">Mobile: {a.phone}</p>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    onClick={() => handleDeleteAddress(a.id)}
                    className="text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 text-[11px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Address Modal */}
          {showAddressModal && (
            <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <h3 className="font-bold text-base text-slate-900">Add New Shipping Address</h3>
                  <button onClick={() => setShowAddressModal(false)} className="text-slate-400 hover:text-slate-700">
                    &times;
                  </button>
                </div>

                <form onSubmit={handleAddAddress} className="space-y-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Phone</label>
                      <input
                        type="tel"
                        required
                        value={addressForm.phone}
                        onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={addressForm.email}
                        onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      value={addressForm.addressLine}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-300"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">City</label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">State</label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                    <div>
                      <label className="font-semibold text-slate-700 block mb-1">PIN Code</label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={addressForm.pinCode}
                        onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                        className="w-full p-2.5 rounded-xl border border-slate-300"
                      />
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Profile & Account Settings */}
      {activeTab === 'profile' && (
        <div className="max-w-xl bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm space-y-6">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider pb-3 border-b border-slate-100">
            Edit Account Profile
          </h2>

          {profileMsg && (
            <div
              className={`p-3 rounded-xl text-xs font-semibold ${
                profileMsg.error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'
              }`}
            >
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-400 text-xs cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400">Email cannot be changed directly</span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Phone Number</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+91 98765 43210"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="pt-2 border-t border-slate-100">
              <label className="font-semibold text-slate-700 block mb-1">New Password (leave empty to keep current)</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 6 characters"
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition"
            >
              Save Profile Changes
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
