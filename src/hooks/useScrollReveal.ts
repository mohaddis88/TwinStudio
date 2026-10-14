import { useEffect, useRef, useState } from 'react';

/**
 * Shared hook for staggered scroll-reveal (fade + 16px rise, 80ms stagger, IntersectionObserver, once).
 * Automatically respects prefers-reduced-motion.
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(staggerIndex = 0) {
  const ref = useRef<T>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    // If reduced motion is preferred, reveal immediately without animation
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsRevealed(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const style: React.CSSProperties = {
    opacity: isRevealed ? 1 : 0,
    transform: isRevealed ? 'translateY(0)' : 'translateY(16px)',
    transition: `opacity 0.5s ease-out ${staggerIndex * 80}ms, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1) ${staggerIndex * 80}ms`,
    willChange: 'opacity, transform',
  };

  return { ref, isRevealed, style };
}
