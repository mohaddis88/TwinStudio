import React, { useState, useEffect, useRef } from 'react';
import { UserSession } from '../../types';
import { auth, calculatePasswordStrength, PasswordStrength } from '../../services/auth';
import {
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Mail,
  Lock,
  RefreshCw,
} from 'lucide-react';

interface AuthPageProps {
  onSuccess: (user: UserSession) => void;
  onCancel: () => void;
  initialMode?: 'signin' | 'signup';
}

type AuthView = 'signin' | 'signup' | 'forgot' | 'verify_email' | 'reset_password' | 'reset_success';

export const AuthPage: React.FC<AuthPageProps> = ({
  onSuccess,
  onCancel,
  initialMode = 'signin',
}) => {
  const [view, setView] = useState<AuthView>(initialMode === 'signup' ? 'signup' : 'signin');

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);

  // Field states
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [newPasswordFocused, setNewPasswordFocused] = useState(false);

  // Errors & Inline validation
  const [nameError, setNameError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Loading
  const [isLoading, setIsLoading] = useState(false);

  // Verification & Cooldown
  const [verificationEmail, setVerificationEmail] = useState('');
  const [verificationSource, setVerificationSource] = useState<'signup' | 'forgot'>('signup');
  const [resendCooldown, setResendCooldown] = useState(0);

  // Autofocus input
  const emailInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    emailInputRef.current?.focus();
  }, [view]);

  // Resend cooldown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Password strength calculations
  const signupStrength: PasswordStrength = calculatePasswordStrength(password);
  const resetStrength: PasswordStrength = calculatePasswordStrength(newPassword);

  // Field Blur Validations
  const handleBlurEmail = () => {
    if (!email) {
      setEmailError('Please enter your email address.');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email format, like name@company.com.');
    } else {
      setEmailError(null);
    }
  };

  const handleBlurName = () => {
    if (!name.trim()) {
      setNameError('Please enter your name.');
    } else {
      setNameError(null);
    }
  };

  const handleBlurPassword = () => {
    if (!password) {
      setPasswordError('Please enter a password.');
    } else if (view === 'signup' && password.length < 10) {
      setPasswordError('That password is too short. Use at least 10 characters.');
    } else {
      setPasswordError(null);
    }
  };

  // Sign in Submit
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    handleBlurEmail();
    handleBlurPassword();
    if (!email || !password || emailError) return;

    setIsLoading(true);
    try {
      const user = await auth.signIn(email, password);
      setIsLoading(false);
      onSuccess(user);
    } catch (err: any) {
      setIsLoading(false);
      setFormError(err.message || 'Invalid email or password.');
    }
  };

  // Create account Submit
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    handleBlurName();
    handleBlurEmail();
    handleBlurPassword();

    if (!name.trim() || !email || !password || password.length < 10) return;

    if (!acceptTerms) {
      setFormError('Please accept the terms of service to create your account.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await auth.signUp(name, email, password);
      setIsLoading(false);
      setVerificationSource('signup');
      setVerificationEmail(result.email);
      setResendCooldown(30);
      setView('verify_email');
    } catch (err: any) {
      setIsLoading(false);
      setFormError(err.message || 'Something went wrong creating your account.');
    }
  };

  // Google OAuth simulation
  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      const user = await auth.signInWithGoogle();
      setIsLoading(false);
      onSuccess(user);
    } catch (err: any) {
      setIsLoading(false);
      setFormError(err.message || 'Google sign-in could not be completed.');
    }
  };

  // Forgot Password Submit
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!email) {
      setEmailError('Please enter your work email.');
      return;
    }

    setIsLoading(true);
    try {
      await auth.sendPasswordReset(email);
      setIsLoading(false);
      setVerificationSource('forgot');
      setVerificationEmail(email);
      setResendCooldown(30);
      setView('verify_email');
    } catch (err: any) {
      setIsLoading(false);
      setFormError(err.message || 'Could not send reset instructions.');
    }
  };

  // Confirm Verification and complete sign in
  const handleConfirmVerification = async () => {
    setIsLoading(true);
    try {
      const verifiedUser = await auth.completeVerification(name, verificationEmail);
      setIsLoading(false);
      onSuccess(verifiedUser);
    } catch {
      setIsLoading(false);
      setFormError('Could not verify email link.');
    }
  };

  // Reset Password Submit
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (newPassword.length < 10) {
      setFormError('That password is too short. Use at least 10 characters.');
      return;
    }

    setIsLoading(true);
    try {
      await auth.resetPassword(verificationEmail, newPassword);
      setIsLoading(false);
      setView('reset_success');
    } catch (err: any) {
      setIsLoading(false);
      setFormError(err.message || 'Could not update password.');
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center py-6 animate-in fade-in duration-300">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        {/* LEFT COLUMN: Small glass brand visual + one line copy (hidden on mobile) */}
        <div className="hidden md:flex md:col-span-5 flex-col justify-between p-8 rounded-[20px] border border-[var(--border-color)] h-full min-h-[440px] relative overflow-hidden"
          style={{ backgroundColor: 'var(--surface-color)' }}
        >
          {/* Subtle glowing ribbon */}
          <div
            className="absolute -top-10 -left-10 w-44 h-44 rounded-full blur-3xl opacity-50"
            style={{ background: 'var(--scrollbar-thumb)' }}
          />

          <div className="space-y-4 relative z-10">
            <span className="font-serif-title text-3xl text-[var(--text-main)]">
              TwinStudio
            </span>
            <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
              Human-looking creator library and private AI twin synthesis for growth teams.
            </p>
          </div>

          <div className="relative z-10 space-y-3 pt-6 border-t border-[var(--border-color)] text-xs text-[var(--text-muted)]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[var(--status-success)]" />
              <span>Biometric consent enforced</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-[var(--border-focus)]" />
              <span>Workspace data encrypted</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Form Card with Tabs "Sign in | Create account" */}
        <div
          className="md:col-span-7 p-6 sm:p-8 rounded-[20px] border border-[var(--border-color)] shadow-xl relative"
          style={{ backgroundColor: 'var(--surface-color)' }}
        >
          {/* Close/Cancel button */}
          <button
            type="button"
            onClick={onCancel}
            className="absolute top-5 right-5 text-xs text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            Cancel
          </button>

          {/* VIEW: SIGN IN or CREATE ACCOUNT */}
          {(view === 'signin' || view === 'signup') && (
            <div className="space-y-6">
              {/* Tabs: Sign in | Create account */}
              <div className="flex items-center gap-2 p-1 bg-[var(--surface-elevated)] rounded-full border border-[var(--border-color)] w-full max-w-[280px]">
                <button
                  type="button"
                  onClick={() => {
                    setView('signin');
                    setFormError(null);
                  }}
                  className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all ${
                    view === 'signin'
                      ? 'bg-[var(--surface-color)] text-[var(--text-main)] font-semibold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Sign in
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setView('signup');
                    setFormError(null);
                  }}
                  className={`flex-1 py-1.5 rounded-full text-xs font-medium transition-all ${
                    view === 'signup'
                      ? 'bg-[var(--surface-color)] text-[var(--text-main)] font-semibold shadow-xs'
                      : 'text-[var(--text-muted)] hover:text-[var(--text-main)]'
                  }`}
                >
                  Create account
                </button>
              </div>

              {/* Form Error Banner */}
              {formError && (
                <div
                  role="alert"
                  aria-live="assertive"
                  className="p-3 rounded-[12px] bg-[var(--surface-elevated)] border border-[var(--status-error)] flex items-start gap-2.5 text-xs text-[var(--text-main)]"
                >
                  <AlertCircle className="w-4 h-4 text-[var(--status-error)] shrink-0 mt-0.5" />
                  <p className="leading-snug">{formError}</p>
                </div>
              )}

              {/* Google Button */}
              <button
                type="button"
                onClick={handleGoogleAuth}
                disabled={isLoading}
                className="w-full h-11 border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] text-[var(--text-main)] font-medium text-xs rounded-[12px] flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3.05h3.9c2.28-2.1 3.64-5.2 3.64-9.15z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.9-3.05c-1.08.72-2.45 1.16-4.03 1.16-3.1 0-5.74-2.1-6.68-4.93H1.26v3.15C3.24 21.36 7.32 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.32 14.27c-.24-.72-.38-1.49-.38-2.27s.14-1.55.38-2.27V6.58H1.26C.46 8.17 0 10.03 0 12s.46 3.83 1.26 5.42l4.06-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.32 0 3.24 2.64 1.26 6.58l4.06 3.15c.94-2.83 3.58-4.98 6.68-4.98z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>

              <div className="flex items-center gap-3 text-xs text-[var(--text-muted)]">
                <div className="flex-1 h-px bg-[var(--border-color)]" />
                <span>or</span>
                <div className="flex-1 h-px bg-[var(--border-color)]" />
              </div>

              {/* Form Body */}
              <form onSubmit={view === 'signin' ? handleSignIn : handleSignUp} className="space-y-4">
                {view === 'signup' && (
                  <div>
                    <label htmlFor="auth-name-field" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                      Your name *
                    </label>
                    <input
                      id="auth-name-field"
                      type="text"
                      autoComplete="name"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      onBlur={handleBlurName}
                      placeholder="e.g. Jordan Smith"
                      className="w-full h-11 px-3.5 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-xs text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                    />
                    {nameError && (
                      <p className="text-[11px] text-[var(--status-error)] mt-1">{nameError}</p>
                    )}
                  </div>
                )}

                <div>
                  <label htmlFor="auth-email-field" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Work email *
                  </label>
                  <input
                    id="auth-email-field"
                    ref={emailInputRef}
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleBlurEmail}
                    placeholder="name@company.com"
                    className="w-full h-11 px-3.5 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-xs text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                  />
                  {emailError && (
                    <p className="text-[11px] text-[var(--status-error)] mt-1">{emailError}</p>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label htmlFor="auth-password-field" className="block text-xs font-medium text-[var(--text-secondary)]">
                      Password *
                    </label>
                    {view === 'signin' && (
                      <button
                        type="button"
                        onClick={() => {
                          setView('forgot');
                          setFormError(null);
                        }}
                        className="text-xs text-[var(--border-focus)] hover:underline"
                      >
                        Forgot password?
                      </button>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      id="auth-password-field"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete={view === 'signin' ? 'current-password' : 'new-password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => setPasswordFocused(true)}
                      onBlur={() => {
                        setPasswordFocused(false);
                        handleBlurPassword();
                      }}
                      placeholder="••••••••••"
                      className="w-full h-11 pl-3.5 pr-10 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-xs text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      className="absolute right-3 top-3 text-[var(--text-muted)] hover:text-[var(--text-main)]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-[11px] text-[var(--status-error)] mt-1">{passwordError}</p>
                  )}

                  {/* Password Strength Meter & Rules (shown only on focus/typing during signup) */}
                  {view === 'signup' && (passwordFocused || password.length > 0) && (
                    <div className="mt-2 space-y-1.5 p-2.5 rounded-[12px] bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[11px] text-[var(--text-secondary)] animate-in fade-in duration-150">
                      <div className="flex items-center justify-between">
                        <span>Strength: <strong>{signupStrength.label}</strong></span>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4].map((bar) => (
                            <div
                              key={bar}
                              className={`w-6 h-1 rounded-full ${
                                bar <= signupStrength.score
                                  ? signupStrength.score <= 2
                                    ? 'bg-[#E0A24A]'
                                    : 'bg-[#5FB57A]'
                                  : 'bg-[var(--border-color)]'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-1 text-[10px] pt-1">
                        <span className={signupStrength.hasMinLength ? 'text-[#5FB57A]' : 'text-[var(--text-muted)]'}>
                          ✓ 10+ characters
                        </span>
                        <span className={signupStrength.hasNumber ? 'text-[#5FB57A]' : 'text-[var(--text-muted)]'}>
                          ✓ Includes number
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Remember Me / Terms checkbox */}
                {view === 'signin' ? (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      id="remember-me-checkbox"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded text-[var(--border-focus)] border-[var(--border-color)]"
                    />
                    <label htmlFor="remember-me-checkbox" className="text-xs text-[var(--text-secondary)] cursor-pointer">
                      Remember this browser
                    </label>
                  </div>
                ) : (
                  <div className="flex items-start gap-2 pt-1">
                    <input
                      id="terms-checkbox"
                      type="checkbox"
                      required
                      checked={acceptTerms}
                      onChange={(e) => setAcceptTerms(e.target.checked)}
                      className="w-4 h-4 rounded text-[var(--border-focus)] border-[var(--border-color)] mt-0.5"
                    />
                    <label htmlFor="terms-checkbox" className="text-xs text-[var(--text-secondary)] cursor-pointer leading-tight">
                      I agree to the Terms of Service and biometric consent policy.
                    </label>
                  </div>
                )}

                {/* Submit button */}
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-11 font-semibold text-xs rounded-[12px] flex items-center justify-center gap-2 active:scale-[0.98] transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                    style={{
                      background: 'var(--scrollbar-thumb)',
                      color: 'var(--accent-text)',
                    }}
                  >
                    {isLoading ? (
                      <span>Validating credentials…</span>
                    ) : (
                      <>
                        <span>{view === 'signin' ? 'Sign in to workspace' : 'Create account'}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>

              {/* Footer switch */}
              <div className="text-center text-xs text-[var(--text-muted)] pt-2">
                {view === 'signin' ? (
                  <p>
                    New here?{' '}
                    <button
                      type="button"
                      onClick={() => setView('signup')}
                      className="text-[var(--border-focus)] hover:underline font-semibold"
                    >
                      Create account
                    </button>
                  </p>
                ) : (
                  <p>
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setView('signin')}
                      className="text-[var(--border-focus)] hover:underline font-semibold"
                    >
                      Sign in
                    </button>
                  </p>
                )}
              </div>
            </div>
          )}

          {/* VIEW: FORGOT PASSWORD */}
          {view === 'forgot' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-semibold text-[var(--text-main)]">
                  Reset your password
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Enter your email address and we will send you a reset link.
                </p>
              </div>

              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div>
                  <label htmlFor="forgot-email" className="block text-xs font-medium text-[var(--text-secondary)] mb-1">
                    Work email
                  </label>
                  <input
                    id="forgot-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full h-11 px-3.5 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-xs text-[var(--text-main)]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 font-semibold text-xs rounded-[12px] flex items-center justify-center gap-1.5"
                  style={{
                    background: 'var(--scrollbar-thumb)',
                    color: 'var(--accent-text)',
                  }}
                >
                  {isLoading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => setView('signin')}
                  className="text-xs text-[var(--border-focus)] hover:underline font-semibold"
                >
                  Back to sign in
                </button>
              </div>
            </div>
          )}

          {/* VIEW: EMAIL VERIFICATION STATE */}
          {view === 'verify_email' && (
            <div className="text-center space-y-4 py-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-[var(--surface-elevated)] text-[var(--border-focus)] flex items-center justify-center mx-auto">
                <Mail className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-[var(--text-main)]">
                  {verificationSource === 'signup' ? 'Verify your email' : 'Check your inbox'}
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  We sent a link to <strong>{verificationEmail}</strong>.
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  type="button"
                  disabled={resendCooldown > 0}
                  onClick={() => setResendCooldown(30)}
                  className="h-10 px-4 border border-[var(--border-color)] rounded-[12px] text-xs text-[var(--text-main)] hover:bg-[var(--surface-elevated)] disabled:opacity-50"
                >
                  {resendCooldown > 0 ? `Resend link (${resendCooldown}s)` : 'Resend link'}
                </button>

                {verificationSource === 'signup' ? (
                  <button
                    type="button"
                    onClick={handleConfirmVerification}
                    disabled={isLoading}
                    className="h-10 px-4 font-semibold text-xs rounded-[12px] flex items-center justify-center gap-1.5 shadow-sm active:scale-95"
                    style={{
                      background: 'var(--scrollbar-thumb)',
                      color: 'var(--accent-text)',
                    }}
                  >
                    <span>{isLoading ? 'Verifying…' : 'Confirm email & open studio'}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setView('reset_password')}
                    className="h-10 px-4 font-semibold text-xs rounded-[12px]"
                    style={{
                      background: 'var(--scrollbar-thumb)',
                      color: 'var(--accent-text)',
                    }}
                  >
                    Continue to new password
                  </button>
                )}
              </div>

              <div className="pt-3">
                <button
                  type="button"
                  onClick={() => {
                    if (verificationSource === 'signup') {
                      setView('signup');
                    } else {
                      setView('signin');
                    }
                  }}
                  className="text-xs text-[var(--border-focus)] hover:underline"
                >
                  Change email
                </button>
              </div>
            </div>
          )}

          {/* VIEW: RESET PASSWORD FORM */}
          {view === 'reset_password' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div>
                <h3 className="text-base font-semibold text-[var(--text-main)]">
                  Set new password
                </h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1">
                  Choose a password with at least 10 characters.
                </p>
              </div>

              {formError && (
                <div className="p-3 rounded-[12px] bg-[var(--surface-elevated)] border border-[var(--status-error)] text-xs text-[var(--status-error)]">
                  {formError}
                </div>
              )}

              <form onSubmit={handleResetPassword} className="space-y-4">
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={() => setNewPasswordFocused(true)}
                    onBlur={() => setNewPasswordFocused(false)}
                    placeholder="New password (10+ chars)"
                    className="w-full h-11 pl-3.5 pr-10 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-xs text-[var(--text-main)]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-3 text-[var(--text-muted)]"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Strength meter */}
                {(newPasswordFocused || newPassword.length > 0) && (
                  <div className="p-2.5 rounded-[12px] bg-[var(--surface-elevated)] text-[11px] text-[var(--text-secondary)] space-y-1">
                    <div className="flex justify-between">
                      <span>Strength: {resetStrength.label}</span>
                      <span>{newPassword.length}/10 chars</span>
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-11 font-semibold text-xs rounded-[12px]"
                  style={{
                    background: 'var(--scrollbar-thumb)',
                    color: 'var(--accent-text)',
                  }}
                >
                  {isLoading ? 'Updating…' : 'Update password & sign in'}
                </button>
              </form>
            </div>
          )}

          {/* VIEW: RESET SUCCESS */}
          {view === 'reset_success' && (
            <div className="text-center space-y-4 py-4 animate-in fade-in duration-200">
              <div className="w-12 h-12 rounded-full bg-[#5FB57A]/15 text-[#5FB57A] flex items-center justify-center mx-auto">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-[var(--text-main)]">
                Password updated
              </h3>
              <p className="text-xs text-[var(--text-secondary)]">
                Your password has been changed successfully. You can now sign in.
              </p>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => setView('signin')}
                  className="h-11 px-8 font-semibold text-xs rounded-[12px]"
                  style={{
                    background: 'var(--scrollbar-thumb)',
                    color: 'var(--accent-text)',
                  }}
                >
                  Back to sign in
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
