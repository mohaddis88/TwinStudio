import React from 'react';
import { useOverlayScrollbar } from '../../hooks/useOverlayScrollbar';

/**
 * Full-page floating auto-hide overlay scrollbar thumb.
 * Fixed at right 2px, width 6px, rounded-full, accent gradient.
 * Transitions with 150ms fade-in, 300ms fade-out after ~800ms idle.
 */
export const PageOverlayScrollbar: React.FC = () => {
  const { thumbHeight, thumbTop, isVisible, isScrollable, isCoarse } = useOverlayScrollbar();

  if (!isScrollable || isCoarse) return null;

  return (
    <div
      aria-hidden="true"
      className="fixed right-[2px] w-[6px] rounded-full pointer-events-none z-[9999]"
      style={{
        top: `${thumbTop}px`,
        height: `${thumbHeight}px`,
        background: 'var(--scrollbar-thumb)',
        opacity: isVisible ? 1 : 0,
        transition: isVisible
          ? 'opacity 150ms ease-out, top 50ms linear'
          : 'opacity 300ms ease-in',
      }}
    />
  );
};

/**
 * Container-level floating auto-hide overlay scrollbar thumb for modals & drawers.
 */
export const ContainerOverlayScrollbar: React.FC<{
  containerRef: React.RefObject<HTMLElement | null>;
  className?: string;
}> = ({ containerRef, className = '' }) => {
  const { thumbHeight, thumbTop, isVisible, isScrollable, isCoarse } =
    useOverlayScrollbar(containerRef);

  if (!isScrollable || isCoarse) return null;

  return (
    <div
      aria-hidden="true"
      className={`absolute right-[2px] w-[6px] rounded-full pointer-events-none z-50 ${className}`}
      style={{
        top: `${thumbTop}px`,
        height: `${thumbHeight}px`,
        background: 'var(--scrollbar-thumb)',
        opacity: isVisible ? 1 : 0,
        transition: isVisible
          ? 'opacity 150ms ease-out, top 50ms linear'
          : 'opacity 300ms ease-in',
      }}
    />
  );
};
