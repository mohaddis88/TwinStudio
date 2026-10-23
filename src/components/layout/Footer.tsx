import React from 'react';
import { PageId } from '../../types';
import { useCmsContent } from '../../lib/cmsStore';

interface FooterProps {
  onNavigate: (page: PageId) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [content] = useCmsContent();
  const footer = content.footer;

  return (
    <footer
      className="w-full border-t border-[var(--border)] transition-colors duration-500"
      style={{
        padding: 'clamp(32px, 4vw, 80px) var(--gut) calc(env(safe-area-inset-bottom, 0px) + 20px)',
        background: 'var(--bg)',
        color: 'var(--text)',
      }}
    >
      {/* Super Compact Responsive Footer Grid */}
      <div
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-[4fr_2fr_2.5fr_1.5fr] gap-6 lg:gap-8"
        style={{ marginBottom: 'clamp(20px, 3vw, 48px)' }}
      >
        {/* Col 1: Heading CTA (Full width on mobile, sleek) */}
        <div className="col-span-2 lg:col-span-1 space-y-4">
          <h2
            className="tracking-tight text-[var(--text)] m-0 leading-tight"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(22px, 2.2vw, 32px)',
              fontWeight: 500,
              maxWidth: '16em',
            }}
          >
            {footer.headingSans}{' '}
            <span className="serif block sm:inline">{footer.headingItalic}</span>
          </h2>

          <div>
            <button
              type="button"
              onClick={() => onNavigate('studio')}
              className="btn group inline-flex items-center gap-2 cursor-pointer focus-visible:outline-none"
              style={{
                height: '40px',
                padding: '0 20px',
                borderRadius: '999px',
                background: 'var(--text)',
                color: 'var(--bg)',
                fontSize: '13px',
                fontWeight: 600,
              }}
            >
              <span>{footer.ctaButton}</span>
            </button>
          </div>
        </div>

        {/* Col 2: Studio Nav */}
        <div className="space-y-2">
          <h3 className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold m-0">
            STUDIO
          </h3>
          <ul className="list-none m-0 p-0 space-y-1.5 text-[13px]">
            {[
              { label: 'Home', page: 'home' as PageId },
              { label: 'Models', page: 'gallery' as PageId },
              { label: 'Studio', page: 'studio' as PageId },
              { label: 'Create Twin', page: 'create-twin' as PageId },
            ].map((item) => (
              <li key={item.label}>
                <button
                  type="button"
                  onClick={() => onNavigate(item.page)}
                  className="cursor-pointer text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors py-0.5 text-left"
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Contact Details */}
        <div className="space-y-2">
          <h3 className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold m-0">
            CONTACT
          </h3>
          <div className="space-y-1 text-[13px] text-[var(--text-secondary)]">
            <div className="truncate">
              <a href={`mailto:${footer.email}`} className="hover:text-[var(--text)] transition-colors">
                {footer.email}
              </a>
            </div>
            <div>{footer.phone}</div>
            <div className="text-[11px] text-[var(--text-muted)] leading-tight pt-1">
              Bangsar South, Kuala Lumpur
            </div>
          </div>
        </div>

        {/* Col 4: Socials */}
        <div className="col-span-2 sm:col-span-1 border-t sm:border-t-0 border-[var(--border)] pt-4 sm:pt-0 flex sm:flex-col gap-4 sm:gap-2">
          <span className="text-[11px] uppercase tracking-wider text-[var(--text-muted)] font-semibold block">
            SOCIAL
          </span>
          <div className="flex sm:flex-col gap-3 sm:gap-1 text-[13px]">
            {['Instagram', 'LinkedIn', 'TikTok'].map((channel) => (
              <a
                key={channel}
                href={`#${channel.toLowerCase()}`}
                className="text-[var(--text-secondary)] hover:text-[var(--text)] transition-colors"
              >
                {channel}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Giant Bleed Wordmark */}
      <div
        className="w-full overflow-hidden select-none pointer-events-none"
        style={{ margin: '20px 0 32px' }}
        aria-hidden="true"
      >
        <div
          className="tracking-[-0.055em] font-bold text-[var(--text)] whitespace-nowrap"
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'clamp(38px, 15vw, 280px)',
            lineHeight: 0.84,
            opacity: 0.98,
          }}
        >
          TwinStudio
        </div>
      </div>

      {/* Bottom Legal Bar with subtle Admin link */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t border-[var(--border)] text-xs text-[var(--text-muted)]">
        <div>{footer.copyright}</div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className="cursor-pointer opacity-60 hover:opacity-100 hover:text-[var(--text)] transition-opacity"
            title="Open Admin CMS"
          >
            Admin
          </button>
          <span className="opacity-80">{footer.credit}</span>
        </div>
      </div>
    </footer>
  );
};
