import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Tags,
  Sparkles,
  Ticket,
  MessageSquare,
  Users,
  Store,
  LogOut,
  ShieldCheck,
  Image,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-100">
        <div className="bg-white p-8 rounded-3xl border border-slate-200 max-w-md w-full text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Admin Privileges Required</h2>
          <p className="text-xs text-slate-500">
            You must be logged in as an administrator to access the Arora Communication management panel.
          </p>
          <div className="pt-2 flex gap-3">
            <Link
              to="/login?redirect=/admin"
              className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow"
            >
              Admin Sign In
            </Link>
            <Link
              to="/"
              className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-xl text-xs font-semibold"
            >
              Back to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { title: 'Dashboard', path: '/admin', icon: <LayoutDashboard className="w-4 h-4" /> },
    { title: 'Products & Inventory', path: '/admin/products', icon: <Package className="w-4 h-4" /> },
    { title: 'Orders & Shipments', path: '/admin/orders', icon: <ShoppingCart className="w-4 h-4" /> },
    { title: 'Categories', path: '/admin/categories', icon: <Tags className="w-4 h-4" /> },
    { title: 'Coupons & Promos', path: '/admin/coupons', icon: <Ticket className="w-4 h-4" /> },
    { title: 'Homepage Banners', path: '/admin/banners', icon: <Image className="w-4 h-4" /> },
    { title: 'Customer Reviews', path: '/admin/reviews', icon: <MessageSquare className="w-4 h-4" /> },
    { title: 'Registered Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0 border-r border-slate-800">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-xs">
              AC
            </div>
            <div>
              <div className="text-sm font-extrabold text-white tracking-tight leading-tight">
                ARORA ADMIN
              </div>
              <div className="text-[10px] text-cyan-400 font-semibold tracking-wider uppercase">
                Management Portal
              </div>
            </div>
          </Link>
        </div>

        {/* Links */}
        <nav className="p-4 space-y-1 flex-1 text-xs">
          {menuItems.map((item) => {
            const isActive =
              item.path === '/admin'
                ? location.pathname === '/admin'
                : location.pathname.startsWith(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-semibold transition ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {item.icon}
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 space-y-2 text-xs">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <Store className="w-4 h-4 text-cyan-400" />
            <span>View Public Store</span>
          </Link>

          <button
            onClick={() => {
              logout();
              navigate('/');
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 transition text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header */}
        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs text-slate-400">Admin Control Panel</span>
            <div className="text-base font-bold text-slate-800">
              Arora Communication Business Hub
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-600 font-medium">Logged in as:</span>
            <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
              {user.name} (Admin)
            </span>
          </div>
        </header>

        {/* Page Outlet */}
        <main className="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
