import React from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { usePointerHighlight } from '../../hooks/usePointerHighlight';

interface HomeCardProps {
  icon?: React.ReactNode;
  stepNumber?: string;
  title: string;
  description: string;
  staggerIndex?: number;
  className?: string;
}

export const HomeCard: React.FC<HomeCardProps> = ({
  icon,
  stepNumber,
  title,
  description,
  staggerIndex = 0,
  className = '',
}) => {
  const { ref: revealRef, style: revealStyle } = useScrollReveal<HTMLDivElement>(staggerIndex);
  const { ref: pointerRef, onPointerMove } = usePointerHighlight<HTMLDivElement>();

  // Combine refs
  const setRefs = (el: HTMLDivElement | null) => {
    (revealRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
    (pointerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
  };

  return (
    <div
      ref={setRefs}
      onPointerMove={onPointerMove}
      style={{
        ...revealStyle,
        backgroundColor: 'var(--surface-color)',
        '--mx': '50%',
        '--my': '50%',
      } as React.CSSProperties}
      className={`group relative p-6 rounded-[20px] border border-[var(--border-color)] transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-[var(--border-focus)] overflow-hidden cursor-default ${className}`}
    >
      {/* Background fill */}
      <div
        className="absolute inset-0 pointer-events-none transition-colors"
        style={{ backgroundColor: 'var(--surface-color)' }}
      />

      {/* Subtle pointer-follow highlight inside the card using --mx/--my */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          background:
            'radial-gradient(circle 180px at var(--mx, 50%) var(--my, 50%), var(--glow-color) 0%, transparent 75%)',
          mixBlendMode: 'var(--glow-blend)' as any,
        }}
      />

      {/* Gradient border that sweeps on hover */}
      <div
        aria-hidden="true"
        className="absolute inset-0 rounded-[20px] pointer-events-none p-px overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      >
        <div
          className="w-full h-full rounded-[19px] border border-transparent animate-border-sweep"
          style={{
            background:
              'linear-gradient(135deg, transparent 20%, var(--border-focus) 50%, transparent 80%) border-box',
            WebkitMask:
              'linear-gradient(white 0 0) content-box, linear-gradient(white 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />
      </div>

      <div className="relative z-10 space-y-2.5">
        {/* Step Number OR Icon with micro-animation on hover (small scale/rotate) */}
        {stepNumber ? (
          <div className="font-serif-title text-3xl font-semibold text-[var(--border-focus)] transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3 inline-block">
            {stepNumber}
          </div>
        ) : icon ? (
          <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--border-focus)] border border-[var(--border-color)] transition-transform duration-200 group-hover:scale-110 group-hover:rotate-3 shadow-xs">
            {icon}
          </div>
        ) : null}

        <h3 className="text-sm font-semibold text-[var(--text-main)] group-hover:text-[var(--border-focus)] transition-colors">
          {title}
        </h3>

        <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};
