import Image from "next/image";
import { cn } from "@/lib/cn";

// Screen inset within denker-macbook-physical-tight-opaque.png, measured in
// percentages of the asset's natural 2040x1919 box. Measured directly against
// the PNG's pixel data (screen glass edges at left=52px, top=28px, right=1987px,
// bottom=794px) and verified by rendering a bounding box over the source image.
const SCREEN = { left: "2.55%", top: "1.46%", width: "94.85%", height: "39.92%" };

export function HeroMacBook({ className }: { className?: string }) {
  return (
    <div className={cn("hero-macbook", className)}>
      <Image
        src="/images/hero/denker-macbook-physical-tight-opaque.png"
        alt=""
        fill
        sizes="(max-width: 767px) 82vw, 44vw"
        className="hero-macbook-device"
        priority
      />
      <div className="hero-macbook-screen" style={SCREEN} aria-hidden="true">
        <Image
          src="/images/hero/denker-desktop-screenshot.jpg"
          alt=""
          fill
          sizes="40vw"
          className="hero-macbook-screen-image"
        />
      </div>
    </div>
  );
}
