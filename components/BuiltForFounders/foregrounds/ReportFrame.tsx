import { TrendingUp } from "lucide-react";

// Card 1 foreground — "Website Visitor Impact" report still, rebuilt in JSX so
// it stays crisp at every tile width (replaces built-for-founders-5.webp).
// Authored at a fixed 540px design width; the gallery wrapper scales it as one
// unit. Denker green is the only accent (the reference webp's purple is
// re-tinted green per the single-accent rule, §6a).

const stats = [
  { value: "1,200", delta: "+3x vs pre-launch avg", label: "Total unique visitors", sub: "30-day running total" },
  { value: "~120", delta: "peak day (launch week)", label: "Max daily visitors", sub: "Post-launch high" },
  { value: "160", delta: "downloads tracked", label: "Mac app downloads", sub: "Direct CTA conversion" },
  { value: "~70", delta: "vs ~30 pre-launch", label: "Avg daily (launch week)", sub: "Sustained traffic uplift" },
];

// Weekly-average bar heights (% of chart body); the final "Peerlist" bar spikes
// and is the only green bar.
const bars = [
  { label: "Apr W1", h: 34 },
  { label: "W2", h: 52 },
  { label: "W3", h: 28 },
  { label: "W4", h: 24 },
  { label: "May W1", h: 30 },
  { label: "W2", h: 30 },
  { label: "W3", h: 32 },
  { label: "W4", h: 28 },
  { label: "Jun W1", h: 34 },
  { label: "W2", h: 46 },
  { label: "W3", h: 40 },
  { label: "Peerlist", h: 96, peak: true },
];

const insights = [
  ["Launch spike:", "Peerlist drove the highest sustained weekly traffic since launch — peaks of ~120 visitors/day, up from a ~30/day baseline."],
  ["Cumulative momentum:", "The running 30-day total hit 1,200 unique visitors, with ~40% of all traffic arriving in the final 2 weeks of June."],
];

export function ReportFrame() {
  return (
    // Outer div receives the gallery --gallery-fg-scale; the inner scale shrinks
    // the panel a further ~15% so it floats inside the tile as a card with
    // breathing room on all sides (rather than filling edge-to-edge).
    <div>
      <div style={{ width: 540, transform: "scale(0.84)", transformOrigin: "center" }}>
      {/* Report panel */}
      <div className="w-full overflow-hidden rounded-[20px] border border-white/60 bg-white/92 shadow-[0_30px_70px_-20px_rgba(9,20,40,0.55)] backdrop-blur-xl">
        <div className="flex flex-col gap-2.5 px-5 py-3.5">
          <div>
            <span className="inline-flex items-center rounded-full bg-accent/18 px-2.5 py-1 text-[9px] font-bold tracking-[0.06em] text-emerald-700">
              PEERLIST LAUNCH — JUNE 24, 2026
            </span>
            <h3 className="mt-2 text-[22px] font-bold leading-tight text-grey-950">
              Website Visitor Impact
            </h3>
            <p className="text-[11px] font-medium text-grey-400">
              April 2 → July 1, 2026 · Founder Daily Metrics
            </p>
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-4 gap-2">
            {stats.map((s) => (
              <div key={s.label} className="rounded-xl border border-grey-950/8 bg-white/70 px-2.5 py-2">
                <p className="text-[17px] font-bold leading-none text-grey-950">{s.value}</p>
                <p className="mt-1 flex items-center gap-0.5 text-[8px] font-semibold text-emerald-600">
                  <TrendingUp className="size-2.5" /> {s.delta}
                </p>
                <p className="mt-1 text-[9px] font-semibold leading-tight text-grey-700">{s.label}</p>
                <p className="text-[8px] leading-tight text-grey-400">{s.sub}</p>
              </div>
            ))}
          </div>

          {/* Chart */}
          <div className="rounded-xl border border-grey-950/8 bg-white/70 px-3.5 pb-3 pt-3">
            <p className="text-[9px] font-bold tracking-[0.05em] text-grey-800">
              DAILY VISITORS — WEEKLY AVERAGES
            </p>
            <div className="mt-2.5 flex h-[72px] items-end gap-1.5">
              {bars.map((b, i) => (
                <div
                  key={`${b.label}-${i}`}
                  className={`flex-1 rounded-[3px] ${b.peak ? "bg-accent" : "bg-grey-900"}`}
                  style={{ height: `${b.h}%` }}
                />
              ))}
            </div>
            <div className="mt-1 flex gap-1.5">
              {bars.map((b, i) => (
                <span
                  key={`${b.label}-${i}`}
                  className={`flex-1 text-center text-[6.5px] leading-none ${b.peak ? "font-bold text-emerald-600" : "text-grey-400"}`}
                >
                  {b.label}
                </span>
              ))}
            </div>
            <div className="mt-2.5 flex items-center gap-3">
              <span className="flex items-center gap-1 text-[7.5px] text-grey-500">
                <span className="size-2 rounded-[2px] bg-grey-900" /> Pre-launch
              </span>
              <span className="flex items-center gap-1 text-[7.5px] text-grey-500">
                <span className="size-2 rounded-[2px] bg-accent" /> Peerlist launch week (Jun 24–30)
              </span>
            </div>
          </div>

          {/* Key insights */}
          <div>
            <p className="text-[9px] font-bold tracking-[0.05em] text-grey-800">KEY INSIGHTS</p>
            <div className="mt-1.5 flex flex-col gap-1.5">
              {insights.map(([lead, rest]) => (
                <div key={lead} className="rounded-lg border border-grey-950/8 bg-white/70 py-1.5 pl-2.5 pr-3">
                  <div className="border-l-2 border-accent pl-2">
                    <p className="text-[9px] leading-snug text-grey-500">
                      <span className="font-bold text-grey-900">{lead}</span> {rest}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
