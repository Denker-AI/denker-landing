"use client";

import { useEffect, useRef } from "react";

export function LandingLiquidBackground() {
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const shell = shellRef.current;
    if (!shell) return;

    let frame = 0;
    let currentX = window.innerWidth / 2;
    let currentY = window.innerHeight / 2;
    let targetX = currentX;
    let targetY = currentY;

    shell.style.setProperty("--landing-cursor-x", `${currentX}px`);
    shell.style.setProperty("--landing-cursor-y", `${currentY}px`);

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return;

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      shell.style.setProperty("--landing-cursor-x", `${currentX}px`);
      shell.style.setProperty("--landing-cursor-y", `${currentY}px`);

      const deltaX = Math.abs(targetX - currentX);
      const deltaY = Math.abs(targetY - currentY);
      if (deltaX > 0.5 || deltaY > 0.5) {
        frame = requestAnimationFrame(tick);
      } else {
        frame = 0;
      }
    };

    const updateCursor = (event: PointerEvent) => {
      targetX = event.clientX;
      targetY = event.clientY;
      if (!frame) frame = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", updateCursor, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", updateCursor);
    };
  }, []);

  return (
    <div
      ref={shellRef}
      className="landing-liquid-background"
      data-testid="landing-liquid-background"
      aria-hidden="true"
    >
      <div className="landing-aurora-field" />
      <div className="landing-liquid-cursor" />
    </div>
  );
}
