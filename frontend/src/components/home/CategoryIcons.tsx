import React from 'react';

interface CategoryIconProps {
  className?: string;
}

// 1. Smartphones (Flagship Modern Smartphone)
export const SmartphoneIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="phone-body" x1="14" y1="4" x2="34" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5" />
          <stop offset="1" stopColor="#312E81" />
        </linearGradient>
        <linearGradient id="phone-screen" x1="16" y1="7" x2="32" y2="41" gradientUnits="userSpaceOnUse">
          <stop stopColor="#818CF8" />
          <stop offset="0.5" stopColor="#6366F1" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
        <linearGradient id="phone-sheen" x1="16" y1="7" x2="28" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" stopOpacity="0.5" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Outer Case / Chassis */}
      <rect x="13" y="4" width="22" height="40" rx="4.5" fill="url(#phone-body)" stroke="#6366F1" strokeWidth="1.2" />
      {/* Side Volume Buttons */}
      <rect x="11.5" y="11" width="1.5" height="4" rx="0.75" fill="#818CF8" />
      <rect x="11.5" y="17" width="1.5" height="4" rx="0.75" fill="#818CF8" />
      {/* Side Power Button */}
      <rect x="35" y="13" width="1.5" height="6" rx="0.75" fill="#818CF8" />
      {/* Screen Area */}
      <rect x="15" y="6.5" width="18" height="35" rx="3" fill="url(#phone-screen)" />
      {/* Glass Sheen */}
      <path d="M15 6.5L33 24V41.5H23L15 28V6.5Z" fill="url(#phone-sheen)" />
      {/* Punch Hole Camera */}
      <circle cx="24" cy="9.5" r="1.2" fill="#0F172A" />
      <circle cx="24.4" cy="9.2" r="0.4" fill="#60A5FA" />
      {/* Wallpaper UI Shapes */}
      <circle cx="24" cy="22" r="5" fill="#C7D2FE" fillOpacity="0.35" className="animate-pulse-glow" />
      <circle cx="26" cy="24" r="3" fill="#A5B4FC" fillOpacity="0.45" />
      {/* Bottom Home Indicator */}
      <rect x="20" y="38.5" width="8" height="1.2" rx="0.6" fill="#FFFFFF" fillOpacity="0.85" />
    </svg>
  </div>
);

// 2. iPhones (Apple iPhone with Dynamic Island & Titanium Rails)
export const IPhoneIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="iphone-rim" x1="13" y1="4" x2="35" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#94A3B8" />
          <stop offset="0.5" stopColor="#CBD5E1" />
          <stop offset="1" stopColor="#64748B" />
        </linearGradient>
        <linearGradient id="iphone-screen" x1="15" y1="6" x2="33" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F172A" />
          <stop offset="0.6" stopColor="#1E1B4B" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>
        <linearGradient id="iphone-bloom" x1="16" y1="18" x2="32" y2="38" gradientUnits="userSpaceOnUse">
          <stop stopColor="#EC4899" />
          <stop offset="0.5" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#3B82F6" />
        </linearGradient>
      </defs>
      {/* Titanium Body */}
      <rect x="13" y="4" width="22" height="40" rx="5" fill="url(#iphone-rim)" />
      {/* Side Action Button */}
      <rect x="11.8" y="10" width="1.2" height="3" rx="0.6" fill="#64748B" />
      <rect x="11.8" y="15" width="1.2" height="4.5" rx="0.6" fill="#64748B" />
      <rect x="11.8" y="21" width="1.2" height="4.5" rx="0.6" fill="#64748B" />
      {/* Side Power */}
      <rect x="35" y="14" width="1.2" height="7" rx="0.6" fill="#64748B" />
      {/* Screen Frame */}
      <rect x="14.8" y="5.8" width="18.4" height="36.4" rx="4" fill="url(#iphone-screen)" />
      {/* Atmospheric Wallpaper Aura */}
      <circle cx="24" cy="27" r="6.5" fill="url(#iphone-bloom)" fillOpacity="0.45" className="animate-pulse-glow" />
      {/* Dynamic Island Pill */}
      <rect x="20" y="8" width="8" height="2.6" rx="1.3" fill="#000000" />
      <circle cx="21.5" cy="9.3" r="0.8" fill="#1E293B" />
      <circle cx="26" cy="9.3" r="0.6" fill="#10B981" className="animate-ping" style={{ animationDuration: '3s' }} />
      {/* Home Indicator */}
      <rect x="20.5" y="39" width="7" height="1.2" rx="0.6" fill="#FFFFFF" fillOpacity="0.8" />
    </svg>
  </div>
);

