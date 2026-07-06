"use client";

import {
  createContext,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/**
 * Apple/visionOS-style reveal shared by every scroll-in element on the page.
 * Content starts lower, transparent and slightly blurred, then floats up and
 * resolves into sharp focus. The uniform blur→sharp is what reads as a
 * deliberate "settle into place" rather than an ambiguous horizontal shimmer.
 */
export const RISE = 40; // px the element travels up as it reveals
const BLUR = 6; // px blur it starts with, resolving to 0
const DURATION = 0.7; // seconds
const EASE = [0.22, 1, 0.36, 1] as const; // Apple's soft decelerate
export const STAGGER = 0.07; // seconds between cascading children

/** Duration + easing of a single element's reveal. Delay is added per call. */
export const REVEAL_TRANSITION = { duration: DURATION, ease: EASE } as const;

export const revealVariants: Variants = {
  hidden: (y: number) => ({ opacity: 0, y, filter: `blur(${BLUR}px)` }),
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
};

/** True when a FadeIn is nested inside a FadeInStagger, so it inherits the
 * parent's reveal timeline instead of starting its own scroll observer. */
const StaggerContext = createContext(false);

type FadeInProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before this element starts, for sequencing within a section. */
  delay?: number;
  /** How far (px) the element travels up as it fades in. */
  y?: number;
  /** Which element to render. Rendered in place (no extra wrapper). */
  as?: "div" | "p" | "span";
  /** Fires once the reveal finishes (or immediately under reduced motion). */
  onComplete?: () => void;
};

/**
 * Fades its content in while rising from below and sharpening from a soft blur,
 * the first time it scrolls into view. Renders the chosen element directly
 * (same tag + className) so it can replace an existing element without adding a
 * wrapper that would disturb flex/grid layouts. Respects prefers-reduced-motion.
 *
 * Inside a {@link FadeInStagger} it drops its own scroll trigger and inherits
 * the parent's timeline, so a group of them cascades one after another.
 */
export function FadeIn({
  children,
  className,
  delay = 0,
  y = RISE,
  as = "div",
  onComplete,
}: FadeInProps) {
  const reduceMotion = useReducedMotion();
  const staggered = useContext(StaggerContext);

  // With no animation to wait for, signal completion right away.
  useEffect(() => {
    if (reduceMotion) onComplete?.();
  }, [reduceMotion, onComplete]);

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  const MotionTag = as === "p" ? motion.p : as === "span" ? motion.span : motion.div;

  // Standalone: run its own scroll-triggered reveal. Staggered: stay unset so
  // the parent's animate state ("hidden"/"visible") drives it in cascade.
  const triggerProps = staggered
    ? {}
    : {
        initial: "hidden" as const,
        whileInView: "visible" as const,
        viewport: { once: true, amount: 0.2 },
      };

  return (
    <MotionTag
      className={className}
      custom={y}
      variants={revealVariants}
      transition={{ ...REVEAL_TRANSITION, delay: staggered ? 0 : delay }}
      onAnimationComplete={onComplete}
      {...triggerProps}
    >
      {children}
    </MotionTag>
  );
}

type FadeInStaggerProps = {
  children: ReactNode;
  className?: string;
  /** Seconds to wait before the first child begins. */
  delay?: number;
  /** Fraction of the group that must be visible before the cascade fires. */
  amount?: number;
  /** Seconds between each child. Larger = more visibly one-after-another. */
  stagger?: number;
};

/**
 * Reveals its {@link FadeIn} children one after another once the group scrolls
 * into view, so a grid or list "fills up" progressively the way Apple's
 * galleries do. The cascade runs in DOM order — left-to-right, top-to-bottom —
 * so the leftmost/first card rises first and each following one lags behind it.
 * Children must be FadeIn elements to participate.
 */
export function FadeInStagger({
  children,
  className,
  delay = 0,
  amount = 0.2,
  stagger = 0.12,
}: FadeInStaggerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: stagger,
            staggerDirection: 1, // forward: leftmost/first child reveals first
            delayChildren: delay,
          },
        },
      }}
    >
      <StaggerContext.Provider value={true}>{children}</StaggerContext.Provider>
    </motion.div>
  );
}
