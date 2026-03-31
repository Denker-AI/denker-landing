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
  note?: string;
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
];

export function getNewsletter(slug: string): Newsletter | undefined {
  return newsletters.find((n) => n.slug === slug);
}

export function getAllNewsletters(): Newsletter[] {
  return newsletters.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}