// 3. Android Phones (Curved Edge Bezel & Material You Colors)
export const AndroidIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="android-body" x1="14" y1="4" x2="34" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#059669" />
          <stop offset="1" stopColor="#065F46" />
        </linearGradient>
        <linearGradient id="android-screen" x1="15" y1="6" x2="33" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#064E3B" />
          <stop offset="0.6" stopColor="#047857" />
          <stop offset="1" stopColor="#10B981" />
        </linearGradient>
      </defs>
      {/* Body Frame */}
      <rect x="13.5" y="4" width="21" height="40" rx="3.5" fill="url(#android-body)" stroke="#10B981" strokeWidth="1" />
      {/* Screen */}
      <rect x="15" y="5.5" width="18" height="37" rx="2.5" fill="url(#android-screen)" />
      {/* Punch Hole */}
      <circle cx="24" cy="8.5" r="1.1" fill="#022C22" />
      <circle cx="24.3" cy="8.3" r="0.3" fill="#34D399" />
      {/* Material You Clock Widget */}
      <circle cx="24" cy="20" r="5" stroke="#A7F3D0" strokeWidth="1.2" strokeDasharray="1.5 2" fill="none" className="animate-spin" style={{ animationDuration: '24s' }} />
      <circle cx="24" cy="20" r="1.5" fill="#FBBF24" />
      <line x1="24" y1="20" x2="24" y2="17.5" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="24" y1="20" x2="26.5" y2="20" stroke="#FFFFFF" strokeWidth="1.2" strokeLinecap="round" />
      {/* Google Bar Pill */}
      <rect x="17.5" y="28.5" width="13" height="3.5" rx="1.75" fill="#FFFFFF" fillOpacity="0.25" />
      <circle cx="20" cy="30.25" r="1" fill="#34D399" />
      <circle cx="23" cy="30.25" r="1" fill="#60A5FA" />
      <circle cx="26" cy="30.25" r="1" fill="#F87171" />
      <circle cx="28.5" cy="30.25" r="0.8" fill="#FBBF24" />
      {/* Bottom Nav */}
      <line x1="20" y1="39.5" x2="28" y2="39.5" stroke="#A7F3D0" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  </div>
);

// 4. Tablets (iPad / High-Res Tablet with Stylus)
export const TabletIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="tablet-body" x1="8" y1="6" x2="38" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0284C7" />
          <stop offset="1" stopColor="#075985" />
        </linearGradient>
        <linearGradient id="tablet-screen" x1="11" y1="9" x2="35" y2="39" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0C4A6E" />
          <stop offset="0.5" stopColor="#0284C7" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      {/* Tablet Chassis */}
      <rect x="8" y="7" width="30" height="34" rx="4" fill="url(#tablet-body)" stroke="#38BDF8" strokeWidth="1" />
      {/* Screen */}
      <rect x="10.5" y="9.5" width="25" height="29" rx="2.5" fill="url(#tablet-screen)" />
      {/* Camera Dot */}
      <circle cx="23" cy="8.2" r="0.75" fill="#38BDF8" />
      {/* Creative Canvas Waves */}
      <path d="M12 28C16 23 20 31 25 26C29 22 32 27 34 25" stroke="#BAE6FD" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="28" cy="18" r="3.5" fill="#F472B6" fillOpacity="0.6" className="animate-pulse-glow" />
      {/* Stylus / Apple Pencil at side */}
      <g className="animate-pulse-glow" style={{ animationDuration: '2s' }}>
        <rect x="39" y="11" width="2" height="24" rx="1" fill="#E2E8F0" stroke="#0284C7" strokeWidth="0.5" />
        <path d="M39 11L40 8L41 11H39Z" fill="#38BDF8" />
        <circle cx="40" cy="10" r="0.4" fill="#0C4A6E" />
      </g>
    </svg>
  </div>
);

