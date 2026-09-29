import React, { useState, useEffect } from 'react';
import { MessageCircle, ArrowUp, X, Sparkles } from 'lucide-react';

export const FloatingConcierge: React.FC = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3 pointer-events-none">
      {/* WhatsApp Help Floating Pill */}
      <div className="relative pointer-events-auto flex items-center">
        {/* Tooltip speech bubble */}
        {showTooltip && (
          <div className="hidden sm:flex items-center gap-2 mr-3 px-3 py-1.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-in fade-in slide-in-from-right-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Need advice? Chat with an expert</span>
            <button
              onClick={() => setShowTooltip(false)}
              className="text-slate-400 hover:text-white p-0.5"
              aria-label="Close tooltip"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        )}

        <a
          href="https://wa.me/917300791957?text=Hello%20Aurora%20Mobile%20Hub%2C%20I%20have%20a%20question%20about%20a%20product%20on%20your%20website."
          target="_blank"
          rel="noopener noreferrer"
          className="group flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs shadow-xl shadow-emerald-600/30 transition-all duration-300 hover:scale-105 active:scale-95"
          title="Chat with Aurora Mobile Hub on WhatsApp (+91 73007 91957)"
        >
          <MessageCircle className="w-5 h-5 fill-current" />
          <span className="hidden sm:inline">WhatsApp Help</span>
        </a>
      </div>

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="pointer-events-auto w-10 h-10 rounded-full bg-slate-900/90 hover:bg-slate-900 text-white border border-slate-700/80 shadow-xl flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95 backdrop-blur-md animate-in fade-in slide-in-from-bottom-2"
          aria-label="Scroll to top"
          title="Back to top"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
