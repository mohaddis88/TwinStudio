import React from 'react';

export type GlassHairVariant = 'bun' | 'short' | 'long' | 'cap' | 'curls';
export type GlassTint = 'violet' | 'coral' | 'amber' | 'rose' | 'teal-sand';
export type GlassAngle = 'front' | 'side' | 'up' | 'down';

interface GlassFigureProps {
  variant?: GlassHairVariant;
  tint?: GlassTint;
  angle?: GlassAngle;
  className?: string;
  isHovered?: boolean;
}

const TINT_PALETTES: Record<
  GlassTint,
  {
    gradFrom: string;
    gradMid: string;
    gradTo: string;
    rimLight: string;
    glow: string;
  }
> = {
  violet: {
    gradFrom: '#C4B29A',
    gradMid: '#E4D8C6',
    gradTo: '#8C7558',
    rimLight: '#F4EEE4',
    glow: 'rgba(167, 139, 103, 0.22)',
  },
  coral: {
    gradFrom: '#C9B7A2',
    gradMid: '#E8DCCB',
    gradTo: '#9A8164',
    rimLight: '#F7F1E8',
    glow: 'rgba(167, 139, 103, 0.2)',
  },
  amber: {
    gradFrom: '#B59A73',
    gradMid: '#D9C5A4',
    gradTo: '#8A704C',
    rimLight: '#F3EADF',
    glow: 'rgba(181, 154, 115, 0.24)',
  },
  rose: {
    gradFrom: '#C8B9A8',
    gradMid: '#E6D9C8',
    gradTo: '#A08A72',
    rimLight: '#F5EFE6',
    glow: 'rgba(160, 138, 114, 0.2)',
  },
  'teal-sand': {
    gradFrom: '#B7A894',
    gradMid: '#DDD2C2',
    gradTo: '#8B7A64',
    rimLight: '#F2EDE4',
    glow: 'rgba(139, 122, 100, 0.2)',
  },
};

