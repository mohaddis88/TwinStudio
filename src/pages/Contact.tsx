import React, { useState } from 'react';
import { PageId, ThemeMode } from '../types';
import { useCmsContent } from '../lib/cmsStore';
import { ParticleAvatarCanvas } from '../components/ParticleAvatarCanvas';

interface ContactProps {
  onToast?: (msg: string, type?: 'success' | 'warning' | 'error') => void;
  onNavigate?: (page: PageId) => void;
  theme?: ThemeMode;
}

export const Contact: React.FC<ContactProps> = ({ onToast, theme = 'light' }) => {
  const [content] = useCmsContent();
  const contact = content.contact;

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      onToast?.('Please fill in your name and email.', 'warning');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      onToast?.('Inquiry submitted. Our team will reach out within 24 hours.', 'success');
    }, 700);
  };

  return (
    <div className="w-full min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-500 relative overflow-hidden pt-28 pb-20 px-4 sm:px-6 md:px-8">
      {/* Ambient background lines behind header */}
      <div className="absolute top-0 left-0 right-0 h-96 overflow-hidden pointer-events-none z-0 opacity-40">
        <ParticleAvatarCanvas variant="lines-only" theme={theme} />
      </div>

      <div className="relative z-10 max-w-[960px] mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 max-w-2xl">
          <div className="eyebrow">{contact.eyebrow}</div>
          <h1
            className="tracking-[-0.04em] leading-[0.98] font-medium text-[var(--text)] m-0"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: 'clamp(36px, 4.5vw, 64px)',
            }}
          >
            {contact.titleSans}
            <span className="serif">{contact.titleItalic}</span>
          </h1>
          <p className="text-[var(--text-secondary)] text-[17px] leading-[1.6] max-w-xl m-0">
            {contact.description}
          </p>
        </div>

        {/* Contact Form & Info Grid in Liquid Glass */}
        <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] gap-8 items-start">
          {/* Form Panel */}
          <div
            className="rounded-[24px] p-7 sm:p-9 space-y-5 shadow-sm"
            style={{
              background: 'var(--glass-surface)',
              backdropFilter: 'blur(24px) saturate(140%)',
              WebkitBackdropFilter: 'blur(24px) saturate(140%)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
            }}
          >
            {submitted ? (
              <div className="text-center py-10 space-y-3">
                <div className="w-14 h-14 rounded-full bg-[var(--status-success)]/15 text-[var(--status-success)] flex items-center justify-center mx-auto text-xl font-bold">
                  ✓
                </div>
                <h3 className="text-xl font-semibold text-[var(--text)] m-0">Inquiry Received</h3>
                <p className="text-sm text-[var(--text-secondary)] max-w-xs mx-auto leading-relaxed">
                  Thank you for reaching out. A team member will get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[15px] font-semibold text-[var(--text)]">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[15px] font-semibold text-[var(--text)]">
                    Work Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-12 px-4 rounded-[12px] border border-[var(--border)] bg-[var(--bg)] text-sm text-[var(--text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[15px] font-semibold text-[var(--text)]">
                    Project Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your brand, video volume, and target creators…"
                    className="w-full p-4 rounded-[12px] border border-[var(--border)] bg-[var(--bg)] text-sm leading-relaxed text-[var(--text)] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[var(--primary)] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-12 rounded-full bg-[var(--text)] text-[var(--bg)] text-sm font-medium cursor-pointer hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  {isSubmitting ? 'Sending…' : 'Send Message'}
                </button>
              </form>
            )}
          </div>

          {/* Direct Details in Liquid Glass */}
          <div
            className="rounded-[24px] p-7 sm:p-9 space-y-6 text-sm text-[var(--text-secondary)] shadow-sm"
            style={{
              background: 'var(--glass-surface)',
              backdropFilter: 'blur(24px) saturate(140%)',
              WebkitBackdropFilter: 'blur(24px) saturate(140%)',
              border: '1px solid var(--glass-border)',
              boxShadow: 'var(--glass-shadow)',
            }}
          >
            <div>
              <span className="text-[13px] uppercase tracking-wider text-[var(--text-muted)] font-medium block mb-1">
                Studio Email
              </span>
              <a
                href={`mailto:${contact.email}`}
                className="text-base font-semibold text-[var(--text)] hover:underline"
              >
                {contact.email}
              </a>
            </div>

            <div>
              <span className="text-[13px] uppercase tracking-wider text-[var(--text-muted)] font-medium block mb-1">
                Phone Support
              </span>
              <span className="text-base font-semibold text-[var(--text)]">{contact.phone}</span>
            </div>

            <div>
              <span className="text-[13px] uppercase tracking-wider text-[var(--text-muted)] font-medium block mb-1">
                Location
              </span>
              <span className="text-sm leading-relaxed block">{contact.address}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
