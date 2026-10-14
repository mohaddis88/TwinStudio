import React, { useState, useRef } from 'react';
import { Model, AngleView } from '../../types';
import { Sparkles, Upload, Check } from 'lucide-react';
import { validatePhotoFile } from '../../utils/validation';
import { Tooltip } from './Tooltip';
import { GlassFigure } from './GlassFigure';

interface MediaPlaceholderProps {
  model: Model;
  aspectRatio?: '4:5' | '16:9' | '1:1';
  isHovered?: boolean;
  angle?: AngleView;
  onReplaceMedia?: (dataUrl: string) => void;
  showReplaceButton?: boolean;
  showAiBadge?: boolean;
  sampleVideoTitle?: string;
}

export const MediaPlaceholder: React.FC<MediaPlaceholderProps> = ({
  model,
  aspectRatio = '4:5',
  isHovered = false,
  angle = 'Front',
  onReplaceMedia,
  showReplaceButton = false,
  showAiBadge = false,
  sampleVideoTitle,
}) => {
  const [replaceSuccess, setReplaceSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const aspectClass =
    aspectRatio === '4:5'
      ? 'aspect-[4/5]'
      : aspectRatio === '16:9'
      ? 'aspect-[16/9]'
      : 'aspect-square';

  const angleKey = angle.toLowerCase() as 'front' | 'side' | 'up' | 'down';
  const customPhoto = model.anglePhotos?.[angleKey];
  const isDataUrl = customPhoto && customPhoto.startsWith('data:');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validatePhotoFile(file);
    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result && onReplaceMedia) {
        onReplaceMedia(result);
        setReplaceSuccess(true);
        setTimeout(() => setReplaceSuccess(false), 2500);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div
      className={`relative w-full ${aspectClass} overflow-hidden rounded-[16px] select-none group transition-all duration-300`}
      style={{ backgroundColor: 'var(--surface-color)' }}
    >
      {/* 1. Custom uploaded photo */}
      {isDataUrl ? (
        <img
          src={customPhoto}
          alt={`${model.name} (${angle} view)`}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />
      ) : (
        /* 2. Frosted-glass silhouette figure */
        <div className="w-full h-full relative">
          <GlassFigure
            variant={model.hairVariant || 'bun'}
            tint={model.glassTint || 'violet'}
            angle={angleKey}
            isHovered={isHovered}
          />
        </div>
      )}

      {/* Top Badge (Only when requested, e.g. for custom twins) */}
      {showAiBadge && (
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className="px-2 py-0.5 bg-[var(--surface-color)]/90 backdrop-blur-sm border border-[var(--border-color)] rounded-full text-[10px] font-medium text-[var(--text-main)] flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3 text-[var(--border-focus)]" />
            {model.isCustomTwin ? 'My twin' : 'AI model'}
          </span>
        </div>
      )}

      {/* "AI-generated" shown once as a small corner icon with tooltip, NOT as text */}
      <div className="absolute bottom-2.5 right-2.5 z-10">
        <Tooltip
          content="AI-generated synthetic creator likeness. Cleared for commercial video ads."
          label="AI-generated creator likeness"
          position="top"
          icon={<Sparkles className="w-3.5 h-3.5 text-[var(--border-focus)]" />}
          triggerClassName="w-6 h-6 rounded-full bg-[var(--surface-color)]/90 backdrop-blur-xs border border-[var(--border-color)] flex items-center justify-center text-[var(--border-focus)] shadow-xs hover:scale-105 transition-transform"
        />
      </div>

      {/* Custom Replace Button */}
      {showReplaceButton && (
        <div className="absolute top-2.5 right-2.5 z-10">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png,image/jpeg"
            className="hidden"
            aria-label="Upload replacement photo"
          />
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            title="Replace with your custom photo"
            className="px-2.5 py-1 bg-[var(--surface-color)]/90 hover:bg-[var(--surface-elevated)] text-[var(--text-main)] border border-[var(--border-color)] rounded-[12px] text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
          >
            {replaceSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-[var(--status-success)]" />
                <span>Updated</span>
              </>
            ) : (
              <>
                <Upload className="w-3.5 h-3.5 text-[var(--text-muted)]" />
                <span>Replace {angle}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
};
