"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/cn";

const PEERLIST_URL = "https://peerlist.io/denker/project/denker";
const PRODUCT_HUNT_URL =
  "https://www.producthunt.com/products/denker?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-denker";

type BadgeId = "peerlist" | "producthunt";

export function LaunchBadges({ visible }: { visible: boolean }) {
  const [expandedBadge, setExpandedBadge] = useState<BadgeId | null>(null);

  return (
    <div
      className="hero-launch-badges absolute top-[82px] z-20 flex items-center justify-center gap-1.5"
      data-visible={visible ? "true" : "false"}
    >
      <div className="hidden items-center justify-center gap-1.5 sm:flex">
        <PeerlistBadge />
        <ProductHuntBadge />
      </div>

      <div className="flex items-center justify-center gap-1.5 sm:hidden">
        {expandedBadge === "peerlist" ? (
          <PeerlistBadge />
        ) : (
          <CompactBadgeButton
            label="Expand Peerlist badge"
            icon="/logos/Peerlist.svg"
            iconClassName="size-6 rounded-[8px]"
            onClick={() => setExpandedBadge("peerlist")}
          />
        )}

        {expandedBadge === "producthunt" ? (
          <ProductHuntBadge />
        ) : (
          <CompactBadgeButton
            label="Expand Product Hunt badge"
            icon="/images/social/producthunt.svg"
            iconClassName="size-6 rounded-full"
            onClick={() => setExpandedBadge("producthunt")}
          />
        )}
      </div>
    </div>
  );
}

function CompactBadgeButton({
  label,
  icon,
  iconClassName,
  onClick,
}: {
  label: string;
  icon: string;
  iconClassName?: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-[34px] shrink-0 items-center justify-center rounded-full border border-[#d7dde6] bg-white shadow-[0_8px_22px_rgba(0,0,0,0.16)] transition-transform hover:scale-[1.035] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/70"
    >
      <Image
        src={icon}
        alt=""
        width={24}
        height={24}
        className={cn("size-6", iconClassName)}
      />
    </button>
  );
}

function PeerlistBadge() {
  return (
    <a
      href={PEERLIST_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="#1 project of the week on Peerlist"
      className="flex h-[34px] w-[156px] items-center gap-1 overflow-hidden rounded-[11px] border border-[#d7dde6] bg-white px-1.5 text-left shadow-[0_8px_22px_rgba(0,0,0,0.16)] transition-transform hover:scale-[1.015]"
    >
      <span className="flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-[8px] bg-[#1b9847]">
        <Image
          src="/logos/Peerlist.svg"
          alt=""
          width={24}
          height={24}
          className="size-6"
        />
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden font-sans leading-none text-grey-950">
        <span className="block whitespace-nowrap text-[7.5px] font-bold leading-[9px] tracking-normal text-grey-950">
          #1 Project of the week
        </span>
        <span className="mt-px block whitespace-nowrap font-serif text-[10px] leading-[11px] text-grey-950">
          <strong className="font-bold leading-[11px]">Peerlist</strong>{" "}
          <em className="font-normal italic leading-[11px]">Launch</em>
        </span>
      </span>
      <span
        aria-label="180 upvotes"
        className="flex h-[26px] w-5 shrink-0 flex-col items-center justify-center font-sans text-[#1b9847]"
      >
        <span
          aria-hidden
          className="h-0 w-0 border-x-[4.5px] border-b-[7px] border-x-transparent border-b-current"
        />
        <span className="mt-0.5 text-[9px] font-bold leading-[10px] text-grey-950">
          180
        </span>
      </span>
    </a>
  );
}

function ProductHuntBadge() {
  return (
    <a
      href={PRODUCT_HUNT_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Denker on Product Hunt"
      className="block h-[34px] w-[156px] overflow-hidden rounded-[11px] bg-white shadow-[0_8px_22px_rgba(0,0,0,0.16)] transition-transform hover:scale-[1.015]"
    >
      <img
        alt="Denker - Your AI coworker that follows where you work | Product Hunt"
        width="160"
        height="38"
        src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1181779&theme=light&t=1783203203945"
        className="-m-0.5 h-[38px] w-[160px] max-w-none"
      />
    </a>
  );
}
