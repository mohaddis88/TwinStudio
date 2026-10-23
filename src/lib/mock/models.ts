export interface MalaysianCreator {
  id: string;
  name: string;
  creatorNumber: string;
  discipline: string;
  niche: string;
  year: string;
  bio: string;
  languages: string[];
  tone: string;
  photoUrl?: string; // Optional: when empty/missing, renders FB-style flat placeholder
  avatarGradient: {
    bgFrom: string;
    bgTo: string;
    skin: string;
    clothing: string;
    hair: string;
    accent: string;
  };
}

export const MALAYSIAN_CREATORS: MalaysianCreator[] = [
  {
    id: 'alya-creator-01',
    name: 'Alya',
    creatorNumber: 'Creator No. 01',
    discipline: 'Beauty & Lifestyle',
    niche: 'Skincare, Clean Beauty & Morning Routines',
    year: '2026',
    bio: 'Paced, warm conversational delivery with natural skin texture and organic eye saccades. Trained for high-converting TikTok & Instagram UGC ads.',
    languages: ['English (Malaysian)', 'Bahasa Melayu'],
    tone: 'Warm, relatable, authentic',
    avatarGradient: {
      bgFrom: '#dedad2',
      bgTo: '#c5bfb4',
      skin: '#d9a785',
      clothing: '#ebe9e5',
      hair: '#2c2523',
      accent: '#b8a692',
    },
  },
  {
    id: 'marcus-creator-02',
    name: 'Marcus',
    creatorNumber: 'Creator No. 02',
    discipline: 'Tech & Gadgets',
    niche: 'Smartphones, Productivity Software & Desk Setup',
    year: '2026',
    bio: 'Articulate feature walkthroughs and direct camera gaze. Clean studio key-light with subtle natural head tilt during explanations.',
    languages: ['English (US/MY)', 'Mandarin'],
    tone: 'Authoritative, sharp, modern',
    avatarGradient: {
      bgFrom: '#d5d1c8',
      bgTo: '#bcb6aa',
      skin: '#e0b89a',
      clothing: '#232220',
      hair: '#151514',
      accent: '#8c8982',
    },
  },
];
