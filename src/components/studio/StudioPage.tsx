import React, { useState } from 'react';
import { Model, VideoStyle, GeneratedVideoResult } from '../../types';
import { Tooltip } from '../common/Tooltip';
import { MediaPlaceholder } from '../common/MediaPlaceholder';
import { sanitizeText } from '../../utils/validation';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Download,
  Copy,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Check,
  AlertCircle,
  Wand2,
} from 'lucide-react';

interface StudioPageProps {
  models: Model[];
  selectedModel: Model;
  onSelectModel: (model: Model) => void;
  onBrowseGallery: () => void;
  onCreateTwin: () => void;
  onToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

const SCRIPT_TEMPLATES = [
  {
    name: 'Problem & Hook',
    text: "Stop scrolling if you spend four hours every Sunday on manual spreadsheets. This simple workspace tool automated 80% of our weekly reports in less than ten minutes.",
  },
  {
    name: 'Honest Review',
    text: "I was super skeptical about trying another morning serum, but after two weeks my skin barrier actually feels hydrated all day long. Link below for twenty percent off!",
  },
  {
    name: 'Flash Drop Promo',
    text: "Quick reminder: our annual spring drop is live right now! Popular sizes sell out every single season, so grab your favorites before midnight tonight.",
  },
];

export const StudioPage: React.FC<StudioPageProps> = ({
  models,
  selectedModel,
  onSelectModel,
  onBrowseGallery,
  onCreateTwin,
  onToast,
}) => {
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(2);
  const [scriptText, setScriptText] = useState(
    "Stop scrolling if you spend four hours every Sunday on manual spreadsheets. This simple workspace tool automated 80% of our weekly reports in less than ten minutes."
  );
  const [videoStyle, setVideoStyle] = useState<VideoStyle>('Talking head');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStatus, setProgressStatus] = useState('Preparing voice…');
  const [progressPercent, setProgressPercent] = useState(0);
  const [generatedResult, setGeneratedResult] = useState<GeneratedVideoResult | null>(null);
  const [simulatedError, setSimulatedError] = useState<string | null>(null);
  const [isPlayingGenerated, setIsPlayingGenerated] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [showHelperMenu, setShowHelperMenu] = useState(false);

  const MAX_CHARS = 500;
  const sanitized = sanitizeText(scriptText);
  const charCount = sanitized.length;
  const wordCount = sanitized.split(/\s+/).filter(Boolean).length;
  const estimatedSeconds = Math.max(10, Math.round(wordCount / 2.5));

  const handleStartGeneration = async (forceFail = false) => {
    if (!sanitized.trim()) {
      setSimulatedError('Please enter a script before creating your video.');
      return;
    }

    setIsGenerating(true);
    setSimulatedError(null);
    setProgressPercent(15);
    setProgressStatus('Preparing voice model and cadence…');

    const steps = [
      { text: 'Preparing voice model and cadence…', percent: 25, delay: 600 },
      { text: 'Aligning realistic expressions and lip sync…', percent: 55, delay: 800 },
      { text: 'Rendering camera movement and soft lighting…', percent: 80, delay: 700 },
      { text: 'Polishing 1080p MP4 preview…', percent: 100, delay: 500 },
    ];

    try {
      for (let i = 0; i < steps.length; i++) {
        if (forceFail && i === 2) {
          throw new Error('Something went wrong creating your video. Your script is saved.');
        }
        await new Promise((r) => setTimeout(r, steps[i].delay));
        setProgressStatus(steps[i].text);
        setProgressPercent(steps[i].percent);
      }

      setGeneratedResult({
        id: `vid-${Date.now()}`,
        modelId: selectedModel.id,
        modelName: selectedModel.name,
        script: sanitized,
        caption: `${sanitized.slice(0, 95)}… #TwinStudio #UGCAd`,
        style: videoStyle,
        videoUrl: '',
        durationSeconds: estimatedSeconds,
        createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        aspectRatio: videoStyle === 'Talking head' ? '16:9' : '9:16',
      });
      setIsGenerating(false);
      setCurrentStep(3);
    } catch (err: any) {
      setIsGenerating(false);
      setSimulatedError(err.message || 'Something went wrong creating your video. Your script is saved.');
    }
  };

