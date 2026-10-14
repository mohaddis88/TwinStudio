import React from 'react';
import { PageId } from '../../types';
import { ShieldCheck, Video, Lock } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer
      className="mt-32 border-t py-16 backdrop-blur-md transition-colors"
      style={{
        backgroundColor: 'var(--surface-color)',
        borderColor: 'var(--border-color)',
        color: 'var(--text-secondary)',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif-title text-3xl text-[var(--text-main)] tracking-tight">
              TwinStudio
            </span>
            <p className="text-sm text-[var(--text-secondary)] leading-relaxed max-w-md">
              A studio library of human-looking AI models for UGC and performance videos. Create custom twins with verified consent, or pick a creator for quick ads.
            </p>
            <div className="flex flex-wrap items-center gap-6 pt-2 text-xs text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[var(--status-success)]" aria-hidden="true" />
                Verified consent records
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[var(--border-focus)]" aria-hidden="true" />
                Private workspace twins
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Video className="w-4 h-4 text-[var(--border-focus)]" aria-hidden="true" />
                Transparent AI disclosure
              </span>
            </div>
          </div>

          {/* Navigation */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]">
              Studio pages
            </h4>
            <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('home')}
                  className="hover:text-[var(--text-main)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-full px-1"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('gallery')}
                  className="hover:text-[var(--text-main)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-full px-1"
                >
                  Meet the models
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('studio')}
                  className="hover:text-[var(--text-main)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-full px-1"
                >
                  Studio generate
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('create-twin')}
                  className="hover:text-[var(--text-main)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-full px-1"
                >
                  Create your twin
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('about')}
                  className="hover:text-[var(--text-main)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-full px-1"
                >
                  About us
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('contact')}
                  className="hover:text-[var(--text-main)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-full px-1"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Governance */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-[var(--text-main)]">
              Marketer safety
            </h4>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              Every video generated contains an AI label. Private twins belong only to the creator who authorized them and cannot be shared publicly.
            </p>
            <div className="pt-2">
              <span className="inline-block px-3 py-1 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-full text-[11px] font-medium text-[var(--text-secondary)]">
                Prototype v2.0 · Mock data
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--border-color)] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} TwinStudio. Built for growth marketers and brands.</p>
          <p>Plain language only · No cameras or studios needed</p>
        </div>
      </div>
    </footer>
  );
};