// 5. Laptops (Open High-Performance Ultrabook)
export const LaptopIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="laptop-screen-border" x1="10" y1="8" x2="38" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#3B82F6" />
          <stop offset="1" stopColor="#1E40AF" />
        </linearGradient>
        <linearGradient id="laptop-screen" x1="12" y1="10" x2="36" y2="28" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F172A" />
          <stop offset="0.5" stopColor="#1E293B" />
          <stop offset="1" stopColor="#2563EB" />
        </linearGradient>
      </defs>
      {/* Laptop Screen Lid */}
      <rect x="10" y="8" width="28" height="20" rx="2.5" fill="url(#laptop-screen-border)" stroke="#60A5FA" strokeWidth="0.8" />
      {/* Display */}
      <rect x="12" y="10" width="24" height="16" rx="1.5" fill="url(#laptop-screen)" />
      {/* Webcam */}
      <circle cx="24" cy="9" r="0.6" fill="#93C5FD" />
      {/* Code / Visual UI Lines on Screen */}
      <line x1="14" y1="13" x2="22" y2="13" stroke="#60A5FA" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="16" x2="26" y2="16" stroke="#A78BFA" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="14" y1="19" x2="20" y2="19" stroke="#34D399" strokeWidth="1.2" strokeLinecap="round" />
      <rect x="27" y="13" width="7" height="9" rx="1" fill="#3B82F6" fillOpacity="0.4" className="animate-pulse-glow" />
      {/* Base / Keyboard Deck */}
      <path d="M5 33C5 30 7 28 9 28H39C41 28 43 30 43 33V35C43 36.1 42.1 37 41 37H7C5.9 37 5 36.1 5 35V33Z" fill="#1E293B" stroke="#3B82F6" strokeWidth="0.8" />
      {/* Trackpad */}
      <rect x="20.5" y="32" width="7" height="3" rx="0.5" fill="#334155" stroke="#64748B" strokeWidth="0.5" />
      {/* Notched Open Lip */}
      <rect x="21.5" y="28" width="5" height="1" rx="0.5" fill="#60A5FA" />
    </svg>
  </div>
);

// 6. Smartwatches (Apple/Galaxy Watch with Heartbeat & Crown)
export const SmartwatchIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="watch-case" x1="15" y1="12" x2="33" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7C3AED" />
          <stop offset="0.5" stopColor="#5B21B6" />
          <stop offset="1" stopColor="#4C1D95" />
        </linearGradient>
        <linearGradient id="watch-strap" x1="18" y1="4" x2="30" y2="44" gradientUnits="userSpaceOnUse">
          <stop stopColor="#A78BFA" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      {/* Top Strap */}
      <path d="M19 4H29V13H19V4Z" fill="url(#watch-strap)" rx="2" />
      {/* Bottom Strap */}
      <path d="M19 35H29V44H19V35Z" fill="url(#watch-strap)" rx="2" />
      {/* Digital Crown & Side Button */}
      <rect x="33.5" y="18" width="2" height="4.5" rx="1" fill="#C4B5FD" />
      <rect x="33.5" y="25" width="1.5" height="3" rx="0.75" fill="#8B5CF6" />
      {/* Watch Case */}
      <rect x="14" y="11" width="20" height="26" rx="6.5" fill="url(#watch-case)" stroke="#A78BFA" strokeWidth="1" />
      {/* AMOLED Screen */}
      <rect x="16" y="13" width="16" height="22" rx="4.5" fill="#0F172A" />
      {/* Time Text 09:41 */}
      <text x="24" y="20" textAnchor="middle" fill="#FFFFFF" fontSize="4.5" fontWeight="bold" fontFamily="sans-serif">
        09:41
      </text>
      {/* Pulsing ECG / Heartbeat Line */}
      <path
        d="M17 26.5H20L21.5 23.5L23.5 29.5L25 25L26.5 27.5H31"
        stroke="#EC4899"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="animate-pulse-glow"
      />
      {/* Heart Icon */}
      <circle cx="24" cy="31" r="1.5" fill="#F43F5E" className="animate-heartbeat" />
    </svg>
  </div>
);

