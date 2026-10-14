import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { PageId, UserSession, ThemeMode } from '../../types';
import { Menu, X, LogOut, ChevronDown, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  user: UserSession | null;
  onSignOut: () => void;
  theme: ThemeMode;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  user,
  onSignOut,
  theme,
  onToggleTheme,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const signOutBtnRef = useRef<HTMLButtonElement>(null);
  const hamburgerButtonRef = useRef<HTMLButtonElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close menus on route change
  useEffect(() => {
    setProfileMenuOpen(false);
    setMobileMenuOpen(false);
  }, [currentPage]);

  // Lock body scroll while mobile drawer is open, and restore on close / unmount
  useEffect(() => {
    if (!mobileMenuOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileMenuOpen]);

  // Handle outside click & Escape key for desktop profile popover
  useEffect(() => {
    if (!profileMenuOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (
        popoverRef.current &&
        !popoverRef.current.contains(target) &&
        profileButtonRef.current &&
        !profileButtonRef.current.contains(target)
      ) {
        setProfileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setProfileMenuOpen(false);
        profileButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [profileMenuOpen]);

  // Handle scroll for morphing nav
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks: { label: string; page: PageId }[] = [
    { label: 'Home', page: 'home' },
    { label: 'Models', page: 'gallery' },
    { label: 'Studio', page: 'studio' },
    { label: 'About', page: 'about' },
    { label: 'Contact', page: 'contact' },
  ];

  const handleNavClick = (page: PageId) => {
    onNavigate(page);
    setMobileMenuOpen(false);
    setProfileMenuOpen(false);
  };

  const handleOpenDrawer = () => {
    setMobileMenuOpen(true);
    setTimeout(() => {
      closeButtonRef.current?.focus();
    }, 50);
  };

  const handleCloseDrawer = () => {
    setMobileMenuOpen(false);
    hamburgerButtonRef.current?.focus();
  };

  const handleDrawerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      handleCloseDrawer();
      return;
    }
    if (e.key === 'Tab' && drawerRef.current) {
      const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length === 0) return;
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }
  };

  const handleSignOutClick = () => {
    setProfileMenuOpen(false);
    onSignOut();
    profileButtonRef.current?.focus();
  };

  const handleMobileSignOut = () => {
    setMobileMenuOpen(false);
    onSignOut();
    hamburgerButtonRef.current?.focus();
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          isScrolled
            ? 'pt-3 px-4 sm:px-6 pointer-events-none'
            : 'pt-0 px-0 pointer-events-auto'
        }`}
      >
        <div
          className={`mx-auto transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-auto flex items-center justify-between ${
            isScrolled
              ? 'max-w-[900px] rounded-full py-2.5 px-6 shadow-2xl border'
              : 'max-w-[1200px] w-full px-4 sm:px-6 md:px-8 py-5 bg-transparent'
          }`}
          style={{
            backgroundColor: isScrolled ? 'var(--surface-glass)' : 'transparent',
            backdropFilter: isScrolled ? 'blur(16px)' : 'none',
            WebkitBackdropFilter: isScrolled ? 'blur(16px)' : 'none',
            borderColor: isScrolled ? 'var(--border-color)' : 'transparent',
          }}
        >
          {/* Left: Brand Logo */}
          <button
            type="button"
            onClick={() => handleNavClick('home')}
            className="text-left font-serif-title text-2xl sm:text-[28px] text-[var(--text-main)] tracking-tight hover:opacity-80 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-full px-1 cursor-pointer"
          >
            TwinStudio
          </button>

          {/* Center: Nav links (Desktop >=1024px) */}
          <nav
            aria-label="Main navigation"
            className="hidden lg:flex items-center gap-1 lg:gap-2 text-xs font-medium text-[var(--text-secondary)]"
          >
            {navLinks.map((item) => {
              const isActive = currentPage === item.page;
              return (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => handleNavClick(item.page)}
                  className={`px-3 py-1.5 rounded-full transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] cursor-pointer ${
                    isActive
                      ? 'bg-[var(--surface-elevated)] text-[var(--text-main)] border border-[var(--border-color)] font-semibold shadow-xs'
                      : 'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--surface-color)]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right: Theme Toggle + Auth + CTA (Desktop >=1024px) */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Switcher Toggle */}
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--surface-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* User Account / Profile Menu Popover */}
            {user ? (
              <div className="relative">
                <button
                  ref={profileButtonRef}
                  type="button"
                  id="nav-profile-button"
                  aria-haspopup="menu"
                  aria-expanded={profileMenuOpen}
                  aria-controls="nav-profile-menu"
                  onClick={() => setProfileMenuOpen((prev) => !prev)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 bg-[var(--surface-elevated)] border border-[var(--border-color)] hover:border-[var(--border-focus)] rounded-full text-xs text-[var(--text-main)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] shadow-xs cursor-pointer"
                >
                  <span className="w-5 h-5 rounded-full bg-[var(--border-focus)]/20 text-[var(--border-focus)] flex items-center justify-center text-[10px] font-bold shrink-0">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="max-w-[100px] truncate font-medium text-xs">
                    {user.name}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-[var(--text-muted)] transition-transform duration-200 ${
                      profileMenuOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Profile Popover Panel: glass surface, 12px radius, 8px padding, fade + 4px slide in */}
                {profileMenuOpen && (
                  <div
                    ref={popoverRef}
                    id="nav-profile-menu"
                    role="menu"
                    aria-labelledby="nav-profile-button"
                    tabIndex={-1}
                    className="absolute right-0 top-full mt-2 w-56 p-2 rounded-[12px] border border-[var(--border-color)] shadow-xl animate-in fade-in slide-in-from-top-1 duration-150 z-50 focus:outline-none"
                    style={{
                      backgroundColor: 'var(--surface-glass)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'ArrowDown' || e.key === 'Tab') {
                        e.preventDefault();
                        signOutBtnRef.current?.focus();
                      } else if (e.key === 'Escape') {
                        setProfileMenuOpen(false);
                        profileButtonRef.current?.focus();
                      }
                    }}
                  >
                    <div className="px-2.5 py-1.5 min-w-0" role="presentation">
                      <p className="text-xs font-semibold text-[var(--text-main)] truncate">
                        {user.name}
                      </p>
                      <p
                        className="text-[11px] text-[var(--text-muted)] truncate"
                        title={user.email}
                      >
                        {user.email}
                      </p>
                    </div>

                    <div className="my-1.5 border-t border-[var(--border-color)]" role="separator" />

                    <button
                      ref={signOutBtnRef}
                      role="menuitem"
                      type="button"
                      onClick={handleSignOutClick}
                      className="w-full text-left px-2.5 py-1.5 text-xs text-[var(--status-error)] hover:bg-[var(--surface-elevated)] rounded-[8px] transition-colors flex items-center justify-between focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--border-focus)] cursor-pointer"
                    >
                      <span>Sign out</span>
                      <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => handleNavClick('auth')}
                className={`text-xs font-medium text-[var(--text-secondary)] hover:text-[var(--text-main)] px-3 py-1.5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] rounded-full cursor-pointer ${
                  currentPage === 'auth' ? 'text-[var(--text-main)] font-semibold' : ''
                }`}
              >
                Sign in
              </button>
            )}

            {/* Primary CTA (No arrow icon: text only, same size, same padding) */}
            <button
              type="button"
              onClick={() => handleNavClick('create-twin')}
              className="h-10 px-4 font-semibold text-xs rounded-[12px] active:scale-[0.98] transition-all duration-200 shadow-sm flex items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] cursor-pointer"
              style={{
                background: 'var(--scrollbar-thumb)',
                color: 'var(--accent-text)',
              }}
            >
              <span>Create your twin</span>
            </button>
          </div>

          {/* Mobile Hamburger + Theme Toggle (<1024px) */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[var(--surface-color)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--surface-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] cursor-pointer"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <button
              ref={hamburgerButtonRef}
              type="button"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation-drawer"
              onClick={handleOpenDrawer}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[var(--surface-color)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-main)] hover:bg-[var(--surface-elevated)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Sheet rendered in a Portal directly at document.body */}
      {mobileMenuOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            id="mobile-navigation-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile navigation"
            className="fixed inset-0 z-[10000] pointer-events-auto"
          >
            {/* Backdrop: directly beneath drawer sheet, above the page */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-200 animate-in fade-in cursor-pointer"
              onClick={handleCloseDrawer}
              aria-hidden="true"
            />

            {/* Drawer Sheet */}
            <div
              ref={drawerRef}
              onKeyDown={handleDrawerKeyDown}
              className="fixed top-0 right-0 bottom-0 z-[10001] w-full max-w-xs h-full p-6 flex flex-col justify-between shadow-2xl border-l border-[var(--border-color)] animate-in slide-in-from-right duration-300 pointer-events-auto overflow-y-auto"
              style={{ backgroundColor: 'var(--surface-color)' }}
            >
              <div>
                {/* Drawer Header: Brand + Theme Toggle + Close Button */}
                <div className="flex items-center justify-between pb-4 border-b border-[var(--border-color)] mb-6">
                  <span className="font-serif-title text-2xl text-[var(--text-main)]">TwinStudio</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onToggleTheme}
                      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                      className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[var(--surface-elevated)] border border-[var(--border-color)] flex items-center justify-center text-[var(--text-main)] hover:text-[var(--border-focus)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] cursor-pointer"
                    >
                      {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    </button>
                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={handleCloseDrawer}
                      aria-label="Close menu"
                      className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] flex items-center justify-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] cursor-pointer"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Navigation Links (Minimum 44px touch targets) */}
                <nav className="flex flex-col gap-1.5" aria-label="Mobile Drawer Navigation">
                  {navLinks.map((item) => {
                    const isActive = currentPage === item.page;
                    return (
                      <button
                        key={item.page}
                        type="button"
                        onClick={() => handleNavClick(item.page)}
                        className={`min-h-[44px] w-full text-left px-4 py-3 rounded-[12px] text-sm font-medium transition-all flex items-center cursor-pointer ${
                          isActive
                            ? 'bg-[var(--surface-elevated)] text-[var(--text-main)] font-semibold border border-[var(--border-color)]'
                            : 'text-[var(--text-secondary)] hover:bg-[var(--surface-elevated)]/50 hover:text-[var(--text-main)]'
                        }`}
                      >
                        {item.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Mobile Sheet Footer: User Details or Sign In + CTA (Minimum 44px touch targets) */}
              <div className="pt-6 border-t border-[var(--border-color)] space-y-3">
                {user ? (
                  <div className="space-y-3 px-1">
                    <div className="flex items-center gap-3 py-1">
                      <div className="w-10 h-10 rounded-full bg-[var(--border-focus)]/20 text-[var(--border-focus)] flex items-center justify-center text-sm font-bold shrink-0">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-[var(--text-main)] truncate">
                          {user.name}
                        </p>
                        <p className="text-[11px] text-[var(--text-muted)] truncate" title={user.email}>
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleMobileSignOut}
                      className="w-full h-11 min-h-[44px] border border-[var(--border-color)] text-xs font-semibold text-[var(--status-error)] rounded-[12px] hover:bg-[var(--surface-elevated)] flex items-center justify-center gap-2 transition-colors cursor-pointer active:scale-[0.98]"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign out</span>
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleNavClick('auth')}
                    className="w-full h-11 min-h-[44px] border border-[var(--border-color)] text-xs font-semibold text-[var(--text-main)] rounded-[12px] hover:bg-[var(--surface-elevated)] flex items-center justify-center cursor-pointer active:scale-[0.98]"
                  >
                    Sign in
                  </button>
                )}

                {/* Mobile CTA (No arrow icon: text only, same size, same padding, min 44px touch target) */}
                <button
                  type="button"
                  onClick={() => handleNavClick('create-twin')}
                  className="w-full h-11 min-h-[44px] font-semibold text-xs rounded-[12px] flex items-center justify-center cursor-pointer active:scale-[0.98]"
                  style={{
                    background: 'var(--scrollbar-thumb)',
                    color: 'var(--accent-text)',
                  }}
                >
                  <span>Create your twin</span>
                </button>
              </div>
            </div>
          </div>,
          document.body
        )}
    </>
  );
};
