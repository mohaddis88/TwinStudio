import React, { useState } from 'react';
import { PageId, ThemeMode } from '../types';
import { useCmsModels, useCmsContent } from '../lib/cmsStore';
import { Search, ArrowRight, ChevronDown, Filter } from 'lucide-react';

interface ModelsPageProps {
  onSelectModel: (model: any) => void;
  onUseDirectly: (model: any) => void;
  onCreateTwinClick?: () => void;
  onNavigate?: (page: PageId) => void;
  theme?: ThemeMode;
}

export const Models: React.FC<ModelsPageProps> = ({
  onSelectModel,
  onUseDirectly,
}) => {
  const [models] = useCmsModels();
  const [content] = useCmsContent();

  const [searchQuery, setSearchQuery] = useState('');
  const [genderFilter, setGenderFilter] = useState<'All' | 'Female' | 'Male' | 'Non-binary'>('All');
  const [nicheFilter, setNicheFilter] = useState<string>('All');
  const [langFilter, setLangFilter] = useState<string>('All');

  const publishedModels = models.filter((m) => m.status === 'published');

  const nicheOptions = [
    { label: 'Category: All', value: 'All' },
    { label: 'Beauty & Skincare', value: 'Beauty' },
    { label: 'Tech & Gadgets', value: 'Tech' },
    { label: 'Wellness & Health', value: 'Wellness' },
    { label: 'Fashion & Style', value: 'Fashion' },
    { label: 'Business & SaaS', value: 'Business' },
  ] as const;

  const filteredModels = publishedModels.filter((m) => {
    // 1. Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const nameMatch = m.name?.toLowerCase().includes(q);
      const roleMatch = m.role?.toLowerCase().includes(q);
      const discMatch = m.discipline?.toLowerCase().includes(q);
      const nicheMatch = m.niche?.toLowerCase().includes(q);
      const bioMatch = m.bio?.toLowerCase().includes(q);
      const langMatch = m.languages?.some((l) => l.toLowerCase().includes(q));

      if (!nameMatch && !roleMatch && !discMatch && !nicheMatch && !bioMatch && !langMatch) {
        return false;
      }
    }

    // 2. Gender Filter
    if (genderFilter !== 'All') {
      if (m.gender?.toLowerCase() !== genderFilter.toLowerCase()) {
        return false;
      }
    }

    // 3. Niche Filter
    if (nicheFilter !== 'All') {
      const d = (m.discipline || '').toLowerCase();
      const nc = (m.niche || '').toLowerCase();
      const r = (m.role || '').toLowerCase();
      const qn = nicheFilter.toLowerCase();

      if (qn === 'beauty') {
        if (!d.includes('beauty') && !nc.includes('skin') && !nc.includes('beauty') && !r.includes('beauty')) {
          return false;
        }
      } else if (qn === 'tech') {
        if (!d.includes('tech') && !nc.includes('gadget') && !nc.includes('phone') && !r.includes('tech')) {
          return false;
        }
      } else if (qn === 'wellness') {
        if (!d.includes('wellness') && !nc.includes('wellness') && !nc.includes('routine')) {
          return false;
        }
      } else if (qn === 'fashion') {
        if (!d.includes('fashion') && !nc.includes('fashion') && !r.includes('fashion')) {
          return false;
        }
      } else if (qn === 'business') {
        if (!d.includes('business') && !nc.includes('saas') && !nc.includes('productivity') && !r.includes('business')) {
          return false;
        }
      } else {
        if (!d.includes(qn) && !nc.includes(qn) && !r.includes(qn)) {
          return false;
        }
      }
    }

    // 4. Language Filter
    if (langFilter !== 'All') {
      if (!m.languages?.some((l) => l.toLowerCase().includes(langFilter.toLowerCase()))) {
        return false;
      }
    }

    return true;
  });

  const activeFilterCount =
    (genderFilter !== 'All' ? 1 : 0) +
    (nicheFilter !== 'All' ? 1 : 0) +
    (langFilter !== 'All' ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0);

  const handleClearFilters = () => {
    setSearchQuery('');
    setGenderFilter('All');
    setNicheFilter('All');
    setLangFilter('All');
  };

  return (
    <div className="page-shell overflow-hidden">
      <div className="relative z-10 max-w-[1280px] mx-auto space-y-10">
        {/* Editorial Header Block */}
        <div className="space-y-4 max-w-2xl">
          <div className="eyebrow mb-1">
            {content.selectedWork?.eyebrow || 'OUR TALENT ROSTER'}
          </div>
          <h1
            className="tracking-[-0.04em] leading-[0.98] font-semibold text-[var(--text)] m-0"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(40px, 4.5vw, 64px)',
            }}
          >
            {content.selectedWork?.headingSans || 'Real people. '}
            <span className="serif font-normal italic">{content.selectedWork?.headingItalic || 'Verified identity.'}</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-[16px] leading-relaxed max-w-xl m-0 opacity-80">
            Every creator on our roster has consented, been verified, and controls exactly how their likeness is used. Brands get authenticity. Talent gets paid.
          </p>
        </div>

        {/* =====================================================================
            UNIFIED PRODUCTION FILTER TOOLBAR (Unified Dropdowns)
            ===================================================================== */}
        <div
          className="transition-all flex flex-wrap items-center justify-between gap-4"
          style={{
            minHeight: '64px',
            padding: '12px 20px',
            borderRadius: '16px',
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            marginBottom: '40px',
          }}
        >
          {/* Left: Compact Recessed Search */}
          <div className="relative w-full sm:w-[260px] shrink-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] pointer-events-none opacity-60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search talent name or role..."
              className="w-full h-[40px] pl-10 pr-3 rounded-full text-[13px] transition-all focus-visible:outline-none placeholder:text-[var(--text-muted)]"
              style={{
                background: 'var(--surface-2)',
                color: 'var(--text)',
                border: '1px solid var(--border-strong)',
                boxShadow: 'inset 0 1px 4px 0 rgba(0, 0, 0, 0.12)',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[var(--text-muted)] hover:text-[var(--text)] cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>

          {/* Right: Cohesive Unified Dropdowns */}
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-[var(--text-muted)] opacity-60" />

              {/* Category Dropdown */}
              <div className="relative group">
                <select
                  value={nicheFilter}
                  onChange={(e) => setNicheFilter(e.target.value)}
                  className="h-[38px] pl-4 pr-9 rounded-full text-[12px] font-semibold transition-all cursor-pointer focus-visible:outline-none appearance-none"
                  style={{
                    background: nicheFilter !== 'All' ? 'var(--text)' : 'var(--surface-2)',
                    color: nicheFilter !== 'All' ? 'var(--bg)' : 'var(--text)',
                    border: nicheFilter !== 'All' ? '1px solid var(--text)' : '1px solid var(--border)',
                    boxShadow: 'none',
                    backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${nicheFilter !== 'All' ? 'white' : 'currentColor'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                    backgroundSize: '11px',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 11px center',
                  }}
                >
                  {nicheOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>

              {/* Gender Dropdown */}
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value as any)}
                className="h-[38px] pl-4 pr-9 rounded-full text-[12px] font-semibold transition-all cursor-pointer focus-visible:outline-none appearance-none"
                style={{
                  background: genderFilter !== 'All' ? 'var(--text)' : 'var(--surface-2)',
                  color: genderFilter !== 'All' ? 'var(--bg)' : 'var(--text)',
                  border: genderFilter !== 'All' ? '1px solid var(--text)' : '1px solid var(--border)',
                  boxShadow: 'none',
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${genderFilter !== 'All' ? 'white' : 'currentColor'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundSize: '11px',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 11px center',
                }}
              >
                <option value="All">Gender: All</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Non-binary">Non-binary</option>
              </select>

              {/* Language Dropdown */}
              <select
                value={langFilter}
                onChange={(e) => setLangFilter(e.target.value)}
                className="h-[38px] pl-4 pr-9 rounded-full text-[12px] font-semibold transition-all cursor-pointer focus-visible:outline-none appearance-none"
                style={{
                  background: langFilter !== 'All' ? 'var(--text)' : 'var(--surface-2)',
                  color: langFilter !== 'All' ? 'var(--bg)' : 'var(--text)',
                  border: langFilter !== 'All' ? '1px solid var(--text)' : '1px solid var(--border)',
                  boxShadow: 'none',
                  backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='${langFilter !== 'All' ? 'white' : 'currentColor'}' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e")`,
                  backgroundSize: '11px',
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 11px center',
                }}
              >
                <option value="All">Language: All</option>
                <option value="English">English</option>
                <option value="Bahasa Malaysia">Bahasa Malaysia</option>
                <option value="Mandarin">Mandarin</option>
              </select>
            </div>

            <div className="flex items-center gap-3 ml-2 border-l border-[var(--border)] pl-4">
              <span className="text-[12px] text-[var(--text-muted)] font-semibold uppercase tracking-wider">
                {filteredModels.length} {filteredModels.length === 1 ? 'result' : 'results'}
              </span>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={handleClearFilters}
                  className="h-[32px] px-3.5 rounded-full text-[11px] font-bold text-[var(--accent-4)] hover:bg-[var(--accent-gold-soft)] transition-all cursor-pointer border border-[var(--accent-gold-soft)]"
                  style={{ background: 'rgba(0,0,0,0.02)' }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* =====================================================================
            HIGH-FIDELITY PRODUCTION MATRIX GRID
            ===================================================================== */}
        {filteredModels.length === 0 ? (
          <div className="py-24 text-center space-y-6 rounded-[24px] p-10 max-w-lg mx-auto border" style={{ background: 'var(--glass-card)', borderColor: 'var(--glass-border)', boxShadow: 'var(--shadow-glass-lg)' }}>
            <div className="w-16 h-16 rounded-full bg-[var(--surface-2)] flex items-center justify-center mx-auto mb-2 border border-[var(--border-strong)]">
               <Search className="w-6 h-6 text-[var(--text-muted)]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-[22px] font-bold text-[var(--text)] tracking-tight">No creators found</h2>
              <p className="text-[15px] text-[var(--text-secondary)] leading-relaxed max-w-sm mx-auto opacity-80">
                We couldn't find any talent matching your current filter combination.
              </p>
            </div>
            <button
              type="button"
              onClick={handleClearFilters}
              className="h-11 px-7 rounded-full text-[13px] font-bold bg-[var(--text)] text-[var(--bg)] cursor-pointer hover:opacity-90 transition-all shadow-lg active:scale-98"
            >
              Reset all filters
            </button>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: '24px',
              width: '100%',
            }}
          >
            {filteredModels.map((creator) => (
              <article
                key={creator.id}
                className="group rounded-[20px] overflow-hidden flex flex-col cursor-pointer"
                style={{
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}
                onClick={() => onSelectModel(creator)}
              >
                {/* Refined Portrait: Soft Corner Radius & Atmosphere */}
                <div
                  className="overflow-hidden relative"
                  style={{ aspectRatio: '4/4.8', background: 'var(--surface-2)' }}
                >
                  {creator.photoUrl ? (
                    <img
                      src={creator.photoUrl}
                      alt={creator.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center select-none" style={{ background: 'var(--surface-2)' }}>
                      <svg viewBox="0 0 160 213" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[42%] h-[42%] opacity-40" aria-hidden="true">
                        <circle cx="80" cy="74" r="25" fill="var(--text-muted)" />
                        <path d="M36 165 C36 122, 54 108, 80 108 C106 108, 124 122, 124 165 Z" fill="var(--text-muted)" />
                      </svg>
                    </div>
                  )}

                  {/* Glassy Top Rim Highlight on hover */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: 'linear-gradient(to bottom, rgba(255,255,255,0.08) 0%, transparent 20%)' }} />

                  {/* Atmospheric Corner AI-generated tag */}
                  <div
                    className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase flex items-center select-none pointer-events-none"
                    style={{
                      background: 'var(--glass-surface)',
                      color: 'var(--accent-gold)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid var(--glass-border)',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    }}
                  >
                    AI·GEN
                  </div>
                </div>

                {/* Refined Textual Matrix Info */}
                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h2 className="font-bold text-[18px] tracking-tight text-[var(--text)] m-0 leading-tight">
                      {creator.name}
                    </h2>
                    <p className="text-[13px] text-[var(--text-secondary)] font-medium m-0 opacity-70 line-clamp-1">
                      {creator.role || creator.discipline}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {creator.languages?.slice(0, 2).map((lang: string) => (
                      <span key={lang} className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase" style={{ background: 'var(--accent-gold-soft)', color: 'var(--accent-gold)', border: '1px solid var(--accent-gold-soft)' }}>
                        {lang.slice(0, 2)}
                      </span>
                    ))}
                    <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold text-[var(--text-muted)] border border-[var(--border-strong)] uppercase tracking-wide">
                      {creator.discipline?.split('&')[0]?.trim().slice(0, 6)}
                    </span>
                  </div>

                  {/* Weighted Action Section */}
                  <div className="pt-4 border-t border-[var(--border)] flex items-center justify-between gap-3">
                    <div className="text-[12px] font-bold text-[var(--text)] flex items-center gap-1.5 opacity-90 group-hover:text-[var(--accent-gold)] transition-colors">
                      <span>PROFILE</span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); onUseDirectly(creator); }}
                      className="h-8 px-4 rounded-full text-[12px] font-medium"
                      style={{
                        background: 'var(--btn-primary-bg)',
                        color: 'var(--btn-primary-text)',
                      }}
                    >
                      STUDIO
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* =====================================================================
            VIEW MORE FOOTER: Dynamic Count & Action
            ===================================================================== */}
        <div className="pt-12 pb-6 border-t border-[var(--border)] flex flex-col items-center justify-center gap-4">
          <p className="text-[13px] text-[var(--text-muted)] m-0 font-semibold tracking-wide uppercase opacity-60">
            Showing {filteredModels.length} of {publishedModels.length} published creators
          </p>
          {filteredModels.length > 0 && (
            <button className="h-12 px-9 rounded-full text-[14px] font-bold border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--surface-2)] transition-all shadow-sm active:scale-98 cursor-pointer">
              Load more creators
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