// 7. Earphones (TWS True Wireless Stereo Earbuds)
export const EarphoneIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="tws-case" x1="12" y1="18" x2="36" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F43F5E" />
          <stop offset="0.6" stopColor="#E11D48" />
          <stop offset="1" stopColor="#9F1239" />
        </linearGradient>
      </defs>
      {/* Charging Case Body */}
      <rect x="13" y="20" width="22" height="20" rx="7" fill="url(#tws-case)" stroke="#FDA4AF" strokeWidth="1" />
      {/* Case Lid Cutline */}
      <line x1="13" y1="26" x2="35" y2="26" stroke="#881337" strokeWidth="1" />
      {/* Case LED Battery Indicator */}
      <circle cx="24" cy="33" r="1.2" fill="#34D399" className="animate-ping" style={{ animationDuration: '2.5s' }} />
      <circle cx="24" cy="33" r="1.2" fill="#10B981" />
      {/* Left Earbud (Floating with Soundwave) */}
      <g className="animate-icon-float" style={{ animationDelay: '0.2s' }}>
        <circle cx="18" cy="12" r="4.5" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="1" />
        <rect x="18.5" y="12" width="2.5" height="9" rx="1.2" fill="#FFE4E6" stroke="#F43F5E" strokeWidth="0.8" />
        <circle cx="17.5" cy="11.5" r="1.5" fill="#E11D48" />
      </g>
      {/* Right Earbud (Floating with Soundwave) */}
      <g className="animate-icon-float" style={{ animationDelay: '0.6s' }}>
        <circle cx="30" cy="12" r="4.5" fill="#FFF1F2" stroke="#F43F5E" strokeWidth="1" />
        <rect x="27" y="12" width="2.5" height="9" rx="1.2" fill="#FFE4E6" stroke="#F43F5E" strokeWidth="0.8" />
        <circle cx="30.5" cy="11.5" r="1.5" fill="#E11D48" />
      </g>
      {/* Soft Soundwave arcs */}
      <path d="M10 11C10 7 12 5 13 4" stroke="#FB7185" strokeWidth="1" strokeLinecap="round" className="animate-pulse-glow" />
      <path d="M38 11C38 7 36 5 35 4" stroke="#FB7185" strokeWidth="1" strokeLinecap="round" className="animate-pulse-glow" />
    </svg>
  </div>
);

// 8. Headphones (Over-Ear Studio Headphones with Animated Equalizer Bars)
export const HeadphoneIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="headphone-band" x1="10" y1="6" x2="38" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F43F5E" />
          <stop offset="0.5" stopColor="#E11D48" />
          <stop offset="1" stopColor="#BE123C" />
        </linearGradient>
        <linearGradient id="cup-left" x1="8" y1="20" x2="16" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB7185" />
          <stop offset="1" stopColor="#9F1239" />
        </linearGradient>
        <linearGradient id="cup-right" x1="32" y1="20" x2="40" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FB7185" />
          <stop offset="1" stopColor="#9F1239" />
        </linearGradient>
      </defs>
      {/* Padded Headband Arch */}
      <path
        d="M13 24C13 13.5 17.5 7 24 7C30.5 7 35 13.5 35 24"
        stroke="url(#headphone-band)"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
      {/* Metallic Telescopic Adjusters */}
      <rect x="11.5" y="19" width="2" height="6" rx="1" fill="#E2E8F0" />
      <rect x="34.5" y="19" width="2" height="6" rx="1" fill="#E2E8F0" />
      {/* Left Ear Cushion & Cup */}
      <rect x="9" y="21" width="6.5" height="15" rx="3.2" fill="url(#cup-left)" stroke="#FDA4AF" strokeWidth="0.8" />
      {/* Right Ear Cushion & Cup */}
      <rect x="32.5" y="21" width="6.5" height="15" rx="3.2" fill="url(#cup-right)" stroke="#FDA4AF" strokeWidth="0.8" />
      {/* Center Animated Equalizer Soundwaves */}
      <g className="text-rose-500">
        <line x1="19" y1="31" x2="19" y2="21" stroke="#F43F5E" strokeWidth="1.8" strokeLinecap="round" className="animate-eq-1" />
        <line x1="22.5" y1="33" x2="22.5" y2="17" stroke="#FB7185" strokeWidth="1.8" strokeLinecap="round" className="animate-eq-2" />
        <line x1="26" y1="34" x2="26" y2="16" stroke="#E11D48" strokeWidth="1.8" strokeLinecap="round" className="animate-eq-3" />
        <line x1="29.5" y1="31" x2="29.5" y2="20" stroke="#F43F5E" strokeWidth="1.8" strokeLinecap="round" className="animate-eq-4" />
      </g>
    </svg>
  </div>
);

// 9. Chargers (GaN Fast Charger with Lightning Bolt Surge)
export const ChargerIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="charger-block" x1="13" y1="12" x2="35" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="0.6" stopColor="#D97706" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
        <linearGradient id="bolt-grad" x1="22" y1="17" x2="28" y2="35" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FEF08A" />
          <stop offset="1" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      {/* Wall AC Plug Prongs */}
      <rect x="18" y="5" width="2.5" height="7" rx="1" fill="#CBD5E1" />
      <rect x="27.5" y="5" width="2.5" height="7" rx="1" fill="#CBD5E1" />
      {/* Charger Main Brick Body */}
      <rect x="12" y="11" width="24" height="28" rx="5" fill="url(#charger-block)" stroke="#FDE68A" strokeWidth="1" />
      {/* Dual Type-C Output Ports at bottom */}
      <rect x="17" y="34.5" width="5" height="2" rx="1" fill="#78350F" />
      <rect x="26" y="34.5" width="5" height="2" rx="1" fill="#78350F" />
      {/* Glowing Lightning Bolt */}
      <path
        d="M26 15L18 25H24L22 33L30 23H24L26 15Z"
        fill="url(#bolt-grad)"
        stroke="#FFFFFF"
        strokeWidth="0.8"
        strokeLinejoin="round"
        className="animate-pulse-glow"
      />
    </svg>
  </div>
);

