'use client';

import React from 'react';

export default function BrandLogo({ size = 32, className = '' }) {
  return (
    <div
      style={{ width: size, height: size }}
      className={`flex items-center justify-center shrink-0 ${className}`}
    >
      <svg
        viewBox="0 0 32 32"
        width={size}
        height={size}
        className="w-full h-full text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.18)]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.3"
      >
        <path
          d="M7 16 C 7 10, 16 9, 21 13 C 25 16, 25 22, 19 23 C 14 24, 11 20, 14 17 C 17 14, 23 15, 25 16"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}
