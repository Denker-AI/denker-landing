"use client";

import { useState } from "react";
import { Icons } from "@/components/icons";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Something went wrong");
      setStatus("success");
      setEmail("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-3">
        <Icons.CheckCircle className="h-4 w-4 shrink-0 text-accent" />
        <p className="text-sm text-primary">You&apos;re subscribed!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full flex-col gap-2 sm:flex-row" data-testid="newsletter-form">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="name@company.com"
        className="h-10 w-full rounded-full border border-glass-stroke bg-glass-fill px-4 text-sm text-primary placeholder:text-muted backdrop-blur-glass transition-all focus:border-accent focus:outline-none sm:flex-1"
        data-testid="newsletter-email"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="h-10 shrink-0 rounded-full bg-primary px-5 text-xs font-semibold text-canvas transition-all hover:opacity-80 disabled:opacity-40"
        data-testid="newsletter-submit"
      >
        {status === "loading" ? "..." : "Submit"}
      </button>
    </form>
  );
}
