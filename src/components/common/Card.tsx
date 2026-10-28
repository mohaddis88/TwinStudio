import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'sunken' | 'danger' | 'bordered';
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  variant = 'default',
  children,
  className = '',
  ...props
}) => {
  let variantClass = 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text)]';
  if (variant === 'elevated') {
    variantClass = 'bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] shadow-[var(--elev-2)]';
  } else if (variant === 'sunken') {
    variantClass = 'bg-[var(--bg)] border border-[var(--border)] text-[var(--text)]';
  } else if (variant === 'danger') {
    variantClass = 'bg-[var(--surface)] border border-[var(--status-error)] text-[var(--text)]';
  } else if (variant === 'bordered') {
    variantClass = 'bg-transparent border border-[var(--border)] text-[var(--text)]';
  }

  return (
    <div className={`rounded-[20px] transition-colors duration-180 ${variantClass} ${className}`} {...props}>
      {children}
    </div>
  );
};
