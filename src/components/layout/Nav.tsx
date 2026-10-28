import React, { useState, useEffect, useRef } from 'react';
import { PageId, ThemeMode, UserSession } from '../../types';
import { ChevronDown, ArrowRight } from 'lucide-react';

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
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  }, [currentPage]);

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

  // Theme Icon: Clean Crescent Moon in Light mode matching reference image
  const ThemeIcon = () =>
    theme === 'dark' ? (
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
          strokeWidth="1.35"
          strokeLinejoin="round"
        />
      </svg>
    );

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-200"
        style={{
          padding: isScrolled
            ? 'calc(env(safe-area-inset-top, 0px) + 12px) var(--gut) 12px'
            : 'calc(env(safe-area-inset-top, 0px) + 26px) var(--gut) 18px',
          background: isScrolled ? 'var(--glass-bg)' : 'transparent',
          backdropFilter: isScrolled ? 'blur(20px) saturate(1.2)' : 'none',
          WebkitBackdropFilter: isScrolled ? 'blur(20px) saturate(1.2)' : 'none',
          borderBottom: isScrolled ? '1px solid var(--border)' : '1px solid transparent',
        }}
      >
        <div className="w-full grid grid-cols-[auto_1fr] lg:grid-cols-[1fr_auto_1fr] items-center gap-4">
          {/* Left: Brand Wordmark */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className="justify-self-start text-left cursor-pointer transition-opacity hover:opacity-80 focus-visible:outline-none rounded-sm py-0.5"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '17.5px',
              fontWeight: 700,
              letterSpacing: '-0.035em',
              color: 'var(--text)',
            }}
          >
            TwinStudio®
          </button>

          {/* Center: Clean Nav Links with Underline Indicator */}
          <nav aria-label="Main navigation" className="hidden lg:flex items-center justify-center">
            <ul className="flex items-center list-none m-0 p-0" style={{ gap: '32px' }}>
              {navItems.map((item) => {
                const isActive = currentPage === item.page;
                return (
                  <li key={item.page} className="relative">
                    <button
                      type="button"
                      onClick={() => onNavigate(item.page)}
                      className="relative cursor-pointer py-1 px-1 focus-visible:outline-none transition-colors duration-150"
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '13.5px',
                        fontWeight: 450,
                        color: isActive ? 'var(--text)' : 'var(--text-secondary)',
                      }}
                    >
                      {item.label}
                    </button>
                    {isActive && (
                      <span
                        className="absolute left-1/2 -bottom-1.5 h-[1.5px] w-5 rounded-full"
                        style={{
                          background: 'var(--text)',
                          transform: 'translateX(-50%)',
                        }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right: Controls & CTAs matching Reference */}
          <div className="hidden lg:flex items-center justify-self-end" style={{ gap: '10px' }}>
            {/* Theme Toggle Button */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-grid place-items-center cursor-pointer focus-visible:outline-none transition-colors"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '999px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text)',
                boxShadow: 'var(--elev-1)',
              }}
            >
              <ThemeIcon />
            </button>

            {/* User Profile Pill Menu */}
            {user ? (
              <div ref={profileRef} className="relative">
                <button
                  type="button"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="h-[36px] pl-1.5 pr-2.5 rounded-full text-[13px] font-medium cursor-pointer flex items-center gap-2 border focus-visible:outline-none transition-colors hover:bg-[var(--surface-2)]"
                  style={{
                    background: 'var(--surface)',
                    borderColor: 'var(--border)',
                    color: 'var(--text)',
                    boxShadow: 'var(--elev-1)',
                  }}
                >
                  <span className="w-6 h-6 rounded-full bg-[var(--text)] text-[var(--bg)] flex items-center justify-center text-[10.5px] font-bold shrink-0">
                    {(user.name || user.email || 'A').charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[105px] truncate font-medium">
                    {user.name || user.email?.split('@')[0] || 'Adamsanders8'}
                  </span>
                  <ChevronDown className="w-3.5 h-3.5 opacity-60 ml-0.5" strokeWidth={1.7} />
                </button>

                {profileMenuOpen && (
                  <div
                    className="absolute right-0 top-full mt-2 w-56 p-2 rounded-[16px] border z-50 animate-in fade-in zoom-in-95 duration-150"
                    style={{
                      background: 'var(--surface)',
                      borderColor: 'var(--border)',
                      boxShadow: 'var(--elev-2)',
                    }}
                  >
                    <div className="px-3 py-2 min-w-0">
                      <p className="text-xs font-semibold text-[var(--text)] truncate m-0">
                        {user.name || 'Adam Sanders'}
                      </p>
                      <p className="text-[11px] text-[var(--text-muted)] truncate m-0 mt-0.5">
                        {user.email || 'adamsanders8@twinstudio.ai'}
                      </p>
                      <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium rounded-full bg-[var(--surface-2)] text-[var(--accent)] border border-[var(--border)]">
                        {user.role || 'Creator Lead'}
                      </span>
                    </div>
                    <div className="my-1.5 border-t border-[var(--border)]" />
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onNavigate('studio');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[var(--surface-2)] rounded-[8px] cursor-pointer transition-colors"
                    >
                      Creator Studio
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onNavigate('gallery');
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[var(--text)] hover:bg-[var(--surface-2)] rounded-[8px] cursor-pointer transition-colors"
                    >
                      Model Roster
                    </button>
                    <div className="my-1.5 border-t border-[var(--border)]" />
                    <button
                      type="button"
                      onClick={() => {
                        setProfileMenuOpen(false);
                        onSignOut?.();
                      }}
                      className="w-full text-left px-3 py-1.5 text-xs text-[var(--status-error)] hover:bg-[var(--surface-2)] rounded-[8px] cursor-pointer transition-colors"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onNavigate('auth')}
                className="h-[36px] px-3.5 rounded-full text-[13px] font-medium cursor-pointer border inline-flex items-center justify-center focus-visible:outline-none transition-colors hover:bg-[var(--surface-2)]"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--text)',
                  boxShadow: 'var(--elev-1)',
                }}
              >
                Sign in
              </button>
            )}

            {/* Primary Action Button: Create your twin → */}
            <button
              type="button"
              onClick={() => onNavigate('create-twin')}
              className="h-[36px] px-4 rounded-full text-[13px] font-medium cursor-pointer inline-flex items-center gap-1.5 focus-visible:outline-none transition-all shadow-[var(--elev-1)] active:scale-98"
              style={{
                background: 'var(--btn-primary-bg)',
                color: 'var(--btn-primary-text)',
              }}
            >
              <span>Create your twin</span>
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex lg:hidden items-center justify-self-end gap-2">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="inline-grid place-items-center w-9 h-9 rounded-full border text-[var(--text)]"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
            >
              <ThemeIcon />
            </button>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="inline-grid place-items-center w-9 h-9 rounded-full border text-[var(--text)]"
              style={{ borderColor: 'var(--border)', background: 'var(--surface)' }}
            >
              {mobileMenuOpen ? (
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
                  <path d="M2.5 5.5h11M2.5 10.5h11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-40 flex flex-col justify-between pt-24 pb-8 px-6 bg-[var(--bg)] text-[var(--text)] lg:hidden"
        >
          <ul className="list-none m-0 p-0 space-y-4 pt-6">
            {navItems.map((item) => (
              <li key={item.page}>
                <button
                  type="button"
                  onClick={() => {
                    onNavigate(item.page);
                    setMobileMenuOpen(false);
                  }}
                  className="block text-left text-3xl font-medium tracking-tight py-1"
                  style={{ fontFamily: 'var(--font-sans)' }}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="pt-6 border-t border-[var(--border)] space-y-3 text-xs text-[var(--text-muted)]">
            {user ? (
              <div className="flex items-center justify-between p-3 rounded-[12px] bg-[var(--surface)] border border-[var(--border)]">
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
                  className="text-xs text-[var(--status-error)] font-medium cursor-pointer"
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
                className="w-full h-10 rounded-full border border-[var(--border)] text-[var(--text)] font-medium text-sm cursor-pointer"
              >
                Sign in
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onNavigate('create-twin');
                setMobileMenuOpen(false);
              }}
              className="w-full h-11 rounded-full font-medium text-sm flex items-center justify-center gap-1.5 cursor-pointer"
              style={{ background: 'var(--btn-primary-bg)', color: 'var(--btn-primary-text)' }}
            >
              <span>Create your twin</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
