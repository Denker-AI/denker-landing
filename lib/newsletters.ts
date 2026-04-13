/* ── Blog post types ─────────────────────────────────────────
 * Supports newsletters (multi-feature, story-driven) and
 * changelogs (single-feature, keyword-rich for SEO).
 * When the list grows past ~10, consider moving to MDX or a CMS.
 */

export type BlogCategory = "newsletter" | "changelog" | "use-case";

export interface NewsletterFeature {
  title: string;
  badge: string;
  badgeColor: "green" | "amber" | "blue";
  description: string;
  tagline: string;
  image?: string;
}

export interface BlogPost {
  slug: string;
  category: BlogCategory;
  title: string;
  /** SEO meta title — keep under 60 chars. Falls back to title. */
  metaTitle?: string;
  /** SEO meta description — keep under 155 chars. Falls back to previewText. */
  metaDescription?: string;
  subject: string;
  previewText: string;
  date: string;
  heroTitle: string;
  heroSubtitle?: string;
  intro: string;
  /** Newsletters have multiple features; changelogs typically have one or none. */
  features: NewsletterFeature[];
  /** Standalone media for changelog posts (shown directly, not inside a feature card). */
  media?: string;
  note?: string;
  cta: {
    text: string;
    url: string;
    style?: "waitlist" | "button";
  };
  status: "draft" | "sent";
  sentAt?: string;
}

/** @deprecated Use BlogPost instead */
export type Newsletter = BlogPost;

/* ── Category display config ──────────────────────────────── */

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  newsletter: "Newsletter",
  changelog: "Changelog",
  "use-case": "Use Case",
};

export const CATEGORY_COLORS: Record<BlogCategory, string> = {
  newsletter: "bg-accent/10 text-accent",
  changelog: "bg-blue-500/10 text-blue-400",
  "use-case": "bg-amber-500/10 text-amber-400",
};

/* ── Post registry ────────────────────────────────────────── */

