import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      if (res.user?.role === 'ADMIN' && (redirect === '/' || redirect === '')) {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    } else {
      setError(res.message || 'Login failed');
    }
  };

  const handleDirectOwnerLogin = async () => {
    setError(null);
    setLoading(true);
    setEmail('pankhuri@aroramobilehub.com');
    setPassword('Pankhuri@Arora2026');
    const res = await login('pankhuri@aroramobilehub.com', 'Pankhuri@Arora2026');
    setLoading(false);
    if (res.success) {
      navigate('/admin');
    } else {
      setError(res.message || 'Login failed');
    }
  };

  const handleDemoAdmin = () => {
    setEmail('pankhuri@aroramobilehub.com');
    setPassword('Pankhuri@Arora2026');
  };

  const handleDemoCustomer = () => {
    setEmail('customer@example.com');
    setPassword('Customer@123');
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200/90 p-8 shadow-xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-1">
          <Link to="/" className="inline-flex items-center gap-2 mb-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-indigo-600 to-cyan-500 p-0.5 shadow-md">
              <div className="w-full h-full bg-slate-900 rounded-[10px] flex items-center justify-center text-white font-black text-xs">
                AM
              </div>
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">
              ARORA <span className="text-indigo-600 font-light">MOBILE HUB</span>
            </span>
          </Link>
          <h1 className="text-xl font-extrabold text-slate-900">Welcome Back</h1>
          <p className="text-xs text-slate-500">Sign in to your account to manage orders and track shipments</p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/25 transition flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <span>Signing In...</span> : <span>Sign In</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Store Owner Quick Portal Card */}
        <div className="pt-2 border-t border-slate-100 space-y-2">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-indigo-500/10 to-purple-500/10 border border-amber-300/70 text-center">
            <span className="text-[11px] font-extrabold uppercase text-amber-900 block tracking-wider">
              👑 Store Owner & Administrator: Pankhuri Kanchan
            </span>
            <p className="text-[11px] text-slate-600 mt-0.5 mb-2.5">
              Access product catalog management, view customer orders & update shipping statuses
            </p>
            <button
              type="button"
              disabled={loading}
              onClick={handleDirectOwnerLogin}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-indigo-600 hover:from-amber-700 hover:to-indigo-700 text-white font-extrabold text-xs shadow-md transition flex items-center justify-center gap-2 hover:scale-[1.01]"
            >
              <ShieldCheck className="w-4 h-4 text-amber-200" />
              <span>Launch Pankhuri Kanchan Admin Panel</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-1">
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="p-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold border border-indigo-200 transition text-[11px]"
            >
              Fill Pankhuri Admin Creds
            </button>
            <button
              type="button"
              onClick={handleDemoCustomer}
              className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold border border-slate-200 transition text-[11px]"
            >
              Fill Customer Creds
            </button>
          </div>
        </div>

        <div className="text-center text-xs text-slate-500 pt-1">
          Don't have an account?{' '}
          <Link to={`/register?redirect=${redirect}`} className="text-indigo-600 font-bold hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
