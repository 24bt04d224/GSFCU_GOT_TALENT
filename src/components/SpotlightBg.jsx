import React from 'react';

export default function SpotlightBg() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* Fine Noise Grain Overlay */}
      <div className="absolute inset-0 bg-grain z-10 opacity-25 pointer-events-none" />

      {/* Stage Floor Horizon Dark Gradient */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#08080a] via-[#0c0c10] to-transparent z-10" />

      {/* Primary Theatrical Spotlight Beam (Top Right to Stage Left) */}
      <div 
        className="absolute -top-20 right-0 sm:right-10 w-[600px] h-[900px] opacity-35 mix-blend-screen pointer-events-none"
        style={{
          background: 'conic-gradient(from 200deg at 80% 0%, rgba(201,107,53,0.22) 0deg, rgba(196,154,58,0.08) 25deg, transparent 50deg)',
          filter: 'blur(35px)'
        }}
      />

      {/* Secondary Soft Ambient Backlight */}
      <div className="absolute top-1/4 right-1/4 w-[450px] h-[450px] bg-[#C96B35]/5 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
