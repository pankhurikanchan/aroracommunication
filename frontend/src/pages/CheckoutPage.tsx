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
  Phone,
  Mail,
  Info,
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export const CheckoutPage: React.FC = () => {
  useSEO({
    title: 'Secure Checkout',
    description: 'Complete your order with secure UPI, Cards, NetBanking, or COD at Arora Mobile Hub Bareilly.',
  });

  const { user } = useAuth();
  const { cart, subtotal, discount, deliveryCharge, finalTotal, coupon, clearCart } = useCart();
  const navigate = useNavigate();

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
  const [transactionRef, setTransactionRef] = useState('');
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
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="text-2xl font-black text-white">Your Cart is Empty</h2>
        <p className="text-xs text-slate-400">Add electronics products before accessing checkout.</p>
        <Link
          to="/products"
          className="inline-flex px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-xs shadow-lg transition hover:scale-105"
        >
          Browse Store Products
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
          !addressForm.fullName.trim() ||
          !addressForm.phone.trim() ||
          !addressForm.email.trim() ||
          !addressForm.addressLine.trim() ||
          !addressForm.city.trim() ||
          !addressForm.state.trim() ||
          !addressForm.pinCode.trim()
        ) {
          setErrorMessage('Please complete all required shipping address fields.');
          setCurrentStep(2);
          setPlacingOrder(false);
          return;
        }
        orderAddressData.shippingAddress = addressForm;
      }

      // Prepare order payload notes
      let paymentNotes = `Selected payment via ${paymentMethod}`;
      if (paymentMethod === 'UPI') {
        paymentNotes = `Direct UPI to Kotak / PhonePe (7300791957). Amount: ${formatINR(finalTotal)}. Status: Awaiting Verification.`;
      } else if (paymentMethod === 'NET_BANKING') {
        paymentNotes = `Direct Bank Transfer to Kotak A/C 5949282265. Amount: ${formatINR(finalTotal)}. Status: Awaiting Verification.`;
      } else if (paymentMethod === 'CASH_ON_DELIVERY') {
        paymentNotes = `Cash on Delivery. Exact amount due on delivery: ${formatINR(finalTotal)}.`;
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
        transactionId: transactionRef.trim() || null,
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
    { number: 4, title: 'Payment Method' },
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
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition shadow-md ${
                    currentStep > st.number
                      ? 'bg-emerald-600 text-white'
                      : currentStep === st.number
                      ? 'bg-violet-600 text-white ring-4 ring-violet-500/40 shadow-violet-600/40'
                      : 'bg-violet-950/70 text-slate-400 border border-violet-800/40'
                  }`}
                >
                  {currentStep > st.number ? <Check className="w-4 h-4" /> : st.number}
                </div>
                <span
                  className={`text-[11px] font-bold mt-1.5 ${
                    currentStep >= st.number ? 'text-white' : 'text-slate-400'
                  }`}
                >
                  {st.title}
                </span>
              </div>

              {idx < steps.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-2 -mt-4 transition rounded-full ${
                    currentStep > idx + 1 ? 'bg-emerald-500' : 'bg-violet-950/80 border border-violet-900/40'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {errorMessage && (
        <div className="max-w-3xl mx-auto mb-6 p-4 rounded-2xl bg-rose-950/80 border border-rose-600/60 text-rose-200 text-xs flex items-center gap-2.5 shadow-lg">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
          <span className="font-semibold">{errorMessage}</span>
        </div>
      )}

      {/* Main Grid: Steps & Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Step Checkout Actions (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Account Login Verification */}
          <div className="bg-[#120D2C]/90 backdrop-blur-xl rounded-3xl border border-violet-800/40 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-violet-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-violet-950/80 border border-violet-600/50 text-cyan-300 font-bold text-xs flex items-center justify-center">
                  1
                </div>
                <h2 className="text-base font-extrabold text-white">Account Information</h2>
              </div>
              {user && (
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> Logged In
                </span>
              )}
            </div>

            <div className="pt-4 text-xs">
              {user ? (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-[#161036] p-3.5 rounded-2xl border border-violet-900/40">
                  <div>
                    <p className="font-extrabold text-white text-sm">{user.name}</p>
                    <p className="text-slate-300 text-xs mt-0.5">{user.email} &bull; {user.phone || 'No phone saved'}</p>
                  </div>
                  <span className="text-[11px] font-bold text-cyan-300 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-500/30 w-fit">
                    Verified Customer
                  </span>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-slate-300">
                    You can checkout as a guest or sign in for one-click order tracking and saved addresses.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      to="/login?redirect=/checkout"
                      className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl font-bold text-xs shadow-md"
                    >
                      Sign In to Account
                    </Link>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 bg-violet-950/60 hover:bg-violet-900/60 border border-violet-800/40 rounded-xl font-bold text-slate-200 text-xs transition"
                    >
                      Continue as Guest
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Shipping Address */}
          <div className="bg-[#120D2C]/90 backdrop-blur-xl rounded-3xl border border-violet-800/40 p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-violet-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-violet-950/80 border border-violet-600/50 text-cyan-300 font-bold text-xs flex items-center justify-center">
                  2
                </div>
                <h2 className="text-base font-extrabold text-white">Shipping Address & Contact</h2>
              </div>
              <MapPin className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="space-y-4">
              {/* Existing Saved Addresses if any */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
                    Select a Saved Delivery Address:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => {
                          setSelectedAddressId(addr.id);
                          setUseNewAddress(false);
                        }}
                        className={`p-4 rounded-2xl border cursor-pointer transition text-xs ${
                          selectedAddressId === addr.id && !useNewAddress
                            ? 'border-cyan-400 bg-violet-950/80 ring-2 ring-cyan-400/40 shadow-lg'
                            : 'border-violet-900/40 hover:border-violet-700 bg-[#140F30]/70'
                        }`}
                      >
                        <div className="flex items-center justify-between font-extrabold text-white mb-1">
                          <span className="text-sm">{addr.fullName}</span>
                          {addr.isDefault && (
                            <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 px-1.5 py-0.5 rounded">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-slate-300 leading-relaxed">{addr.addressLine}</p>
                        <p className="text-slate-300">{addr.city}, {addr.state} - {addr.pinCode}</p>
                        <p className="text-cyan-300 font-bold mt-1.5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-cyan-400" />
                          <span>{addr.phone}</span>
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => setUseNewAddress(!useNewAddress)}
                      className="text-xs font-bold text-cyan-300 hover:text-cyan-200 underline"
                    >
                      {useNewAddress ? '← Use Selected Saved Address' : '+ Enter a Different Delivery Address'}
                    </button>
                  </div>
                </div>
              )}

              {/* Address Form (either guest or new address) */}
              {(useNewAddress || savedAddresses.length === 0) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs pt-1">
                  <div>
                    <label className="text-slate-200 font-bold block mb-1">Full Recipient Name *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.fullName}
                      onChange={(e) => setAddressForm({ ...addressForm, fullName: e.target.value })}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-2.5 rounded-xl border border-violet-800/40 bg-[#161036] focus:bg-[#1C1445] text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-200 font-bold block mb-1">Mobile Number (Courier SMS/Call) *</label>
                    <input
                      type="tel"
                      required
                      value={addressForm.phone}
                      onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
                      placeholder="e.g. +91 73007 91957"
                      className="w-full p-2.5 rounded-xl border border-violet-800/40 bg-[#161036] focus:bg-[#1C1445] text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-200 font-bold block mb-1">Email Address (Order Confirmation) *</label>
                    <input
                      type="email"
                      required
                      value={addressForm.email}
                      onChange={(e) => setAddressForm({ ...addressForm, email: e.target.value })}
                      placeholder="e.g. rahul@example.com"
                      className="w-full p-2.5 rounded-xl border border-violet-800/40 bg-[#161036] focus:bg-[#1C1445] text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-200 font-bold block mb-1">Street Address / House / Flat No. *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.addressLine}
                      onChange={(e) => setAddressForm({ ...addressForm, addressLine: e.target.value })}
                      placeholder="e.g. Flat 402, Royal Residency, Ekta Nagar"
                      className="w-full p-2.5 rounded-xl border border-violet-800/40 bg-[#161036] focus:bg-[#1C1445] text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-200 font-bold block mb-1">City / Town *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.city}
                      onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                      placeholder="e.g. Bareilly"
                      className="w-full p-2.5 rounded-xl border border-violet-800/40 bg-[#161036] focus:bg-[#1C1445] text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-200 font-bold block mb-1">State *</label>
                    <input
                      type="text"
                      required
                      value={addressForm.state}
                      onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                      placeholder="e.g. Uttar Pradesh"
                      className="w-full p-2.5 rounded-xl border border-violet-800/40 bg-[#161036] focus:bg-[#1C1445] text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="text-slate-200 font-bold block mb-1">PIN Code (6 digits) *</label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={addressForm.pinCode}
                      onChange={(e) => setAddressForm({ ...addressForm, pinCode: e.target.value })}
                      placeholder="e.g. 243122"
                      className="w-full p-2.5 rounded-xl border border-violet-800/40 bg-[#161036] focus:bg-[#1C1445] text-white placeholder-slate-400 focus:ring-2 focus:ring-violet-500 focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md transition"
                >
                  Proceed to Review &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Step 3: Order Summary Preview */}
          <div className="bg-[#120D2C]/90 backdrop-blur-xl rounded-3xl border border-violet-800/40 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-violet-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-violet-950/80 border border-violet-600/50 text-cyan-300 font-bold text-xs flex items-center justify-center">
                  3
                </div>
                <h2 className="text-base font-extrabold text-white">Order Summary ({cart.items.length} items)</h2>
              </div>
              <Truck className="w-4 h-4 text-cyan-400" />
            </div>

            <div className="pt-4 divide-y divide-violet-900/30 text-xs">
              {cart.items.map((it) => (
                <div key={it.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={it.product?.images?.[0]?.url}
                      alt={it.product?.name}
                      className="w-12 h-12 object-contain rounded-xl bg-[#161036] p-1 border border-violet-900/40 shrink-0"
                    />
                    <div className="truncate">
                      <p className="font-extrabold text-white truncate text-xs">{it.product?.name}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Qty: <strong className="text-slate-200">{it.quantity}</strong> &times; {formatINR(it.price)}
                      </p>
                    </div>
                  </div>
                  <span className="font-black text-cyan-300 shrink-0 text-sm">
                    {formatINR(it.price * it.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Step 4: Payment Options (Truthful & Explicit Verification) */}
          <div className="bg-[#120D2C]/90 backdrop-blur-xl rounded-3xl border border-violet-800/40 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-violet-900/40">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-violet-950/80 border border-violet-600/50 text-cyan-300 font-bold text-xs flex items-center justify-center">
                  4
                </div>
                <h2 className="text-base font-extrabold text-white">Select Payment Mode</h2>
              </div>
              <Lock className="w-4 h-4 text-emerald-400" />
            </div>

            <div className="pt-4 space-y-4">
              {/* Option 1: Direct UPI Transfer */}
              <label
                className={`p-4 sm:p-5 rounded-2xl border transition block cursor-pointer ${
                  paymentMethod === 'UPI'
                    ? 'border-cyan-400 bg-violet-950/70 ring-2 ring-cyan-400/40 shadow-lg'
                    : 'border-violet-900/40 hover:border-violet-700 bg-[#140F30]/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'UPI'}
                    onChange={() => setPaymentMethod('UPI')}
                    className="mt-1 text-violet-600 focus:ring-violet-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 font-extrabold text-white">
                      <span className="flex items-center gap-2 text-sm">
                        <QrCode className="w-4 h-4 text-cyan-400 shrink-0" />
                        Direct UPI Transfer (Google Pay, PhonePe, Paytm, BHIM)
                      </span>
                      <span className="text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-500/40 font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        ⚡ Direct & Verified
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs mt-1">
                      Pay directly to <strong>ARORA MOBILES & GADGET HUB</strong> using your mobile UPI app or scan the QR code.
                    </p>
                  </div>
                </div>

                {paymentMethod === 'UPI' && (
                  <div className="mt-4 pt-4 border-t border-violet-900/40 space-y-4">
                    {/* Mobile 1-Tap Intent Button */}
                    <a
                      href={upiPayLink}
                      className="sm:hidden flex items-center justify-center gap-2 w-full py-3 px-4 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition"
                    >
                      <Smartphone className="w-4 h-4" />
                      <span>Tap to Open UPI App & Pay {formatINR(finalTotal)}</span>
                    </a>

                    {/* QR Code & Copyable IDs Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#161036] p-4 rounded-2xl border border-violet-800/40">
                      {/* Left: Dynamic QR Code */}
                      <div className="md:col-span-5 flex flex-col items-center text-center">
                        <div className="p-2 bg-white rounded-2xl border-2 border-cyan-400/50 shadow-md">
                          <img
                            src={qrCodeUrl}
                            alt="Scan UPI QR Code"
                            className="w-36 h-36 object-contain rounded-lg"
                          />
                        </div>
                        <span className="text-xs font-bold text-white mt-2 block">
                          Scan with Any UPI App
                        </span>
                        <span className="text-[11px] text-cyan-300 font-bold">
                          Amount: {formatINR(finalTotal)}
                        </span>
                      </div>

                      {/* Right: Copyable UPI IDs */}
                      <div className="md:col-span-7 space-y-2.5">
                        <div className="p-3 rounded-xl bg-[#140F30] border border-violet-800/40 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                              Primary Kotak UPI ID
                            </span>
                            <span className="font-mono font-bold text-white text-xs truncate block">
                              7300791957@kotak
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCopy('7300791957@kotak', 'kotak-upi');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-violet-950/80 hover:bg-violet-900 border border-violet-700/50 text-cyan-300 font-bold text-[11px] flex items-center gap-1.5 transition shrink-0"
                          >
                            {copiedKey === 'kotak-upi' ? (
                              <>
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-300">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="p-3 rounded-xl bg-[#140F30] border border-violet-800/40 flex items-center justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                              Alternate PhonePe UPI ID
                            </span>
                            <span className="font-mono font-bold text-white text-xs truncate block">
                              Phonepe7300791957-2@axl
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              handleCopy('Phonepe7300791957-2@axl', 'phonepe-upi');
                            }}
                            className="px-3 py-1.5 rounded-lg bg-violet-950/80 hover:bg-violet-900 border border-violet-700/50 text-cyan-300 font-bold text-[11px] flex items-center gap-1.5 transition shrink-0"
                          >
                            {copiedKey === 'phonepe-upi' ? (
                              <>
                                <CheckCheck className="w-3.5 h-3.5 text-emerald-400" />
                                <span className="text-emerald-300">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>

                        <div className="px-1 text-[11px] text-slate-300">
                          <span>Payee Name: </span>
                          <strong className="text-white">ARORA MOBILES & GADGET HUB</strong>
                        </div>
                      </div>
                    </div>

                    {/* UTR / Transaction ID Input Field */}
                    <div className="p-3.5 rounded-2xl bg-[#140F30] border border-violet-800/40 space-y-2">
                      <label className="block text-xs font-bold text-white">
                        Enter 12-Digit UPI Transaction ID / UTR Number (Optional if already sent)
                      </label>
                      <input
                        type="text"
                        maxLength={18}
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g. 428901234567 (visible in your UPI payment receipt)"
                        className="w-full p-2.5 rounded-xl border border-violet-800/50 bg-[#161036] text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-cyan-400 focus:outline-none font-mono"
                      />
                      <div className="flex items-start gap-2 text-[11px] text-slate-300 leading-relaxed pt-1">
                        <Info className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span>
                          Your order will be registered with status <strong className="text-cyan-300">Payment Awaiting Verification</strong>. Our store billing team verifies the credit in our Kotak / PhonePe records before shipping.
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </label>

              {/* Option 2: Cash on Delivery */}
              <label
                className={`p-4 sm:p-5 rounded-2xl border transition block cursor-pointer ${
                  paymentMethod === 'CASH_ON_DELIVERY'
                    ? 'border-cyan-400 bg-violet-950/70 ring-2 ring-cyan-400/40 shadow-lg'
                    : 'border-violet-900/40 hover:border-violet-700 bg-[#140F30]/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CASH_ON_DELIVERY'}
                    onChange={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className="mt-1 text-violet-600 focus:ring-violet-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between font-extrabold text-white">
                      <span className="flex items-center gap-2 text-sm">
                        <Banknote className="w-4 h-4 text-emerald-400 shrink-0" />
                        Cash on Delivery (Pay at Doorstep)
                      </span>
                      <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-500/40 font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                        Pay on Arrival
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs mt-1">
                      Pay with cash or UPI QR scanner directly to the courier agent when your package is delivered.
                    </p>
                  </div>
                </div>

                {paymentMethod === 'CASH_ON_DELIVERY' && (
                  <div className="mt-3 p-3 rounded-xl bg-amber-950/50 border border-amber-500/40 text-amber-200 text-xs space-y-1">
                    <p className="font-bold text-amber-300">
                      Payment Status: Pending (Pay on Delivery)
                    </p>
                    <p className="text-[11px] text-slate-300">
                      Amount due upon arrival: <strong className="text-amber-300">{formatINR(finalTotal)}</strong>. No advance payment required.
                    </p>
                  </div>
                )}
              </label>

              {/* Option 3: Direct Bank Account Transfer */}
              <label
                className={`p-4 sm:p-5 rounded-2xl border transition block cursor-pointer ${
                  paymentMethod === 'NET_BANKING'
                    ? 'border-cyan-400 bg-violet-950/70 ring-2 ring-cyan-400/40 shadow-lg'
                    : 'border-violet-900/40 hover:border-violet-700 bg-[#140F30]/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'NET_BANKING'}
                    onChange={() => setPaymentMethod('NET_BANKING')}
                    className="mt-1 text-violet-600 focus:ring-violet-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-1.5 font-extrabold text-white">
                      <span className="flex items-center gap-2 text-sm">
                        <Building className="w-4 h-4 text-cyan-400 shrink-0" />
                        Direct Bank Transfer (IMPS / NEFT / RTGS)
                      </span>
                      <span className="text-[10px] bg-violet-950 text-violet-300 border border-violet-700/50 font-bold px-2.5 py-0.5 rounded-full">
                        Kotak Bank
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs mt-1">
                      Transfer directly to the official current bank account of Arora Mobiles & Gadget Hub.
                    </p>
                  </div>
                </div>

                {paymentMethod === 'NET_BANKING' && (
                  <div className="mt-4 pt-4 border-t border-violet-900/40 space-y-3">
                    <div className="bg-[#161036] p-4 rounded-xl border border-violet-800/40 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-2.5 rounded-lg bg-[#140F30] border border-violet-900/40">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Holder</span>
                        <span className="font-bold text-white text-xs">ARORA MOBILES & GADGET HUB</span>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#140F30] border border-violet-900/40 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Account Number</span>
                          <span className="font-mono font-bold text-white text-xs">5949282265</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('5949282265', 'acc-num')}
                          className="px-2 py-1 rounded bg-violet-950 text-cyan-300 font-bold text-[10px]"
                        >
                          {copiedKey === 'acc-num' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#140F30] border border-violet-900/40 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">IFSC Code</span>
                          <span className="font-mono font-bold text-white text-xs">KKBK0005321</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('KKBK0005321', 'ifsc-code')}
                          className="px-2 py-1 rounded bg-violet-950 text-cyan-300 font-bold text-[10px]"
                        >
                          {copiedKey === 'ifsc-code' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                      <div className="p-2.5 rounded-lg bg-[#140F30] border border-violet-900/40">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Bank Branch</span>
                        <span className="font-bold text-white text-xs">Kotak Mahindra Bank, Bareilly</span>
                      </div>
                    </div>

                    <div className="p-3.5 rounded-2xl bg-[#140F30] border border-violet-800/40 space-y-2">
                      <label className="block text-xs font-bold text-white">
                        Enter IMPS / NEFT Reference Number
                      </label>
                      <input
                        type="text"
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g. KKBK2428901234"
                        className="w-full p-2.5 rounded-xl border border-violet-800/50 bg-[#161036] text-white placeholder-slate-400 text-xs focus:ring-2 focus:ring-cyan-400 focus:outline-none font-mono"
                      />
                    </div>
                  </div>
                )}
              </label>

              {/* Option 4: Debit / Credit Card */}
              <label
                className={`p-4 rounded-2xl border transition block cursor-pointer ${
                  paymentMethod === 'CREDIT_CARD'
                    ? 'border-cyan-400 bg-violet-950/70 ring-2 ring-cyan-400/40 shadow-lg'
                    : 'border-violet-900/40 hover:border-violet-700 bg-[#140F30]/60'
                }`}
              >
                <div className="flex items-start gap-3">
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'CREDIT_CARD'}
                    onChange={() => setPaymentMethod('CREDIT_CARD')}
                    className="mt-1 text-violet-600 focus:ring-violet-500 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between font-extrabold text-white">
                      <span className="flex items-center gap-2 text-sm">
                        <CreditCard className="w-4 h-4 text-cyan-400 shrink-0" />
                        Debit / Credit Card (Visa, MasterCard, RuPay)
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs mt-1">
                      Direct order placed with status <strong>Payment Pending</strong>. Our team confirms card link / payment receipt.
                    </p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Order Total & Place Order Button (4 cols) */}
        <div className="lg:col-span-4 sticky top-28 space-y-4">
          <div className="bg-[#120D2C]/90 backdrop-blur-xl rounded-3xl border border-violet-800/40 p-6 shadow-xl space-y-4">
            <h3 className="text-xs font-black text-cyan-300 pb-3 border-b border-violet-900/40 uppercase tracking-wider">
              Payment Summary
            </h3>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Items Subtotal:</span>
                <span className="font-extrabold text-white">{formatINR(subtotal)}</span>
              </div>

              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Coupon Discount ({coupon?.code}):</span>
                  <span>- {formatINR(discount)}</span>
                </div>
              )}

              <div className="flex justify-between text-slate-300">
                <span>Delivery Charges:</span>
                <span>
                  {deliveryCharge === 0 ? (
                    <span className="text-emerald-400 font-extrabold">FREE</span>
                  ) : (
                    formatINR(deliveryCharge)
                  )}
                </span>
              </div>

              <div className="pt-3 border-t border-violet-900/40 flex justify-between items-baseline text-white">
                <span className="text-xs font-extrabold text-slate-300">
                  {paymentMethod === 'CASH_ON_DELIVERY' ? 'Due on Delivery:' : 'Total Amount:'}
                </span>
                <span className="text-2xl font-black text-cyan-300">{formatINR(finalTotal)}</span>
              </div>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={placingOrder}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-600 text-white font-extrabold text-xs shadow-lg shadow-emerald-950/50 transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {placingOrder ? (
                <span>Confirming Order...</span>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'CASH_ON_DELIVERY'
                      ? `Place COD Order • ${formatINR(finalTotal)}`
                      : `Place Order & Submit • ${formatINR(finalTotal)}`}
                  </span>
                </>
              )}
            </button>

            <div className="pt-2 border-t border-violet-900/40 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                <span>100% Genuine Sealed Stock by Arora Mobile Hub</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Same day dispatch for orders before 2:00 PM</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
