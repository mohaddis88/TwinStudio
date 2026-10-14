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
  let variantClass = 'bg-[var(--surface-color)] border border-[var(--border-color)] text-[var(--text-main)]';
  if (variant === 'elevated') {
    variantClass = 'bg-[var(--surface-elevated)] border border-[var(--border-color)] text-[var(--text-main)]';
  } else if (variant === 'sunken') {
    variantClass = 'bg-[var(--bg-color)] border border-[var(--border-color)] text-[var(--text-main)]';
  } else if (variant === 'danger') {
    variantClass = 'bg-[var(--surface-color)] border border-[var(--status-error)] text-[var(--text-main)]';
  } else if (variant === 'bordered') {
    variantClass = 'bg-transparent border border-[var(--border-color)] text-[var(--text-main)]';
  }

  return (
    <div
      className={`rounded-[20px] shadow-sm transition-colors duration-200 ${variantClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
