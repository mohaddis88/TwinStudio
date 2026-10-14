import { UserSession } from '../types';

export interface AuthState {
  user: UserSession | null;
  loading: boolean;
  error: string | null;
}

export interface PasswordStrength {
  score: number; // 0 to 4
  label: 'Weak' | 'Fair' | 'Good' | 'Strong';
  hasMinLength: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

const STORAGE_USER_KEY = 'twinstudio_auth_user_v3';
const STORAGE_ATTEMPTS_KEY = 'twinstudio_login_attempts_v3';

export function calculatePasswordStrength(password: string): PasswordStrength {
  const hasMinLength = password.length >= 10;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const hasMixed = /[a-z]/.test(password) && /[A-Z]/.test(password);

  let score = 0;
  if (password.length >= 6) score++;
  if (hasMinLength) score++;
  if (hasNumber && hasMixed) score++;
  if (hasSpecial && hasMinLength) score++;

  let label: PasswordStrength['label'] = 'Weak';
  if (score === 2) label = 'Fair';
  else if (score === 3) label = 'Good';
  else if (score >= 4) label = 'Strong';

  return {
    score,
    label,
    hasMinLength,
    hasNumber,
    hasSpecial,
  };
}

class AuthService {
  private failedAttempts = 0;
  private attemptLockoutUntil: number | null = null;

  constructor() {
    try {
      const stored = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        this.failedAttempts = parsed.count || 0;
        this.attemptLockoutUntil = parsed.lockoutUntil || null;
      }
    } catch {
      // ignore storage errors
    }
  }

  private saveAttempts() {
    try {
      localStorage.setItem(
        STORAGE_ATTEMPTS_KEY,
        JSON.stringify({
          count: this.failedAttempts,
          lockoutUntil: this.attemptLockoutUntil,
        })
      );
    } catch {
      // ignore
    }
  }

  public getCurrentUser(): UserSession | null {
    try {
      const data = localStorage.getItem(STORAGE_USER_KEY);
      if (data) return JSON.parse(data);
    } catch {
      // ignore
    }
    return null;
  }

  public async signIn(email: string, password: string): Promise<UserSession> {
    await new Promise((r) => setTimeout(r, 600));

    // Check lockout
    if (this.attemptLockoutUntil && Date.now() < this.attemptLockoutUntil) {
      const secondsLeft = Math.ceil((this.attemptLockoutUntil - Date.now()) / 1000);
      throw new Error(`Too many failed attempts. Please wait ${secondsLeft} seconds before trying again.`);
    }

    // Attempt simulation: reject if password is "wrong" or less than 6 chars
    if (password === 'wrong' || password.length < 6) {
      this.failedAttempts++;
      if (this.failedAttempts >= 5) {
        this.attemptLockoutUntil = Date.now() + 60000; // 1 min lockout
        this.saveAttempts();
        throw new Error('Too many failed attempts. Your account is temporarily locked for 60 seconds.');
      }
      this.saveAttempts();
      throw new Error('Invalid email or password. Please verify your credentials and try again.');
    }

    // Success: reset attempts
    this.failedAttempts = 0;
    this.attemptLockoutUntil = null;
    this.saveAttempts();

    const username = email.split('@')[0] || 'Marketer';
    const capitalized = username.charAt(0).toUpperCase() + username.slice(1);

    const user: UserSession = {
      id: `usr_${Date.now()}`,
      name: capitalized,
      email,
      role: 'Growth Marketing Lead',
      company: 'Workspace Brands',
    };

    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  }

  public async signUp(name: string, email: string, _password: string): Promise<{ pendingVerification: boolean; email: string }> {
    await new Promise((r) => setTimeout(r, 700));

    // Returns pending verification state
    return {
      pendingVerification: true,
      email,
    };
  }

  public async completeVerification(name: string, email: string): Promise<UserSession> {
    await new Promise((r) => setTimeout(r, 400));
    const user: UserSession = {
      id: `usr_${Date.now()}`,
      name: name.trim() || 'Marketing Creator',
      email,
      role: 'Growth Marketer',
      company: 'Workspace Brands',
    };
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  }

  public async sendPasswordReset(email: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 500));
    return true;
  }

  public async resetPassword(_email: string, _newPass: string): Promise<boolean> {
    await new Promise((r) => setTimeout(r, 600));
    return true;
  }

  public async signInWithGoogle(): Promise<UserSession> {
    await new Promise((r) => setTimeout(r, 750));
    const user: UserSession = {
      id: `usr_google_${Date.now()}`,
      name: 'Google User',
      email: 'creator@gmail.com',
      role: 'Growth Lead',
      company: 'Google Account',
    };
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    return user;
  }

  public signOut(): void {
    localStorage.removeItem(STORAGE_USER_KEY);
  }
}

export const auth = new AuthService();
