"use client";

import { Fragment } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

type BlurTextProps = {
  /** The heading text. Rendered letter by letter. */
  text: string;
  className?: string;
  /** Which heading tag to render. */
  as?: "h1" | "h2";
  /** Seconds of delay added per letter (controls how fast the reveal sweeps). */
  stagger?: number;
};

const letterVariants: Variants = {
  hidden: { opacity: 0, filter: "blur(8px)", y: 6 },
  visible: { opacity: 1, filter: "blur(0px)", y: 0 },
};

/**
 * Heading that reveals its letters one by one with a blur-in effect the first
 * time it scrolls into view. Words are kept whole (they wrap between words, not
 * mid-word) and the full text is exposed to assistive tech via aria-label while
 * the individual letters are hidden from it. Respects prefers-reduced-motion.
 */
export function BlurText({ text, className, as = "h2", stagger = 0.02 }: BlurTextProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = as === "h1" ? motion.h1 : motion.h2;
  const words = text.split(" ");
  let letterIndex = 0;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      aria-label={text}
    >
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap" aria-hidden="true">
            {Array.from(word).map((char, ci) => {
              const delay = letterIndex * stagger;
              letterIndex += 1;
              return (
                <motion.span
                  key={ci}
                  className="inline-block"
                  variants={letterVariants}
                  transition={{ duration: 0.4, ease: "easeOut", delay }}
                >
                  {char}
                </motion.span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </MotionTag>
  );
}
