import React, { useState, useRef, useEffect } from 'react';
import { Niche, Language, UploadedPhoto, VoiceRecording, Model } from '../../types';
import { Tooltip } from '../common/Tooltip';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Input, Select } from '../common/Input';
import { Stepper, StepItem } from '../common/Stepper';
import { validatePhotoFile, validateAudioFile } from '../../utils/validation';
import { api } from '../../services/twinStudioApi';
import {
  Upload,
  Camera,
  Mic,
  MicOff,
  Check,
  AlertCircle,
  Play,
  Pause,
  Trash2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Lock,
} from 'lucide-react';

interface CreateTwinPageProps {
  onTwinCreated: (newModel: Model) => void;
  onBrowseGallery: () => void;
  onToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

export const CreateTwinPage: React.FC<CreateTwinPageProps> = ({
  onTwinCreated,
  onBrowseGallery,
  onToast,
}) => {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [twinName, setTwinName] = useState('Alex Rivera (Twin)');
  const [role, setRole] = useState('Founder & Growth Host');
  const [niche, setNiche] = useState<Niche>('Tech & Productivity');
  const [languages, setLanguages] = useState<Language[]>(['English (US)']);

  // Step 1: Photos
  const [photos, setPhotos] = useState<UploadedPhoto[]>([
    {
      id: 'photo-default-1',
      name: 'alex_front_headshot.jpg',
      size: 1.8 * 1024 * 1024,
      type: 'image/jpeg',
      dataUrl: '',
      isValid: true,
      qualityNote: 'Natural window lighting',
    },
    {
      id: 'photo-default-2',
      name: 'alex_angle_left.jpg',
      size: 2.1 * 1024 * 1024,
      type: 'image/jpeg',
      dataUrl: '',
      isValid: true,
      qualityNote: 'Clean cheek angle',
    },
    {
      id: 'photo-default-3',
      name: 'alex_smiling_casual.jpg',
      size: 2.4 * 1024 * 1024,
      type: 'image/jpeg',
      dataUrl: '',
      isValid: true,
      qualityNote: 'Clear daylight contrast',
    },
  ]);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Step 2: Voice
  const [voice, setVoice] = useState<VoiceRecording | null>({
    name: 'alex_conversational_intro.mp3',
    size: 2.6 * 1024 * 1024,
    durationSeconds: 38,
    dataUrl: '',
    source: 'uploaded',
  });
  const [isRecording, setIsRecording] = useState(false);
  const [recordSeconds, setRecordSeconds] = useState(0);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);

  // Step 3: Consent & Liveness
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [isVerifyingLiveness, setIsVerifyingLiveness] = useState(false);
  const [livenessVerified, setLivenessVerified] = useState(false);

  // Step 4: Training & Success
  const [isTraining, setIsTraining] = useState(false);
  const [trainingStatus, setTrainingStatus] = useState('Scanning facial angles & soft lighting…');
  const [trainingPercent, setTrainingPercent] = useState(0);
  const [createdTwin, setCreatedTwin] = useState<Model | null>(null);

  const stepsData: StepItem[] = [
    { id: 1, number: '01', title: '3-5 Photos' },
    { id: 2, number: '02', title: 'Voice note' },
    { id: 3, number: '03', title: 'Consent' },
    { id: 4, number: '04', title: 'Review' },
  ];

  // Timer for voice recording
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordSeconds((prev) => {
          if (prev >= 60) {
            setIsRecording(false);
            return 60;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setPhotoError(null);
    const newPhotos: UploadedPhoto[] = [...photos];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const validation = validatePhotoFile(file);
      if (!validation.valid) {
        setPhotoError(`${validation.error} ${validation.suggestion || ''}`);
        return;
      }

      if (newPhotos.length >= 5) {
        setPhotoError('You can upload up to 5 photos.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        setPhotos((prev) => [
          ...prev,
          {
            id: `photo-${Date.now()}-${Math.random()}`,
            name: file.name,
            size: file.size,
            type: file.type,
            dataUrl: dataUrl,
            isValid: true,
            qualityNote: 'Verified daylight resolution',
          },
        ]);
      };
      reader.readAsDataURL(file);
    }
    onToast('Photos uploaded.');
  };

  const removePhoto = (id: string) => {
    setPhotos(photos.filter((p) => p.id !== id));
  };

