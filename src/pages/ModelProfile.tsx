import React, { useState, useEffect, useRef } from 'react';
import { Model, PageId, ThemeMode } from '../types';
import { useCmsModels, CmsModel } from '../lib/cmsStore';
import { AvatarPlaceholder } from '../components/ui/AvatarPlaceholder';
import { ParticleAvatarCanvas } from '../components/ParticleAvatarCanvas';

interface ModelProfileProps {
  model?: Model | CmsModel;
  onBack: () => void;
  onUseModel: (model: any) => void;
  onNavigate?: (page: PageId) => void;
  theme?: ThemeMode;
}

export const ModelProfile: React.FC<ModelProfileProps> = ({
  model: initialModel,
  onBack,
  onUseModel,
  theme = 'light',
}) => {
  const [models] = useCmsModels();

  const creator: CmsModel =
    models.find((m) => m.id === initialModel?.id || m.slug === (initialModel as any)?.slug) ||
    (initialModel as CmsModel) ||
    models[0];

  const [activeMedia, setActiveMedia] = useState<'front' | 'left' | 'right' | 'video'>('front');
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);

  const [activeVoice, setActiveVoice] = useState<'en' | 'ms' | 'zh' | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const activeAudioElRef = useRef<HTMLAudioElement | null>(null);

  const playVoiceSample = (lang: 'en' | 'ms' | 'zh') => {
    if (activeVoice === lang) {
      stopVoice();
      return;
    }

    stopVoice();
    setActiveVoice(lang);

    const uploadedSample = creator.voiceSamples?.[lang];
    if (uploadedSample) {
      try {
        const audio = new Audio(uploadedSample);
        activeAudioElRef.current = audio;
        audio.onended = () => stopVoice();
        audio.play().catch(() => stopVoice());
        return;
      } catch {
        // Fallback to synth if play fails
      }
    }

    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      const freq = lang === 'en' ? 220 : lang === 'ms' ? 240 : 260;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(0.01, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.08, ctx.currentTime + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      oscillatorRef.current = osc;

      setTimeout(() => {
        stopVoice();
      }, 3200);
    } catch {
      setTimeout(() => {
        stopVoice();
      }, 3000);
    }
  };

  const stopVoice = () => {
    if (activeAudioElRef.current) {
      activeAudioElRef.current.pause();
      activeAudioElRef.current = null;
    }
    try {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current.disconnect();
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    } catch {
      // ignore
    }
    oscillatorRef.current = null;
    audioContextRef.current = null;
    setActiveVoice(null);
  };

  useEffect(() => {
    return () => {
      stopVoice();
    };
  }, []);

  const currentPhotoUrl =
    activeMedia === 'video'
      ? null
      : creator.angles?.[activeMedia] || (activeMedia === 'front' ? creator.photoUrl : null);

  return (
    <div className="w-full min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-500 relative overflow-hidden pt-28 pb-20 px-4 sm:px-6 md:px-8">
      {/* Subtle Ambient Background Lines behind header */}
      <div className="absolute top-0 left-0 right-0 h-96 overflow-hidden pointer-events-none z-0 opacity-40">
        <ParticleAvatarCanvas variant="lines-only" theme={theme} />
      </div>

      <div className="relative z-10 max-w-[1140px] mx-auto space-y-6">
        {/* Back Link */}
        <div>
          <button
            type="button"
            onClick={onBack}
            className="tlink cursor-pointer text-sm inline-flex items-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-full px-2 py-1"
          >
            <span>← Back to all models</span>
          </button>
        </div>

        {/* High-Contrast Card */}
        <div
          className="w-full rounded-[24px] p-6 sm:p-8 lg:p-10 shadow-sm"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
          }}
        >
          {/* Main Layout: Compact 280px Portrait Column on Left */}
          <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 lg:gap-12 items-start">
            {/* ===================================================================
                LEFT COLUMN: Compact 280px Visual + Angle Strip
                =================================================================== */}
            <div className="w-full max-w-[280px] mx-auto space-y-3.5">
              {/* Main 3:4 Frame */}
              <div
                className="relative aspect-[3/4] w-full rounded-[16px] overflow-hidden shadow-sm"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border)',
                }}
              >
                {activeMedia === 'video' ? (
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 bg-[var(--surface-2)] text-center relative">
                    {creator.sampleVideoUrl ? (
                      <video
                        src={creator.sampleVideoUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <>
                        <div className="w-14 h-14 rounded-full bg-[var(--text)] text-[var(--bg)] flex items-center justify-center shadow-lg mb-3">
                          {isPlayingVideo ? (
                            <span className="text-sm font-mono font-bold">||</span>
                          ) : (
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                              <polygon points="5 3 19 12 5 21 5 3" />
                            </svg>
                          )}
                        </div>
                        <div className="text-sm font-medium text-[var(--text)]">Sample 9:16 Video Ad</div>
                        <div className="text-xs text-[var(--text-muted)] mt-1">
                          0:15 UGC hook with synced lip cadence
                        </div>
                        <button
                          type="button"
                          onClick={() => setIsPlayingVideo(!isPlayingVideo)}
                          className="mt-4 px-5 py-2 rounded-full bg-[var(--text)] text-[var(--bg)] text-xs font-medium cursor-pointer hover:opacity-90 transition-opacity"
                        >
                          {isPlayingVideo ? 'Pause Take' : 'Play Take'}
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full relative">
                    {currentPhotoUrl ? (
                      <img
                        src={currentPhotoUrl}
                        alt={creator.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <AvatarPlaceholder aspectRatio="3/4" />
                    )}
                    <div
                      className="absolute bottom-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono uppercase tracking-wider"
                      style={{
                        background: 'var(--surface-2)',
                        color: 'var(--text)',
                        border: '1px solid var(--border-strong)',
                      }}
                    >
                      Angle: {activeMedia}
                    </div>
                  </div>
                )}

                {/* Corner AI-generated badge */}
                <div
                  className="group absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium tracking-wide flex items-center gap-1.5 cursor-help select-none"
                  style={{
                    background: 'var(--surface-2)',
                    color: 'var(--text)',
                    border: '1px solid var(--border-strong)',
                  }}
                >
                  <span>AI-generated</span>
                  <span className="w-3.5 h-3.5 rounded-full bg-[var(--border-strong)] text-[10px] flex items-center justify-center font-bold">
                    i
                  </span>
                  <div className="hidden group-hover:block absolute top-7 left-0 w-60 p-2.5 rounded-[8px] bg-[var(--text)] text-[var(--bg)] text-[11px] leading-normal shadow-xl z-20 pointer-events-none">
                    Synthetic creator made by TwinStudio. Safe for commercial brand videos.
                  </div>
                </div>
              </div>

              {/* Compact 4-Thumbnail Strip */}
              <div className="grid grid-cols-4 gap-1.5 text-xs">
                {[
                  { id: 'front', label: 'Front' },
                  { id: 'left', label: 'Left Side' },
                  { id: 'right', label: 'Right Side' },
                  { id: 'video', label: 'Video' },
                ].map((item) => {
                  const isActive = activeMedia === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveMedia(item.id as any)}
                      className="py-1.5 px-1 rounded-[8px] border text-[11px] font-medium text-center truncate transition-colors cursor-pointer focus-visible:outline-none"
                      style={{
                        background: isActive ? 'var(--text)' : 'var(--surface-2)',
                        borderColor: isActive ? 'var(--text)' : 'var(--border-strong)',
                        color: isActive ? 'var(--bg)' : 'var(--text)',
                        fontWeight: isActive ? 600 : 500,
                      }}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* ===================================================================
                RIGHT COLUMN: Decision Info + Voice Previews + Specs + CTA
                =================================================================== */}
            <div className="space-y-6">
              <div>
                <div className="eyebrow mb-2">
                  {creator.discipline ? creator.discipline.toUpperCase() : 'CREATOR'}
                </div>
                <h1
                  className="m-0 text-[var(--text)] font-semibold tracking-tight"
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(32px, 4vw, 44px)',
                    lineHeight: 1.05,
                  }}
                >
                  {creator.name}
                </h1>
              </div>

              {/* Concise Human Bio */}
              <p
                className="text-[var(--text-secondary)] m-0 leading-[1.6] text-[16px]"
                style={{ maxWidth: '48ch' }}
              >
                {creator.bio}
              </p>

              {/* 1-Click Voice Preview Bar in Surface-2 */}
              <div
                className="p-5 rounded-[16px] space-y-3"
                style={{
                  background: 'color-mix(in srgb, var(--surface-2) 75%, transparent)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                  maxWidth: '560px',
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[13px] font-semibold uppercase tracking-wider text-[var(--text)]">
                    Hear voice samples (10s)
                  </span>
                  <span className="group relative cursor-help text-[12px] text-[var(--text-muted)] flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full border border-[var(--border-strong)] flex items-center justify-center font-mono text-[10px]">
                      i
                    </span>
                    <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-3 rounded-[8px] bg-[var(--text)] text-[var(--bg)] text-[12px] leading-normal shadow-xl z-20 pointer-events-none">
                      This exact voice and cadence will be used when you generate a video in any of these languages.
                    </div>
                  </span>
                </div>

                {/* Interactive Audio Play Pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { lang: 'en' as const, label: 'Play English' },
                    { lang: 'ms' as const, label: 'Play Bahasa Malaysia' },
                    { lang: 'zh' as const, label: 'Play Mandarin' },
                  ].map((item) => {
                    const isPlaying = activeVoice === item.lang;
                    const hasCustom = !!creator.voiceSamples?.[item.lang];
                    return (
                      <button
                        key={item.lang}
                        type="button"
                        onClick={() => playVoiceSample(item.lang)}
                        className="px-4 py-2 rounded-full border text-sm font-medium inline-flex items-center gap-2 transition-all cursor-pointer focus-visible:outline-none"
                        style={{
                          background: isPlaying
                            ? 'linear-gradient(135deg, var(--accent-3) 0%, color-mix(in srgb, var(--accent-3) 85%, black) 100%)'
                            : 'color-mix(in srgb, var(--surface) 80%, transparent)',
                          color: isPlaying ? 'var(--bg)' : 'var(--text)',
                          borderColor: isPlaying ? 'var(--accent-3)' : 'var(--border-strong)',
                          boxShadow: isPlaying
                            ? '0 2px 8px -1px color-mix(in srgb, var(--accent-3) 45%, transparent), inset 0 1px 0 0 rgba(255, 255, 255, 0.28)'
                            : '0 1px 2px rgba(0, 0, 0, 0.05)',
                        }}
                      >
                        <span>{isPlaying ? '⏸' : '▶'}</span>
                        <span>{item.label}</span>
                        {hasCustom && <span className="text-[10px] opacity-70">●</span>}
                        {isPlaying && (
                          <span className="flex items-center gap-0.5 ml-1">
                            <span className="w-1 h-3 bg-current animate-pulse" />
                            <span className="w-1 h-4 bg-current animate-pulse delay-75" />
                            <span className="w-1 h-2 bg-current animate-pulse delay-150" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2x2 Specs Grid in Surface-2 */}
              <div
                className="p-5 rounded-[16px] grid grid-cols-1 sm:grid-cols-2 gap-4"
                style={{
                  background: 'color-mix(in srgb, var(--surface-2) 75%, transparent)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                  maxWidth: '560px',
                }}
              >
                <div>
                  <span className="text-[var(--text-secondary)] block uppercase tracking-wider text-[12px] font-semibold mb-1">
                    Best for
                  </span>
                  <span className="font-semibold text-[var(--text)] text-[15px]">
                    {creator.specs?.bestFor || 'TikTok Ads, Reels'}
                  </span>
                </div>

                <div>
                  <span className="text-[var(--text-secondary)] block uppercase tracking-wider text-[12px] font-semibold mb-1">
                    Speaking style
                  </span>
                  <span className="font-semibold text-[var(--text)] text-[15px]">
                    {creator.specs?.speakingStyle || creator.tone}
                  </span>
                </div>

                <div>
                  <span className="text-[var(--text-secondary)] block uppercase tracking-wider text-[12px] font-semibold mb-1">
                    Camera styles
                  </span>
                  <span className="font-semibold text-[var(--text)] text-[15px]">
                    {creator.specs?.cameraStyles || 'Selfie, Talking head'}
                  </span>
                </div>

                <div>
                  <span className="text-[var(--text-secondary)] block uppercase tracking-wider text-[12px] font-semibold mb-1">
                    Turnaround
                  </span>
                  <span className="font-semibold text-[var(--text)] text-[15px]">
                    {creator.specs?.turnaround || '~2 minutes per 9:16 clip'}
                  </span>
                </div>
              </div>

              {/* Primary Action Button */}
              <div className="pt-2" style={{ maxWidth: '560px' }}>
                <button
                  type="button"
                  onClick={() => onUseModel(creator)}
                  className="w-full h-[52px] px-8 rounded-full text-base font-semibold cursor-pointer transition-transform active:scale-98 hover:opacity-90 inline-flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(180deg, var(--text) 0%, color-mix(in srgb, var(--text) 88%, black) 100%)',
                    color: 'var(--bg)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    boxShadow: '0 4px 16px -2px rgba(0, 0, 0, 0.35), inset 0 1px 0 0 rgba(255, 255, 255, 0.22)',
                  }}
                >
                  Use {creator.name} in Studio
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
