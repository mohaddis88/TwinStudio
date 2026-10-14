import React, { useState } from 'react';
import { ContactInquiry } from '../../types';
import { api } from '../../services/twinStudioApi';
import { Mail, Check, AlertCircle, Send, MessageSquare } from 'lucide-react';

interface ContactPageProps {
  onToast: (msg: string, type?: 'success' | 'warning' | 'error') => void;
}

export const ContactPage: React.FC<ContactPageProps> = ({ onToast }) => {
  const [formData, setFormData] = useState<ContactInquiry>({
    name: '',
    email: '',
    brand: '',
    monthlyVideoGoal: '10–25 videos / month',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMsg('Please complete your name, work email, and message.');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await api.submitContact(formData);
      setIsSubmitting(false);
      setIsSubmitted(true);
      onToast('Message sent! Our marketing team will reply shortly.');
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Something went wrong sending your note. Please try again.');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-12 animate-in fade-in duration-300">
      <div className="text-center space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-[var(--border-focus)]">
          Get in touch
        </span>
        <h1 className="font-sans text-3xl sm:text-5xl font-semibold text-[var(--text-main)]">
          Speak with our <span className="font-serif italic font-normal text-[var(--border-focus)]">team</span>
        </h1>
        <p className="text-sm text-[var(--text-secondary)] max-w-lg mx-auto leading-relaxed">
          Need custom creator likenesses, enterprise workspaces, or high volume API exports? Send us a note.
        </p>
      </div>

      {isSubmitted ? (
        <div
          className="border border-[var(--border-color)] rounded-[20px] p-8 sm:p-12 text-center space-y-4 shadow-sm animate-in zoom-in-95 duration-200"
          style={{ backgroundColor: 'var(--surface-color)' }}
        >
          <div className="w-16 h-16 rounded-full bg-[var(--surface-elevated)] flex items-center justify-center mx-auto text-[var(--status-success)]">
            <Check className="w-8 h-8" />
          </div>
          <h2 className="font-sans text-2xl sm:text-3xl font-semibold text-[var(--text-main)]">
            Message received
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-md mx-auto leading-relaxed">
            Thanks for reaching out, {formData.name}. A creative strategist from our team will email you at <strong>{formData.email}</strong> within one business day.
          </p>
          <div className="pt-4">
            <button
              type="button"
              onClick={() => {
                setIsSubmitted(false);
                setFormData({
                  name: '',
                  email: '',
                  brand: '',
                  monthlyVideoGoal: '10–25 videos / month',
                  message: '',
                });
              }}
              className="h-11 px-6 border border-[var(--border-color)] hover:bg-[var(--surface-elevated)] text-xs font-semibold text-[var(--text-main)] rounded-[12px] transition-colors"
            >
              Send another note
            </button>
          </div>
        </div>
      ) : (
        <div
          className="border border-[var(--border-color)] rounded-[20px] p-6 sm:p-10 shadow-sm space-y-6"
          style={{ backgroundColor: 'var(--surface-color)' }}
        >
          {errorMsg && (
            <div className="bg-[var(--surface-elevated)] border border-[var(--status-error)] rounded-[12px] p-3.5 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[var(--status-error)] shrink-0 mt-0.5" />
              <p className="text-xs text-[var(--text-main)] leading-relaxed">{errorMsg}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-name" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Your name *
                </label>
                <input
                  id="contact-name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Jordan Smith"
                  className="w-full h-11 px-3.5 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                />
              </div>

              <div>
                <label htmlFor="contact-email" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Work email *
                </label>
                <input
                  id="contact-email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="jordan@brand.com"
                  className="w-full h-11 px-3.5 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="contact-brand" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Brand or company name
                </label>
                <input
                  id="contact-brand"
                  type="text"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                  placeholder="e.g. Acme Health"
                  className="w-full h-11 px-3.5 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                />
              </div>

              <div>
                <label htmlFor="contact-volume" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                  Estimated monthly video volume
                </label>
                <select
                  id="contact-volume"
                  value={formData.monthlyVideoGoal}
                  onChange={(e) => setFormData({ ...formData, monthlyVideoGoal: e.target.value })}
                  className="w-full h-11 px-3.5 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-sm text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                >
                  <option value="Under 10 videos / month">Under 10 videos / month</option>
                  <option value="10–25 videos / month">10–25 videos / month</option>
                  <option value="25–100 videos / month">25–100 videos / month</option>
                  <option value="100+ videos / month">100+ videos / month</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-xs font-medium text-[var(--text-secondary)] mb-1.5">
                How can we help? *
              </label>
              <textarea
                id="contact-message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us what video ad formats you want to test or ask about team pricing…"
                className="w-full p-3.5 bg-[var(--surface-elevated)] border border-[var(--border-color)] rounded-[12px] text-sm text-[var(--text-main)] placeholder-[var(--text-muted)] leading-relaxed resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto h-12 px-8 font-semibold text-xs rounded-[12px] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]"
                style={{
                  background: 'var(--scrollbar-thumb)',
                  color: 'var(--accent-text)',
                }}
              >
                {isSubmitting ? (
                  <span>Sending note…</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>Send message</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
