import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { getAllPosts, getPost, CATEGORY_LABELS, CATEGORY_COLORS } from "@/lib/newsletters";
import type { NewsletterFeature, BlogPost } from "@/lib/newsletters";
import { SITE_URL } from "@/lib/seo";
import { VideoLightbox } from "@/components/video-lightbox";
import { PeerlistLaunchPost } from "@/components/peerlist-launch-post";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  return params.then(({ slug }) => {
    const p = getPost(slug);
    if (!p) return { title: "Not Found" };
    // Strip trailing " | Denker" so root template's " — Denker" doesn't double-suffix.
    const cleanTitle = (p.metaTitle ?? p.title).replace(/\s*\|\s*Denker\s*$/, "");
    const description = p.metaDescription ?? p.previewText;
    const canonicalPath = `/blog/${p.slug}`;
    return {
      title: cleanTitle,
      description,
      alternates: { canonical: canonicalPath },
      openGraph: {
        title: `${cleanTitle} — Denker`,
        description,
        url: `${SITE_URL}${canonicalPath}`,
        type: "article",
        publishedTime: p.date,
      },
    };
  });
}

const BADGE_COLORS: Record<string, string> = {
  green: "bg-accent/10 text-accent",
  amber: "bg-amber-500/10 text-amber-400",
  blue: "bg-blue-500/10 text-blue-400",
};

function getYouTubeId(src: string): string | null {
  const match = src.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([\w-]{11})/,
  );
  return match ? match[1] : null;
}

function MediaBlock({ src, alt }: { src: string; alt: string }) {
  const youtubeId = getYouTubeId(src);
  if (youtubeId) {
    return (
      <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-glass-stroke-subtle">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${youtubeId}`}
          title={alt}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }
  if (src.endsWith(".mp4")) {
    return <VideoLightbox src={src} alt={alt} />;
  }
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-glass-stroke-subtle">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 768px) 768px, 100vw"
        className="object-cover"
      />
    </div>
  );
}

function FeatureCard({ feature }: { feature: NewsletterFeature }) {
  return (
    <div
      className="liquid-glass rounded-2xl border border-glass-stroke p-6 sm:p-8"
      data-testid={`feature-${feature.title.toLowerCase().replace(/\s+/g, "-")}`}
    >
      <span
        className={`mb-3 inline-block rounded-md px-2.5 py-1 text-xs font-semibold uppercase tracking-wide ${BADGE_COLORS[feature.badgeColor] ?? BADGE_COLORS.green}`}
      >
        {feature.badge}
      </span>
      <h3 className="mb-2 font-satoshi text-xl font-bold text-primary sm:text-2xl">
        {feature.title}
      </h3>
      <p className="mb-4 text-sm leading-relaxed text-secondary sm:text-base">
        {feature.description}
      </p>
      {feature.image && (
        <div className="mb-4">
          <MediaBlock src={feature.image} alt={feature.title} />
        </div>
      )}
      <p className="text-sm italic text-muted">{feature.tagline}</p>
    </div>
  );
}

