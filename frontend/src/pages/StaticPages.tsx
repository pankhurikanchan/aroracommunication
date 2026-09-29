import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8 text-xs leading-relaxed text-slate-700">
      <div className="border-b border-slate-200 pb-4">
        <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Our Heritage</span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">About Aurora Mobile Hub</h1>
        <p className="text-sm text-slate-500 mt-1">Bareilly’s premier physical electronics store and India's trusted digital destination</p>
      </div>

      <div className="space-y-4 text-sm text-slate-600">
        <p>
          Located at <strong>C-15, Ekta Nagar, Bareilly, Uttar Pradesh</strong>, <strong>Aurora Mobile Hub</strong> is Bareilly's foremost destination for genuine smartphones, flagship laptops, high-performance audio gear, and authentic mobile accessories.
        </p>
        <p>
          Unlike faceless online marketplaces, every single product sold by Aurora Mobile Hub is 100% brand authentic, brand-new in sealed retail packaging, backed by authorized manufacturer warranties and official GST invoices (GSTIN: 09DIYPA1147P1ZK).
        </p>
        <p>
          Our mission is to bring the trusted relationship, expert advice, and unbeatable value of our physical Bareilly showroom to customers across all of India through express doorstep shipping.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 text-center space-y-1">
          <div className="text-2xl font-black text-indigo-700">50,000+</div>
          <div className="text-xs font-bold text-slate-800">Happy Customers</div>
        </div>
        <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 text-center space-y-1">
          <div className="text-2xl font-black text-emerald-700">100%</div>
          <div className="text-xs font-bold text-slate-800">Official Brand Warranty</div>
        </div>
        <div className="p-5 rounded-2xl bg-cyan-50 border border-cyan-100 text-center space-y-1">
          <div className="text-2xl font-black text-cyan-700">24 Hours</div>
          <div className="text-xs font-bold text-slate-800">Fast Dispatch Rate</div>
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
        <p className="text-sm text-slate-500 mt-1">Visit our Bareilly showroom or reach our phone & WhatsApp support</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs">
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Aurora Mobile Hub Retail Store</h3>

          <div className="space-y-3 text-slate-600">
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900 block">Store Address:</strong>
                C-15, Ekta Nagar, Bareilly, Uttar Pradesh
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-cyan-600 shrink-0" />
              <div>
                <strong className="text-slate-900 block">Phone / Helpline:</strong>
                <a href="tel:+917300791957" className="text-indigo-600 font-bold hover:underline">+91 73007 91957</a> /{' '}
                <a href="tel:+919027122120" className="text-indigo-600 font-bold hover:underline">+91 90271 22120</a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <strong className="text-slate-900 block">GST Number:</strong>
                <span className="font-semibold text-slate-800">09DIYPA1147P1ZK</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
              <div>
                <strong className="text-slate-900 block">Support Email:</strong>
                support@auroramobilehub.com
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
              alert('Thank you! Your inquiry has been forwarded to our Bareilly store executive.');
            }}
            className="space-y-3"
          >
            <div>
              <label className="font-semibold block mb-1">Your Name</label>
              <input type="text" required placeholder="Full Name" className="w-full p-2.5 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Mobile Number</label>
              <input type="tel" required placeholder="+91 73007 91957" className="w-full p-2.5 rounded-xl border border-slate-300" />
            </div>
            <div>
              <label className="font-semibold block mb-1">Message / Product Inquiry</label>
              <textarea rows={3} required placeholder="Ask about phone availability, offers, or bulk purchases..." className="w-full p-2.5 rounded-xl border border-slate-300" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow transition">
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
    <p>At Aurora Mobile Hub, customer satisfaction and genuine trust are our top priorities. We offer a transparent 7-day replacement guarantee on all mobile devices and electronics.</p>
    <h3 className="text-sm font-bold text-slate-900">Eligibility for Replacement:</h3>
    <ul className="list-disc pl-5 space-y-1">
      <li>Item arrived damaged in transit or with physical defect.</li>
      <li>Item is functionally defective out of the box.</li>
      <li>Incorrect product or model variant delivered.</li>
    </ul>
    <h3 className="text-sm font-bold text-slate-900">Return Process:</h3>
    <p>Simply message our WhatsApp support (+91 73007 91957 / +91 90271 22120) or email support@auroramobilehub.com with your Order Number and unboxing photos/video. A return pickup will be dispatched promptly.</p>
  </div>
);

export const ShippingPolicyPage: React.FC = () => (
  <div className="max-w-4xl mx-auto px-4 py-12 space-y-6 text-xs text-slate-700 leading-relaxed">
    <h1 className="text-3xl font-extrabold text-slate-900 pb-2 border-b border-slate-200">Shipping & Delivery Policy</h1>
    <p>All orders placed on Aurora Mobile Hub are dispatched with insured express courier partners including Blue Dart, Delhivery, DTDC, and Express Air Cargo.</p>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <h4 className="font-bold text-slate-900 text-sm mb-1">Bareilly & UP Delivery</h4>
        <p>Same-day or next-day delivery for local orders.</p>
      </div>
      <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
        <h4 className="font-bold text-slate-900 text-sm mb-1">Pan-India Express</h4>
        <p>2 to 4 business days across all Indian states and pin codes.</p>
      </div>
    </div>
  </div>
);
