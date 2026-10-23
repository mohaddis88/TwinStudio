import React from 'react';
import { PageId, ThemeMode } from '../types';
import { useCmsContent } from '../lib/cmsStore';
import { ParticleAvatarCanvas } from '../components/ParticleAvatarCanvas';

interface AboutProps {
  onNavigate?: (page: PageId) => void;
  theme?: ThemeMode;
}

export const About: React.FC<AboutProps> = ({ onNavigate, theme = 'light' }) => {
  const [content] = useCmsContent();
  const about = content.about;

  return (
    <div className="w-full min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-500 relative overflow-hidden pt-28 pb-20 px-4 sm:px-6 md:px-8">
      {/* Ambient background lines behind header */}
      <div className="absolute top-0 left-0 right-0 h-96 overflow-hidden pointer-events-none z-0 opacity-40">
        <ParticleAvatarCanvas variant="lines-only" theme={theme} />
      </div>

      <div className="relative z-10 max-w-[960px] mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="eyebrow">{about.eyebrow}</div>
          <h1
            className="tracking-[-0.04em] leading-[0.98] font-medium text-[var(--text)] m-0"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(36px, 4.5vw, 64px)',
            }}
          >
            {about.titleSans}
            <span className="serif">{about.titleItalic}</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-[18px] leading-[1.6] m-0">
            {about.description}
          </p>
        </div>

        {/* Liquid Glass Story Card */}
        <div
          className="rounded-[24px] p-8 sm:p-12 space-y-6 shadow-sm"
          style={{
            background: 'var(--glass-surface)',
            backdropFilter: 'blur(24px) saturate(140%)',
            WebkitBackdropFilter: 'blur(24px) saturate(140%)',
            border: '1px solid var(--glass-border)',
            boxShadow: 'var(--glass-shadow)',
          }}
        >
          <h2
            className="text-[26px] font-semibold tracking-tight text-[var(--text)] m-0"
            style={{ fontFamily: 'var(--font-sans)' }}
          >
            {about.storyTitle}
          </h2>
          <p className="text-[16px] text-[var(--text-secondary)] leading-[1.65] m-0">
            {about.storyText}
          </p>
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => onNavigate?.('gallery')}
            className="h-12 px-7 rounded-full bg-[var(--text)] text-[var(--bg)] text-sm font-medium cursor-pointer transition-transform active:scale-98 hover:opacity-90 inline-flex items-center justify-center"
          >
            Explore Creators
          </button>
          <button
            type="button"
            onClick={() => onNavigate?.('home')}
            className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors cursor-pointer px-3 py-2"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};
