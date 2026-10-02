import React, { useEffect, useState } from 'react';

export const Background3D: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 bg-[#0B0819]" aria-hidden="true">
      {/* 1. Perspective 3D Cyber Horizon Wave Grid (Deep Violet/Cyan) */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[170%] h-[480px] grid-horizon-3d opacity-45 pointer-events-none"
        style={{
          transform: `perspective(600px) rotateX(65deg) translateY(${mousePos.y * 14}px) translateX(${mousePos.x * 14}px)`,
        }}
      />

      {/* 2. Mystical Aurora Borealis Glowing Waves & Orbs with Mouse Parallax */}
      {/* Aurora Orb 1: Electric Violet & Indigo Nebula (Top-Left) */}
      <div
        className="absolute -top-24 -left-20 w-[620px] h-[620px] rounded-full bg-gradient-to-tr from-violet-600/35 via-purple-700/25 to-indigo-900/10 blur-[130px] animate-float-slow-3d transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 28}px, ${mousePos.y * 28}px)`,
        }}
      />

      {/* Aurora Orb 2: Ethereal Cyan & Emerald Borealis (Top-Right) */}
      <div
        className="absolute top-12 -right-28 w-[580px] h-[580px] rounded-full bg-gradient-to-bl from-cyan-400/28 via-teal-500/20 to-transparent blur-[130px] animate-float-reverse-3d transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * -32}px, ${mousePos.y * -32}px)`,
        }}
      />

      {/* Aurora Orb 3: Cosmic Fuchsia & Magenta Shimmer (Mid-Page Center-Left) */}
      <div
        className="absolute top-[42%] -left-36 w-[640px] h-[640px] rounded-full bg-gradient-to-br from-fuchsia-600/22 via-purple-800/18 to-transparent blur-[140px] animate-float-slow-3d transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePos.x * 22}px, ${mousePos.y * 22}px)`,
        }}
      />

      {/* Aurora Orb 4: Deep Royal Sapphire & Amber Velvet (Lower-Right) */}
      <div
        className="absolute top-[68%] -right-32 w-[550px] h-[550px] rounded-full bg-gradient-to-tl from-indigo-500/22 via-violet-600/15 to-transparent blur-[130px] animate-float-reverse-3d transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * -25}px, ${mousePos.y * -25}px)`,
        }}
      />

      {/* Aurora Light Ribbon Stream across screen */}
      <div className="absolute top-[18%] -left-40 -right-40 h-44 bg-gradient-to-r from-violet-600/0 via-fuchsia-500/12 to-cyan-400/0 blur-[90px] rotate-[-7deg] pointer-events-none" />
      <div className="absolute top-[58%] -left-40 -right-40 h-48 bg-gradient-to-r from-cyan-500/0 via-violet-600/10 to-pink-500/0 blur-[100px] rotate-[5deg] pointer-events-none" />

      {/* 3. Floating 3D Geometric Tech Cubes */}
      {/* Cube 1: Top Right Floating 3D Luminous Wireframe Cube */}
      <div
        className="hidden lg:block absolute top-28 right-[8%] w-16 h-16 perspective-600 transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)`,
        }}
      >
        <div className="w-full h-full preserve-3d animate-rotate-cube-3d relative">
          <div className="absolute inset-0 border border-violet-400/40 bg-violet-600/10 backdrop-blur-[3px] rounded-lg shadow-[0_0_15px_rgba(139,92,246,0.3)]" style={{ transform: 'translateZ(32px)' }} />
          <div className="absolute inset-0 border border-violet-400/40 bg-violet-600/10 backdrop-blur-[3px] rounded-lg" style={{ transform: 'rotateY(180deg) translateZ(32px)' }} />
          <div className="absolute inset-0 border border-cyan-400/40 bg-cyan-600/10 backdrop-blur-[3px] rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.3)]" style={{ transform: 'rotateY(-90deg) translateZ(32px)' }} />
          <div className="absolute inset-0 border border-cyan-400/40 bg-cyan-600/10 backdrop-blur-[3px] rounded-lg" style={{ transform: 'rotateY(90deg) translateZ(32px)' }} />
          <div className="absolute inset-0 border border-fuchsia-400/40 bg-fuchsia-600/10 backdrop-blur-[3px] rounded-lg shadow-[0_0_15px_rgba(217,70,239,0.3)]" style={{ transform: 'rotateX(90deg) translateZ(32px)' }} />
          <div className="absolute inset-0 border border-fuchsia-400/40 bg-fuchsia-600/10 backdrop-blur-[3px] rounded-lg" style={{ transform: 'rotateX(-90deg) translateZ(32px)' }} />
        </div>
      </div>

      {/* Cube 2: Mid-Left Floating 3D Tech Cube */}
      <div
        className="hidden xl:block absolute top-[52%] left-[4%] w-12 h-12 perspective-600 transition-transform duration-500 ease-out opacity-85"
        style={{
          transform: `translate(${mousePos.x * 24}px, ${mousePos.y * 24}px)`,
        }}
      >
        <div className="w-full h-full preserve-3d animate-rotate-cube-3d relative" style={{ animationDuration: '28s', animationDirection: 'reverse' }}>
          <div className="absolute inset-0 border border-cyan-400/45 bg-cyan-500/10 rounded-md shadow-[0_0_12px_rgba(6,182,212,0.3)]" style={{ transform: 'translateZ(24px)' }} />
          <div className="absolute inset-0 border border-cyan-400/45 bg-cyan-500/10 rounded-md" style={{ transform: 'rotateY(180deg) translateZ(24px)' }} />
          <div className="absolute inset-0 border border-violet-400/45 bg-violet-500/10 rounded-md shadow-[0_0_12px_rgba(139,92,246,0.3)]" style={{ transform: 'rotateY(-90deg) translateZ(24px)' }} />
          <div className="absolute inset-0 border border-violet-400/45 bg-violet-500/10 rounded-md" style={{ transform: 'rotateY(90deg) translateZ(24px)' }} />
          <div className="absolute inset-0 border border-emerald-400/45 bg-emerald-500/10 rounded-md" style={{ transform: 'rotateX(90deg) translateZ(24px)' }} />
          <div className="absolute inset-0 border border-emerald-400/45 bg-emerald-500/10 rounded-md" style={{ transform: 'rotateX(-90deg) translateZ(24px)' }} />
        </div>
      </div>

      {/* 4. Starlight Particle Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#8b5cf6_0.8px,transparent_0.8px)] [background-size:36px_36px] opacity-[0.16]" />
    </div>
  );
};