// 10. Power Banks (Digital Fast Charging Battery Bank)
export const PowerBankIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="bank-body" x1="14" y1="8" x2="34" y2="42" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981" />
          <stop offset="0.6" stopColor="#059669" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
      </defs>
      {/* Power Bank Chassis */}
      <rect x="14" y="6" width="20" height="36" rx="4.5" fill="url(#bank-body)" stroke="#6EE7B7" strokeWidth="1" />
      {/* Top Ports */}
      <rect x="18" y="7" width="4" height="1.8" rx="0.9" fill="#064E3B" />
      <rect x="26" y="7" width="4" height="1.8" rx="0.9" fill="#064E3B" />
      {/* Digital LED Screen / Battery Gauge */}
      <rect x="17" y="13" width="14" height="8" rx="2" fill="#064E3B" stroke="#34D399" strokeWidth="0.6" />
      <text x="24" y="19" textAnchor="middle" fill="#6EE7B7" fontSize="4.2" fontWeight="bold" fontFamily="monospace">
        100%
      </text>
      {/* 4 Sequential LED Charging Dots */}
      <circle cx="18" cy="27" r="1.3" fill="#A7F3D0" className="animate-battery-dot-1" />
      <circle cx="22" cy="27" r="1.3" fill="#A7F3D0" className="animate-battery-dot-2" />
      <circle cx="26" cy="27" r="1.3" fill="#A7F3D0" className="animate-battery-dot-3" />
      <circle cx="30" cy="27" r="1.3" fill="#A7F3D0" className="animate-battery-dot-4" />
      {/* Fast Charge Logo */}
      <path d="M25 33L21.5 37H24.5L23 40L26.5 36H23.5L25 33Z" fill="#FDE047" className="animate-pulse-glow" />
    </svg>
  </div>
);

// 11. Cables (High-Speed Braided Fast Charging Cable)
export const CableIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="cable-head" x1="12" y1="10" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F59E0B" />
          <stop offset="1" stopColor="#B45309" />
        </linearGradient>
      </defs>
      {/* Braided Cable Loops */}
      <path
        d="M17 19C17 29 34 26 34 35C34 40 28 42 23 40C18 38 18 31 23 27C27 24 33 24 33 16"
        stroke="#D97706"
        strokeWidth="3.2"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M17 19C17 29 34 26 34 35C34 40 28 42 23 40C18 38 18 31 23 27C27 24 33 24 33 16"
        stroke="#FDE68A"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="2 3"
        fill="none"
        className="animate-pulse-glow"
      />
      {/* Left Connector Head (USB-C) */}
      <rect x="14" y="11" width="6" height="8" rx="1.5" fill="url(#cable-head)" stroke="#FBBF24" strokeWidth="0.8" />
      <rect x="15.5" y="6" width="3" height="5" rx="1" fill="#E2E8F0" stroke="#F59E0B" strokeWidth="0.6" />
      {/* Right Connector Head */}
      <rect x="30" y="8" width="6" height="8" rx="1.5" fill="url(#cable-head)" stroke="#FBBF24" strokeWidth="0.8" />
      <rect x="31.5" y="3" width="3" height="5" rx="1" fill="#E2E8F0" stroke="#F59E0B" strokeWidth="0.6" />
      {/* Sparkle Pulse */}
      <circle cx="17" cy="8.5" r="1.5" fill="#FEF08A" className="animate-ping" style={{ animationDuration: '2s' }} />
    </svg>
  </div>
);

