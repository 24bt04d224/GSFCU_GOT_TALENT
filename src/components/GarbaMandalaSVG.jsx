import React from 'react';

export default function GarbaMandalaSVG({ className = "" }) {
  return (
    <div className={`relative flex items-center justify-center pointer-events-none select-none ${className}`}>
      <svg
        viewBox="0 0 300 300"
        className="w-full h-full opacity-10 text-[#C96B35]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Subtle geometric Indian lotus / Garba motif */}
        <circle cx="150" cy="150" r="140" stroke="currentColor" strokeWidth="0.75" />
        <circle cx="150" cy="150" r="110" stroke="#C49A3A" strokeWidth="0.5" opacity="0.6" />
        <circle cx="150" cy="150" r="80" stroke="currentColor" strokeWidth="0.75" />

        <g stroke="currentColor" strokeWidth="0.5" opacity="0.5">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
            <line
              key={i}
              x1="150"
              y1="150"
              x2={150 + 140 * Math.cos((angle * Math.PI) / 180)}
              y2={150 + 140 * Math.sin((angle * Math.PI) / 180)}
            />
          ))}
        </g>

        <path
          d="M150,70 L170,130 L230,150 L170,170 L150,230 L130,170 L70,150 L130,130 Z"
          stroke="#C49A3A"
          strokeWidth="0.75"
          opacity="0.8"
        />
        <circle cx="150" cy="150" r="8" fill="#C96B35" opacity="0.7" />
      </svg>
    </div>
  );
}
