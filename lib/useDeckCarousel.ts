"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";

// Shared mechanics behind the transform-based "deck" carousels used across
// the page (see CardCarousel) — extracted here so a second deck (e.g.
// Testimonials) doesn't have to duplicate the geometry/drag logic. Callers
// render their own cards; this hook just tracks which one is active and
// where the deck should sit.

type Geometry = { offsets: number[]; widths: number[]; wrapperWidth: number };

// First card docks flush to the wrapper's left edge; last card docks flush
// right; middle cards center with a peek of their neighbors on both sides.
function targetOffsetFor(index: number, geo: Geometry | null) {
  if (!geo) return 0;
  const { offsets, widths, wrapperWidth } = geo;
  if (index <= 0) return offsets[0] ?? 0;
  if (index >= offsets.length - 1) {
    return offsets[index] + widths[index] - wrapperWidth;
  }
  return offsets[index] - (wrapperWidth - widths[index]) / 2;
}

export function useDeckCarousel(itemCount: number) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [active, setActive] = useState(0);
  // The settled offset is fully derived from active+geo; dragOffset is a
  // temporary override that's only non-null while actively dragging.
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const dragRef = useRef({ startX: 0, startOffset: 0 });

  const settledOffset = targetOffsetFor(active, geo);
  const offset = dragOffset ?? settledOffset;
  const dragging = dragOffset !== null;

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const deck = deckRef.current;
    if (!wrapper || !deck) return;

    const measure = () => {
      const children = Array.from(deck.children) as HTMLElement[];
      if (children.length === 0) return;
      setGeo({
        offsets: children.map((c) => c.offsetLeft),
        widths: children.map((c) => c.offsetWidth),
        wrapperWidth: wrapper.clientWidth,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  const step = (dir: 1 | -1) => {
    setActive((prev) => Math.min(Math.max(prev + dir, 0), itemCount - 1));
  };

  const onPointerDown = (e: PointerEvent) => {
    dragRef.current = { startX: e.clientX, startOffset: settledOffset };
    setDragOffset(settledOffset);
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      // ignore — pointer capture isn't essential to the drag itself
    }
  };

  const onPointerMove = (e: PointerEvent) => {
    if (dragOffset === null) return;
    const dx = e.clientX - dragRef.current.startX;
    setDragOffset(dragRef.current.startOffset - dx);
  };

  const onPointerUp = () => {
    if (dragOffset === null) return;
    let nearest = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < itemCount; i++) {
      const dist = Math.abs(targetOffsetFor(i, geo) - dragOffset);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    }
    setDragOffset(null);
    setActive(nearest);
  };

  return {
    wrapperRef,
    deckRef,
    active,
    offset,
    dragging,
    step,
    isFirst: active === 0,
    isLast: active === itemCount - 1,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel: onPointerUp,
    },
  };
}
