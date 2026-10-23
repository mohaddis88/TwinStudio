import { useState, useEffect } from 'react';

// =============================================================================
// TYPES & SCHEMAS
// =============================================================================

export interface ApproachStepContent {
  num: string;
  tab: string;
  title: string;
  text: string;
}

export interface StatItemContent {
  value: string;
  label: string;
}

export interface SiteContent {
  hero: {
    eyebrow: string;
    headingSans: string;
    headingItalic: string;
    description: string;
    primaryCta: string;
    secondaryCta: string;
    watermark: string;
    heroAvatarImageUrl?: string;
  };
  statement: {
    eyebrow: string;
    line1: string;
    line2Prefix: string;
    line2Accent: string;
    description: string;
    ctaText: string;
  };
  selectedWork: {
    eyebrow: string;
    headingSans: string;
    headingItalic: string;
    allModelsText: string;
  };
  approach: {
    eyebrow: string;
    headingSans: string;
    headingItalic: string;
    steps: ApproachStepContent[];
  };
  stats: StatItemContent[];
  marquee: string[];
  footer: {
    headingSans: string;
    headingItalic: string;
    ctaButton: string;
    email: string;
    phone: string;
    address: string;
    copyright: string;
    credit: string;
  };
  about: {
    eyebrow: string;
    titleSans: string;
    titleItalic: string;
    description: string;
    storyTitle: string;
    storyText: string;
  };
  contact: {
    eyebrow: string;
    titleSans: string;
    titleItalic: string;
    description: string;
    email: string;
    phone: string;
    address: string;
  };
}

export interface CmsModel {
  id: string;
  slug: string;
  name: string;
  creatorNumber: string;
  role: string;
  discipline: string;
  niche: string;
  year: string;
  bio: string;
  gender: 'Female' | 'Male' | 'Non-binary';
  traits: string[];
  languages: string[];
  tone: string;
  status: 'published' | 'draft';
  photoUrl?: string;
  angles: {
    front?: string;
    left?: string;
    right?: string;
  };
  voiceSamples: {
    en?: string;
    ms?: string;
    zh?: string;
  };
  voiceIds: {
    en?: string;
    ms?: string;
    zh?: string;
  };
  sampleVideoUrl?: string;
  characterPrompt?: string;
  specs: {
    bestFor: string;
    speakingStyle: string;
    cameraStyles: string;
    turnaround: string;
  };
}

// =============================================================================
// DEFAULT FACTORY CONTENT
// =============================================================================

export const DEFAULT_SITE_CONTENT: SiteContent = {
  hero: {
    eyebrow: 'AI HUMAN STUDIO, EST. 2026',
    headingSans: 'Presence that',
    headingItalic: 'answers back.',
    description:
      'We shape synthetic creators and verified digital twins with the precision of engineering and the patience of craft. Video that holds up under attention.',
    primaryCta: 'Create a video',
    secondaryCta: 'Explore models',
    watermark: 'twin',
    heroAvatarImageUrl: '/hero-bust.webp',
  },
  statement: {
    eyebrow: 'The Studio',
    line1: 'We give shape to',
    line2Prefix: 'what is still ',
    line2Accent: 'in motion.',
    description:
      'TwinStudio is an independent AI studio working across likeness, voice, motion and UGC video. We take scripts that are still loose and give them a human form that holds.',
    ctaText: 'About the studio',
  },
  selectedWork: {
    eyebrow: 'Selected creators',
    headingSans: 'Creators that ',
    headingItalic: 'hold a feed.',
    allModelsText: 'All models',
  },
  approach: {
    eyebrow: 'Approach',
    headingSans: 'From noise ',
    headingItalic: 'to form.',
    steps: [
      {
        num: '01',
        tab: 'Identity',
        title: 'Digital Likeness & Structure',
        text: 'We start from biometric ground truth. Cranium proportions, bone planes, and skin reflectance stay consistent across any virtual lighting environment.',
      },
      {
        num: '02',
        tab: 'Voice',
        title: 'Acoustic Cadence & Breath',
        text: 'Speech models capture localized accents, natural conversational pauses, and subtle breath intake so your creator speaks like a real human.',
      },
      {
        num: '03',
        tab: 'Motion',
        title: 'Dynamic Organic Movement',
        text: 'Contrapposto shoulder shifts, natural blinking patterns, and authentic head micro-gestures prevent the artificial robotic stare of legacy tools.',
      },
      {
        num: '04',
        tab: 'Delivery',
        title: 'Turnkey 4K Creator Video',
        text: 'A fully cleared digital twin. Input any direct response ad script and export ready-to-run 9:16 vertical video with lip-sync in under sixty seconds.',
      },
    ],
  },
  stats: [
    { value: '64', label: 'Projects delivered' },
    { value: '11', label: 'Languages & dialects' },
    { value: '7', label: 'Creator personas' },
    { value: '98%', label: 'Direct response lift' },
  ],
  marquee: [
    'Performance Hooks',
    'Facial Cadence',
    'Verified Twins',
    'Studio Quality',
    'High Velocity UGC',
    'Subsurface Diffusion',
  ],
  footer: {
    headingSans: 'Have a campaign still in motion? ',
    headingItalic: "Let's give it a face.",
    ctaButton: 'Start a project',
    email: 'hello@twinstudio.ai',
    phone: '+60 3 0000 0000',
    address: 'Bangsar South, 59200 Kuala Lumpur, Malaysia',
    copyright: '© 2026 TwinStudio',
    credit: 'Ontilus Technologies',
  },
  about: {
    eyebrow: 'Our Mission',
    titleSans: 'Video production without the ',
    titleItalic: 'camera.',
    description:
      'We built TwinStudio so growth marketers and DTC founders can test authentic video scripts without booking flights or waiting weeks for creator revisions.',
    storyTitle: 'Why we started TwinStudio',
    storyText:
      'Paid social marketing moves fast. An ad concept that works on Monday might stop converting by Friday. Most teams want to test twenty different hooks each week, but real video shoots take weeks and cost thousands of dollars. TwinStudio pairs pre-cleared synthetic actors with conversational speech models. Marketers write scripts in plain English and download high resolution UGC takes in minutes.',
  },
  contact: {
    eyebrow: 'Get In Touch',
    titleSans: "Let's talk about your ",
    titleItalic: 'creator pipeline.',
    description:
      'Connect with our engineering and creator team for enterprise custom twin generation, volume video rendering, or custom likeness clearance.',
    email: 'hello@twinstudio.ai',
    phone: '+60 3 0000 0000',
    address: 'Bangsar South, 59200 Kuala Lumpur, Malaysia',
  },
};

