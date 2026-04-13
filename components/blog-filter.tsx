"use client";

import { cn } from "@/lib/cn";

const TABS = [
  { key: "all", label: "All" },
  { key: "newsletter", label: "Newsletter" },
  { key: "changelog", label: "Changelog" },
  { key: "use-case", label: "Use Cases" },
] as const;

export type BlogFilterTab = (typeof TABS)[number]["key"];

export function BlogFilter({
  active,
  onChange,
}: {
  active: BlogFilterTab;
  onChange: (tab: BlogFilterTab) => void;
}) {
  return (
    <div className="mb-8 flex justify-center gap-2" data-testid="blog-filter">
      {TABS.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
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
