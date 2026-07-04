"use client";

import Image from "next/image";
import { List, X } from "@phosphor-icons/react/dist/ssr";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { LOGIN_URL } from "@/lib/links";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Docs", href: "https://www.denker.ai/docs" },
  { label: "Blog", href: "https://www.denker.ai/blog" },
  { label: "Community", href: "#reach-out" },
].map((link) => ({ ...link, external: link.href.startsWith("http") }));

export function Header() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [isLight, setIsLight] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Below `lg` the nav links/Get Started button collapse behind the
  // hamburger menu — if the viewport grows back past that breakpoint while
  // the menu is open, close it so it doesn't linger on desktop.
  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, []);

  // Lock page scroll while the full-screen menu covers the viewport. Pinning
  // the body with position:fixed is the reliable cross-browser lock (plain
  // overflow:hidden still lets touch scroll through on iOS); the top offset
  // keeps the page visually in place and is restored on close.
  useEffect(() => {
    if (!menuOpen) return;
    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      Object.assign(body.style, prev);
      window.scrollTo(0, scrollY);
    };
  }, [menuOpen]);

  useEffect(() => {
    const detect = () => {
      const wrapper = wrapperRef.current;
      if (!wrapper) return;
      // Sample a point just below the fixed header itself, otherwise
      // elementFromPoint hits the header's own nav (it's always on top).
      const probeY = wrapper.getBoundingClientRect().bottom + 4;
      const prevPointerEvents = wrapper.style.pointerEvents;
      wrapper.style.pointerEvents = "none";
      const el = document.elementFromPoint(window.innerWidth / 2, probeY);
      wrapper.style.pointerEvents = prevPointerEvents;
      const themed = el?.closest<HTMLElement>("[data-theme]");
      setIsLight(themed?.dataset.theme === "light");
    };
    detect();
    window.addEventListener("scroll", detect, { passive: true });
    window.addEventListener("resize", detect);
    return () => {
      window.removeEventListener("scroll", detect);
      window.removeEventListener("resize", detect);
    };
  }, []);

  return (
    <>
      {/* Floating header pill — the resting state. */}
      <div
        ref={wrapperRef}
        className="fixed inset-x-0 top-6 z-50 flex flex-col items-center gap-2 px-6"
        data-name="Section - Header"
      >
        {/* w-full below `lg` so the collapsed pill spans the same
            margin-relative width as the open panel (both sit inside this
            wrapper's px-6) — matching footprints means the open transition
            only has to grow height/radius, not snap between two unrelated
            widths.

            The pill sits at the same top offset as the panel below (top-6 vs
            inset-6) but under it in z-index, so without this it stays fully
            visible the whole time — reading as a second logo+button stacked
            under the panel's own. Cross-fading it out here (same duration/
            easing as the panel's fade-in) makes it read as one continuous
            header instead of two overlapping ones. */}
        <div
          className={cn(
            // justify-center: below `lg` the nav is w-full so this has no
            // visible effect, but at `lg`+ the nav reverts to auto-width and
            // this centers the nav+social-pills group within the row instead
            // of leaving it flush against the left edge.
            "flex w-full items-start justify-center gap-2 transition-opacity duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]",
            menuOpen && "pointer-events-none opacity-0"
          )}
          aria-hidden={menuOpen}
        >
          <nav
            className={cn(
              "flex w-full items-center justify-between gap-10 rounded-full p-3 backdrop-blur-md transition-colors lg:w-auto",
              isLight ? "bg-grey-950/5" : "bg-white/5"
            )}
          >
            <a
              href="/"
              aria-label="Denker — home"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex items-center gap-2 pl-1"
            >
              <Image src="/images/brand/brand-icon.svg" alt="" width={24} height={24} />
              <Image
                src={
                  isLight
                    ? "/images/brand/brand-text-dark.svg"
                    : "/images/brand/brand-text.svg"
                }
                alt="Denker"
                width={64}
                height={16}
              />
            </a>

            <div className="hidden items-center gap-6 lg:flex">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                  className={cn(
                    "py-2 font-body text-base font-medium transition-colors",
                    isLight
                      ? "text-grey-950 hover:text-primary-600"
                      : "text-white hover:text-primary-400"
                  )}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <Button
              variant="primary"
              href={LOGIN_URL}
              className="hidden h-10 px-4 text-base lg:inline-flex"
            >
              Get Started
            </Button>

            {/* Tablet & mobile: hamburger opens the full-screen menu. */}
            <button
              type="button"
              aria-label="Open menu"
              aria-expanded={menuOpen}
              disabled={menuOpen}
              onClick={() => setMenuOpen(true)}
              className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-[color,background-color,border-color,box-shadow] hover:bg-primary-700 hover:shadow-btn-hover lg:hidden"
            >
              <List size={20} weight="bold" />
            </button>
          </nav>

          {/* Desktop: standalone social pills beside the nav — collapsed to
              just the icon at rest, expanding to the full Figma "open" state
              (name + tagline) on hover. */}
          <div className="hidden items-center gap-1 md:flex">
            <PeerlistHoverPill isLight={isLight} />
            <ProductHuntHoverPill />
          </div>
        </div>
      </div>

      {/* Tablet & mobile full-screen menu — a single surface that covers the
          whole viewport when open (logo + close at the top, then the links,
          Get Started, and social icons). Fades in/out; sits above the pill so
          it reads as one area rather than a detached dropdown. */}
      <div
        aria-hidden={!menuOpen}
        className={cn(
          // Tailwind v4 emits scale-*/translate-y-* as separate `scale`/
          // `translate` CSS properties (not the legacy composed `transform`),
          // so both need to be named here for the morph+slide to animate
          // instead of snapping instantly.
          "fixed inset-6 z-[60] flex origin-top flex-col gap-8 overflow-y-auto overscroll-contain rounded-[32px] px-6 pt-6 pb-8 backdrop-blur-2xl transition-[scale,translate,opacity] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:hidden",
          menuOpen
            ? "translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-4 scale-95 opacity-0",
          isLight
            ? "border border-grey-950/10 bg-white/70 text-grey-950"
            : "border border-white/10 bg-grey-950/70 text-white"
        )}
      >
        <div className="flex items-center justify-between p-3">
          <a
            href="/"
            aria-label="Denker — home"
            onClick={(e) => {
              e.preventDefault();
              setMenuOpen(false);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 pl-1"
          >
            <Image src="/images/brand/brand-icon.svg" alt="" width={24} height={24} />
            <Image
              src={
                isLight
                  ? "/images/brand/brand-text-dark.svg"
                  : "/images/brand/brand-text.svg"
              }
              alt="Denker"
              width={64}
              height={16}
            />
          </a>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
            className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary-600 text-white transition-[color,background-color,border-color,box-shadow] hover:bg-primary-700 hover:shadow-btn-hover"
          >
            <X size={20} weight="bold" />
          </button>
        </div>

        <div className="flex flex-col items-start gap-1 px-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noopener noreferrer" : undefined}
              tabIndex={menuOpen ? 0 : -1}
              onClick={() => setMenuOpen(false)}
              className="w-full rounded-2xl px-3 py-3 font-body text-xl font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="mt-auto flex flex-col items-start gap-6 px-1">
          <Button
            variant="primary"
            href={LOGIN_URL}
            tabIndex={menuOpen ? 0 : -1}
            onClick={() => setMenuOpen(false)}
            className="w-full"
          >
            Get Started
          </Button>

          {/* Expanded (open-state) social badges — stacked on mobile
              (Peerlist above Product Hunt), side by side on tablet. */}
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:gap-2">
            <PeerlistBadge isLight={isLight} tabIndex={menuOpen ? 0 : -1} />
            <ProductHuntBadge isLight={isLight} tabIndex={menuOpen ? 0 : -1} />
          </div>
        </div>
      </div>
    </>
  );
}