export const DEFAULT_CMS_MODELS: CmsModel[] = [
  {
    id: 'alya-creator-01',
    slug: 'alya',
    name: 'Alya',
    creatorNumber: 'Creator No. 01',
    role: 'Beauty & Lifestyle Creator',
    discipline: 'Beauty & Lifestyle',
    niche: 'Skincare, Clean Beauty & Morning Routines',
    year: '2026',
    bio: 'Paced, warm conversational delivery with natural skin texture and organic eye saccades. Trained for high-converting TikTok & Instagram UGC ads.',
    gender: 'Female',
    traits: ['Articulate', 'Warm', 'Relatable', 'Gentle'],
    languages: ['English', 'Bahasa Malaysia', 'Mandarin'],
    tone: 'Warm, relatable, authentic',
    status: 'published',
    angles: {},
    voiceSamples: {},
    voiceIds: {
      en: '21m00Tcm4TlvDq8ikWAM',
      ms: 'AZnzlk1XvdvUeBnXmlld',
      zh: 'EXAVITQu4vr4xnSDxMaL',
    },
    characterPrompt:
      'Model: Alya, 24, Malaysian Malay, warm studio key-lighting, neutral cream knit sweater, confident eye-level framing, crisp acoustic voice track.',
    specs: {
      bestFor: 'Skincare, TikTok Shop, Reels',
      speakingStyle: 'Warm, relatable, authentic',
      cameraStyles: 'Selfie, Talking head, Demo',
      turnaround: '~2 minutes per 9:16 clip',
    },
  },
  {
    id: 'marcus-creator-02',
    slug: 'marcus',
    name: 'Marcus',
    creatorNumber: 'Creator No. 02',
    role: 'Tech & Gadgets Reviewer',
    discipline: 'Tech & Gadgets',
    niche: 'Smartphones, Productivity Software & Desk Setup',
    year: '2026',
    bio: 'Articulate feature walkthroughs and direct camera gaze. Clean studio key-light with subtle natural head tilt during explanations.',
    gender: 'Male',
    traits: ['Authoritative', 'Sharp', 'Modern', 'Paced'],
    languages: ['English', 'Mandarin'],
    tone: 'Authoritative, sharp, modern',
    status: 'published',
    angles: {},
    voiceSamples: {},
    voiceIds: {
      en: 'ErXwobaYiN019PkySvjV',
      zh: 'VR6AewLTigWG4xSOukaG',
    },
    characterPrompt:
      'Model: Marcus, 28, Malaysian Chinese, crisp desk setup side-lighting, black crewneck, tech reviewer framing, punchy delivery.',
    specs: {
      bestFor: 'Productivity SaaS, Smart Devices, B2B',
      speakingStyle: 'Authoritative, sharp, modern',
      cameraStyles: 'Talking head, Product demo',
      turnaround: '~2 minutes per 9:16 clip',
    },
  },
];

// =============================================================================
// STORAGE CONSTANTS & EVENTS
// =============================================================================

const STORAGE_CONTENT_KEY = 'twinstudio_cms_content_v1';
const STORAGE_MODELS_KEY = 'twinstudio_cms_models_v1';
const CMS_UPDATE_EVENT = 'twinstudio_cms_updated';