  const handleDownload = () => {
    const textData = `TwinStudio AI Video File\nCreator: ${selectedModel.name}\nFormat: ${videoStyle}\nDuration: ~${estimatedSeconds}s\n\nScript:\n${sanitized}`;
    const blob = new Blob([textData], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `twinstudio-${selectedModel.slug}-${videoStyle.toLowerCase().replace(/\s+/g, '-')}.mp4`;
    a.click();
    URL.revokeObjectURL(url);
    onToast('Video download started.');
  };

  const handleCopyCaption = () => {
    if (!generatedResult) return;
    navigator.clipboard.writeText(generatedResult.caption);
    onToast('Ad caption copied to clipboard!');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* 3-Step Stepper Bar */}
      <div
        className="p-4 sm:p-5 rounded-[20px] border border-[var(--border-color)] shadow-sm"
        style={{ backgroundColor: 'var(--surface-color)' }}
      >
        <div className="flex items-center justify-between">
          {/* Step 1 */}
          <button
            type="button"
            onClick={() => setCurrentStep(1)}
            disabled={isGenerating}
            className={`flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-full p-1 transition-opacity ${
              currentStep === 1 ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{
                background: currentStep >= 1 ? 'var(--scrollbar-thumb)' : 'var(--surface-elevated)',
                color: currentStep >= 1 ? 'var(--accent-text)' : 'var(--text-muted)',
              }}
            >
              {currentStep > 1 ? <Check className="w-4 h-4" /> : '1'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-[var(--text-main)]">Step 1</p>
              <p className="text-[11px] text-[var(--text-muted)]">Pick model</p>
            </div>
          </button>

          <div className="flex-1 h-0.5 bg-[var(--border-color)] mx-3 sm:mx-4" />

          {/* Step 2 */}
          <button
            type="button"
            onClick={() => setCurrentStep(2)}
            disabled={isGenerating}
            className={`flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-full p-1 transition-opacity ${
              currentStep === 2 ? 'opacity-100' : 'opacity-70 hover:opacity-100'
            }`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{
                background: currentStep >= 2 ? 'var(--scrollbar-thumb)' : 'var(--surface-elevated)',
                color: currentStep >= 2 ? 'var(--accent-text)' : 'var(--text-muted)',
              }}
            >
              {currentStep > 2 ? <Check className="w-4 h-4" /> : '2'}
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-[var(--text-main)]">Step 2</p>
              <p className="text-[11px] text-[var(--text-muted)]">Write script</p>
            </div>
          </button>

          <div className="flex-1 h-0.5 bg-[var(--border-color)] mx-3 sm:mx-4" />

          {/* Step 3 */}
          <button
            type="button"
            onClick={() => generatedResult && setCurrentStep(3)}
            disabled={!generatedResult || isGenerating}
            className={`flex items-center gap-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-full p-1 transition-opacity ${
              currentStep === 3 ? 'opacity-100' : 'opacity-70'
            }`}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold"
              style={{
                background: currentStep === 3 ? 'var(--scrollbar-thumb)' : 'var(--surface-elevated)',
                color: currentStep === 3 ? 'var(--accent-text)' : 'var(--text-muted)',
              }}
            >
              3
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-semibold text-[var(--text-main)]">Step 3</p>
              <p className="text-[11px] text-[var(--text-muted)]">Preview & download</p>
            </div>
          </button>
        </div>
      </div>

      {/* Error Alert */}
      {simulatedError && (
        <div
          className="p-4 rounded-[20px] border border-[var(--status-error)] flex items-start gap-3 shadow-lg"
          style={{ backgroundColor: 'var(--surface-color)' }}
        >
          <AlertCircle className="w-5 h-5 text-[var(--status-error)] shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <h4 className="font-semibold text-[var(--status-error)]">Notice</h4>
            <p className="text-[var(--text-main)] mt-0.5">{simulatedError}</p>
          </div>
          <button
            type="button"
            onClick={() => handleStartGeneration(false)}
            className="text-xs font-semibold text-[var(--text-main)] underline hover:text-[var(--border-focus)] shrink-0"
          >
            [Try again]
          </button>
        </div>
      )}

      {/* STEP 1: PICK MODEL */}
      {currentStep === 1 && (
        <div
          className="p-6 sm:p-8 rounded-[20px] border border-[var(--border-color)] space-y-6 shadow-sm"
          style={{ backgroundColor: 'var(--surface-color)' }}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-sans text-xl sm:text-2xl font-semibold text-[var(--text-main)]">
                Select creator model
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Choose who speaks your marketing script.
              </p>
            </div>

            <button
              type="button"
              onClick={onCreateTwin}
              className="text-xs font-semibold text-[var(--border-focus)] hover:underline"
            >
              Or create your twin →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {models.map((m) => {
              const isSelected = selectedModel.id === m.id;
              return (
                <div
                  key={m.id}
                  onClick={() => {
                    onSelectModel(m);
                    setCurrentStep(2);
                  }}
                  className={`p-3.5 rounded-[20px] border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'bg-[var(--surface-elevated)] border-[var(--border-focus)] shadow-md'
                      : 'bg-[var(--surface-color)] border-[var(--border-color)] hover:border-[var(--border-focus)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[var(--border-color)]">
                      <MediaPlaceholder model={m} aspectRatio="1:1" showAiBadge={false} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-semibold text-[var(--text-main)] truncate">{m.name}</h4>
                      <p className="text-[10px] text-[var(--text-secondary)] truncate">{m.role}</p>
                      <p className="text-[10px] text-[var(--status-success)] mt-0.5">
                        {m.isCustomTwin ? 'Your twin' : 'Library model'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-2 border-t border-[var(--border-color)]/30 flex items-center justify-between text-[11px]">
                    <span className="text-[var(--text-muted)]">{m.languages[0]}</span>
                    <span className={isSelected ? 'text-[var(--text-main)] font-semibold' : 'text-[var(--border-focus)]'}>
                      {isSelected ? '✓ Selected' : 'Choose'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* STEP 2: WRITE SCRIPT & STYLE */}
      {currentStep === 2 && !isGenerating && (
        <div className="space-y-6">
          {/* Active Model Bar */}
          <div
            className="p-4 sm:p-5 rounded-[20px] border border-[var(--border-color)] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm"
            style={{ backgroundColor: 'var(--surface-color)' }}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 border border-[var(--border-color)]">
                <MediaPlaceholder model={selectedModel} aspectRatio="1:1" showAiBadge={false} />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-[var(--text-main)]">{selectedModel.name}</h3>
                  <span className="text-[11px] text-[var(--text-muted)]">· {selectedModel.role}</span>
                </div>
                <p className="text-xs text-[var(--text-secondary)]">{selectedModel.voiceLabel}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className="h-9 px-3 border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] text-xs font-medium text-[var(--text-secondary)] rounded-[12px] transition-colors self-start sm:self-auto"
            >
              Switch creator
            </button>
          </div>

          {/* Script Box Card */}
          <div
            className="p-6 sm:p-8 rounded-[20px] border border-[var(--border-color)] space-y-6 shadow-sm"
            style={{ backgroundColor: 'var(--surface-color)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-sans text-xl sm:text-2xl font-semibold text-[var(--text-main)]">
                  Write your video script
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-0.5">
                  Natural conversation works best.
                </p>
              </div>

              {/* "Help me write it" (Mock AI helper) */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowHelperMenu(!showHelperMenu)}
                  className="h-9 px-3.5 bg-[var(--surface-elevated)] hover:opacity-90 border border-[var(--border-color)] rounded-[12px] text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                >
                  <Wand2 className="w-3.5 h-3.5 text-[var(--border-focus)]" />
                  <span>Help me write it</span>
                </button>

                {showHelperMenu && (
                  <div
                    className="absolute right-0 top-11 z-20 w-64 rounded-[12px] p-2 shadow-2xl space-y-1 border border-[var(--border-color)]"
                    style={{ backgroundColor: 'var(--surface-color)' }}
                  >
                    <p className="text-[10px] font-semibold text-[var(--text-muted)] px-2 py-1 uppercase tracking-wider">
                      Select script angle
                    </p>
                    {SCRIPT_TEMPLATES.map((tmpl) => (
                      <button
                        key={tmpl.name}
                        type="button"
                        onClick={() => {
                          setScriptText(tmpl.text);
                          setShowHelperMenu(false);
                          onToast(`Loaded ${tmpl.name} template.`);
                        }}
                        className="w-full text-left p-2 rounded-[12px] hover:bg-[var(--surface-elevated)] text-xs text-[var(--text-secondary)] hover:text-[var(--text-main)] transition-colors"
                      >
                        <p className="font-semibold text-xs text-[var(--text-main)]">{tmpl.name}</p>
                        <p className="text-[10px] text-[var(--text-muted)] truncate">{tmpl.text}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Script Text Area */}
            <div>
              <textarea
                value={scriptText}
                onChange={(e) => {
                  if (e.target.value.length <= MAX_CHARS) {
                    setScriptText(e.target.value);
                  }
                }}
                rows={5}
                placeholder="Paste your video ad script here…"
                className="w-full p-4 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] leading-relaxed resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] transition-all"
              />

              <div className="mt-2 flex items-center justify-between text-xs text-[var(--text-muted)]">
                <span>
                  Estimated duration: <strong>~{estimatedSeconds}s</strong> ({wordCount} words)
                </span>
                <span className={charCount >= MAX_CHARS ? 'text-[var(--status-error)] font-semibold' : ''}>
                  {charCount} / {MAX_CHARS} chars
                </span>
              </div>
            </div>

            {/* Camera Format Style */}
            <div className="pt-4 border-t border-[var(--border-color)]/30 space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-xs font-semibold text-[var(--text-main)]">
                  Camera format & style
                </label>
                <Tooltip
                  content="Selfie format mimics a hand-held phone camera for raw authenticity. Talking head delivers balanced studio framing. Product demo includes hand gesture focus."
                  label="Learn more about video styles"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(['Selfie', 'Talking head', 'Product demo'] as VideoStyle[]).map((style) => {
                  const isSelected = videoStyle === style;
                  return (
                    <button
                      key={style}
                      type="button"
                      onClick={() => setVideoStyle(style)}
                      className={`p-3.5 rounded-[20px] border text-left transition-all duration-200 flex flex-col justify-between focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ${
                        isSelected
                          ? 'bg-[var(--surface-elevated)] border-[var(--border-focus)] shadow-sm'
                          : 'bg-[var(--surface-color)] border-[var(--border-color)] hover:border-[var(--border-focus)]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-semibold text-[var(--text-main)]">{style}</h4>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[var(--border-focus)]" />}
                        </div>
                        <p className="text-[11px] text-[var(--text-secondary)] leading-snug">
                          {style === 'Selfie'
                            ? 'Handheld vertical phone angle for TikTok.'
                            : style === 'Talking head'
                            ? 'Steady framed portrait with clean acoustics.'
                            : 'Gestures holding or presenting your item.'}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Actions: Primary CTA */}
            <div className="pt-6 border-t border-[var(--border-color)]/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentStep(1)}
                className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back to creator selection</span>
              </button>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => handleStartGeneration(true)}
                  title="Simulate error state to test recovery"
                  className="text-[11px] text-[var(--text-muted)] hover:text-[var(--status-error)] underline px-2 py-1"
                >
                  Test error recovery
                </button>

                <button
                  type="button"
                  onClick={() => handleStartGeneration(false)}
                  disabled={!sanitized.trim()}
                  className="w-full sm:w-auto h-12 px-8 font-semibold text-xs rounded-[12px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                  style={{
                    background: 'var(--scrollbar-thumb)',
                    color: 'var(--accent-text)',
                  }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Generate video (~30s)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GENERATING PROGRESS STATE */}
      {isGenerating && (
        <div
          className="p-8 sm:p-14 text-center space-y-6 rounded-[20px] border border-[var(--border-color)] shadow-xl"
          style={{ backgroundColor: 'var(--surface-color)' }}
        >
          <div className="w-16 h-16 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center mx-auto text-[var(--border-focus)] animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="font-sans text-2xl font-semibold text-[var(--text-main)]">
              Creating your video
            </h3>
            <p className="text-sm font-medium text-[var(--text-secondary)]">{progressStatus}</p>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <div className="w-full h-3 bg-[var(--surface-elevated)] rounded-full overflow-hidden border border-[var(--border-color)]">
              <div
                className="h-full transition-all duration-500 ease-out rounded-full"
                style={{
                  width: `${progressPercent}%`,
                  background: 'var(--scrollbar-thumb)',
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
              <span>Plain language progress</span>
              <span>{progressPercent}%</span>
            </div>
          </div>
        </div>
      )}

      {/* STEP 3: RESULT PREVIEW & DOWNLOAD */}
      {currentStep === 3 && generatedResult && !isGenerating && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div
            className="p-6 sm:p-8 rounded-[20px] border border-[var(--border-color)] space-y-6 shadow-sm"
            style={{ backgroundColor: 'var(--surface-color)' }}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border-color)]/30">
              <div>
                <span className="text-[11px] font-medium text-[var(--status-success)] flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Video generated successfully
                </span>
                <h2 className="font-sans text-2xl font-semibold text-[var(--text-main)] mt-0.5">
                  Ready to post
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="h-10 px-4 border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] text-xs font-semibold text-[var(--text-secondary)] rounded-[12px] transition-colors"
                >
                  Edit script
                </button>
                <button
                  type="button"
                  onClick={() => handleStartGeneration(false)}
                  className="h-10 px-4 border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] text-xs font-semibold text-[var(--text-secondary)] rounded-[12px] flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            {/* Video Preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
              <div className="md:col-span-5 space-y-3">
                <div className="relative rounded-[20px] overflow-hidden bg-black border border-[var(--border-color)] shadow-xl aspect-[9/16] group">
                  <MediaPlaceholder
                    model={selectedModel}
                    aspectRatio="4:5"
                    isHovered={isPlayingGenerated}
                    showReplaceButton={false}
                    showAiBadge={false}
                    sampleVideoTitle={selectedModel.name}
                  />

                  {/* Player Overlay Controls */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4 bg-gradient-to-t from-black/85 via-transparent to-black/30 pointer-events-auto">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-black/70 rounded-full text-[10px] font-medium text-white">
                        {videoStyle} Format
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsMuted(!isMuted)}
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                        className="w-8 h-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/90"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsPlayingGenerated(!isPlayingGenerated)}
                      className="m-auto w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform hover:scale-105 active:scale-95"
                      style={{
                        background: 'var(--scrollbar-thumb)',
                        color: 'var(--accent-text)',
                      }}
                      aria-label={isPlayingGenerated ? 'Pause video' : 'Play video'}
                    >
                      {isPlayingGenerated ? (
                        <Pause className="w-6 h-6 fill-current" />
                      ) : (
                        <Play className="w-6 h-6 ml-1 fill-current" />
                      )}
                    </button>

                    <div className="space-y-1.5">
                      <div className="w-full h-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-300"
                          style={{ width: isPlayingGenerated ? '65%' : '0%' }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] text-white/90 font-medium">
                        <span>{isPlayingGenerated ? '0:18' : '0:00'}</span>
                        <span>0:{estimatedSeconds < 10 ? `0${estimatedSeconds}` : estimatedSeconds}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Video Meta & Actions */}
              <div className="md:col-span-7 space-y-6">
                <div className="bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[20px] p-5 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
                    Spoken script
                  </h3>
                  <p className="text-xs sm:text-sm text-[var(--text-main)] leading-relaxed italic">
                    &ldquo;{generatedResult.script}&rdquo;
                  </p>
                  <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
                    <span>Creator: <strong>{selectedModel.name}</strong></span>
                    <span>Style: <strong>{generatedResult.style}</strong></span>
                    <span>Generated: <strong>{generatedResult.createdAt}</strong></span>
                  </div>
                </div>

                {/* Caption Bar */}
                <div className="bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[20px] p-4 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[11px] font-semibold text-[var(--text-muted)]">Recommended ad caption:</p>
                    <p className="text-xs text-[var(--text-main)] truncate mt-0.5">{generatedResult.caption}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleCopyCaption}
                    className="h-9 px-3 bg-[var(--surface-color)] hover:opacity-90 border border-[var(--border-color)] rounded-[12px] text-xs font-semibold text-[var(--text-main)] flex items-center gap-1.5 shrink-0 transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy caption</span>
                  </button>
                </div>

                {/* Primary Button: Download MP4 */}
                <div className="pt-4 border-t border-[var(--border-color)]/30">
                  <button
                    type="button"
                    onClick={handleDownload}
                    className="w-full h-12 font-semibold text-xs rounded-[12px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                    style={{
                      background: 'var(--scrollbar-thumb)',
                      color: 'var(--accent-text)',
                    }}
                  >
                    <Download className="w-4 h-4" />
                    <span>Download MP4</span>
                  </button>
                  <p className="text-xs text-[var(--text-muted)] text-center mt-2">
                    Ready to upload directly to Meta Ads, TikTok, or Shorts.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
