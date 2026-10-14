import {
  Model,
  ModelFilters,
  VideoGenerationRequest,
  GeneratedVideoResult,
  TwinDraft,
  UserSession,
  ContactInquiry,
} from '../types';
import { INITIAL_MODELS } from '../data/mockModels';

const STORAGE_KEY_MODELS = 'twinstudio_models_v2';
const STORAGE_KEY_USER = 'twinstudio_user_v2';

export const DEFAULT_USER: UserSession = {
  id: 'usr_marketer_01',
  name: 'Alex Rivera',
  email: 'alex@brandgrowth.co',
  role: 'Growth Marketing Lead',
  company: 'Loom & Tide Labs',
};

class TwinStudioApiService {
  private getStoredModels(): Model[] {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY_MODELS);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return [...INITIAL_MODELS];
  }

  private saveStoredModels(models: Model[]): void {
    try {
      sessionStorage.setItem(STORAGE_KEY_MODELS, JSON.stringify(models));
    } catch {
      // Ignore quota
    }
  }

  public getUserSession(): UserSession | null {
    try {
      const data = sessionStorage.getItem(STORAGE_KEY_USER);
      if (data) {
        return JSON.parse(data);
      }
    } catch {
      // Fallback
    }
    return null;
  }

  public signIn(user: UserSession = DEFAULT_USER): UserSession {
    sessionStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
    return user;
  }

  public signOut(): void {
    sessionStorage.removeItem(STORAGE_KEY_USER);
  }

  public async getModels(filters?: ModelFilters): Promise<Model[]> {
    await new Promise((res) => setTimeout(res, 140));

    let models = this.getStoredModels();

    if (filters) {
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        models = models.filter(
          (m) =>
            m.name.toLowerCase().includes(query) ||
            m.role.toLowerCase().includes(query) ||
            m.bio.toLowerCase().includes(query) ||
            m.niche.toLowerCase().includes(query) ||
            m.tags.some((t) => t.toLowerCase().includes(query)) ||
            m.personalityTraits.some((trait) => trait.toLowerCase().includes(query))
        );
      }

      if (filters.gender !== 'All') {
        models = models.filter((m) => m.gender === filters.gender);
      }

      if (filters.niche !== 'All') {
        models = models.filter((m) => m.niche === filters.niche);
      }

      if (filters.language !== 'All') {
        models = models.filter((m) => m.languages.includes(filters.language as any));
      }
    }

    return models;
  }

  public async getModelById(idOrSlug: string): Promise<Model | null> {
    await new Promise((res) => setTimeout(res, 100));
    const models = this.getStoredModels();
    const found = models.find((m) => m.id === idOrSlug || m.slug === idOrSlug);
    return found || null;
  }

  public async replaceModelMedia(
    modelId: string,
    slot: 'front' | 'side' | 'up' | 'down',
    dataUrl: string
  ): Promise<Model> {
    await new Promise((res) => setTimeout(res, 200));
    const models = this.getStoredModels();
    const index = models.findIndex((m) => m.id === modelId);
    if (index === -1) throw new Error('Model not found');

    const updated = { ...models[index] };
    updated.anglePhotos = {
      ...updated.anglePhotos,
      [slot]: dataUrl,
    };

    models[index] = updated;
    this.saveStoredModels(models);
    return updated;
  }

  public async createTwin(
    draft: TwinDraft,
    onProgress?: (step: string, percent: number) => void
  ): Promise<Model> {
    const steps = [
      { text: 'Scanning facial angles & soft lighting…', percent: 25, delay: 600 },
      { text: 'Synthesizing voice tone & natural breaths…', percent: 55, delay: 800 },
      { text: 'Aligning micro-expression mesh…', percent: 80, delay: 700 },
      { text: 'Securing private twin workspace…', percent: 100, delay: 500 },
    ];

    for (const step of steps) {
      if (onProgress) onProgress(step.text, step.percent);
      await new Promise((res) => setTimeout(res, step.delay));
    }

    const newSlug = `twin-${Date.now()}`;
    const primaryPhoto = draft.photos[0]?.dataUrl || '';

    const newTwin: Model = {
      id: newSlug,
      slug: newSlug,
      name: draft.name.trim() || 'My Private Twin',
      role: draft.role.trim() || 'Personal Brand Creator',
      age: 28,
      gender: 'Non-binary',
      ethnicity: 'Verified Creator',
      niche: draft.niche,
      bio: `Your private AI creator twin. Speaks your marketing scripts with verified voice inflection and natural eye contact.`,
      personalityTraits: ['Verified', 'Authentic', 'Personal'],
      languages: draft.languages.length > 0 ? draft.languages : ['English (US)'],
      tags: ['Personal Twin', 'Verified liveness', 'Private workspace'],
      bestFor: ['Founder updates', 'TikTok ads', 'Onboarding walkthroughs'],
      voiceLabel: 'Your authentic voice',
      voiceAccent: 'Your calibrated voice profile',
      avatarBgGradient: 'from-[#443125] via-[#2A1D16] to-[#120D0A]',
      avatarAccent: '#C8B4A0',
      anglePhotos: {
        front: primaryPhoto || `models/${newSlug}/front.jpg`,
        side: draft.photos[1]?.dataUrl || `models/${newSlug}/side.jpg`,
        up: draft.photos[2]?.dataUrl || `models/${newSlug}/up.jpg`,
        down: draft.photos[3]?.dataUrl || `models/${newSlug}/down.jpg`,
      },
      sampleClips: [
        {
          id: `${newSlug}-clip-selfie`,
          style: 'Selfie',
          title: 'Direct Personal Hook',
          duration: '0:16',
          description: 'Your twin greets viewers directly by name with crisp conversational pacing.',
          slug: `models/${newSlug}/clip-selfie.mp4`,
        },
        {
          id: `${newSlug}-clip-talking`,
          style: 'Talking head',
          title: 'Product Recommendation',
          duration: '0:28',
          description: 'Steady eye-level explanation of your brand offer.',
          slug: `models/${newSlug}/clip-talking-head.mp4`,
        },
        {
          id: `${newSlug}-clip-demo`,
          style: 'Product demo',
          title: 'Offer Sign-Off',
          duration: '0:14',
          description: 'Clear closer inviting viewers to click the link below.',
          slug: `models/${newSlug}/clip-demo.mp4`,
        },
      ],
      characterKit: {
        promptBlock: `Private Twin: ${draft.name}, verified creator model, private workspace permissions enabled, authentic eye-contact, crisp studio sound.`,
        voiceSampleUrl: draft.voice?.dataUrl || 'voices/custom_twin_sample.mp3',
        voiceDuration: `0:${draft.voice?.durationSeconds || 35}`,
        palette: ['#120D0A', '#2A1F18', '#C8B4A0', '#967A68'],
        fileAssets: {
          front: `models/${newSlug}/front.jpg`,
          side: `models/${newSlug}/side.jpg`,
          up: `models/${newSlug}/up.jpg`,
          down: `models/${newSlug}/down.jpg`,
          clipSelfie: `models/${newSlug}/clip-selfie.mp4`,
          clipTalkingHead: `models/${newSlug}/clip-talking-head.mp4`,
          clipDemo: `models/${newSlug}/clip-demo.mp4`,
        },
      },
      isCustomTwin: true,
    };

    const models = this.getStoredModels();
    models.unshift(newTwin);
    this.saveStoredModels(models);

    return newTwin;
  }

  public async generateVideo(
    request: VideoGenerationRequest,
    onProgress: (step: string, percent: number) => void,
    shouldFail = false
  ): Promise<GeneratedVideoResult> {
    const models = this.getStoredModels();
    const model = models.find((m) => m.id === request.modelId) || models[0];

    const steps = [
      { text: 'Preparing voice and speech cadence…', percent: 20, delay: 550 },
      { text: 'Syncing lip movement and subtle blinks…', percent: 50, delay: 750 },
      { text: 'Applying soft lighting diffusion…', percent: 75, delay: 700 },
      { text: 'Exporting 1080p MP4 preview…', percent: 100, delay: 500 },
    ];

    for (let i = 0; i < steps.length; i++) {
      if (shouldFail && i === 2) {
        throw new Error('Something went wrong creating your video. Your script is saved.');
      }
      onProgress(steps[i].text, steps[i].percent);
      await new Promise((res) => setTimeout(res, steps[i].delay));
    }

    const wordCount = request.script.trim().split(/\s+/).filter(Boolean).length;
    const duration = Math.max(10, Math.min(60, Math.round(wordCount / 2.5)));

    // Generate caption recommendation
    const caption = `${request.script.slice(0, 90)}… #UGC #marketing #TwinStudio`;

    return {
      id: `gen-vid-${Date.now()}`,
      modelId: model.id,
      modelName: model.name,
      script: request.script,
      caption,
      style: request.style,
      videoUrl: '',
      durationSeconds: duration,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      aspectRatio: request.style === 'Talking head' ? '16:9' : '9:16',
    };
  }

  public async submitContact(inquiry: ContactInquiry): Promise<boolean> {
    await new Promise((res) => setTimeout(res, 400));
    return true;
  }

  public resetToDefault(): void {
    sessionStorage.removeItem(STORAGE_KEY_MODELS);
  }
}

export const api = new TwinStudioApiService();
