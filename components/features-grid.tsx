"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle grid — faint lines with a soft wave that replays
 * each time the section scrolls into view.
 * Grid fades at top/bottom edges.
 */
export function FeaturesGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let startTime = 0;
    let playing = false;

    const DURATION = 4000;
    const FADE_START = 0.5;
    const CELL = 52;
    const isDark = document.documentElement.classList.contains("dark");
    const glowColor = isDark ? "58,248,140" : "16,120,60";
    const gridColor = isDark ? "255,255,255" : "0,0,0";
    const glowStrength = isDark ? 0.08 : 0.6;
    // Light mode gets an extra bright white core in the wave
    const whiteCore = !isDark;

    function resize() {
      const rect = canvas!.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas!.width = rect.width * dpr;
      canvas!.height = rect.height * dpr;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function drawGrid(w: number, h: number, fade: number) {
      const cols = Math.ceil(w / CELL) + 1;
      const rows = Math.ceil(h / CELL) + 1;

      ctx!.strokeStyle = `rgba(${gridColor},${fade * 0.025})`;
      ctx!.lineWidth = 0.5;
      for (let i = 0; i <= cols; i++) {
        const x = i * CELL;
        const edgeFade = Math.min(1, x / (w * 0.15), (w - x) / (w * 0.15));
        ctx!.globalAlpha = edgeFade;
        ctx!.beginPath();
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, h);
        ctx!.stroke();
      }
      for (let j = 0; j <= rows; j++) {
        const y = j * CELL;
        const edgeFade = Math.min(1, y / (h * 0.2), (h - y) / (h * 0.2));
        ctx!.globalAlpha = edgeFade;
        ctx!.beginPath();
        ctx!.moveTo(0, y);
        ctx!.lineTo(w, y);
        ctx!.stroke();
      }
      ctx!.globalAlpha = 1;
    }

    function draw(now: number) {
      if (!playing || !ctx || !canvas) return;

      const t = Math.min(1, (now - startTime) / DURATION);
      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      ctx.clearRect(0, 0, w, h);

      const fade = t > FADE_START
        ? 1 - ((t - FADE_START) / (1 - FADE_START))
        : Math.min(1, t * 5);

      if (fade <= 0) {
        playing = false;
        // Draw static faint grid after animation ends
        drawGrid(w, h, 1);
        return;
      }

      // Static base grid
      drawGrid(w, h, fade);

      // Wave — a soft ring expanding from center
      const cx = w / 2;
      const cy = h / 2;
      const maxR = Math.sqrt(cx * cx + cy * cy);
      const waveFront = t * maxR * 1.6;
      const waveWidth = maxR * 0.25;

      // Draw the wave as a radial gradient ring
      const innerR = Math.max(0, waveFront - waveWidth);
      const outerR = waveFront + waveWidth;
      const grad = ctx.createRadialGradient(cx, cy, innerR, cx, cy, outerR);
      const peakAlpha = fade * glowStrength;
      grad.addColorStop(0, `rgba(${glowColor},0)`);
      grad.addColorStop(0.4, `rgba(${glowColor},${peakAlpha})`);
      grad.addColorStop(0.6, `rgba(${glowColor},${peakAlpha})`);
      grad.addColorStop(1, `rgba(${glowColor},0)`);

      // Mask with vertical edge fade
      ctx.save();
      const edgeMask = ctx.createLinearGradient(0, 0, 0, h);
      edgeMask.addColorStop(0, "rgba(0,0,0,0)");
      edgeMask.addColorStop(0.15, "rgba(0,0,0,1)");
      edgeMask.addColorStop(0.85, "rgba(0,0,0,1)");
      edgeMask.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = grad;
      ctx.globalCompositeOperation = "source-over";
      ctx.fillRect(0, 0, w, h);

      // Bright white core inside the wave (light mode)
      if (whiteCore) {
        const coreWidth = waveWidth * 0.4;
        const coreInner = Math.max(0, waveFront - coreWidth);
        const coreOuter = waveFront + coreWidth;
        const coreGrad = ctx.createRadialGradient(cx, cy, coreInner, cx, cy, coreOuter);
        const coreAlpha = fade * 0.7;
        coreGrad.addColorStop(0, `rgba(255,255,255,0)`);
        coreGrad.addColorStop(0.3, `rgba(255,255,255,${coreAlpha})`);
        coreGrad.addColorStop(0.5, `rgba(255,255,255,${coreAlpha * 0.8})`);
        coreGrad.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.fillStyle = coreGrad;
        ctx.fillRect(0, 0, w, h);
      }

      ctx.restore();

      if (t < 1) {
        animId = requestAnimationFrame(draw);
      } else {
        playing = false;
      }
    }

    function startAnimation() {
      playing = true;
      startTime = performance.now();
      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !playing) {
          startAnimation();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(canvas);

    return () => {
      cancelAnimationFrame(animId);
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full"
      aria-hidden="true"
      style={{
        maskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 25%, black 75%, transparent 100%)",
      }}
    />
  );
}
