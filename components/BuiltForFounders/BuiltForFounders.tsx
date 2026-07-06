import { CardCarousel, type CarouselCard } from "@/components/ui/CardCarousel";
import { ReportFrame } from "@/components/BuiltForFounders/foregrounds/ReportFrame";
import { SheetWindow } from "@/components/BuiltForFounders/foregrounds/SheetWindow";
import { VoicePicker } from "@/components/BuiltForFounders/foregrounds/VoicePicker";
import { ChatMessages } from "@/components/BuiltForFounders/foregrounds/ChatMessages";
import { TeamWorkspace } from "@/components/BuiltForFounders/foregrounds/TeamWorkspace";

// "Built for Founders & Product Builders" — the visionOS unequal-width gallery.
// Scenario/outcome copy (moments in a founder's week); each card layers a rebuilt
// JSX foreground over an environment photo. This row leans GREEN to set it apart
// from the blue motion row above (per-row hue differentiation).
//
// Sequence (message → agent → spreadsheet → report → team app) and per-card
// `widthPx` create the unequal-width rhythm; tiles share one height (Apple's
// gallery pattern), so only WIDTH varies. Last card uses the brightest backdrop.
const BG = "/images/what-denker-can-do/backgrounds";

const cards: CarouselCard[] = [
  {
    // 1 — Message (narrower)
    title: "Messages drafted, sent, and followed up.",
    body: "Denker writes replies in your voice, sends them across your chat tools, and keeps track of the follow-ups you'd forget.",
    widthPx: 560,
    background: `${BG}/green-motion-lines.jpg`,
    foreground: <ChatMessages />,
  },
  {
    // 2 — Agent voice (narrowest)
    title: "Talk it through. Denker takes it from there.",
    body: "Brainstorm out loud and assign work by voice with a hotkey — Denker turns what you say into finished tasks and replies.",
    widthPx: 460,
    background: `${BG}/green-emerald-fluid.jpg`,
    backgroundPosition: "center 45%",
    foreground: <VoicePicker />,
  },
  {
    // 3 — Spreadsheet (widest)
    title: "Spreadsheet chores, handled while you watch.",
    body: "Denker works right inside your sheet — adding totals, filling gaps, and cleaning messy data — so you skip the manual formula wrangling.",
    widthPx: 780,
    background: `${BG}/green-ridge-lines.jpg`,
    foreground: <SheetWindow />,
    // Mobile: the Denker bubble sits on the right of the sheet; shift the
    // foreground left so it reads the right-hand region (bubble complete)
    // instead of cropping it at the tile's right edge.
    mobileNudgeX: -46,
  },
  {
    // 4 — Website-visitor report (medium)
    title: "Your numbers, turned into an investor-ready report.",
    body: "Ask a question in plain English — Denker pulls your real metrics into a shareable report, with charts, highlights, and insights ready to send.",
    widthPx: 640,
    background: `${BG}/green-emerald-fluid.jpg`,
    backgroundPosition: "left center",
    foreground: <ReportFrame />,
  },
  {
    // 5 — Team / message app (wide, brightest backdrop)
    title: "From a quick discussion to delegated tasks.",
    body: "Denker remembers what your team agreed on and turns the conversation into assigned work — the right task to the right person.",
    widthPx: 700,
    background: `${BG}/green-jade-marble.jpg`,
    backgroundPosition: "center 40%",
    foreground: <TeamWorkspace />,
  },
];

export function BuiltForFounders() {
  return (
    <div data-name="Section - Built for Founders & Product Builders">
      <CardCarousel
        variant="gallery"
        theme="dark"
        eyebrow="Built for founders & product builders"
        heading="An AI coworker for everything you don't have time for."
        intro="Founders and product builders wear every hat at once — sales, ops, support, admin. Denker takes the real work off your plate: it builds reports from your numbers, cleans up spreadsheets, drafts and sends messages, and turns team discussions into assigned tasks — right inside the apps you already use."
        cards={cards}
      />
    </div>
  );
}