function RelatedPosts({ currentSlug, currentCategory }: { currentSlug: string; currentCategory: BlogPost["category"] }) {
  const all = getAllPosts().filter((p) => p.slug !== currentSlug);
  const sameCategory = all.filter((p) => p.category === currentCategory);
  const related = (sameCategory.length >= 3 ? sameCategory : all).slice(0, 3);

  if (related.length === 0) return null;

  return (
    <section className="mb-16 border-t border-glass-stroke pt-12">
      <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-muted">
        More from Denker
      </h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {related.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="liquid-glass group flex flex-col rounded-xl border border-glass-stroke p-4 transition-colors hover:border-glass-stroke-light"
          >
            <span className={`mb-2 self-start rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${CATEGORY_COLORS[p.category]}`}>
              {CATEGORY_LABELS[p.category]}
            </span>
            <p className="text-sm font-semibold leading-snug text-primary group-hover:text-accent transition-colors">
              {p.heroTitle}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * BlogPosting structured data for SEO.
 * All values are compile-time constants from the post registry — no user input.
 */
function BlogPostSchema({ slug, title, description, date }: {
  slug: string;
  title: string;
  description: string;
  date: string;
}) {
  // Content is a static compile-time string — no user input, safe to inject.
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    datePublished: date,
    url: `${SITE_URL}/blog/${slug}`,
    author: { "@type": "Organization", name: "Denker AI" },
    publisher: {
      "@type": "Organization",
      name: "Denker AI",
      logo: { "@type": "ImageObject", url: `${SITE_URL}/logo/symbol-dark-green.svg` },
    },
  });
  // eslint-disable-next-line react/no-danger
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />;
}

/**
 * VideoObject structured data — emitted when a post embeds a YouTube video.
 * Lets Google surface video thumbnails in search results. All values are
 * compile-time constants from the post registry — no user input.
 */
function VideoObjectSchema({ videoId, name, description, uploadDate }: {
  videoId: string;
  name: string;
  description: string;
  uploadDate: string;
}) {
  const schema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: [
      `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
    ],
    uploadDate,
    embedUrl: `https://www.youtube-nocookie.com/embed/${videoId}`,
    contentUrl: `https://www.youtube.com/watch?v=${videoId}`,
  });
  // eslint-disable-next-line react/no-danger
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: schema }} />;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();

  const isChangelog = p.category === "changelog";
  const videoId = p.media ? getYouTubeId(p.media) : null;

  if (p.slug === "denker-peerlist-launch") {
    return (
      <>
        <BlogPostSchema
          slug={p.slug}
          title={p.metaTitle ?? p.title}
          description={p.metaDescription ?? p.previewText}
          date={p.date}
        />
        <PeerlistLaunchPost />
      </>
    );
  }

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
      <BlogPostSchema
        slug={p.slug}
        title={p.metaTitle ?? p.title}
        description={p.metaDescription ?? p.previewText}
        date={p.date}
      />
      {videoId && (
        <VideoObjectSchema
          videoId={videoId}
          name={p.heroTitle}
          description={p.metaDescription ?? p.previewText}
          uploadDate={p.date}
        />
      )}
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
            <span
              className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${CATEGORY_COLORS[p.category]}`}
            >
              {CATEGORY_LABELS[p.category]}
            </span>
            <time className="text-sm text-muted" dateTime={p.date}>
              {formatDate(p.date)}
            </time>
          </div>
          <h1
            className="text-section-heading mb-4"
            data-testid="post-heading"
          >
            {p.heroTitle}
          </h1>
          {p.heroSubtitle && (
            <p className="text-lg text-secondary sm:text-xl">
              {p.heroSubtitle}
            </p>
          )}
        </header>

        {/* Intro */}
        <div className="liquid-glass mb-12 rounded-2xl border border-glass-stroke p-6 sm:p-8">
          <p
            className="text-base leading-relaxed text-secondary sm:text-lg"
            data-testid="post-intro"
          >
            {p.intro}
          </p>
        </div>

        {/* Standalone media for changelogs */}
        {p.media && (
          <div className="mb-12">
            <MediaBlock src={p.media} alt={p.heroTitle} />
          </div>
        )}

        {/* Feature cards (newsletters) */}
        {p.features.length > 0 && (
          <div className="mb-16 space-y-6">
            {p.features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </div>
        )}

        {/* Note */}
        {p.note && (
          <div className="mb-16 border-t border-glass-stroke pt-6">
            <p className="text-sm leading-relaxed text-secondary">{p.note}</p>
          </div>
        )}

        {/* Related posts */}
        <RelatedPosts currentSlug={p.slug} currentCategory={p.category} />

        {/* CTA */}
        <section
          className="liquid-glass rounded-2xl border border-glass-stroke p-8 text-center sm:p-12"
          data-testid="post-cta"
        >
          <h2 className="mb-3 font-satoshi text-2xl font-bold text-primary sm:text-3xl">
            {isChangelog ? "Try it yourself" : "Ready to get started?"}
          </h2>
          <p className="mx-auto mb-8 max-w-md text-secondary">
            No invite codes. Download Denker for macOS and your workspace is
            ready in minutes.
          </p>
          <a
            href={p.cta.url}
            className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-base font-semibold text-black transition-opacity hover:opacity-90"
            data-testid="post-cta-button"
          >
            {p.cta.text} <span aria-hidden="true">&rarr;</span>
          </a>
        </section>

        {/* Homepage internal link */}
        <div className="mt-10 text-center">
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-secondary"
          >
            ← Back to Denker, your AI agent workspace
          </Link>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
