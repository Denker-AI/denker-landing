import Image from "next/image";
import { cn } from "@/lib/cn";

// The asset already contains the full Denker desktop baked into the screen
// (wallpaper, frames, dock), so no screen overlay is needed. If Phase 2 wants
// live screen content, it layers a widget over the baked screen area then.
export function HeroMacBook({ className }: { className?: string }) {
  return (
    <div className={cn("hero-macbook", className)}>
      <Image
        src="/images/hero/denker-macbook-topdown.png"
        alt=""
        fill
        sizes="(max-width: 767px) 92vw, 60vw"
        quality={90}
        className="hero-macbook-device"
        priority
      />
    </div>
  );
}
