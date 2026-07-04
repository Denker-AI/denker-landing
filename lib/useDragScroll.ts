"use client";

import { useEffect, type RefObject } from "react";

/**
 * Adds click-and-drag horizontal scrolling to a ref'd container (mouse users
 * otherwise have no way to scroll a horizontal track besides shift+wheel).
 * Calls onDragStart/onDragEnd so callers can pause autoplay while dragging.
 */
export function useDragScroll(
  ref: RefObject<HTMLElement | null>,
  options?: { onDragStart?: () => void; onDragEnd?: () => void }
) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let isDown = false;
    let dragged = false;
    let startX = 0;
    let startScrollLeft = 0;
    let prevScrollBehavior = "";
    let prevScrollSnapType = "";

    const suppressNextClick = (e: MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      el.removeEventListener("click", suppressNextClick, true);
    };

    const onPointerDown = (e: PointerEvent) => {
      isDown = true;
      dragged = false;
      startX = e.clientX;
      startScrollLeft = el.scrollLeft;
      try {
        el.setPointerCapture(e.pointerId);
      } catch {
        // ignore — pointer capture isn't essential to the drag itself
      }
      // Disable smooth scrolling and snap while actively dragging, otherwise
      // every scrollLeft write gets eased/animated instead of tracking the
      // pointer 1:1, which makes the drag feel laggy and overshoot.
      prevScrollBehavior = el.style.scrollBehavior;
      prevScrollSnapType = el.style.scrollSnapType;
      el.style.scrollBehavior = "auto";
      el.style.scrollSnapType = "none";
      options?.onDragStart?.();
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDown) return;
      const dx = e.clientX - startX;
      if (Math.abs(dx) > 3) dragged = true;
      el.scrollLeft = startScrollLeft - dx;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDown) return;
      isDown = false;
      try {
        if (el.hasPointerCapture(e.pointerId)) {
          el.releasePointerCapture(e.pointerId);
        }
      } catch {
        // ignore
      }
      el.style.scrollBehavior = prevScrollBehavior;
      el.style.scrollSnapType = prevScrollSnapType;
      if (dragged) {
        // prevent the drag-release from also firing a click on whatever's underneath
        el.addEventListener("click", suppressNextClick, true);
      }
      options?.onDragEnd?.();
    };

    el.addEventListener("pointerdown", onPointerDown);
    el.addEventListener("pointermove", onPointerMove);
    el.addEventListener("pointerup", onPointerUp);
    el.addEventListener("pointercancel", onPointerUp);

    return () => {
      el.removeEventListener("pointerdown", onPointerDown);
      el.removeEventListener("pointermove", onPointerMove);
      el.removeEventListener("pointerup", onPointerUp);
      el.removeEventListener("pointercancel", onPointerUp);
      el.removeEventListener("click", suppressNextClick, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);
}
