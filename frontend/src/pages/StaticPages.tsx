import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-xs leading-relaxed text-slate-700">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Our Heritage</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">About Arora Communication</h1>
        <p className="text-sm text-slate-500 mt-1">From a premier physical tech store to India's trusted online electronics portal</p>
      </div>

      <div className="space-y-4 text-sm text-slate-600">
        <p>
          Founded over a decade ago in the heart of Delhi-NCR (Sector 18, Noida), <strong>Arora Communication</strong> has grown into one of Northern India’s most trusted retail destinations for genuine mobile handsets, electronics, and accessories.
        </p>
        <p>
          Unlike faceless marketplaces with dubious third-party merchants, every product purchased on Arora Communication is 100% authentic, brand-new, and sourced straight from authorized distributors with complete manufacturer warranties and valid GST invoices.
        </p>
        <p>
          Our mission is to bring the personal touch, warmth, and reliable pricing of our brick-and-mortar storefront to tech lovers across all of India through our digital shopping platform.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center space-y-1">
          <div className="text-2xl font-black text-indigo-700">100,000+</div>
          <div className="text-xs font-bold text-slate-800">Satisfied Buyers</div>
        </div>
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-1">
          <div className="text-2xl font-black text-emerald-700">100%</div>
          <div className="text-xs font-bold text-slate-800">Genuine Brand Warranty</div>
        </div>
        <div className="p-5 rounded-2xl bg-cyan-50 border border-cyan-100 text-center space-y-1">
          <div className="text-2xl font-black text-cyan-700">24 Hours</div>
          <div className="text-xs font-bold text-slate-800">Same-Day Dispatch Rate</div>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Get In Touch</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">Store Locator & Helpdesk</h1>
        <p className="text-sm text-slate-500 mt-1">Visit our physical shop or reach our mobile support team</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Arora Communication Retail Store</h3>

          <div className="space-y-3 text-slate-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Store Address:</strong>
                Shop #14, Arora Complex, Main Commercial Market, Sector 18, Noida, Uttar Pradesh - 201301
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-cyan-600 shrink-0" />
              <div>
                <strong className="text-slate-900 block">Phone / Helpline:</strong>
                +91 98765 43210 / 0120-4567890
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <strong className="text-slate-900 block">Support Email:</strong>
                support@aroracommunication.com
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-amber-600 shrink-0" />
              <div>
                <strong className="text-slate-900 block">Operating Hours:</strong>
                Monday to Sunday: 10:00 AM – 9:30 PM (Open All 7 Days)
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
          <h3 className="text-base font-bold text-slate-900">Send an Online Inquiry</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              alert('Thank you! Your inquiry has been forwarded to our Noida store executive.');
            }}
            className="space-y-3"
          >
            <div>
              <label className="font-semibold block mb-1">Your Name</label>
              <input type="text" required placeholder="Full Name" className="w-full p-2.5 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Mobile Number</label>
              <input type="tel" required placeholder="+91 98765 43210" className="w-full p-2.5 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Message / Product Inquiry</label>
              <textarea rows={3} required placeholder="Ask about phone availability, offers, or bulk purchases..." className="w-full p-2.5 rounded-xl border border-slate-300" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-indigo-600 text-white rounded-xl font-bold shadow">
              Submit Inquiry
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export const ReturnPolicyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-xs text-slate-700 leading-relaxed">
    <h1 className="text-3xl font-extrabold text-slate-900 pb-2 border-b border-slate-200">Return & 7-Day Replacement Policy</h1>
    <p>At Arora Communication, your satisfaction and trust are paramount. We offer a transparent, customer-first 7-day replacement guarantee on all mobile devices and electronics.</p>
    <h3 className="text-sm font-bold text-slate-900">Eligibility for Replacement:</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>Item arrived damaged in transit or with physical defect.</li>
      <li>Item is functionally defective out of the box.</li>
      <li>Incorrect product or model variant delivered.</li>
    </ul>
    <h3 className="text-sm font-bold text-slate-900">Return Process:</h3>
    <p>Simply message our WhatsApp support (+91 98765 43210) or email support@aroracommunication.com with your Order Number and photos/video. A return pickup will be dispatched within 24 hours.</p>
  </div>
);

export const ShippingPolicyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-xs text-slate-700 leading-relaxed">
    <h1 className="text-3xl font-extrabold text-slate-900 pb-2 border-b border-slate-200">Shipping & Delivery Policy</h1>
    <p>All orders placed on Arora Communication are dispatched via premier courier services including Blue Dart, Delhivery, DTDC, and Express Air Cargo.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <h4 className="font-bold text-slate-900 text-sm mb-1">Delhi-NCR Delivery</h4>
        <p>Same-day or next-day delivery for orders confirmed before 2:00 PM.</p>
      </div>
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <h4 className="font-bold text-slate-900 text-sm mb-1">Pan-India Express</h4>
        <p>2 to 4 business days across all Indian states and pin codes.</p>
      </div>
    </div>
  </div>
);
