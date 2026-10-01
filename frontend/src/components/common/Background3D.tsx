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
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {/* 1. Perspective 3D Grid Wave Horizon (Top Transition) */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[160%] h-96 grid-horizon-3d opacity-60"
        style={{
          transform: `perspective(600px) rotateX(65deg) translateY(${mousePos.y * 12}px) translateX(${mousePos.x * 12}px)`,
        }}
      />

      {/* 2. Floating 3D Glowing Neon Orbs with Mouse Parallax */}
      {/* Orb 1: Aurora Indigo (Top-Left) */}
      <div
        className="absolute -top-20 -left-20 w-[550px] h-[550px] rounded-full bg-gradient-to-tr from-indigo-500/18 via-blue-500/12 to-transparent blur-[110px] animate-float-slow-3d transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`,
        }}
      />

      {/* Orb 2: Electric Cyan (Top-Right) */}
      <div
        className="absolute top-10 -right-24 w-[520px] h-[520px] rounded-full bg-gradient-to-bl from-cyan-400/18 via-teal-400/10 to-transparent blur-[120px] animate-float-reverse-3d transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * -30}px, ${mousePos.y * -30}px)`,
        }}
      />

      {/* Orb 3: Violet / Magenta Shimmer (Mid-Page) */}
      <div
        className="absolute top-[45%] -left-32 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-500/12 via-indigo-600/10 to-transparent blur-[130px] animate-float-slow-3d transition-transform duration-1000 ease-out"
        style={{
          transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`,
        }}
      />

      {/* Orb 4: Warm Gold / Amber Glow (Lower-Right) */}
      <div
        className="absolute top-[70%] -right-28 w-[500px] h-[500px] rounded-full bg-gradient-to-tl from-amber-400/10 via-rose-500/8 to-transparent blur-[120px] animate-float-reverse-3d transition-transform duration-700 ease-out"
        style={{
          transform: `translate(${mousePos.x * -22}px, ${mousePos.y * -22}px)`,
        }}
      />

      {/* 3. Floating 3D Geometric Tech Cubes */}
      {/* Cube 1: Top Right Floating 3D Wireframe Cube */}
      <div
        className="hidden lg:block absolute top-28 right-[8%] w-16 h-16 perspective-600 transition-transform duration-500 ease-out"
        style={{
          transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -18}px)`,
        }}
      >
        <div className="w-full h-full preserve-3d animate-rotate-cube-3d relative">
          <div className="absolute inset-0 border border-indigo-400/30 bg-indigo-500/5 backdrop-blur-[2px] rounded-lg shadow-sm" style={{ transform: 'translateZ(32px)' }} />
          <div className="absolute inset-0 border border-indigo-400/30 bg-indigo-500/5 backdrop-blur-[2px] rounded-lg" style={{ transform: 'rotateY(180deg) translateZ(32px)' }} />
          <div className="absolute inset-0 border border-cyan-400/30 bg-cyan-500/5 backdrop-blur-[2px] rounded-lg" style={{ transform: 'rotateY(-90deg) translateZ(32px)' }} />
          <div className="absolute inset-0 border border-cyan-400/30 bg-cyan-500/5 backdrop-blur-[2px] rounded-lg" style={{ transform: 'rotateY(90deg) translateZ(32px)' }} />
          <div className="absolute inset-0 border border-purple-400/30 bg-purple-500/5 backdrop-blur-[2px] rounded-lg" style={{ transform: 'rotateX(90deg) translateZ(32px)' }} />
          <div className="absolute inset-0 border border-purple-400/30 bg-purple-500/5 backdrop-blur-[2px] rounded-lg" style={{ transform: 'rotateX(-90deg) translateZ(32px)' }} />
        </div>
      </div>

      {/* Cube 2: Mid-Left Floating 3D Tech Cube */}
      <div
        className="hidden xl:block absolute top-[52%] left-[4%] w-12 h-12 perspective-600 transition-transform duration-500 ease-out opacity-75"
        style={{
          transform: `translate(${mousePos.x * 22}px, ${mousePos.y * 22}px)`,
        }}
      >
        <div className="w-full h-full preserve-3d animate-rotate-cube-3d relative" style={{ animationDuration: '28s', animationDirection: 'reverse' }}>
          <div className="absolute inset-0 border border-cyan-400/35 bg-cyan-500/5 rounded-md" style={{ transform: 'translateZ(24px)' }} />
          <div className="absolute inset-0 border border-cyan-400/35 bg-cyan-500/5 rounded-md" style={{ transform: 'rotateY(180deg) translateZ(24px)' }} />
          <div className="absolute inset-0 border border-indigo-400/35 bg-indigo-500/5 rounded-md" style={{ transform: 'rotateY(-90deg) translateZ(24px)' }} />
          <div className="absolute inset-0 border border-indigo-400/35 bg-indigo-500/5 rounded-md" style={{ transform: 'rotateY(90deg) translateZ(24px)' }} />
          <div className="absolute inset-0 border border-emerald-400/35 bg-emerald-500/5 rounded-md" style={{ transform: 'rotateX(90deg) translateZ(24px)' }} />
          <div className="absolute inset-0 border border-emerald-400/35 bg-emerald-500/5 rounded-md" style={{ transform: 'rotateX(-90deg) translateZ(24px)' }} />
        </div>
      </div>

      {/* 4. Subtle Particle Nodes with Shimmer */}
      <div className="absolute inset-0 bg-[radial-gradient(#4f46e5_0.7px,transparent_0.7px)] [background-size:32px_32px] opacity-[0.14]" />
    </div>
  );
};
