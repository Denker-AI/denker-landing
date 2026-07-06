"use client";

import { Fragment } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { REVEAL_TRANSITION, RISE, STAGGER, revealVariants } from "./FadeIn";

type BlurTextProps = {
  text: string;
  className?: string;
  as?: "h1" | "h2";
  /** Seconds between each line revealing. */
  stagger?: number;
};

/**
 * Section headings, revealed the Apple/visionOS way: each line floats up from
 * below and resolves from a soft blur into sharp focus, cascading line by line
 * when the heading scrolls into view. Newlines in `text` become the lines.
 * Respects prefers-reduced-motion (renders plain, static text).
 */
export function BlurText({
  text,
  className,
  as = "h2",
  stagger = STAGGER,
}: BlurTextProps) {
  const reduceMotion = useReducedMotion();
  const lines = text.split("\n");

  if (reduceMotion) {
    const Tag = as;
    return (
      <Tag className={className}>
        {lines.map((line, index) => (
          <Fragment key={index}>
            {line}
            {index < lines.length - 1 ? <br /> : null}
          </Fragment>
        ))}
      </Tag>
    );
  }

  const MotionTag = as === "h1" ? motion.h1 : motion.h2;

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.4 }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: stagger } },
      }}
    >
      {lines.map((line, index) => (
        <motion.span
          key={index}
          className="block"
          custom={RISE}
          variants={revealVariants}
          transition={REVEAL_TRANSITION}
        >
          {line}
        </motion.span>
      ))}
    </MotionTag>
  );
}
