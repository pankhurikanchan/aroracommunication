import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { FloatingConcierge } from '../components/common/FloatingConcierge';
import { Background3D } from '../components/common/Background3D';

export const RootLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#0B0819] text-slate-100 relative selection:bg-violet-600 selection:text-white">
      <Background3D />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
        <FloatingConcierge />
      </div>
    </div>
  );
};

