import Link from "next/link";
import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "primary" | "secondary";

type ButtonProps = ComponentPropsWithoutRef<"a"> & {
  variant?: ButtonVariant;
};

// Hover states mirror the Figma button system: Primary darkens to primary-700
// with an elevation shadow; Secondary lifts its fill to grey-800.
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-primary-600 text-white hover:bg-primary-700 hover:shadow-btn-hover",
  secondary:
    "bg-grey-900 text-white border border-grey-700 hover:bg-grey-800",
};

export function Button({
  variant = "primary",
  className,
  href = "#",
  ...props
}: ButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-full px-6 font-body text-lg font-medium transition-[color,background-color,border-color,box-shadow]",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}
