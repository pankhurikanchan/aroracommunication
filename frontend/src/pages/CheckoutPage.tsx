import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import { formatINR } from '../utils/formatters';
import { Address, PaymentMethod } from '../types';
import {
  CheckCircle2,
  MapPin,
  CreditCard,
  Truck,
  ShieldCheck,
  Lock,
  ArrowRight,
  User,
  QrCode,
  Building,
  Banknote,
  Check,
  AlertCircle,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { user } = useAuth();
  const { cart, subtotal, discount, deliveryCharge, finalTotal, coupon, clearCart } = useCart();
  const navigate = useNavigate();

  // Active Step (1: Auth check, 2: Address, 3: Summary, 4: Payment)
  const [currentStep, setCurrentStep] = useState<number>(user ? 2 : 1);

  // Address State
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [useNewAddress, setUseNewAddress] = useState<boolean>(false);

  const [addressForm, setAddressForm] = useState({
    fullName: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    addressLine: '',
    city: '',
    state: '',
    pinCode: '',
  });

  // Payment Method State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch saved addresses if logged in
  useEffect(() => {
    if (user) {
      api.get('/users/addresses').then((res) => {
        if (res.data.success && res.data.data.length > 0) {
          setSavedAddresses(res.data.data);
          const def = res.data.data.find((a: Address) => a.isDefault) || res.data.data[0];
          setSelectedAddressId(def.id);
        } else {
          setUseNewAddress(true);
        }
      }).catch(() => {
        setUseNewAddress(true);
      });
    } else {
      setUseNewAddress(true);
    }
  }, [user]);

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Your Cart is Empty</h2>
        <p className="text-xs text-slate-500 mb-6">Add items before accessing checkout.</p>
        <Link to="/products" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-bold text-xs">
          Browse Products
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    try {
      setPlacingOrder(true);
      setErrorMessage(null);

      // Validate address
      let orderAddressData: any = {};
      if (selectedAddressId && !useNewAddress) {
        orderAddressData.addressId = selectedAddressId;
      } else {
        if (
          !addressForm.fullName ||
          !addressForm.phone ||
          !addressForm.email ||
          !addressForm.addressLine ||
          !addressForm.city ||
          !addressForm.state ||
          !addressForm.pinCode
        ) {
          setErrorMessage('Please complete all shipping address fields');
          setCurrentStep(2);
          setPlacingOrder(false);
          return;
        }
        orderAddressData.shippingAddress = addressForm;
      }

      // Prepare order payload
      const orderPayload = {
        ...orderAddressData,
        items: cart.items.map((i) => ({
          productId: i.productId,
          variantId: i.variantId || null,
          quantity: i.quantity,
          price: i.price,
          productName: i.product?.name || 'Electronics Product',
          productImage: i.product?.images?.[0]?.url || null,
        })),
        paymentMethod,
        couponCode: coupon?.code || null,
        notes: `Selected payment via ${paymentMethod}`,
      };

      const res = await api.post('/orders', orderPayload);

      if (res.data.success) {
        const order = res.data.data;
        await clearCart();
        navigate(`/order-confirmation/${order.orderNumber}`);
      } else {
        setErrorMessage(res.data.message || 'Failed to place order');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Error processing your order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const steps = [
    { number: 1, title: 'Login' },
    { number: 2, title: 'Shipping Address' },
    { number: 3, title: 'Order Summary' },
    { number: 4, title: 'Payment' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Checkout Progress Stepper */}
      <div className="max-w-3xl mx-auto mb-10">
        <div className="flex items-center justify-between">
          {steps.map((st, idx) => (
            <React.Fragment key={st.number}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition ${
                    currentStep > st.number
                      ? 'bg-emerald-600 text-white'
                      : currentStep === st.number
                      ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 shadow-md'
                      : 'bg-slate-200 text-slate-500'
                  }`}
                >
                  {currentStep > st.number ? <Check className="w-4 h-4" /> : st.number}
                </div>
                <span
                  className={`text-[11px] font-semibold mt-1.5 ${
                    currentStep >= st.number ? 'text-slate-900' : 'text-slate-400'
                  }`}
                >
                  {st.title}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 -mt-4 transition ${
                    currentStep > idx + 1 ? 'bg-emerald-600' : 'bg-slate-200'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Steps & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Step Checkout Actions (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Account Login Verification */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h2 className="text-base font-bold text-slate-900">Account Information</h2>
              </div>
              {user && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Logged In
                </span>
              )}
            </div>

            <div className="pt-4 text-xs">
              {user ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-800">{user.name}</p>
                    <p className="text-slate-500">{user.email} &bull; {user.phone || 'No phone saved'}</p>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-400">Authenticated</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-slate-600">
                    You can checkout as a guest or sign in for one-click ordering and tracking.
                  </p>
                  <div className="flex gap-3">
                    <Link
                      to="/login?redirect=/checkout"
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs"
                    >
                      Sign In to Account
                    </Link>
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 border border-slate-300 hover:bg-slate-50 rounded-xl font-bold text-slate-700 text-xs"
                    >
                      Continue as Guest
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h2 className="text-base font-bold text-slate-900">Shipping Address</h2>
              </div>
              <MapPin className="w-4 h-4 text-indigo-600" />
            </div>

            <div className="pt-4 space-y-4">
              {/* Existing Saved Addresses if any */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                    Select a Saved Address:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setUseNewAddress(false);
                        }}
                        className={`p-4 rounded-xl border cursor-pointer transition text-xs ${
                          selectedAddressId === addr.id && !useNewAddress
                            ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-200 shadow-sm'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between font-bold text-slate-900 mb-1">
                          <span>{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-slate-200 px-1.5 py-0.5 rounded">Default</span>
                          )}
                        </div>
                        <p className="text-slate-600">{addr.addressLine}</p>
                        <p className="text-slate-600">{addr.city}, {addr.state} - {addr.pinCode}</p>
                        <p className="text-slate-500 mt-1">Mobile: {addr.phone}</p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setUseNewAddress(!useNewAddress)}
                      className="text-xs font-bold text-indigo-600 hover:underline"
                    >
                      {useNewAddress ? 'Use Saved Address' : '+ Add / Enter New Delivery Address'}
                    </button>
                  </div>
                </div>
              )}

              {/* Address Form (either guest or new address) */}
              {(useNewAddress || savedAddresses.length === 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-2">
                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">Mobile Number (for Courier SMS) *</label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      placeholder="e.g. 9876543210"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-600 font-semibold block mb-1">Email Address (for Order Updates) *</label>
                    <input
                      type="email"
                      required
                      value={addressForm.email}
                      onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-600 font-semibold block mb-1">Street Address / House / Flat No. *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.addressLine}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                      placeholder="e.g. Flat 402, Royal Residency, Sector 18"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">City / Town *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      placeholder="e.g. Noida / New Delhi"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-600 font-semibold block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      placeholder="e.g. Uttar Pradesh / Delhi"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-600 font-semibold block mb-1">PIN Code (6 digits) *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={addressForm.pinCode}
                      onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                      placeholder="e.g. 201301"
                      className="w-full p-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-xs hover:bg-indigo-700 transition"
                >
                  Proceed to Review &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Order Summary Preview */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <h2 className="text-base font-bold text-slate-900">Order Summary ({cart.items.length} items)</h2>
              </div>
              <Truck className="w-4 h-4 text-indigo-600" />
            </div>

            <div className="pt-4 divide-y divide-slate-100 text-xs">
              {cart.items.map((it) => (
                <div key={it.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img
                      src={it.product?.images?.[0]?.url}
                      alt={it.product?.name}
                      className="w-10 h-10 object-contain rounded bg-slate-50 p-1 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-bold text-slate-800 truncate">{it.product?.name}</p>
                      <p className="text-[11px] text-slate-500">Qty: {it.quantity} &times; {formatINR(it.price)}</p>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900 shrink-0">
                    {formatINR(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Payment Options */}
          <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center">
                  4
                </div>
                <h2 className="text-base font-bold text-slate-900">Payment Method</h2>
              </div>
              <Lock className="w-4 h-4 text-emerald-600" />
            </div>

            <div className="pt-4 space-y-3">
              {/* UPI Option */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'UPI'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'UPI'}
                  onChange={() => setPaymentMethod('UPI')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <QrCode className="w-4 h-4 text-indigo-600" />
                      UPI (Google Pay, PhonePe, Paytm, BHIM)
                    </span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      FASTEST
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">Instant approval with zero transaction fees</p>

                  {paymentMethod === 'UPI' && (
                    <div className="mt-3 pt-3 border-t border-indigo-100">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="Enter UPI ID (e.g. mobile@okhdfcbank / yourname@upi)"
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                      />
                    </div>
                  )}
                </div>
              </label>

              {/* Credit Card Option */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CREDIT_CARD'}
                  onChange={() => setPaymentMethod('CREDIT_CARD')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-blue-600" />
                      Credit Card (Visa, MasterCard, RuPay, Diners)
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">Safe gateway encryption. Card details are NEVER stored in our database.</p>
                </div>
              </label>

              {/* Debit Card Option */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'DEBIT_CARD'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'DEBIT_CARD'}
                  onChange={() => setPaymentMethod('DEBIT_CARD')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <CreditCard className="w-4 h-4 text-purple-600" />
                      Debit Card / ATM Card
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">Direct bank debit with verified OTP.</p>
                </div>
              </label>

              {/* Net Banking */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'NET_BANKING'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'NET_BANKING'}
                  onChange={() => setPaymentMethod('NET_BANKING')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-cyan-600" />
                      Net Banking (50+ Indian Banks)
                    </span>
                  </div>
                  {paymentMethod === 'NET_BANKING' && (
                    <div className="mt-3 pt-3 border-t border-indigo-100">
                      <select
                        value={selectedBank}
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-slate-300 bg-white text-xs"
                      >
                        <option>HDFC Bank</option>
                        <option>State Bank of India (SBI)</option>
                        <option>ICICI Bank</option>
                        <option>Axis Bank</option>
                        <option>Kotak Mahindra Bank</option>
                        <option>Punjab National Bank</option>
                      </select>
                    </div>
                  )}
                </div>
              </label>

              {/* Cash on Delivery */}
              <label
                className={`p-4 rounded-xl border flex items-start gap-3 cursor-pointer transition ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-2 ring-indigo-200'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === 'CASH_ON_DELIVERY'}
                  onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                  className="mt-1 text-indigo-600 focus:ring-indigo-500"
                />
                <div className="flex-1 text-xs">
                  <div className="flex items-center justify-between font-bold text-slate-900">
                    <span className="flex items-center gap-1.5">
                      <Banknote className="w-4 h-4 text-emerald-600" />
                      Cash on Delivery (Pay at Doorstep)
                    </span>
                  </div>
                  <p className="text-slate-500 mt-1">Pay with cash or UPI QR directly to the courier agent upon arrival.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Total & Place Order Button (4 cols) */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-extrabold text-slate-900 pb-3 border-b border-slate-100 uppercase tracking-wider">
              Payment Summary
            </h3>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900">{formatINR(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount ({coupon?.code})</span>
                  <span>- {formatINR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-600">
                <span>Delivery Charges</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-600 font-bold">FREE</span>
                  ) : (
                    formatINR(deliveryCharge)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between items-baseline text-slate-900">
                <span className="text-sm font-bold">Total Payable</span>
                <span className="text-2xl font-black text-indigo-700">{formatINR(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-700 hover:to-teal-800 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {placingOrder ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Place Order &bull; {formatINR(finalTotal)}</span>
                </>
              )}
            </button>

            <div className="pt-2 border-t border-slate-100 space-y-2 text-[11px] text-slate-500">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                <span>100% Purchase Protection by Arora Communication</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-cyan-600" />
                <span>Same day dispatch for orders before 2:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
