import { useCallback, useRef } from 'react';

/**
 * Shared hook to track pointer position inside an element and set --mx and --my CSS variables.
 * Used for soft highlights that follow the pointer across glass surfaces and cards.
 */
export function usePointerHighlight<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);

  const onPointerMove = useCallback((e: React.PointerEvent<T>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = Math.max(0, Math.min(100, (x / rect.width) * 100));
    const py = Math.max(0, Math.min(100, (y / rect.height) * 100));

    el.style.setProperty('--mx', `${px.toFixed(1)}%`);
    el.style.setProperty('--my', `${py.toFixed(1)}%`);
  }, []);

  return { ref, onPointerMove };
}
