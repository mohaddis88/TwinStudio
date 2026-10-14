import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'record';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  disabled,
  style,
  ...props
}) => {
  const sizeClass =
    size === 'sm'
      ? 'h-9 px-3.5 text-xs rounded-[10px]'
      : size === 'lg'
      ? 'h-12 px-8 text-xs font-semibold rounded-[12px]'
      : 'h-11 px-6 text-xs font-semibold rounded-[12px]';

  let variantClass = '';
  let customStyle: React.CSSProperties = { ...style };

  if (variant === 'primary') {
    customStyle = {
      background: 'var(--scrollbar-thumb)',
      color: 'var(--accent-text)',
      ...style,
    };
    variantClass =
      'active:scale-[0.98] transition-all disabled:opacity-50 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]';
  } else if (variant === 'secondary') {
    variantClass =
      'border border-[var(--border-color)] bg-[var(--surface-color)] hover:bg-[var(--surface-elevated)] text-[var(--text-main)] active:scale-[0.98] transition-all disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]';
  } else if (variant === 'ghost') {
    variantClass =
      'text-[var(--text-secondary)] hover:text-[var(--text-main)] hover:bg-[var(--surface-elevated)] active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]';
  } else if (variant === 'danger') {
    variantClass =
      'bg-[var(--status-error)] text-white hover:opacity-90 active:scale-[0.98] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--status-error)]';
  } else if (variant === 'record') {
    variantClass =
      'w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)]';
  }

  return (
    <button
      disabled={disabled}
      style={customStyle}
      className={`inline-flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed ${variantClass} ${
        variant !== 'record' ? sizeClass : ''
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
