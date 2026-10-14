import React from 'react';
import { PageId } from '../../types';
import { ShieldCheck, Lock, Eye, Video, ArrowRight, HeartHandshake } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (page: PageId) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-24 max-w-4xl mx-auto animate-in fade-in duration-300">
      {/* Hero Header */}
      <section className="text-center space-y-4 pt-8">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--border-focus)]">
          Our mission
        </span>
        <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl font-semibold text-[var(--text-main)] leading-tight">
          Video production without the <span className="font-serif italic font-normal text-[var(--border-focus)]">camera</span>.
        </h1>
        <p className="text-base text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed">
          We built TwinStudio so growth marketers and DTC founders can test authentic video scripts without booking flights or waiting weeks for creator revisions.
        </p>
      </section>

      {/* Origin Story / Why it exists */}
      <section
        className="border border-[var(--border-color)] rounded-[20px] p-8 sm:p-12 shadow-sm space-y-6"
        style={{ backgroundColor: 'var(--surface-color)' }}
      >
        <h2 className="font-sans text-2xl sm:text-3xl font-semibold text-[var(--text-main)]">
          Why we started <span className="font-serif italic font-normal text-[var(--border-focus)]">TwinStudio</span>
        </h2>
        <div className="space-y-4 text-sm text-[var(--text-secondary)] leading-relaxed">
          <p>
            Paid social marketing moves fast. An ad concept that works on Monday might stop converting by Friday. Most teams want to test twenty different hooks each week, but real video shoots take weeks and cost thousands of dollars.
          </p>
          <p>
            We set out to solve that bottleneck. TwinStudio pairs pre-cleared synthetic actors with conversational speech models. Marketers write scripts in plain English and download high resolution UGC takes in minutes.
          </p>
        </div>
      </section>

      {/* Four Ethical Principles */}
      <section className="space-y-8">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-[var(--border-focus)]">
            Ethics & security
          </span>
          <h2 className="font-sans text-3xl font-semibold text-[var(--text-main)]">
            How we protect <span className="font-serif italic font-normal text-[var(--border-focus)]">identity</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div
            className="border border-[var(--border-color)] rounded-[20px] p-6 space-y-3 shadow-sm"
            style={{ backgroundColor: 'var(--surface-color)' }}
          >
            <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--status-success)]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-main)]">100% Verified consent</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Every twin requires an active spoken phrase check and a logged consent timestamp. We never clone third parties or public figures.
            </p>
          </div>

          <div
            className="border border-[var(--border-color)] rounded-[20px] p-6 space-y-3 shadow-sm"
            style={{ backgroundColor: 'var(--surface-color)' }}
          >
            <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--border-focus)]">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-main)]">Private model weights</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Your biometric face mesh and voice clone stay inside your workspace. Other users can never browse or generate videos using your twin.
            </p>
          </div>

          <div
            className="border border-[var(--border-color)] rounded-[20px] p-6 space-y-3 shadow-sm"
            style={{ backgroundColor: 'var(--surface-color)' }}
          >
            <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--border-focus)]">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-main)]">Clear disclosure tags</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Every exported video includes standard digital metadata indicating synthetic creator media for full advertising compliance.
            </p>
          </div>

          <div
            className="border border-[var(--border-color)] rounded-[20px] p-6 space-y-3 shadow-sm"
            style={{ backgroundColor: 'var(--surface-color)' }}
          >
            <div className="w-10 h-10 rounded-[12px] bg-[var(--surface-elevated)] flex items-center justify-center text-[var(--status-success)]">
              <HeartHandshake className="w-5 h-5" />
            </div>
            <h3 className="text-base font-semibold text-[var(--text-main)]">Clear commercial rights</h3>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Our 8 library actors are synthetic originals. You receive full commercial rights for paid social ads without recurring talent royalties.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Box */}
      <section
        className="border border-[var(--border-color)] rounded-[20px] p-8 sm:p-12 text-center space-y-6 shadow-sm"
        style={{ backgroundColor: 'var(--surface-elevated)' }}
      >
        <h2 className="font-sans text-3xl font-semibold text-[var(--text-main)]">
          Ready to see the <span className="font-serif italic font-normal text-[var(--border-focus)]">difference</span>?
        </h2>
        <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
          Browse our creator models or create your private twin in five minutes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('gallery')}
            className="h-12 px-8 font-semibold text-xs rounded-[12px] active:scale-[0.98] transition-all flex items-center gap-2 shadow-sm"
            style={{
              background: 'var(--scrollbar-thumb)',
              color: 'var(--accent-text)',
            }}
          >
            <span>Browse creator library</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>
    </div>
  );
};
