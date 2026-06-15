import Image from "next/image";
import { DenkerLogo } from "@/components/denker-logo";
import { LandingFooter } from "@/components/landing-footer";
import { LandingNav } from "@/components/landing-nav";

const ASSET_BASE = "/blog/assets/denker-peerlist-launch";
const PEERLIST_URL = "https://peerlist.io/denker/project/denker";
const DOWNLOAD_URL =
  "https://www.denker.ai/download?utm_source=newsletter&utm_medium=email&utm_campaign=denker-peerlist-launch";

function DemoVideo({
  title,
  copy,
  src,
  poster,
}: {
  title: string;
  copy: string;
  src: string;
  poster: string;
}) {
  return (
    <section className="mt-9">
      <h2 className="font-satoshi text-[22px] font-bold leading-tight tracking-normal text-[#111713] sm:text-2xl">
        {title}
      </h2>
      <p className="mt-2 text-[15px] leading-relaxed text-[#53655a]">{copy}</p>
      <video
        src={src}
        poster={poster}
        muted
        autoPlay
        loop
        playsInline
        preload="metadata"
        className="mt-4 block w-full bg-[#111713] shadow-[0_18px_36px_rgba(35,50,41,0.13)]"
      />
    </section>
  );
}

export function PeerlistLaunchPost() {
  return (
    <div
      className="min-h-screen text-[#162019]"
      style={{
        background:
          "radial-gradient(circle at 18% 0%, rgba(58,248,140,0.22), transparent 34%), radial-gradient(circle at 85% 18%, rgba(255,255,255,0.92), transparent 34%), linear-gradient(180deg, #ddf8e5 0%, #f7faf5 52%, #eff6ef 100%)",
      }}
    >
      <LandingNav />
      <main className="mx-auto w-full max-w-[729px] px-4 pb-16 pt-32 sm:pt-36">
        <div className="mb-6 text-center">
          <DenkerLogo variant="wordmark" height={30} className="justify-center opacity-85" />
        </div>

        <article className="overflow-hidden rounded-[30px] border border-white/70 bg-white/65 shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_28px_90px_rgba(30,49,38,0.12)] backdrop-blur-xl">
          <div className="px-5 py-7 sm:px-10 sm:py-10">
            <span className="inline-flex rounded-full bg-[#30f27c]/15 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.08em] text-[#087a3b]">
              Peerlist launch
            </span>
            <h1
              className="mt-4 font-satoshi text-[32px] font-bold leading-[1.06] tracking-normal text-[#111713] sm:text-[40px]"
              data-testid="peerlist-launch-heading"
            >
              Denker is live on Peerlist
            </h1>
            <p className="mt-2 text-[17px] font-bold leading-snug text-[#1c7d45] sm:text-[19px]">
              The desktop interface for agent teams.
            </p>

            <div className="mt-7 max-w-[560px] space-y-3 text-[15px] leading-relaxed text-[#53655a]">
              <p>Today we launched Denker on Peerlist.</p>
              <p>
                Speak a task, keep your context, and watch agents execute in one shared
                workspace.
              </p>
            </div>

            <div className="mt-7">
              <Image
                src={`${ASSET_BASE}/denker-launch-dashboard.png`}
                alt="Denker live on Peerlist Launchpad"
                width={1200}
                height={630}
                className="block w-full rounded-[18px] bg-white"
                priority
              />

              <div className="mt-4 flex items-center justify-between gap-4 pt-4 max-sm:block max-sm:text-center">
                <p className="text-sm leading-snug text-[#53655a] max-sm:mb-3">
                  If you like the direction, help more builders find it.
                </p>
                <a
                  href={PEERLIST_URL}
                  className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-full bg-[#30f27c] px-5 text-sm font-extrabold text-[#07130a] shadow-[0_10px_22px_rgba(48,242,124,0.20)] max-sm:w-full"
                  data-testid="peerlist-support-link"
                >
                  Support on Peerlist
                </a>
              </div>
            </div>

            <DemoVideo
              title="Speak to Denker"
              copy="Use voice input without opening another chat tab."
              src={`${ASSET_BASE}/voice-input.mp4`}
              poster={`${ASSET_BASE}/voice-input.gif`}
            />
            <DemoVideo
              title="Watch the task move"
              copy="Tasks, notes, and outputs stay visible as the workspace changes."
              src={`${ASSET_BASE}/task-execution.mp4`}
              poster={`${ASSET_BASE}/task-execution.gif`}
            />

            <div className="mt-9 space-y-2.5 rounded-3xl bg-white/45 px-5 py-5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.60)]">
              <p className="text-[15px] leading-relaxed text-[#53655a]">
                <strong className="font-extrabold text-[#111713]">Voice first.</strong>{" "}
                Talk to the desktop app naturally.
              </p>
              <p className="text-[15px] leading-relaxed text-[#53655a]">
                <strong className="font-extrabold text-[#111713]">Real execution.</strong>{" "}
                Agents run tasks in a shared workspace.
              </p>
              <p className="text-[15px] leading-relaxed text-[#53655a]">
                <strong className="font-extrabold text-[#111713]">Visible context.</strong>{" "}
                The work stays on screen.
              </p>
            </div>

            <p className="mt-8 text-[15px] leading-relaxed text-[#53655a]">
              Try it on real work. If it feels useful, supporting the Peerlist launch
              helps more builders find it.
            </p>

            <div className="mt-8 text-center">
              <a
                href={DOWNLOAD_URL}
                className="flex min-h-14 w-full items-center justify-center rounded-full bg-[#30f27c] px-9 text-[17px] font-black text-[#07130a] shadow-[0_12px_26px_rgba(48,242,124,0.28)] max-sm:px-5 max-sm:text-base"
                data-testid="download-denker-macos"
              >
                Download Denker for macOS
              </a>
              <a
                href={PEERLIST_URL}
                className="mt-5 flex w-full justify-center text-sm font-extrabold text-[#087a3b]"
                data-testid="peerlist-secondary-link"
              >
                Support the Peerlist launch
              </a>
            </div>
          </div>
        </article>
      </main>
      <LandingFooter />
    </div>
  );
}
