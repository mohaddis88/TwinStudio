export type Gender = 'Female' | 'Male' | 'Non-binary';

export type Niche = 
  | 'E-commerce & Unboxing'
  | 'Beauty & Skincare'
  | 'Fitness & Wellness'
  | 'Tech & Productivity'
  | 'Fashion & Lifestyle'
  | 'B2B & Finance'
  | 'Food & Kitchen'
  | 'Home & Wellness';

export type Language = 
  | 'English (US)'
  | 'English (UK)'
  | 'Spanish'
  | 'Hindi'
  | 'French'
  | 'Japanese'
  | 'German';

export type AngleView = 'Front' | 'Side' | 'Up' | 'Down';

export type VideoStyle = 'Selfie' | 'Talking head' | 'Product demo';

export interface SampleClip {
  id: string;
  style: VideoStyle;
  title: string;
  duration: string;
  description: string;
  slug: string;
}

export interface CharacterKit {
  promptBlock: string;
  voiceSampleUrl: string;
  voiceDuration: string;
  palette: string[];
  fileAssets: {
    front: string;
    side: string;
    up: string;
    down: string;
    clipSelfie: string;
    clipTalkingHead: string;
    clipDemo: string;
  };
}

export interface Model {
  id: string;
  slug: string;
  name: string;
  role: string;
  age: number;
  gender: Gender;
  ethnicity: string;
  niche: Niche;
  bio: string;
  personalityTraits: [string, string, string];
  languages: Language[];
  tags: string[];
  bestFor: string[];
  voiceLabel: string;
  voiceAccent: string;
  avatarBgGradient: string;
  avatarAccent: string;
  anglePhotos: {
    front: string;
    side: string;
    up: string;
    down: string;
  };
  sampleClips: SampleClip[];
  characterKit: CharacterKit;
  isCustomTwin?: boolean;
  hairVariant?: 'bun' | 'short' | 'long' | 'cap' | 'curls';
  glassTint?: 'violet' | 'coral' | 'amber' | 'rose' | 'teal-sand';
}

export interface ModelFilters {
  search: string;
  gender: Gender | 'All';
  niche: Niche | 'All';
  language: Language | 'All';
}

export interface VideoGenerationRequest {
  modelId: string;
  script: string;
  style: VideoStyle;
}

export interface GeneratedVideoResult {
  id: string;
  modelId: string;
  modelName: string;
  script: string;
  caption: string;
  style: VideoStyle;
  videoUrl: string;
  durationSeconds: number;
  createdAt: string;
  aspectRatio: '9:16' | '16:9';
}

export interface UploadedPhoto {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
  isValid: boolean;
  qualityNote?: string;
}

export interface VoiceRecording {
  name: string;
  size: number;
  durationSeconds: number;
  dataUrl: string;
  source: 'recorded' | 'uploaded';
}

export interface ConsentRecord {
  accepted: boolean;
  timestamp: string;
  policyVersion: string;
  statement: string;
  livenessVerified: boolean;
}

export interface TwinDraft {
  name: string;
  role: string;
  niche: Niche;
  languages: Language[];
  photos: UploadedPhoto[];
  voice: VoiceRecording | null;
  consentRecord: ConsentRecord;
}

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
}

export interface ContactInquiry {
  name: string;
  email: string;
  brand: string;
  monthlyVideoGoal: string;
  message: string;
}

export type ThemeMode = 'light' | 'dark';

export type PageId = 
  | 'home'
  | 'gallery' 
  | 'model-detail' 
  | 'studio' 
  | 'create-twin' 
  | 'about' 
  | 'contact'
  | 'auth';

