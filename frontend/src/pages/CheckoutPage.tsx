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
  ArrowLeft,
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
  Package,
  Sparkles,
  Tag,
  Shield,
  Clock,
} from 'lucide-react';
import { useSEO } from '../hooks/useSEO';

export const CheckoutPage: React.FC = () => {
  useSEO({
    title: 'Secure Multi-Step Checkout',
    description: 'Complete your order through our verified 4-step secure checkout at Arora Mobile Hub Bareilly.',
  });

  const { user, login } = useAuth();
  const {
    cart,
    subtotal,
    discount,
    deliveryCharge,
    finalTotal,
    coupon,
    applyCoupon,
    removeCoupon,
    clearCart,
  } = useCart();
  const navigate = useNavigate();

  // 4 Discrete Step States (1: Account, 2: Address, 3: Summary, 4: Payment)
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isAccountVerified, setIsAccountVerified] = useState<boolean>(false);
  const [isAddressVerified, setIsAddressVerified] = useState<boolean>(false);
  const [isSummaryConfirmed, setIsSummaryConfirmed] = useState<boolean>(false);

  // Step 1: Account State
  const [accountForm, setAccountForm] = useState({
    fullName: '',
    email: '',
    phone: '',
  });
  const [showLoginForm, setShowLoginForm] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Step 2: Address State
  const [savedAddresses, setSavedAddresses] = useState<Address[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('');
  const [useNewAddress, setUseNewAddress] = useState<boolean>(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phone: '',
    email: '',
    addressLine: '',
    city: '',
    state: 'Uttar Pradesh',
    pinCode: '',
    landmark: '',
  });

  // Step 3: Coupon input state in summary
  const [couponInput, setCouponInput] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState<{ text: string; error?: boolean } | null>(null);

  // Step 4: Payment State
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('UPI');
  const [transactionRef, setTransactionRef] = useState('');
  const [upiPaidConfirmed, setUpiPaidConfirmed] = useState(false);
  const [codConfirmed, setCodConfirmed] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // General Error Notice
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize Account Details from logged-in user
  useEffect(() => {
    if (user) {
      setAccountForm({
        fullName: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
      });
      setAddressForm((prev) => ({
        ...prev,
        fullName: prev.fullName || user.name || '',
        email: prev.email || user.email || '',
        phone: prev.phone || user.phone || '',
      }));
      // Auto verify step 1 for logged-in user if they have name & email
      if (user.email && user.name) {
        setIsAccountVerified(true);
      }
    }
  }, [user]);

  // Fetch saved addresses if logged in
  useEffect(() => {
    if (user) {
      api
        .get('/users/addresses')
        .then((res) => {
          if (res.data.success && res.data.data.length > 0) {
            setSavedAddresses(res.data.data);
            const def = res.data.data.find((a: Address) => a.isDefault) || res.data.data[0];
            setSelectedAddressId(def.id);
            setUseNewAddress(false);
          } else {
            setUseNewAddress(true);
          }
        })
        .catch(() => {
          setUseNewAddress(true);
        });
    } else {
      setUseNewAddress(true);
    }
  }, [user]);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Step 1: Inline Login Handler
  const handleInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      const res = await login(loginEmail, loginPassword);
      if (res.success && res.user) {
        setAccountForm({
          fullName: res.user.name,
          email: res.user.email,
          phone: res.user.phone || '',
        });
        setAddressForm((prev) => ({
          ...prev,
          fullName: res.user?.name || prev.fullName,
          email: res.user?.email || prev.email,
          phone: res.user?.phone || prev.phone,
        }));
        setIsAccountVerified(true);
        setShowLoginForm(false);
        setCurrentStep(2);
      } else {
        setLoginError(res.message || 'Invalid email or password.');
      }
    } catch (err: any) {
      setLoginError(err.message || 'Error logging into account.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Step 1: Verification & Proceed to Step 2
  const handleConfirmAccount = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const name = accountForm.fullName.trim();
    const email = accountForm.email.trim();
    const phone = accountForm.phone.trim().replace(/\D/g, '');

    if (!name || name.length < 2) {
      setErrorMessage('Please enter your full legal name (minimum 2 characters).');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setErrorMessage('Please enter a valid email address for order confirmation & invoices.');
      return;
    }
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phone || !phoneRegex.test(phone)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g. 7300791957).');
      return;
    }

    // Sync address form defaults
    setAddressForm((prev) => ({
      ...prev,
      fullName: prev.fullName || name,
      email: prev.email || email,
      phone: prev.phone || phone,
    }));

    setIsAccountVerified(true);
    setCurrentStep(2);
  };

  // Step 2: Verification & Proceed to Step 3
  const handleConfirmAddress = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!isAccountVerified) {
      setCurrentStep(1);
      setErrorMessage('Please complete account verification before entering address.');
      return;
    }

    if (selectedAddressId && !useNewAddress) {
      setIsAddressVerified(true);
      setCurrentStep(3);
      return;
    }

    const { fullName, phone, addressLine, city, state, pinCode } = addressForm;
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Please enter the recipient full name.');
      return;
    }
    const cleanPhone = phone.trim().replace(/\D/g, '');
    if (!cleanPhone || cleanPhone.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number for courier SMS updates.');
      return;
    }
    if (!addressLine.trim() || addressLine.trim().length < 5) {
      setErrorMessage('Please enter your full street address / flat / house number.');
      return;
    }
    if (!city.trim()) {
      setErrorMessage('Please enter your city / town.');
      return;
    }
    if (!state.trim()) {
      setErrorMessage('Please enter your state.');
      return;
    }
    const cleanPin = pinCode.trim().replace(/\D/g, '');
    if (!cleanPin || cleanPin.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit postal PIN code.');
      return;
    }

    setIsAddressVerified(true);
    setCurrentStep(3);
  };

  // Step 3: Coupon Handler
  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponLoading(true);
    setCouponFeedback(null);
    const res = await applyCoupon(couponInput.trim());
    if (res.success) {
      setCouponFeedback({ text: res.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ text: res.message, error: true });
    }
    setCouponLoading(false);
  };

  // Step 3: Confirmation & Proceed to Step 4
  const handleConfirmSummary = () => {
    setErrorMessage(null);
    if (!isAccountVerified) {
      setCurrentStep(1);
      setErrorMessage('Please verify your account information first.');
      return;
    }
    if (!isAddressVerified) {
      setCurrentStep(2);
      setErrorMessage('Please confirm your delivery address first.');
      return;
    }

    setIsSummaryConfirmed(true);
    setCurrentStep(4);
  };

  // Step 4: Strict Order Placement with Payment Verification
  const handleCompletePaymentAndPlaceOrder = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    // Guard all 3 prerequisite steps
    if (!isAccountVerified) {
      setCurrentStep(1);
      setErrorMessage('Please verify your account information first.');
      return;
    }
    if (!isAddressVerified) {
      setCurrentStep(2);
      setErrorMessage('Please confirm your delivery address first.');
      return;
    }
    if (!isSummaryConfirmed) {
      setCurrentStep(3);
      setErrorMessage('Please review your order summary first.');
      return;
    }

    // STRICT PAYMENT REQUIREMENT
    if (paymentMethod === 'UPI') {
      const cleanUtr = transactionRef.trim().replace(/\s+/g, '');
      if (!cleanUtr || cleanUtr.length < 6) {
        setErrorMessage(
          `Please complete the UPI transfer of ${formatINR(finalTotal)} to 7300791957@kotak and enter your 12-digit UPI UTR / Transaction Reference number before submitting the order.`
        );
        return;
      }
      if (!upiPaidConfirmed) {
        setErrorMessage(
          `Please check the box confirming you have transferred ${formatINR(finalTotal)} to Arora Mobile Hub via UPI.`
        );
        return;
      }
    } else if (paymentMethod === 'NET_BANKING') {
      const cleanRef = transactionRef.trim().replace(/\s+/g, '');
      if (!cleanRef || cleanRef.length < 6) {
        setErrorMessage(
          `Please complete the NEFT/IMPS transfer of ${formatINR(finalTotal)} and enter your Bank Reference / UTR Number before placing the order.`
        );
        return;
      }
    } else if (paymentMethod === 'CASH_ON_DELIVERY') {
      if (!codConfirmed) {
        setErrorMessage(
          `Please check the box confirming you agree to pay ${formatINR(finalTotal)} in cash or via courier UPI QR scanner when the courier executive arrives at your doorstep.`
        );
        return;
      }
    }

    try {
      setPlacingOrder(true);

      let orderAddressData: any = {};
      if (selectedAddressId && !useNewAddress) {
        orderAddressData.addressId = selectedAddressId;
      } else {
        orderAddressData.shippingAddress = {
          fullName: addressForm.fullName.trim() || accountForm.fullName.trim(),
          phone: addressForm.phone.trim() || accountForm.phone.trim(),
          email: addressForm.email.trim() || accountForm.email.trim(),
          addressLine: addressForm.addressLine.trim(),
          city: addressForm.city.trim(),
          state: addressForm.state.trim(),
          pinCode: addressForm.pinCode.trim(),
        };
      }

      let paymentNotes = `Selected payment via ${paymentMethod}`;
      if (paymentMethod === 'UPI') {
        paymentNotes = `Direct UPI to Kotak / PhonePe (7300791957). Amount: ${formatINR(finalTotal)}. Customer submitted UTR: ${transactionRef.trim()}`;
      } else if (paymentMethod === 'NET_BANKING') {
        paymentNotes = `Direct Bank Transfer to Kotak A/C 5949282265. Amount: ${formatINR(finalTotal)}. Customer Bank Ref: ${transactionRef.trim()}`;
      } else if (paymentMethod === 'CASH_ON_DELIVERY') {
        paymentNotes = `Cash on Delivery confirmed by customer. Amount due at doorstep: ${formatINR(finalTotal)}.`;
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
        setErrorMessage(res.data.message || 'Failed to place order.');
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Error processing your order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

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

  const upiPayLink = `upi://pay?pa=7300791957@kotak&pn=ARORA%20MOBILES%20AND%20GADGET%20HUB&am=${finalTotal}&cu=INR&tn=Arora%20Order`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&margin=8&data=${encodeURIComponent(upiPayLink)}`;

  const steps = [
    { number: 1, title: 'Account Verification' },
    { number: 2, title: 'Address Details' },
    { number: 3, title: 'Order Summary' },
    { number: 4, title: 'Payment Window' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* 4-Step Checkout Stepper Navigation */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="flex items-center justify-between">
          {steps.map((st, idx) => {
            const isCompleted =
              (st.number === 1 && isAccountVerified && currentStep > 1) ||
              (st.number === 2 && isAddressVerified && currentStep > 2) ||
              (st.number === 3 && isSummaryConfirmed && currentStep > 3);
            const isCurrent = currentStep === st.number;
            const isAccessible =
              st.number === 1 ||
              (st.number === 2 && isAccountVerified) ||
              (st.number === 3 && isAccountVerified && isAddressVerified) ||
              (st.number === 4 && isAccountVerified && isAddressVerified && isSummaryConfirmed);

            return (
              <React.Fragment key={st.number}>
                <div
                  onClick={() => {
                    if (isAccessible) {
                      setErrorMessage(null);
                      setCurrentStep(st.number);
                    }
                  }}
                  className={`flex flex-col items-center select-none ${
                    isAccessible ? 'cursor-pointer hover:opacity-90' : 'cursor-not-allowed opacity-50'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-xs transition-all shadow-lg ${
                      isCompleted
                        ? 'bg-emerald-500 text-white shadow-emerald-950/50 ring-2 ring-emerald-400/40'
                        : isCurrent
                        ? 'bg-gradient-to-tr from-cyan-400 to-indigo-600 text-white ring-4 ring-cyan-400/30 shadow-cyan-950/50 scale-105'
                        : 'bg-[#161036] text-slate-400 border border-violet-800/50'
                    }`}
                  >
                    {isCompleted ? <Check className="w-5 h-5 stroke-[3]" /> : st.number}
                  </div>
                  <span
                    className={`text-[11px] font-extrabold mt-2 tracking-wide text-center ${
                      isCurrent ? 'text-cyan-300' : isCompleted ? 'text-emerald-300' : 'text-slate-400'
                    }`}
                  >
                    {st.title}
                  </span>
                  <span className="text-[10px] text-slate-500 hidden sm:block">
                    {isCompleted ? 'Completed' : isCurrent ? 'Active Step' : 'Locked'}
                  </span>
                </div>

                {idx < steps.length - 1 && (
                  <div
                    className={`flex-1 h-1 mx-2 sm:mx-4 -mt-6 transition-all rounded-full ${
                      currentStep > idx + 1
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-500'
                        : 'bg-violet-950/80 border border-violet-900/40'
                    }`}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="max-w-4xl mx-auto mb-6 p-4 rounded-2xl bg-rose-950/90 border border-rose-500/60 text-rose-200 text-xs flex items-center gap-3 shadow-xl animate-fade-in">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span className="font-bold leading-relaxed">{errorMessage}</span>
        </div>
      )}

      {/* Main Multi-Page Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Active Step Window (8 cols) */}
        <div className="lg:col-span-8">
          {/* ===================================================================
              PAGE 1: ACCOUNT INFORMATION & VERIFICATION
              =================================================================== */}
          {currentStep === 1 && (
            <div className="bg-[#120D2C]/95 backdrop-blur-xl rounded-3xl border border-violet-800/50 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-violet-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    1
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Step 1: Account Information & Verification</h2>
                    <p className="text-xs text-slate-300">
                      Verify your customer profile to unlock delivery address and order tracking
                    </p>
                  </div>
                </div>
                {isAccountVerified && (
                  <span className="text-xs font-black text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full flex items-center gap-1.5 shadow">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Verified</span>
                  </span>
                )}
              </div>

              {/* Case A: Logged In Customer */}
              {user ? (
                <div className="space-y-5">
                  <div className="bg-[#161036] p-5 rounded-2xl border border-violet-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-600 flex items-center justify-center text-white font-black text-lg shadow-md">
                        {user.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-black text-white text-base">{user.name}</h3>
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-cyan-950 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 rounded">
                            Verified Account
                          </span>
                        </div>
                        <p className="text-xs text-slate-300 mt-0.5 flex items-center gap-2">
                          <span>{user.email}</span>
                          {user.phone && <span>&bull; {user.phone}</span>}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Phone check for courier */}
                  {(!user.phone || !accountForm.phone) && (
                    <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-600/40 space-y-2">
                      <label className="text-xs font-bold text-cyan-200 block">
                        Enter Mobile Number for Courier Dispatch SMS *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={accountForm.phone}
                        onChange={(e) =>
                          setAccountForm({ ...accountForm, phone: e.target.value.replace(/\D/g, '') })
                        }
                        placeholder="e.g. 7300791957 (10 digits)"
                        className="w-full p-3 rounded-xl border border-violet-700/60 bg-[#161036] text-white font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                      />
                    </div>
                  )}

                  <div className="pt-2 flex justify-end">
                    <button
                      type="button"
                      onClick={() => handleConfirmAccount()}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-violet-900/40 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                    >
                      <span>Confirm Account & Proceed to Address</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Case B: Guest Customer or Fast Login */
                <div className="space-y-6">
                  {showLoginForm ? (
                    /* Inline Login Form */
                    <form onSubmit={handleInlineLogin} className="space-y-4 bg-[#161036] p-5 rounded-2xl border border-violet-800/40">
                      <div className="flex items-center justify-between pb-2 border-b border-violet-900/30">
                        <h4 className="font-black text-white text-sm">Sign In to Your Arora Mobile Hub Account</h4>
                        <button
                          type="button"
                          onClick={() => setShowLoginForm(false)}
                          className="text-xs text-cyan-300 font-bold hover:underline"
                        >
                          Cancel / Continue as Guest
                        </button>
                      </div>

                      {loginError && (
                        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-600/50 text-rose-200 text-xs">
                          {loginError}
                        </div>
                      )}

                      <div>
                        <label className="text-slate-200 font-bold text-xs block mb-1">Email Address *</label>
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full p-3 rounded-xl border border-violet-700/60 bg-[#140F30] text-white font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="text-slate-200 font-bold text-xs block mb-1">Password *</label>
                        <input
                          type="password"
                          required
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          placeholder="Your account password"
                          className="w-full p-3 rounded-xl border border-violet-700/60 bg-[#140F30] text-white font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={loginLoading}
                        className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs shadow-md transition"
                      >
                        {loginLoading ? 'Verifying Account...' : 'Sign In & Continue to Address'}
                      </button>
                    </form>
                  ) : (
                    /* Guest Verification Form */
                    <form onSubmit={handleConfirmAccount} className="space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-2xl bg-violet-950/60 border border-violet-800/40">
                        <div className="text-xs text-slate-300">
                          Already have an account with saved addresses?
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowLoginForm(true)}
                          className="px-4 py-2 rounded-xl bg-violet-800/80 hover:bg-violet-700 text-white font-bold text-xs transition"
                        >
                          Sign In Instead
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <label className="text-slate-200 font-extrabold text-xs block mb-1.5">
                            Customer Legal Full Name *
                          </label>
                          <input
                            type="text"
                            required
                            value={accountForm.fullName}
                            onChange={(e) =>
                              setAccountForm({ ...accountForm, fullName: e.target.value })
                            }
                            placeholder="e.g. Rahul Sharma"
                            className="w-full p-3.5 rounded-xl border border-violet-700/60 bg-[#161036] text-white font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="text-slate-200 font-extrabold text-xs block mb-1.5">
                            Email Address (Invoices & Updates) *
                          </label>
                          <input
                            type="email"
                            required
                            value={accountForm.email}
                            onChange={(e) =>
                              setAccountForm({ ...accountForm, email: e.target.value })
                            }
                            placeholder="e.g. rahul@example.com"
                            className="w-full p-3.5 rounded-xl border border-violet-700/60 bg-[#161036] text-white font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                          />
                        </div>

                        <div>
                          <label className="text-slate-200 font-extrabold text-xs block mb-1.5">
                            Mobile Number (10-Digit Courier Contact) *
                          </label>
                          <input
                            type="tel"
                            required
                            maxLength={10}
                            value={accountForm.phone}
                            onChange={(e) =>
                              setAccountForm({
                                ...accountForm,
                                phone: e.target.value.replace(/\D/g, ''),
                              })
                            }
                            placeholder="e.g. 7300791957"
                            className="w-full p-3.5 rounded-xl border border-violet-700/60 bg-[#161036] text-white font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                          />
                        </div>
                      </div>

                      <div className="pt-3 flex justify-end">
                        <button
                          type="submit"
                          className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-violet-900/40 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                        >
                          <span>Verify Account & Proceed to Address</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ===================================================================
              PAGE 2: ADDRESS DETAILS
              =================================================================== */}
          {currentStep === 2 && (
            <div className="bg-[#120D2C]/95 backdrop-blur-xl rounded-3xl border border-violet-800/50 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-violet-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    2
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Step 2: Delivery Address Details</h2>
                    <p className="text-xs text-slate-300">
                      Provide full doorstep delivery address and recipient details
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="text-xs font-bold text-cyan-300 hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Edit Account</span>
                </button>
              </div>

              {/* Verified Account Confirmation Banner */}
              <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-emerald-300 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    Verified Customer: <strong className="text-white">{accountForm.fullName}</strong> ({accountForm.email} &bull; {accountForm.phone})
                  </span>
                </div>
              </div>

              {/* Existing Saved Addresses if any */}
              {savedAddresses.length > 0 && (
                <div className="space-y-3">
                  <label className="text-xs font-black text-cyan-300 uppercase tracking-wider block">
                    Choose from Saved Delivery Addresses:
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
                        <p className="text-slate-300">
                          {addr.city}, {addr.state} - {addr.pinCode}
                        </p>
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
                      {useNewAddress
                        ? '← Use Selected Saved Address'
                        : '+ Enter a Different Delivery Address'}
                    </button>
                  </div>
                </div>
              )}

              {/* New Delivery Address Form */}
              {(useNewAddress || savedAddresses.length === 0) && (
                <form onSubmit={handleConfirmAddress} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-200 font-extrabold block mb-1">
                        Recipient Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.fullName}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, fullName: e.target.value })
                        }
                        placeholder="e.g. Rahul Sharma"
                        className="w-full p-3 rounded-xl border border-violet-700/60 bg-[#161036] text-white font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="text-slate-200 font-extrabold block mb-1">
                        Contact Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={addressForm.phone}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            phone: e.target.value.replace(/\D/g, ''),
                          })
                        }
                        placeholder="e.g. 7300791957"
                        className="w-full p-3 rounded-xl border border-violet-700/60 bg-[#161036] text-white font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-slate-200 font-extrabold block mb-1">
                        Street Address / Flat / House No. / Building *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.addressLine}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, addressLine: e.target.value })
                        }
                        placeholder="e.g. Flat 402, Royal Residency, C-15 Ekta Nagar"
                        className="w-full p-3 rounded-xl border border-violet-700/60 bg-[#161036] text-white font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="text-slate-200 font-extrabold block mb-1">
                        City / Town *
                      </label>
                      <input
                        type="text"
                        required
                        value={addressForm.city}
                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                        placeholder="e.g. Bareilly"
                        className="w-full p-3 rounded-xl border border-violet-700/60 bg-[#161036] text-white font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="text-slate-200 font-extrabold block mb-1">State *</label>
                      <input
                        type="text"
                        required
                        value={addressForm.state}
                        onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                        placeholder="e.g. Uttar Pradesh"
                        className="w-full p-3 rounded-xl border border-violet-700/60 bg-[#161036] text-white font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="text-slate-200 font-extrabold block mb-1">
                        PIN Code (6 Digits) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={addressForm.pinCode}
                        onChange={(e) =>
                          setAddressForm({
                            ...addressForm,
                            pinCode: e.target.value.replace(/\D/g, ''),
                          })
                        }
                        placeholder="e.g. 243122"
                        className="w-full p-3 rounded-xl border border-violet-700/60 bg-[#161036] text-white font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                      />
                    </div>

                    <div>
                      <label className="text-slate-200 font-extrabold block mb-1">
                        Nearby Landmark (Optional)
                      </label>
                      <input
                        type="text"
                        value={addressForm.landmark}
                        onChange={(e) =>
                          setAddressForm({ ...addressForm, landmark: e.target.value })
                        }
                        placeholder="e.g. Near Ekta Nagar Water Tank"
                        className="w-full p-3 rounded-xl border border-violet-700/60 bg-[#161036] text-white font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                      />
                    </div>
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl border border-violet-800/50 hover:bg-violet-950/60 text-slate-300 font-bold text-xs transition"
                    >
                      &larr; Back to Account
                    </button>
                    <button
                      type="submit"
                      className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-violet-900/40 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                    >
                      <span>Confirm Address & Proceed to Summary</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              )}

              {/* Action when saved address is picked */}
              {!useNewAddress && savedAddresses.length > 0 && (
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl border border-violet-800/50 hover:bg-violet-950/60 text-slate-300 font-bold text-xs transition"
                  >
                    &larr; Back to Account
                  </button>
                  <button
                    type="button"
                    onClick={() => handleConfirmAddress()}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-violet-900/40 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                  >
                    <span>Confirm Selected Address & Proceed to Summary</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ===================================================================
              PAGE 3: ORDER SUMMARY
              =================================================================== */}
          {currentStep === 3 && (
            <div className="bg-[#120D2C]/95 backdrop-blur-xl rounded-3xl border border-violet-800/50 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-violet-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    3
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Step 3: Review Order Summary</h2>
                    <p className="text-xs text-slate-300">
                      Verify items, destination address, and applied coupons before opening payment
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="text-xs font-bold text-cyan-300 hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Change Address</span>
                </button>
              </div>

              {/* Confirmed Delivery Destination Card */}
              <div className="p-4 rounded-2xl bg-[#161036] border border-violet-800/40 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>Shipping Destination:</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="text-cyan-300 font-bold hover:underline"
                  >
                    Edit
                  </button>
                </div>
                <p className="font-extrabold text-white text-sm">
                  {useNewAddress || savedAddresses.length === 0
                    ? addressForm.fullName
                    : savedAddresses.find((a) => a.id === selectedAddressId)?.fullName}
                </p>
                <p className="text-slate-300">
                  {useNewAddress || savedAddresses.length === 0
                    ? `${addressForm.addressLine}, ${addressForm.city}, ${addressForm.state} - ${addressForm.pinCode}`
                    : `${savedAddresses.find((a) => a.id === selectedAddressId)?.addressLine}, ${savedAddresses.find((a) => a.id === selectedAddressId)?.city}, ${savedAddresses.find((a) => a.id === selectedAddressId)?.state} - ${savedAddresses.find((a) => a.id === selectedAddressId)?.pinCode}`}
                </p>
                <p className="text-emerald-400 font-bold">
                  📱 Mobile:{' '}
                  {useNewAddress || savedAddresses.length === 0
                    ? addressForm.phone
                    : savedAddresses.find((a) => a.id === selectedAddressId)?.phone}
                </p>
              </div>

              {/* Ordered Items List */}
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300 flex items-center gap-2">
                  <Package className="w-4 h-4 text-cyan-400" />
                  <span>Package Contents ({cart.items.length} items)</span>
                </h3>

                <div className="divide-y divide-violet-900/30 rounded-2xl bg-[#140F30] border border-violet-800/30 p-3 sm:p-4">
                  {cart.items.map((i) => (
                    <div
                      key={i.id}
                      className="py-3 flex items-center justify-between text-xs gap-3 first:pt-1 last:pb-1"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {i.product?.images?.[0]?.url ? (
                          <img
                            src={i.product.images[0].url}
                            alt={i.product.name}
                            className="w-14 h-14 object-contain rounded-xl bg-[#18113A] p-1.5 border border-violet-900/40 shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-[#18113A] flex items-center justify-center text-violet-400 border border-violet-900/40 shrink-0">
                            <Package className="w-6 h-6" />
                          </div>
                        )}
                        <div className="min-w-0">
                          <h4 className="font-extrabold text-white text-sm truncate">
                            {i.product?.name || 'Electronics Product'}
                          </h4>
                          <p className="text-slate-400 text-xs mt-0.5">
                            Qty: <strong className="text-slate-200">{i.quantity}</strong> &times;{' '}
                            {formatINR(i.price)}
                          </p>
                        </div>
                      </div>
                      <span className="font-black text-cyan-300 text-sm sm:text-base shrink-0">
                        {formatINR(i.price * i.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Coupon Box */}
              <div className="p-4 rounded-2xl bg-[#161036] border border-violet-800/40 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-200 flex items-center gap-1.5">
                    <Tag className="w-4 h-4 text-cyan-400" />
                    <span>Have a Promo / Discount Coupon?</span>
                  </span>
                  {coupon && (
                    <button
                      type="button"
                      onClick={() => removeCoupon()}
                      className="text-rose-400 hover:text-rose-300 font-bold"
                    >
                      Remove ({coupon.code})
                    </button>
                  )}
                </div>

                {!coupon ? (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      placeholder="e.g. WELCOME500"
                      className="flex-1 p-2.5 rounded-xl border border-violet-700/60 bg-[#120D2C] text-white font-bold text-xs uppercase placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                    <button
                      type="submit"
                      disabled={couponLoading}
                      className="px-5 py-2.5 bg-violet-700 hover:bg-violet-600 text-white rounded-xl font-bold text-xs transition"
                    >
                      {couponLoading ? 'Checking...' : 'Apply'}
                    </button>
                  </form>
                ) : (
                  <div className="p-2.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center justify-between">
                    <span>Coupon &quot;{coupon.code}&quot; applied successfully!</span>
                    <span className="text-emerald-400 font-black">-{formatINR(discount)} OFF</span>
                  </div>
                )}

                {couponFeedback && (
                  <p
                    className={`text-xs font-semibold ${
                      couponFeedback.error ? 'text-rose-400' : 'text-emerald-400'
                    }`}
                  >
                    {couponFeedback.text}
                  </p>
                )}
              </div>

              {/* Delivery Speed / Assurance Note */}
              <div className="p-4 rounded-2xl bg-cyan-950/40 border border-cyan-600/40 flex items-start gap-3 text-xs text-cyan-200">
                <Truck className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <strong className="font-extrabold text-white block">
                    Express Dispatch from Bareilly Hub
                  </strong>
                  <p className="text-slate-300">
                    Same-day processing for orders placed before 2:00 PM. Delivered safely via Delhivery / Bluedart with SMS & WhatsApp tracking updates.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-violet-800/50 hover:bg-violet-950/60 text-slate-300 font-bold text-xs transition"
                >
                  &larr; Back to Address
                </button>
                <button
                  type="button"
                  onClick={handleConfirmSummary}
                  className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl shadow-violet-900/40 flex items-center justify-center gap-2 transition hover:scale-[1.02]"
                >
                  <span>Confirm Order & Open Payment Window</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ===================================================================
              PAGE 4: PAYMENT WINDOW
              =================================================================== */}
          {currentStep === 4 && (
            <div className="bg-[#120D2C]/95 backdrop-blur-xl rounded-3xl border border-violet-800/50 p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-violet-900/40">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 to-indigo-600 text-white font-black text-xs flex items-center justify-center shadow-md">
                    4
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-white">Step 4: Payment Window</h2>
                    <p className="text-xs text-slate-300">
                      Payment must be completed before order placement is authorized
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="text-xs font-bold text-cyan-300 hover:underline flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Review Summary</span>
                </button>
              </div>

              {/* Final Amount Due Strip */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-violet-950 via-[#18113A] to-cyan-950/60 border border-violet-700/50 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                    Total Amount Authorized for this Order
                  </span>
                  <span className="text-2xl sm:text-3xl font-black text-white">
                    {formatINR(finalTotal)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full inline-block">
                    🔒 SSL Encrypted & Verified
                  </span>
                </div>
              </div>

              {/* Payment Mode Selection Pills */}
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-wider text-cyan-300 block">
                  Select Your Payment Method:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {/* UPI */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('UPI')}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-xs font-extrabold transition ${
                      paymentMethod === 'UPI'
                        ? 'border-cyan-400 bg-violet-950/80 text-cyan-200 ring-2 ring-cyan-400/40 shadow-lg'
                        : 'border-violet-900/40 bg-[#161036] text-slate-300 hover:border-violet-700'
                    }`}
                  >
                    <Smartphone className="w-6 h-6 text-cyan-400" />
                    <span>Instant UPI (GPay/PhonePe)</span>
                  </button>

                  {/* Net Banking */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('NET_BANKING')}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-xs font-extrabold transition ${
                      paymentMethod === 'NET_BANKING'
                        ? 'border-cyan-400 bg-violet-950/80 text-cyan-200 ring-2 ring-cyan-400/40 shadow-lg'
                        : 'border-violet-900/40 bg-[#161036] text-slate-300 hover:border-violet-700'
                    }`}
                  >
                    <Building className="w-6 h-6 text-indigo-400" />
                    <span>Bank Transfer (NEFT/IMPS)</span>
                  </button>

                  {/* COD */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CASH_ON_DELIVERY')}
                    className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 text-xs font-extrabold transition ${
                      paymentMethod === 'CASH_ON_DELIVERY'
                        ? 'border-amber-400 bg-amber-950/60 text-amber-200 ring-2 ring-amber-400/40 shadow-lg'
                        : 'border-violet-900/40 bg-[#161036] text-slate-300 hover:border-violet-700'
                    }`}
                  >
                    <Banknote className="w-6 h-6 text-amber-400" />
                    <span>Cash on Delivery</span>
                  </button>
                </div>
              </div>

              {/* PAYMENT OPTION 1: UPI WINDOW */}
              {paymentMethod === 'UPI' && (
                <div className="p-5 sm:p-6 rounded-3xl bg-[#140F30] border border-cyan-500/40 space-y-5">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-300">
                    <QrCode className="w-5 h-5 text-cyan-400" />
                    <span>Live Kotak Mahindra UPI Gateway</span>
                  </div>

                  <div className="flex flex-col md:flex-row items-center gap-6">
                    {/* Dynamic QR Box */}
                    <div className="bg-white p-3 rounded-2xl shadow-xl flex flex-col items-center shrink-0">
                      <img
                        src={qrCodeUrl}
                        alt="Kotak UPI QR Code"
                        className="w-44 h-44 object-contain"
                      />
                      <span className="text-[10px] font-black text-slate-800 mt-1 uppercase tracking-wider">
                        Scan with any UPI App
                      </span>
                    </div>

                    {/* Step Instructions */}
                    <div className="flex-1 space-y-3 text-xs">
                      <div className="p-3.5 rounded-xl bg-[#18113A] border border-violet-800/40 space-y-2">
                        <div className="text-slate-300">
                          1. Scan QR code or pay to official Kotak UPI ID:
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#120D2C] border border-violet-900/50">
                          <span className="font-mono font-bold text-white text-sm">
                            7300791957@kotak
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy('7300791957@kotak', 'upi1')}
                            className="px-2.5 py-1 rounded bg-violet-700 hover:bg-violet-600 text-white font-bold text-[11px]"
                          >
                            {copiedKey === 'upi1' ? 'Copied!' : 'Copy UPI'}
                          </button>
                        </div>
                        <div className="flex items-center justify-between p-2 rounded-lg bg-[#120D2C] border border-violet-900/50">
                          <span className="font-mono font-bold text-slate-300 text-xs">
                            Phonepe7300791957-2@axl
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopy('Phonepe7300791957-2@axl', 'upi2')}
                            className="px-2.5 py-1 rounded bg-violet-700 hover:bg-violet-600 text-white font-bold text-[11px]"
                          >
                            {copiedKey === 'upi2' ? 'Copied!' : 'Copy'}
                          </button>
                        </div>
                      </div>

                      {/* Direct mobile pay intent button */}
                      <a
                        href={upiPayLink}
                        className="block w-full text-center py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs shadow-md transition"
                      >
                        ⚡ Open GPay / PhonePe / Paytm on this device
                      </a>
                    </div>
                  </div>

                  {/* Mandatory UTR / Transaction Reference Input */}
                  <div className="pt-2 border-t border-violet-900/40 space-y-3">
                    <div>
                      <label className="text-slate-100 font-extrabold text-xs block mb-1">
                        Enter 12-Digit UPI UTR / Transaction Reference Number *
                      </label>
                      <p className="text-[11px] text-slate-400 mb-2">
                        You will find this 12-digit number (e.g. 428901234567) on your Google Pay / PhonePe / Paytm payment success receipt.
                      </p>
                      <input
                        type="text"
                        required
                        value={transactionRef}
                        onChange={(e) => setTransactionRef(e.target.value)}
                        placeholder="e.g. 428901234567 (12 digits)"
                        className="w-full p-3.5 rounded-xl border border-cyan-500/60 bg-[#161036] text-white font-mono font-bold text-sm placeholder-slate-400 focus:bg-[#1E1547] focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 focus:outline-none transition"
                      />
                    </div>

                    <label className="flex items-start gap-3 p-3 rounded-xl bg-[#161036] border border-violet-800/40 cursor-pointer text-xs">
                      <input
                        type="checkbox"
                        checked={upiPaidConfirmed}
                        onChange={(e) => setUpiPaidConfirmed(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded text-cyan-500 focus:ring-cyan-400"
                      />
                      <span className="text-slate-200 font-semibold leading-relaxed">
                        I confirm that I have sent exactly <strong className="text-cyan-300 font-bold">{formatINR(finalTotal)}</strong> to Arora Mobile Hub and entered my correct UTR reference.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* PAYMENT OPTION 2: NET BANKING / NEFT */}
              {paymentMethod === 'NET_BANKING' && (
                <div className="p-5 sm:p-6 rounded-3xl bg-[#140F30] border border-indigo-500/40 space-y-4 text-xs">
                  <div className="flex items-center gap-2 font-black uppercase tracking-wider text-indigo-300">
                    <Building className="w-5 h-5 text-indigo-400" />
                    <span>Official Current Account Details</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-[#161036] border border-violet-800/40 space-y-2 leading-relaxed">
                    <div className="flex justify-between py-1 border-b border-violet-900/30">
                      <span className="text-slate-400">Account Name:</span>
                      <strong className="text-white">ARORA MOBILES AND GADGET HUB</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-violet-900/30">
                      <span className="text-slate-400">Bank Name:</span>
                      <strong className="text-white">Kotak Mahindra Bank</strong>
                    </div>
                    <div className="flex justify-between py-1 border-b border-violet-900/30">
                      <span className="text-slate-400">Account Number:</span>
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-mono">5949282265</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy('5949282265', 'acc')}
                          className="text-[10px] text-cyan-300 underline"
                        >
                          {copiedKey === 'acc' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between py-1 border-b border-violet-900/30">
                      <span className="text-slate-400">IFSC Code:</span>
                      <div className="flex items-center gap-2">
                        <strong className="text-white font-mono">KKBK0005315</strong>
                        <button
                          type="button"
                          onClick={() => handleCopy('KKBK0005315', 'ifsc')}
                          className="text-[10px] text-cyan-300 underline"
                        >
                          {copiedKey === 'ifsc' ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-slate-400">Branch:</span>
                      <span className="text-slate-200">Bareilly Branch, Uttar Pradesh</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-100 font-extrabold text-xs block mb-1">
                      Enter Bank Transfer Reference / UTR Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={transactionRef}
                      onChange={(e) => setTransactionRef(e.target.value)}
                      placeholder="e.g. IMPS-918237461 or NEFT-48192"
                      className="w-full p-3.5 rounded-xl border border-indigo-500/60 bg-[#161036] text-white font-mono font-bold text-sm placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>
              )}

              {/* PAYMENT OPTION 3: CASH ON DELIVERY */}
              {paymentMethod === 'CASH_ON_DELIVERY' && (
                <div className="p-5 sm:p-6 rounded-3xl bg-[#140F30] border border-amber-500/40 space-y-4 text-xs">
                  <div className="flex items-center gap-2 font-black uppercase tracking-wider text-amber-300">
                    <Banknote className="w-5 h-5 text-amber-400" />
                    <span>Cash on Delivery Verification</span>
                  </div>

                  <p className="text-slate-300 leading-relaxed">
                    You have chosen to pay on delivery. Please have the exact amount of{' '}
                    <strong className="text-amber-300 font-extrabold">{formatINR(finalTotal)}</strong>{' '}
                    ready in cash or scan the courier&apos;s UPI QR scanner when the delivery agent reaches your address.
                  </p>

                  <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-[#161036] border border-amber-500/30 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={codConfirmed}
                      onChange={(e) => setCodConfirmed(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-amber-500 focus:ring-amber-400"
                    />
                    <span className="text-slate-200 font-semibold leading-relaxed">
                      I confirm that I will pay <strong className="text-white font-bold">{formatINR(finalTotal)}</strong> in cash or via courier UPI upon delivery at my address.
                    </span>
                  </label>
                </div>
              )}

              {/* Submission CTA in Step 4 */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl border border-violet-800/50 hover:bg-violet-950/60 text-slate-300 font-bold text-xs transition"
                >
                  &larr; Back to Order Summary
                </button>

                <button
                  type="button"
                  onClick={handleCompletePaymentAndPlaceOrder}
                  disabled={placingOrder}
                  className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-sm shadow-2xl shadow-emerald-950/70 flex items-center justify-center gap-2 transition hover:scale-[1.02] disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {placingOrder
                      ? 'Authorizing Order...'
                      : paymentMethod === 'CASH_ON_DELIVERY'
                      ? `Confirm & Place Order for COD • ${formatINR(finalTotal)}`
                      : `Submit Verified Payment & Place Order • ${formatINR(finalTotal)}`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Progress & Pricing Sidebar (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#120D2C]/95 backdrop-blur-xl rounded-3xl border border-violet-800/50 p-6 shadow-2xl space-y-5">
            <h3 className="text-xs font-black uppercase tracking-wider text-cyan-300 pb-3 border-b border-violet-900/40 flex items-center justify-between">
              <span>Checkout Progress</span>
              <span className="text-white font-extrabold">Step {currentStep} of 4</span>
            </h3>

            {/* Stepper Status Indicators */}
            <div className="space-y-2 text-xs">
              <div
                className={`p-2.5 rounded-xl flex items-center justify-between ${
                  isAccountVerified ? 'bg-emerald-950/60 text-emerald-300' : 'bg-[#161036] text-slate-400'
                }`}
              >
                <span>1. Account Information</span>
                <span>{isAccountVerified ? '✔ Verified' : 'Pending'}</span>
              </div>
              <div
                className={`p-2.5 rounded-xl flex items-center justify-between ${
                  isAddressVerified ? 'bg-emerald-950/60 text-emerald-300' : 'bg-[#161036] text-slate-400'
                }`}
              >
                <span>2. Address Details</span>
                <span>{isAddressVerified ? '✔ Confirmed' : 'Pending'}</span>
              </div>
              <div
                className={`p-2.5 rounded-xl flex items-center justify-between ${
                  isSummaryConfirmed ? 'bg-emerald-950/60 text-emerald-300' : 'bg-[#161036] text-slate-400'
                }`}
              >
                <span>3. Order Summary</span>
                <span>{isSummaryConfirmed ? '✔ Reviewed' : 'Pending'}</span>
              </div>
              <div
                className={`p-2.5 rounded-xl flex items-center justify-between ${
                  currentStep === 4 ? 'bg-cyan-950/60 text-cyan-300 font-bold' : 'bg-[#161036] text-slate-400'
                }`}
              >
                <span>4. Payment Window</span>
                <span>{currentStep === 4 ? '⚡ Active' : 'Locked'}</span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="pt-2 border-t border-violet-900/40 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-300">
                <span>Items Subtotal:</span>
                <span className="font-bold text-white">{formatINR(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Coupon Discount:</span>
                  <span>-{formatINR(discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span>Delivery Charges:</span>
                <span className="font-bold text-emerald-400">
                  {deliveryCharge === 0 ? 'FREE' : formatINR(deliveryCharge)}
                </span>
              </div>
              <div className="pt-3 border-t border-violet-900/40 flex justify-between items-baseline">
                <span className="font-extrabold text-white text-sm">Total Payable:</span>
                <span className="font-black text-cyan-300 text-xl sm:text-2xl">
                  {formatINR(finalTotal)}
                </span>
              </div>
            </div>

            {/* Dynamic Step Action Button (NEVER allows premature order placement!) */}
            <div className="pt-2">
              {currentStep === 1 && (
                <button
                  type="button"
                  onClick={() => handleConfirmAccount()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl transition flex items-center justify-center gap-2"
                >
                  <span>Continue to Delivery Address</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 2 && (
                <button
                  type="button"
                  onClick={() => handleConfirmAddress()}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl transition flex items-center justify-center gap-2"
                >
                  <span>Continue to Order Summary</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 3 && (
                <button
                  type="button"
                  onClick={handleConfirmSummary}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-black text-xs shadow-xl transition flex items-center justify-center gap-2"
                >
                  <span>Continue to Payment Window</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}

              {currentStep === 4 && (
                <button
                  type="button"
                  onClick={handleCompletePaymentAndPlaceOrder}
                  disabled={placingOrder}
                  className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-black text-xs shadow-2xl shadow-emerald-950/70 transition flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {placingOrder
                      ? 'Authorizing Order...'
                      : paymentMethod === 'CASH_ON_DELIVERY'
                      ? `Place COD Order • ${formatINR(finalTotal)}`
                      : `Submit Payment & Place Order`}
                  </span>
                </button>
              )}
            </div>

            <div className="pt-2 border-t border-violet-900/40 text-[11px] text-slate-400 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>100% Purchase Protection by Arora Mobile Hub</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-cyan-400 shrink-0" />
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
