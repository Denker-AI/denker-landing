"use client";

import { useState } from "react";
import { BlogFilter, type BlogFilterTab } from "@/components/blog-filter";

export function BlogGrid({ children }: { children: React.ReactNode }) {
  const [active, setActive] = useState<BlogFilterTab>("all");

  return (
    <>
      <BlogFilter active={active} onChange={setActive} />
      <div
        className="grid gap-6 sm:grid-cols-2"
        data-testid="blog-grid"
        data-active-filter={active}
      >
        {children}
      </div>
      <style>{`
        [data-active-filter="newsletter"] [data-category]:not([data-category="newsletter"]) { display: none; }
        [data-active-filter="changelog"] [data-category]:not([data-category="changelog"]) { display: none; }
        [data-active-filter="use-case"] [data-category]:not([data-category="use-case"]) { display: none; }
      `}</style>
    </>
  );
}
