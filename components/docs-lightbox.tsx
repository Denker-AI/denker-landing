"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";

interface DocsImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  testId?: string;
}

export function DocsImage({ src, alt, width, height, testId }: DocsImageProps) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="mt-4 block w-full cursor-zoom-in overflow-hidden rounded-xl border border-glass-stroke-subtle transition-all hover:border-glass-stroke-light hover:shadow-glass-sm"
        data-testid={testId}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes="(min-width: 768px) 768px, 100vw"
          className="w-full"
        />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm sm:p-8"
          onClick={close}
          data-testid={testId ? `${testId}-lightbox` : undefined}
        >
          <button
            type="button"
            onClick={close}
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
            aria-label="Close"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="5" y1="5" x2="15" y2="15" />
              <line x1="15" y1="5" x2="5" y2="15" />
            </svg>
          </button>
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            sizes="90vw"
            className="max-h-[90vh] max-w-full cursor-zoom-out rounded-lg object-contain"
            onClick={(e) => {
              e.stopPropagation();
              close();
            }}
          />
        </div>
      )}
    </>
  );
}
