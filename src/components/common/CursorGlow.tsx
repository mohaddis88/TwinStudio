import { useEffect, useRef, useState } from 'react';

export const CursorGlow = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isEnlarged, setIsEnlarged] = useState(false);

  useEffect(() => {
    // Only for fine pointer and no reduced-motion
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!isFinePointer || isReducedMotion) return;

    const el = glowRef.current;
    if (!el) return;

    const handlePointerMove = (e: PointerEvent) => {
      // Set transform directly: zero lag, no easing, no lerp, no delay
      el.style.transform = `translate3d(${e.clientX - 140}px, ${e.clientY - 140}px, 0)`;

      setIsVisible(true);

      const target = e.target as HTMLElement | null;
      if (target) {
        const interactive = Boolean(
          target.closest('button, a, input, select, textarea, [role="button"], .interactive-card, [tabindex="0"]')
        );
        setIsEnlarged(interactive);
      }
    };

    const handlePointerLeave = () => setIsVisible(false);
    const handlePointerEnter = () => setIsVisible(true);

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    document.addEventListener('pointerenter', handlePointerEnter);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      document.removeEventListener('pointerenter', handlePointerEnter);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      aria-hidden="true"
      className={`fixed top-0 left-0 w-[280px] h-[280px] pointer-events-none z-30 will-change-transform ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        transform: 'translate3d(-400px, -400px, 0)',
        transition: 'opacity 0.2s ease-out',
      }}
    >
      <div
        className={`w-full h-full rounded-full transition-transform duration-200 ease-out ${
          isEnlarged ? 'scale-125' : 'scale-100'
        }`}
        style={{
          background: 'radial-gradient(circle, var(--glow-color) 0%, transparent 70%)',
          mixBlendMode: 'var(--glow-blend)' as any,
        }}
      />
    </div>
  );
};

