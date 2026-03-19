"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { Icons } from "@/components/icons";

interface WaitlistFormProps {
  className?: string;
  size?: "default" | "compact";
}

export function WaitlistForm({ className, size = "default" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong");
      }
      setStatus("success");
      // Track conversion in PostHog
      const ph = (window as unknown as Record<string, unknown>).posthog as
        | { capture?: (event: string, properties?: Record<string, unknown>) => void }
        | undefined;
      ph?.capture?.("waitlist_signup");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  if (status === "success") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-3",
          className,
        )}
        data-testid="waitlist-success"
      >
        <Icons.CheckCircle className="h-5 w-5 shrink-0 text-accent" />
        <p className="text-sm text-primary">You&apos;re on the list. We&apos;ll be in touch soon.</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("relative flex w-full max-w-xl flex-wrap gap-2", className)}
      data-testid="waitlist-form"
    >
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className={cn(
          "flex-1 rounded-full border border-glass-stroke bg-glass-fill px-4 text-sm text-primary",
          "placeholder:text-muted backdrop-blur-glass focus:border-accent focus:outline-none",
          "focus:shadow-input-focus transition-all",
          size === "default" ? "h-12" : "h-10",
        )}
        data-testid="waitlist-email"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className={cn(
          "shrink-0 rounded-full bg-accent font-semibold text-[#0F1115] shadow-glow-accent",
          "transition-all hover:brightness-110 disabled:opacity-40",
          size === "default" ? "h-12 px-6 text-sm" : "h-10 px-4 text-xs",
        )}
        data-testid="waitlist-submit"
      >
        {status === "loading" ? "Joining..." : "Join Waitlist"}
      </button>
      {status === "error" && (
        <p className="absolute -bottom-6 left-0 text-xs text-danger" data-testid="waitlist-error">
          {errorMsg}
        </p>
      )}
    </form>
  );
}
