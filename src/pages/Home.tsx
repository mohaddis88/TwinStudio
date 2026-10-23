import React, { useState, useRef } from 'react';
import { PageId, ThemeMode } from '../types';
import { ParticleAvatarCanvas } from '../components/ParticleAvatarCanvas';
import { ParticleTextHeading } from '../components/ParticleTextHeading';
import { useCmsContent } from '../lib/cmsStore';

interface HomeProps {
  onNavigate: (page: PageId) => void;
  theme?: ThemeMode;
}

export const Home: React.FC<HomeProps> = ({ onNavigate, theme = 'light' }) => {
  const [content] = useCmsContent();

  const hero = content.hero;
  const statement = content.statement;
  const stats = content.stats;
  const marquee = content.marquee;

  return (
    <div className="w-full relative overflow-x-clip bg-[var(--bg)] text-[var(--text)] transition-colors duration-500">
      {/* =========================================================================
          SECTION 1: HERO
          ========================================================================= */}
      <section
        className="relative w-full min-h-[90vh] md:min-h-screen flex flex-col justify-between overflow-hidden"
        style={{
          padding: 'clamp(80px, 10vh, 120px) var(--gut) clamp(20px, 3vh, 48px)',
        }}
      >
        {/* Giant Centered Watermark: Positioned directly behind the avatar on all screens */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 select-none pointer-events-none whitespace-nowrap font-bold tracking-[-0.06em] leading-[0.8]"
          style={{
            top: 'clamp(140px, 26vh, 36%)',
            transform: 'translate(-50%, -50%)',
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(90px, 22vw, 360px)',
            color: 'color-mix(in srgb, var(--text) 4.5%, transparent)',
            zIndex: 0,
          }}
        >
          {hero.watermark}
        </div>

        {/* Full-Stage 3D Head-to-Shoulders Mannequin Particle Canvas */}
        <div
          className="absolute inset-0 z-0 pointer-events-auto"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0px, black 96px, black 72%, transparent 95%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 96px, black 72%, transparent 95%)',
          }}
        >
          <ParticleAvatarCanvas mode="hero" imageUrl={hero.heroAvatarImageUrl} theme={theme} />
        </div>

        {/* Top Spacer: Reduced height on mobile to keep avatar and headline cohesive */}
        <div className="flex-1 min-h-[20px] md:min-h-[80px]" />

        {/* Bottom Split Grid */}
        <div
          className="relative z-10 w-full grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] items-end gap-6 sm:gap-10 lg:gap-12"
          style={{
            padding: '0 0 clamp(8px, 1.5vh, 16px)',
          }}
        >
          {/* Left Column: Eyebrow + Display Headline */}
          <div className="p-3 sm:p-4 rounded-[20px]">
            <div className="eyebrow mb-2 sm:mb-4">{hero.eyebrow}</div>
            <h1
              className="tracking-[-0.045em] leading-[0.94] m-0 text-[var(--text)]"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(32px, 6.4vw, 104px)',
                fontWeight: 600,
              }}
            >
              <span className="block">{hero.headingSans}</span>
              <span
                className="block serif font-normal text-[var(--text)]"
                style={{ fontSize: '1.04em' }}
              >
                {hero.headingItalic}
              </span>
            </h1>
          </div>

          {/* Right Column: Lead copy + Buttons */}
          <div className="max-w-[420px] lg:justify-self-end p-3 sm:p-4 rounded-[20px]">
            <p
              className="text-[var(--text-secondary)] m-0 leading-relaxed"
              style={{ fontSize: 'clamp(15px, 1.15vw, 17px)' }}
            >
              {hero.description}
            </p>

            <div className="flex flex-wrap items-center gap-5 pt-6">
              <button
                type="button"
                onClick={() => onNavigate('studio')}
                className="btn group inline-flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
                style={{
                  height: '48px',
                  padding: '0 24px',
                  borderRadius: '999px',
                  background: 'var(--text)',
                  color: 'var(--bg)',
                  fontSize: '14.5px',
                  fontWeight: 500,
                }}
              >
                <span>{hero.primaryCta}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('gallery')}
                className="tlink cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              >
                <span>{hero.secondaryCta}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2: STUDIO STATEMENT
          ========================================================================= */}
      <section
        className="w-full relative"
        style={{
          padding: 'clamp(100px, 14vw, 180px) var(--gut)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="eyebrow">{statement.eyebrow}</div>

        {/* Stipple-to-Solid Text Reveal */}
        <div className="w-full max-w-5xl lg:max-w-6xl">
          <ParticleTextHeading
            as="h2"
            className="tracking-[-0.045em] leading-[0.96] font-medium text-[var(--text)]"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'var(--text-statement)',
              lineHeight: 0.98,
              letterSpacing: '-0.045em',
            }}
            line1={statement.line1}
            line2Prefix={statement.line2Prefix}
            line2Accent={statement.line2Accent}
          />
        </div>

        {/* Offset Bottom Row */}
        <div
          className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.5fr_1.8fr_1fr] items-end gap-8"
          style={{ marginTop: 'clamp(48px, 7vw, 100px)' }}
        >
          <div className="hidden lg:block" />
          <div>
            <p className="lead">{statement.description}</p>
          </div>
          <div className="lg:justify-self-end">
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="tlink cursor-pointer"
            >
              <span>{statement.ctaText}</span>
            </button>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 4: APPROACH (Full-Desktop Background Lines + Liquid Glass Cards)
          ========================================================================= */}
      <section
        id="approach"
        className="w-full relative overflow-hidden"
        style={{
          padding: 'clamp(80px, 10vw, 140px) clamp(20px, 5vw, 64px)',
          borderTop: '1px solid var(--border)',
        }}
      >
        {/* Full-Desktop Width Background Flowing Lines Layer (Sitting below text and cards) */}
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto opacity-45">
          <ParticleAvatarCanvas variant="lines-only" theme={theme} />
        </div>

        {/* Foreground Content */}
        <div className="relative z-10 max-w-[1200px] mx-auto space-y-12">
          {/* Header */}
          <div className="space-y-3 max-w-2xl">
            <div className="eyebrow mb-2">APPROACH</div>
            <h2
              className="tracking-[-0.04em] leading-[0.98] font-medium text-[var(--text)] m-0"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(40px, 5vw, 68px)',
              }}
            >
              From script <span className="serif">to human.</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-[18px] leading-relaxed m-0 max-w-[54ch]">
              Pick a creator, paste what you want them to say, and get a vertical video ready for TikTok or Reels in minutes.
            </p>
          </div>

          {/* 4-Card Responsive Grid with Liquid Glass Design */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                step: '01 Pick a face',
                title: 'Digital Likeness',
                desc: 'Choose a Malaysian creator from our library, or verify your own face and voice to build a private twin.',
              },
              {
                step: '02 Write like speech',
                title: 'Natural Cadence',
                desc: 'Type your script in English, Bahasa Malaysia, or Mandarin. Keep it conversational and under 600 characters.',
              },
              {
                step: '03 Natural motion',
                title: 'Dynamic Framing',
                desc: 'Choose selfie, talking head, or product demo framing with real room lighting and handheld camera feel.',
              },
              {
                step: '04 Ready for 9:16',
                title: 'Turnkey Export',
                desc: 'Download your vertical MP4 clip in minutes, labeled and ready to post on TikTok, Reels, or Shorts.',
              },
            ].map((card) => (
              <div
                key={card.step}
                className="rounded-[20px] p-7 transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: 'var(--glass-surface)',
                  backdropFilter: 'blur(20px) saturate(140%)',
                  WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                  border: '1px solid var(--glass-border)',
                  boxShadow: 'var(--glass-shadow)',
                }}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--surface-2)] text-[13px] font-medium text-[var(--text)] border border-[var(--border)]">
                  {card.step}
                </span>
                <h3 className="text-[20px] font-semibold text-[var(--text)] mt-4 mb-2 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-[15px] text-[var(--text-secondary)] leading-[1.6] m-0">
                  {card.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 5: STUDIO STATS & CLIENT MARQUEE
          ========================================================================= */}
      <section
        className="w-full relative"
        style={{
          padding: 'clamp(64px, 8vw, 110px) var(--gut)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="border-l border-[var(--border)] pl-5 space-y-2">
              <div
                className="font-medium tracking-tight text-[var(--text)]"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(44px, 5.5vw, 84px)',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Marquee Track */}
        <div className="mt-20 overflow-hidden select-none pointer-events-none opacity-60">
          <div className="flex gap-16 whitespace-nowrap animate-marquee">
            {marquee.map((text, i) => (
              <span
                key={i}
                className={`text-2xl sm:text-3xl text-[var(--text-secondary)] ${
                  i % 2 === 1 ? 'serif' : 'font-medium'
                }`}
              >
                {text}
              </span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
