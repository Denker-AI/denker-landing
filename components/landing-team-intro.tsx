"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "@/lib/cn";
import { FeaturesGrid } from "@/components/features-grid";

const AUDIO_VOLUME = 0.45;
const AUDIO_START_OFFSET_SEC = 5;

/* Lerp factor for cursor follow. */
const LERP = 0.12;

/* IO threshold at which the Meet Denker sequence starts. */
const IO_THRESHOLD = 0.6;

/* Delay between IO entry and sequence start. */
const START_DELAY_MS = 200;

/* Shimmer sweep cadence — per-character stagger + loop period. */
const SHIMMER_PER_CHAR_MS = 80;
const SHIMMER_LOOP_MS = 2800;
const SHIMMER_HOLD_MS = 320;

/* Fade in/out for individual cursor visibility. */
const FADE_MS = 400;

/* Margin from viewport edges when clamping cursor position. */
const VIEWPORT_MARGIN = 8;

/* ── Identity palette — matches real canvas AgentCursor ───────────── */

type Identity = "denker" | "researcher" | "marketer";

type IdentityStyle = {
  name: string;
  color: string;
  /** Drop-shadow string applied to the arrow SVG. */
  cursorFilter: string;
  /** Text shadow for the colored agent name. */
  nameTextShadow: string;
  /** Offset from the visitor's mouse so cursors don't stack. */
  offset: { x: number; y: number };
};

