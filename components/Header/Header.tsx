"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { LOGIN_URL } from "@/lib/links";
import { useDragScroll } from "@/lib/useDragScroll";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Pricing", href: "#pricing" },
  { label: "Community", href: "#reach-out" },
  { label: "FAQ", href: "#faq" },
  { label: "Blog", href: "https://www.denker.ai/blog" },
].map((link) => ({ ...link, external: link.href.startsWith("http") }));

export function Header() {
  const headerRef = useRef<HTMLElement>(null);
  const headerShellRef = useRef<HTMLDivElement>(null);
  const desktopNavRef = useRef<HTMLElement>(null);
  const compactNavRef = useRef<HTMLDivElement>(null);
  const [isLight, setIsLight] = useState(false);
  const [isCompactNav, setIsCompactNav] = useState(true);
  const [compactScrollState, setCompactScrollState] = useState({
    canScrollPrev: false,
    canScrollNext: false,
  });

  useDragScroll(compactNavRef);

  useEffect(() => {
    let frame = 0;
    let cancelled = false;

    const syncCompactNav = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const shell = headerShellRef.current;
        const desktopNav = desktopNavRef.current;
        if (!shell || !desktopNav) return;

        const desktopWidth = desktopNav.scrollWidth;
        setIsCompactNav(shell.clientWidth < desktopWidth + 8);
      });
    };

    const resizeObserver = new ResizeObserver(syncCompactNav);
    if (headerShellRef.current) resizeObserver.observe(headerShellRef.current);
    if (desktopNavRef.current) resizeObserver.observe(desktopNavRef.current);

    syncCompactNav();
    document.fonts?.ready.then(() => {
      if (!cancelled) syncCompactNav();
    });
    window.addEventListener("resize", syncCompactNav);

    return () => {
      cancelled = true;
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("resize", syncCompactNav);
    };
  }, []);

  useEffect(() => {
    let frame = 0;

    const detectTheme = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const header = headerRef.current;
        if (!header) return;

        const rect = header.getBoundingClientRect();
        const probeY = Math.min(window.innerHeight - 1, rect.bottom + 8);
        const probeX = window.innerWidth / 2;
        const themedSection = [
          ...document.querySelectorAll<HTMLElement>("[data-theme]"),
        ].find((section) => {
          const sectionRect = section.getBoundingClientRect();
          return (
            sectionRect.top <= probeY &&
            sectionRect.bottom >= probeY &&
            sectionRect.left <= probeX &&
            sectionRect.right >= probeX
          );
        });
        setIsLight(themedSection?.dataset.theme === "light");
      });
    };

    detectTheme();
    window.addEventListener("scroll", detectTheme, { passive: true });
    window.addEventListener("resize", detectTheme);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", detectTheme);
      window.removeEventListener("resize", detectTheme);
    };
  }, []);

  useEffect(() => {
    const scroller = compactNavRef.current;
    if (!scroller || !isCompactNav) {
      setCompactScrollState({ canScrollPrev: false, canScrollNext: false });
      return;
    }

    let frame = 0;
    const updateScrollState = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        const maxScrollLeft = scroller.scrollWidth - scroller.clientWidth;
        const nextState = {
          canScrollPrev: scroller.scrollLeft > 1,
          canScrollNext: scroller.scrollLeft < maxScrollLeft - 1,
        };
        setCompactScrollState((prev) =>
          prev.canScrollPrev === nextState.canScrollPrev &&
          prev.canScrollNext === nextState.canScrollNext
            ? prev
            : nextState,
        );
      });
    };

    const resizeObserver = new ResizeObserver(updateScrollState);
    resizeObserver.observe(scroller);
    for (const child of scroller.children) {
      resizeObserver.observe(child);
    }

    updateScrollState();
    scroller.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);
    return () => {
      if (frame) window.cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      scroller.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [isCompactNav]);

  const scrollCompactNav = (direction: -1 | 1) => {
    const scroller = compactNavRef.current;
    if (!scroller) return;

    scroller.scrollBy({
      left: direction * Math.min(320, scroller.clientWidth * 0.72),
      behavior: "smooth",
    });
  };

  return (
    <header
      ref={headerRef}
      className="fixed inset-x-0 top-0 z-50 px-4 pt-3 sm:px-6"
      data-name="Section - Header"
    >
      <div
        ref={headerShellRef}
        className="relative mx-auto h-[46px] w-full max-w-[1180px]"
      >
        <nav
          ref={desktopNavRef}
          className={cn(
            "liquid-glass absolute top-0 left-1/2 flex h-[42px] w-max max-w-full -translate-x-1/2 items-center justify-between rounded-full border py-1 pr-1.5 pl-4 transition-[background,border-color,box-shadow,color,opacity] duration-300 ease-out",
            isCompactNav
              ? "pointer-events-none gap-5 opacity-0 min-[1180px]:gap-6 xl:gap-7"
              : "pointer-events-auto gap-5 opacity-100 min-[1180px]:gap-6 xl:gap-7",
            isLight
              ? "liquid-glass-light text-grey-950"
              : "text-white",
          )}
          aria-label="Primary navigation"
          aria-hidden={isCompactNav}
        >
          <a
            href="#top"
            aria-label="Denker home"
            tabIndex={isCompactNav ? -1 : undefined}
            onClick={(event) => {
              event.preventDefault();
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex h-8 shrink-0 items-center"
          >
            <DenkerBrand variant={isLight ? "dark" : "light"} />
          </a>

          <div className="flex items-center gap-3 xl:gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                tabIndex={isCompactNav ? -1 : undefined}
                className={cn(
                  "rounded-full px-3 py-1.5 font-body text-sm font-normal leading-5 transition-colors",
                  isLight
                    ? "text-grey-950 hover:bg-grey-950/8"
                    : "text-white hover:bg-white/9",
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <Button
              variant="primary"
              href={LOGIN_URL}
              tabIndex={isCompactNav ? -1 : undefined}
              className={cn(
                "h-8 px-5 text-sm font-semibold leading-5",
                isLight
                  ? "bg-grey-950 text-white hover:bg-grey-900"
                  : "bg-white text-grey-950 hover:bg-white/90",
              )}
            >
              Get Started
            </Button>
          </div>
        </nav>

        <nav
          className={cn(
            "absolute inset-x-0 top-0 transition-opacity duration-300 ease-out",
            isCompactNav
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none opacity-0",
          )}
          aria-label="Primary navigation"
          aria-hidden={!isCompactNav}
        >
          <div
            ref={compactNavRef}
            className="scrollbar-none flex snap-x snap-mandatory items-center gap-2 overflow-x-auto overscroll-x-contain scroll-smooth"
          >
            <a
              href="#top"
              aria-label="Denker home"
              tabIndex={isCompactNav ? undefined : -1}
              onClick={(event) => {
                event.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className={cn(
                compactBubbleClass(isLight, isCompactNav),
                "px-4",
              )}
              style={{ transitionDelay: "0ms" }}
            >
              <DenkerBrand variant={isLight ? "dark" : "light"} />
            </a>

            {navLinks.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                tabIndex={isCompactNav ? undefined : -1}
                className={cn(
                  compactBubbleClass(isLight, isCompactNav),
                  "px-4 font-body text-sm font-normal leading-5",
                )}
                style={{ transitionDelay: `${index * 28}ms` }}
              >
                {link.label}
              </a>
            ))}

            <Button
              variant="primary"
              href={LOGIN_URL}
              tabIndex={isCompactNav ? undefined : -1}
              className={cn(
                "h-[42px] shrink-0 snap-start px-5 text-sm font-semibold leading-5 transition-[background,border-color,box-shadow,color,opacity] duration-300 ease-out",
                isCompactNav ? "opacity-100" : "opacity-0",
                isLight
                  ? "bg-grey-950 text-white hover:bg-grey-900"
                  : "bg-white text-grey-950 hover:bg-white/90",
              )}
              style={{ transitionDelay: `${(navLinks.length + 1) * 28}ms` }}
            >
              Get Started
            </Button>
          </div>

          <button
            type="button"
            aria-label="Scroll navigation left"
            disabled={!compactScrollState.canScrollPrev}
            onClick={() => scrollCompactNav(-1)}
            className={cn(
              "absolute top-0 -left-2 z-10 flex h-[42px] w-8 items-center justify-center transition-opacity duration-200",
              compactScrollState.canScrollPrev
                ? "opacity-100"
                : "pointer-events-none opacity-0",
              isLight ? "text-grey-950" : "text-white",
            )}
          >
            <ChevronLeft aria-hidden="true" size={25} strokeWidth={2.8} />
          </button>
          <button
            type="button"
            aria-label="Scroll navigation right"
            disabled={!compactScrollState.canScrollNext}
            onClick={() => scrollCompactNav(1)}
            className={cn(
              "absolute top-0 -right-2 z-10 flex h-[42px] w-8 items-center justify-center transition-opacity duration-200",
              compactScrollState.canScrollNext
                ? "opacity-100"
                : "pointer-events-none opacity-0",
              isLight ? "text-grey-950" : "text-white",
            )}
          >
            <ChevronRight aria-hidden="true" size={25} strokeWidth={2.8} />
          </button>
        </nav>
      </div>
    </header>
  );
}

function compactBubbleClass(isLight: boolean, isCompactNav: boolean) {
  return cn(
    "liquid-glass header-compact-bubble flex h-[42px] shrink-0 snap-start items-center rounded-full border transition-[background,border-color,box-shadow,color,opacity] duration-300 ease-out",
    isCompactNav ? "opacity-100" : "opacity-0",
    isLight
      ? "liquid-glass-light text-grey-950 hover:bg-white/55"
      : "text-white hover:bg-white/12",
  );
}

function DenkerBrand({ variant = "light" }: { variant?: "light" | "dark" }) {
  return (
    <span className="flex h-8 -translate-y-px items-center gap-1">
      <Image
        src={variant === "dark" ? "/logo/symbol-black.svg" : "/logo/symbol-white.svg"}
        alt=""
        width={16}
        height={16}
        className="block size-4"
      />
      <Image
        src={
          variant === "dark"
            ? "/images/brand/brand-text-dark.svg"
            : "/images/brand/brand-text.svg"
        }
        alt=""
        width={48}
        height={12}
        data-brand-text
        className="block h-3 w-12"
      />
    </span>
  );
}