// 12. Mobile Covers (MagSafe Armor Shockproof Case)
export const MobileCoverIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="case-body" x1="13" y1="5" x2="35" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0D9488" />
          <stop offset="0.6" stopColor="#0F766E" />
          <stop offset="1" stopColor="#115E59" />
        </linearGradient>
      </defs>
      {/* Reinforced Bumper Corners */}
      <rect x="11.5" y="4.5" width="25" height="39" rx="6" fill="#134E4A" />
      {/* Case Backplate */}
      <rect x="13" y="6" width="22" height="36" rx="4.5" fill="url(#case-body)" stroke="#5EEAD4" strokeWidth="1" />
      {/* Camera Cutout Module */}
      <rect x="15" y="8.5" width="9" height="10" rx="2.5" fill="#134E4A" stroke="#2DD4BF" strokeWidth="0.8" />
      <circle cx="17.5" cy="11.5" r="1.5" fill="#0F172A" stroke="#5EEAD4" strokeWidth="0.6" />
      <circle cx="21.5" cy="11.5" r="1.5" fill="#0F172A" stroke="#5EEAD4" strokeWidth="0.6" />
      <circle cx="19.5" cy="15.5" r="1.5" fill="#0F172A" stroke="#5EEAD4" strokeWidth="0.6" />
      {/* MagSafe Magnetic Ring */}
      <circle cx="24" cy="27" r="6" stroke="#99F6E4" strokeWidth="1.4" strokeDasharray="2 1.5" fill="none" className="animate-spin" style={{ animationDuration: '30s' }} />
      <circle cx="24" cy="27" r="2" fill="#5EEAD4" fillOpacity="0.6" className="animate-pulse-glow" />
      <line x1="24" y1="33" x2="24" y2="36" stroke="#99F6E4" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  </div>
);

// 13. Screen Protectors (9H Tempered Glass Shield)
export const ScreenProtectorIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="glass-grad" x1="14" y1="5" x2="34" y2="43" gradientUnits="userSpaceOnUse">
          <stop stopColor="#E0F2FE" />
          <stop offset="0.5" stopColor="#BAE6FD" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>
      </defs>
      {/* 9H Glass Sheet */}
      <rect x="14" y="5" width="20" height="38" rx="4" fill="url(#glass-grad)" fillOpacity="0.8" stroke="#0284C7" strokeWidth="1.2" />
      {/* Speaker Cutout */}
      <rect x="21" y="7" width="6" height="1.2" rx="0.6" fill="#0369A1" />
      {/* Diagonal Glass Sheen Reflection */}
      <path d="M14 12L34 26V32L14 18V12Z" fill="#FFFFFF" fillOpacity="0.6" />
      {/* 9H Hardness Badge */}
      <rect x="18" y="22" width="12" height="7" rx="2" fill="#0284C7" />
      <text x="24" y="27" textAnchor="middle" fill="#FFFFFF" fontSize="4.5" fontWeight="black" fontFamily="sans-serif">
        9H
      </text>
      {/* Sparkle Accent */}
      <path d="M34 10L35 8L36 10L38 11L36 12L35 14L34 12L32 11L34 10Z" fill="#38BDF8" className="animate-ping" style={{ animationDuration: '2.5s' }} />
    </svg>
  </div>
);

// 14. Speakers (360° Bluetooth Party Speaker)
export const SpeakerIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="speaker-cylinder" x1="14" y1="8" x2="34" y2="40" gradientUnits="userSpaceOnUse">
          <stop stopColor="#8B5CF6" />
          <stop offset="0.5" stopColor="#6D28D9" />
          <stop offset="1" stopColor="#4C1D95" />
        </linearGradient>
      </defs>
      {/* Speaker Cylinder Body */}
      <rect x="15" y="8" width="18" height="32" rx="7" fill="url(#speaker-cylinder)" stroke="#C4B5FD" strokeWidth="1" />
      {/* Passive Bass Radiator Ring (Top) */}
      <ellipse cx="24" cy="11" rx="6" ry="2.5" fill="#4C1D95" stroke="#A78BFA" strokeWidth="0.8" />
      {/* Center Subwoofer Driver */}
      <circle cx="24" cy="24" r="5" fill="#2E1065" stroke="#A78BFA" strokeWidth="1.2" />
      <circle cx="24" cy="24" r="2.5" fill="#8B5CF6" className="animate-pulse-glow" />
      {/* Passive Bass Radiator Ring (Bottom) */}
      <ellipse cx="24" cy="37" rx="6" ry="2.5" fill="#4C1D95" stroke="#A78BFA" strokeWidth="0.8" />
      {/* Radiating Soundwave Arcs */}
      <path d="M11 20C9 22 9 26 11 28" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse-glow" />
      <path d="M7 17C4 21 4 27 7 31" stroke="#C4B5FD" strokeWidth="1.2" strokeLinecap="round" className="animate-pulse-glow" style={{ animationDelay: '0.2s' }} />
      <path d="M37 20C39 22 39 26 37 28" stroke="#A78BFA" strokeWidth="1.5" strokeLinecap="round" className="animate-pulse-glow" />
      <path d="M41 17C44 21 44 27 41 31" stroke="#C4B5FD" strokeWidth="1.2" strokeLinecap="round" className="animate-pulse-glow" style={{ animationDelay: '0.2s' }} />
    </svg>
  </div>
);

