export interface NewsletterFeature {
  title: string;
  badge: string;
  badgeColor: "green" | "amber" | "blue";
  description: string;
  tagline: string;
  image?: string;
}

export interface Newsletter {
  slug: string;
  title: string;
  subject: string;
  previewText: string;
  date: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  features: NewsletterFeature[];
  cta: {
    text: string;
    url: string;
    /** "waitlist" renders inline form; "button" renders a link button. Default: "waitlist" */
    style?: "waitlist" | "button";
  };
  status: "draft" | "sent";
  sentAt?: string;
}

/* ── Newsletter registry ─────────────────────────────────────
 * Each newsletter is defined inline. For a small number of issues
 * this is simpler than loading JSON files at build time.
 * When the list grows past ~10, consider moving to MDX or a CMS.
 */

export const newsletters: Newsletter[] = [
  {
    slug: "denker-is-live",
    title: "Denker Is Live",
    subject: "Denker is live — your AI workspace is ready",
    previewText:
      "No more waitlist. Sign in with Google and start working with AI agents on an infinite canvas — right now.",
    date: "2026-03-30",
    heroTitle: "Denker Is Live",
    heroSubtitle: "Where humans and AI agents co-work visually",
    intro:
      "We've been building something different — not another chatbot, not another workflow builder. Today we're opening the doors. Denker is now live at space.denker.ai. Sign in with your Google account and you're in. No waitlist, no invite codes. This is the workspace where you and your AI agents work side by side on one limitless canvas. Every task is visible. Every agent step is transparent. You direct. They execute.",
    features: [
      {
        title: "The Infinite Canvas",
        badge: "CORE",
        badgeColor: "green",
        description:
          "Everything lives on one infinite canvas. Research, code, emails, data charts, workflows — each in its own frame, rendered live as agents work on them. No tabs. No hidden windows. No juggling context. Your entire workspace, at a glance.",
        tagline: "One surface. Everything visible.",
        image: "/blog/assets/denker-is-live/canvas.svg",
      },
      {
        title: "AI Agents as Teammates",
        badge: "CORE",
        badgeColor: "green",
        description:
          "Agents aren't tools you configure — they're teammates you invite. Each has a name, avatar, and cursor on the canvas. Aria researches. Kai writes code. Mia drafts outreach. You see them working in real time, and you can step in at any moment.",
        tagline: "Your agents have names. And you can see them work.",
        image: "/blog/assets/denker-is-live/agents.svg",
      },
      {
        title: "Memory That Actually Works",
        badge: "CORE",
        badgeColor: "green",
        description:
          "Every conversation builds a knowledge graph — people, companies, projects, decisions — structured in a real database with vector search. Your agents remember context across sessions, and you can see exactly what they know. Not flat-file RAG. Real structured memory.",
        tagline: "Structured memory. Full transparency.",
        image: "/blog/assets/denker-is-live/memory.svg",
      },
      {
        title: "Natural Language Workflows",
        badge: "COMING SOON",
        badgeColor: "amber",
        description:
          "Describe what you want in plain language. Denker plans the steps, picks the right agents, and runs everything in parallel. Multi-step research, content pipelines, data analysis — no drag-and-drop builders, no JSON configs.",
        tagline: "Describe it. Denker runs it.",
        image: "/blog/assets/denker-is-live/workflows.svg",
      },
    ],
    cta: {
      text: "Get Started",
      url: "https://space.denker.ai",
      style: "button",
    },
    status: "draft",
  },
];

export function getNewsletter(slug: string): Newsletter | undefined {
  return newsletters.find((n) => n.slug === slug);
}

export function getAllNewsletters(): Newsletter[] {
  return newsletters.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
