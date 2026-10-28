import React from 'react';

interface LogoProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
}

// -----------------------------------------------------------------------------
// TIKTOK (Official Wordmark + Glyph)
// -----------------------------------------------------------------------------
export const TikTokLogo: React.FC<LogoProps> = ({ className = 'h-4 w-auto', ...props }) => (
  <svg
    viewBox="0 0 110 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="TikTok"
    {...props}
  >
    {/* Glyph */}
    <path
      d="M17.4 6.8c1.3 1.1 2.9 1.7 4.6 1.8V5c-1.4-.1-2.7-.7-3.6-1.7-.6-.7-1-1.6-1.1-2.5h-3.6v17.2c0 1.9-1.5 3.4-3.4 3.4-1.9 0-3.4-1.5-3.4-3.4 0-1.9 1.5-3.4 3.4-3.4.4 0 .7.1 1.1.2V11c-.4-.1-.7-.1-1.1-.1-3.9 0-7 3.1-7 7s3.1 7 7 7 7-3.1 7-7V9.7c2 1.4 4.3 2.1 6.8 2.2V8.3c-2.3-.2-4.4-1.6-4.8-1.5z"
      fill="currentColor"
    />
    {/* Text "TikTok" */}
    <text
      x="28"
      y="20"
      fontFamily="var(--font-sans), sans-serif"
      fontSize="17"
      fontWeight="700"
      letterSpacing="-0.04em"
      fill="currentColor"
    >
      TikTok
    </text>
  </svg>
);

// -----------------------------------------------------------------------------
// YOUTUBE (Icon + Wordmark)
// -----------------------------------------------------------------------------
export const YouTubeLogo: React.FC<LogoProps> = ({ className = 'h-4 w-auto', ...props }) => (
  <svg
    viewBox="0 0 120 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="YouTube"
    {...props}
  >
    {/* Red / Monochrome Pill Badge */}
    <rect x="0" y="4" width="28" height="20" rx="6" fill="currentColor" opacity="0.9" />
    <polygon points="11,9 19,14 11,19" fill="var(--bg, #ebe9e5)" />
    {/* Text "YouTube" */}
    <text
      x="33"
      y="20"
      fontFamily="var(--font-sans), sans-serif"
      fontSize="16"
      fontWeight="700"
      letterSpacing="-0.05em"
      fill="currentColor"
    >
      YouTube
    </text>
  </svg>
);

// -----------------------------------------------------------------------------
// INSTAGRAM (Glyph + Wordmark)
// -----------------------------------------------------------------------------
export const InstagramLogo: React.FC<LogoProps> = ({ className = 'h-4 w-auto', ...props }) => (
  <svg
    viewBox="0 0 125 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Instagram"
    {...props}
  >
    {/* Camera Glyph */}
    <rect x="1" y="4" width="20" height="20" rx="5.5" stroke="currentColor" strokeWidth="2" />
    <circle cx="11" cy="14" r="4.2" stroke="currentColor" strokeWidth="2" />
    <circle cx="16.5" cy="8.5" r="1.2" fill="currentColor" />
    {/* Text "Instagram" */}
    <text
      x="28"
      y="20"
      fontFamily="var(--font-sans), sans-serif"
      fontSize="16"
      fontWeight="600"
      letterSpacing="-0.03em"
      fill="currentColor"
    >
      Instagram
    </text>
  </svg>
);

// -----------------------------------------------------------------------------
// META (Infinity Glyph + Wordmark)
// -----------------------------------------------------------------------------
export const MetaLogo: React.FC<LogoProps> = ({ className = 'h-4 w-auto', ...props }) => (
  <svg
    viewBox="0 0 95 28"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="Meta"
    {...props}
  >
    {/* Infinity Glyph */}
    <path
      d="M19.8 8.8c-1.3-1.6-3.1-2.5-5.1-2.5-3.6 0-6.1 3-7.5 5.5-1.4-2.5-3.9-5.5-7.5-5.5-2 0-3.8.9-5.1 2.5C-6.6 10.4-7 12.6-7 14.8c0 2.2.4 4.4 1.7 6 1.3 1.6 3.1 2.5 5.1 2.5 3.9 0 6.6-3.3 7.9-5.9 1.3 2.6 4 5.9 7.9 5.9 2 0 3.8-.9 5.1-2.5 1.3-1.6 1.7-3.8 1.7-6 0-2.2-.4-4.4-1.6-6zm-17.6 9.8c-1.1 2-2.8 3.1-4.6 3.1-2.4 0-4-1.8-4-4.5 0-2.6 1.7-4.5 4-4.5 1.8 0 3.5 1.2 4.6 3.1v2.8zm14.7 0c-1.1-2-2.8-3.1-4.6-3.1-2.4 0-4.1 1.9-4.1 4.5 0 2.7 1.6 4.5 4.1 4.5 1.8 0 3.5-1.1 4.6-3.1v-2.8z"
      transform="translate(10, 0) scale(0.85)"
      fill="currentColor"
    />
    {/* Text "Meta" */}
    <text
      x="33"
      y="20"
      fontFamily="var(--font-sans), sans-serif"
      fontSize="16"
      fontWeight="700"
      letterSpacing="-0.03em"
      fill="currentColor"
    >
      Meta
    </text>
  </svg>
);

// -----------------------------------------------------------------------------
// X (Glyph)
// -----------------------------------------------------------------------------
export const XLogo: React.FC<LogoProps> = ({ className = 'h-3.5 w-auto', ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    aria-label="X"
    {...props}
  >
    <path
      d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
      fill="currentColor"
    />
  </svg>
);
