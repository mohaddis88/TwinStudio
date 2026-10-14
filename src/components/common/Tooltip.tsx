import React, { useState, useRef, useEffect, useId } from 'react';
import { Info } from 'lucide-react';

interface TooltipProps {
  content: string;
  label?: string;
  position?: 'top' | 'bottom' | 'right' | 'left';
  icon?: React.ReactNode;
  triggerClassName?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  label = 'More information',
  position = 'top',
  icon,
  triggerClassName,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  }[position];

  return (
    <div className="relative inline-flex items-center" ref={containerRef}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={isOpen ? tooltipId : undefined}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        onMouseEnter={() => setIsOpen(true)}
        onMouseLeave={() => setIsOpen(false)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setIsOpen(false)}
        className={
          triggerClassName ||
          'w-5 h-5 rounded-full inline-flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--text-main)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-focus)] transition-colors'
        }
      >
        {icon || <Info className="w-3.5 h-3.5" aria-hidden="true" />}
      </button>

      {isOpen && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`absolute ${positionClasses} z-50 w-64 p-3 text-xs leading-relaxed border rounded-[12px] shadow-2xl backdrop-blur-md pointer-events-auto transition-all`}
          style={{
            backgroundColor: 'var(--surface-color)',
            borderColor: 'var(--border-color)',
            color: 'var(--text-main)',
          }}
        >
          <div className="font-normal text-[var(--text-secondary)]">{content}</div>
        </div>
      )}
    </div>
  );
};
