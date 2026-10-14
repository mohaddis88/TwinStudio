import React, { useState, useId } from 'react';
import { Model, ModelFilters, Gender, Niche, Language } from '../../types';
import { ModelCard } from './ModelCard';
import { Search, SlidersHorizontal, X, RotateCcw, Sparkles } from 'lucide-react';

interface GalleryPageProps {
  models: Model[];
  isLoading: boolean;
  filters: ModelFilters;
  onFilterChange: (filters: ModelFilters) => void;
  onSelectModel: (model: Model) => void;
  onUseDirectly: (model: Model) => void;
  onCreateTwinClick: () => void;
}

const GENDER_OPTIONS: (Gender | 'All')[] = ['All', 'Female', 'Male', 'Non-binary'];

const NICHE_OPTIONS: (Niche | 'All')[] = [
  'All',
  'Tech & Productivity',
  'Fitness & Wellness',
  'Beauty & Skincare',
  'E-commerce & Unboxing',
  'Fashion & Lifestyle',
  'B2B & Finance',
  'Food & Kitchen',
  'Home & Wellness',
];

const LANGUAGE_OPTIONS: (Language | 'All')[] = [
  'All',
  'English (US)',
  'English (UK)',
  'Spanish',
  'French',
  'Hindi',
  'Japanese',
  'German',
];