// Desktop-only pills: collapsed to the bare 48px icon at rest, expanding on
// hover to reveal the same "open" content as the mobile badges below. The
// text wrapper animates from max-w-0/opacity-0 to a fixed max-width, which
// (unlike animating to width:auto) transitions smoothly in every browser.
function PeerlistHoverPill({ isLight }: { isLight: boolean }) {
  return (
    <a
      href="https://peerlist.io/company/denker_ai"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Peerlist"
      className={cn(
        "group flex h-16 max-h-16 items-center overflow-hidden rounded-full p-2 backdrop-blur-md transition-colors",
        isLight ? "bg-grey-950/5 hover:bg-grey-950/10" : "bg-white/5 hover:bg-white/10"
      )}
    >
      <Image src="/logos/Peerlist.svg" alt="" width={48} height={48} className="shrink-0" />
      <span className="flex max-w-0 flex-col items-start justify-center overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity,padding-left] duration-300 ease-out group-hover:max-w-[220px] group-hover:pl-3 group-hover:pr-3 group-hover:opacity-100">
        <span className={cn("font-body text-base font-medium", isLight ? "text-grey-950" : "text-white")}>
          #1 on
        </span>
        <span className={cn("font-body text-base font-medium", isLight ? "text-grey-950" : "text-white")}>
          Peerlist · Launch Pad
        </span>
      </span>
    </a>
  );
}

