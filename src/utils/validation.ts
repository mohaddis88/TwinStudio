export interface FileValidationResult {
  valid: boolean;
  error?: string;
  suggestion?: string;
}

export const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
export const MAX_AUDIO_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_AUDIO_TYPES = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/webm', 'audio/ogg'];

export function validatePhotoFile(file: File): FileValidationResult {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Please upload a JPG or PNG image.',
      suggestion: 'Save your photo as a JPG or PNG before uploading.',
    };
  }

  if (file.size > MAX_PHOTO_SIZE_BYTES) {
    return {
      valid: false,
      error: `This photo is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 10MB.`,
      suggestion: 'Choose a photo under 10MB or compress it before uploading.',
    };
  }

  return { valid: true };
}

export function validateAudioFile(file: File): FileValidationResult {
  const isTypeValid = ALLOWED_AUDIO_TYPES.some(t => file.type.includes(t)) || 
                      file.name.endsWith('.mp3') || 
                      file.name.endsWith('.wav');

  if (!isTypeValid) {
    return {
      valid: false,
      error: 'Please upload an MP3 or WAV voice file.',
      suggestion: 'Recordings from standard voice memos or phones work great in MP3 or WAV format.',
    };
  }

  if (file.size > MAX_AUDIO_SIZE_BYTES) {
    return {
      valid: false,
      error: `This audio file is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum size is 20MB.`,
      suggestion: 'Trim the clip to 30–60 seconds to keep it under 20MB.',
    };
  }

  return { valid: true };
}

export function sanitizeText(input: string): string {
  if (!input) return '';
  return input
    .replace(/[<>]/g, '')
    .trim();
}

export function formatSecondsToTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}
