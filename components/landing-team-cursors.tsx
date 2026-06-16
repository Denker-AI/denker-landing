"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";

const SHIMMER_PER_CHAR_MS = 80;
const SHIMMER_LOOP_MS = 2800;
const SHIMMER_HOLD_MS = 320;
const FADE_MS = 400;

export type Identity = "denker" | "researcher" | "marketer";

export type CursorPosition = { x: number; y: number };
export type CursorPositionMap = Record<Identity, CursorPosition>;
export type CursorSlotRefs = Record<Identity, HTMLDivElement | null>;

export type IdentityStyle = {
  name: string;
  color: string;
  cursorFilter: string;
  nameTextShadow: string;
  offset: CursorPosition;
};

export type SlotState = { visible: boolean; text: string };

export const HIDDEN: SlotState = { visible: false, text: "" };

export const IDENTITIES: Record<Identity, IdentityStyle> = {
  denker: {
    name: "Denker",
    color: "#30D158",
    cursorFilter:
      "drop-shadow(0 1px 2px rgba(48,209,88,0.9)) drop-shadow(0 0 8px rgba(48,209,88,0.55))",
    nameTextShadow:
      "0 0 1px rgba(48,209,88,0.95), 0 1px 1px rgba(48,209,88,0.45)",
    offset: { x: 20, y: 16 },
  },
  researcher: {
    name: "Researcher",
    color: "#60A5FA",
    cursorFilter:
      "drop-shadow(0 1px 2px rgba(96,165,250,0.9)) drop-shadow(0 0 8px rgba(96,165,250,0.55))",
    nameTextShadow:
      "0 0 1px rgba(96,165,250,0.95), 0 1px 1px rgba(96,165,250,0.45)",
    offset: { x: 30, y: -30 },
  },
  marketer: {
    name: "Marketer",
    color: "#FF9F0A",
    cursorFilter:
      "drop-shadow(0 1px 2px rgba(255,159,10,0.9)) drop-shadow(0 0 8px rgba(255,159,10,0.55))",
    nameTextShadow:
      "0 0 1px rgba(255,159,10,0.95), 0 1px 1px rgba(255,159,10,0.45)",
    offset: { x: -70, y: 20 },
  },
};

const STATUS_TEXT_SHADOW =
  "0 0 1px rgba(255,255,255,0.95), 0 1px 1px rgba(255,255,255,0.45)";

export function applyCursorTransform(element: HTMLDivElement, pos: CursorPosition) {
  element.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
}

function CursorBody({ identity, status }: { identity: Identity; status: string }) {
  const style = IDENTITIES[identity];
  return (
    <div className="landing-team-cursor-body pointer-events-none relative">
      <svg
        className="absolute left-0 top-0"
        width="10"
        height="14"
        viewBox="0 0 10 14"
        fill="none"
        style={{ filter: style.cursorFilter }}
        aria-hidden="true"
      >
        <path d="M1 1L9 7L4.5 7.8L2.5 13L1 1Z" fill={style.color} />
      </svg>
      <div className="absolute left-3 top-3 flex flex-col items-start gap-1 leading-none">
        <span
          className="whitespace-nowrap text-[10px] font-semibold text-primary [text-shadow:0_1px_2px_rgba(255,255,255,0.85)] dark:text-[color:var(--cursor-color)] dark:[text-shadow:var(--cursor-name-shadow)]"
          style={
            {
              "--cursor-color": style.color,
              "--cursor-name-shadow": style.nameTextShadow,
            } as React.CSSProperties
          }
        >
          {style.name}
        </span>
        {status && <ShimmerCaption text={status} />}
      </div>
    </div>
  );
}

function ShimmerCaption({ text }: { text: string }) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setTick(0);
    let cancelled = false;
    const timers: Array<ReturnType<typeof setTimeout>> = [];
    const loop = () => {
      if (cancelled) return;
      setTick((t) => t + 1);
      const id = setTimeout(() => {
        if (!cancelled) setTick((t) => t + 1);
      }, SHIMMER_LOOP_MS - SHIMMER_HOLD_MS);
      timers.push(id);
    };
    loop();
    const intervalId = setInterval(loop, SHIMMER_LOOP_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
      timers.forEach(clearTimeout);
    };
  }, [text]);

  const chars = Array.from(text);

  return (
    <span
      className={cn(
        "block w-max max-w-[min(260px,calc(100vw-32px))] italic",
        "text-[12px] font-medium leading-snug text-primary",
      )}
      style={{ textShadow: STATUS_TEXT_SHADOW }}
    >
      {chars.map((ch, i) => {
        const isPeak = tick % 2 === 1;
        return (
          <span
            key={`${i}-${ch}`}
            style={{
              opacity: isPeak ? 1 : 0.9,
              transition: "opacity 400ms ease-out",
              transitionDelay: `${i * SHIMMER_PER_CHAR_MS}ms`,
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </span>
  );
}

function CursorSlot({
  identity,
  slot,
  slotRefs,
  positionsRef,
}: {
  identity: Identity;
  slot: SlotState;
  slotRefs: React.MutableRefObject<CursorSlotRefs>;
  positionsRef: React.MutableRefObject<CursorPositionMap>;
}) {
  return (
    <div
      ref={(node) => {
        slotRefs.current[identity] = node;
        if (node) applyCursorTransform(node, positionsRef.current[identity]);
      }}
      className="landing-team-cursor-slot pointer-events-none absolute"
      style={{
        opacity: slot.visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease-out`,
        willChange: "transform, opacity",
        contain: "layout paint style",
        backfaceVisibility: "hidden",
      }}
    >
      <CursorBody identity={identity} status={slot.visible ? slot.text : ""} />
    </div>
  );
}

export function CursorOverlay({
  denker,
  researcher,
  marketer,
  replayKey,
  slotRefs,
  positionsRef,
}: {
  denker: SlotState;
  researcher: SlotState;
  marketer: SlotState;
  replayKey: number;
  slotRefs: React.MutableRefObject<CursorSlotRefs>;
  positionsRef: React.MutableRefObject<CursorPositionMap>;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted) return null;

  return createPortal(
    <div
      key={replayKey}
      className="pointer-events-none fixed inset-0"
      style={{ zIndex: 60 }}
      data-testid="meet-denker-cursors"
    >
      <CursorSlot
        identity="denker"
        slot={denker}
        slotRefs={slotRefs}
        positionsRef={positionsRef}
      />
      <CursorSlot
        identity="researcher"
        slot={researcher}
        slotRefs={slotRefs}
        positionsRef={positionsRef}
      />
      <CursorSlot
        identity="marketer"
        slot={marketer}
        slotRefs={slotRefs}
        positionsRef={positionsRef}
      />
    </div>,
    document.body,
  );
}
