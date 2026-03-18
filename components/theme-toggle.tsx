"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";

export function ThemeToggle() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [dark]);

  return (
    <button
      onClick={() => setDark((d) => !d)}
      className={cn(
        "relative flex h-[34px] w-[34px] items-center justify-center rounded-lg",
        "border border-glass-stroke bg-glass-fill backdrop-blur-glass",
        "text-secondary transition-all hover:text-primary hover:border-glass-stroke-light",
      )}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      data-testid="theme-toggle"
    >
      {/* Sun icon (shown in dark mode → click to go light) */}
      <svg
        className={cn(
          "h-4 w-4 transition-all duration-300",
          dark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0",
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      {/* Moon icon (shown in light mode → click to go dark) */}
      <svg
        className={cn(
          "absolute h-4 w-4 transition-all duration-300",
          dark ? "-rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100",
        )}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
      </svg>
    </button>
  );
}