// 15. Electronics (Smart 4K HDR TV / Display)
export const ElectronicsIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="tv-screen" x1="6" y1="8" x2="42" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="0.5" stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#EC4899" />
        </linearGradient>
      </defs>
      {/* Thin Bezel TV Frame */}
      <rect x="6" y="8" width="36" height="24" rx="2" fill="#0F172A" stroke="#818CF8" strokeWidth="1" />
      {/* 4K Display */}
      <rect x="7.5" y="9.5" width="33" height="21" rx="1" fill="url(#tv-screen)" />
      {/* Display Reflection Highlight */}
      <path d="M7.5 9.5L25 9.5L14 30.5H7.5V9.5Z" fill="#FFFFFF" fillOpacity="0.3" />
      {/* 4K Badge */}
      <rect x="33" y="11" width="6" height="3" rx="0.5" fill="#0F172A" fillOpacity="0.8" />
      <text x="36" y="13.2" textAnchor="middle" fill="#FFFFFF" fontSize="2.2" fontWeight="bold" fontFamily="sans-serif">
        4K
      </text>
      {/* TV Center Stand */}
      <rect x="22.5" y="32" width="3" height="5" fill="#64748B" />
      <rect x="17" y="37" width="14" height="2" rx="1" fill="#475569" stroke="#94A3B8" strokeWidth="0.5" />
    </svg>
  </div>
);

