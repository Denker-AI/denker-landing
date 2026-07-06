import Image from "next/image";
import { cn } from "@/lib/cn";

// Front view for the solo desktop beat: screen-dominant, like Apple's hero
// MacBook shot. The display asset is a native Mac screen capture (3024x1964),
// framed by a thin bezel, notch, and aluminum lower lip.
export function HeroMacBookFront({ className }: { className?: string }) {
  return (
    <div className={cn("hero-macbook-front", className)}>
      <div className="hero-macbook-front-lid">
        <Image
          src="/images/hero/denker-desktop-screenshot.jpg"
          alt=""
          fill
          sizes="(max-width: 767px) 92vw, 74vw"
          quality={90}
          className="hero-macbook-front-display"
          priority
        />
        <span className="hero-macbook-front-notch" aria-hidden="true" />
      </div>
      <div className="hero-macbook-front-base" aria-hidden="true">
        <span className="hero-macbook-front-scoop" />
      </div>
    </div>
  );
}
