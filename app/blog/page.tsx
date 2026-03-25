import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { getAllNewsletters } from "@/lib/newsletters";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Product updates, workflow ideas, and practical guides on working with AI agents from the Denker team.",
  alternates: { canonical: "/blog" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function BlogIndexPage() {
  const newsletters = getAllNewsletters();

  return (
    <div
      className="min-h-screen bg-canvas"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 65% 55% at 15% 20%, rgba(58,248,140,0.07) 0%, transparent 70%),
          radial-gradient(ellipse 55% 45% at 80% 60%, rgba(255,200,50,0.05) 0%, transparent 70%)
        `,
        backgroundSize: "100% 100%, 100% 100%",
        backgroundAttachment: "fixed, fixed",
      }}
    >
      <LandingNav />
      <main className="mx-auto max-w-4xl px-5 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <span className="badge-section mb-4 inline-flex">Blog</span>
          <h1
            className="text-section-heading mb-4"
            data-testid="blog-heading"
          >
            Updates from{" "}
            <span className="text-accent">Denker</span>
          </h1>
          <p className="mx-auto max-w-xl text-base text-secondary sm:text-lg">
            Product updates, workflow ideas, and practical guides on working
            with AI agents.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          {newsletters.map((n) => (
            <Link
              key={n.slug}
              href={`/blog/${n.slug}`}
              className="group rounded-2xl border border-glass-stroke bg-glass-fill p-6 backdrop-blur-glass transition-all hover:border-glass-stroke-light hover:shadow-glass"
              data-testid={`blog-card-${n.slug}`}
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
                  Newsletter
                </span>
                <span className="text-xs text-muted">
                  {formatDate(n.date)}
                </span>
              </div>
              <h2 className="mb-2 font-['Satoshi',sans-serif] text-xl font-bold text-primary transition-colors group-hover:text-accent">
                {n.title}
              </h2>
              <p className="text-sm leading-relaxed text-secondary">
                {n.previewText}
              </p>
            </Link>
          ))}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
