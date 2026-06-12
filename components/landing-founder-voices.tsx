const QUOTES = [
  {
    quote: "I'm the bottleneck.",
    source: "r/ClaudeAI",
    href: "https://www.reddit.com/r/ClaudeAI/comments/1sdv7br/im_the_bottleneck/",
  },
  {
    quote: "Instead of 1 person's job you're suddenly doing 10.",
    source: "r/Entrepreneur",
    href: "https://www.reddit.com/r/Entrepreneur/comments/1n95vry/solo_founders_whats_draining_you_the_most_right/",
  },
  {
    quote:
      "6 browser tabs, kept losing track of which tab was working on what, context kept getting mixed up.",
    source: "r/ChatGPTCoding",
    href: "https://www.reddit.com/r/ChatGPTCoding/comments/1odauaj/we_had_2_weeks_to_build_5_microservices_with_3/",
  },
  {
    quote: "A senior colleague in every discipline who never says that's not my department.",
    source: "r/ClaudeAI",
    href: "https://www.reddit.com/r/ClaudeAI/comments/1s871al/solo_founder_here_what_a_single_claude_code/",
  },
  {
    quote: "Drowning in YouTube videos, books, and podcasts just to figure things out.",
    source: "r/Entrepreneur",
    href: "https://www.reddit.com/r/Entrepreneur/comments/1no7cj2/how_do_you_manage_the_overwhelm_as_a_solo_founder/",
  },
  {
    quote: "Overwhelm is the number one enemy of the solo founder.",
    source: "r/Entrepreneur",
    href: "https://www.reddit.com/r/Entrepreneur/comments/1no7cj2/how_do_you_manage_the_overwhelm_as_a_solo_founder/",
  },
  {
    quote: "The marketing alone for the startup is a full-time job.",
    source: "r/startups",
    href: "https://www.reddit.com/r/startups/comments/oigaxw/feeling_overwhelmed_as_a_solo_founder_should_i/",
  },
  {
    quote:
      "Switching between coding and marketing tasks — my coding is interrupted and I'm not shipping fast enough.",
    source: "r/SaaS",
    href: "https://www.reddit.com/r/SaaS/comments/1arkvnk/for_the_solo_founders_out_there_how_do_you_manage/",
  },
  {
    quote: "Felt like managing a team of interns who work really fast but need constant supervision.",
    source: "r/ChatGPTCoding",
    href: "https://www.reddit.com/r/ChatGPTCoding/comments/1odauaj/we_had_2_weeks_to_build_5_microservices_with_3/",
  },
  {
    quote: "I desperately need some marketing assistance lol.",
    source: "r/SaaS",
    href: "https://www.reddit.com/r/SaaS/comments/1arkvnk/for_the_solo_founders_out_there_how_do_you_manage/",
  },
];

const fadeMask = {
  maskImage:
    "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
  WebkitMaskImage:
    "linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)",
};

type Quote = (typeof QUOTES)[number];

function QuoteCard({ q }: { q: Quote }) {
  return (
    <a
      href={q.href}
      target="_blank"
      rel="noopener noreferrer"
      className="liquid-glass group flex h-44 w-[320px] shrink-0 flex-col rounded-2xl border border-glass-stroke p-5 transition-colors hover:border-glass-stroke-light"
      data-testid="founder-voice-card"
    >
      <span
        aria-hidden="true"
        className="mb-2 text-3xl font-bold leading-none text-accent"
      >
        &ldquo;
      </span>
      <p className="line-clamp-3 flex-1 text-[15px] font-medium leading-snug text-primary">
        {q.quote}
      </p>
      <span className="mt-3 text-xs font-semibold text-accent">{q.source}</span>
    </a>
  );
}

export function LandingFounderVoices() {
  const doubled = [...QUOTES, ...QUOTES];

  return (
    <section
      className="relative px-5 py-24 sm:px-6 sm:py-32 lg:px-12"
      data-testid="landing-founder-voices"
    >
      <div className="mx-auto max-w-6xl text-center">
        <span className="badge-section mb-3">Founder voices</span>
        <h2 className="text-section-heading mx-auto max-w-3xl text-balance">
          You&apos;re not alone. <span className="text-accent">We hear you.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-balance text-base text-secondary">
          Real founders. Real pain. We built Denker for exactly this.
        </p>
      </div>

      <div className="relative -mx-5 mt-14 flex flex-col gap-4 sm:-mx-6 lg:-mx-12">
        <div
          className="marquee-row relative w-full overflow-hidden"
          style={fadeMask}
        >
          <div className="marquee-left flex w-max gap-4">
            {doubled.map((q, i) => (
              <QuoteCard key={`top-${i}`} q={q} />
            ))}
          </div>
        </div>
        <div
          className="marquee-row relative w-full overflow-hidden"
          style={fadeMask}
        >
          <div className="marquee-right flex w-max gap-4">
            {doubled.map((q, i) => (
              <QuoteCard key={`bot-${i}`} q={q} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