const IDENTITIES: Record<Identity, IdentityStyle> = {
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

/* ── Timeline ─────────────────────────────────────────────────────── */

type SlotState = { visible: boolean; text: string };

type Beat = {
  t: number;
  denker: SlotState;
  researcher: SlotState;
  marketer: SlotState;
};

const HIDDEN: SlotState = { visible: false, text: "" };

/* Denker's silent-follow state — visible cursor, no caption. Used from beat
 * 3 onward and as the resting state once the sequence ends. */
const DENKER_FOLLOW: SlotState = { visible: true, text: "" };

const BEATS: Beat[] = [
  {
    t: 0,
    denker: { visible: true, text: "Hi, I'm Denker, your personal agent team lead." },
    researcher: HIDDEN,
    marketer: HIDDEN,
  },
  {
    t: 3500,
    denker: { visible: true, text: "List agents" },
    researcher: HIDDEN,
    marketer: HIDDEN,
  },
  {
    t: 6000,
    denker: { visible: true, text: "Get tasks" },
    researcher: HIDDEN,
    marketer: HIDDEN,
  },
  {
    t: 8500,
    denker: HIDDEN,
    researcher: { visible: true, text: "Check out task" },
    marketer: HIDDEN,
  },
  {
    t: 11500,
    denker: HIDDEN,
    researcher: { visible: true, text: "Research competition" },
    marketer: HIDDEN,
  },
  {
    t: 14000,
    denker: HIDDEN,
    researcher: { visible: true, text: "Research competition" },
    marketer: { visible: true, text: "Writing campaign copy" },
  },
  {
    t: 17000,
    denker: HIDDEN,
    researcher: { visible: true, text: "Reviewing comp ads" },
    marketer: { visible: true, text: "Drafting post copy" },
  },
  /* Sequence end — researcher + marketer fade out, Denker continues silently. */
  {
    t: 20000,
    denker: DENKER_FOLLOW,
    researcher: HIDDEN,
    marketer: HIDDEN,
  },
];

/* Idle prompts cycled after the main sequence ends so Denker keeps showing
 * occasional small status lines instead of going silent forever. */
const IDLE_PROMPTS = [
  "Following you.",
  "Need a hand? Tap Start Now.",
  "Your team is ready.",
  "Ping me when you're ready.",
];
const IDLE_GAP_MS = 8000;
const IDLE_HOLD_MS = 3500;
const IDLE_KICKOFF_BREATH_MS = 800;

/* ── Cursor body (canvas AgentCursor visual) ──────────────────────── */

function CursorBody({
  identity,
  status,
}: {
  identity: Identity;
  status: string;
}) {
  const style = IDENTITIES[identity];
  return (
    <div className="pointer-events-none relative">
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

/* ── Shimmer caption (per-char opacity sweep) ─────────────────────── */

function ShimmerCaption({ text }: { text: string }) {
  /* Tick drives the per-char opacity sweep without re-rendering text. */
  const [tick, setTick] = useState(0);

  useEffect(() => {
    setTick(0);
    let cancelled = false;
    const loop = () => {
      if (cancelled) return;
      /* Bump tick to restart the staggered transitions, then again after the
       * sweep finishes so the chars relax back to baseline. */
      setTick((t) => t + 1);
      const id = setTimeout(() => {
        if (cancelled) return;
        setTick((t) => t + 1);
      }, SHIMMER_LOOP_MS - SHIMMER_HOLD_MS);
      timersRef.current.push(id);
    };
    const timersRef = { current: [] as Array<ReturnType<typeof setTimeout>> };
    loop();
    const intervalId = setInterval(loop, SHIMMER_LOOP_MS);
    return () => {
      cancelled = true;
      clearInterval(intervalId);
      timersRef.current.forEach(clearTimeout);
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
        /* Alternate between baseline (0.9) and peak (1.0) so the eye reads
         * a sweep travelling left-to-right across the line. */
        const isPeak = tick % 2 === 1;
        return (
          <span
            key={`${i}-${ch}`}
            style={{
              opacity: isPeak ? 1 : 0.9,
              transition: `opacity 400ms ease-out`,
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

/* ── Cursor slot ──────────────────────────────────────────────────── */

function CursorSlot({
  identity,
  slot,
  pos,
}: {
  identity: Identity;
  slot: SlotState;
  pos: { x: number; y: number };
}) {
  return (
    <div
      className="pointer-events-none absolute"
      style={{
        left: pos.x,
        top: pos.y,
        opacity: slot.visible ? 1 : 0,
        transition: `opacity ${FADE_MS}ms ease-out`,
      }}
    >
      <CursorBody identity={identity} status={slot.visible ? slot.text : ""} />
    </div>
  );
}

/* ── Cursor overlay (portal to body — page-wide fixed layer) ──────── */

function CursorOverlay({
  denker,
  researcher,
  marketer,
  denkerPos,
  researcherPos,
  marketerPos,
  replayKey,
}: {
  denker: SlotState;
  researcher: SlotState;
  marketer: SlotState;
  denkerPos: { x: number; y: number };
  researcherPos: { x: number; y: number };
  marketerPos: { x: number; y: number };
  replayKey: number;
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
      <CursorSlot identity="denker" slot={denker} pos={denkerPos} />
      <CursorSlot identity="researcher" slot={researcher} pos={researcherPos} />
      <CursorSlot identity="marketer" slot={marketer} pos={marketerPos} />
    </div>,
    document.body,
  );
}

/* ── Main interactive section ─────────────────────────────────────── */

function clampToViewport(x: number, y: number) {
  if (typeof window === "undefined") return { x, y };
  const w = window.innerWidth;
  const h = window.innerHeight;
  return {
    x: Math.max(VIEWPORT_MARGIN, Math.min(w - VIEWPORT_MARGIN, x)),
    y: Math.max(VIEWPORT_MARGIN, Math.min(h - VIEWPORT_MARGIN, y)),
  };
}

function MeetDenkerStage() {
  const sectionRef = useRef<HTMLElement>(null);

  /* Visitor's mouse in viewport coordinates (clientX/clientY). */
  const mouseRef = useRef({ x: 0, y: 0 });
  const hasMouseRef = useRef(false);

  /* Slot positions — lerped each frame. */
  const [denkerPos, setDenkerPos] = useState({ x: 0, y: 0 });
  const [researcherPos, setResearcherPos] = useState({ x: 0, y: 0 });
  const [marketerPos, setMarketerPos] = useState({ x: 0, y: 0 });

  /* Slot visibility/text driven by the beat timeline. Denker starts hidden
   * (pre-first-mousemove) and flips to silent-follow on first mousemove. */
  const [denker, setDenker] = useState<SlotState>(HIDDEN);
  const [researcher, setResearcher] = useState<SlotState>(HIDDEN);
  const [marketer, setMarketer] = useState<SlotState>(HIDDEN);

  const rafRef = useRef<number | null>(null);
  const beatTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const idleTimersRef = useRef<Array<ReturnType<typeof setTimeout>>>([]);
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasStartedRef = useRef(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioPlayedRef = useRef(false);
  const [muted, setMuted] = useState(true);
  const [replayKey, setReplayKey] = useState(0);

  /* Touch/no-mouse fallback — seed mouseRef to a stable point in the lower
   * portion of the viewport so the cursor sequence has somewhere to play even
   * when the visitor has no pointer. Re-seeds on resize + scroll, so it tracks
   * the visitor as they swipe through the page. Real mousemove still wins
   * once a mouse is detected. */
  useEffect(() => {
    const seedToViewportLower = () => {
      if (hasMouseRef.current) return;
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      /* Horizontal: viewport center.
       * Vertical: 72% down the viewport — below the centered text block on
       * narrow screens, but always inside the visible area so the cursors
       * don't disappear off-screen. */
      const cx = vw / 2;
      const cy = Math.max(120, Math.min(vh * 0.72, vh - 100));
      mouseRef.current = { x: cx, y: cy };
      /* Snap cursor positions so they don't fly in from (0,0) on first frame. */
      setDenkerPos({ x: cx + IDENTITIES.denker.offset.x, y: cy + IDENTITIES.denker.offset.y });
      setResearcherPos({ x: cx + IDENTITIES.researcher.offset.x, y: cy + IDENTITIES.researcher.offset.y });
      setMarketerPos({ x: cx + IDENTITIES.marketer.offset.x, y: cy + IDENTITIES.marketer.offset.y });
    };
    seedToViewportLower();
    window.addEventListener("resize", seedToViewportLower);
    window.addEventListener("scroll", seedToViewportLower, { passive: true });
    return () => {
      window.removeEventListener("resize", seedToViewportLower);
      window.removeEventListener("scroll", seedToViewportLower);
    };
  }, []);

  const playSound = useCallback(() => {
    try {
      const audio = new Audio("/sounds/awaken.mp3");
      audio.volume = AUDIO_VOLUME;
      audio.currentTime = AUDIO_START_OFFSET_SEC;
      audio
        .play()
        .then(() => setMuted(false))
        .catch(() => {
          /* Silent fallback — visitor can tap the sound button instead. */
        });
      audioRef.current = audio;
    } catch {
      /* Silent fallback */
    }
  }, []);

  /* Window-level mouse tracking. Fires Denker's awakening + awake sound on
   * the visitor's first mouse-move anywhere on the page. */
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const clamped = clampToViewport(e.clientX, e.clientY);
      mouseRef.current = clamped;
      if (!hasMouseRef.current) {
        hasMouseRef.current = true;
        /* Seed all three slots so they don't fly in from (0,0). */
        const denkerOff = IDENTITIES.denker.offset;
        const researcherOff = IDENTITIES.researcher.offset;
        const marketerOff = IDENTITIES.marketer.offset;
        setDenkerPos({ x: clamped.x + denkerOff.x, y: clamped.y + denkerOff.y });
        setResearcherPos({
          x: clamped.x + researcherOff.x,
          y: clamped.y + researcherOff.y,
        });
        setMarketerPos({
          x: clamped.x + marketerOff.x,
          y: clamped.y + marketerOff.y,
        });
        /* Denker becomes visible silently. Sequence may overwrite caption
         * later when the visitor reaches the Meet Denker section. */
        setDenker((prev) => (prev.visible ? prev : DENKER_FOLLOW));
        if (!audioPlayedRef.current) {
          audioPlayedRef.current = true;
          playSound();
        }
      }
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [playSound]);

  /* rAF lerp loop — every cursor follows mouse + offset + organic drift.
   * Each agent has its own drift amplitude, frequency, phase, and lerp rate
   * so they wander naturally and don't move in lockstep. */
  useEffect(() => {
    /* Drift params: ampX/ampY in px; freqX/freqY in rad/sec; phaseX/phaseY shifts; lerp rate. */
    const DRIFT = {
      denker:     { ampX: 6,  ampY: 5,  freqX: 0.7,  freqY: 0.5,  phaseX: 0.0, phaseY: 1.3, lerp: 0.13 },
      researcher: { ampX: 9,  ampY: 7,  freqX: 0.55, freqY: 0.65, phaseX: 2.1, phaseY: 0.4, lerp: 0.10 },
      marketer:   { ampX: 8,  ampY: 6,  freqX: 0.6,  freqY: 0.45, phaseX: 4.7, phaseY: 2.8, lerp: 0.09 },
    };
    const tick = () => {
      const m = mouseRef.current;
      const t = performance.now() / 1000;
      const computeTarget = (off: { x: number; y: number }, d: typeof DRIFT.denker) => ({
        x: m.x + off.x + Math.sin(t * d.freqX + d.phaseX) * d.ampX,
        y: m.y + off.y + Math.cos(t * d.freqY + d.phaseY) * d.ampY,
      });
      setDenkerPos((p) => {
        const tgt = computeTarget(IDENTITIES.denker.offset, DRIFT.denker);
        return { x: p.x + (tgt.x - p.x) * DRIFT.denker.lerp, y: p.y + (tgt.y - p.y) * DRIFT.denker.lerp };
      });
      setResearcherPos((p) => {
        const tgt = computeTarget(IDENTITIES.researcher.offset, DRIFT.researcher);
        return { x: p.x + (tgt.x - p.x) * DRIFT.researcher.lerp, y: p.y + (tgt.y - p.y) * DRIFT.researcher.lerp };
      });
      setMarketerPos((p) => {
        const tgt = computeTarget(IDENTITIES.marketer.offset, DRIFT.marketer);
        return { x: p.x + (tgt.x - p.x) * DRIFT.marketer.lerp, y: p.y + (tgt.y - p.y) * DRIFT.marketer.lerp };
      });
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const clearIdleTimers = useCallback(() => {
    idleTimersRef.current.forEach((id) => clearTimeout(id));
    idleTimersRef.current = [];
  }, []);

  const clearBeatTimers = useCallback(() => {
    beatTimersRef.current.forEach((id) => clearTimeout(id));
    beatTimersRef.current = [];
    /* Idle loop is part of the post-sequence lifecycle — replay must reset it. */
    idleTimersRef.current.forEach((id) => clearTimeout(id));
    idleTimersRef.current = [];
  }, []);

  const applyBeat = useCallback((i: number) => {
    const beat = BEATS[i];
    if (!beat) return;
    setDenker(beat.denker);
    setResearcher(beat.researcher);
    setMarketer(beat.marketer);
  }, []);

  /* Idle prompt cycler — runs after the final beat. Each iteration shows
   * IDLE_PROMPTS[idx] for IDLE_HOLD_MS, then blanks Denker's caption for
   * IDLE_GAP_MS, then advances to the next prompt. Cancellable via
   * clearIdleTimers (called from clearBeatTimers + handleReplay). */
  const startIdleLoop = useCallback(() => {
    let idx = 0;
    const schedulePrompt = () => {
      const showId = setTimeout(() => {
        setDenker({ visible: true, text: IDLE_PROMPTS[idx]! });
        const hideId = setTimeout(() => {
          setDenker(DENKER_FOLLOW);
          idx = (idx + 1) % IDLE_PROMPTS.length;
          schedulePrompt();
        }, IDLE_HOLD_MS);
        idleTimersRef.current.push(hideId);
      }, IDLE_GAP_MS);
      idleTimersRef.current.push(showId);
    };
    schedulePrompt();
  }, []);

  const startSequence = useCallback(() => {
    clearBeatTimers();
    for (let i = 0; i < BEATS.length; i++) {
      const id = setTimeout(() => {
        applyBeat(i);
      }, BEATS[i]!.t);
      beatTimersRef.current.push(id);
    }
    /* After the final beat, give Denker a small breath then kick off the
     * idle prompt loop so he keeps occasionally talking. */
    const lastBeatT = BEATS[BEATS.length - 1]!.t;
    const idleStartId = setTimeout(() => {
      startIdleLoop();
    }, lastBeatT + IDLE_KICKOFF_BREATH_MS);
    beatTimersRef.current.push(idleStartId);
  }, [applyBeat, clearBeatTimers, startIdleLoop]);

  /* IntersectionObserver — kicks off the sequence on first meaningful entry.
   * Audio is NOT played here — that fires on first window mousemove instead. */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.intersectionRatio >= IO_THRESHOLD) {
            if (hasStartedRef.current) return;
            hasStartedRef.current = true;
            startTimerRef.current = setTimeout(() => {
              startSequence();
            }, START_DELAY_MS);
          }
        }
      },
      { threshold: [IO_THRESHOLD] },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [startSequence]);

  /* Unmount cleanup — clear any pending timers. */
  useEffect(() => {
    return () => {
      if (startTimerRef.current) clearTimeout(startTimerRef.current);
      beatTimersRef.current.forEach((id) => clearTimeout(id));
      beatTimersRef.current = [];
      idleTimersRef.current.forEach((id) => clearTimeout(id));
      idleTimersRef.current = [];
    };
  }, []);

  const handleSoundToggle = useCallback(() => {
    if (muted) {
      playSound();
    } else {
      if (audioRef.current) audioRef.current.pause();
      setMuted(true);
    }
  }, [muted, playSound]);

  const handleReplay = useCallback(() => {
    /* Replay rewinds the timeline + bumps a key so shimmers restart cleanly.
     * Returns Denker to silent-follow first, then re-runs the beat schedule. */
    clearBeatTimers();
    if (startTimerRef.current) clearTimeout(startTimerRef.current);
    setDenker(DENKER_FOLLOW);
    setResearcher(HIDDEN);
    setMarketer(HIDDEN);
    setReplayKey((k) => k + 1);
    startTimerRef.current = setTimeout(() => {
      startSequence();
    }, 50);
    playSound();
  }, [clearBeatTimers, playSound, startSequence]);

  return (
    <>
      <section
        ref={sectionRef}
        id="features"
        className="relative min-h-screen w-full overflow-hidden"
        data-testid="landing-team-intro"
      >
        {/* Green wave background */}
        <FeaturesGrid />

        {/* Centered text */}
        <div className="relative z-10 mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-5 text-center sm:px-6">
          <span className="badge-section mb-4">Meet Denker</span>
          <h2 className="text-section-heading mb-5 text-balance">
            Direct your AI agent team <span className="text-accent">from one place.</span>
          </h2>
          <p className="mx-auto max-w-xl text-base leading-relaxed text-secondary text-balance">
            One keystroke wakes Denker. It picks up tasks, keeps context close,
            and routes work to the right agent.
          </p>
        </div>

        {/* Controls — bottom-right of the section. */}
        <div className="absolute bottom-6 right-6 z-50 flex items-center gap-2">
          <button
            type="button"
            onClick={handleSoundToggle}
            className="flex h-8 items-center gap-1.5 rounded-full border border-glass-stroke bg-glass-fill px-3 text-[11px] font-medium text-secondary backdrop-blur-glass transition-colors hover:border-glass-stroke-light hover:text-primary"
            data-testid="meet-denker-sound"
            aria-label={muted ? "Play awake sound" : "Mute awake sound"}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
              {muted ? (
                <path d="M3 6h2l3-3v10l-3-3H3V6zm9.5-1l1 1L12 7.5l1.5 1.5-1 1L11 8.5 9.5 10l-1-1L10 7.5 8.5 6l1-1L11 6.5 12.5 5z" />
              ) : (
                <path d="M3 6h2l3-3v10l-3-3H3V6zm8 0c.6.8 1 1.8 1 2.5 0 .7-.4 1.7-1 2.5l-.8-.6c.5-.7.8-1.4.8-1.9 0-.5-.3-1.2-.8-1.9L11 6zm2-2c1.2 1.3 2 3 2 4.5 0 1.5-.8 3.2-2 4.5l-.8-.6C13.4 11.4 14 10 14 8.5 14 7 13.4 5.6 12.2 4.6L13 4z" />
              )}
            </svg>
            {muted ? "Tap to hear" : "Sound on"}
          </button>
          <button
            type="button"
            onClick={handleReplay}
            className="flex h-8 items-center gap-1.5 rounded-full border border-glass-stroke bg-glass-fill px-3 text-[11px] font-medium text-secondary backdrop-blur-glass transition-colors hover:border-glass-stroke-light hover:text-primary"
            data-testid="meet-denker-replay"
            aria-label="Replay intro"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 16 16"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M14 8a6 6 0 1 1-1.76-4.24" strokeLinecap="round" />
              <path
                d="M14 2v3h-3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Replay
          </button>
        </div>
      </section>

      {/* Page-wide cursor overlay — portaled to body, fixed, never blocks pointer events. */}
      <CursorOverlay
        denker={denker}
        researcher={researcher}
        marketer={marketer}
        denkerPos={denkerPos}
        researcherPos={researcherPos}
        marketerPos={marketerPos}
        replayKey={replayKey}
      />
    </>
  );
}

/* ── Section wrapper ──────────────────────────────────────────────── */

export function LandingTeamIntro() {
  return <MeetDenkerStage />;
}
