import { useState, useEffect, useRef, useCallback } from 'react';

export interface OverlayScrollbarState {
  thumbHeight: number;
  thumbTop: number;
  isVisible: boolean;
  isScrollable: boolean;
  isCoarse: boolean;
}

/**
 * Reusable hook for auto-hiding overlay scrollbar.
 * Passive scroll listener, requestAnimationFrame-throttled, auto-hides after ~800ms idle.
 * Disabled on touch devices (pointer: coarse).
 * Works for both window (full page) and custom scrollable containers (modals/drawers).
 */
export function useOverlayScrollbar(
  containerRef?: React.RefObject<HTMLElement | null>
): OverlayScrollbarState {
  const [state, setState] = useState<OverlayScrollbarState>({
    thumbHeight: 0,
    thumbTop: 0,
    isVisible: false,
    isScrollable: false,
    isCoarse: false,
  });

  const hideTimerRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  const calculate = useCallback(() => {
    if (typeof window === 'undefined') return;

    // Disabled on touch devices where the OS already auto-hides
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) {
      setState((prev) => (prev.isCoarse ? prev : { ...prev, isCoarse: true, isScrollable: false }));
      return;
    }

    const isWindow = !containerRef || !containerRef.current;
    const target = containerRef?.current;

    const scrollTop = isWindow
      ? window.scrollY || document.documentElement.scrollTop
      : target!.scrollTop;
    const scrollHeight = isWindow
      ? document.documentElement.scrollHeight
      : target!.scrollHeight;
    const clientHeight = isWindow
      ? window.innerHeight
      : target!.clientHeight;

    const maxScroll = scrollHeight - clientHeight;
    const isScrollable = maxScroll > 2 && clientHeight > 0;

    if (!isScrollable) {
      setState({
        thumbHeight: 0,
        thumbTop: 0,
        isVisible: false,
        isScrollable: false,
        isCoarse: false,
      });
      return;
    }

    const minThumbHeight = 28;
    const thumbHeight = Math.max(
      minThumbHeight,
      Math.min(clientHeight, (clientHeight / scrollHeight) * clientHeight)
    );
    const availableTrack = clientHeight - thumbHeight;
    const scrollRatio = maxScroll > 0 ? scrollTop / maxScroll : 0;
    const thumbTop = Math.min(availableTrack, Math.max(0, scrollRatio * availableTrack));

    setState({
      thumbHeight,
      thumbTop,
      isVisible: true,
      isScrollable: true,
      isCoarse: false,
    });

    if (hideTimerRef.current) {
      window.clearTimeout(hideTimerRef.current);
    }

    // 800ms idle timer to fade out
    hideTimerRef.current = window.setTimeout(() => {
      setState((prev) => ({ ...prev, isVisible: false }));
    }, 800);
  }, [containerRef]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const handleScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(calculate);
    };

    const isWindow = !containerRef || !containerRef.current;
    const element = isWindow ? window : containerRef.current;

    element?.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial measurement
    handleScroll();

    // DOM mutation observer for dynamic content height changes
    const observer = new MutationObserver(handleScroll);
    if (isWindow) {
      observer.observe(document.body, { childList: true, subtree: true });
    } else if (containerRef?.current) {
      observer.observe(containerRef.current, { childList: true, subtree: true });
    }

    return () => {
      element?.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      observer.disconnect();
      if (hideTimerRef.current) window.clearTimeout(hideTimerRef.current);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [containerRef, calculate]);

  return state;
}
