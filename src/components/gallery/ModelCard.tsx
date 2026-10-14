import React, { useState } from 'react';
import { Model } from '../../types';
import { GlassFigure } from '../common/GlassFigure';
import { Tooltip } from '../common/Tooltip';
import { Play, Sparkles } from 'lucide-react';

interface ModelCardProps {
  model: Model;
  onSelect: (model: Model) => void;
  onUseDirectly: (model: Model) => void;
}

export const ModelCard: React.FC<ModelCardProps> = ({
  model,
  onSelect,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(model)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(model);
        }
      }}
      className="interactive-card text-left p-3 rounded-[16px] border border-[var(--border-color)] transition-all duration-300 ease-out shadow-xs hover:shadow-xl hover:-translate-y-1 hover:border-[var(--border-focus)] group h-full flex flex-col justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
      style={{
        backgroundColor: 'var(--surface-color)',
      }}
    >
      <div className="flex flex-col">
        {/* Compact 3:4 Media Area with GlassFigure silhouette + Hover play icon + corner AI tooltip icon */}
        <div className="relative overflow-hidden rounded-[12px] aspect-[3/4] bg-[var(--surface-elevated)] border border-[var(--border-color)]">
          <GlassFigure
            variant={model.hairVariant || 'bun'}
            tint={model.glassTint || 'violet'}
            isHovered={isHovered}
          />

          {/* AI-generated icon in corner with tooltip, not as text */}
          <div className="absolute top-2 right-2 z-10" onClick={(e) => e.stopPropagation()}>
            <Tooltip
              content="AI-generated synthetic creator likeness. Cleared for commercial video ads."
              label="AI-generated creator likeness"
              position="left"
              icon={<Sparkles className="w-3 h-3 text-[var(--border-focus)]" />}
              triggerClassName="w-5 h-5 rounded-full bg-[var(--surface-color)]/90 backdrop-blur-xs border border-[var(--border-color)] flex items-center justify-center text-[var(--border-focus)] shadow-xs hover:scale-105 transition-transform"
            />
          </div>

          {/* Hover Play Icon Overlay */}
          <div
            className={`absolute inset-0 bg-black/25 backdrop-blur-[1px] flex items-center justify-center transition-opacity duration-200 pointer-events-none ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-white/95 text-black flex items-center justify-center shadow-lg transform transition-transform group-hover:scale-110">
              <Play className="w-4 h-4 ml-0.5 fill-current" />
            </div>
          </div>
        </div>

        {/* Compact Model Info: Name + One Role Line + Max 2 Chips */}
        <div className="mt-3 space-y-1">
          <div className="flex items-baseline justify-between gap-1.5">
            <h3 className="font-semibold text-xs sm:text-sm text-[var(--text-main)] group-hover:text-[var(--border-focus)] transition-colors truncate">
              {model.name}
            </h3>
            <span className="text-[10px] text-[var(--text-muted)] shrink-0 font-medium">
              {model.age}y
            </span>
          </div>

          {/* One Role Line */}
          <p className="text-[11px] text-[var(--text-secondary)] truncate">
            {model.role}
          </p>

          {/* Max 2 Chips (Niche + Primary Language) */}
          <div className="flex items-center gap-1 pt-0.5">
            <span className="px-2 py-0.5 rounded-full text-[9px] font-medium bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-secondary)] truncate max-w-[110px]">
              {model.niche}
            </span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-medium bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-muted)] shrink-0">
              {model.languages[0].split(' ')[0]}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
