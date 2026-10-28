import React, { useEffect, useRef } from 'react';

export interface ParticleAvatarCanvasProps {
  mode?: 'hero' | 'sphere';
  variant?: 'hero' | 'lines-only';
  imageUrl?: string;
  className?: string;
  theme?: 'light' | 'dark';
}

interface Particle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  homeX: number;
  homeY: number;
  homeZ: number;
  colorIndex: number;
  alpha: number;
  size: number;
  isPearl: boolean;
  isRibbon: boolean;
  ribbonId: number;
  flowSpeed: number;
  seed: number;
}

export const ParticleAvatarCanvas: React.FC<ParticleAvatarCanvasProps> = ({
  mode,
  variant = 'hero',
  imageUrl,
  className = '',
  theme = 'light',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);

  // Mouse interaction state: smoothed pointer with velocity wake (Forma-style)
  const mouseRef = useRef<{
    x: number;
    y: number;
    prevX: number;
    prevY: number;
    targetX: number;
    targetY: number;
    velX: number;
    velY: number;
    presence: number;
    presenceTarget: number;
    active: boolean;
  }>({
    x: -9999,
    y: -9999,
    prevX: -9999,
    prevY: -9999,
    targetX: -9999,
    targetY: -9999,
    velX: 0,
    velY: 0,
    presence: 0,
    presenceTarget: 0,
    active: false,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let particles: Particle[] = [];

    // -------------------------------------------------------------------------
    // CALIBRATED AUTHENTIC PALETTES (Screenshot 2026-10-23 005339.png)
    // Warm, non-harsh, delicately stippled tones
    // -------------------------------------------------------------------------
    const lightPalette = ['#4A3E34', '#7D6045', '#B8A490', '#DECFC0'];
    const darkPalette = ['#655648', '#A8865C', '#CDB088', '#E6DCBA'];

    const getIsDark = () =>
      theme === 'dark' ||
      (typeof document !== 'undefined' &&
        document.documentElement.getAttribute('data-theme') === 'dark');

    // Source image for exact Screenshot 2026-10-23 005339.jpg avatar
    const effectiveImageUrl = imageUrl || '/hero-bust.webp';
    const sourceImg = new Image();
    sourceImg.src = effectiveImageUrl;

    // -------------------------------------------------------------------------
    // PIXEL SAMPLING: Exact Screenshot 2026-10-23 005339.jpg Sculpture
    // Dynamic density scaling: Scales particle count with display area so mobile
    // brightness and spatial density match desktop 1:1 without clustering
    // -------------------------------------------------------------------------
    const sampleBustFromImage = (img: HTMLImageElement): Particle[] => {
      const pts: Particle[] = [];
      if (!img || !img.naturalWidth || !img.naturalHeight) return pts;

      try {
        let maxDisplayW = 880;
        let topMargin = 135;

      if (width < 360) {
        maxDisplayW = Math.min(width * 0.90, 275);
        topMargin = 98;
      } else if (width < 480) {
        maxDisplayW = Math.min(width * 0.90, 350);
        topMargin = 104;
      } else if (width < 768) {
        maxDisplayW = Math.min(width * 0.88, 500);
        topMargin = 114;
      } else if (width < 1024) {
        maxDisplayW = Math.min(width * 0.86, 700);
        topMargin = 126;
      } else {
        maxDisplayW = Math.min(width * 0.86, 920);
        topMargin = 138;
      }

      // Proportional particle sampling resolution: matches desktop spatial density on all screens
      // Lower floor so mobile doesn't oversample and get overly bright
      const targetW = Math.round(Math.max(120, Math.min(540, maxDisplayW * 0.55)));
      const targetH = Math.round(targetW * (img.naturalHeight / img.naturalWidth));

      const off = document.createElement('canvas');
      off.width = targetW;
      off.height = targetH;
      const oCtx = off.getContext('2d', { willReadFrequently: true });
      if (!oCtx) return pts;

      oCtx.drawImage(img, 0, 0, targetW, targetH);
      const imgData = oCtx.getImageData(0, 0, targetW, targetH).data;

      // Find sculpture bounding box
      let minX = targetW;
      let maxX = 0;
      let minY = targetH;
      let maxY = 0;
      for (let y = 0; y < targetH; y++) {
        for (let x = 0; x < targetW; x++) {
          const idx = (y * targetW + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const diff = Math.hypot(r - 234, g - 231, b - 225);
          if (diff > 18) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      const sculptureW = maxX - minX || targetW;
      const sculptureH = maxY - minY || targetH;
      const sculptureCenterX = (minX + maxX) * 0.5;
      const sculptureCenterY = (minY + maxY) * 0.5;

      const headTopOffset = sculptureCenterY - minY;
      const displayScale = maxDisplayW / sculptureW;
      const cy = topMargin + headTopOffset * displayScale;
      const cx = width * 0.50;

      for (let y = 0; y < targetH; y++) {
        for (let x = 0; x < targetW; x++) {
          const idx = (y * targetW + x) * 4;
          const r = imgData[idx];
          const g = imgData[idx + 1];
          const b = imgData[idx + 2];
          const a = imgData[idx + 3];

          const diff = Math.hypot(r - 234, g - 231, b - 225);

          if (diff > 18 && a > 40) {
            const worldX = cx + (x - sculptureCenterX) * displayScale + (Math.random() - 0.5) * 1.5;
            const worldY = cy + (y - sculptureCenterY) * displayScale + (Math.random() - 0.5) * 1.5;

            const lum = 0.299 * r + 0.587 * g + 0.114 * b;

            let colorIndex = 1;
            if (lum < 95) {
              colorIndex = 0;
            } else if (lum < 150) {
              colorIndex = 1;
            } else if (lum < 198) {
              colorIndex = 2;
            } else {
              colorIndex = 3;
            }

            const isPearl = lum > 212 && Math.random() < 0.25;
            const size = isPearl ? 1.8 + Math.random() * 0.5 : 0.95 + Math.random() * 0.35;
            const baseAlpha = isPearl ? 0.95 : Math.min(0.92, 0.72 + (diff / 100) * 0.22);

            pts.push({
              x: worldX,
              y: worldY,
              z: (lum / 255) * 40,
              vx: 0,
              vy: 0,
              homeX: worldX,
              homeY: worldY,
              homeZ: (lum / 255) * 40,
              colorIndex,
              alpha: width < 480 ? baseAlpha * 0.75 : baseAlpha,
              size: width < 480 ? size * 0.9 : size,
              isPearl,
              isRibbon: false,
              ribbonId: 0,
              flowSpeed: 0,
              seed: Math.random() * Math.PI * 2,
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to sample bust image:', err);
    }

      return pts;
    };

    // -------------------------------------------------------------------------
    // AMBIENT CURVED WISP LINES ART (For Approach & Auth pages)
    // -------------------------------------------------------------------------
    const generateAmbientWisps = (
      w: number,
      h: number,
      scale: number,
      count: number = 6500
    ): Particle[] => {
      const pts: Particle[] = [];
      const numWisps = 14;
      const ptsPerWisp = Math.floor(count / numWisps);

      for (let wid = 0; wid < numWisps; wid++) {
        const flowSpeed = (0.0016 + (wid % 4) * 0.0006) * (wid % 2 === 0 ? 1 : -1);
        // Position even lower in the section (45% to 92% of height) to avoid content overlap
        const yBase = h * (0.45 + (wid / numWisps) * 0.48);
        const amp = (32 + (wid % 4) * 16) * scale;
        const freq = 0.0024 + (wid % 3) * 0.0006;
        const phase = wid * 0.85;
        // Make 2 strands prominently thick and visible
        const isThickStrand = wid === 3 || wid === 8;

        for (let j = 0; j < ptsPerWisp; j++) {
          const spanX = -100 + (j / ptsPerWisp) * (w + 200) + (Math.random() - 0.5) * 14;
          const waveY = Math.sin(spanX * freq + phase) * amp + Math.cos(spanX * freq * 0.6) * (amp * 0.35);
          const py = yBase + waveY + (Math.random() - 0.5) * (isThickStrand ? 16 : 8);
          const pz = Math.sin(spanX * freq * 1.2) * 40;

          const cRand = Math.random();
          let colorIndex = 1;
          if (cRand < 0.25) colorIndex = 0;
          else if (cRand < 0.55) colorIndex = 1;
          else if (cRand < 0.80) colorIndex = 2;
          else colorIndex = 3;

          const size = isThickStrand ? 3.2 + Math.random() * 1.0 : 1.2 + Math.random() * 0.6;
          const isPearl = size > 2.2;

          pts.push({
            x: spanX,
            y: py,
            z: pz,
            vx: 0,
            vy: 0,
            homeX: spanX,
            homeY: py,
            homeZ: pz,
            colorIndex,
            alpha: Math.max(0.40, 0.82 * (1 - Math.abs(spanX - w * 0.5) / (w * 0.6))),
            size,
            isPearl,
            isRibbon: true,
            ribbonId: wid,
            flowSpeed,
            seed: Math.random() * Math.PI * 2,
          });
        }
      }

      return pts;
    };

    // -------------------------------------------------------------------------
    // INITIALIZATION & RESIZE HANDLER
    // -------------------------------------------------------------------------
    const initParticles = () => {
      const container = containerRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      width = Math.max(10, Math.round(rect.width));
      height = Math.max(10, Math.round(rect.height));
      dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const isLinesOnly = variant === 'lines-only' || mode === 'sphere';

      if (isLinesOnly) {
        const scale = width < 768 ? 0.65 : 0.85;
        particles = generateAmbientWisps(width, height, scale, 5500);
      } else {
        if (sourceImg.complete && sourceImg.naturalWidth > 0) {
          particles = sampleBustFromImage(sourceImg);
        }
      }
    };

    sourceImg.onload = () => {
      initParticles();
    };

    initParticles();

    const ro = new ResizeObserver(() => initParticles());
    if (containerRef.current) ro.observe(containerRef.current);

    // Mouse Tracking: target position updated instantly, smoothed in render loop
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.targetX = e.clientX - rect.left;
      mouseRef.current.targetY = e.clientY - rect.top;
      mouseRef.current.active = true;
      mouseRef.current.presenceTarget = 1;
    };

    const handleMouseLeave = () => {
      mouseRef.current.presenceTarget = 0;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    const obs = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        isVisibleRef.current = entry.isIntersecting;
      }
    });
    obs.observe(canvas);

    let time = 0;
    let lastFrameTime = performance.now();

    // -------------------------------------------------------------------------
    // ANIMATION & RENDER LOOP: LIQUID PARTICLE REPULSION / CURL-NOISE SWIRL
    // Faithfully reproduces Forma's GPU-simulated liquid cursor interaction
    // using CPU-side physics with Gaussian falloff, tangential swirl, velocity
    // wake, curl-noise turbulence, and elastic spring return.
    // -------------------------------------------------------------------------

    // Cheap analytic value noise for curl-noise turbulence
    const fract = (x: number) => x - Math.floor(x);
    const mix = (a: number, b: number, t: number) => a + (b - a) * t;
    const hash = (x: number, y: number): number => {
      // Deterministic 2D hash → [0,1]
      const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
      return s - Math.floor(s);
    };
    const vnoise = (px: number, py: number): number => {
      const ix = Math.floor(px);
      const iy = Math.floor(py);
      const fx = px - ix;
      const fy = py - iy;
      // Hermite smoothing
      const ux = fx * fx * (3 - 2 * fx);
      const uy = fy * fy * (3 - 2 * fy);
      const a = hash(ix, iy);
      const b = hash(ix + 1, iy);
      const c = hash(ix, iy + 1);
      const d = hash(ix + 1, iy + 1);
      return mix(mix(a, b, ux), mix(c, d, ux), uy);
    };
    const curlNoise = (px: number, py: number): [number, number] => {
      const e = 0.35;
      const a = vnoise(px, py + e) - vnoise(px, py - e);
      const b = vnoise(px + e, py) - vnoise(px - e, py);
      return [a / (2 * e), -b / (2 * e)];
    };

    const render = () => {
      const now = performance.now();
      const rawDt = (now - lastFrameTime) / 16.6667; // dt normalized to 60fps
      const dt = Math.max(0.25, Math.min(rawDt, 3));  // clamp for stability
      lastFrameTime = now;

      if (!isVisibleRef.current) {
        animFrameRef.current = requestAnimationFrame(render);
        return;
      }

      time += 0.016 * dt;

      const mouse = mouseRef.current;

      // --- Smoothed mouse position (0.22 lerp per frame, like Forma) ---
      const mLerp = 1 - Math.pow(1 - 0.22, dt);
      if (mouse.x < -9000) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
        mouse.prevX = mouse.targetX;
        mouse.prevY = mouse.targetY;
      }
      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x += (mouse.targetX - mouse.x) * mLerp;
      mouse.y += (mouse.targetY - mouse.y) * mLerp;

      // --- Mouse velocity (clamped, smoothed) ---
      const rawVx = (mouse.x - mouse.prevX) / dt;
      const rawVy = (mouse.y - mouse.prevY) / dt;
      const clampV = (v: number) => Math.max(-60, Math.min(60, v));
      mouse.velX += (clampV(rawVx) - mouse.velX) * 0.5;
      mouse.velY += (clampV(rawVy) - mouse.velY) * 0.5;

      // --- Presence: ramps up fast (0.1), fades slow (0.035) ---
      const pRate = mouse.presenceTarget > mouse.presence ? 0.1 : 0.035;
      mouse.presence += (mouse.presenceTarget - mouse.presence) * (1 - Math.pow(1 - pRate, dt));
      if (mouse.presence < 0.001 && mouse.presenceTarget === 0) {
        mouse.presence = 0;
        mouse.active = false;
        mouse.x = -9999;
        mouse.y = -9999;
      }

      ctx.clearRect(0, 0, width, height);

      const pLen = particles.length;
      const isCurrentDark = getIsDark();
      const palette = isCurrentDark ? darkPalette : lightPalette;

      // -----------------------------------------------------------------
      // FORMA-STYLE LIQUID CURSOR: Gaussian falloff, radial + tangential
      // forces, velocity wake, 2-octave curl-noise turbulence.
      // Radius and forces normalized to viewport width for display parity.
      // -----------------------------------------------------------------
      const baseRadius = 160;  // Reduced from 200 for tighter cursor interaction
      const radiusScale = Math.max(0.6, Math.min(1.25, width / 1400));
      const radius = baseRadius * radiusScale;
      const radiusSq = radius * radius;
      const presence = mouse.presence;

      // Normalized mouse velocity for wake carry
      const wakeVx = Math.max(-1, Math.min(1, mouse.velX / 40));
      const wakeVy = Math.max(-1, Math.min(1, mouse.velY / 40));
      const wakeSpeed = Math.sqrt(wakeVx * wakeVx + wakeVy * wakeVy);

      // Time offsets for curl noise
      const curlT1 = time * 0.35;
      const curlT2 = -time * 0.2;

      const buckets: Particle[][] = [[], [], [], []];
      const pearlBucket: Particle[] = [];

      for (let i = 0; i < pLen; i++) {
        const p = particles[i];

        if (p.isRibbon) {
          p.homeX += (p.flowSpeed || 0.35) * (reducedMotion ? 0 : 1);
          if (p.homeX > width + 120) p.homeX = -120;
          if (p.homeX < -120) p.homeX = width + 120;

          const wave = Math.sin(time * 0.9 + p.seed) * 1.6;
          p.y = p.homeY + wave;
        }

        // --- Displacement from home ---
        const offX = p.x - p.homeX;
        const offY = p.y - p.homeY;

        // 1. Elastic spring return (matches Forma's k ≈ 0.026 per dt)
        const lightFactor = 0.45 + (p.z / 40) * 1.1;
        const kSpring = 0.026 * (0.65 + (p.z / 40) * 0.7);
        p.vx -= offX * kSpring * dt;
        p.vy -= offY * kSpring * dt;

        // 2. LIQUID CURSOR INTERACTION
        if (presence > 0.001) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const distSq = dx * dx + dy * dy;

          // Gaussian falloff — no hard cutoff, smooth and organic
          // Only compute for particles within ~3× radius (where exp > 0.0001)
          if (distSq < radiusSq * 9) {
            const f = Math.exp(-distSq / radiusSq) * presence;

            if (f > 0.001) {
              const dist = Math.sqrt(distSq) + 0.001; // avoid div-by-zero
              const nx = dx / dist;
              const ny = dy / dist;

              let accX = 0;
              let accY = 0;

              // A) Radial repulsion: pushes particles outward from cursor
              accX += nx * f * 1.25 * lightFactor;
              accY += ny * f * 1.25 * lightFactor;

              // B) Tangential swirl: perpendicular to radial, creates vortex
              const sd = p.z / 40; // depth factor (0–1)
              accX += (-ny) * f * 1.45 * (0.4 + sd);
              accY += ( nx) * f * 1.45 * (0.4 + sd);

              // C) Wake carry: particles carried by mouse velocity trail
              const e = Math.min(1, f * 2 + wakeSpeed);
              accX += (wakeVx * 42 * lightFactor - p.vx) * e * 0.08;
              accY += (wakeVy * 42 * lightFactor - p.vy) * e * 0.08;

              // D) 2-octave curl-noise turbulence (only in disturbed region)
              const qx = p.x * 0.0095 + curlT1;
              const qy = p.y * 0.0095 + curlT2;
              const [c1x, c1y] = curlNoise(qx, qy);
              const [c2x, c2y] = curlNoise(qx * 2.3 + 7.1, qy * 2.3 + 7.1);
              const cx = c1x + 0.5 * c2x;
              const cy = c1y + 0.5 * c2y;
              accX += cx * e * 1.2 * lightFactor;
              accY += cy * e * 1.2 * lightFactor;

              p.vx += accX * dt;
              p.vy += accY * dt;
            }
          }
        }

        // 3. Velocity damping: heavier when calm (0.93), lighter when energized (0.955)
        const displacement = Math.sqrt(offX * offX + offY * offY);
        const energized = Math.min(1, displacement / (radius * 0.5));
        const dampBase = 0.93 + energized * 0.025; // 0.93–0.955
        const damp = Math.pow(dampBase, dt);
        p.vx *= damp;
        p.vy *= damp;

        // 4. Integrate velocity → position
        p.x += p.vx * dt;
        p.y += p.vy * dt;

        // 5. Dead-zone snap (prevents micro-jitter when nearly home)
        if (offX * offX + offY * offY < 0.04 && p.vx * p.vx + p.vy * p.vy < 0.04) {
          p.x = p.homeX;
          p.y = p.homeY;
          p.vx = 0;
          p.vy = 0;
        }

        if (p.isPearl) {
          pearlBucket.push(p);
        } else {
          buckets[p.colorIndex].push(p);
        }
      }

      // Render 4 Color Buckets with pure circular particles (ctx.arc)
      for (let c = 0; c < 4; c++) {
        const bucket = buckets[c];
        if (bucket.length === 0) continue;

        ctx.fillStyle = palette[c];
        ctx.beginPath();
        const bLen = bucket.length;
        for (let k = 0; k < bLen; k++) {
          const pt = bucket[k];
          ctx.moveTo(pt.x + pt.size, pt.y);
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      // Render Pearl Highlights with Theme-Aware Luster
      if (pearlBucket.length > 0) {
        ctx.fillStyle = isCurrentDark ? '#F0E5CA' : '#EDE2D5';
        ctx.beginPath();
        const pLen2 = pearlBucket.length;
        for (let k = 0; k < pLen2; k++) {
          const pt = pearlBucket[k];
          ctx.moveTo(pt.x + pt.size, pt.y);
          ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
        }
        ctx.fill();
      }

      if (!reducedMotion) {
        animFrameRef.current = requestAnimationFrame(render);
      }
    };

    animFrameRef.current = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      ro.disconnect();
      obs.disconnect();
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [variant, mode, imageUrl, theme]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full pointer-events-auto select-none overflow-hidden ${className}`}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        background: 'transparent',
      }}
    >
      <canvas
        ref={canvasRef}
        className="block w-full h-full pointer-events-auto"
        aria-hidden="true"
        style={{ background: 'transparent' }}
      />
    </div>
  );
};
