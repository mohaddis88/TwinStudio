import React, { useState, useEffect, useRef } from 'react';
import { PageId } from '../../types';
import { HomeCard } from './HomeCard';
import {
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Layers,
  Sparkles,
  Sliders,
  Eye,
  ShieldCheck,
  Rocket,
  Building,
  Users,
  Lock,
} from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: PageId) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Steps Section Line Draw on Scroll (Transform/Opacity only)
  const stepsSectionRef = useRef<HTMLDivElement>(null);
  const [isStepsRevealed, setIsStepsRevealed] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(motionQuery.matches);
    if (motionQuery.matches) {
      setIsStepsRevealed(true);
      return;
    }

    const el = stepsSectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsStepsRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const faqs = [
    {
      q: 'Do I need studio equipment or filming gear?',
      a: 'No. You select a synthetic creator model, paste your marketing script, and download an MP4 video in minutes.',
    },
    {
      q: 'Can other brands use my private twin?',
      a: 'No. Custom twins are encrypted to your workspace. Only you have permission to generate videos using your likeness.',
    },
    {
      q: 'Are these creators cleared for paid ad campaigns?',
      a: 'Yes. Every model in the library includes full commercial rights for Meta ads, TikTok ads, and website landing pages.',
    },
    {
      q: 'How does TwinStudio prevent impersonation?',
      a: 'We require a live phrase verification check and signed consent before any custom twin is trained. Public figures cannot be cloned.',
    },
    {
      q: 'What video aspect ratios can I export?',
      a: 'You can export 9:16 vertical video for TikTok and Reels, or 16:9 widescreen for desktop landing pages.',
    },
  ];

  return (
    <div className="space-y-28 md:space-y-36">
      {/* 1. HERO SECTION (Text-only centered hero with generous spacing) */}
      <section className="relative pt-10 sm:pt-20 pb-6 flex flex-col items-center justify-center text-center max-w-4xl mx-auto">
        <div className="space-y-6 sm:space-y-8 max-w-3xl mx-auto">
          {/* Small Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--border-color)] text-xs text-[var(--text-secondary)] bg-[var(--surface-color)] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[var(--border-focus)]" />
            <span>Synthetic UGC video creator library</span>
          </div>

          {/* Serif-accent headline */}
          <h1 className="font-sans text-4xl sm:text-6xl lg:text-7xl font-semibold text-[var(--text-main)] leading-[1.08] tracking-tight">
            AI creators that look like{' '}
            <span className="font-serif italic font-normal text-[var(--border-focus)]">people</span>.
          </h1>

          {/* One sentence */}
          <p className="text-base sm:text-lg text-[var(--text-secondary)] leading-relaxed max-w-xl mx-auto">
            Pick a model, paste a script, get a UGC video in minutes. No shoot, no studio.
          </p>

          {/* Two CTAs ("Browse models" primary, "Create your twin" secondary) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('gallery')}
              className="w-full sm:w-auto h-12 px-8 font-semibold text-xs rounded-[12px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
              style={{
                background: 'var(--scrollbar-thumb)',
                color: 'var(--accent-text)',
              }}
            >
              <span>Browse models</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => onNavigate('create-twin')}
              className="w-full sm:w-auto h-12 px-6 border border-[var(--border-color)] hover:bg-[var(--surface-color)] text-[var(--text-main)] text-xs font-semibold rounded-[12px] active:scale-[0.98] transition-all flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
            >
              <span>Create your twin</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. WHAT IT IS (3 cards: icon, title ≤4 words, one sentence ≤16 words) */}
      <section className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center space-y-1.5">
          <h2 className="font-sans text-2xl sm:text-3xl font-semibold text-[var(--text-main)]">
            What TwinStudio <span className="font-serif italic font-normal text-[var(--border-focus)]">is</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            A reliable creator engine designed for growth marketing teams.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HomeCard
            icon={<Layers className="w-5 h-5" />}
            title="Pre-cleared creator likenesses"
            description="Diverse actor models ready for direct response marketing with zero talent contract negotiations."
            staggerIndex={0}
          />
          <HomeCard
            icon={<Sparkles className="w-5 h-5" />}
            title="Natural micro-movement"
            description="Conversational speech cadence, authentic eye blinks, and subtle breathing motion on every take."
            staggerIndex={1}
          />
          <HomeCard
            icon={<Sliders className="w-5 h-5" />}
            title="Plug-and-play ad formats"
            description="Generate vertical selfie takes, talking head walkthroughs, and product demos with one click."
            staggerIndex={2}
          />
        </div>
      </section>

      {/* 3. HOW IT WORKS (4 steps: title ≤4 words, one sentence ≤16 words) */}
      {/* Steps section: connecting line draws on scroll. Transform/opacity only. */}
      <section
        ref={stepsSectionRef}
        className="relative p-8 sm:p-12 rounded-[20px] border border-[var(--border-color)] shadow-sm space-y-8 max-w-5xl mx-auto overflow-hidden"
        style={{ backgroundColor: 'var(--surface-color)' }}
      >
        <div className="text-center space-y-1.5 relative z-10">
          <h2 className="font-sans text-2xl sm:text-3xl font-semibold text-[var(--text-main)]">
            How it <span className="font-serif italic font-normal text-[var(--border-focus)]">works</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            From written script to finished video ad in four simple steps.
          </p>
        </div>

        {/* Connecting line that draws on scroll across the 4 steps (transform: scaleX, transform/opacity only) */}
        <div
          aria-hidden="true"
          className="hidden lg:block absolute top-[148px] left-[7%] right-[7%] h-[2px] pointer-events-none z-0"
        >
          <div
            className="h-full w-full bg-gradient-to-r from-transparent via-[var(--border-focus)] to-transparent"
            style={{
              transform: isStepsRevealed ? 'scaleX(1)' : 'scaleX(0)',
              transformOrigin: 'left',
              opacity: isStepsRevealed ? 0.65 : 0,
              transition: isReducedMotion
                ? 'none'
                : 'transform 1.1s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease',
              willChange: 'transform, opacity',
            }}
          />
        </div>

        {/* 4 Step Cards with motion, hover lift, gradient border sweep, pointer-follow highlight */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          <HomeCard
            stepNumber="01"
            title="Pick a model"
            description="Select an AI creator matched to your audience niche or create your private twin."
            staggerIndex={0}
          />
          <HomeCard
            stepNumber="02"
            title="Add your script"
            description="Paste your marketing copy or use our quick prompt helper for problem-solution hooks."
            staggerIndex={1}
          />
          <HomeCard
            stepNumber="03"
            title="Choose camera format"
            description="Pick casual selfie style for TikTok, or framed talking head for landing pages."
            staggerIndex={2}
          />
          <HomeCard
            stepNumber="04"
            title="Export MP4"
            description="Download high resolution video with synchronized speech in thirty seconds."
            staggerIndex={3}
          />
        </div>
      </section>

      {/* 4. WHY IT LOOKS REAL (3 cards: icon, title ≤4 words, one sentence ≤16 words) */}
      <section className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center space-y-1.5">
          <h2 className="font-sans text-2xl sm:text-3xl font-semibold text-[var(--text-main)]">
            Why it looks <span className="font-serif italic font-normal text-[var(--border-focus)]">real</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Engineered to bypass the uncanny valley and look natural on social feeds.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HomeCard
            icon={<Eye className="w-5 h-5" />}
            title="Organic eye saccades"
            description="Micro-movements and natural blinking patterns prevent the static robotic stare common in basic tools."
            staggerIndex={0}
          />
          <HomeCard
            icon={<Sparkles className="w-5 h-5" />}
            title="Sub-surface skin diffusion"
            description="Layered subsurface scattering recreates warm studio lighting and realistic cheek skin textures."
            staggerIndex={1}
          />
          <HomeCard
            icon={<ShieldCheck className="w-5 h-5" />}
            title="Conversational speech cadence"
            description="Speech models include subtle inhalation pauses, natural pitch shifts, and realistic syllable stress."
            staggerIndex={2}
          />
        </div>
      </section>

      {/* 5. WHO IT'S FOR (3 cards: icon, title ≤4 words, one sentence ≤16 words) */}
      <section className="space-y-6 max-w-5xl mx-auto">
        <div className="text-center space-y-1.5">
          <h2 className="font-sans text-2xl sm:text-3xl font-semibold text-[var(--text-main)]">
            Who it is <span className="font-serif italic font-normal text-[var(--border-focus)]">for</span>
          </h2>
          <p className="text-xs text-[var(--text-muted)]">
            Built for modern marketers who require rapid creative velocity.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <HomeCard
            icon={<Rocket className="w-5 h-5" />}
            title="Performance marketers"
            description="Test ten hook variants in an afternoon instead of waiting weeks for creator revisions."
            staggerIndex={0}
          />
          <HomeCard
            icon={<Building className="w-5 h-5" />}
            title="DTC brand founders"
            description="Produce continuous organic video volume without spending five figures on monthly creator retainers."
            staggerIndex={1}
          />
          <HomeCard
            icon={<Users className="w-5 h-5" />}
            title="Growth agencies"
            description="Deliver fresh ad creatives to every client account every week with minimal production overhead."
            staggerIndex={2}
          />
        </div>
      </section>

      {/* 6. TWIN TEASER */}
      <section
        className="p-8 sm:p-12 rounded-[20px] border border-[var(--border-color)] shadow-sm max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6"
        style={{ backgroundColor: 'var(--surface-color)' }}
      >
        <div className="space-y-2 max-w-lg text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs text-[var(--border-focus)] bg-[var(--surface-elevated)] border border-[var(--border-color)]">
            <Lock className="w-3.5 h-3.5" />
            <span>Private biometrics</span>
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-semibold text-[var(--text-main)]">
            Want yourself on <span className="font-serif italic font-normal text-[var(--border-focus)]">camera</span>?
          </h2>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Upload three daylight photos and a short voice note to train your verified creator twin.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onNavigate('create-twin')}
          className="h-11 px-6 font-semibold text-xs rounded-[12px] active:scale-[0.98] transition-all whitespace-nowrap shadow-sm"
          style={{
            background: 'var(--scrollbar-thumb)',
            color: 'var(--accent-text)',
          }}
        >
          Create your twin
        </button>
      </section>

      {/* 7. FAQ ACCORDION */}
      <section className="space-y-6 max-w-3xl mx-auto">
        <div className="text-center space-y-1.5">
          <h2 className="font-sans text-2xl sm:text-3xl font-semibold text-[var(--text-main)]">
            Common <span className="font-serif italic font-normal text-[var(--border-focus)]">questions</span>
          </h2>
        </div>

        <div className="space-y-2.5">
          {faqs.map((faq, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div
                key={faq.q}
                className="rounded-[20px] border border-[var(--border-color)] overflow-hidden transition-colors"
                style={{ backgroundColor: 'var(--surface-color)' }}
              >
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-xs sm:text-sm font-semibold text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                >
                  <span>{faq.q}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[var(--border-focus)] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-4 sm:px-5 pb-4 pt-0 text-xs text-[var(--text-secondary)] leading-relaxed border-t border-[var(--border-color)]/30 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 8. FINAL CTA */}
      <section
        className="p-10 sm:p-14 text-center max-w-3xl mx-auto space-y-5 rounded-[20px] border border-[var(--border-color)] shadow-sm"
        style={{ backgroundColor: 'var(--surface-color)' }}
      >
        <h2 className="font-sans text-3xl font-semibold text-[var(--text-main)]">
          Start producing video ads <span className="font-serif italic font-normal text-[var(--border-focus)]">today</span>.
        </h2>
        <p className="text-xs text-[var(--text-secondary)] max-w-sm mx-auto leading-relaxed">
          Explore the creator library or generate your first test video in two minutes.
        </p>

        <div className="pt-2 flex justify-center">
          <button
            type="button"
            onClick={() => onNavigate('gallery')}
            className="h-12 px-8 font-semibold text-xs rounded-[12px] active:scale-[0.98] transition-all shadow-sm"
            style={{
              background: 'var(--scrollbar-thumb)',
              color: 'var(--accent-text)',
            }}
          >
            Explore creator library
          </button>
        </div>
      </section>
    </div>
  );
};
