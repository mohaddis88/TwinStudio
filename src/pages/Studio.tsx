import React, { useState, useEffect } from 'react';
import { Model, VideoStyle, GeneratedVideoResult, ThemeMode } from '../types';
import { Info } from 'lucide-react';
import { useCmsModels, CmsModel } from '../lib/cmsStore';
import { AvatarPlaceholder } from '../components/ui/AvatarPlaceholder';

interface StudioProps {
  models?: Model[];
  selectedModel?: any;
  onSelectModel?: (model: any) => void;
  onBrowseGallery?: () => void;
  onCreateTwin?: () => void;
  onToast?: (msg: string, type?: 'success' | 'warning' | 'error') => void;
  theme?: ThemeMode;
}

const SCRIPT_TEMPLATES = [
  {
    name: 'Problem & Hook',
    text: 'Stop scrolling if you spend four hours every Sunday on manual spreadsheets. This simple workspace tool automated 80% of our weekly reports in less than ten minutes.',
  },
  {
    name: 'Honest UGC Review',
    text: 'I was super skeptical about trying another morning serum, but after two weeks my skin barrier actually feels hydrated all day long. Link below for 20% off!',
  },
  {
    name: 'Flash Drop Promo',
    text: 'Quick reminder: our annual spring drop is live right now! Popular sizes sell out every single season, so grab your favorites before midnight tonight.',
  },
];

const FRAMING_TIPS: Record<string, string> = {
  Selfie: 'Casual handheld front-camera framing. Best for TikTok Shop & Reels.',
  'Talking head': 'Chest-up framed portrait with studio key lighting. Ideal for explainers.',
  'Product demo': 'Angled eye-level shot with gestures directing attention to features.',
};

