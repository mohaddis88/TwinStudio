import React, { useState, useEffect, useRef } from 'react';
import { PageId, ThemeMode, UserSession } from '../../types';

interface NavProps {
  currentPage?: PageId;
  onNavigate: (page: PageId) => void;
  user?: UserSession | null;
  onSignOut?: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Nav: React.FC<NavProps> = ({
  currentPage = 'home',
  onNavigate,
  user,
  onSignOut,
  theme,
  onToggleTheme,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [currentPage]);

  // Handle outside click to close profile popover
  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [profileMenuOpen]);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [mobileMenuOpen]);

  const navItems: { label: string; page: PageId }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Models', page: 'gallery' },
    { label: 'Studio', page: 'studio' },
    { label: 'About', page: 'about' },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-[cubic-bezier(0.2,0.7,0.2,1)]"
        style={{
          padding: isScrolled
            ? 'calc(env(safe-area-inset-top, 0px) + 14px) clamp(20px, 3.3vw, 48px) 12px'
            : 'calc(env(safe-area-inset-top, 0px) + 24px) clamp(20px, 3.3vw, 48px) 16px',
          background: isScrolled
            ? 'var(--glass-bg, color-mix(in srgb, var(--bg) 78%, transparent))'
            : 'transparent',
          backdropFilter: isScrolled ? 'blur(16px) saturate(1.4)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(16px) saturate(1.4)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--glass-border, var(--border))' : '1px solid transparent',
        }}
      >
        <div className="w-full flex items-center justify-between gap-6">
          {/* Brand Logo */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="text-left cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-full py-0.5 px-1"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '18px',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              color: 'var(--text)',
            }}
          >
            TwinStudio®
          </button>

          {/* Desktop Right Cluster */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center"
            style={{ gap: '28px' }}
          >
            <ul className="flex items-center list-none m-0 p-0" style={{ gap: '24px' }}>
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <li key={item.page}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.page)}
                      className="cursor-pointer transition-colors duration-200 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)] rounded-full px-1"
                      style={{
                        fontSize: '14px',
                        fontWeight: isActive ? 600 : 400,
                        color: isActive ? 'var(--text)' : 'var(--text-secondary)',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text)')}
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.color = isActive
                          ? 'var(--text)'
                          : 'var(--text-secondary)')
                      }
                    >
                      {item.label}
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Theme Toggle Circle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-grid place-items-center cursor-pointer transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '999px',
                border: '1px solid var(--border-strong)',
                background: 'transparent',
                color: 'var(--text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--text)';
                e.currentTarget.style.color = 'var(--bg)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = 'var(--text)';
              }}
            >
              {theme === 'dark' ? (
                /* Sun Icon */
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.3" />
                  <path
                    d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                /* Moon Icon */
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M13.6 10.1A5.9 5.9 0 0 1 5.9 2.4a5.9 5.9 0 1 0 7.7 7.7Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            {/* Profile Menu or Sign In */}
            {user ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="h-[38px] pl-3 pr-4 rounded-full text-[13px] font-medium transition-all cursor-pointer flex items-center gap-2 border focus-visible:outline-none shadow-xs"
                  style={{
                    background: 'var(--surface-2)',
                    borderColor: 'var(--border-strong)',
                    color: 'var(--text)',
                  }}
                >
                  <span className="w-5 h-5 rounded-full bg-[var(--text)] text-[var(--bg)] flex items-center justify-center text-[10px] font-bold shrink-0">
                    {(user.name || user.email || 'U').charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[100px] truncate font-medium">
                    {user.name || user.email || 'User'}
                  </span>
                  <span className="text-[10px] opacity-60">▾</span>
                </button>

                {profileMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-52 p-2 rounded-[14px] border shadow-2xl z-50 focus:outline-none animate-in fade-in duration-150"
                    style={{
                      background: 'var(--glass-surface)',
                      backdropFilter: 'blur(20px) saturate(140%)',
                      WebkitBackdropFilter: 'blur(20px) saturate(140%)',
                      borderColor: 'var(--glass-border)',
                      boxShadow: 'var(--glass-shadow)',
                    }}
                  >
                    <div className="px-3 py-2 min-w-0">
                      <p className="text-xs font-semibold text-[var(--text)] truncate m-0">
                        {user.name || 'User'}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate m-0 mt-0.5">
                        {user.email || ''}
                      </p>
                    </div>
                    <div className="my-1.5 border-t border-[var(--border)]" />
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onSignOut?.();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[var(--status-error)] hover:bg-[var(--surface-2)] rounded-[8px] transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span>Sign out</span>
                      <span>→</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('auth')}
                className="h-[38px] px-4 rounded-full text-[13px] font-medium transition-all cursor-pointer border border-[var(--border-strong)] text-[var(--text)] hover:bg-[var(--surface-2)] inline-flex items-center justify-center focus-visible:outline-none"
              >
                Sign in
              </button>
            )}

            {/* Primary Action Pill Button */}
            <button
              type="button"
              onClick={() => onNavigate('create-twin')}
              className="h-[38px] px-4 rounded-full text-[13px] font-medium cursor-pointer transition-all duration-200 inline-flex items-center justify-center border focus-visible:outline-none shadow-xs"
              style={{
                background: 'var(--text)',
                color: 'var(--bg)',
                borderColor: 'var(--text)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.opacity = '0.9';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.opacity = '1';
              }}
            >
              Create your twin
            </button>
          </nav>

          {/* Mobile Actions (<md) */}
          <div className="flex md:hidden items-center gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-grid place-items-center w-9 h-9 rounded-full border border-[var(--border-strong)] text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              {theme === 'dark' ? (
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <circle cx="8" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.3" />
                  <path
                    d="M8 1v2M8 13v2M1 8h2M13 8h2M3.05 3.05l1.41 1.41M11.54 11.54l1.41 1.41M3.05 12.95l1.41-1.41M11.54 4.46l1.41-1.41"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M13.6 10.1A5.9 5.9 0 0 1 5.9 2.4a5.9 5.9 0 1 0 7.7 7.7Z"
                    stroke="currentColor"
                    strokeWidth="1.3"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="inline-grid place-items-center w-9 h-9 rounded-full border border-[var(--border-strong)] text-[var(--text)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--primary)]"
            >
              {mobileMenuOpen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path
                    d="M2.5 5.5h11M2.5 10.5h11"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Fullscreen Overlay */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 flex flex-col justify-between pt-28 pb-10 px-6 bg-[var(--bg)] text-[var(--text)] transition-all duration-300 md:hidden"
        >
          <ul className="list-none m-0 p-0 space-y-4">
            {navItems.map((item) => (
              <li key={item.page}>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className="block text-left text-4xl sm:text-5xl font-medium tracking-tight hover:opacity-70 transition-opacity py-1"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="pt-8 border-t border-[var(--border)] space-y-3 text-xs text-[var(--text-muted)]">
            {/* User status in mobile drawer */}
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-[12px] bg-[var(--surface-2)]">
                <div>
                  <div className="font-semibold text-sm text-[var(--text)]">{user.name || user.email || 'User'}</div>
                  <div className="text-xs text-[var(--text-muted)]">{user.email || ''}</div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onSignOut?.();
                    setMobileMenuOpen(false);
                  }}
                  className="text-xs text-[var(--status-error)] font-medium"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  onNavigate('auth');
                  setMobileMenuOpen(false);
                }}
                className="w-full h-10 rounded-full border border-[var(--border-strong)] text-[var(--text)] font-medium text-sm"
              >
                Sign in
              </button>
            )}

            <div>hello@twinstudio.ai</div>
            <div>Bangsar South, 59200 Kuala Lumpur, Malaysia</div>
            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  onNavigate('create-twin');
                  setMobileMenuOpen(false);
                }}
                className="w-full h-11 rounded-full bg-[var(--text)] text-[var(--bg)] font-medium text-sm"
              >
                Create your twin
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
