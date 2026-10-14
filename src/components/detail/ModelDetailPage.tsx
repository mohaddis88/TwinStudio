import React, { useState, useEffect, useRef } from 'react';
import { Model, AngleView, VideoStyle, SampleClip } from '../../types';
import { GlassFigure } from '../common/GlassFigure';
import { ContainerOverlayScrollbar } from '../common/OverlayScrollbar';
import {
  ArrowLeft,
  ArrowRight,
  Play,
  Pause,
  Volume2,
  Check,
  Video,
  Download,
  Copy,
  X,
  Sparkles,
  Camera,
  FileText,
} from 'lucide-react';

interface ModelDetailPageProps {
  model: Model;
  onBack: () => void;
  onUseModel: (model: Model) => void;
  onReplaceMedia: (slot: 'front' | 'side' | 'up' | 'down', dataUrl: string) => void;
}

type TabId = 'overview' | 'looks' | 'videos' | 'voice';

export const ModelDetailPage: React.FC<ModelDetailPageProps> = ({
  model,
  onBack,
  onUseModel,
  onReplaceMedia,
}) => {
  // 4 Tabs: Overview / Looks / Videos / Voice
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Looks tab angle
  const [selectedAngle, setSelectedAngle] = useState<AngleView>('Front');

  // Videos tab style
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle>('Selfie');
  const [isPlayingClip, setIsPlayingClip] = useState(false);

  // Voice tab player
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [voiceProgress, setVoiceProgress] = useState(0);

  // Character kit modal
  const [isKitModalOpen, setIsKitModalOpen] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const kitModalRef = useRef<HTMLDivElement>(null);

  const currentClip: SampleClip =
    model.sampleClips.find((c) => c.style === selectedStyle) || model.sampleClips[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlayingVoice) {
      interval = setInterval(() => {
        setVoiceProgress((prev) => {
          if (prev >= 100) {
            setIsPlayingVoice(false);
            return 0;
          }
          return prev + 6;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isPlayingVoice]);

  const toggleVoice = () => {
    if (isPlayingVoice) {
      setIsPlayingVoice(false);
    } else {
      setVoiceProgress(0);
      setIsPlayingVoice(true);
    }
  };

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText(model.characterKit.promptBlock);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2500);
  };

  const handleDownloadKit = () => {
    const textContent = `TwinStudio Character Kit: ${model.name}\nRole: ${model.role}\nVoice: ${model.voiceLabel}\n\nPrompt Block:\n${model.characterKit.promptBlock}\n\nFiles:\n- ${model.characterKit.fileAssets.front}\n- ${model.characterKit.fileAssets.side}\n- ${model.characterKit.fileAssets.up}\n- ${model.characterKit.fileAssets.down}\n- ${model.characterKit.fileAssets.clipSelfie}\n- ${model.characterKit.fileAssets.clipTalkingHead}\n- ${model.characterKit.fileAssets.clipDemo}\n`;
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${model.slug}-character-kit.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-20 md:pb-8">
      {/* Back button */}
      <div>
        <button
          type="button"
          onClick={onBack}
          className="text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-main)] flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-full px-2 py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to creator models</span>
        </button>
      </div>

      {/* TOP SECTION: Media (4:5) + Name + Role + Primary "Use this model" + Secondary "Character kit" */}
      <div
        className="p-6 sm:p-8 rounded-[20px] border border-[var(--border-color)] shadow-sm grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center"
        style={{ backgroundColor: 'var(--surface-color)' }}
      >
        {/* Media Thumbnail/Portrait: 2D Frosted-Glass Silhouette */}
        <div className="md:col-span-4 max-w-[280px] mx-auto md:mx-0 w-full aspect-[3/4] rounded-[20px] overflow-hidden border border-[var(--border-color)] bg-[var(--surface-elevated)] p-1.5 shadow-md">
          <GlassFigure
            variant={model.hairVariant || 'bun'}
            tint={model.glassTint || 'violet'}
            angle={selectedAngle.toLowerCase() as any}
          />
        </div>

        {/* Identity & Actions */}
        <div className="md:col-span-8 space-y-5 text-center md:text-left">
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wider">
              {model.niche} · {model.age} years old
            </span>
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-semibold text-[var(--text-main)] tracking-tight">
              {model.name}
            </h1>
            <p className="text-sm font-medium text-[var(--text-secondary)]">
              {model.role}
            </p>
          </div>

          {/* Action Buttons: Primary "Use this model" + Secondary "Character kit" */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => onUseModel(model)}
              className="w-full sm:w-auto h-12 px-8 font-semibold text-xs rounded-[12px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
              style={{
                background: 'var(--scrollbar-thumb)',
                color: 'var(--accent-text)',
              }}
            >
              <Sparkles className="w-4 h-4" />
              <span>Use this model</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setIsKitModalOpen(true)}
              className="w-full sm:w-auto h-12 px-5 border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] text-[var(--text-main)] text-xs font-semibold rounded-[12px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
            >
              <Download className="w-4 h-4 text-[var(--text-muted)]" />
              <span>Character kit</span>
            </button>
          </div>
        </div>
      </div>

      {/* BELOW: 4 TABS (Overview, Looks, Videos, Voice) - One tab visible at a time! */}
      <div
        className="p-6 sm:p-8 rounded-[20px] border border-[var(--border-color)] shadow-sm space-y-6"
        style={{ backgroundColor: 'var(--surface-color)' }}
      >
        {/* Tab Navigation Pill Bar */}
        <div className="flex items-center gap-1.5 p-1 bg-[var(--surface-elevated)] rounded-full border border-[var(--border-color)] max-w-md">
          {[
            { id: 'overview', label: 'Overview', icon: FileText },
            { id: 'looks', label: 'Looks', icon: Camera },
            { id: 'videos', label: 'Videos', icon: Video },
            { id: 'voice', label: 'Voice', icon: Volume2 },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as TabId)}
                className={`flex-1 py-2 rounded-full text-xs font-medium transition-all duration-200 flex items-center justify-center gap-1.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ${
                  isActive
                    ? 'bg-[var(--surface-color)] text-[var(--text-main)] font-semibold shadow-xs border border-[var(--border-color)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* TAB 1: OVERVIEW (2-line bio + 3 trait chips + languages) */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Creator bio
              </h3>
              <p className="text-sm text-[var(--text-main)] leading-relaxed max-w-2xl">
                {model.bio}
              </p>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Personality traits
              </h3>
              <div className="flex flex-wrap gap-2">
                {model.personalityTraits.map((trait) => (
                  <span
                    key={trait}
                    className="px-3 py-1 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-full text-xs font-medium text-[var(--text-main)]"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)] mb-2">
                Languages spoken
              </h3>
              <div className="flex flex-wrap gap-2">
                {model.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-full text-xs font-medium text-[var(--text-secondary)]"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: LOOKS (Front / Side / Up / Down angles) */}
        {activeTab === 'looks' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-main)]">
                  Camera angles
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Preview how {model.name} appears from different studio camera heights.
                </p>
              </div>

              {/* Angle Selector Pills */}
              <div className="flex items-center gap-1.5 p-1 bg-[var(--surface-elevated)] rounded-full border border-[var(--border-color)] self-start sm:self-auto">
                {(['Front', 'Side', 'Up', 'Down'] as AngleView[]).map((ang) => (
                  <button
                    key={ang}
                    type="button"
                    onClick={() => setSelectedAngle(ang)}
                    className={`px-3.5 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedAngle === ang
                        ? 'bg-[var(--surface-color)] text-[var(--text-main)] font-semibold shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {ang}
                  </button>
                ))}
              </div>
            </div>

            {/* Main Angle Preview at larger size */}
            <div className="max-w-[340px] aspect-[3/4] mx-auto rounded-[20px] overflow-hidden border border-[var(--border-color)] bg-[var(--surface-elevated)] p-2 shadow-lg">
              <GlassFigure
                variant={model.hairVariant || 'bun'}
                tint={model.glassTint || 'violet'}
                angle={selectedAngle.toLowerCase() as any}
              />
            </div>

            {/* All 4 Angles Thumbnail Row */}
            <div className="grid grid-cols-4 gap-3 max-w-lg mx-auto pt-2">
              {(['Front', 'Side', 'Up', 'Down'] as AngleView[]).map((ang) => (
                <button
                  key={ang}
                  type="button"
                  onClick={() => setSelectedAngle(ang)}
                  className={`p-1.5 rounded-[16px] border text-left transition-all ${
                    selectedAngle === ang
                      ? 'border-[var(--border-focus)] bg-[var(--surface-elevated)] ring-2 ring-[var(--border-focus)]/30'
                      : 'border-[var(--border-color)] bg-[var(--surface-color)] hover:border-[var(--border-focus)]'
                  }`}
                >
                  <div className="aspect-[3/4] rounded-[10px] overflow-hidden bg-[var(--surface-elevated)] mb-1.5">
                    <GlassFigure
                      variant={model.hairVariant || 'bun'}
                      tint={model.glassTint || 'violet'}
                      angle={ang.toLowerCase() as any}
                    />
                  </div>
                  <p className="text-[10px] font-semibold text-center text-[var(--text-main)] truncate">
                    {ang}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: VIDEOS (Selfie / Talking head / Product demo) */}
        {activeTab === 'videos' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-[var(--text-main)]">
                  Sample video formats
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Select a video style to preview movement and speech cadence.
                </p>
              </div>

              {/* Style Tabs */}
              <div className="flex items-center gap-1.5 p-1 bg-[var(--surface-elevated)] rounded-full border border-[var(--border-color)] self-start sm:self-auto">
                {(['Selfie', 'Talking head', 'Product demo'] as VideoStyle[]).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => {
                      setSelectedStyle(st);
                      setIsPlayingClip(true);
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      selectedStyle === st
                        ? 'bg-[var(--surface-color)] text-[var(--text-main)] font-semibold shadow-xs'
                        : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Video Playback Preview Card */}
            <div className="p-4 rounded-[16px] bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingClip(!isPlayingClip)}
                  className="w-10 h-10 rounded-[12px] bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-[var(--accent-text)] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
                  aria-label={isPlayingClip ? 'Pause sample clip' : 'Play sample clip'}
                >
                  {isPlayingClip ? (
                    <Pause className="w-4 h-4 fill-current" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5 fill-current" />
                  )}
                </button>
                <div>
                  <p className="text-xs font-semibold text-[var(--text-main)]">
                    {currentClip.title}
                  </p>
                  <p className="text-[11px] text-[var(--text-secondary)]">
                    {selectedStyle} format · {currentClip.duration}
                  </p>
                </div>
              </div>

              <span className="text-[11px] text-[var(--status-success)] font-medium flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                Available in Studio
              </span>
            </div>
          </div>
        )}

        {/* TAB 4: VOICE (Voice player with waveform & accent info) */}
        {activeTab === 'voice' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div>
              <h3 className="text-sm font-semibold text-[var(--text-main)]">
                Voice model
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {model.voiceAccent}
              </p>
            </div>

            {/* Voice Control Bar */}
            <div className="flex items-center gap-4 bg-[var(--surface-elevated)] rounded-[12px] p-4 border border-[var(--border-color)]">
              <button
                type="button"
                onClick={toggleVoice}
                className="w-10 h-10 rounded-[12px] bg-gradient-to-r from-[var(--accent-from)] to-[var(--accent-to)] text-[var(--accent-text)] flex items-center justify-center shrink-0 active:scale-95 transition-transform"
                aria-label={isPlayingVoice ? 'Pause voice clip' : 'Listen to voice'}
              >
                {isPlayingVoice ? (
                  <Pause className="w-4 h-4 fill-current" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5 fill-current" />
                )}
              </button>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between text-xs text-[var(--text-secondary)]">
                  <span>{isPlayingVoice ? 'Playing voice sample…' : 'Tap to preview voice cadence'}</span>
                  <span>{model.characterKit.voiceDuration}</span>
                </div>

                {/* Animated Waveform Bars */}
                <div className="flex items-center gap-1 h-5 pt-1">
                  {[45, 70, 90, 35, 95, 60, 50, 85, 75, 55, 80, 65, 90, 40, 70, 60, 85, 45].map(
                    (height, idx) => (
                      <div
                        key={idx}
                        className={`w-1 rounded-full transition-all duration-150 ${
                          isPlayingVoice && (idx / 18) * 100 <= voiceProgress
                            ? 'bg-[var(--border-focus)]'
                            : 'bg-[var(--border-color)]'
                        }`}
                        style={{
                          height: isPlayingVoice
                            ? `${Math.max(25, Math.sin(voiceProgress + idx) * 100)}%`
                            : `${height}%`,
                        }}
                      />
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* MOBILE STICKY BOTTOM CTA BAR */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 border-t border-[var(--border-color)] shadow-2xl flex items-center gap-3 backdrop-blur-lg"
        style={{ backgroundColor: 'var(--surface-glass)' }}
      >
        <button
          type="button"
          onClick={() => onUseModel(model)}
          className="flex-1 h-11 font-semibold text-xs rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
          style={{
            background: 'var(--scrollbar-thumb)',
            color: 'var(--accent-text)',
          }}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Use {model.name.split(' ')[0]}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <button
          type="button"
          onClick={() => setIsKitModalOpen(true)}
          className="h-11 px-3.5 border border-[var(--border-color)] bg-[var(--surface-color)] text-[var(--text-main)] text-xs font-semibold rounded-[12px]"
        >
          <Download className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* CHARACTER KIT MODAL */}
      {isKitModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="kit-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        >
          <div
            ref={kitModalRef}
            className="relative w-full max-w-lg rounded-[20px] border border-[var(--border-color)] shadow-2xl p-6 space-y-5 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--surface-color)' }}
          >
            <ContainerOverlayScrollbar containerRef={kitModalRef} />
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-color)]">
              <div>
                <h3 id="kit-modal-title" className="text-base font-semibold text-[var(--text-main)]">
                  {model.name} Character Kit
                </h3>
                <p className="text-xs text-[var(--text-muted)]">Generation prompt block & assets</p>
              </div>
              <button
                type="button"
                onClick={() => setIsKitModalOpen(false)}
                aria-label="Close kit dialog"
                className="w-8 h-8 rounded-full bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Prompt Block */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[var(--text-main)]">
                  Prompt block
                </span>
                <button
                  type="button"
                  onClick={handleCopyPrompt}
                  className="text-xs text-[var(--border-focus)] hover:underline flex items-center gap-1"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPrompt ? 'Copied!' : 'Copy block'}</span>
                </button>
              </div>
              <div className="p-3 bg-[var(--surface-elevated)] rounded-[12px] border border-[var(--border-color)] text-xs text-[var(--text-secondary)] font-mono leading-relaxed select-all">
                {model.characterKit.promptBlock}
              </div>
            </div>

            {/* Download CTA */}
            <div className="pt-3 border-t border-[var(--border-color)] flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsKitModalOpen(false)}
                className="h-10 px-4 border border-[var(--border-color)] rounded-[12px] text-xs font-medium text-[var(--text-secondary)]"
              >
                Close
              </button>
              <button
                type="button"
                onClick={handleDownloadKit}
                className="h-10 px-5 font-semibold text-xs rounded-[12px] flex items-center gap-1.5 shadow-sm active:scale-95"
                style={{
                  background: 'var(--scrollbar-thumb)',
                  color: 'var(--accent-text)',
                }}
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download kit (.txt)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sticky Mobile CTA Bar */}
      <div
        className="md:hidden fixed bottom-0 left-0 right-0 p-3.5 border-t border-[var(--border-color)] z-40 flex items-center justify-between gap-3 shadow-2xl backdrop-blur-md"
        style={{ backgroundColor: 'var(--surface-glass)' }}
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[var(--text-main)] truncate">{model.name}</p>
          <p className="text-[10px] text-[var(--text-secondary)] truncate">{model.role}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsKitModalOpen(true)}
            className="h-10 px-3 border border-[var(--border-color)] bg-[var(--surface-color)] text-xs font-medium text-[var(--text-main)] rounded-[12px]"
          >
            Kit
          </button>
          <button
            type="button"
            onClick={() => onUseModel(model)}
            className="h-10 px-5 font-semibold text-xs rounded-[12px] flex items-center gap-1.5 shadow-sm active:scale-95"
            style={{
              background: 'var(--scrollbar-thumb)',
              color: 'var(--accent-text)',
            }}
          >
            <span>Use model</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
