import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Sparkles, ArrowRight } from 'lucide-react';
import { PageId } from '../../types';

interface WatchVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
}

export const WatchVideoModal: React.FC<WatchVideoModalProps> = ({
  isOpen,
  onClose,
  onNavigate,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(25);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 100 ? 0 : prev + 1.2));
    }, 120);
    return () => clearInterval(interval);
  }, [isOpen, isPlaying]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Studio Video Showcase"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Dim backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      {/* Modal Surface */}
      <div
        className="relative z-10 w-full max-w-3xl rounded-[24px] border overflow-hidden transition-all text-[var(--text)]"
        style={{
          background: 'var(--surface)',
          borderColor: 'var(--border)',
          boxShadow: 'var(--elev-3)',
        }}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[var(--accent)] animate-pulse" />
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
              TwinStudio® Showcase Reel
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="w-8 h-8 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Video Screen Area */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-6 items-center">
          {/* Vertical Video Simulation Screen */}
          <div className="relative aspect-[9/14] w-full max-w-[280px] mx-auto rounded-[18px] overflow-hidden border border-[var(--border)] bg-[#0d0d0c] shadow-lg flex flex-col justify-between p-4 select-none">
            {/* Top Badge */}
            <div className="flex items-center justify-between text-[11px] text-white/80 z-10">
              <span className="px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-xs font-mono">
                9:16 vertical • 4K
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/50 backdrop-blur-xs text-[var(--accent)] font-semibold">
                <Sparkles className="w-3 h-3" /> TwinStudio AI
              </span>
            </div>

            {/* Simulated Live Avatar Video Visual */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
                {/* Ambient glow */}
                <div className="absolute w-48 h-48 rounded-full bg-[var(--accent)]/20 blur-3xl" />
                <img
                  src="/hero-bust.webp"
                  alt="TwinStudio Avatar Video Frame"
                  className="w-[85%] h-[85%] object-contain object-center opacity-90 transition-transform duration-700"
                  style={{
                    transform: isPlaying ? 'scale(1.03) translateY(-4px)' : 'scale(1)',
                  }}
                />
              </div>
            </div>

            {/* Captions Overlay */}
            <div className="relative z-10 space-y-2">
              <div className="p-2.5 rounded-[12px] bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs leading-snug">
                “Created our entire weekly TikTok ad creative in under 10 minutes — zero camera setup required.”
              </div>

              {/* Progress bar */}
              <div className="w-full bg-white/20 h-1 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white transition-all duration-150"
                  style={{ width: `${progress}%` }}
                />
              </div>

              {/* Player Controls */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                >
                  {isPlaying ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current ml-0.5" />}
                </button>
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="w-7 h-7 rounded-full bg-black/50 text-white flex items-center justify-center cursor-pointer hover:bg-black/70 transition-colors"
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Video Metadata & Pitch */}
          <div className="space-y-5 text-left">
            <div>
              <p className="eyebrow mb-1 text-[var(--accent)]">DIRECTOR'S CUT</p>
              <h3 className="text-2xl font-bold tracking-tight text-[var(--text)] m-0">
                Production-grade AI twins for your brand.
              </h3>
              <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed m-0">
                Watch how TwinStudio blends proprietary facial biometric synthesis, calibrated voice inflection, and natural room acoustics into turn-key 9:16 creator videos.
              </p>
            </div>

            <div className="space-y-2.5 pt-2 border-t border-[var(--border)] text-xs text-[var(--text-secondary)]">
              <div className="flex items-center justify-between py-1 border-b border-[var(--border)]">
                <span className="font-medium text-[var(--text)]">Turnaround time</span>
                <span>~60 seconds per video</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[var(--border)]">
                <span className="font-medium text-[var(--text)]">Voice synthesis</span>
                <span>English, Bahasa Malaysia, Mandarin</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="font-medium text-[var(--text)]">Export formats</span>
                <span>9:16 TikTok / Reels / Shorts (4K MP4)</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate('create-twin');
                }}
                className="h-10 px-5 rounded-full bg-[var(--btn-primary-bg)] text-[var(--btn-primary-text)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:bg-[var(--btn-primary-hover-bg)] transition-colors"
              >
                <span>Create your twin</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onNavigate('studio');
                }}
                className="h-10 px-4 rounded-full border border-[var(--border)] bg-[var(--surface-2)] text-[var(--text)] text-xs font-medium inline-flex items-center cursor-pointer hover:bg-[var(--surface)] transition-colors"
              >
                Test in Studio
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