export const GalleryPage: React.FC<GalleryPageProps> = ({
  models,
  isLoading,
  filters,
  onFilterChange,
  onSelectModel,
  onUseDirectly,
  onCreateTwinClick,
}) => {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const searchInputId = useId();

  const activeFilterCount =
    (filters.search ? 1 : 0) +
    (filters.gender !== 'All' ? 1 : 0) +
    (filters.niche !== 'All' ? 1 : 0) +
    (filters.language !== 'All' ? 1 : 0);

  const resetFilters = () => {
    onFilterChange({
      search: '',
      gender: 'All',
      niche: 'All',
      language: 'All',
    });
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--border-focus)]">
          Creator library
        </span>
        <h1 className="font-sans text-3xl sm:text-5xl font-semibold text-[var(--text-main)]">
          Meet the <span className="font-serif italic font-normal text-[var(--border-focus)]">models</span>
        </h1>
        <p className="text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
          Hover over any creator card to preview speech and natural expressions.
        </p>
      </div>

      {/* Top Filter Bar */}
      <div
        className="p-4 sm:p-5 rounded-[20px] border border-[var(--border-color)] shadow-sm space-y-3.5"
        style={{ backgroundColor: 'var(--surface-color)' }}
      >
        {/* Search Bar + Mobile Drawer Trigger */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <input
              id={searchInputId}
              type="text"
              value={filters.search}
              onChange={(e) => onFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search by name, role, or niche…"
              className="w-full h-11 pl-10 pr-4 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-xs sm:text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] transition-all"
            />
            <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-3.5 pointer-events-none" />
            {filters.search && (
              <button
                type="button"
                onClick={() => onFilterChange({ ...filters, search: '' })}
                aria-label="Clear search"
                className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text-main)]"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Mobile Filter Drawer Button */}
          <button
            type="button"
            onClick={() => setMobileDrawerOpen(true)}
            className="md:hidden h-11 px-4 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-xs font-semibold text-[var(--text-main)] flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4 text-[var(--border-focus)]" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-[var(--border-focus)] text-white text-[10px] font-bold flex items-center justify-center">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Desktop Filter Chips Bar */}
        <div className="hidden md:flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-[var(--border-color)] text-xs">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[var(--text-muted)] mr-1 font-medium">Niche:</span>
            {NICHE_OPTIONS.slice(0, 6).map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => onFilterChange({ ...filters, niche: n })}
                className={`px-3 py-1 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] ${
                  filters.niche === n
                    ? 'bg-[var(--surface-elevated)] text-[var(--text-main)] border border-[var(--border-focus)] font-semibold'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--surface-elevated)] border border-transparent'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2.5">
            <select
              value={filters.gender}
              onChange={(e) => onFilterChange({ ...filters, gender: e.target.value as any })}
              aria-label="Filter by gender"
              className="h-9 px-3 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-xs text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
            >
              {GENDER_OPTIONS.map((g) => (
                <option key={g} value={g}>
                  Gender: {g}
                </option>
              ))}
            </select>

            <select
              value={filters.language}
              onChange={(e) => onFilterChange({ ...filters, language: e.target.value as any })}
              aria-label="Filter by language"
              className="h-9 px-3 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-xs text-[var(--text-secondary)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
            >
              {LANGUAGE_OPTIONS.map((l) => (
                <option key={l} value={l}>
                  Language: {l}
                </option>
              ))}
            </select>

            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="h-9 px-3 border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] rounded-[12px] flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Header Count */}
      <div className="flex items-center justify-between text-xs text-[var(--text-muted)] px-1">
        <span>
          Showing <strong>{models.length}</strong> creator {models.length === 1 ? 'model' : 'models'}
        </span>
        <button
          type="button"
          onClick={onCreateTwinClick}
          className="text-xs text-[var(--border-focus)] hover:underline flex items-center gap-1 font-medium"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Need your own face? Create your twin</span>
        </button>
      </div>

      {/* Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4.5 max-w-[1280px] mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <div
              key={i}
              className="rounded-[16px] border border-[var(--border-color)] p-3 space-y-2.5 animate-pulse"
              style={{ backgroundColor: 'var(--surface-color)' }}
            >
              <div className="w-full aspect-[3/4] bg-[var(--surface-elevated)] rounded-[12px]" />
              <div className="h-3 bg-[var(--surface-elevated)] rounded-[8px] w-2/3" />
              <div className="h-2.5 bg-[var(--surface-elevated)] rounded-[8px] w-full" />
            </div>
          ))}
        </div>
      ) : models.length === 0 ? (
        /* Empty State */
        <div
          className="rounded-[20px] border border-[var(--border-color)] p-12 text-center max-w-lg mx-auto space-y-4 shadow-sm"
          style={{ backgroundColor: 'var(--surface-color)' }}
        >
          <div className="w-12 h-12 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center mx-auto text-[var(--text-muted)]">
            <Search className="w-5 h-5" />
          </div>
          <h3 className="text-base font-semibold text-[var(--text-main)]">
            No creators match your filters
          </h3>
          <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
            Try adjusting your search terms or reset your filters to see all eight models.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={resetFilters}
              className="h-11 px-6 font-semibold text-xs rounded-[12px] transition-all active:scale-[0.98]"
              style={{
                background: 'var(--scrollbar-thumb)',
                color: 'var(--accent-text)',
              }}
            >
              Reset all filters
            </button>
          </div>
        </div>
      ) : (
        /* Grid: 2 cols <640px, 3 at 768, 4 at 1024, 5 at 1280+ (max container 1280) */
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4.5 max-w-[1280px] mx-auto">
          {models.map((model) => (
            <ModelCard
              key={model.id}
              model={model}
              onSelect={onSelectModel}
              onUseDirectly={onUseDirectly}
            />
          ))}
        </div>
      )}

      {/* Mobile Drawer */}
      {mobileDrawerOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter creators"
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        >
          <div
            className="w-full max-w-xs h-full p-6 flex flex-col justify-between shadow-2xl border-l border-[var(--border-color)] animate-in slide-in-from-right duration-300"
            style={{ backgroundColor: 'var(--surface-color)' }}
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)]">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[var(--border-focus)]" />
                  <h3 className="text-base font-semibold text-[var(--text-main)]">Filters</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setMobileDrawerOpen(false)}
                  aria-label="Close filters"
                  className="w-8 h-8 rounded-full bg-[var(--surface-elevated)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Niche */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-2">
                  Content niche
                </label>
                <select
                  value={filters.niche}
                  onChange={(e) => onFilterChange({ ...filters, niche: e.target.value as any })}
                  className="w-full h-11 px-3 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-xs text-[var(--text-main)]"
                >
                  {NICHE_OPTIONS.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-2">
                  Gender
                </label>
                <select
                  value={filters.gender}
                  onChange={(e) => onFilterChange({ ...filters, gender: e.target.value as any })}
                  className="w-full h-11 px-3 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-xs text-[var(--text-main)]"
                >
                  {GENDER_OPTIONS.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </div>

              {/* Language */}
              <div>
                <label className="block text-xs font-semibold text-[var(--text-main)] mb-2">
                  Language
                </label>
                <select
                  value={filters.language}
                  onChange={(e) => onFilterChange({ ...filters, language: e.target.value as any })}
                  className="w-full h-11 px-3 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-xs text-[var(--text-main)]"
                >
                  {LANGUAGE_OPTIONS.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-[var(--border-color)] space-y-2">
              <button
                type="button"
                onClick={() => setMobileDrawerOpen(false)}
                className="w-full h-11 font-semibold text-xs rounded-[12px]"
                style={{
                  background: 'var(--scrollbar-thumb)',
                  color: 'var(--accent-text)',
                }}
              >
                Apply filters ({models.length} models)
              </button>
              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={resetFilters}
                  className="w-full h-10 border border-[var(--border-color)] text-[var(--text-muted)] text-xs rounded-[12px]"
                >
                  Clear all filters
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