  const simulateDarkPhotoError = () => {
    setPhotoError('That photo is too dark. Try one near a window.');
  };

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVoiceError(null);
    const validation = validateAudioFile(file);
    if (!validation.valid) {
      setVoiceError(`${validation.error} ${validation.suggestion || ''}`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setVoice({
        name: file.name,
        size: file.size,
        durationSeconds: 40,
        dataUrl: event.target?.result as string,
        source: 'uploaded',
      });
      onToast('Voice recording uploaded.');
    };
    reader.readAsDataURL(file);
  };

  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      setVoice({
        name: `voice_recording_${recordSeconds}s.wav`,
        size: recordSeconds * 32000,
        durationSeconds: recordSeconds,
        dataUrl: '',
        source: 'recorded',
      });
      onToast('Voice captured.');
    } else {
      setRecordSeconds(0);
      setIsRecording(true);
      setVoiceError(null);
    }
  };

  const handleVerifyLiveness = () => {
    setIsVerifyingLiveness(true);
    setTimeout(() => {
      setIsVerifyingLiveness(false);
      setLivenessVerified(true);
      onToast('Liveness phrase verified.');
    }, 1800);
  };

  const handleStartTraining = async () => {
    setIsTraining(true);
    try {
      const twin = await api.createTwin(
        {
          name: twinName,
          role,
          niche,
          languages,
          photos,
          voice,
          consentRecord: {
            accepted: consentAccepted,
            timestamp: new Date().toISOString(),
            policyVersion: '1.2',
            statement:
              'I confirm this is my own voice and face. I give permission to create my private AI twin.',
            livenessVerified: livenessVerified,
          },
        },
        (statusText, percent) => {
          setTrainingStatus(statusText);
          setTrainingPercent(percent);
        }
      );
      setIsTraining(false);
      setCreatedTwin(twin);
      onToast('Twin training complete!');
    } catch {
      setIsTraining(false);
      alert('Something went wrong creating your twin. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--text-muted)]">
          Biometric workspace
        </span>
        <h1 className="font-sans text-3xl sm:text-5xl font-semibold text-[var(--text-main)]">
          Create your AI <span className="font-serif italic font-normal text-[var(--border-focus)]">twin</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
          Clone your face and voice into a private AI model. Only you can create videos with your twin.
        </p>
      </div>

      {/* 4-Step Stepper Bar */}
      {!createdTwin && (
        <Stepper
          currentStep={step}
          steps={stepsData}
          onStepClick={(targetStep) => setStep(targetStep as 1 | 2 | 3 | 4)}
        />
      )}

      {/* TRAINING IN PROGRESS */}
      {isTraining && (
        <Card variant="default" className="p-8 sm:p-14 text-center space-y-6 shadow-xl">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center mx-auto text-[var(--border-focus)] animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="font-sans text-2xl font-semibold text-[var(--text-main)]">
              Training your AI twin
            </h3>
            <p className="text-sm font-medium text-[var(--border-focus)]">{trainingStatus}</p>
            <p className="text-xs text-[var(--text-secondary)]">
              This takes about thirty seconds. Your biometric parameters remain private to your workspace.
            </p>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <div className="w-full h-3 bg-[var(--bg-color)] rounded-full overflow-hidden border border-[var(--border-color)]">
              <div
                className="h-full transition-all duration-500 ease-out rounded-full"
                style={{
                  width: `${trainingPercent}%`,
                  background: 'var(--scrollbar-thumb)',
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[var(--text-muted)]">
              <span>Private mesh synthesis</span>
              <span>{trainingPercent}%</span>
            </div>
          </div>
        </Card>
      )}

      {/* SUCCESS STATE */}
      {createdTwin && !isTraining && (
        <Card variant="default" className="p-8 sm:p-12 space-y-8 shadow-xl text-center animate-in zoom-in-95 duration-300">
          <div className="w-16 h-16 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center mx-auto text-[var(--status-success)]">
            <Check className="w-8 h-8" />
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            {/* Prominent label */}
            <div className="inline-block px-3 py-1 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-full text-xs font-semibold text-[var(--text-main)]">
              Only you can use your twin.
            </div>

            <h2 className="font-sans text-3xl font-semibold text-[var(--text-main)]">
              Your twin is ready to speak
            </h2>

            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
              We calibrated your photos and voice note into a verified creator model. You can now write any script and produce video ads instantly.
            </p>
          </div>

          {/* Card Summary */}
          <Card variant="sunken" className="p-6 max-w-md mx-auto flex items-center gap-4 text-left">
            <div className="w-14 h-14 rounded-full bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center justify-center text-lg font-serif text-[var(--text-main)] shrink-0 overflow-hidden">
              {createdTwin.anglePhotos.front ? (
                <img
                  src={createdTwin.anglePhotos.front}
                  alt={createdTwin.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                'TW'
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold text-[var(--text-main)]">{createdTwin.name}</h4>
                <span className="px-2 py-0.5 bg-[var(--status-success)]/15 text-[var(--status-success)] rounded-full text-[10px] font-medium">
                  Verified
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">{createdTwin.role}</p>
              <p className="text-[11px] text-[var(--status-success)] mt-1 font-medium">
                100% Private to your workspace
              </p>
            </div>
          </Card>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => onTwinCreated(createdTwin)}
              className="w-full sm:w-auto"
            >
              <Sparkles className="w-4 h-4" />
              <span>Use twin in Studio</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 1: PHOTOS */}
      {step === 1 && !isTraining && !createdTwin && (
        <Card variant="default" className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-sans text-2xl font-semibold text-[var(--text-main)]">
              Step 1: Upload 3 to 5 clear photos
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Natural daylight headshots with different angles produce the most realistic AI twin.
            </p>
          </div>

          {/* Photo Error Banner if triggered */}
          {photoError && (
            <Card variant="danger" className="p-4 flex items-start gap-3 shadow-md animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-[var(--status-error)] shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <p className="text-[var(--text-main)] font-medium">{photoError}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setPhotoError(null);
                  fileInputRef.current?.click();
                }}
                className="text-xs font-semibold text-[var(--text-main)] underline hover:text-[var(--border-focus)] shrink-0 cursor-pointer"
              >
                [Upload again]
              </button>
            </Card>
          )}

          {/* Photos Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={photo.id}
                className="relative aspect-square rounded-[20px] border border-[var(--border-color)] bg-[var(--bg-color)] overflow-hidden flex flex-col items-center justify-center group"
              >
                {photo.dataUrl ? (
                  <img
                    src={photo.dataUrl}
                    alt={photo.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center p-3 text-center">
                    <Camera className="w-6 h-6 text-[var(--text-muted)] mb-1.5" />
                    <span className="text-[11px] font-semibold text-[var(--text-main)] truncate max-w-full">
                      Photo 0{index + 1}
                    </span>
                    <span className="text-[10px] text-[var(--status-success)] mt-0.5 font-medium">
                      {photo.qualityNote}
                    </span>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  aria-label={`Remove photo ${index + 1}`}
                  className="absolute top-2 right-2 w-7 h-7 rounded-full bg-[var(--surface-elevated)]/90 hover:bg-[var(--surface-elevated)] text-[var(--text-main)] flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity cursor-pointer shadow-xs border border-[var(--border-color)]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}

            {photos.length < 5 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square rounded-[20px] border-2 border-dashed border-[var(--border-color)] hover:border-[var(--border-focus)] hover:bg-[var(--surface-elevated)]/50 flex flex-col items-center justify-center p-4 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] cursor-pointer"
              >
                <Upload className="w-6 h-6 text-[var(--text-muted)] mb-1" />
                <span className="text-xs font-semibold text-[var(--text-main)]">Add photo</span>
                <span className="text-[10px] text-[var(--text-muted)] mt-0.5">JPG or PNG (max 10MB)</span>
              </button>
            )}
          </div>

          <input
            type="file"
            ref={fileInputRef}
            onChange={handlePhotoUpload}
            multiple
            accept="image/jpeg,image/png"
            className="hidden"
            aria-label="Upload photo files"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs text-[var(--text-muted)]">
            <span className="font-medium text-[var(--text-main)]">
              {photos.length} of 5 photos added (minimum 3 required)
            </span>

            <button
              type="button"
              onClick={simulateDarkPhotoError}
              className="text-[11px] text-[var(--text-muted)] hover:text-[var(--status-error)] underline self-start sm:self-auto cursor-pointer"
            >
              Test dark photo warning
            </button>
          </div>

          <div className="pt-6 border-t border-[var(--border-color)] flex justify-end">
            <Button
              variant="primary"
              size="md"
              onClick={() => setStep(2)}
              disabled={photos.length < 3}
            >
              <span>Continue to voice</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 2: VOICE */}
      {step === 2 && !isTraining && !createdTwin && (
        <Card variant="default" className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sans text-2xl font-semibold text-[var(--text-main)]">
                Step 2: Voice sample (30–60 seconds)
              </h2>
              <Tooltip
                content="Record in a quiet room with minimal background noise. Speak at your normal conversation speed."
                label="Voice recording tips"
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Read any short paragraph aloud or upload a clear voice note from your phone.
            </p>
          </div>

          {voiceError && (
            <Card variant="danger" className="p-4 flex items-start gap-3 shadow-md">
              <AlertCircle className="w-5 h-5 text-[var(--status-error)] shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <p className="text-[var(--text-main)] font-medium">{voiceError}</p>
              </div>
            </Card>
          )}

          {/* Live Recording Area */}
          <Card variant="sunken" className="p-6 sm:p-8 text-center space-y-4">
            <div className="flex items-center justify-center">
              <Button
                variant={isRecording ? 'danger' : 'record'}
                onClick={toggleRecording}
                className={isRecording ? 'w-16 h-16 rounded-full animate-pulse' : ''}
                style={
                  !isRecording
                    ? {
                        background: 'var(--scrollbar-thumb)',
                        color: 'var(--accent-text)',
                      }
                    : undefined
                }
                aria-label={isRecording ? 'Stop recording voice' : 'Start recording voice'}
              >
                {isRecording ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
              </Button>
            </div>

            <div>
              <p className="text-sm font-semibold text-[var(--text-main)]">
                {isRecording ? 'Recording your voice…' : 'Tap microphone to record'}
              </p>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {isRecording
                  ? `${recordSeconds}s / 60s recorded`
                  : 'Aim for 30 to 60 seconds of natural speech'}
              </p>
            </div>

            <Card variant="elevated" className="p-3.5 max-w-lg mx-auto text-xs text-[var(--text-secondary)] text-left leading-relaxed">
              <strong className="text-[var(--text-main)]">Suggested prompt:</strong> &ldquo;Hey everyone! Today I want to share a quick update on our brand campaign. When you find tools that save hours every single week, it completely changes how fast your team can move.&rdquo;
            </Card>
          </Card>

          {/* Or Upload Audio File */}
          <div className="pt-1 text-center">
            <span className="text-xs text-[var(--text-muted)]">
              or upload voice recording file (MP3 / WAV, max 20MB)
            </span>
            <div className="mt-2">
              <input
                type="file"
                ref={audioInputRef}
                onChange={handleAudioUpload}
                accept="audio/mpeg,audio/mp3,audio/wav"
                className="hidden"
                aria-label="Upload audio recording file"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={() => audioInputRef.current?.click()}
              >
                Choose voice file
              </Button>
            </div>
          </div>

          {/* Current Voice Sample Status */}
          {voice && (
            <Card variant="elevated" className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPlayingVoice(!isPlayingVoice)}
                  className="w-10 h-10 rounded-[12px] bg-[var(--bg-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center shrink-0 border border-[var(--border-color)] transition-colors cursor-pointer"
                  aria-label={isPlayingVoice ? 'Pause voice clip' : 'Listen to voice clip'}
                >
                  {isPlayingVoice ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4 ml-0.5 fill-current" />
                  )}
                </button>
                <div className="text-xs">
                  <p className="font-semibold text-[var(--text-main)]">{voice.name}</p>
                  <p className="text-[var(--text-muted)]">
                    Duration: ~{voice.durationSeconds}s · Ready for calibration
                  </p>
                </div>
              </div>

              <span className="text-xs font-semibold text-[var(--status-success)] flex items-center gap-1">
                <Check className="w-4 h-4" />
                Verified
              </span>
            </Card>
          )}

          <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to photos</span>
            </Button>

            <Button
              variant="primary"
              onClick={() => setStep(3)}
              disabled={!voice}
            >
              <span>Continue to consent</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 3: CONSENT & LIVENESS */}
      {step === 3 && !isTraining && !createdTwin && (
        <Card variant="default" className="p-6 sm:p-8 space-y-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-sans text-2xl font-semibold text-[var(--text-main)]">
                Step 3: Consent & Liveness
              </h2>
              <Tooltip
                content="To protect real humans from unauthorized impersonation, we require you to verify that this is your authentic face and voice."
                label="Why we ask for consent and liveness"
              />
            </div>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              TwinStudio enforces strict security. Your twin can only be created with your explicit authorization.
            </p>
          </div>

          {/* Explicit Consent Checkbox */}
          <Card variant="sunken" className="p-5 space-y-3">
            <div className="flex items-start gap-3">
              <input
                id="consent-checkbox"
                type="checkbox"
                checked={consentAccepted}
                onChange={(e) => setConsentAccepted(e.target.checked)}
                className="mt-1 w-5 h-5 rounded accent-[var(--border-focus)] border-[var(--border-color)] bg-[var(--surface-color)] cursor-pointer"
              />
              <div className="flex-1">
                <label
                  htmlFor="consent-checkbox"
                  className="text-xs font-semibold text-[var(--text-main)] cursor-pointer"
                >
                  I confirm this is my own voice and face. I give permission to create my private AI twin.
                </label>
                <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[var(--text-muted)]">
                  <span>Why we ask: We never allow creating twins of people without their knowledge.</span>
                  <Tooltip
                    content="Your biometric vectors are encrypted and permanently locked to your private account. They are never sold or added to public galleries."
                    label="Biometric security policy"
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Mock Liveness Step */}
          <Card variant="elevated" className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[var(--border-focus)]" />
                <h3 className="text-sm font-semibold text-[var(--text-main)]">
                  Mock liveness verification
                </h3>
                <Tooltip
                  content="Liveness verification ensures a real person is present and reading the authorization phrase."
                  label="Learn about liveness verification"
                />
              </div>

              {livenessVerified && (
                <span className="px-2.5 py-1 bg-[var(--status-success)]/15 text-[var(--status-success)] rounded-full text-xs font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>

            <p className="text-xs text-[var(--text-secondary)]">
              Read this phrase aloud to confirm liveness:
            </p>

            <Card variant="sunken" className="p-4 rounded-[12px] text-sm text-[var(--text-main)] font-medium text-center">
              &ldquo;I am creating my verified twin for TwinStudio today.&rdquo;
            </Card>

            <div className="flex justify-center">
              <Button
                variant="secondary"
                onClick={handleVerifyLiveness}
                disabled={isVerifyingLiveness || livenessVerified}
              >
                {isVerifyingLiveness ? (
                  <>
                    <span className="w-4 h-4 border-2 border-[var(--border-focus)] border-t-transparent rounded-full animate-spin" />
                    <span>Verifying speech…</span>
                  </>
                ) : livenessVerified ? (
                  <>
                    <Check className="w-4 h-4 text-[var(--status-success)]" />
                    <span>Liveness passed</span>
                  </>
                ) : (
                  <>
                    <Mic className="w-4 h-4 text-[var(--border-focus)]" />
                    <span>Verify phrase aloud</span>
                  </>
                )}
              </Button>
            </div>
          </Card>

          <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to voice</span>
            </Button>

            <Button
              variant="primary"
              onClick={() => setStep(4)}
              disabled={!consentAccepted || !livenessVerified}
            >
              <span>Review & train twin</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      )}

      {/* STEP 4: REVIEW & TRAIN */}
      {step === 4 && !isTraining && !createdTwin && (
        <Card variant="default" className="p-6 sm:p-8 space-y-6">
          <div>
            <h2 className="font-sans text-2xl font-semibold text-[var(--text-main)]">
              Step 4: Review twin profile
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-1">
              Review your details before beginning private twin synthesis.
            </p>
          </div>

          <div className="space-y-4">
            <Input
              id="twin-name-input"
              label="Twin name"
              value={twinName}
              onChange={(e) => setTwinName(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                id="twin-role-input"
                label="Creator role tag"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              />

              <Select
                id="twin-niche-select"
                label="Primary niche"
                value={niche}
                onChange={(e) => setNiche(e.target.value as Niche)}
              >
                <option value="Tech & Productivity">Tech & Productivity</option>
                <option value="E-commerce & Unboxing">E-commerce & Unboxing</option>
                <option value="Beauty & Skincare">Beauty & Skincare</option>
                <option value="Fitness & Wellness">Fitness & Wellness</option>
                <option value="Fashion & Lifestyle">Fashion & Lifestyle</option>
                <option value="B2B & Finance">B2B & Finance</option>
              </Select>
            </div>
          </div>

          {/* Summary Checklist */}
          <Card variant="sunken" className="p-5 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Photos</span>
              <span className="font-semibold text-[var(--text-main)]">{photos.length} uploaded</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Voice sample</span>
              <span className="font-semibold text-[var(--text-main)]">
                {voice?.name} (~{voice?.durationSeconds}s)
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Consent status</span>
              <span className="font-semibold text-[var(--status-success)]">Confirmed & Recorded (v1.2)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-muted)]">Liveness verification</span>
              <span className="font-semibold text-[var(--status-success)]">Passed</span>
            </div>
          </Card>

          <Card variant="elevated" className="p-3.5 flex items-center gap-2.5 text-xs text-[var(--text-main)]">
            <Lock className="w-4 h-4 text-[var(--border-focus)] shrink-0" />
            <span>Only you can use your twin. This model is never visible to other users.</span>
          </Card>

          <div className="pt-6 border-t border-[var(--border-color)] flex items-center justify-between">
            <Button variant="ghost" onClick={() => setStep(3)}>
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to consent</span>
            </Button>

            <Button
              variant="primary"
              size="lg"
              onClick={handleStartTraining}
            >
              <Sparkles className="w-4 h-4" />
              <span>Train my twin (~30s)</span>
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};
