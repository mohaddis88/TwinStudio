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
      ? 'h-9 px-3.5 text-xs rounded-full'
      : size === 'lg'
      ? 'h-12 px-7 text-sm font-medium rounded-full'
      : 'h-11 px-5 text-sm font-medium rounded-full';

  let variantClass = '';
  let customStyle: React.CSSProperties = { ...style };

  if (variant === 'primary') {
    customStyle = {
      background: 'var(--btn-primary-bg)',
      color: 'var(--btn-primary-text)',
      ...style,
    };
    variantClass =
      'transition-[background-color,opacity] duration-180 disabled:opacity-50 focus-visible:outline-none';
  } else if (variant === 'secondary') {
    variantClass =
      'border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)] text-[var(--text)] transition-colors duration-180 disabled:opacity-50 focus-visible:outline-none';
  } else if (variant === 'ghost') {
    variantClass =
      'text-[var(--text-secondary)] hover:text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors duration-180 focus-visible:outline-none';
  } else if (variant === 'danger') {
    variantClass =
      'bg-[var(--status-error)] text-white hover:opacity-90 transition-opacity duration-180 focus-visible:outline-none';
  } else if (variant === 'record') {
    variantClass =
      'w-16 h-16 rounded-full flex items-center justify-center transition-colors duration-180 focus-visible:outline-none';
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
