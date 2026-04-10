"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/cn";

const TABS = [
  { key: "all", label: "All" },
  { key: "newsletter", label: "Newsletter" },
  { key: "changelog", label: "Changelog" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export function BlogFilter() {
  const [active, setActive] = useState<TabKey>("all");

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>("[data-category]");
    cards.forEach((card) => {
      const category = card.dataset.category;
      const show = active === "all" || category === active;
      card.style.display = show ? "" : "none";
    });
  }, [active]);

  return (
    <div className="mb-8 flex justify-center gap-2" data-testid="blog-filter">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => setActive(tab.key)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition-all",
            active === tab.key
              ? "bg-accent/10 text-accent border border-accent/30"
              : "text-muted border border-transparent hover:text-secondary hover:border-glass-stroke",
          )}
          data-testid={`blog-filter-${tab.key}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
