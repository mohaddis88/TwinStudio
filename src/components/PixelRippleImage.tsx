import React, { useEffect, useRef, useState } from 'react';
import { MalaysianCreator } from '../lib/mock/models';

interface PixelRippleImageProps {
  creator: MalaysianCreator;
  aspectRatio?: string;
  className?: string;
  badge?: string;
}

export const PixelRippleImage: React.FC<PixelRippleImageProps> = ({
  creator,
  aspectRatio = '3/4',
  className = '',
  badge = 'AI-generated',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // Mouse hover ripple state: ultra-gentle calm water ripple
  const mouseRef = useRef<{
    x: number;
    y: number;
    hoverIntensity: number; // 0 to 1
    targetIntensity: number;
    ripplePhase: number;
    lastMoveTime: number;
  }>({
    x: -9999,
    y: -9999,
    hoverIntensity: 0,
    targetIntensity: 0,
    ripplePhase: 0,
    lastMoveTime: 0,
  });

  const [scrollProg, setScrollProg] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let isLooping = false;
    let sourceCanvas: HTMLCanvasElement | null = null;

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    // -------------------------------------------------------------------------
    // Render Base Image Buffer:
    // If real photo uploaded -> draw photo
    // If no real photo URL -> Clean, flat Facebook-style default person icon
    // -------------------------------------------------------------------------
    const renderCreatorBase = (w: number, h: number): HTMLCanvasElement => {
      const off = document.createElement('canvas');
      off.width = w;
      off.height = h;
      const oCtx = off.getContext('2d');
      if (!oCtx) return off;

      if (creator.photoUrl) {
        // If photo exists, render the photo
        const img = new Image();
        img.src = creator.photoUrl;
        oCtx.drawImage(img, 0, 0, w, h);
        return off;
      }

      // Facebook-Style Flat Default Silhouette:
      // Neutral grey-bone background (#dedad2 in light, #1f1f1d in dark)
      const bgColor = isDark ? '#1f1f1d' : '#dedad2';
      const silhouetteColor = '#9e9b94'; // Muted charcoal

      oCtx.fillStyle = bgColor;
      oCtx.fillRect(0, 0, w, h);

      const cx = w * 0.5;
      const headRadius = Math.min(w, h) * 0.12;
      const headY = h * 0.40;

      // Symmetrical Geometric Circle Head
      oCtx.fillStyle = silhouetteColor;
      oCtx.beginPath();
      oCtx.arc(cx, headY, headRadius, 0, Math.PI * 2);
      oCtx.fill();

      // Rounded Shoulder Arc Silhouette (neatly scaled to ~35% of card width)
      oCtx.beginPath();
      const shoulderTopY = headY + headRadius * 1.4;
      const shoulderWidth = w * 0.40;
      oCtx.moveTo(cx - shoulderWidth * 0.5, h * 0.78);
      oCtx.bezierCurveTo(
        cx - shoulderWidth * 0.5,
        shoulderTopY,
        cx - shoulderWidth * 0.25,
        shoulderTopY,
        cx,
        shoulderTopY
      );
      oCtx.bezierCurveTo(
        cx + shoulderWidth * 0.25,
        shoulderTopY,
        cx + shoulderWidth * 0.5,
        shoulderTopY,
        cx + shoulderWidth * 0.5,
        h * 0.78
      );
      oCtx.closePath();
      oCtx.fill();

      return off;
    };

    // -------------------------------------------------------------------------
    // Render Frame: Pixelation Steps + Calm Water Ripple
    // -------------------------------------------------------------------------
    function drawFrame() {
      if (!sourceCanvas || !canvas || !ctx) return;

      const p = reducedMotion ? 1 : scrollProg;
      const mouse = mouseRef.current;
      const now = performance.now();

      // If mouse stopped moving for > 300ms, gently damp targetIntensity to 0
      if (now - mouse.lastMoveTime > 300) {
        mouse.targetIntensity = 0;
      }

      // Heavy smooth damping 0.96
      mouse.hoverIntensity =
        mouse.hoverIntensity * 0.96 + mouse.targetIntensity * (1 - 0.96);

      // Ultra-slow calm wave speed: 0.03
      if (mouse.hoverIntensity > 0.005) {
        mouse.ripplePhase += 0.03;
      }

      // Clean, crystal-clear 1px rendering at rest (never pixelated blocks when idle)
      const blockSize = 1;

      const cw = canvas.width;
      const ch = canvas.height;

      if (blockSize === 1 && mouse.hoverIntensity <= 0.005) {
        // Direct crystal clear draw at rest
        ctx.drawImage(sourceCanvas, 0, 0, cw, ch, 0, 0, width, height);
      } else if (blockSize > 1) {
        // Mosaic pixelation sampling
        const tempW = Math.max(1, Math.floor(cw / blockSize));
        const tempH = Math.max(1, Math.floor(ch / blockSize));

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = tempW;
        tempCanvas.height = tempH;
        const tCtx = tempCanvas.getContext('2d');
        if (tCtx) {
          tCtx.drawImage(sourceCanvas, 0, 0, tempW, tempH);

          // Draw mosaic blocks
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(tempCanvas, 0, 0, tempW, tempH, 0, 0, width, height);
          ctx.imageSmoothingEnabled = true;

          // Stepped dissolve edges along top and bottom
          ctx.fillStyle = isDark ? '#1f1f1d' : '#dedad2';
          const numDissolve = Math.floor((1 - p) * 45);
          for (let i = 0; i < numDissolve; i++) {
            const rx = Math.floor(Math.random() * (width / blockSize)) * blockSize;
            const isTop = Math.random() < 0.5;
            const ry = isTop
              ? Math.floor(Math.random() * 3) * blockSize
              : height - Math.floor(Math.random() * 3 + 1) * blockSize;
            ctx.fillRect(rx, ry, blockSize, blockSize);
          }
        }
      } else {
        // Calm Water Ripple:
        // Single gentle sine wave ring:
        // amplitude: 1.5px max, wavelength: 90px, speed: 0.03
        ctx.drawImage(sourceCanvas, 0, 0, cw, ch, 0, 0, width, height);

        const mx = mouse.x / dpr;
        const my = mouse.y / dpr;
        const rippleRadius = 130;

        ctx.save();
        ctx.beginPath();
        ctx.arc(mx, my, rippleRadius, 0, Math.PI * 2);
        ctx.clip();

        // Amplitude: 1.5px max, heavy smooth damping
        const amp = 1.5 * mouse.hoverIntensity;
        const shiftX = Math.sin(mouse.ripplePhase) * amp;
        const shiftY = Math.cos(mouse.ripplePhase) * amp;

        ctx.globalAlpha = 0.16 * mouse.hoverIntensity;
        ctx.drawImage(sourceCanvas, shiftX, shiftY, width, height);
        ctx.restore();
      }
    }

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      width = Math.max(10, Math.round(rect.width));
      height = Math.max(10, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      sourceCanvas = renderCreatorBase(canvas.width, canvas.height);
      drawFrame();
    };

    handleResize();
    const ro = new ResizeObserver(() => handleResize());
    ro.observe(container);

    const startLoop = () => {
      if (isLooping) return;
      isLooping = true;
      const step = () => {
        if (!isLooping) return;
        drawFrame();
        const m = mouseRef.current;
        if (m.hoverIntensity > 0.005 || m.targetIntensity > 0) {
          animFrameRef.current = requestAnimationFrame(step);
        } else {
          isLooping = false;
          drawFrame(); // Return to 100% still
        }
      };
      animFrameRef.current = requestAnimationFrame(step);
    };

    // Calm Hover Tracking
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = (e.clientX - rect.left) * dpr;
      mouseRef.current.y = (e.clientY - rect.top) * dpr;
      mouseRef.current.targetIntensity = 1;
      mouseRef.current.lastMoveTime = performance.now();
      startLoop();
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetIntensity = 0;
      startLoop();
    };

    container.addEventListener('mousemove', handleMouseMove, { passive: true });
    container.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;

      const start = vh * 0.95;
      const end = vh * 0.45;
      const current = rect.top;

      let p = 0;
      if (current <= end) {
        p = 1;
      } else if (current >= start) {
        p = 0;
      } else {
        p = (start - current) / (start - end);
      }
      setScrollProg(p);
      drawFrame();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        isVisibleRef.current = entry.isIntersecting && !document.hidden;
      }
    });
    obs.observe(container);

    return () => {
      isLooping = false;
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      obs.disconnect();
      window.removeEventListener('scroll', handleScroll);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [creator, scrollProg]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-[2px] bg-[var(--surface-2)] group cursor-pointer ${className}`}
      style={{ aspectRatio }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="w-full h-full block object-cover transition-transform duration-700 ease-[cubic-bezier(0.2,0.7,0.2,1)] group-hover:scale-[1.02]"
      />

      {/* Subtle corner AI badge */}
      {badge && (
        <div
          className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-[11px] font-medium tracking-wide text-[var(--text)] border border-[var(--border)] select-none pointer-events-none transition-opacity duration-300"
          style={{
            background: 'color-mix(in srgb, var(--bg) 85%, transparent)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
          }}
        >
          {badge}
        </div>
      )}
    </div>
  );
};
