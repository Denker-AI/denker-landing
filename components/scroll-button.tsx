"use client";

import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";

export function ScrollButton() {
  const [atBottom, setAtBottom] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const distFromBottom =
        document.documentElement.scrollHeight -
        window.scrollY -
        window.innerHeight;
      setAtBottom(distFromBottom < 80);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleClick = () => {
    if (atBottom) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      window.scrollTo({
        top: document.documentElement.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label={atBottom ? "Scroll to top" : "Scroll to bottom"}
      className="landing-liquid-button fixed bottom-6 right-6 z-50 flex h-10 w-10 items-center justify-center rounded-full border border-glass-stroke bg-white/[0.08] shadow-glass backdrop-blur-glass transition-all hover:bg-white/[0.14]"
      data-testid="scroll-page-button"
    >
      {atBottom ? (
        <Icons.ChevronDown className="h-4 w-4 rotate-180 text-secondary transition-transform" />
      ) : (
        <Icons.ChevronDown className="h-4 w-4 text-secondary" />
      )}
    </button>
  );
}
