import React from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1.5 w-full text-left">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-medium text-[var(--text)]">
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full h-11 px-3.5 bg-[var(--surface)] border ${
            error ? 'border-[var(--status-error)]' : 'border-[var(--border)]'
          } rounded-full text-sm text-[var(--text)] placeholder:text-[var(--text-muted)] focus-visible:outline-none transition-colors duration-180 ${className}`}
          aria-invalid={error ? true : undefined}
          {...props}
        />
        {helperText && !error && (
          <p className="text-[11px] text-[var(--text-muted)]">{helperText}</p>
        )}
        {error && (
          <p className="text-[11px] text-[var(--status-error)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, helperText, error, children, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="space-y-1.5 w-full text-left">
        {label && (
          <label htmlFor={selectId} className="block text-xs font-medium text-[var(--text)]">
            {label}
          </label>
        )}
        <select
          id={selectId}
          ref={ref}
          className={`w-full h-11 px-3.5 bg-[var(--surface)] border ${
            error ? 'border-[var(--status-error)]' : 'border-[var(--border)]'
          } rounded-full text-sm text-[var(--text)] focus-visible:outline-none transition-colors duration-180 ${className}`}
          aria-invalid={error ? true : undefined}
          {...props}
        >
          {children}
        </select>
        {helperText && !error && (
          <p className="text-[11px] text-[var(--text-muted)]">{helperText}</p>
        )}
        {error && (
          <p className="text-[11px] text-[var(--status-error)]" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
