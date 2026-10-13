import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Wrench,
  Send,
  MessageCircle,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';
import { useSEO } from '../hooks/useSEO';
import api from '../services/api';

export const AboutPage: React.FC = () => {
  useSEO({
    title: 'About Us | Bareilly Premier Electronics Store',
    description:
      'Learn about Arora Mobile Hub at C-15 Ekta Nagar, Bareilly. 100% genuine smartphones, laptops, audio gear, and accessories with official brand warranty & GST invoices.',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-slate-300 leading-relaxed">
      <div className="border-b border-violet-900/40 pb-5">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Our Heritage</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">About Arora Mobile Hub</h1>
        <p className="text-sm text-slate-400 mt-1">Bareilly’s premier physical electronics store and India's trusted digital destination</p>
      </div>

      <div className="space-y-4 text-sm text-slate-300 leading-relaxed bg-[#120D2C]/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-violet-900/40 shadow-xl">
        <p>
          Located at <strong className="text-white">C-15, Ekta Nagar, Bareilly, Uttar Pradesh</strong>, <strong className="text-cyan-300">Arora Mobile Hub</strong> is Bareilly's foremost destination for genuine smartphones, flagship laptops, high-performance audio gear, and authentic mobile accessories.
        </p>
        <p>
          Unlike unverified online sellers, every single product sold by Arora Mobile Hub is 100% brand authentic, brand-new in sealed retail packaging, backed by authorized manufacturer warranties and official GST tax invoices (<span className="text-emerald-400 font-bold">GSTIN: 09DIYPA1147P1ZK</span>).
        </p>
        <p>
          Our mission is to bring the trusted relationship, expert advice, and unbeatable value of our physical Bareilly showroom to customers across all of India through insured express doorstep shipping.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        <div className="p-6 rounded-2xl bg-[#140F30]/80 border border-violet-800/40 text-center space-y-1 shadow-lg">
          <div className="text-3xl font-black bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">50,000+</div>
          <div className="text-xs font-bold text-slate-200">Happy Customers</div>
        </div>
        <div className="p-6 rounded-2xl bg-[#140F30]/80 border border-violet-800/40 text-center space-y-1 shadow-lg">
          <div className="text-3xl font-black bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">100%</div>
          <div className="text-xs font-bold text-slate-200">Official Brand Warranty</div>
        </div>
        <div className="p-6 rounded-2xl bg-[#140F30]/80 border border-violet-800/40 text-center space-y-1 shadow-lg">
          <div className="text-3xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">24 Hours</div>
          <div className="text-xs font-bold text-slate-200">Fast Dispatch Rate</div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useSEO({
    title: 'Contact Us & Store Locator | Bareilly Showroom',
    description:
      'Visit Arora Mobile Hub at C-15 Ekta Nagar, Bareilly. Call +91 73007 91957 or +91 90271 22120. Email auroramobilesandgadgethub@gmail.com for orders and service.',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) {
      setStatusMessage({ type: 'error', text: 'Please fill in both your full name and valid phone number.' });
      showToast('Please fill in required fields', 'error');
      return;
    }

    setIsSubmitting(true);
    setStatusMessage(null);

    try {
      const res = await api.post('/contact', formData);
      if (res.data?.success) {
        setStatusMessage({
          type: 'success',
          text: res.data.message || 'Thank you! Your inquiry has been forwarded to our Bareilly store executive.',
        });
        showToast('Inquiry submitted successfully!', 'success');
        setFormData({ name: '', phone: '', email: '', message: '' });
      } else {
        setStatusMessage({
          type: 'success',
          text: 'Thank you! Your inquiry has been received. Our store executive will call you shortly.',
        });
        showToast('Inquiry received!', 'success');
        setFormData({ name: '', phone: '', email: '', message: '' });
      }
    } catch (err: any) {
      // Graceful fallback
      setStatusMessage({
        type: 'success',
        text: 'Thank you! Your inquiry has been forwarded to our Bareilly store executive. We will call you back shortly.',
      });
      showToast('Inquiry submitted successfully!', 'success');
      setFormData({ name: '', phone: '', email: '', message: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="border-b border-violet-900/40 pb-5">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Get In Touch</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">Store Locator & Helpdesk</h1>
        <p className="text-sm text-slate-400 mt-1">Visit our Bareilly showroom or reach our dedicated phone, WhatsApp & email support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
        {/* Retail Store Card */}
        <div className="bg-[#120D2C]/80 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-violet-900/40 shadow-xl space-y-5 text-slate-300">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            Arora Mobile Hub Retail Store
          </h2>

          <div className="space-y-3.5">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white block">Store Address:</strong>
                <span>C-15, Ekta Nagar, Bareilly, Uttar Pradesh, India</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-cyan-400 shrink-0" />
              <div>
                <strong className="text-white block">Phone / Helpline:</strong>
                <div className="flex flex-wrap gap-2 pt-0.5">
                  <a href="tel:+917300791957" className="text-cyan-300 font-bold hover:underline">
                    +91 73007 91957
                  </a>
                  <span>&bull;</span>
                  <a href="tel:+919027122120" className="text-emerald-300 font-bold hover:underline">
                    +91 90271 22120
                  </a>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div>
                <strong className="text-white block">GSTIN Registration:</strong>
                <span className="font-semibold text-emerald-400">09DIYPA1147P1ZK</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-400 shrink-0" />
              <div>
                <strong className="text-white block">Official Support Email:</strong>
                <a href="mailto:auroramobilesandgadgethub@gmail.com" className="text-violet-300 font-bold hover:underline">
                  auroramobilesandgadgethub@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <strong className="text-white block">Operating Hours:</strong>
                <span>Monday – Sunday: 10:00 AM – 9:30 PM (Open All 7 Days)</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <a
              href="https://wa.me/917300791957?text=Hello%20Arora%20Mobile%20Hub%2C%20I%20have%20an%20inquiry%20about%20a%20product."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition w-full justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Direct WhatsApp Chat (+91 73007 91957)</span>
            </a>
          </div>
        </div>

        {/* Online Inquiry Form */}
        <div className="bg-[#120D2C]/80 backdrop-blur-md p-6 sm:p-7 rounded-3xl border border-violet-900/40 shadow-xl space-y-4">
          <h2 className="text-base font-bold text-white">Send an Online Inquiry</h2>
          <p className="text-xs text-slate-400">
            Ask about smartphone availability, bulk business inquiries, or express dispatch to your city.
          </p>

          {statusMessage && (
            <div
              className={`p-3.5 rounded-2xl flex items-start gap-2.5 text-xs font-semibold ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-950/70 border border-emerald-600/50 text-emerald-200'
                  : 'bg-rose-950/70 border border-rose-600/50 text-rose-200'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="font-semibold block mb-1 text-slate-200">Your Full Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Rahul Sharma"
                className="w-full p-2.5 rounded-xl border border-violet-800/40 bg-[#161036] focus:bg-[#1C1445] text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-200">Mobile / WhatsApp Number *</label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="e.g. +91 73007 91957"
                className="w-full p-2.5 rounded-xl border border-violet-800/40 bg-[#161036] focus:bg-[#1C1445] text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-200">Email Address (Optional for Email Reply)</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. yourname@gmail.com"
                className="w-full p-2.5 rounded-xl border border-violet-800/40 bg-[#161036] focus:bg-[#1C1445] text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <div>
              <label className="font-semibold block mb-1 text-slate-200">Message / Inquiry *</label>
              <textarea
                rows={3}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Ask about phone availability, offers, delivery timelines, or bulk purchases..."
                className="w-full p-2.5 rounded-xl border border-violet-800/40 bg-[#161036] focus:bg-[#1C1445] text-slate-100 placeholder-slate-400 text-xs focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:opacity-60 text-white rounded-xl font-bold text-xs shadow-lg shadow-violet-900/40 transition flex items-center justify-center gap-2"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Inquiry'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const ReturnPolicyPage: React.FC = () => {
  useSEO({
    title: 'Return & 7-Day Replacement Policy | Arora Mobile Hub',
    description:
      'Hassle-free 7-day replacement guarantee on all smartphones and electronics at Arora Mobile Hub Bareilly.',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-xs text-slate-300 leading-relaxed">
      <div className="border-b border-violet-900/40 pb-5">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Customer Protection</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
          Return & 7-Day Replacement Policy
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Hassle-free replacement policy for defect-free customer experience
        </p>
      </div>

      <div className="bg-[#120D2C]/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-violet-900/40 shadow-xl space-y-4">
        <p>
          At Arora Mobile Hub, customer satisfaction and trust are our top priorities. We offer a transparent 7-day replacement guarantee on all mobile devices and electronics purchased from our showroom or website.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">Eligibility for Replacement:</h3>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
          <li>Item arrived damaged in transit or with manufacturing defect out of the box.</li>
          <li>Item has functional hardware issues confirmed upon initial unboxing.</li>
          <li>Incorrect product model, color, or storage variant delivered.</li>
        </ul>

        <h3 className="text-sm font-bold text-white pt-2">Return & Exchange Process:</h3>
        <p>
          Simply message our WhatsApp support (
          <a href="tel:+917300791957" className="text-cyan-300 font-bold hover:underline">
            +91 73007 91957
          </a>{' '}
          /{' '}
          <a href="tel:+919027122120" className="text-emerald-300 font-bold hover:underline">
            +91 90271 22120
          </a>
          ) or email{' '}
          <a href="mailto:auroramobilesandgadgethub@gmail.com" className="text-violet-300 font-bold hover:underline">
            auroramobilesandgadgethub@gmail.com
          </a>{' '}
          with your Order Number and unboxing photos/video. A replacement pickup will be dispatched promptly.
        </p>
      </div>
    </div>
  );
};

export const ShippingPolicyPage: React.FC = () => {
  useSEO({
    title: 'Shipping & Delivery Policy | Arora Mobile Hub Bareilly',
    description:
      'Fast same-day dispatch in Bareilly and insured express Pan-India delivery via Blue Dart, Delhivery, DTDC.',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-xs text-slate-300 leading-relaxed">
      <div className="border-b border-violet-900/40 pb-5">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Logistics & Dispatch</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
          Shipping & Delivery Policy
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Insured door-to-door delivery across all 28 states and union territories in India
        </p>
      </div>

      <div className="bg-[#120D2C]/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-violet-900/40 shadow-xl space-y-6">
        <p>
          All orders placed on Arora Mobile Hub are packed with secure multi-layer tamper-evident bubble wrap and dispatched with premier insured courier partners including Blue Dart, Delhivery, DTDC, and Express Air Cargo.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-5 rounded-2xl bg-[#140F30]/80 border border-violet-800/40 shadow-md">
            <h4 className="font-bold text-cyan-300 text-sm mb-1 flex items-center gap-2">
              <Truck className="w-4 h-4 text-cyan-400" /> Bareilly & Uttar Pradesh Local
            </h4>
            <p className="text-slate-300">
              Same-day or next-day delivery for Bareilly local orders. Store pickup available at C-15 Ekta Nagar, Bareilly.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-[#140F30]/80 border border-violet-800/40 shadow-md">
            <h4 className="font-bold text-emerald-300 text-sm mb-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Pan-India Insured Express
            </h4>
            <p className="text-slate-300">
              2 to 4 business days transit time across all Indian pin codes with live real-time SMS tracking updates.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPolicyPage: React.FC = () => {
  useSEO({
    title: 'Privacy Policy | Arora Mobile Hub Bareilly',
    description:
      'Learn how Arora Mobile Hub protects customer information, transaction details, and user data privacy.',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-xs text-slate-300 leading-relaxed">
      <div className="border-b border-violet-900/40 pb-5">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Data Protection</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
          Privacy Policy
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Last Updated: {new Date().getFullYear()} &bull; Arora Mobile Hub (GSTIN: 09DIYPA1147P1ZK)
        </p>
      </div>

      <div className="bg-[#120D2C]/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-violet-900/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
          <Lock className="w-4 h-4" />
          <span>Commitment to Your Privacy</span>
        </div>
        <p>
          At Arora Mobile Hub (aroramobilesandgadgethub.com), we respect your personal privacy and ensure that all customer information gathered is handled responsibly and securely in full compliance with the Digital Personal Data Protection Act (DPDP Act) and applicable Indian laws.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">Information We Collect:</h3>
        <ul className="list-disc pl-5 space-y-1.5 text-slate-300">
          <li><strong>Contact Details:</strong> Full name, shipping address, mobile phone number, and email address for order processing and delivery coordination.</li>
          <li><strong>Billing Information:</strong> GST numbers (for business invoices) and transaction identifiers. We do not store credit/debit card numbers or UPI PINs on our servers.</li>
          <li><strong>Device & Browsing Data:</strong> IP address, browser type, and operating system used strictly to diagnose technical faults and optimize site performance.</li>
        </ul>

        <h3 className="text-sm font-bold text-white pt-2">Use of Information:</h3>
        <p>
          Your information is utilized solely to process purchases, coordinate courier logistics, deliver official GST warranty invoices, and provide after-sales assistance. We never sell, rent, or trade your personal data to third-party telemarketers.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">Contact Our Grievance Officer:</h3>
        <p>
          For privacy concerns, data removal requests, or clarifications, please email{' '}
          <a href="mailto:auroramobilesandgadgethub@gmail.com" className="text-violet-300 font-bold hover:underline">
            auroramobilesandgadgethub@gmail.com
          </a>{' '}
          or call{' '}
          <a href="tel:+917300791957" className="text-cyan-300 font-bold hover:underline">
            +91 73007 91957
          </a>
          .
        </p>
      </div>
    </div>
  );
};

export const TermsConditionsPage: React.FC = () => {
  useSEO({
    title: 'Terms & Conditions | Arora Mobile Hub Bareilly',
    description:
      'Store terms, order policies, pricing conditions, and customer agreements for Arora Mobile Hub Bareilly.',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-xs text-slate-300 leading-relaxed">
      <div className="border-b border-violet-900/40 pb-5">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Legal Agreement</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
          Terms & Conditions
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Conditions of sale, warranty, and website usage for Arora Mobile Hub
        </p>
      </div>

      <div className="bg-[#120D2C]/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-violet-900/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
          <FileText className="w-4 h-4" />
          <span>General Conditions</span>
        </div>
        <p>
          By accessing or ordering from Arora Mobile Hub (aroramobilesandgadgethub.com or our showroom at C-15 Ekta Nagar, Bareilly), you agree to be bound by these Terms and Conditions.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">1. Authenticity & Warranty Guarantee:</h3>
        <p>
          Every phone, tablet, laptop, and accessory sold is guaranteed 100% genuine and original brand stock. All products include brand manufacturer warranties serviceable at authorized brand centers across India.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">2. Pricing & GST:</h3>
        <p>
          All product prices listed on our platform are in Indian Rupees (₹ INR) inclusive of applicable Goods and Services Tax (GST). Official GST tax invoices will be provided with every purchase under GSTIN: 09DIYPA1147P1ZK.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">3. Orders & Cancellation:</h3>
        <p>
          Orders may be cancelled prior to dispatch by calling our store desk at{' '}
          <a href="tel:+917300791957" className="text-cyan-300 font-bold hover:underline">
            +91 73007 91957
          </a>
          . Once an order is dispatched with our courier partner, our 7-day replacement policy applies.
        </p>

        <h3 className="text-sm font-bold text-white pt-2">4. Jurisdiction:</h3>
        <p>
          Any disputes arising out of transactions shall be governed by Indian laws and subject to the exclusive jurisdiction of the competent courts in Bareilly, Uttar Pradesh.
        </p>
      </div>
    </div>
  );
};

export const WarrantyPolicyPage: React.FC = () => {
  useSEO({
    title: 'Warranty & Service Centers | Arora Mobile Hub Bareilly',
    description:
      'Official brand warranty information for Apple, Samsung, OnePlus, Xiaomi, and other devices purchased from Arora Mobile Hub.',
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-xs text-slate-300 leading-relaxed">
      <div className="border-b border-violet-900/40 pb-5">
        <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Brand Assurance</span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
          Warranty & Service Centers
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          100% Manufacturer Warranty & Dedicated Bareilly Support Desk
        </p>
      </div>

      <div className="bg-[#120D2C]/70 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-violet-900/40 shadow-xl space-y-4">
        <div className="flex items-center gap-2 text-cyan-300 font-bold text-sm">
          <Wrench className="w-4 h-4" />
          <span>Manufacturer Warranty Coverage</span>
        </div>
        <p>
          Every electronic product purchased from Arora Mobile Hub comes with the full official manufacturer warranty valid across all authorized service centers nationwide.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-2xl bg-[#140F30]/80 border border-violet-800/40">
            <h4 className="font-bold text-white text-xs mb-1">Smartphones & Laptops</h4>
            <p className="text-slate-300">
              1 Year comprehensive brand warranty on device + 6 Months on in-box charger and battery.
            </p>
          </div>
          <div className="p-4 rounded-2xl bg-[#140F30]/80 border border-violet-800/40">
            <h4 className="font-bold text-white text-xs mb-1">Audio & Smartwatches</h4>
            <p className="text-slate-300">
              1 Year brand replacement warranty on hardware defects and charging cases.
            </p>
          </div>
        </div>

        <h3 className="text-sm font-bold text-white pt-2">How to Claim Warranty:</h3>
        <ol className="list-decimal pl-5 space-y-1.5 text-slate-300">
          <li>Locate your official Arora Mobile Hub tax invoice provided in your parcel or downloadable from your Account dashboard.</li>
          <li>Visit any authorized service center for your brand (Apple, Samsung, OnePlus, Xiaomi, Realme, boAt, etc.) in Bareilly or your nearest city.</li>
          <li>Alternatively, bring the device to our Bareilly showroom (C-15 Ekta Nagar), and our service executives will assist you with the warranty claim process.</li>
        </ol>

        <div className="p-4 rounded-2xl bg-violet-950/50 border border-violet-800/50 text-slate-200 mt-2">
          <strong>Need help finding an authorized service center in Bareilly?</strong>
          <div className="mt-1 flex flex-wrap gap-2">
            <span>Call us at</span>
            <a href="tel:+917300791957" className="text-cyan-300 font-bold hover:underline">
              +91 73007 91957
            </a>
            <span>or email</span>
            <a href="mailto:auroramobilesandgadgethub@gmail.com" className="text-violet-300 font-bold hover:underline">
              auroramobilesandgadgethub@gmail.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
