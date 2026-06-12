import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/seo";

const proofItems = [
  "10 active pilot teams",
  "3 active by June 15",
  "Onboarding completed",
  "One real workflow used",
  "Proof captured for each active team",
];

const milestones = [
  {
    title: "Now",
    text: "Lock the traction definition, log prospects, and convert the first wave from launch interest into pilots.",
  },
  {
    title: "June 15",
    text: "Peerless launch window. Goal: at least 3 teams active and recorded in the tracker.",
  },
  {
    title: "June 22",
    text: "Prada Hunt follow-up closes the remaining warm leads into active pilots.",
  },
];

export const metadata: Metadata = {
  title: "Traction",
  description:
    "Denker's traction proof page for the current angel round: pilot goal, activation definition, milestones, and evidence checklist.",
  alternates: { canonical: "/traction" },
  openGraph: {
    title: "Traction — Denker",
    description:
      "Denker's traction proof page for the current angel round: pilot goal, activation definition, milestones, and evidence checklist.",
    url: `${SITE_URL}/traction`,
    type: "website",
    images: [DEFAULT_OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "Traction — Denker",
    description:
      "Denker's traction proof page for the current angel round: pilot goal, activation definition, milestones, and evidence checklist.",
  },
};

function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="liquid-glass rounded-2xl border border-glass-stroke p-6">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
        {label}
      </div>
      <div className="mt-3 font-satoshi text-4xl font-bold text-primary">
        {value}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-secondary">{detail}</p>
    </div>
  );
}

export default function TractionPage() {
  return (
    <div
      className="min-h-screen bg-canvas"
      style={{
        backgroundImage: `
          radial-gradient(ellipse 65% 55% at 15% 20%, rgba(58,248,140,0.08) 0%, transparent 70%),
          radial-gradient(ellipse 55% 45% at 80% 60%, rgba(255,200,50,0.06) 0%, transparent 70%),
          radial-gradient(ellipse 45% 40% at 60% 5%, rgba(255,180,80,0.04) 0%, transparent 65%)
        `,
        backgroundSize: "100% 100%, 100% 100%, 100% 100%",
        backgroundAttachment: "fixed, fixed, fixed",
      }}
    >
      <LandingNav />
      <main className="mx-auto max-w-6xl px-5 pb-24 pt-32 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <section>
            <span className="badge-section mb-4 inline-flex">Traction proof</span>
            <h1 className="text-section-heading mb-5 max-w-3xl">
              10 active pilot teams by June 22
            </h1>
            <p className="max-w-2xl text-base leading-relaxed text-secondary sm:text-lg">
              This page tracks the actual traction goal for Denker's current angel
              round. It defines what counts as an active pilot, the evidence we
              need to show, and the milestones that should convert launch
              attention into measurable usage.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/"
                className="inline-flex h-11 items-center rounded-full bg-primary px-5 text-sm font-semibold text-canvas transition-opacity hover:opacity-80"
              >
                Back to home
              </Link>
              <a
                href="mailto:team@denker.ai"
                className="inline-flex h-11 items-center rounded-full border border-glass-stroke px-5 text-sm font-semibold text-primary transition-colors hover:bg-glass-fill-heavy"
              >
                Contact the team
              </a>
            </div>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Target"
                value="10"
                detail="active pilot teams by June 22."
              />
              <StatCard
                label="Launch"
                value="3"
                detail="teams active by June 15 from the Peerless launch."
              />
              <StatCard
                label="Follow-up"
                value="Jun 22"
                detail="Prada Hunt lunch closes the remaining warm leads."
              />
            </div>
          </section>

          <aside className="liquid-glass rounded-3xl border border-glass-stroke p-6 lg:sticky lg:top-28">
            <div className="flex items-center justify-between">
              <span className="badge-section inline-flex">Definition</span>
              <span className="rounded-full bg-surface px-3 py-1 text-xs font-semibold text-secondary">
                Pre-launch
              </span>
            </div>
            <h2 className="mt-4 font-satoshi text-2xl font-bold text-primary">
              What counts as an active pilot
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              A team only counts when it has completed onboarding, used Denker in
              at least one real workflow, and agreed to a next step that keeps
              the pilot live.
            </p>

            <div className="mt-6 space-y-3">
              {proofItems.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-glass-stroke bg-surface px-4 py-3 text-sm text-primary"
                >
                  {item}
                </div>
              ))}
            </div>
          </aside>
        </div>

        <section className="mt-12 grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="liquid-glass rounded-3xl border border-glass-stroke p-7">
            <h2 className="font-satoshi text-2xl font-bold text-primary">
              Milestones
            </h2>
            <div className="mt-6 space-y-4">
              {milestones.map((item) => (
                <div key={item.title} className="flex gap-4">
                  <div className="mt-1 h-3 w-3 shrink-0 rounded-full bg-primary" />
                  <div>
                    <div className="text-sm font-semibold text-primary">
                      {item.title}
                    </div>
                    <p className="mt-1 text-sm leading-relaxed text-secondary">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="liquid-glass rounded-3xl border border-glass-stroke p-7">
            <h2 className="font-satoshi text-2xl font-bold text-primary">
              Evidence checklist
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-secondary">
              The page should only show verified proof. Interest without onboarding
              does not count as traction.
            </p>
            <ul className="mt-6 space-y-3 text-sm text-primary">
              <li className="rounded-2xl border border-glass-stroke bg-surface px-4 py-3">
                Pilot name or team
              </li>
              <li className="rounded-2xl border border-glass-stroke bg-surface px-4 py-3">
                Onboarding date
              </li>
              <li className="rounded-2xl border border-glass-stroke bg-surface px-4 py-3">
                First real workflow used
              </li>
              <li className="rounded-2xl border border-glass-stroke bg-surface px-4 py-3">
                Screenshot, quote, or artifact
              </li>
              <li className="rounded-2xl border border-glass-stroke bg-surface px-4 py-3">
                Outcome note or quantified value
              </li>
            </ul>
          </div>
        </section>

        <section className="liquid-glass mt-12 rounded-3xl border border-glass-stroke p-7">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <h2 className="font-satoshi text-2xl font-bold text-primary">
                How to use this page
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-secondary">
                Share this page with angels, warm intros, or anyone evaluating
                Denker's early traction. It should be updated as soon as a team
                becomes active, and it should never count anticipation as proof.
              </p>
            </div>
            <div className="rounded-2xl border border-glass-stroke bg-surface p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted">
                Operating rule
              </p>
              <p className="mt-3 text-sm leading-relaxed text-primary">
                If there is no onboarding and no live workflow, the team is not
                active.
              </p>
            </div>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
