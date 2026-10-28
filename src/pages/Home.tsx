import React, { useState } from 'react';
import { PageId, ThemeMode } from '../types';
import { ParticleAvatarCanvas } from '../components/ParticleAvatarCanvas';
import { ParticleTextHeading } from '../components/ParticleTextHeading';
import { useCmsContent } from '../lib/cmsStore';
import { UserRound, Zap, Sparkles, ArrowRight, Play } from 'lucide-react';
import {
  TikTokLogo,
  YouTubeLogo,
  InstagramLogo,
  MetaLogo,
  XLogo,
} from '../components/common/PlatformLogos';
import { WatchVideoModal } from '../components/common/WatchVideoModal';

interface HomeProps {
  onNavigate: (page: PageId) => void;
  theme?: ThemeMode;
}

const FEATURES = [
  {
    title: 'Realistic Avatars',
    desc: 'Lifelike, expressive, ready for your brand.',
    icon: UserRound,
  },
  {
    title: 'Instant Creation',
    desc: 'Go from idea to AI twin in minutes.',
    icon: Zap,
  },
  {
    title: 'Built for Creators',
    desc: 'UGC, ads, social — all in one place.',
    icon: Sparkles,
  },
];

export const Home: React.FC<HomeProps> = ({ onNavigate, theme = 'light' }) => {
  const [content] = useCmsContent();
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const hero = content.hero;
  const statement = content.statement;
  const stats = content.stats;
  const marquee = content.marquee;

  return (
    <div className="w-full relative overflow-x-clip bg-[var(--bg)] text-[var(--text)] selection:bg-[var(--text)] selection:text-[var(--bg)]">
      {/* =====================================================================
          HERO SECTION — EXACT STUDIO REFERENCE
          ===================================================================== */}
      <section className="relative w-full min-h-[100svh] flex flex-col justify-between overflow-hidden">
        {/* 1. Soft photographic studio softbox diffuser lighting (top-left) */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-0 w-[60vw] h-[70vh] pointer-events-none select-none z-0"
          style={{
            background:
              theme === 'dark'
                ? 'radial-gradient(ellipse at 10% 5%, rgba(65, 58, 48, 0.45) 0%, transparent 68%)'
                : 'radial-gradient(ellipse at 10% 5%, rgba(255, 255, 255, 0.75) 0%, transparent 68%)',
          }}
        />

        {/* 2. Soft floor contact shadow grounding the floating 3D particle avatar */}
        <div
          aria-hidden="true"
          className="absolute left-1/2 -translate-x-1/2 bottom-[14%] sm:bottom-[16%] w-[420px] max-w-[85vw] h-[34px] pointer-events-none select-none z-0 rounded-[100%]"
          style={{
            background:
              theme === 'dark'
                ? 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.55) 0%, transparent 72%)'
                : 'radial-gradient(ellipse at center, rgba(42, 34, 26, 0.09) 0%, transparent 72%)',
            filter: 'blur(4px)',
          }}
        />

        {/* 3. The Central 3D Interactive Particle Avatar (Strictly Protected Canvas) */}
        <div
          className="absolute inset-0 z-[1] pointer-events-auto"
          style={{
            maskImage:
              'linear-gradient(to bottom, transparent 0px, black 64px, black 84%, transparent 98%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0px, black 64px, black 84%, transparent 98%)',
          }}
        >
          <ParticleAvatarCanvas mode="hero" imageUrl={hero.heroAvatarImageUrl} theme={theme} />
        </div>

        {/* 4. Hero Content Grid Overlay */}
        <div
          className="relative z-[2] flex-1 w-full flex flex-col justify-between pointer-events-none"
          style={{
            padding: 'clamp(100px, 12vh, 140px) var(--gut) clamp(24px, 3.5vh, 40px)',
            minHeight: '100svh',
          }}
        >
          {/* Main 3-Column Content Row (Desktop) */}
          <div className="hidden xl:grid xl:grid-cols-[minmax(320px,38%)_1fr_minmax(240px,24%)] xl:gap-8 xl:items-center xl:flex-1">
            {/* Left Column: Eyebrow + Headline + Description + CTAs */}
            <div className="max-w-[540px] pointer-events-none">
              {/* Eyebrow: NO decorative line above or around */}
              <p
                className="eyebrow m-0 mb-6 font-medium text-[var(--text-muted)] tracking-[0.18em] text-[11px] uppercase select-none"
                style={{ letterSpacing: '0.18em' }}
              >
                {hero.eyebrow || 'AI HUMAN STUDIO, EST. 2026'}
              </p>

              {/* Headline: Sans-serif Line 1 + Editorial Serif Italics Lines 2 & 3 */}
              <h1
                className="m-0 text-[var(--text)] tracking-[-0.04em]"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(50px, 5.2vw, 76px)',
                  fontWeight: 650,
                  lineHeight: 0.94,
                }}
              >
                <span className="block whitespace-nowrap">{hero.headingSans || 'Your AI Twin.'}</span>
                {(hero.headingItalic || 'Real Content.\nLess Effort.')
                  .split('\n')
                  .map((line, idx) => (
                    <span
                      key={idx}
                      className="block serif font-normal italic tracking-[-0.02em] leading-[0.98] mt-1 whitespace-nowrap"
                    >
                      {line}
                    </span>
                  ))}
              </h1>

              {/* Supporting Description */}
              <p
                className="mt-6 mb-0 text-[var(--text-secondary)]"
                style={{
                  maxWidth: '380px',
                  fontSize: '15.5px',
                  lineHeight: 1.62,
                }}
              >
                {hero.description ||
                  'Create lifelike AI twins for UGC, marketing and social content — in minutes. No camera, no studio, no limits.'}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3.5 pt-8 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => onNavigate('create-twin')}
                  className="h-[44px] px-6 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] hover:bg-[var(--btn-primary-hover-bg)] font-medium text-[14px] inline-flex items-center gap-2 transition-all cursor-pointer shadow-[var(--elev-1)] active:scale-98"
                >
                  <span>{hero.primaryCta || 'Create your twin'}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="h-[44px] px-5 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--text)] font-medium text-[14px] inline-flex items-center gap-2.5 transition-all cursor-pointer shadow-[var(--elev-1)] active:scale-98"
                >
                  <span className="w-5 h-5 rounded-full border border-[var(--border-strong)] flex items-center justify-center shrink-0">
                    <Play className="w-2.5 h-2.5 fill-current ml-0.5 text-[var(--text)]" aria-hidden="true" />
                  </span>
                  <span>Watch video</span>
                </button>
              </div>
            </div>

            {/* Center Column: Open breathing space for 3D avatar */}
            <div aria-hidden="true" className="min-h-[300px]" />

            {/* Right Column: 3 Feature Items */}
            <ul className="list-none m-0 p-0 space-y-7 justify-self-end w-full max-w-[260px] pointer-events-auto">
              {FEATURES.map((item) => (
                <li key={item.title} className="flex items-start gap-3.5">
                  <span
                    className="mt-0.5 inline-grid place-items-center shrink-0 rounded-full w-[36px] h-[36px] border border-[var(--border)] bg-[var(--surface)]/70 text-[var(--text)] shadow-[var(--elev-1)] transition-colors"
                  >
                    <item.icon className="w-4 h-4" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div>
                    <div className="text-[14.5px] font-medium tracking-tight text-[var(--text)]">
                      {item.title}
                    </div>
                    <p className="m-0 mt-0.5 text-[12.5px] leading-relaxed text-[var(--text-muted)]">
                      {item.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Tablet & Mobile Stack Layout */}
          <div className="xl:hidden flex flex-col justify-between gap-8 pb-4 flex-1">
            <div className="max-w-[540px] pointer-events-none">
              <p
                className="eyebrow m-0 mb-4 font-medium text-[var(--text-muted)] tracking-[0.18em] text-[10.5px] uppercase"
              >
                {hero.eyebrow || 'AI HUMAN STUDIO, EST. 2026'}
              </p>
              <h1
                className="m-0 text-[var(--text)] tracking-[-0.04em]"
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(38px, 8.5vw, 62px)',
                  fontWeight: 650,
                  lineHeight: 0.94,
                }}
              >
                <span className="block">{hero.headingSans || 'Your AI Twin.'}</span>
                {(hero.headingItalic || 'Real Content.\nLess Effort.')
                  .split('\n')
                  .map((line, idx) => (
                    <span
                      key={idx}
                      className="block serif font-normal italic tracking-[-0.02em] leading-[0.98] mt-1"
                    >
                      {line}
                    </span>
                  ))}
              </h1>
              <p className="mt-5 mb-0 text-[var(--text-secondary)] max-w-[400px] text-[15px] leading-[1.6]">
                {hero.description ||
                  'Create lifelike AI twins for UGC, marketing and social content — in minutes. No camera, no studio, no limits.'}
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-6 pointer-events-auto">
                <button
                  type="button"
                  onClick={() => onNavigate('create-twin')}
                  className="h-[42px] px-5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] font-medium text-[13.5px] inline-flex items-center gap-2 cursor-pointer shadow-[var(--elev-1)]"
                >
                  <span>{hero.primaryCta || 'Create your twin'}</span>
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => setVideoModalOpen(true)}
                  className="h-[42px] px-4 rounded-full border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] font-medium text-[13.5px] inline-flex items-center gap-2 cursor-pointer shadow-[var(--elev-1)]"
                >
                  <span className="w-4.5 h-4.5 rounded-full border border-[var(--border-strong)] flex items-center justify-center shrink-0">
                    <Play className="w-2 h-2 fill-current ml-0.5 text-[var(--text)]" aria-hidden="true" />
                  </span>
                  <span>Watch video</span>
                </button>
              </div>
            </div>

            {/* Mobile Features Row */}
            <ul className="list-none m-0 p-0 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl pointer-events-auto pt-4">
              {FEATURES.map((item) => (
                <li key={item.title} className="flex items-start gap-3">
                  <span
                    className="mt-0.5 inline-grid place-items-center shrink-0 rounded-full w-[34px] h-[34px] border border-[var(--border)] bg-[var(--surface)]/70 text-[var(--text)]"
                  >
                    <item.icon className="w-3.5 h-3.5" strokeWidth={1.5} aria-hidden="true" />
                  </span>
                  <div>
                    <div className="text-[13.5px] font-medium text-[var(--text)]">{item.title}</div>
                    <p className="m-0 mt-0.5 text-[12px] text-[var(--text-muted)] leading-snug">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Bar: Left Social Proof + Right Editorial Signature */}
          <div className="mt-auto pt-8 pb-1 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            {/* Left: Trusted By Creators Worldwide & SVG Platform Logos */}
            <div className="space-y-3 pointer-events-auto">
              <div className="flex items-center gap-3">
                <span className="text-[10px] tracking-[0.16em] uppercase text-[var(--text-muted)] font-medium select-none">
                  TRUSTED BY CREATORS WORLDWIDE
                </span>
                <span className="h-px w-16 bg-[var(--border)] hidden sm:block opacity-60" />
              </div>
              <div className="flex flex-wrap items-center gap-5 sm:gap-7 text-[var(--text-muted)]">
                <TikTokLogo className="h-4 sm:h-[18px] w-auto fill-current opacity-75 hover:opacity-100 transition-opacity" />
                <YouTubeLogo className="h-4 sm:h-[18px] w-auto fill-current opacity-75 hover:opacity-100 transition-opacity" />
                <InstagramLogo className="h-4 sm:h-[18px] w-auto fill-current opacity-75 hover:opacity-100 transition-opacity" />
                <MetaLogo className="h-4 sm:h-[18px] w-auto fill-current opacity-75 hover:opacity-100 transition-opacity" />
                <XLogo className="h-3.5 sm:h-4 w-auto fill-current opacity-75 hover:opacity-100 transition-opacity" />
              </div>
            </div>

            {/* Right: Editorial Signature */}
            <div className="pointer-events-auto flex items-end gap-5">
              <p className="m-0 serif italic text-[24px] sm:text-[28px] text-[var(--text)] leading-[1.08] tracking-[-0.02em] select-none">
                More content.
                <br />
                More you.
              </p>
              <div className="flex items-center mb-1.5 text-[var(--text)] opacity-80">
                <span className="w-10 sm:w-14 h-px bg-current" />
                <ArrowRight className="w-4 h-4 -ml-1" strokeWidth={1.4} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          STATEMENT SECTION
          ===================================================================== */}
      <section
        className="w-full relative"
        style={{
          padding: 'clamp(88px, 12vw, 160px) var(--gut)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="eyebrow">{statement.eyebrow}</div>
        <div className="w-full max-w-5xl">
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
        <div
          className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] lg:grid-cols-[1.5fr_1.8fr_1fr] items-end gap-8"
          style={{ marginTop: 'clamp(40px, 6vw, 88px)' }}
        >
          <div className="hidden lg:block" />
          <div>
            <p className="lead">{statement.description}</p>
          </div>
          <div className="lg:justify-self-end">
            <button type="button" onClick={() => onNavigate('about')} className="tlink cursor-pointer">
              <span>{statement.ctaText}</span>
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================================
          APPROACH SECTION
          ===================================================================== */}
      <section
        id="approach"
        className="w-full relative overflow-hidden"
        style={{
          padding: 'clamp(72px, 9vw, 128px) var(--gut)',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto opacity-35">
          <ParticleAvatarCanvas variant="lines-only" theme={theme} />
        </div>
        <div className="relative z-10 max-w-[1200px] mx-auto space-y-12">
          <div className="space-y-3 max-w-2xl">
            <div className="eyebrow mb-2">{content.approach?.eyebrow || 'APPROACH'}</div>
            <h2
              className="tracking-[-0.04em] leading-[0.98] font-medium text-[var(--text)] m-0"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(36px, 4.6vw, 64px)',
              }}
            >
              {content.approach?.headingSans || 'From script '}{' '}
              <span className="serif">{content.approach?.headingItalic || 'to human.'}</span>
            </h2>
            <p className="text-[var(--text-secondary)] text-[17px] leading-relaxed m-0 max-w-[54ch]">
              Pick a creator, paste what you want them to say, and get a vertical video ready for TikTok or Reels in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {(content.approach?.steps || []).map((card, idx) => (
              <div
                key={card.num || idx}
                className="rounded-[20px] p-7 transition-all duration-200"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                  boxShadow: 'var(--elev-1)',
                }}
              >
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--surface-2)] text-[12px] font-medium text-[var(--text)] border border-[var(--border)]">
                  {card.num ? `${card.num} ${card.tab || ''}`.trim() : `0${idx + 1}`}
                </span>
                <h3 className="text-[18px] font-medium text-[var(--text)] mt-4 mb-2 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-[14.5px] text-[var(--text-secondary)] leading-[1.6] m-0">
                  {card.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          STATS & MARQUEE SECTION
          ===================================================================== */}
      <section
        className="w-full relative"
        style={{
          padding: 'clamp(56px, 7vw, 100px) var(--gut)',
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
                  fontSize: 'clamp(40px, 5vw, 72px)',
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-[var(--text-secondary)]">{stat.label}</div>
            </div>
          ))}
        </div>
        <div className="mt-20 overflow-hidden select-none pointer-events-none opacity-55">
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

      {/* Video Showcase Modal */}
      <WatchVideoModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onNavigate={onNavigate}
      />
    </div>
  );
};
