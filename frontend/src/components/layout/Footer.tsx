import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Truck,
  RotateCcw,
  CreditCard,
  MessageCircle,
} from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      {/* Trust Badges Bar */}
      <div className="max-w-7xl mx-auto px-4 pb-10 border-b border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">100% Genuine</h4>
              <p className="text-xs text-slate-400">Official brand warranties</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Fast Pan-India Delivery</h4>
              <p className="text-xs text-slate-400">Same-day dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">7-Day Replacement</h4>
              <p className="text-xs text-slate-400">Hassle-free return policy</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-indigo-950/80 border border-indigo-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-white font-bold text-sm">Secure Payments</h4>
              <p className="text-xs text-slate-400">UPI, Cards, NetBanking, COD</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Info & Address */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-md">
                <div className="w-full h-full bg-slate-900 rounded-[6px] flex items-center justify-center">
                  <span className="text-white font-black text-sm">AC</span>
                </div>
              </div>
              <span className="text-xl font-extrabold text-white tracking-tight">
                ARORA <span className="text-indigo-400 font-light">COMMUNICATION</span>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed pr-4">
              Arora Communication is your premier destination for genuine smartphones, flagship laptops,
              premium audio gear, and authentic mobile accessories. Serving customers with trust, expert advice,
              and great prices.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <span>Shop #14, Arora Complex, Main Commercial Market, Sector 18, Noida, Uttar Pradesh 201301</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>+91 98765 43210 / 0120-4567890</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>support@aroracommunication.com</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Mon - Sun: 10:00 AM – 9:30 PM (Open All 7 Days)</span>
              </div>
            </div>

            {/* WhatsApp Contact button */}
            <div className="pt-2">
              <a
                href="https://wa.me/919876543210?text=Hello%20Arora%20Communication%2C%20I%20have%20an%20inquiry%20about%20a%20product."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs transition shadow-sm"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Quick Categories */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Top Categories</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/category/smartphones" className="hover:text-cyan-400 transition">Smartphones</Link>
              </li>
              <li>
                <Link to="/category/iphones" className="hover:text-cyan-400 transition">Apple iPhones</Link>
              </li>
              <li>
                <Link to="/category/android-phones" className="hover:text-cyan-400 transition">Android Flagships</Link>
              </li>
              <li>
                <Link to="/category/earphones" className="hover:text-cyan-400 transition">TWS Earbuds & ANC</Link>
              </li>
              <li>
                <Link to="/category/smartwatches" className="hover:text-cyan-400 transition">Smartwatches</Link>
              </li>
              <li>
                <Link to="/category/laptops" className="hover:text-cyan-400 transition">Laptops & MacBooks</Link>
              </li>
              <li>
                <Link to="/category/chargers" className="hover:text-cyan-400 transition">Fast GaN Chargers</Link>
              </li>
              <li>
                <Link to="/category/accessories" className="hover:text-cyan-400 transition">Mobile Accessories</Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Customer Care</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/account?tab=orders" className="hover:text-cyan-400 transition">Track Your Order</Link>
              </li>
              <li>
                <Link to="/return-policy" className="hover:text-cyan-400 transition">Return & Replacement Policy</Link>
              </li>
              <li>
                <Link to="/shipping-policy" className="hover:text-cyan-400 transition">Shipping & Delivery Rates</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition">Store Locator & Helpdesk</Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-cyan-400 transition">My Account</Link>
              </li>
              <li>
                <Link to="/deals" className="hover:text-cyan-400 transition">Current Offers & Coupons</Link>
              </li>
            </ul>
          </div>

          {/* Legal Policies */}
          <div>
            <h3 className="text-white font-bold text-sm mb-4 uppercase tracking-wider">Legal & Store Policies</h3>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition">About Arora Communication</Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-cyan-400 transition">Privacy Policy</Link>
              </li>
              <li>
                <Link to="/terms-conditions" className="hover:text-cyan-400 transition">Terms & Conditions</Link>
              </li>
              <li>
                <Link to="/warranty-policy" className="hover:text-cyan-400 transition">Warranty & Service Centers</Link>
              </li>
              <li>
                <Link to="/admin" className="text-slate-500 hover:text-slate-400 transition">Admin Portal</Link>
              </li>
            </ul>

            <div className="mt-6">
              <span className="text-[11px] font-semibold text-slate-400 block mb-2 uppercase">Payment Modes</span>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-medium text-slate-300">
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">UPI</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">RuPay</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Visa</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Mastercard</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">Net Banking</span>
                <span className="bg-slate-800 px-2 py-1 rounded border border-slate-700">COD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="max-w-7xl mx-auto px-4 pt-6 border-t border-slate-800/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-3">
        <p>© 2026 Arora Communication. All rights reserved.</p>
        <p className="text-[11px]">
          Designed with ❤️ for authentic Indian electronics shopping &bull; 100% Secure Checkout
        </p>
      </div>
    </footer>
  );
};
