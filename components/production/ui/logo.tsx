import { cn } from "@/lib/cn";

type LogoVariant = "symbol" | "wordmark";
type LogoColor = "auto" | "white" | "green" | "currentColor";

export interface DenkerLogoProps {
  /** "symbol" = mark only, "wordmark" = mark + logotype */
  variant?: LogoVariant;
  /** "auto" = switches with theme, fixed values use assets, "currentColor" = token-colored symbol */
  color?: LogoColor;
  height?: number;
  className?: string;
}

const SRCS: Record<LogoVariant, Record<"green" | "white" | "black", string>> = {
  symbol: {
    green: "/logo/symbol-dark-green.svg",
    white: "/logo/symbol-white.svg",
    black: "/logo/Denker_Symbol_Black.svg",
  },
  wordmark: {
    green: "/logo/logo-dark-green.svg",
    white: "/logo/logo-white.svg",
    black: "/logo/Denker_Symbol_Black.svg",
  },
};

export function DenkerLogo({
  variant = "symbol",
  color = "auto",
  height = 24,
  className,
}: DenkerLogoProps) {
  if (color === "currentColor") {
    return (
      <svg
        role="img"
        aria-label="Denker"
        className={cn("shrink-0", className)}
        style={{ height, width: "auto" }}
        viewBox="0 0 780 780"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g transform="matrix(1,0,0,1,-2200,0)">
          <g transform="matrix(0.404984,0,0,0.44546,2200,0)">
            <g transform="matrix(4.938462,0,0,4.478261,-740.769231,-1294.217391)">
              <path
                fill="currentColor"
                d="M274.645,533.768C280.365,528.034 282.076,519.409 278.98,511.916C275.884,504.424 268.592,499.538 260.503,499.538L150,499.538L150,469.462L300,469.462C316.569,469.462 330,455.996 330,439.385L330,289L360,289L360,399.786C360,407.896 364.873,415.207 372.346,418.311C379.82,421.414 388.422,419.699 394.142,413.964C427.176,380.846 472.279,335.627 472.279,335.627L493.492,356.894C493.492,356.894 448.389,402.114 415.355,435.232C409.635,440.966 407.924,449.591 411.02,457.084C414.116,464.576 421.408,469.462 429.497,469.462L540,469.462L540,499.538L390,499.538C373.431,499.538 360,513.004 360,529.615L360,680L330,680L330,569.214C330,561.104 325.127,553.793 317.654,550.689C310.18,547.586 301.578,549.301 295.858,555.036C262.824,588.154 217.721,633.373 217.721,633.373L196.508,612.106C196.508,612.106 241.611,566.886 274.645,533.768Z"
              />
            </g>
          </g>
        </g>
      </svg>
    );
  }

  if (color === "auto") {
    return (
      <span className={cn("inline-flex shrink-0", className)}>
        {/* Light mode — black on light background */}
        <img
          src={SRCS[variant].black}
          alt="Denker"
          className="dark:hidden"
          style={{ height, width: "auto" }}
        />
        {/* Dark mode — white on dark background */}
        <img
          src={SRCS[variant].white}
          alt="Denker"
          className="hidden dark:block"
          style={{ height, width: "auto" }}
        />
      </span>
    );
  }

  return (
    <img
      src={SRCS[variant][color]}
      alt="Denker"
      className={cn("shrink-0", className)}
      style={{ height, width: "auto" }}
    />
  );
}