export const GlassFigure: React.FC<GlassFigureProps> = ({
  variant = 'bun',
  tint = 'violet',
  angle = 'front',
  className = '',
  isHovered = false,
}) => {
  const palette = TINT_PALETTES[tint] || TINT_PALETTES.violet;
  const filterId = `glass-glow-${tint}-${variant}-${angle}`;
  const gradId = `glass-grad-${tint}-${variant}-${angle}`;

  // Angle adjustments
  const headShiftX = angle === 'side' ? 24 : 0;
  const headShiftY = angle === 'up' ? -10 : angle === 'down' ? 10 : 0;
  const faceAngleRotate = angle === 'side' ? 8 : 0;

  return (
    <div
      className={`relative w-full h-full flex items-center justify-center overflow-hidden rounded-[16px] select-none ${className}`}
      style={{
        background: `radial-gradient(ellipse at 50% 30%, ${palette.glow} 0%, rgba(255, 255, 255, 0.04) 60%, transparent 80%)`,
      }}
    >
      {/* 1. Backdrop Frosted Glass Filter */}
      <svg
        viewBox="0 0 200 240"
        className={`w-full h-full p-2 transition-transform duration-300 ease-out ${
          isHovered ? 'scale-105' : 'scale-100'
        }`}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={palette.gradFrom} stopOpacity="0.82" />
            <stop offset="50%" stopColor={palette.gradMid} stopOpacity="0.45" />
            <stop offset="100%" stopColor={palette.gradTo} stopOpacity="0.75" />
          </linearGradient>

          <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient Halo Behind Head */}
        <circle cx={100 + headShiftX} cy={95 + headShiftY} r="54" fill={palette.glow} />

        {/* Shoulders & Chest silhouette */}
        <path
          d={
            angle === 'side'
              ? 'M 35 240 C 45 180, 80 165, 115 165 C 145 165, 168 185, 175 240 Z'
              : 'M 28 240 C 35 180, 70 160, 100 160 C 130 160, 165 180, 172 240 Z'
          }
          fill={`url(#${gradId})`}
          stroke={palette.rimLight}
          strokeWidth="1.2"
          opacity="0.88"
        />

        {/* Neck */}
        <rect
          x={90 + headShiftX * 0.4}
          y={126 + headShiftY * 0.5}
          width="20"
          height="38"
          rx="10"
          fill={`url(#${gradId})`}
          stroke={palette.rimLight}
          strokeWidth="1"
          opacity="0.9"
        />

        {/* Head Base Oval */}
        <g
          transform={`translate(${headShiftX}, ${headShiftY}) rotate(${faceAngleRotate}, 100, 95)`}
        >
          <ellipse
            cx="100"
            cy="95"
            rx="36"
            ry="44"
            fill={`url(#${gradId})`}
            stroke={palette.rimLight}
            strokeWidth="1.5"
            opacity="0.95"
            filter={`url(#${filterId})`}
          />

          {/* Chin & Jaw contour definition */}
          <path
            d="M 74 95 C 75 125, 88 139, 100 139 C 112 139, 125 125, 126 95"
            fill="none"
            stroke={palette.rimLight}
            strokeWidth="1.2"
            opacity="0.75"
          />

          {/* Hair Shape Variants */}
          {variant === 'bun' && (
            <g id="hair-bun">
              {/* High Bun */}
              <ellipse
                cx="100"
                cy="44"
                rx="22"
                ry="18"
                fill={palette.gradFrom}
                stroke={palette.rimLight}
                strokeWidth="1.2"
                opacity="0.9"
              />
              {/* Crown hair volume */}
              <path
                d="M 64 85 C 60 52, 75 52, 100 52 C 125 52, 140 52, 136 85 C 130 65, 116 62, 100 62 C 84 62, 70 65, 64 85 Z"
                fill={palette.gradFrom}
                opacity="0.95"
              />
              {/* Loose wisps */}
              <path
                d="M 64 88 Q 58 102 62 118 M 136 88 Q 142 102 138 118"
                fill="none"
                stroke={palette.rimLight}
                strokeWidth="1"
                opacity="0.6"
              />
            </g>
          )}

          {variant === 'short' && (
            <g id="hair-short">
              {/* Clean textured side fade & top crop */}
              <path
                d="M 62 88 C 60 56, 75 48, 100 48 C 125 48, 140 56, 138 88 C 134 68, 120 62, 100 62 C 80 62, 66 68, 62 88 Z"
                fill={palette.gradFrom}
                stroke={palette.rimLight}
                strokeWidth="1.2"
                opacity="0.92"
              />
              {/* Subtle temple line */}
              <path
                d="M 64 92 L 67 106 M 136 92 L 133 106"
                stroke={palette.rimLight}
                strokeWidth="1.2"
                opacity="0.5"
              />
            </g>
          )}

          {variant === 'long' && (
            <g id="hair-long">
              {/* Crown parted hair */}
              <path
                d="M 62 80 C 62 48, 76 46, 100 46 C 124 46, 138 48, 138 80 C 145 125, 148 165, 144 195 C 136 155, 134 100, 100 100 C 66 100, 64 155, 56 195 C 52 165, 55 125, 62 80 Z"
                fill={palette.gradFrom}
                stroke={palette.rimLight}
                strokeWidth="1.2"
                opacity="0.95"
              />
            </g>
          )}

          {variant === 'cap' && (
            <g id="hair-cap">
              {/* Cap visor & crown */}
              <path
                d="M 58 78 C 60 52, 75 46, 100 46 C 125 46, 140 52, 142 78 Z"
                fill={palette.gradFrom}
                stroke={palette.rimLight}
                strokeWidth="1.2"
                opacity="0.95"
              />
              <path
                d="M 54 82 Q 100 70 146 82 L 152 88 Q 100 74 48 88 Z"
                fill={palette.rimLight}
                opacity="0.85"
              />
            </g>
          )}

          {variant === 'curls' && (
            <g id="hair-curls">
              {/* Voluminous coils / rounded cloud shapes around crown */}
              <circle cx="70" cy="65" r="14" fill={palette.gradFrom} opacity="0.9" />
              <circle cx="86" cy="52" r="15" fill={palette.gradFrom} opacity="0.95" />
              <circle cx="106" cy="50" r="15" fill={palette.gradFrom} opacity="0.95" />
              <circle cx="124" cy="56" r="14" fill={palette.gradFrom} opacity="0.9" />
              <circle cx="136" cy="72" r="13" fill={palette.gradFrom} opacity="0.85" />
              <circle cx="62" cy="80" r="12" fill={palette.gradFrom} opacity="0.85" />
              <path
                d="M 64 88 Q 100 68 136 88"
                fill="none"
                stroke={palette.rimLight}
                strokeWidth="1.2"
                opacity="0.5"
              />
            </g>
          )}
        </g>
      </svg>

      {/* 2. Light Sweep across the glass on hover (Same shimmer language as hero) */}
      <div
        aria-hidden="true"
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            'linear-gradient(135deg, transparent 20%, rgba(255, 255, 255, 0.45) 50%, transparent 80%)',
          backgroundSize: '200% 200%',
          animation: 'glassLightSweep 2.5s ease-in-out infinite',
          mixBlendMode: 'soft-light',
        }}
      />
    </div>
  );
};