function ProductHuntHoverPill() {
  return (
    <a
      href="https://www.producthunt.com/products/denker?launch=denker"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Product Hunt"
      className="group flex h-16 max-h-16 items-center overflow-hidden rounded-full bg-[#ff6154]/10 p-2 backdrop-blur-md transition-colors hover:bg-[#ff6154]/15"
    >
      <Image
        src="/images/social/producthunt.svg"
        alt=""
        width={48}
        height={48}
        className="shrink-0"
      />
      <span className="flex max-w-0 flex-col items-start justify-center overflow-hidden whitespace-nowrap opacity-0 transition-[max-width,opacity,padding-left] duration-300 ease-out group-hover:max-w-[200px] group-hover:pl-3 group-hover:pr-3 group-hover:opacity-100">
        <span className="font-body text-sm text-[#ff6154]">We are also on</span>
        <span className="font-body text-base font-bold text-[#ff6154]">Product Hunt</span>
      </span>
    </a>
  );
}

// Expanded "open" badges (Figma node 337-12015) — only shown in the
// full-screen mobile/tablet menu, where there's room for the full "#1 on
// Peerlist" / "We are also on Product Hunt" copy instead of the bare icon.
function PeerlistBadge({
  isLight,
  tabIndex,
}: {
  isLight: boolean;
  tabIndex?: number;
}) {
  return (
    <a
      href="https://peerlist.io/company/denker_ai"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Peerlist"
      tabIndex={tabIndex}
      className={cn(
        "flex w-full items-center gap-2 rounded-full py-2 pr-5 pl-2 backdrop-blur-md transition-colors sm:w-auto sm:flex-1",
        isLight ? "bg-grey-950/5 hover:bg-grey-950/10" : "bg-white/5 hover:bg-white/10"
      )}
    >
      <Image src="/logos/Peerlist.svg" alt="" width={48} height={48} className="shrink-0" />
      <span className="flex flex-col items-start justify-center">
        <span className={cn("font-body text-base font-medium", isLight ? "text-grey-950" : "text-white")}>
          #1 on
        </span>
        <span className={cn("font-body text-base font-medium", isLight ? "text-grey-950" : "text-white")}>
          Peerlist · Launch Pad
        </span>
      </span>
    </a>
  );
}

function ProductHuntBadge({ tabIndex }: { isLight: boolean; tabIndex?: number }) {
  return (
    <a
      href="https://www.producthunt.com/products/denker?launch=denker"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Product Hunt"
      tabIndex={tabIndex}
      className="flex w-full items-center gap-2 rounded-full bg-[#ff6154]/10 py-2 pr-5 pl-2 backdrop-blur-md transition-colors hover:bg-[#ff6154]/15 sm:w-auto sm:flex-1"
    >
      <Image
        src="/images/social/producthunt.svg"
        alt=""
        width={48}
        height={48}
        className="shrink-0"
      />
      <span className="flex flex-col items-start justify-center">
        <span className="font-body text-sm text-[#ff6154]">We are also on</span>
        <span className="font-body text-base font-bold text-[#ff6154]">Product Hunt</span>
      </span>
    </a>
  );
}
