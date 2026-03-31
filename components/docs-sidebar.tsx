"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/cn";

const DOCS_NAV = [
  { href: "/docs/getting-started", label: "Getting Started" },
  { href: "/docs/how-denker-works", label: "How Denker Works" },
  { href: "/docs/integrations", label: "Integrations" },
];

export function DocsNav() {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile — small text links */}
      <nav className="mb-10 flex gap-4 lg:hidden">
        {DOCS_NAV.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "text-sm transition-colors",
                active
                  ? "font-medium text-accent"
                  : "text-muted hover:text-secondary"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Desktop — fixed left sidebar */}
      <nav className="fixed left-6 top-32 hidden pt-14 lg:block xl:left-10 sm:pt-16">
        <Link
          href="/docs"
          className="mb-5 block text-xs font-semibold uppercase tracking-widest text-muted transition-colors hover:text-secondary"
        >
          Docs
        </Link>
        <ul className="flex flex-col gap-2">
          {DOCS_NAV.map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block text-sm transition-colors",
                    active
                      ? "font-medium text-accent"
                      : "text-muted hover:text-secondary"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="mt-8 border-t border-glass-stroke-subtle pt-6">
          <a
            href="mailto:support@denker.ai"
            className="text-sm text-muted transition-colors hover:text-secondary"
          >
            Need more help?
          </a>
        </div>
      </nav>
    </>
  );
}
