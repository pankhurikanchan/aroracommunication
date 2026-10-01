import React from 'react';

export const AppleLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 170 170" fill="currentColor" className={className}>
    <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.71-11.64-14.01-6.19-9.56-10.9-20.44-14.13-32.64-3.23-12.2-4.85-23.9-4.85-35.1 0-14.88 3.73-27.4 11.19-37.56 7.46-10.16 17.06-15.35 28.8-15.58 4.8 0 10.15 1.25 16.05 3.75 5.9 2.5 9.77 3.86 11.61 4.08 1.45-.22 5.56-1.63 12.33-4.24 6.77-2.61 12.39-3.78 16.85-3.52 12.87.68 23.33 5.41 31.38 14.19-11.24 6.81-16.71 16.29-16.41 28.43.3 9.4 3.99 17.27 11.07 23.6 7.08 6.33 15.5 9.9 25.26 10.7-2.41 7.22-5.45 14.65-9.12 22.28z" />
    <path d="M119.22 31.95c0-7.72 2.76-14.89 8.28-21.51 5.53-6.62 12.28-10.44 20.25-11.44.22 1.3.33 2.5.33 3.6 0 7.61-2.92 14.94-8.76 22-5.84 7.06-12.83 10.99-20.97 11.79-.11-1.41-.17-2.89-.17-4.44z" />
  </svg>
);

export const GoogleLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 24 24" className={className}>
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
    />
  </svg>
);

export const SamsungLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-4' }) => (
  <svg viewBox="0 0 160 40" fill="currentColor" className={className}>
    {/* Stylized SAMSUNG logotype with signature open 'A' */}
    <text
      x="50%"
      y="28"
      textAnchor="middle"
      fontFamily="Impact, Arial Black, sans-serif"
      fontSize="27"
      letterSpacing="4"
      fill="currentColor"
    >
      SAMSUNG
    </text>
  </svg>
);

export const OnePlusLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="20" fill="#EB0029" />
    <path
      d="M48 30H36V40H48V72H59V30H48Z"
      fill="white"
    />
    <path
      d="M68 25V33H60V38H68V46H73V38H81V33H73V25H68Z"
      fill="white"
    />
  </svg>
);

export const SonyLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-4' }) => (
  <svg viewBox="0 0 140 36" fill="currentColor" className={className}>
    <text
      x="50%"
      y="26"
      textAnchor="middle"
      fontFamily="'Times New Roman', Georgia, serif"
      fontWeight="900"
      fontSize="28"
      letterSpacing="6"
      fill="currentColor"
    >
      SONY
    </text>
  </svg>
);

export const BoatLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 100 100" fill="currentColor" className={className}>
    {/* Official stylized boAt triangle sail & crest */}
    <path
      d="M49 14L86 78C87 80 85 83 82 83H18C15 83 13 80 14 78L49 14Z"
      fill="#E11D48"
    />
    <path
      d="M49 22L76 74H24L49 22Z"
      fill="#0F172A"
    />
    <path
      d="M49 32L66 68H34L49 32Z"
      fill="#FFFFFF"
    />
    <circle cx="50" cy="54" r="6" fill="#E11D48" />
  </svg>
);

export const SpigenLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <path
      d="M50 10L86 28V62C86 78 70 90 50 95C30 90 14 78 14 62V28L50 10Z"
      fill="#0F172A"
      stroke="#F59E0B"
      strokeWidth="6"
    />
    <path
      d="M50 24L74 36V58C74 70 63 79 50 83C37 79 26 70 26 58V36L50 24Z"
      fill="#F59E0B"
    />
    <circle cx="50" cy="52" r="10" fill="#0F172A" />
  </svg>
);

export const AnkerLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    {/* Anker lightning winged emblem */}
    <path
      d="M50 12L20 82H36L50 48L64 82H80L50 12Z"
      fill="#06B6D4"
    />
    <path
      d="M42 60H58L50 38L42 60Z"
      fill="#0F172A"
    />
    <path
      d="M62 42L48 58H58L42 78L68 52H56L62 42Z"
      fill="#FACC15"
    />
  </svg>
);

export const XiaomiLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="30" fill="#FF6900" />
    <path
      d="M26 30H36V70H26V30Z"
      fill="white"
    />
    <path
      d="M42 30H66C71.5 30 76 34.5 76 40V70H66V42C66 40.9 65.1 40 64 40H54V70H44V32C44 30.9 43.1 30 42 30Z"
      fill="white"
    />
  </svg>
);

export const RealmeLogo: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 100 100" fill="none" className={className}>
    <rect width="100" height="100" rx="22" fill="#FFC800" />
    <text
      x="50%"
      y="66"
      textAnchor="middle"
      fontFamily="'Plus Jakarta Sans', Arial Black, sans-serif"
      fontWeight="900"
      fontSize="52"
      fill="#111827"
    >
      r
    </text>
  </svg>
);

export const JblLogo: React.FC<{ className?: string }> = ({ className = 'w-8 h-8' }) => (
  <svg viewBox="0 0 120 70" fill="none" className={className}>
    <rect width="120" height="70" rx="14" fill="#FF3E00" />
    <text
      x="50%"
      y="48"
      textAnchor="middle"
      fontFamily="Impact, Arial Black, sans-serif"
      fontSize="36"
      letterSpacing="2"
      fill="#FFFFFF"
    >
      JBL
    </text>
    <circle cx="102" cy="22" r="4" fill="#FFFFFF" />
  </svg>
);

export const NothingLogo: React.FC<{ className?: string }> = ({ className = 'w-9 h-6' }) => (
  <svg viewBox="0 0 160 50" fill="currentColor" className={className}>
    {/* Nothing dot-matrix / glyph style */}
    <text
      x="50%"
      y="32"
      textAnchor="middle"
      fontFamily="'Courier New', monospace"
      fontWeight="900"
      fontSize="24"
      letterSpacing="5"
      fill="currentColor"
    >
      NOTHING
    </text>
  </svg>
);
