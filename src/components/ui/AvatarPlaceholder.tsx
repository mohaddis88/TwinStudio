import React from 'react';

interface AvatarPlaceholderProps {
  className?: string;
  aspectRatio?: string;
  theme?: 'light' | 'dark';
}

export const AvatarPlaceholder: React.FC<AvatarPlaceholderProps> = ({
  className = '',
  aspectRatio = '3/4',
}) => {
  return (
    <div
      className={`w-full h-full flex items-center justify-center select-none overflow-hidden ${className}`}
      style={{
        aspectRatio,
        backgroundColor: 'var(--surface-2, #dedad2)',
      }}
      aria-label="No photo uploaded - avatar placeholder"
    >
      <svg
        viewBox="0 0 160 213"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full max-w-[50%] max-h-[50%] object-contain"
        aria-hidden="true"
      >
        {/* Geometric Circle Head */}
        <circle cx="80" cy="78" r="24" fill="var(--text-muted, #9e9b94)" />

        {/* Symmetrical Rounded Shoulders Arc */}
        <path
          d="M40 165 C40 126, 58 114, 80 114 C102 114, 120 126, 120 165 Z"
          fill="var(--text-muted, #9e9b94)"
        />
      </svg>
    </div>
  );
};
