import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { WaitlistForm } from "@/components/waitlist-form";
import { getAllNewsletters, getNewsletter } from "@/lib/newsletters";
import type { NewsletterFeature } from "@/lib/newsletters";

export function generateStaticParams() {
  return getAllNewsletters().map((n) => ({ slug: n.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const n = getNewsletter(slug);
    if (!n) return { title: "Not Found" };
    return {
      title: n.title,
      description: n.previewText,
      alternates: { canonical: `/blog/${n.slug}` },
      openGraph: {
        title: n.subject,
        description: n.previewText,
        type: "article",
        publishedTime: n.date,
      },
    };
  });
}

const BADGE_COLORS: Record<string, string> = {
  green: "bg-accent/10 text-accent",
  amber: "bg-amber-500/10 text-amber-400",
  blue: "bg-blue-500/10 text-blue-400",
};

function FeatureCard({ feature }: { feature: NewsletterFeature }) {
  return (
    <div
      className="rounded-2xl border border-glass-stroke bg-glass-fill p-6 backdrop-blur-glass sm:p-8"
      data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <span
        className={`mb-3 inline-block rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${BADGE_COLORS[feature.badgeColor] ?? BADGE_COLORS.green}`}
      >
        {feature.badge}
      </span>
      <h3 className="mb-2 font-['Satoshi',sans-serif] text-xl font-bold text-primary sm:text-2xl">
        {feature.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-secondary sm:text-base">
        {feature.description}
      </p>
      {feature.image && (
        <div className="mb-4 overflow-hidden rounded-xl border border-glass-stroke-subtle">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={feature.image}
            alt={feature.title}
            className="w-full"
            loading="lazy"
          />
        </div>
      )}
      <p className="text-sm italic text-muted">{feature.tagline}</p>
    </div>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function NewsletterPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const n = getNewsletter(slug);
  if (!n) notFound();

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
      <main className="mx-auto max-w-3xl px-5 pb-24 pt-32 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8" aria-label="Breadcrumb">
          <Link
            href="/blog"
            className="text-sm text-muted transition-colors hover:text-secondary"
            data-testid="back-to-blog"
          >
            &larr; Back to Blog
          </Link>
        </nav>

        {/* Header */}
        <header className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="rounded-full bg-accent/10 px-2.5 py-0.5 text-xs font-semibold text-accent">
              Newsletter
            </span>
            <time className="text-sm text-muted" dateTime={n.date}>
              {formatDate(n.date)}
            </time>
          </div>
          <h1
            className="text-section-heading mb-4"
            data-testid="newsletter-heading"
          >
            {n.heroTitle}
          </h1>
          <p className="text-lg text-secondary sm:text-xl">
            {n.heroSubtitle}
          </p>
        </header>

        {/* Intro */}
        <div className="mb-12 rounded-2xl border border-glass-stroke bg-glass-fill p-6 backdrop-blur-glass sm:p-8">
          <p
            className="text-base leading-relaxed text-secondary sm:text-lg"
            data-testid="newsletter-intro"
          >
            {n.intro}
          </p>
        </div>

        {/* Features */}
        <div className="mb-16 space-y-6">
          {n.features.map((feature) => (
            <FeatureCard key={feature.title} feature={feature} />
          ))}
        </div>

        {/* Note */}
        {n.note && (
          <div className="mb-16 border-t border-glass-stroke pt-6">
            <p className="text-sm leading-relaxed text-secondary">{n.note}</p>
          </div>
        )}

        {/* CTA */}
        <section
          className="rounded-2xl border border-glass-stroke bg-glass-fill p-8 text-center backdrop-blur-glass sm:p-12"
          data-testid="newsletter-cta"
        >
          {n.cta.style === "button" ? (
            <>
              <h2 className="mb-3 font-['Satoshi',sans-serif] text-2xl font-bold text-primary sm:text-3xl">
                Ready to get started?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-secondary">
                No waitlist. No invite codes. Sign in with Google and your
                workspace is ready in seconds.
              </p>
              <a
                href={n.cta.url}
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-black transition-opacity hover:opacity-90"
                data-testid="newsletter-cta-button"
              >
                {n.cta.text} <span aria-hidden="true">&rarr;</span>
              </a>
            </>
          ) : (
            <>
              <h2 className="mb-3 font-['Satoshi',sans-serif] text-2xl font-bold text-primary sm:text-3xl">
                Ready to see it in action?
              </h2>
              <p className="mx-auto mb-8 max-w-md text-secondary">
                We&apos;re rolling out access in waves. Join the waitlist and
                be among the first to experience Denker.
              </p>
              <div className="mx-auto max-w-sm">
                <WaitlistForm size="compact" />
              </div>
            </>
          )}
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