// 16. Fallback / Default Tech Gadgets Icon
export const DefaultTechIcon: React.FC<CategoryIconProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center animate-icon-float ${className}`}>
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-md">
      <defs>
        <linearGradient id="chip-grad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4F46E5" />
          <stop offset="1" stopColor="#1E1B4B" />
        </linearGradient>
      </defs>
      {/* Microchip Body */}
      <rect x="12" y="12" width="24" height="24" rx="4" fill="url(#chip-grad)" stroke="#818CF8" strokeWidth="1.2" />
      {/* Pins around */}
      <rect x="16" y="7" width="2" height="5" rx="1" fill="#A5B4FC" />
      <rect x="23" y="7" width="2" height="5" rx="1" fill="#A5B4FC" />
      <rect x="30" y="7" width="2" height="5" rx="1" fill="#A5B4FC" />
      <rect x="16" y="36" width="2" height="5" rx="1" fill="#A5B4FC" />
      <rect x="23" y="36" width="2" height="5" rx="1" fill="#A5B4FC" />
      <rect x="30" y="36" width="2" height="5" rx="1" fill="#A5B4FC" />
      <rect x="7" y="16" width="5" height="2" rx="1" fill="#A5B4FC" />
      <rect x="7" y="23" width="5" height="2" rx="1" fill="#A5B4FC" />
      <rect x="7" y="30" width="5" height="2" rx="1" fill="#A5B4FC" />
      <rect x="36" y="16" width="5" height="2" rx="1" fill="#A5B4FC" />
      <rect x="36" y="23" width="5" height="2" rx="1" fill="#A5B4FC" />
      <rect x="36" y="30" width="5" height="2" rx="1" fill="#A5B4FC" />
      {/* Center Circuit Core */}
      <rect x="18" y="18" width="12" height="12" rx="2" fill="#6366F1" fillOpacity="0.4" className="animate-pulse-glow" />
      <circle cx="24" cy="24" r="3" fill="#C7D2FE" />
    </svg>
  </div>
);

// Helper function to resolve category slug to corresponding animated icon component
export const getAnimatedCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'smartphones':
      return {
        icon: <SmartphoneIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-indigo-400 group-hover:shadow-[0_12px_35px_rgba(99,102,241,0.35)]',
        bg: 'bg-indigo-950/45 border border-indigo-700/40 group-hover:bg-indigo-900/50',
        badgeColor: 'text-indigo-400',
      };
    case 'iphones':
      return {
        icon: <IPhoneIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-violet-400 group-hover:shadow-[0_12px_35px_rgba(139,92,246,0.35)]',
        bg: 'bg-violet-950/45 border border-violet-700/40 group-hover:bg-violet-900/50',
        badgeColor: 'text-violet-300',
      };
    case 'android-phones':
      return {
        icon: <AndroidIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-emerald-400 group-hover:shadow-[0_12px_35px_rgba(16,185,129,0.35)]',
        bg: 'bg-emerald-950/45 border border-emerald-700/40 group-hover:bg-emerald-900/50',
        badgeColor: 'text-emerald-400',
      };
    case 'tablets':
      return {
        icon: <TabletIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-cyan-400 group-hover:shadow-[0_12px_35px_rgba(6,182,212,0.35)]',
        bg: 'bg-cyan-950/45 border border-cyan-700/40 group-hover:bg-cyan-900/50',
        badgeColor: 'text-cyan-400',
      };
    case 'laptops':
      return {
        icon: <LaptopIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-blue-400 group-hover:shadow-[0_12px_35px_rgba(59,130,246,0.35)]',
        bg: 'bg-blue-950/45 border border-blue-700/40 group-hover:bg-blue-900/50',
        badgeColor: 'text-blue-400',
      };
    case 'smartwatches':
      return {
        icon: <SmartwatchIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-purple-400 group-hover:shadow-[0_12px_35px_rgba(168,85,247,0.35)]',
        bg: 'bg-purple-950/45 border border-purple-700/40 group-hover:bg-purple-900/50',
        badgeColor: 'text-purple-400',
      };
    case 'earphones':
      return {
        icon: <EarphoneIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-rose-400 group-hover:shadow-[0_12px_35px_rgba(244,63,94,0.35)]',
        bg: 'bg-rose-950/45 border border-rose-700/40 group-hover:bg-rose-900/50',
        badgeColor: 'text-rose-400',
      };
    case 'headphones':
      return {
        icon: <HeadphoneIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-rose-400 group-hover:shadow-[0_12px_35px_rgba(244,63,94,0.35)]',
        bg: 'bg-rose-950/45 border border-rose-700/40 group-hover:bg-rose-900/50',
        badgeColor: 'text-rose-400',
      };
    case 'chargers':
      return {
        icon: <ChargerIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-amber-400 group-hover:shadow-[0_12px_35px_rgba(245,158,11,0.35)]',
        bg: 'bg-amber-950/45 border border-amber-700/40 group-hover:bg-amber-900/50',
        badgeColor: 'text-amber-400',
      };
    case 'power-banks':
      return {
        icon: <PowerBankIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-emerald-400 group-hover:shadow-[0_12px_35px_rgba(16,185,129,0.35)]',
        bg: 'bg-emerald-950/45 border border-emerald-700/40 group-hover:bg-emerald-900/50',
        badgeColor: 'text-emerald-400',
      };
    case 'cables':
      return {
        icon: <CableIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-amber-400 group-hover:shadow-[0_12px_35px_rgba(245,158,11,0.35)]',
        bg: 'bg-amber-950/45 border border-amber-700/40 group-hover:bg-amber-900/50',
        badgeColor: 'text-amber-400',
      };
    case 'mobile-covers':
      return {
        icon: <MobileCoverIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-teal-400 group-hover:shadow-[0_12px_35px_rgba(20,184,166,0.35)]',
        bg: 'bg-teal-950/45 border border-teal-700/40 group-hover:bg-teal-900/50',
        badgeColor: 'text-teal-400',
      };
    case 'screen-protectors':
      return {
        icon: <ScreenProtectorIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-sky-400 group-hover:shadow-[0_12px_35px_rgba(14,165,233,0.35)]',
        bg: 'bg-sky-950/45 border border-sky-700/40 group-hover:bg-sky-900/50',
        badgeColor: 'text-sky-400',
      };
    case 'speakers':
      return {
        icon: <SpeakerIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-violet-400 group-hover:shadow-[0_12px_35px_rgba(139,92,246,0.35)]',
        bg: 'bg-violet-950/45 border border-violet-700/40 group-hover:bg-violet-900/50',
        badgeColor: 'text-violet-400',
      };
    case 'electronics':
      return {
        icon: <ElectronicsIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-indigo-400 group-hover:shadow-[0_12px_35px_rgba(99,102,241,0.35)]',
        bg: 'bg-indigo-950/45 border border-indigo-700/40 group-hover:bg-indigo-900/50',
        badgeColor: 'text-indigo-400',
      };
    default:
      return {
        icon: <DefaultTechIcon className="w-11 h-11" />,
        glowColor: 'group-hover:border-slate-400 group-hover:shadow-[0_12px_35px_rgba(100,116,139,0.35)]',
        bg: 'bg-slate-900/50 border border-slate-700/40 group-hover:bg-slate-800/50',
        badgeColor: 'text-slate-300',
      };
  }
};
