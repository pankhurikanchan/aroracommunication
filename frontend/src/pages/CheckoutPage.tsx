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
  Copy,
  CheckCheck,
  Smartphone,
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
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

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

      // Prepare order payload notes
      let paymentNotes = `Selected payment via ${paymentMethod}`;
      if (paymentMethod === 'UPI') {
        paymentNotes = `Direct UPI to Owner (ARORA MOBILES & GADGET HUB / 7300791957@kotak). Total: ${formatINR(finalTotal)}. Verified direct order.`;
      } else if (paymentMethod === 'NET_BANKING') {
        paymentNotes = `Direct Bank Transfer to Kotak A/C 5949282265 (IFSC: KKBK0005321). Total: ${formatINR(finalTotal)}. Verified direct order.`;
      }

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
        notes: paymentNotes,
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

  const upiPayLink = `upi://pay?pa=7300791957@kotak&pn=ARORA%20MOBILES%20AND%20GADGET%20HUB&am=${finalTotal}&cu=INR&tn=Arora%20Order`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(upiPayLink)}`;

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

            <div className="pt-4 space-y-4">
              {/* Option 1: Direct UPI to Store Owner */}
              <label
                className={`p-4 sm:p-5 rounded-2xl border transition block cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 font-bold text-slate-900">
                      <span className="flex items-center gap-2 text-sm">
                        <QrCode className="w-4 h-4 text-indigo-600 shrink-0" />
                        Direct UPI Transfer to Arora Mobiles
                      </span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        ⚡ Recommended & Fastest
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">
                      Pay directly to <strong>ARORA MOBILES & GADGET HUB</strong> using Google Pay, PhonePe, Paytm, BHIM, Cred, or any UPI app.
                    </p>
                  </div>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="mt-4 pt-4 border-t border-indigo-100/80 space-y-4">
                    {/* Mobile 1-Tap Intent Button */}
                    <a
                      href={upiPayLink}
                      className="sm:hidden flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Tap to Pay {formatINR(finalTotal)} in UPI App</span>
                    </a>

                    {/* QR Code & Copyable IDs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white p-4 rounded-xl border border-indigo-100 shadow-xs">
                      {/* Left: Dynamic QR Code */}
                      <div className="md:col-span-5 flex flex-col items-center text-center">
                        <div className="p-2 bg-white rounded-2xl border-2 border-indigo-200 shadow-sm relative group">
                          <img
                            src={qrCodeUrl}
                            alt="Scan UPI QR Code"
                            className="w-40 h-40 object-contain rounded-lg"
                          />
                        </div>
                        <span className="text-[11px] font-bold text-slate-700 mt-2 block">
                          Scan with Any UPI App
                        </span>
                        <span className="text-[10px] text-indigo-600 font-semibold">
                          Amount preloaded: {formatINR(finalTotal)}
                        </span>
                      </div>

                      {/* Right: Copyable UPI IDs */}
                      <div className="md:col-span-7 space-y-2.5">
                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                              Primary Kotak UPI ID
                            </span>
                            <span className="font-mono font-bold text-slate-900 text-xs truncate block">
                              7300791957@kotak
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCopy('7300791957@kotak', 'kotak-upi');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center gap-1.5 transition shrink-0"
                          >
                            {copiedKey === 'kotak-upi' ? (
                              <>
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                              Alternate PhonePe UPI ID
                            </span>
                            <span className="font-mono font-bold text-slate-900 text-xs truncate block">
                              Phonepe7300791957-2@axl
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCopy('Phonepe7300791957-2@axl', 'phonepe-upi');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] flex items-center gap-1.5 transition shrink-0"
                          >
                            {copiedKey === 'phonepe-upi' ? (
                              <>
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="px-1 text-[11px] text-slate-500">
                          <span>Payee Name: </span>
                          <strong className="text-slate-800">ARORA MOBILES & GADGET HUB</strong>
                        </div>
                      </div>
                    </div>

                    {/* Reassurance Banner: No 12-digit proof required! */}
                    <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-900 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-relaxed">
                        <strong className="text-emerald-950 font-bold block mb-0.5">
                          ✓ No 12-digit UTR or Reference Number Required!
                        </strong>
                        Simply complete the payment in your UPI app or scan the QR code, then click <strong>"Place Order"</strong> below. Our store admin team matches the incoming transaction with your order total in real-time.
                      </div>
                    </div>
                  </div>
                )}
              </label>

              {/* Option 2: Direct Bank Account Transfer */}
              <label
                className={`p-4 sm:p-5 rounded-2xl border transition block cursor-pointer ${
                  paymentMethod === 'NET_BANKING'
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'NET_BANKING'}
                    onChange={() => setPaymentMethod('NET_BANKING')}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 font-bold text-slate-900">
                      <span className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-blue-600 shrink-0" />
                        Direct Bank Transfer (IMPS / NEFT / RTGS to Kotak Bank)
                      </span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-extrabold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        Kotak Mahindra Bank
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">
                      Transfer directly to the official current bank account of Arora Mobiles & Gadget Hub.
                    </p>
                  </div>
                </div>

                {paymentMethod === 'NET_BANKING' && (
                  <div className="mt-4 pt-4 border-t border-indigo-100/80 space-y-4">
                    <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Account Holder Name
                          </span>
                          <span className="font-bold text-slate-900 text-xs">
                            ARORA MOBILES & GADGET HUB
                          </span>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              Account Number
                            </span>
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              5949282265
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCopy('5949282265', 'acc-num');
                            }}
                            className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center gap-1 transition"
                          >
                            {copiedKey === 'acc-num' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold text-slate-400 block">
                              IFSC Code
                            </span>
                            <span className="font-mono font-bold text-slate-900 text-xs">
                              KKBK0005321
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCopy('KKBK0005321', 'ifsc-code');
                            }}
                            className="px-2.5 py-1 rounded bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[10px] flex items-center gap-1 transition"
                          >
                            {copiedKey === 'ifsc-code' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>

                        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">
                            Bank & Branch
                          </span>
                          <span className="font-bold text-slate-900 text-xs">
                            Kotak Mahindra Bank, Bareilly Branch
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-start gap-2.5">
                      <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                      <div className="text-[11px] leading-relaxed">
                        <strong>Hassle-Free Bank Order:</strong> Transfer <strong>{formatINR(finalTotal)}</strong> from your bank app, then click <strong>"Place Order"</strong> below. No deposit slip or transaction upload needed.
                      </div>
                    </div>
                  </div>
                )}
              </label>

              {/* Option 3: Cash on Delivery */}
              <label
                className={`p-4 rounded-2xl border transition block cursor-pointer ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="flex items-center gap-2 text-sm">
                        <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
                        Cash on Delivery (Pay at Doorstep)
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">
                      Pay with cash or UPI QR directly to the courier agent when your package is delivered.
                    </p>
                  </div>
                </div>
              </label>

              {/* Option 4: Debit / Credit Card */}
              <label
                className={`p-4 rounded-2xl border transition block cursor-pointer ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-200 shadow-sm'
                    : 'border-slate-200 hover:border-slate-300 bg-white'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CREDIT_CARD'}
                    onChange={() => setPaymentMethod('CREDIT_CARD')}
                    className="mt-1 text-indigo-600 focus:ring-indigo-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between font-bold text-slate-900">
                      <span className="flex items-center gap-2 text-sm">
                        <CreditCard className="w-4 h-4 text-indigo-600 shrink-0" />
                        Debit / Credit Card (Visa, MasterCard, RuPay)
                      </span>
                    </div>
                    <p className="text-slate-500 text-xs mt-1">
                      Safe gateway checkout with 256-bit encryption. Card details are never stored.
                    </p>
                  </div>
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
                <span>100% Purchase Protection by Arora Mobile Hub</span>
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
