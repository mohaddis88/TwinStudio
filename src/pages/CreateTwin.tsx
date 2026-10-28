import React, { useState } from 'react';
import { Model, PageId, ThemeMode } from '../types';
import { AvatarPlaceholder } from '../components/ui/AvatarPlaceholder';

interface CreateTwinProps {
  onTwinCreated?: (model: Model) => void;
  onBrowseGallery?: () => void;
  onNavigate?: (page: PageId) => void;
  onToast?: (msg: string, type?: 'success' | 'warning' | 'error') => void;
  theme?: ThemeMode;
}

export const CreateTwin: React.FC<CreateTwinProps> = ({
  onNavigate,
  onToast,
}) => {
  const [activeStep, setActiveStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [twinName, setTwinName] = useState('Alex Rivera (Private Twin)');
  const [brandChannel, setBrandChannel] = useState('My Brand Marketing');
  const [hasConsented, setHasConsented] = useState(false);
  const [livenessConfirmed, setLivenessConfirmed] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { num: '01', label: 'Photos & Voice' },
    { num: '02', label: 'Consent' },
    { num: '03', label: 'Liveness' },
    { num: '04', label: 'Status' },
  ];

  const handleNext = () => {
    if (activeStep === 1) {
      if (!twinName.trim()) {
        onToast?.('Please name your twin first.', 'warning');
        return;
      }
      setActiveStep(2);
    } else if (activeStep === 2) {
      if (!hasConsented) {
        onToast?.('Please check the consent box to continue.', 'warning');
        return;
      }
      setActiveStep(3);
    } else if (activeStep === 3) {
      setIsProcessing(true);
      setTimeout(() => {
        setIsProcessing(false);
        setLivenessConfirmed(true);
        setActiveStep(4);
        onToast?.('Your private twin is ready to use!', 'success');
      }, 1200);
    }
  };

  return (
    <div className="page-shell overflow-hidden">
      <div className="relative z-10 max-w-[840px] mx-auto space-y-10">
        {/* Editorial Header */}
        <div className="space-y-3 text-center sm:text-left">
          <div className="eyebrow">CUSTOM CREATOR TWIN</div>
          <h1
            className="tracking-[-0.04em] leading-[0.98] font-medium text-[var(--text)] m-0"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(32px, 4vw, 56px)',
            }}
          >
            Your presence, <span className="serif">on your terms.</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-[16px] leading-[1.6] max-w-xl m-0">
            Create your own private AI creator twin using simple phone photos and a short voice recording. Safe, verified, and only accessible by you.
          </p>
        </div>

        {/* Stepper Progress Pill Bar in Frosted Liquid Glass */}
        <div className="flex justify-center sm:justify-start">
          <div
            className="inline-flex flex-wrap items-center gap-2 sm:gap-4 p-1.5 px-4 rounded-full border"
            style={{
              background: 'var(--surface)',
              borderColor: 'var(--border)',
            }}
          >
            {steps.map((s, idx) => {
              const stepNum = idx + 1;
              const isCurrent = activeStep === stepNum;
              const isDone = activeStep > stepNum;
              return (
                <div
                  key={s.num}
                  className="flex items-center gap-1.5 py-1 px-3 rounded-full select-none text-[13px] font-medium transition-all"
                  style={{
                    background: isCurrent ? 'var(--text)' : 'transparent',
                    color: isCurrent ? 'var(--bg)' : isDone ? 'var(--text)' : 'var(--text-secondary)',
                    fontWeight: isCurrent ? 600 : 500,
                  }}
                >
                  <span className="font-mono text-xs opacity-75">
                    {isDone ? '✓' : s.num}
                  </span>
                  <span>{s.label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Centered Liquid Glass Workspace Card */}
        <div
          className="max-w-[760px] mx-auto studio-card p-7 sm:p-10 space-y-7"
        >
          {/* STEP 1: Photos & Voice */}
          {activeStep === 1 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-[22px] font-semibold tracking-tight text-[var(--text)] m-0">
                    1. Add Your Photos and Voice
                  </h2>
                  <div className="group relative cursor-help text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full border border-[var(--border-strong)] flex items-center justify-center font-mono text-[10px]">
                      i
                    </span>
                    <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-3 rounded-[8px] bg-[var(--text)] text-[var(--bg)] text-xs leading-normal shadow-xl z-20 pointer-events-none">
                      We use these photos to learn your face structure and lighting so your twin looks natural on video. They are kept private to your account.
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] m-0 leading-relaxed">
                  Use clear daylight photos taken with your phone. Look directly at the camera, then turn slightly to each side.
                </p>
              </div>

              {/* Form fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[15px] font-semibold text-[var(--text)]">
                    Twin Name
                  </label>
                  <input
                    type="text"
                    value={twinName}
                    onChange={(e) => setTwinName(e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] text-sm focus-visible:outline-none transition-all"
                    style={{
                      background: 'color-mix(in srgb, var(--surface-2) 80%, transparent)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: 'var(--text)',
                      border: '1px solid var(--border-strong)',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 0 rgba(255, 255, 255, 0.06)',
                    }}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[15px] font-semibold text-[var(--text)]">
                    Brand or Channel
                  </label>
                  <input
                    type="text"
                    value={brandChannel}
                    onChange={(e) => setBrandChannel(e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] text-sm focus-visible:outline-none transition-all"
                    style={{
                      background: 'color-mix(in srgb, var(--surface-2) 80%, transparent)',
                      backdropFilter: 'blur(12px)',
                      WebkitBackdropFilter: 'blur(12px)',
                      color: 'var(--text)',
                      border: '1px solid var(--border-strong)',
                      boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06), 0 1px 0 rgba(255, 255, 255, 0.06)',
                    }}
                  />
                </div>
              </div>

              {/* Photo upload dropzone simulation with frosted glass depth */}
              <div
                className="rounded-[16px] p-6 text-center space-y-2"
                style={{
                  background: 'color-mix(in srgb, var(--surface-2) 65%, transparent)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px dashed var(--border-strong)',
                  boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
                }}
              >
                <div className="text-sm font-semibold text-[var(--text)]">
                  5 Daylight Headshots Attached
                </div>
                <div className="text-xs text-[var(--text-secondary)] leading-relaxed">
                  Front face, 45 degree angle, smiling, speaking, and 30-second voice note attached.
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Consent */}
          {activeStep === 2 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-[22px] font-semibold tracking-tight text-[var(--text)] m-0">
                    2. Confirm Your Consent
                  </h2>
                  <div className="group relative cursor-help text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full border border-[var(--border-strong)] flex items-center justify-center font-mono text-[10px]">
                      i
                    </span>
                    <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-3 rounded-[8px] bg-[var(--text)] text-[var(--bg)] text-xs leading-normal shadow-xl z-20 pointer-events-none">
                      We never share your likeness or sell your voice. You have 100% control over when and how your twin is used.
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] m-0 leading-relaxed">
                  Every TwinStudio private model is protected by strict consent verification.
                </p>
              </div>

              <div
                className="p-5 rounded-[16px] text-sm space-y-3 leading-relaxed"
                style={{
                  background: 'color-mix(in srgb, var(--surface-2) 75%, transparent)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-strong)',
                  color: 'var(--text-secondary)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                }}
              >
                <div>
                  <strong className="text-[var(--text)]">Your Identity:</strong> You confirm that you are the person in these photos, or you have direct legal permission from them.
                </div>
                <div>
                  <strong className="text-[var(--text)]">Workspace Privacy:</strong> Videos made with this twin can only be created and downloaded from your private account.
                </div>
              </div>

              <label className="flex items-start gap-3.5 cursor-pointer select-none pt-2">
                <input
                  type="checkbox"
                  checked={hasConsented}
                  onChange={(e) => setHasConsented(e.target.checked)}
                  className="mt-1 w-5 h-5 rounded cursor-pointer accent-[var(--accent-3)]"
                />
                <span className="text-sm font-medium text-[var(--text)] leading-relaxed">
                  I confirm this is my own face and voice, and I allow TwinStudio to generate videos for my brand.
                </span>
              </label>
            </div>
          )}

          {/* STEP 3: Liveness */}
          {activeStep === 3 && (
            <div className="space-y-6">
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <h2 className="text-[22px] font-semibold tracking-tight text-[var(--text)] m-0">
                    3. Quick Camera Verification
                  </h2>
                  <div className="group relative cursor-help text-xs text-[var(--text-muted)] flex items-center gap-1">
                    <span className="w-4 h-4 rounded-full border border-[var(--border-strong)] flex items-center justify-center font-mono text-[10px]">
                      i
                    </span>
                    <div className="hidden group-hover:block absolute right-0 top-6 w-64 p-3 rounded-[8px] bg-[var(--text)] text-[var(--bg)] text-xs leading-normal shadow-xl z-20 pointer-events-none">
                      This 3-second check confirms you are the living person in the photos to prevent unauthorized deepfakes.
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[var(--text-secondary)] m-0 leading-relaxed">
                  Look at your front camera for a quick 3-second check.
                </p>
              </div>

              <div
                className="p-8 rounded-[16px] text-center space-y-3"
                style={{
                  background: 'color-mix(in srgb, var(--surface-2) 75%, transparent)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-strong)',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06), inset 0 1px 0 rgba(255, 255, 255, 0.08)',
                }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-xl shadow-sm"
                  style={{
                    background: 'var(--surface)',
                    border: '1px solid var(--border-strong)',
                    color: 'var(--text)',
                  }}
                >
                  {livenessConfirmed ? '✓' : '📷'}
                </div>
                <div className="text-sm font-semibold text-[var(--text)]">
                  {isProcessing
                    ? 'Verifying camera connection and lighting…'
                    : livenessConfirmed
                    ? 'Identity Verified'
                    : 'Camera ready for quick 3-second check'}
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  All verification happens securely on your device.
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Status */}
          {activeStep === 4 && (
            <div className="space-y-6 text-center py-4">
              <div
                className="w-24 h-32 mx-auto rounded-[12px] overflow-hidden shadow-md"
                style={{
                  background: 'var(--surface-2)',
                  border: '1px solid var(--border-strong)',
                }}
              >
                <AvatarPlaceholder aspectRatio="3/4" />
              </div>

              <div className="space-y-2">
                <div className="text-xs uppercase tracking-wider text-[var(--text-muted)] font-mono font-medium">
                  VERIFIED PRIVATE CREATOR TWIN
                </div>
                <h2 className="text-2xl font-bold text-[var(--text)] m-0">
                  {twinName}
                </h2>
                <p className="text-sm text-[var(--text-secondary)] max-w-sm mx-auto">
                  {brandChannel} · Private Twin
                </p>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => onNavigate?.('studio')}
                  className="btn h-[50px] px-8 rounded-full text-sm font-medium cursor-pointer"
                  style={{
                    background: 'var(--btn-primary-bg)',
                    color: 'var(--btn-primary-text)',
                  }}
                >
                  Open in Studio
                </button>
              </div>
            </div>
          )}

          {/* Bottom Action Navigation */}
          {activeStep < 4 && (
            <div className="pt-5 border-t border-[var(--border)] flex items-center justify-between">
              {activeStep > 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveStep((prev) => (prev - 1) as any)}
                  className="text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text)] cursor-pointer transition-colors"
                >
                  Back
                </button>
              ) : (
                <div />
              )}

              <button
                type="button"
                onClick={handleNext}
                disabled={isProcessing}
                className="h-12 px-8 rounded-full text-sm font-medium cursor-pointer disabled:opacity-50"
                style={{
                  background: 'var(--btn-primary-bg)',
                  color: 'var(--btn-primary-text)',
                }}
              >
                {activeStep === 3
                  ? isProcessing
                    ? 'Verifying…'
                    : 'Start Verification'
                  : 'Continue'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