const IDB_NAME = 'twinstudio_media_db_v1';
const IDB_STORE = 'media_blobs';

// =============================================================================
// INDEXEDDB PROMISE WRAPPER FOR MEDIA BLOBS
// =============================================================================

function openMediaDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB not supported'));
      return;
    }
    const req = window.indexedDB.open(IDB_NAME, 1);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(IDB_STORE)) {
        db.createObjectStore(IDB_STORE);
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export async function putMediaBlob(key: string, blob: Blob | File): Promise<string> {
  const db = await openMediaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    const req = store.put(blob, key);
    req.onsuccess = () => resolve(key);
    req.onerror = () => reject(req.error);
  });
}

export async function getMediaBlob(key: string): Promise<Blob | null> {
  const db = await openMediaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteMediaBlob(key: string): Promise<void> {
  const db = await openMediaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readwrite');
    const store = tx.objectStore(IDB_STORE);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

export async function listMediaKeys(): Promise<string[]> {
  const db = await openMediaDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(IDB_STORE, 'readonly');
    const store = tx.objectStore(IDB_STORE);
    const req = store.getAllKeys();
    req.onsuccess = () => resolve((req.result as string[]) || []);
    req.onerror = () => reject(req.error);
  });
}

// Convert blob to DataURL for immediate <img> / <audio> src compatibility
export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// =============================================================================
// CENTRAL CMS STORE API
// =============================================================================

export const cmsStore = {
  // --- Content ---
  getContent(): SiteContent {
    try {
      const saved = localStorage.getItem(STORAGE_CONTENT_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_SITE_CONTENT;
  },

  setContent(newContent: SiteContent): void {
    try {
      localStorage.setItem(STORAGE_CONTENT_KEY, JSON.stringify(newContent));
      window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: { type: 'content' } }));
    } catch (err) {
      console.error('Error saving CMS content:', err);
    }
  },

  updateContent(partial: Partial<SiteContent>): void {
    const current = this.getContent();
    this.setContent({ ...current, ...partial });
  },

  // --- Models ---
  getModels(): CmsModel[] {
    try {
      const saved = localStorage.getItem(STORAGE_MODELS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_CMS_MODELS;
  },

  getModelBySlug(slug: string): CmsModel | undefined {
    return this.getModels().find((m) => m.slug === slug || m.id === slug);
  },

  setModels(models: CmsModel[]): void {
    try {
      localStorage.setItem(STORAGE_MODELS_KEY, JSON.stringify(models));
      window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: { type: 'models' } }));
    } catch (err) {
      console.error('Error saving CMS models:', err);
    }
  },

  saveModel(model: CmsModel): void {
    const models = this.getModels();
    const idx = models.findIndex((m) => m.id === model.id);
    if (idx >= 0) {
      models[idx] = model;
    } else {
      models.push(model);
    }
    this.setModels(models);
  },

  deleteModel(id: string): void {
    const models = this.getModels().filter((m) => m.id !== id);
    this.setModels(models);
  },

  // --- Backup / Export / Import / Reset ---
  resetToDefaults(): void {
    try {
      localStorage.removeItem(STORAGE_CONTENT_KEY);
      localStorage.removeItem(STORAGE_MODELS_KEY);
      window.dispatchEvent(new CustomEvent(CMS_UPDATE_EVENT, { detail: { type: 'all' } }));
    } catch (err) {
      console.error('Error resetting CMS store:', err);
    }
  },

  exportConfigJson(): string {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      siteContent: this.getContent(),
      models: this.getModels(),
    };
    return JSON.stringify(data, null, 2);
  },

  importConfigJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.siteContent) {
        this.setContent(data.siteContent);
      }
      if (Array.isArray(data.models)) {
        this.setModels(data.models);
      }
      return true;
    } catch (err) {
      console.error('Failed to import CMS JSON:', err);
      return false;
    }
  },
};

// =============================================================================
// REACT HOOKS
// =============================================================================

export function useCmsContent(): [SiteContent, (content: SiteContent) => void] {
  const [content, setContentState] = useState<SiteContent>(() => cmsStore.getContent());

  useEffect(() => {
    const handleUpdate = () => {
      setContentState(cmsStore.getContent());
    };
    window.addEventListener(CMS_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const setContent = (newContent: SiteContent) => {
    cmsStore.setContent(newContent);
    setContentState(newContent);
  };

  return [content, setContent];
}

export function useCmsModels(): [CmsModel[], (models: CmsModel[]) => void] {
  const [models, setModelsState] = useState<CmsModel[]>(() => cmsStore.getModels());

  useEffect(() => {
    const handleUpdate = () => {
      setModelsState(cmsStore.getModels());
    };
    window.addEventListener(CMS_UPDATE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener(CMS_UPDATE_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const setModels = (newModels: CmsModel[]) => {
    cmsStore.setModels(newModels);
    setModelsState(newModels);
  };

  return [models, setModels];
}
