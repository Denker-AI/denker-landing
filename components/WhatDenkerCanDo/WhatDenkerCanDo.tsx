"use client";

import Image from "next/image";
import {
  GithubLogo,
  List,
  MagnifyingGlass,
  Pause,
  Play,
} from "@phosphor-icons/react/dist/ssr";
import {
  AlertCircle,
  Archive,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock3,
  ExternalLink,
  FileText,
  Grid3X3,
  HelpCircle,
  Image as ImageIcon,
  Inbox,
  Keyboard,
  Lightbulb,
  Link,
  Lock,
  LockKeyhole,
  Mail,
  Maximize2,
  MoreHorizontal,
  Paperclip,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Reply,
  Search,
  Send,
  Settings,
  SlidersHorizontal,
  Smile,
  Star,
  Tag,
  Trash2,
  Undo2,
  Redo2,
  UserRound,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { DenkerCursorBubble } from "@/components/production/cursors/denker-cursor-bubble";
import { MemoryGraphMotion } from "@/components/WhatDenkerCanDo/MemoryGraphMotion";
import { Icons } from "@/components/production/ui/icons";
import { AgentAvatarPreview } from "@/components/production/ui/agent-avatar-preview";
import { FrameFooter } from "@/components/production/shapes/shared/frame-footer";
import { FrameHeader } from "@/components/production/shapes/shared/frame-header";
import { KanbanColumn } from "@/components/production/shapes/taskboard/kanban-column";
import { KanbanCard } from "@/components/production/shapes/taskboard/kanban-card";
import type { DemoColumn, DemoTask } from "@/components/production/shapes/taskboard/types";
import {
  surfaceRoleAttributes,
  surfaceRoleClassName,
} from "@/components/production/ui/surface-contract";
import { BlurText } from "@/components/ui/BlurText";
import { Container } from "@/components/ui/Container";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/cn";

const slides = [
  {
    id: 0,
    background: "/images/what-denker-can-do/backgrounds/downloaded-patrick-teal-architecture.jpg",
    copy: "Give Denker a task. It opens apps,\nclicks, and types — like you would.",
  },
  {
    id: 1,
    background: "/images/what-denker-can-do/backgrounds/downloaded-blue-ink-marble.jpg",
    copy: "Results land right where you're working.\nNot in another tab.",
  },
  {
    id: 2,
    background: "/images/what-denker-can-do/backgrounds/downloaded-teal-motion-lines.jpg",
    copy: "Denker writes straight into\nthe input of any app.",
  },
  {
    id: 3,
    background: "/images/what-denker-can-do/backgrounds/downloaded-cyan-architecture-lines.jpg",
    copy: "A team of agents, working in parallel —\neach on its own task.",
  },
  {
    id: 4,
    background: "/images/what-denker-can-do/backgrounds/downloaded-cyan-black-fluid.jpg",
    copy: "Everything remembered — in a memory\ngraph you can actually see.",
  },
];

type Geometry = { cardWidth: number; stride: number; viewportWidth: number };
type ControlsMode = "hidden" | "fixed" | "anchored";

const CONTROLS_HEIGHT = 56;
const CONTROLS_FRAME_GAP_MOBILE = 32;
const CONTROLS_FRAME_GAP_DESKTOP = 40;
const CONTROLS_MIN_BOTTOM = 16;
/* Matches the 4.6s taskboard choreography (see taskboard-* keyframes in
   globals.css) so the completion toast finishes before the slide advances. */
const TASKBOARD_DEMO_MOTION_MS = 4600;
const FIRST_DEMO_MOTION_MS = 4200;
const SUMMARY_DEMO_MOTION_MS = 4600;
const GMAIL_DEMO_MOTION_MS = 4600;
/* Simpler two-beat choreography (bubble at 0.8s, node-select + panel-in at
   2.2s/2.3s, ~0.45s panel slide) finishes well before the taskboard's 4.6s
   window — shortened so the slide holds on the completed state (graph +
   selected node + panel) for a beat before advancing, instead of sitting
   idle. */
const GRAPH_DEMO_MOTION_MS = 3800;
const DEMO_FINAL_HOLD_MS = 500;
const GITHUB_PROMPT = "Open GitHub page";
const GITHUB_TYPING_START_MS = 720;
const GITHUB_TYPING_STEP_MS = 48;
const GMAIL_REPLY_TEXT =
  "Hi Raj, thanks for the email, the pro plan provides";
const GMAIL_BUBBLE_TEXT = `Paste Text : ${GMAIL_REPLY_TEXT}`;
const GMAIL_PASTE_START_MS = 900;

const githubRuns = [
  {
    title: "fix(canvas): debounce focus frame chrome reveal",
    meta: "Release #125 · Commit ac95225 pushed by janez1201",
    branch: "main",
    time: "38 minutes ago",
    duration: "18m 57s",
  },
  {
    title: "Add Dolcetto media demo route (#630)",
    meta: "Release #124 · Commit b429de4 pushed by janez1201",
    branch: "main",
    time: "Today at 2:43 PM",
    duration: "20m 57s",
  },
  {
    title: "Add Dolcetto media demo route",
    meta: "CI #836 · Pull request #630 synchronized by janez1201",
    branch: "codex/os26-chrome-memory",
    time: "Today at 2:29 PM",
    duration: "4m 39s",
  },
  {
    title: "Fix onboarding media replay and managed runtime deploy env (#629)",
    meta: "Release #123 · Commit 5a4a30b pushed by janez1201",
    branch: "main",
    time: "Jul 4, 10:38 PM GMT+2",
    duration: "21m 30s",
  },
  {
    title: "Fix onboarding frame chrome flicker, completion persistence, and autoplay",
    meta: "Release #122 · Commit 83f72b0 pushed by janez1201",
    branch: "main",
    time: "Jul 4, 3:41 PM GMT+2",
    duration: "16m 49s",
  },
];

const taskboardColumns: DemoColumn[] = [
  {
    status: "backlog",
    tasks: [
      {
        id: "task-101",
        ticket: "DEN-101",
        title: "Turn homepage notes into onboarding checklist",
        status: "backlog",
        agent: "Denker",
        agentColor: "#3af88c",
        priority: "low",
        comments: 1,
      },
    ],
  },
  {
    status: "todo",
    tasks: [
      {
        id: "task-118",
        ticket: "DEN-118",
        title: "Create signed local-dev smoke test runbook",
        status: "todo",
        agent: "Coder",
        agentColor: "#60a5fa",
        priority: "medium",
        comments: 2,
      },
    ],
  },
  {
    status: "in_progress",
    tasks: [
      {
        id: "task-126",
        ticket: "DEN-126",
        title: "Wire taskboard demo to new-user desktop seed data",
        status: "in_progress",
        agent: "Canvas",
        agentColor: "#f472b6",
        priority: "high",
        comments: 4,
      },
    ],
  },
  {
    status: "blocked",
    tasks: [
      {
        id: "task-133",
        ticket: "DEN-133",
        title: "Wait for notarized desktop build artifact",
        status: "blocked",
        agent: "Release",
        agentColor: "#ff453a",
        priority: "urgent",
        comments: 1,
      },
    ],
  },
  {
    status: "in_review",
    tasks: [
      {
        id: "task-142",
        ticket: "DEN-142",
        title: "Verify desktop toast handoff after workflow completion",
        status: "in_review",
        agent: "QA",
        agentColor: "#a78bfa",
        priority: "medium",
        comments: 3,
      },
    ],
  },
  {
    status: "done",
    tasks: [],
  },
];

const completedTask: DemoTask = taskboardColumns[4]!.tasks[0]!;

function controlsFrameGap() {
  return window.innerWidth >= 768 ? CONTROLS_FRAME_GAP_DESKTOP : CONTROLS_FRAME_GAP_MOBILE;
}

// Center every active card in the viewport. Apple's carousel does not change
// alignment at the first/last slide; keeping one rule avoids the visible jump
// that made some slides look wider or pushed to the edge.
function targetOffsetFor(index: number, geo: Geometry | null) {
  if (!geo) return 0;
  const { cardWidth, stride, viewportWidth } = geo;
  return index * stride - (viewportWidth - cardWidth) / 2;
}

function WebsiteOpeningMotion({
  state,
}: {
  state: "hidden" | "playing" | "final";
}) {
  const [typedPrompt, setTypedPrompt] = useState("");
  const displayedPrompt =
    state === "final" ? GITHUB_PROMPT : state === "playing" ? typedPrompt : "";

  useEffect(() => {
    if (state !== "playing") return;

    let typeId: number | undefined;
    const resetId = window.setTimeout(() => setTypedPrompt(""), 0);
    const startId = window.setTimeout(() => {
      let index = 0;
      typeId = window.setInterval(() => {
        index += 1;
        setTypedPrompt(GITHUB_PROMPT.slice(0, index));
        if (index >= GITHUB_PROMPT.length && typeId != null) {
          window.clearInterval(typeId);
        }
      }, GITHUB_TYPING_STEP_MS);
    }, GITHUB_TYPING_START_MS);

    return () => {
      window.clearTimeout(resetId);
      window.clearTimeout(startId);
      if (typeId != null) window.clearInterval(typeId);
    };
  }, [state]);

  return (
    <div
      aria-hidden="true"
      className="what-denker-motion-layer"
      data-active={state !== "hidden" ? "true" : undefined}
      data-motion-state={state}
    >
      <div className="what-denker-motion-browser">
        <WebsitePageSurface />
      </div>

      <form
        className={cn(
          surfaceRoleClassName("chrome"),
          "liquid-glass denker-input-bar-shell what-denker-motion-input flex flex-col border transition-all duration-200"
        )}
        onSubmit={(event) => event.preventDefault()}
        {...surfaceRoleAttributes("chrome", {
          nativeLevel: "root",
          nativeGroup: "input-bar",
        })}
        data-testid="cursor-input-bar"
      >
        <div className="flex min-h-[44px] items-center gap-2 py-1 pl-1 pr-2.5">
          <div className="flex items-center gap-0.5">
            <div data-testid="agent-dock" className="what-denker-official-agent-dock">
              <button
                type="button"
                className="what-denker-official-agent-chip group/chip relative flex shrink-0 items-center justify-center rounded-full font-semibold transition-all duration-200 ring-1 ring-accent/80 shadow-glow-accent-sm"
                aria-label="Select Denker"
                data-testid="agent-dock-denker"
                data-agent-name="denker"
                tabIndex={-1}
              >
                <AgentAvatarPreview
                  styleKey="glass"
                  seed="Denker"
                  size={36}
                  data-testid="agent-dock-denker-avatar"
                />
              </button>
            </div>
          </div>
          <textarea
            value={displayedPrompt}
            readOnly
            rows={1}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
            spellCheck={false}
            className="scrollbar-none min-w-0 flex-1 resize-none overflow-hidden bg-transparent py-1.5 text-appkit-subhead leading-5 text-primary outline-none placeholder:text-secondary"
            data-testid="input-bar-field"
            aria-label={GITHUB_PROMPT}
            tabIndex={-1}
          />
          <button
            type="button"
            aria-label="Send"
            data-testid="input-bar-send"
            className="what-denker-motion-send-button flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-primary transition-colors"
            tabIndex={-1}
          >
            <Icons.ArrowUp className="h-4 w-4" />
          </button>
        </div>
      </form>

      <DenkerCursorBubble className="what-denker-motion-bubble-start">
        Opening GitHub page...
      </DenkerCursorBubble>
      <DenkerCursorBubble className="what-denker-motion-bubble-done">
        GitHub page is opened
      </DenkerCursorBubble>
    </div>
  );
}

function WebsitePageSurface() {
  return (
    <div className="what-denker-website-surface" aria-hidden="true">
      <div className="github-page-topbar">
        <div className="github-page-menu">
          <List weight="bold" />
        </div>
        <GithubLogo weight="fill" className="github-page-mark" />
        <div className="github-page-repo">
          <span>Denker-AI</span>
          <span>/</span>
          <strong>denker-dolcetto</strong>
        </div>
        <div className="github-page-search">
          <MagnifyingGlass weight="bold" />
          <span>Type / to search</span>
        </div>
      </div>
      <div className="github-page-tabs">
        {["Code", "Issues", "Pull requests", "Agents", "Actions", "Projects", "Wiki"].map((tab) => (
          <span key={tab} className={tab === "Actions" ? "is-active" : undefined}>
            {tab}
          </span>
        ))}
      </div>
      <div className="github-page-body">
        <aside className="github-page-sidebar">
          <div className="github-page-sidebar-title">Actions</div>
          <div className="github-page-sidebar-pill is-selected">All workflows</div>
          {[
            "Build & Publish Desktop App",
            "CI",
            "Dependabot Updates",
            "Dependency Graph",
            "Deploy Preview",
            "Deploy Production",
            "Release",
          ].map((item) => (
            <div key={item} className="github-page-sidebar-item">
              {item}
            </div>
          ))}
        </aside>
        <main className="github-page-main">
          <div className="github-page-heading">
            <div>
              <h3>All workflows</h3>
              <p>Showing runs from all workflows</p>
            </div>
            <div className="github-page-filter">Filter workflow runs</div>
          </div>
          <section className="github-page-runs">
            <div className="github-page-runs-head">
              <strong>1,688 workflow runs</strong>
              <span>Workflow</span>
              <span>Event</span>
              <span>Status</span>
            </div>
            {githubRuns.map((run) => (
              <article key={`${run.title}-${run.time}`} className="github-page-run">
                <span className="github-page-check" />
                <div className="github-page-run-copy">
                  <h4>{run.title}</h4>
                  <p>{run.meta}</p>
                </div>
                <span className="github-page-branch">{run.branch}</span>
                <div className="github-page-time">
                  <span>{run.time}</span>
                  <span>{run.duration}</span>
                </div>
                <span className="github-page-more">...</span>
              </article>
            ))}
          </section>
        </main>
      </div>
    </div>
  );
}

function SummaryResearchMotion({
  state,
}: {
  state: "hidden" | "playing" | "final";
}) {
  return (
    <div
      aria-hidden="true"
      className="what-denker-motion-layer what-denker-summary-motion"
      data-active={state !== "hidden" ? "true" : undefined}
      data-motion-state={state}
    >
      <div className="what-denker-summary-browser">
        <AntlerArticleSurface />
      </div>
      <div className="what-denker-summary-frame">
        <SummaryFrameSurface />
      </div>
      <DenkerCursorBubble className="what-denker-summary-bubble-writing">
        Reading article and creating summary...
      </DenkerCursorBubble>
      <DenkerCursorBubble className="what-denker-summary-bubble-done">
        Summary frame presented - covers the 3 qualifying questions, competitor
        matrix categories, data sources table, and revenue estimation formula.
      </DenkerCursorBubble>
    </div>
  );
}

function AntlerArticleSurface() {
  return (
    <div className="what-denker-antler-window" aria-hidden="true">
      <div className="antler-browser-chrome">
        <div className="antler-browser-tab">
          <span className="antler-favicon">A</span>
          <span>Antler</span>
          <X />
        </div>
        <span className="antler-browser-plus">+</span>
        <MoreHorizontal />
      </div>
      <div className="antler-site-nav">
        <div className="antler-logo">
          <span>A</span>
          <strong>NTLER</strong>
        </div>
        <nav>
          <span>Locations</span>
          <span>Resources</span>
          <span>Portfolio</span>
          <span>Investors</span>
          <span>About</span>
        </nav>
        <button type="button">Apply</button>
      </div>
      <article className="antler-article">
        <div className="antler-share">
          <span>Share article</span>
          <strong>in</strong>
          <strong>x</strong>
        </div>
        <p>
          It doesn&apos;t matter what sector or vertical you&apos;re entering, your
          startup is going to have to deal with competition. Your business idea
          should be a game changer in some way.
        </p>
        <h3>Why focus on what your competitors are doing?</h3>
        <p>
          Knowing your competition is as important as knowing your own business
          and your customers. A competitor analysis helps you understand where
          rivals&apos; strengths and weaknesses lie.
        </p>
        <p>
          You can do a competitive analysis at any point in time, and it will be
          relevant. It should be an ongoing process as your startup grows.
        </p>
        <h3>Who are your competitors, anyway?</h3>
        <p>
          Start by identifying which companies solve a similar problem, serve the
          same customer segment, or use a comparable approach.
        </p>
      </article>
    </div>
  );
}

function SummaryFrameSurface() {
  const questionCards = [
    ["01", "Who", "Do they target the same customer segment?"],
    ["02", "What", "Do they solve a similar problem?"],
    ["03", "How", "Is their solution approach comparable?"],
  ];

  const matrixRows = [
    ["Business Overview", "Founding date, team size, revenue, customer count"],
    ["GTM / Acquisition", "Awareness, sentiment, acquisition channels"],
    ["Product Offering", "Pricing, features, sales model"],
    ["SWOT Analysis", "Strengths, weaknesses, opportunities, threats"],
  ];

  return (
    <div
      className={cn(
        surfaceRoleClassName("frame"),
        "hero-production-object hero-production-window what-denker-summary-production-frame relative flex h-full flex-col overflow-hidden border-glass-stroke"
      )}
      {...surfaceRoleAttributes("frame", {
        nativeLevel: "root",
        nativeGroup: "landing-summary-preview",
      })}
    >
      <FrameHeader
        title="Competitor Analysis - Antler Guide Summary"
        icon={Icons.Globe}
        accentColor="bg-[var(--summary-frame-accent-color)]"
        agentName="Denker"
        agentAvatarSeed="Denker"
        pinned
        onTogglePin={() => undefined}
        onHide={() => undefined}
        data-testid="what-denker-summary-frame-header"
      />
      <main className="summary-frame-body">
        <h4>How To Do A Competitor Analysis</h4>
        <p>3 qualifying questions to identify real competitors</p>
        <div className="summary-question-grid">
          {questionCards.map(([number, label, copy]) => (
            <div key={number} className="summary-question-card">
              <strong>{number}</strong>
              <span>{label}</span>
              <p>{copy}</p>
            </div>
          ))}
        </div>
        <section className="summary-table-section">
          <h5>Competitor matrix - what to track</h5>
          <div className="summary-table">
            <div className="summary-table-row summary-table-head">
              <span>Category</span>
              <span>Data Points</span>
            </div>
            {matrixRows.map(([category, data], index) => (
              <div key={category} className="summary-table-row">
                <strong>{category}</strong>
                <span className={index === 0 ? "is-highlighted" : undefined}>
                  {data}
                </span>
              </div>
            ))}
          </div>
        </section>
        <section className="summary-table-section">
          <h5>Where to find competitor data</h5>
          <div className="summary-table summary-source-table">
            <div className="summary-table-row summary-table-head">
              <span>Source</span>
              <span>What You Get</span>
            </div>
            <div className="summary-table-row">
              <strong>LinkedIn</strong>
              <span>Employee count, team growth, similar pages</span>
            </div>
          </div>
        </section>
      </main>
      <FrameFooter
        onComment={() => undefined}
        onExpand={() => undefined}
        onDelete={() => undefined}
        data-testid="what-denker-summary-frame-footer"
        inlineActions={
          <>
            <button type="button" aria-label="Attach source" className="summary-frame-action">
              <Paperclip />
            </button>
            <button type="button" aria-label="Open source" className="summary-frame-action">
              <ExternalLink />
            </button>
          </>
        }
        extraOverflowItems={null}
      />
    </div>
  );
}

function GmailReplyMotion({
  state,
}: {
  state: "hidden" | "playing" | "final";
}) {
  const [pasted, setPasted] = useState(false);
  const displayedReply =
    state === "final" || (state === "playing" && pasted) ? GMAIL_REPLY_TEXT : "";

  useEffect(() => {
    if (state !== "playing") return;
    const resetId = window.setTimeout(() => setPasted(false), 0);
    const pasteId = window.setTimeout(() => setPasted(true), GMAIL_PASTE_START_MS);
    return () => {
      window.clearTimeout(resetId);
      window.clearTimeout(pasteId);
    };
  }, [state]);

  return (
    <div
      aria-hidden="true"
      className="what-denker-motion-layer what-denker-gmail-motion"
      data-active={state !== "hidden" ? "true" : undefined}
      data-motion-state={state}
    >
      <div className="what-denker-gmail-browser">
        <GmailReplySurface pastedReply={displayedReply} />
      </div>
      <DenkerCursorBubble className="what-denker-gmail-bubble-paste">
        {GMAIL_BUBBLE_TEXT}
      </DenkerCursorBubble>
    </div>
  );
}

function GmailReplySurface({ pastedReply }: { pastedReply: string }) {
  const questionItems = [
    "Does Denker work with tools like Slack, Notion, GitHub, and Google Drive?",
    "Are there any limits on voice interactions or AI tasks in the Pro plan?",
    "Can I use Denker across multiple devices with a single subscription?",
    "Is there a team plan available for startups with 5-10 members?",
    "What happens to my saved context and AI history if I upgrade from the free plan?",
  ];
  const mailboxItems = [
    { label: "Inbox", count: "565", Icon: Inbox, active: true },
    { label: "Starred", Icon: Star },
    { label: "Snoozed", Icon: Clock3 },
    { label: "Sent", Icon: Send },
    { label: "Drafts", count: "2", Icon: FileText },
    { label: "Purchases", count: "28", Icon: Tag },
  ];

  return (
    <div className="gmail-demo-window" aria-hidden="true">
      <div className="gmail-demo-chrome">
        <div className="gmail-demo-chrome-tabs">
          <div className="gmail-demo-window-controls">
            <span />
            <span />
            <span />
          </div>
          <div className="gmail-demo-tab">
            <Image src="/logos/gmail.svg" alt="" width={18} height={18} draggable={false} />
            <span>Gmail</span>
            <X />
          </div>
          <div className="gmail-demo-plus">+</div>
        </div>
        <div className="gmail-demo-chrome-nav">
          <ChevronLeft />
          <ChevronRight />
          <RefreshCw />
          <div className="gmail-demo-address">
            <LockKeyhole />
            <span>
              https://mail.google.com/mail/u/0/#inbox/FMfcgzQbfJmVQjsw
            </span>
          </div>
          <MoreHorizontal />
        </div>
      </div>

      <div className="gmail-demo-app">
        <header className="gmail-demo-gmail-topbar">
          <div className="gmail-demo-brand">
            <List weight="bold" />
            <Image src="/logos/gmail.svg" alt="" width={25} height={25} draggable={false} />
            <strong>Gmail</strong>
          </div>
          <div className="gmail-demo-search">
            <Search />
            <span>Search mail</span>
            <SlidersHorizontal />
          </div>
          <div className="gmail-demo-toolbar-icons">
            <HelpCircle />
            <Settings />
            <span className="gmail-demo-ai-spark" />
            <Grid3X3 />
            <span className="gmail-demo-profile" />
          </div>
        </header>

        <div className="gmail-demo-content">
          <aside className="gmail-demo-sidebar">
            <button type="button"><Pencil /> Compose</button>
            <nav>
              {mailboxItems.map(({ label, count, Icon, active }) => (
                <span key={label} className={active ? "is-selected" : undefined}>
                  <Icon />
                  <em>{label}</em>
                  {count && <strong>{count}</strong>}
                </span>
              ))}
              <span><ChevronRight /><em>More</em></span>
            </nav>
            <div className="gmail-demo-label-title">Labels <strong>+</strong></div>
          </aside>

          <main className="gmail-demo-main">

          <section className="gmail-demo-thread-shell">
            <div className="gmail-demo-thread-actions">
              <div>
                <ChevronLeft />
                <Archive />
                <AlertCircle />
                <Trash2 />
                <Mail />
                <MoreHorizontal />
              </div>
              <div>
                <strong>1 of 777</strong>
                <ChevronLeft />
                <ChevronRight />
                <Keyboard />
              </div>
            </div>
            <div className="gmail-demo-thread">
              <div className="gmail-demo-thread-window-actions">
                <Printer />
                <Maximize2 />
              </div>
              <div className="gmail-demo-subject-row">
                <h3>Questions About Denker Pro Before Purchasing</h3>
                <span>Inbox x</span>
              </div>

              <div className="gmail-demo-sender">
                <span className="gmail-demo-avatar" />
                <div>
                  <strong>Raj Vamja</strong>
                  <span>&lt;work.rajvamja@gmail.com&gt;</span>
                  <small>to me</small>
                </div>
                <div className="gmail-demo-sender-actions">
                  <time>16:39 (18 hours ago)</time>
                  <Star />
                  <Smile />
                  <Reply />
                  <MoreHorizontal />
                </div>
              </div>

              <article className="gmail-demo-message">
                <p>Hi Denker Team,</p>
                <p>
                  I&apos;ve been exploring Denker over the past few days and I&apos;m
                  impressed with how it handles research and workflow automation.
                </p>
                <p>Before upgrading to the Pro plan, I have a few questions:</p>
                <ul>
                  {questionItems.map((question) => (
                    <li key={question}>{question}</li>
                  ))}
                </ul>
                <p>Looking forward to your response.</p>
                <p>Thanks,</p>
                <p><strong>Lucas Martin</strong><br />Founder, Nova Labs</p>
              </article>

              <div className="gmail-demo-reply">
                <div className="gmail-demo-reply-head">
                  <span className="gmail-demo-avatar is-small" />
                  <strong>Raj Vamja</strong>
                  <span>(work.rajvamja@gmail.com)</span>
                </div>
                <div className="gmail-demo-reply-input">
                  <span>{pastedReply}</span>
                  {pastedReply && <span className="gmail-demo-caret" />}
                </div>
                <div className="gmail-demo-smart-compose">
                  <Pencil />
                  <span>Describe your message</span>
                  <Undo2 />
                  <Redo2 />
                </div>
                <div className="gmail-demo-reply-tools">
                  <button type="button">Send <ChevronRight /></button>
                  <span>Aa</span>
                  <Pencil />
                  <Paperclip />
                  <Link />
                  <Smile />
                  <ImageIcon />
                  <Lock />
                  <MoreHorizontal />
                  <Trash2 />
                </div>
              </div>
            </div>
          </section>
          </main>

          <aside className="gmail-demo-right-rail">
            <span className="gmail-demo-calendar"><CalendarDays /><b>31</b></span>
            <Lightbulb />
            <CircleCheck />
            <UserRound />
            <i />
            <Plus />
          </aside>
        </div>
      </div>
    </div>
  );
}

function ProductionTaskboardSurface({ active }: { active: boolean }) {
  const movingTask: DemoTask = { ...completedTask };

  return (
    <div
      className={cn(surfaceRoleClassName("frame"), "liquid-glass what-denker-taskboard-shell border")}
      aria-hidden="true"
      data-active={active ? "true" : undefined}
      {...surfaceRoleAttributes("frame", {
        nativeLevel: "root",
        nativeGroup: "landing-taskboard-preview",
      })}
    >
      <FrameHeader
        title="Task Board"
        icon={Icons.Kanban}
        accentColor="bg-accent"
        pinned
        onTogglePin={() => undefined}
        onHide={() => undefined}
        data-testid="what-denker-taskboard-frame-header"
      />

      {/* Board content — production taskboard-frame wraps the columns in
          "flex min-h-0 flex-1 gap-1.5 overflow-x-auto px-2 py-1"; the demo
          clips instead of scrolling. */}
      <div className="taskboard-columns scrollbar-none flex min-h-0 flex-1 gap-1.5 overflow-hidden px-2 py-1">
        {taskboardColumns.map((column) => (
          <KanbanColumn
            key={column.status}
            status={column.status}
            tasks={column.tasks}
            countTransitionTo={column.status === "done" ? column.tasks.length + 1 : undefined}
            getCardClassName={(task) =>
              task.id === completedTask.id ? "taskboard-card-moving-source" : undefined
            }
          />
        ))}
      </div>

      <FrameFooter
        onComment={() => undefined}
        onExpand={() => undefined}
        onDelete={() => undefined}
        data-testid="what-denker-taskboard-frame-footer"
      />

      {/* Moving-card choreography — a clone of the completed task that slides
          from "In Review" into "Done" (shell-relative positioning in the
          taskboard choreography CSS). */}
      <div className="taskboard-moving-task">
        <KanbanCard task={movingTask} />
      </div>

      <div className="taskboard-toast">
        <div className="taskboard-toast-topbar">
          <div>
            <span className="taskboard-toast-icon">
              <Icons.Check />
            </span>
            <span>Completed</span>
          </div>
          <Icons.X />
        </div>
        <div className="taskboard-toast-body">
          <AgentAvatarPreview styleKey="glass" seed="Denker" size={24} />
          <div>
            <strong>Task completed</strong>
            <p>{completedTask.title}</p>
            <span>Denker</span>
          </div>
        </div>
        <div className="taskboard-toast-action">View</div>
      </div>

      <DenkerCursorBubble
        className="taskboard-agent-cursor taskboard-agent-cursor-coder"
        name="Coder"
        color="#5AC8FA"
        maxWidthPx={230}
      >
        Opening PR for DEN-118
      </DenkerCursorBubble>
      <DenkerCursorBubble
        className="taskboard-agent-cursor taskboard-agent-cursor-research"
        name="Research"
        color="#B7A6FF"
        maxWidthPx={230}
      >
        Drafting competitor notes for DEN-101
      </DenkerCursorBubble>
    </div>
  );
}

export function WhatDenkerCanDo() {
  const sectionRef = useRef<HTMLElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [active, setActive] = useState(0);
  // Autoplay starts off; it's turned on once the section's fade-in completes.
  const [playing, setPlaying] = useState(false);
  const [firstDemoStarted, setFirstDemoStarted] = useState(false);
  const [firstDemoCompleted, setFirstDemoCompleted] = useState(false);
  const [summaryDemoCompleted, setSummaryDemoCompleted] = useState(false);
  const [gmailDemoCompleted, setGmailDemoCompleted] = useState(false);
  const [graphDemoCompleted, setGraphDemoCompleted] = useState(false);
  const [controlsMode, setControlsMode] = useState<ControlsMode>("hidden");
  const [controlsTop, setControlsTop] = useState<number | null>(null);
  // The settled offset is fully derived from active+geo; dragOffset is a
  // temporary override that's only non-null while actively dragging.
  const [dragOffset, setDragOffset] = useState<number | null>(null);
  const dragRef = useRef({ startX: 0, startOffset: 0 });

  const settledOffset = targetOffsetFor(active, geo);
  const offset = dragOffset ?? settledOffset;
  const dragging = dragOffset !== null;

  const restartDemoForSlide = (index: number) => {
    if (index === 0) {
      setFirstDemoStarted(true);
      setFirstDemoCompleted(false);
    } else if (index === 1) {
      setSummaryDemoCompleted(false);
    } else if (index === 2) {
      setGmailDemoCompleted(false);
    } else if (index === 4) {
      setGraphDemoCompleted(false);
    }
  };

  const selectSlide = (index: number) => {
    setActive(index);
    restartDemoForSlide(index);
    setPlaying(true);
  };

  const togglePlayback = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    restartDemoForSlide(active);
    setPlaying(true);
  };

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const deck = deckRef.current;
    if (!wrapper || !deck) return;

    const measure = () => {
      const card0 = deck.children[0] as HTMLElement | undefined;
      const card1 = deck.children[1] as HTMLElement | undefined;
      if (!card0 || !card1) return;
      setGeo({
        cardWidth: card0.offsetWidth,
        stride: card1.offsetLeft - card0.offsetLeft,
        viewportWidth: window.innerWidth,
      });
    };

    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(wrapper);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing || dragging || active !== 3) return;

    const next = (active + 1) % slides.length;
    const id = window.setTimeout(() => {
      setActive(next);
      if (next === 0) {
        setFirstDemoStarted(true);
        setFirstDemoCompleted(false);
      }
    }, TASKBOARD_DEMO_MOTION_MS + DEMO_FINAL_HOLD_MS);

    return () => window.clearTimeout(id);
  }, [active, dragging, playing]);

  useEffect(() => {
    if (
      !playing ||
      !firstDemoStarted ||
      active !== 0 ||
      dragging
    ) {
      return;
    }
    const completeId = window.setTimeout(() => {
      setFirstDemoCompleted(true);
    }, FIRST_DEMO_MOTION_MS);
    const advanceId = window.setTimeout(() => {
      setSummaryDemoCompleted(false);
      setActive(1);
    }, FIRST_DEMO_MOTION_MS + DEMO_FINAL_HOLD_MS);

    return () => {
      window.clearTimeout(completeId);
      window.clearTimeout(advanceId);
    };
  }, [active, dragging, firstDemoStarted, playing]);

  useEffect(() => {
    if (
      !playing ||
      active !== 1 ||
      dragging
    ) {
      return;
    }
    const completeId = window.setTimeout(() => {
      setSummaryDemoCompleted(true);
    }, SUMMARY_DEMO_MOTION_MS);
    const advanceId = window.setTimeout(() => {
      setGmailDemoCompleted(false);
      setActive(2);
    }, SUMMARY_DEMO_MOTION_MS + DEMO_FINAL_HOLD_MS);

    return () => {
      window.clearTimeout(completeId);
      window.clearTimeout(advanceId);
    };
  }, [active, dragging, playing]);

  useEffect(() => {
    if (!playing || active !== 2 || dragging) {
      return;
    }
    const completeId = window.setTimeout(() => {
      setGmailDemoCompleted(true);
    }, GMAIL_DEMO_MOTION_MS);
    const advanceId = window.setTimeout(
      () => setActive(3),
      GMAIL_DEMO_MOTION_MS + DEMO_FINAL_HOLD_MS
    );

    return () => {
      window.clearTimeout(completeId);
      window.clearTimeout(advanceId);
    };
  }, [active, dragging, playing]);

  useEffect(() => {
    if (!playing || active !== 4 || dragging) return;
    const completeId = window.setTimeout(() => {
      setGraphDemoCompleted(true);
    }, GRAPH_DEMO_MOTION_MS);
    const advanceId = window.setTimeout(() => {
      setFirstDemoStarted(true);
      setFirstDemoCompleted(false);
      setActive(0);
    }, GRAPH_DEMO_MOTION_MS + DEMO_FINAL_HOLD_MS);
    return () => {
      window.clearTimeout(completeId);
      window.clearTimeout(advanceId);
    };
  }, [active, dragging, playing]);

  useEffect(() => {
    const updateControlsMode = () => {
      const section = sectionRef.current;
      const deck = deckRef.current;
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const sectionHasStarted = rect.top < viewportHeight * 0.72;
      const sectionHasPassed = rect.bottom <= 0;
      const activeCard = deck?.children[active]?.firstElementChild as HTMLElement | undefined;
      const cardBottom = activeCard?.getBoundingClientRect().bottom ?? null;
      const frameGap = controlsFrameGap();
      const anchoredControlTop =
        cardBottom == null ? null : cardBottom - rect.top + frameGap;
      const maxControlTop = viewportHeight - CONTROLS_HEIGHT - CONTROLS_MIN_BOTTOM;

      if (!sectionHasStarted || sectionHasPassed) {
        setControlsMode("hidden");
        setControlsTop(null);
        return;
      }

      if (rect.bottom <= viewportHeight) {
        setControlsMode("anchored");
        setControlsTop(anchoredControlTop);
        return;
      }

      setControlsMode("fixed");
      setControlsTop(
        cardBottom == null
          ? maxControlTop
          : Math.min(cardBottom + frameGap, maxControlTop)
      );
    };

    updateControlsMode();
    window.addEventListener("scroll", updateControlsMode, { passive: true });
    window.addEventListener("resize", updateControlsMode);
    return () => {
      window.removeEventListener("scroll", updateControlsMode);
      window.removeEventListener("resize", updateControlsMode);
    };
  }, [active]);

  const onPointerDown = (e: React.PointerEvent) => {
    setPlaying(false);
    dragRef.current = { startX: e.clientX, startOffset: settledOffset };
    setDragOffset(settledOffset);
    try {
      (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    } catch {
      // ignore — pointer capture isn't essential to the drag itself
    }
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (dragOffset === null) return;
    const dx = e.clientX - dragRef.current.startX;
    setDragOffset(dragRef.current.startOffset - dx);
  };

  const onPointerUp = () => {
    if (dragOffset === null) return;
    let nearest = 0;
    let nearestDist = Infinity;
    for (let i = 0; i < slides.length; i++) {
      const dist = Math.abs(targetOffsetFor(i, geo) - dragOffset);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    }
    setDragOffset(null);
    setActive(nearest);
  };

  return (
    <section
      ref={sectionRef}
      id="features"
      className="section-panel relative isolate flex w-full flex-col items-center overflow-x-clip bg-grey-900 py-20 md:py-24"
      data-name="Section - What denker can do?"
      data-theme="dark"
    >
      <Container className="relative z-10 flex flex-col items-start gap-8 px-10 md:gap-10 md:px-20 min-[1420px]:!px-2.5">
        <div className="relative left-1/2 w-screen -translate-x-1/2">
          <BlurText
            as="h2"
            className="what-denker-heading-align apple-section-heading text-[28px] leading-[31px] font-semibold text-white min-[520px]:text-[32px] min-[520px]:leading-[35px] min-[761px]:text-[36px] min-[761px]:leading-[39px] min-[901px]:text-[38px] min-[901px]:leading-[41px] min-[1181px]:text-[48px] min-[1181px]:leading-[52px]"
            text="Explore what Denker can do."
          />
        </div>

        <FadeIn
          delay={0.15}
          className="relative left-1/2 w-screen -translate-x-1/2"
          onComplete={() => {
            setFirstDemoStarted(true);
            setPlaying(true);
          }}
        >
          <div ref={wrapperRef} className="relative w-screen">
            <div
              ref={deckRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className={cn(
                "flex w-max cursor-grab gap-5 select-none active:cursor-grabbing",
                !dragging && "transition-transform duration-500 ease-out"
              )}
              style={{ transform: `translateX(${-offset}px)` }}
            >
              {slides.map((slide, i) => {
                const isActive = i === active;

                return (
                  <div
                    key={slide.id}
                    data-denker-feature-card
                    className="what-denker-feature-card shrink-0"
                  >
                    <div className="what-denker-feature-frame what-denker-photo-card relative w-full overflow-hidden shadow-[0_22px_80px_rgba(0,0,0,0.34)]">
                      <Image
                        src={slide.background}
                        alt=""
                        fill
                        priority={i === 0}
                        sizes="(min-width: 1900px) 1260px, (min-width: 1500px) 66vw, (min-width: 1280px) 70vw, (min-width: 1080px) 76vw, (min-width: 768px) 84vw, (min-width: 640px) 78vw, calc(100vw - 48px)"
                        draggable={false}
                        className="what-denker-feature-background pointer-events-none"
                        style={{ objectFit: "cover", objectPosition: "center 48%" }}
                      />
                      <div aria-hidden="true" className="what-denker-photo-vignette" />
                      {slide.id === 0 && (
                        <WebsiteOpeningMotion
                          state={
                            !isActive
                              ? "hidden"
                              : firstDemoCompleted || (firstDemoStarted && !playing)
                                ? "final"
                                : firstDemoStarted
                                  ? "playing"
                                  : "hidden"
                          }
                        />
                      )}
                      {slide.id === 1 && (
                        <SummaryResearchMotion
                          state={
                            !isActive
                              ? "hidden"
                              : summaryDemoCompleted
                                ? "final"
                                : playing
                                  ? "playing"
                                  : "hidden"
                          }
                        />
                      )}
                      {slide.id === 2 && (
                        <GmailReplyMotion
                          state={
                            !isActive
                              ? "hidden"
                              : gmailDemoCompleted
                                ? "final"
                                : playing
                                  ? "playing"
                                  : "hidden"
                          }
                        />
                      )}
                      {slide.id === 3 && <ProductionTaskboardSurface active={isActive} />}
                      {slide.id === 4 && (
                        <MemoryGraphMotion
                          state={
                            !isActive
                              ? "hidden"
                              : graphDemoCompleted
                                ? "final"
                                : playing
                                  ? "playing"
                                  : "hidden"
                          }
                        />
                      )}
                      <p
                        aria-hidden={!isActive}
                        data-copy-layout={slide.id === 1 ? "side" : "centered"}
                        className={cn(
                          "what-denker-feature-copy absolute top-6 left-1/2 z-30 w-[min(560px,calc(100%-64px))] -translate-x-1/2 whitespace-pre-line text-center font-sans text-[17px] leading-[22px] font-semibold text-white transition-[opacity,transform] duration-300 sm:text-[24px] sm:leading-[28px] md:top-8 md:text-[28px] md:leading-[32px]",
                          isActive
                            ? "translate-y-0 opacity-100"
                            : "-translate-y-2 opacity-0"
                        )}
                      >
                        {slide.copy}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </FadeIn>
      </Container>
      <div
        className={cn(
          "bottom-10 left-1/2 z-30 flex -translate-x-1/2 items-center gap-4 transition-[opacity,transform] duration-300",
          controlsMode === "fixed" && "fixed",
          controlsMode === "anchored" && "absolute",
          controlsMode === "hidden"
            ? "pointer-events-none fixed translate-y-4 opacity-0"
            : "translate-y-0 opacity-100"
        )}
        style={
          controlsMode !== "hidden" && controlsTop != null
            ? { top: controlsTop, bottom: "auto" }
            : undefined
        }
      >
        <div className="flex h-14 items-center gap-3.5 rounded-full bg-black/60 px-7 shadow-[0_18px_44px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl">
          {slides.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === active ? "true" : undefined}
              onClick={() => selectSlide(i)}
              className={`h-2 rounded-full transition-all ${
                i === active ? "w-14 bg-white" : "w-2 bg-white/55 hover:bg-white/75"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          aria-label={playing ? "Pause carousel" : "Play carousel"}
          onClick={togglePlayback}
          className="flex size-14 items-center justify-center rounded-full bg-black/60 text-white shadow-[0_18px_44px_rgba(0,0,0,0.32),inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl transition-colors hover:bg-black/72"
        >
          {playing ? (
            <Pause weight="fill" className="size-4" />
          ) : (
            <Play weight="fill" className="ml-0.5 size-4" />
          )}
        </button>
      </div>
    </section>
  );
}
