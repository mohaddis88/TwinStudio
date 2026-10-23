import React, { useEffect, useRef, useState } from 'react';

export interface ParticleTextHeadingProps {
  as?: 'h1' | 'h2' | 'h3';
  className?: string;
  style?: React.CSSProperties;
  line1?: string;
  line2Prefix?: string;
  line2Accent?: string;
}

export const ParticleTextHeading: React.FC<ParticleTextHeadingProps> = ({
  as: Component = 'h2',
  className = '',
  style = {},
  line1 = 'We give shape to',
  line2Prefix = 'what is still ',
  line2Accent = 'in motion.',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const textEl = textRef.current;
    const canvas = canvasRef.current;
    if (!container || !textEl || !canvas) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      textEl.style.opacity = '1';
      canvas.style.display = 'none';
      return;
    }

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    interface StippleDot {
      targetX: number;
      targetY: number;
      startX: number;
      startY: number;
      size: number;
      alpha: number;
    }

    let dots: StippleDot[] = [];
    let canvasW = 0;
    let canvasH = 0;
    let pad = 40;
    let textColor = '#151514';

    // Pseudo-random deterministic generator based on index
    const pseudoRand = (seed: number) => {
      const x = Math.sin(seed) * 10000;
      return x - Math.floor(x);
    };

    const sampleText = () => {
      const rect = container.getBoundingClientRect();
      pad = Math.min(80, Math.max(30, rect.width * 0.08));
      canvasW = Math.ceil(rect.width + pad * 2);
      canvasH = Math.ceil(rect.height + pad * 2);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(canvasW * dpr);
      canvas.height = Math.round(canvasH * dpr);
      canvas.style.width = `${canvasW}px`;
      canvas.style.height = `${canvasH}px`;
      canvas.style.left = `${-pad}px`;
      canvas.style.top = `${-pad}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Render to offscreen canvas
      const offscreen = document.createElement('canvas');
      offscreen.width = canvasW;
      offscreen.height = canvasH;
      const offCtx = offscreen.getContext('2d', { willReadFrequently: true });
      if (!offCtx) return;

      const spans = textEl.querySelectorAll<HTMLSpanElement>('[data-w]');
      spans.forEach((span) => {
        const sRect = span.getBoundingClientRect();
        const style = getComputedStyle(span);
        offCtx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        offCtx.textBaseline = 'alphabetic';
        offCtx.fillStyle = '#000000';

        const metrics = offCtx.measureText(span.textContent || '');
        const ascent = metrics.fontBoundingBoxAscent ?? parseFloat(style.fontSize) * 0.8;
        const descent = metrics.fontBoundingBoxDescent ?? parseFloat(style.fontSize) * 0.2;
        const totalHeight = sRect.height;
        const baselineY =
          sRect.top - rect.top + pad + (totalHeight - (ascent + descent)) / 2 + ascent;
        const measuredW = metrics.width || 1;
        const scaleX = sRect.width / measuredW;

        offCtx.save();
        offCtx.translate(sRect.left - rect.left + pad, baselineY);
        offCtx.scale(scaleX, 1);
        offCtx.fillText(span.textContent || '', 0, 0);
        offCtx.restore();
      });

      const imgData = offCtx.getImageData(0, 0, canvasW, canvasH).data;
      // 3px sampling grid
      const gridStep = 3;
      const newDots: StippleDot[] = [];

      for (let y = 0; y < canvasH; y += gridStep) {
        for (let x = 0; x < canvasW; x += gridStep) {
          const idx = (y * canvasW + x) * 4;
          const alpha = imgData[idx + 3];
          if (alpha > 110) {
            const seed = newDots.length + 1;
            const r1 = pseudoRand(seed * 17.3);
            const r2 = pseudoRand(seed * 43.7);
            const r3 = pseudoRand(seed * 71.1);

            // Scattered offset: startX = targetX + (rand - 0.5) * 48
            const offsetX = (r1 - 0.5) * 48;
            const offsetY = (r2 - 0.5) * 48;

            newDots.push({
              targetX: x,
              targetY: y,
              startX: x + offsetX,
              startY: y + offsetY,
              size: r3 < 0.25 ? 2.4 : 1.9,
              alpha: Math.min(1, (alpha / 255) * 0.95),
            });
          }
        }
      }

      dots = newDots;
      textColor =
        getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || '#151514';
      draw(scrollProgress);
    };

    const draw = (prog: number) => {
      ctx.clearRect(0, 0, canvasW, canvasH);

      // Seamless cross-fade to DOM text from progress 0.80 to 1.0
      const textOpacity = Math.min(1, Math.max(0, (prog - 0.80) / 0.18));
      const canvasOpacity = Math.min(1, Math.max(0, 1 - (prog - 0.80) / 0.16));

      textEl.style.opacity = String(textOpacity);
      canvas.style.opacity = String(canvasOpacity);

      if (prog >= 0.98) return;

      ctx.fillStyle = textColor;
      const count = dots.length;

      // Ease out cubic
      const ease = 1 - Math.pow(1 - Math.min(1, prog / 0.85), 3);

      for (let i = 0; i < count; i++) {
        const d = dots[i];
        const curX = d.startX + (d.targetX - d.startX) * ease;
        const curY = d.startY + (d.targetY - d.startY) * ease;

        ctx.globalAlpha = d.alpha;
        ctx.fillRect(curX, curY, d.size, d.size);
      }
      ctx.globalAlpha = 1;
    };

    const handleScroll = () => {
      const rect = container.getBoundingClientRect();
      const vh = window.innerHeight;

      // Bind directly to window scroll:
      // 15% viewport entry (rect.top <= vh * 0.85) -> progress = 0
      // 60% viewport center (rect.top <= vh * 0.40) -> progress = 1
      const start = vh * 0.85;
      const end = vh * 0.40;
      const current = rect.top;

      let p = 0;
      if (current <= end) {
        p = 1;
      } else if (current >= start) {
        p = 0;
      } else {
        p = (start - current) / (start - end);
      }

      setScrollProgress(p);
      draw(p);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        sampleText();
        handleScroll();
      });
    } else {
      sampleText();
      handleScroll();
    }

    const ro = new ResizeObserver(() => {
      sampleText();
      handleScroll();
    });
    ro.observe(container);

    const mo = new MutationObserver(() => {
      textColor =
        getComputedStyle(document.documentElement).getPropertyValue('--text').trim() || textColor;
      draw(scrollProgress);
    });
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute pointer-events-none z-10"
      />
      {/* Crisp DOM element for 100% solid, accessible, selectable text */}
      <Component
        ref={textRef as any}
        className={`relative ${className}`}
        style={{ opacity: 0, ...style }}
      >
        <span className="block whitespace-normal sm:whitespace-nowrap">
          {line1.split(' ').map((word, idx) => (
            <React.Fragment key={idx}>
              <span data-w="true">{word}</span>{' '}
            </React.Fragment>
          ))}
        </span>
        <span className="block whitespace-normal sm:whitespace-nowrap">
          {line2Prefix.split(' ').map((word, idx) => (
            <React.Fragment key={idx}>
              <span data-w="true">{word}</span>{' '}
            </React.Fragment>
          ))}
          <span data-w="true" className="serif">
            {line2Accent}
          </span>
        </span>
      </Component>
    </div>
  );
};