export const Studio: React.FC<StudioProps> = ({
  selectedModel: initialModel,
  onSelectModel,
  onToast,
}) => {
  const [cmsModels] = useCmsModels();
  const availableModels = cmsModels.filter((m) => m.status === 'published');

  const [activeCreator, setActiveCreator] = useState<CmsModel>(() => {
    if (initialModel && initialModel.name) {
      const match = availableModels.find((c) => c.name.includes(initialModel.name));
      if (match) return match;
    }
    return availableModels[0] || ({} as CmsModel);
  });

  useEffect(() => {
    if (initialModel && initialModel.name) {
      const match = availableModels.find((c) => c.name.includes(initialModel.name));
      if (match) setActiveCreator(match);
    } else if (!activeCreator.id && availableModels.length > 0) {
      setActiveCreator(availableModels[0]);
    }
  }, [initialModel, availableModels]);

  const [language, setLanguage] = useState<'English' | 'Bahasa Malaysia' | 'Mandarin'>('English');
  const [framingStyle, setFramingStyle] = useState<VideoStyle>('Talking head');
  const [aspectRatio, setAspectRatio] = useState<'9:16' | '1:1' | '16:9' | '4:5'>('9:16');
  const [scriptText, setScriptText] = useState(
    'I was super skeptical about trying another morning serum, but after two weeks my skin barrier actually feels hydrated all day long. Link below for 20% off!'
  );

  // Video generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [generationProgress, setGenerationProgress] = useState(0);
  const [activeVideo, setActiveVideo] = useState<GeneratedVideoResult | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // History list from localStorage
  const [videoHistory, setVideoHistory] = useState<GeneratedVideoResult[]>(() => {
    try {
      const saved = localStorage.getItem('twinstudio_videos_history_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem('twinstudio_videos_history_v1', JSON.stringify(videoHistory));
    } catch {
      // ignore
    }
  }, [videoHistory]);

  const maxChars = 600;
  const charCount = scriptText.length;
  const wordCount = scriptText.split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.max(8, Math.round(wordCount / 2.6));

  const handleStartGeneration = () => {
    if (!scriptText.trim()) {
      onToast?.('Please enter an ad script first.', 'warning');
      return;
    }

    setIsGenerating(true);
    setGenerationProgress(5);
    setGenerationStep('Analyzing natural cadence & breath…');

    const steps = [
      { p: 25, label: 'Synthesizing voice tone & pauses…' },
      { p: 55, label: 'Generating authentic eye saccades & lip sync…' },
      { p: 85, label: 'Rendering vertical 9:16 MP4…' },
      { p: 100, label: 'Complete!' },
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        setGenerationProgress(steps[stepIndex].p);
        setGenerationStep(steps[stepIndex].label);
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsGenerating(false);

        const newVideo: GeneratedVideoResult = {
          id: `vid-${Date.now()}`,
          modelId: activeCreator.id,
          modelName: activeCreator.name,
          script: scriptText,
          caption: `${activeCreator.name}, ${language}, ${framingStyle} (${aspectRatio})`,
          style: framingStyle,
          videoUrl: '#sample-stream',
          durationSeconds: estimatedSeconds,
          createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          aspectRatio,
        };

        setActiveVideo(newVideo);
        setVideoHistory((prev) => [newVideo, ...prev]);
        setIsPlaying(true);
        onToast?.('UGC Video generated successfully!', 'success');
      }
    }, 850);
  };

  const handleDeleteHistoryItem = (id: string) => {
    setVideoHistory((prev) => prev.filter((v) => v.id !== id));
    if (activeVideo?.id === id) {
      setActiveVideo(null);
      setIsPlaying(false);
    }
    onToast?.('Video removed from history.', 'warning');
  };

  const handleDownload = (video: GeneratedVideoResult) => {
    const blob = new Blob([video.script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${video.modelName.toLowerCase()}_ad_take_${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onToast?.(`Downloaded ${video.modelName} ad video take.`, 'success');
  };

  return (
    <div className="page-shell overflow-hidden">
      <div className="relative z-10 max-w-[1200px] mx-auto space-y-12">
        {/* Workspace Editorial Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 border-b border-[var(--border)] pb-6">
          <div className="space-y-2">
            <div className="eyebrow mb-1">CREATOR STUDIO</div>
            <h1
              className="tracking-[-0.04em] leading-[0.98] font-medium text-[var(--text)] m-0"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(32px, 3.8vw, 56px)',
              }}
            >
              Script in, <span className="serif">human out.</span>
            </h1>
          </div>
          <div className="text-sm font-medium text-[var(--text-secondary)]">
            Est. turnaround: ~{estimatedSeconds}s video
          </div>
        </div>

        {/* Studio 2-Column Split Workspace with Production Liquid Glass */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr] gap-8 lg:gap-10 items-start">
          {/* ===================================================================
              LEFT COLUMN: Liquid Glass Control Panel
              =================================================================== */}
          <div
            className="studio-card p-6 sm:p-8 lg:p-9 space-y-7"
          >
            {/* 1. Flagship Model Selector */}
            <div className="space-y-3">
              <label className="block text-[16px] font-semibold tracking-tight text-[var(--text)]">
                Select Creator
              </label>
              <div className="grid grid-cols-2 gap-3.5">
                {availableModels.slice(0, 4).map((creator) => {
                  const isSelected = activeCreator.id === creator.id;
                  return (
                    <button
                      key={creator.id}
                      type="button"
                      onClick={() => {
                        setActiveCreator(creator);
                        onSelectModel?.(creator);
                      }}
                      className="p-3.5 rounded-[16px] border text-left flex items-center gap-3.5 cursor-pointer focus-visible:outline-none"
                      style={{
                        background: isSelected ? 'var(--text)' : 'var(--surface-2)',
                        color: isSelected ? 'var(--bg)' : 'var(--text)',
                        borderColor: isSelected ? 'var(--text)' : 'var(--border)',
                      }}
                    >
                      <div className="w-11 h-13 rounded-[8px] overflow-hidden shrink-0 border border-[var(--border-strong)]">
                        <AvatarPlaceholder aspectRatio="3/4" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm truncate">
                          {creator.name}
                        </div>
                        <div className="text-xs opacity-75 truncate">
                          {creator.discipline}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Language & Voice Tone Selector */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[16px] font-semibold tracking-tight text-[var(--text)]">
                  Voice Language
                </label>
                <span className="text-xs text-[var(--text-muted)]">
                  Synced cadence & breath
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {(['English', 'Bahasa Malaysia', 'Mandarin'] as const).map((lang) => {
                  const isSelected = language === lang;
                  return (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => setLanguage(lang)}
                      className="px-4 py-2 rounded-full border text-sm font-medium cursor-pointer focus-visible:outline-none"
                      style={{
                        background: isSelected ? 'var(--text)' : 'transparent',
                        color: isSelected ? 'var(--bg)' : 'var(--text)',
                        borderColor: isSelected ? 'var(--text)' : 'var(--border)',
                        fontWeight: isSelected ? 600 : 500,
                      }}
                    >
                      {lang}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 3. Camera Framing Style & Social Format */}
            <div className="space-y-4 pt-2">
              <div className="space-y-3">
                <label className="block text-[16px] font-semibold tracking-tight text-[var(--text)]">
                  Framing & Background
                </label>
                <div className="flex flex-wrap gap-2.5">
                  {(['Selfie', 'Talking head', 'Product demo'] as VideoStyle[]).map((style) => {
                    const isSelected = framingStyle === style;
                    return (
                      <div key={style} className="relative group">
                        <button
                          type="button"
                          onClick={() => setFramingStyle(style)}
                          className="px-4 py-2 rounded-full border text-sm font-medium cursor-pointer flex items-center gap-2 focus-visible:outline-none"
                          style={{
                            background: isSelected ? 'var(--text)' : 'transparent',
                            color: isSelected ? 'var(--bg)' : 'var(--text)',
                            borderColor: isSelected ? 'var(--text)' : 'var(--border)',
                            fontWeight: isSelected ? 600 : 500,
                          }}
                        >
                          <span>{style}</span>
                          <Info className="w-3.5 h-3.5 opacity-70" />
                        </button>
                        <div className="hidden group-hover:block absolute left-0 bottom-full mb-2 w-60 p-2.5 rounded-[8px] bg-[var(--text)] text-[var(--bg)] text-xs leading-normal shadow-xl z-20 pointer-events-none">
                          {FRAMING_TIPS[style]}
                        </div>
                      </div>
                    );
                  })}
                  {/* Custom Background Upload Pill */}
                  <button
                    type="button"
                    className="px-4 py-2 rounded-full border text-sm font-medium cursor-pointer transition-all flex items-center gap-2 focus-visible:outline-none hover:bg-[var(--surface-2)]"
                    style={{
                      background: 'color-mix(in srgb, var(--surface-2) 40%, transparent)',
                      color: 'var(--text)',
                      borderColor: 'var(--border-strong)',
                    }}
                  >
                    <span>+ Upload Background</span>
                  </button>
                </div>
              </div>

              {/* Social Format selector moved from preview frame */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-[14px] font-semibold text-[var(--text-secondary)]">
                    Aspect Ratio
                  </label>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: '9:16', label: '9:16', sub: 'TikTok · Reels' },
                    { id: '1:1', label: '1:1', sub: 'Square' },
                    { id: '4:5', label: '4:5', sub: 'Portrait' },
                    { id: '16:9', label: '16:9', sub: 'YouTube' },
                  ].map((fmt) => {
                    const isActive = aspectRatio === fmt.id;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setAspectRatio(fmt.id as any)}
                        className="px-3.5 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition-all flex items-center gap-1.5"
                        style={{
                          background: isActive
                            ? 'var(--text)'
                            : 'color-mix(in srgb, var(--surface-2) 60%, transparent)',
                          color: isActive ? 'var(--bg)' : 'var(--text)',
                          borderColor: isActive ? 'var(--text)' : 'var(--border-strong)',
                        }}
                        title={fmt.sub}
                      >
                        <span>{fmt.label}</span>
                        <span className="opacity-60 font-normal ml-0.5 hidden sm:inline">{fmt.sub}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* 4. Script Textarea with Recessed Frosted Depth */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[16px] font-semibold tracking-tight text-[var(--text)]">
                  Marketing Script
                </label>
                <div className="text-xs text-[var(--text-muted)]">
                  {charCount}/{maxChars} chars (~{estimatedSeconds}s)
                </div>
              </div>

              {/* Template quick fill pills */}
              <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-secondary)]">
                <span className="text-[12px] font-semibold uppercase tracking-wider">Templates:</span>
                {SCRIPT_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.name}
                    type="button"
                    onClick={() => setScriptText(tpl.text)}
                    className="text-xs underline underline-offset-4 hover:text-[var(--text)] cursor-pointer py-0.5 font-medium"
                  >
                    {tpl.name}
                  </button>
                ))}
              </div>

              <textarea
                value={scriptText}
                onChange={(e) => setScriptText(e.target.value.slice(0, maxChars))}
                rows={5}
                placeholder="Type your ad hook, UGC product review, or explainer script here…"
                className="w-full p-4 rounded-[16px] text-[16px] leading-[1.6] focus-visible:outline-none resize-none transition-all"
                style={{
                  background: 'color-mix(in srgb, var(--surface-2) 80%, transparent)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  color: 'var(--text)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: 'inset 0 2px 6px 0 rgba(0, 0, 0, 0.08), 0 1px 0 0 rgba(255, 255, 255, 0.06)',
                }}
              />
            </div>

            {/* Generate Action Button with Tactile Top Highlight & Elevation */}
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleStartGeneration}
              className="btn group w-full h-[52px] rounded-full inline-flex items-center justify-center gap-2 font-medium text-base disabled:opacity-50 cursor-pointer"
              style={{
                background: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
              }}
            >
              {isGenerating ? (
                <>
                  <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  <span>{generationStep} ({generationProgress}%)</span>
                </>
              ) : (
                <span>Generate Video Ad</span>
              )}
            </button>
          </div>

          {/* ===================================================================
              RIGHT COLUMN: Standard Social Media Frame Preview
              =================================================================== */}
          <div
            className="studio-card p-6 sm:p-8 flex flex-col items-center justify-center w-full"
          >
            <div
              className="relative w-full rounded-[18px] overflow-hidden flex flex-col justify-between p-4 transition-all duration-300"
              style={{
                aspectRatio: aspectRatio === '9:16' ? '9/16' : aspectRatio === '1:1' ? '1/1' : aspectRatio === '4:5' ? '4/5' : '16/9',
                maxWidth: aspectRatio === '9:16' ? '300px' : aspectRatio === '1:1' ? '360px' : aspectRatio === '4:5' ? '330px' : '460px',
                maxHeight: '520px',
                background: 'linear-gradient(180deg, var(--surface-2) 0%, color-mix(in srgb, var(--surface-2) 88%, black) 100%)',
                border: '1px solid var(--border-strong)',
                boxShadow: '0 20px 48px -12px rgba(0, 0, 0, 0.38), inset 0 1px 0 0 rgba(255, 255, 255, 0.12)',
              }}
            >
              {/* Top Video Status & AI Badge */}
              <div className="flex items-center justify-between text-xs z-10">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-mono tracking-wider"
                  style={{
                    background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
                    backdropFilter: 'blur(10px)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                  }}
                >
                  {aspectRatio} {aspectRatio === '9:16' ? 'Reels / TikTok' : aspectRatio === '1:1' ? 'Square Feed' : aspectRatio === '4:5' ? 'Portrait' : 'YouTube'}
                </span>
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px]"
                  style={{
                    background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
                    backdropFilter: 'blur(10px)',
                    color: 'var(--text)',
                    border: '1px solid var(--border)',
                  }}
                >
                  AI-generated
                </span>
              </div>

              {/* Center Content / Video Stream or Avatar Preview */}
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                {isGenerating ? (
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-full border-2 border-[var(--text)] border-t-transparent animate-spin mx-auto" />
                    <div className="text-sm font-medium text-[var(--text-secondary)]">
                      {generationStep}
                    </div>
                  </div>
                ) : activeVideo ? (
                  <div className="space-y-3 z-10">
                    <div className="w-14 h-14 rounded-full bg-[var(--text)] text-[var(--bg)] flex items-center justify-center mx-auto shadow-md">
                      {isPlaying ? (
                        <span className="text-sm font-mono font-bold">||</span>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                          <polygon points="5 3 19 12 5 21 5 3" />
                        </svg>
                      )}
                    </div>
                    <div className="text-sm font-semibold text-[var(--text)]">
                      {activeVideo.modelName} ({activeVideo.style})
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="px-4 py-1.5 rounded-full bg-[var(--text)] text-[var(--bg)] text-xs font-medium cursor-pointer"
                    >
                      {isPlaying ? 'Pause Take' : 'Play Take'}
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-2 opacity-65">
                    <AvatarPlaceholder aspectRatio="3/4" />
                    <div className="text-xs font-medium text-[var(--text-muted)] mt-2">
                      Ready to generate with {activeCreator.name}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* =====================================================================
            "YOUR CREATED VIDEOS" LIVE HISTORY SECTION (Liquid Glass Cards)
            ===================================================================== */}
        {videoHistory.length > 0 && (
          <div className="pt-10 border-t border-[var(--border)] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2
                  className="text-2xl font-semibold tracking-tight text-[var(--text)] m-0"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  Your created videos
                </h2>
                <p className="text-sm text-[var(--text-secondary)] m-0 mt-1">
                  Recent video takes saved to your workspace
                </p>
              </div>
              <span className="text-xs text-[var(--text-muted)] font-mono">
                {videoHistory.length} {videoHistory.length === 1 ? 'take' : 'takes'}
              </span>
            </div>

            {/* Video Cards Grid with Glassmorphic Shading */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videoHistory.map((item) => (
                <div
                  key={item.id}
                  className="studio-card p-5 space-y-3.5"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-16 rounded-[8px] overflow-hidden shrink-0"
                      style={{
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border-strong)',
                      }}
                    >
                      <AvatarPlaceholder aspectRatio="3/4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-sm text-[var(--text)] truncate">
                          {item.modelName}
                        </span>
                        <span className="text-xs text-[var(--text-muted)] font-mono">
                          {item.createdAt}
                        </span>
                      </div>
                      <div className="text-xs text-[var(--text-secondary)] truncate">
                        {item.style}, ~{item.durationSeconds}s
                      </div>
                      <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[11px] text-[var(--text-secondary)] font-medium">
                        AI-generated
                      </span>
                    </div>
                  </div>

                  <p
                    className="text-xs m-0 line-clamp-2 leading-relaxed p-2.5 rounded-[10px]"
                    style={{
                      background: 'color-mix(in srgb, var(--surface-2) 70%, transparent)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--text)',
                      border: '1px solid var(--border)',
                    }}
                  >
                    &ldquo;{item.script}&rdquo;
                  </p>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        setActiveVideo(item);
                        setIsPlaying(true);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-full text-xs font-semibold cursor-pointer transition-all inline-flex items-center justify-center gap-1"
                      style={{
                        background: 'linear-gradient(180deg, var(--text) 0%, color-mix(in srgb, var(--text) 88%, black) 100%)',
                        color: 'var(--bg)',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                      }}
                    >
                      <span>Play</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDownload(item)}
                      title="Download MP4"
                      className="py-1.5 px-3 rounded-full border border-[var(--border-strong)] text-xs text-[var(--text)] font-medium cursor-pointer transition-colors hover:bg-[var(--surface-2)]"
                    >
                      Download MP4
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDeleteHistoryItem(item.id)}
                      title="Delete video"
                      className="py-1.5 px-2.5 rounded-full text-xs text-[var(--text-muted)] hover:text-[var(--status-error)] cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
