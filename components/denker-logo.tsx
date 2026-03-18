import { cn } from "@/lib/cn";
import Image from "next/image";

type LogoVariant = "symbol" | "wordmark";

interface DenkerLogoProps {
  variant?: LogoVariant;
  height?: number;
  className?: string;
}

const SRCS: Record<LogoVariant, { dark: string; light: string }> = {
  symbol: {
    dark: "/logo/symbol-white.svg",
    light: "/logo/symbol-dark-green.svg",
  },
  wordmark: {
    dark: "/logo/logo-white.svg",
    light: "/logo/logo-black.svg",
  },
};

export function DenkerLogo({
  variant = "symbol",
  height = 24,
  className,
}: DenkerLogoProps) {
  return (
    <span className={cn("inline-flex shrink-0", className)}>
      {/* Light mode — green logo */}
      <Image
        src={SRCS[variant].light}
        alt="Denker"
        width={Math.round(height * 3.5)}
        height={height}
        className="dark:hidden"
        style={{ height, width: "auto" }}
        priority
      />
      {/* Dark mode — white logo */}
      <Image
        src={SRCS[variant].dark}
        alt="Denker"
        width={Math.round(height * 3.5)}
        height={height}
        className="hidden dark:block"
        style={{ height, width: "auto" }}
        priority
      />
    </span>
  );
}
