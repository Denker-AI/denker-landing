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
    slug: "introducing-denker",
    title: "Introducing Denker",
    subject: "Introducing Denker — Where humans and AI agents co-work visually",
    previewText:
      "A limitless canvas workspace where your AI agents research, write, code, and automate — all visible in real time.",
    date: "2026-03-20",
    heroTitle: "Meet Denker",
    heroSubtitle: "Where humans and AI agents co-work visually",
    intro:
      "We've been building something different. Not another chatbot. Not another workflow builder. Denker is a visual workspace where you and your AI agents work side by side — on one limitless canvas. Every task is visible. Every agent step is transparent. You direct. They execute.",
    features: [
      {
        title: "The Canvas",
        badge: "CORE",
        badgeColor: "green",
        description:
          "Everything lives on one infinite canvas. Research, code, emails, data charts, workflows — each in its own frame, rendered live as agents work on them. No tabs. No hidden windows. Your entire workspace, at a glance.",
        tagline: "One surface. Everything visible.",
        image: "/blog/assets/introducing-denker/canvas.png",
      },
      {
        title: "AI Agents as Teammates",
        badge: "CORE",
        badgeColor: "green",
        description:
          "Agents aren't tools you configure — they're teammates you invite. Each has a name, avatar, and cursor on the canvas. Aria researches. Kai writes code. Mia drafts outreach. You see them working in real time, and you can step in at any moment.",
        tagline: "Your agents have names. And you can see them work.",
        image: "/blog/assets/introducing-denker/agents.png",
      },
      {
        title: "Memory That Actually Works",
        badge: "CORE",
        badgeColor: "green",
        description:
          "Every conversation builds a knowledge graph — people, companies, projects, decisions — structured in a real database with vector search. Not flat-file RAG. Your agents remember context across sessions, and you can see exactly what they know.",
        tagline: "Structured memory. Full transparency.",
        image: "/blog/assets/introducing-denker/memory.png",
      },
      {
        title: "Natural Language Workflows",
        badge: "COMING SOON",
        badgeColor: "amber",
        description:
          "Describe what you want in plain language. Denker plans the steps, picks the right agents, and runs everything in parallel. Multi-step research, content pipelines, data analysis — no drag-and-drop builders, no JSON configs.",
        tagline: "Describe it. Denker runs it.",
        image: "/blog/assets/introducing-denker/workflows.png",
      },
    ],
    cta: {
      text: "Join the Waitlist",
      url: "https://www.denker.ai/#community",
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