export const posts: BlogPost[] = [
  /* ── Newsletters ──────────────────────────────────────── */
  {
    slug: "denker-is-live",
    category: "newsletter",
    title: "Your AI Team Is Ready",
    subject: "Your AI team is ready.",
    previewText:
      "Welcome to the co-working space for humans and agents.",
    date: "2026-03-30",
    heroTitle: "Your AI team is ready",
    heroSubtitle: "Meet the workspace where agents actually work with you",
    intro:
      "What if your AI agents didn't just answer questions — they worked alongside you? Today we're opening Denker: a workspace where humans and AI agents collaborate on one infinite canvas. No waitlist, no invite codes. You direct. They execute.",
    features: [
      {
        title: "The Infinite Canvas",
        badge: "CORE",
        badgeColor: "green",
        description:
          "Everything lives on one infinite canvas. Research, code, emails, data — each in its own frame, rendered live as agents work. No tabs, no hidden windows. Your entire workspace at a glance.",
        tagline: "One surface. Everything visible.",
        image: "/blog/assets/denker-is-live/canvas.gif",
      },
      {
        title: "AI Agent Teams",
        badge: "CORE",
        badgeColor: "green",
        description:
          "Agents aren't tools you configure — they're teammates you invite. Each has a name, avatar, and cursor on the canvas. You see them working in real time, and you can step in at any moment.",
        tagline: "Your agents have names. And you can see them work.",
        image: "/blog/assets/denker-is-live/agents.gif",
      },
      {
        title: "Task Boards",
        badge: "CORE",
        badgeColor: "green",
        description:
          "Assign tasks to your agents and track everything on a visual board. See what's in progress, what's done, and what's next. Agents pick up work, report back, and move tasks forward — all visible on the canvas.",
        tagline: "Delegate. Track. Done.",
        image: "/blog/assets/denker-is-live/tasks.gif",
      },
    ],
    note: "If you were using app.denker.ai — your new home is space.denker.ai. The previous version will stay online until April 10.",
    cta: {
      text: "Get Started",
      url: "https://space.denker.ai",
      style: "button",
    },
    status: "draft",
  },
  {
    slug: "your-ai-team-leveled-up",
    category: "newsletter",
    title: "Your AI Team Just Leveled Up",
    subject: "Claude, GPT, Codex, OpenCode — all on one canvas.",
    previewText:
      "Use any AI model. Tasks run themselves. Your canvas is a real workspace now.",
    date: "2026-04-10",
    heroTitle: "Your AI team just leveled up",
    heroSubtitle: "Three big upgrades to how you work with agents",
    intro:
      "Since launch, we've been shipping fast. This update is a big one: you can now use any AI model you want, your tasks run themselves on schedule, and the canvas is a real workspace — not just an AI chat window. Here's what's new.",
    features: [
      {
        title: "Use Any AI",
        badge: "NEW",
        badgeColor: "green",
        description:
          "You're no longer locked into one AI. Denker now supports Claude Code, ChatGPT, OpenAI Codex, and OpenCode. Pick the best model for each task — or let your agents use different ones. Your existing subscriptions just became your AI team's toolkit.",
        tagline: "Your subscription, your choice.",
        image: "/blog/assets/your-ai-team-leveled-up/use-any-ai.mp4",
      },
      {
        title: "Tasks Run Themselves",
        badge: "NEW",
        badgeColor: "amber",
        description:
          "Set a due date on any task and an agent picks it up automatically. Organize work in Kanban boards, list views, or calendar view — just like any project tool, but with agents doing the work. Prioritize, schedule, and let your AI team handle the rest.",
        tagline: "Set it. Forget it. It's done.",
        image: "/blog/assets/your-ai-team-leveled-up/tasks-run-themselves.mp4",
      },
      {
        title: "A Real Workspace Now",
        badge: "UPGRADE",
        badgeColor: "blue",
        description:
          "Notes are now full rich text — headings, lists, formatting, everything you need. Highlight any frame on the canvas and add comments. Your canvas isn't just where AI works — it's where you think, annotate, and organize.",
        tagline: "Think. Annotate. Organize.",
        image: "/blog/assets/your-ai-team-leveled-up/real-workspace.mp4",
      },
    ],
    cta: {
      text: "Try it now",
      url: "https://space.denker.ai",
      style: "button",
    },
    status: "draft",
  },

  /* ── Use Cases ────────────────────────────────────────── */
  {
    slug: "autonomous-agent-teams-projects",
    category: "use-case",
    title: "Autonomous Agent Teams: When AI Agents Hand Off Work",
    metaTitle: "Autonomous Agent Teams That Collaborate on Projects",
    metaDescription:
      "Watch AI agents inside Denker hand off tasks — Researcher to Marketer on a Product Hunt launch, Coder and Designer on a bug project.",
    subject: "Autonomous agent teams, working together",
    previewText:
      "Agents that pick up tasks, hand work to each other, and report back on the canvas.",
    date: "2026-04-13",
    heroTitle: "Autonomous agent teams, working on real projects",
    heroSubtitle:
      "What autonomous agent teams look like in practice — picking up tasks, handing off work, and reporting back on one canvas.",
    intro:
      "What if your AI agents just… handled it? No waiting step by step. No copy-pasting between chats. That's the promise of autonomous agent teams — and it's what we've been building inside Denker. Agents pick up tasks from the board, hand work to each other, and report back on the canvas. Here's what that looked like across two real projects this week — a Product Hunt launch video, and an active bug queue.",
    features: [
      {
        title: "The handoff: Researcher to Marketer",
        badge: "HANDOFF",
        badgeColor: "green",
        description:
          "I had a Product Hunt launch video to prep. Instead of doing all the legwork myself, I dropped tasks onto the board. The Researcher agent went off to find what makes a great Product Hunt launch video. The Marketer agent picked up those findings and used them to revise the script. No copy-paste. No context-switching. Just agents passing work to each other.",
        tagline: "Delegate once. The handoff happens on its own.",
      },
      {
        title: "A different team. Same idea.",
        badge: "PARALLEL",
        badgeColor: "amber",
        description:
          "Then I switched to my Bug project. Different team — Coder and Designer live inside the same project space. I asked Denker to assign a bug fix. The Coder woke up, saw the task, and started working. I didn't have to wait. I kept thinking, kept adding tasks, while the agent executed in parallel.",
        tagline: "Keep thinking. Your agents keep shipping.",
      },
      {
        title: "You see the work. You review it like a colleague.",
        badge: "REVIEW",
        badgeColor: "blue",
        description:
          "How do you know an agent is doing the work right? The canvas shows you. Every deliverable lands on the canvas — a document, a design, a fix. Agents leave a comment when they're done or need approval. You can highlight any part and add a comment back, just like co-working with a teammate.",
        tagline: "Review as you go. Agents respond.",
      },
    ],
    media: "https://www.youtube.com/watch?v=Dps_opdhZi0",
    note: "The magic isn't any one agent being smart — it's agents working together, each doing what it's good at, so you can stay focused on what only you can do. Still early days, but it's starting to feel like something real.",
    cta: {
      text: "Try it now",
      url: "https://space.denker.ai",
      style: "button",
    },
    status: "draft",
  },

  /* ── Changelogs ───────────────────────────────────────── */
  {
    slug: "multi-cli-support",
    category: "changelog",
    title: "Multi-CLI Support — Claude Code, Codex, and OpenCode",
    metaTitle: "Multi-CLI Support: Use Claude, Codex, or OpenCode | Denker",
    metaDescription:
      "Denker now supports Claude Code, OpenAI Codex, and OpenCode. Pick the best AI model for each agent — no vendor lock-in.",
    subject: "Multi-CLI Support",
    previewText:
      "Use Claude Code, Codex, or OpenCode — pick the best model for each agent.",
    date: "2026-04-10",
    heroTitle: "Use any AI model you want",
    intro:
      "You're no longer locked into a single AI provider. Denker now supports Claude Code, OpenAI Codex, and OpenCode out of the box. Each agent on your canvas can run a different CLI — pick the best model for the job. Your existing subscriptions just work.",
    features: [],
    media: "/blog/assets/your-ai-team-leveled-up/use-any-ai.mp4",
    cta: {
      text: "Try it now",
      url: "https://space.denker.ai",
      style: "button",
    },
    status: "draft",
  },
  {
    slug: "kanban-list-calendar-views",
    category: "changelog",
    title: "Task Views — Kanban, List, and Calendar",
    metaTitle: "Kanban, List & Calendar Views for AI Tasks | Denker",
    metaDescription:
      "Organize AI agent tasks in Kanban boards, list views, or calendar view. Set due dates and agents pick up work automatically.",
    subject: "Task Views",
    previewText:
      "Organize AI tasks in Kanban, list, or calendar view. Set a due date and agents run automatically.",
    date: "2026-04-08",
    heroTitle: "Your tasks, your way",
    intro:
      "Managing AI agent work just got a lot easier. Switch between Kanban boards, list view, and calendar view — exactly like the project tools you already know. Set a due date on any task, assign an agent, and it picks up the work automatically. No prompting, no babysitting.",
    features: [],
    media: "/blog/assets/your-ai-team-leveled-up/tasks-run-themselves.mp4",
    cta: {
      text: "Try it now",
      url: "https://space.denker.ai",
      style: "button",
    },
    status: "draft",
  },
  {
    slug: "rich-text-notes-and-comments",
    category: "changelog",
    title: "Rich Text Notes and Frame Comments",
    metaTitle: "Rich Text Notes & Comments on Canvas | Denker",
    metaDescription:
      "Write rich text notes with headings, lists, and formatting. Highlight any frame and add comments — your canvas is a real workspace now.",
    subject: "Rich Text & Comments",
    previewText:
      "Full rich text editing and frame commenting — your canvas is a real workspace now.",
    date: "2026-04-07",
    heroTitle: "Your canvas is a real workspace now",
    intro:
      "Notes on the canvas are now full rich text — headings, lists, bold, italic, everything you need. And you can highlight any frame and leave comments right where the work happens. The canvas isn't just where AI outputs appear — it's where you think, annotate, and organize.",
    features: [],
    media: "/blog/assets/your-ai-team-leveled-up/real-workspace.mp4",
    cta: {
      text: "Try it now",
      url: "https://space.denker.ai",
      style: "button",
    },
    status: "draft",
  },
];

/* ── Accessors ────────────────────────────────────────────── */

export function getPost(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug);
}

export function getAllPosts(category?: BlogCategory): BlogPost[] {
  const filtered = category ? posts.filter((p) => p.category === category) : posts;
  return filtered.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

/** @deprecated Use getPost instead */
export const getNewsletter = getPost;

/** @deprecated Use getAllPosts instead */
export const getAllNewsletters = getAllPosts;
