import { useId } from "react";
import Image from "next/image";
import { photos, type PhotoKey } from "@/data/images";

type Art = "stairs" | "chat" | "doc" | "cap" | "peak";

const artFor: Record<PhotoKey, Art> = {
  hero: "stairs",
  interview: "chat",
  nios: "cap",
  resume: "doc",
  personality: "peak",
  about: "stairs",
  interviewHero: "chat",
  resumeHero: "doc",
  workspace: "doc",
};

const gold = "var(--color-gold)";
const line = "rgba(255,255,255,0.85)";

function Drawing({ art }: { art: Art }) {
  switch (art) {
    case "stairs":
      return (
        <g strokeLinejoin="round" strokeLinecap="round">
          {/* Door at the top of the stairs, lit from inside. */}
          <rect x="292" y="40" width="52" height="72" fill="#eaf2ff" fillOpacity="0.14" stroke={gold} strokeWidth="2.5" />
          <path d="M292 112 L270 112 L270 52 L292 40" fill="#eaf2ff" fillOpacity="0.07" stroke={gold} strokeWidth="2" />
          {/* Solid steps, each a little lighter than the one below. */}
          {[0, 1, 2, 3, 4].map((i) => (
            <g key={i}>
              <rect x={40 + i * 62} y={250 - i * 35} width="70" height={300 - (250 - i * 35)} fill="#2563eb" fillOpacity={0.14 + i * 0.07} />
              <path d={`M${40 + i * 62} ${250 - i * 35} H${110 + i * 62}`} stroke={line} strokeWidth="2.5" />
            </g>
          ))}
          {/* Figure with a briefcase, mid-climb. */}
          <circle cx="208" cy="124" r="9" fill="#eaf2ff" />
          <path d="M208 136 L203 164 M205 144 L190 158 M205 144 L222 150 M203 164 L192 178 M203 164 L214 176" stroke="#eaf2ff" strokeWidth="7" fill="none" />
          <rect x="176" y="156" width="14" height="11" rx="1.5" fill={gold} stroke="none" />
        </g>
      );
    case "chat":
      return (
        <g fill="none" strokeWidth="2" strokeLinejoin="round">
          <path d="M70 80 H220 V160 H130 L100 188 V160 H70 Z" stroke={line} />
          <path d="M180 190 H330 V260 H300 V284 L270 260 H180 Z" stroke={gold} />
          <path d="M92 108 H198 M92 128 H170" stroke={line} />
          <path d="M202 214 H308 M202 234 H272" stroke={gold} />
        </g>
      );
    case "doc":
      return (
        <g fill="none" strokeWidth="2" strokeLinejoin="round">
          <path d="M110 40 H250 L290 80 V260 H110 Z" stroke={line} />
          <path d="M250 40 V80 H290" stroke={line} />
          <path d="M138 110 H210 M138 138 H262 M138 160 H262 M138 182 H230 M138 214 H190" stroke={line} />
          <path d="M300 120 L340 80 L352 92 L312 132 L296 136 Z" stroke={gold} />
        </g>
      );
    case "cap":
      return (
        <g fill="none" strokeWidth="2" strokeLinejoin="round">
          <path d="M200 70 L330 120 L200 170 L70 120 Z" stroke={line} />
          <path d="M120 145 V190 C150 215 250 215 280 190 V145" stroke={line} />
          <path d="M330 120 V190" stroke={gold} />
          <path d="M80 250 H320 M96 232 H304 M112 214 H288" stroke={gold} />
        </g>
      );
    case "peak":
      return (
        <g fill="none" strokeWidth="2" strokeLinejoin="round">
          <path d="M30 262 L150 120 L205 190 L255 130 L370 262 Z" stroke={line} />
          <path d="M150 120 V84 L186 98 L150 112" stroke={gold} />
          <circle cx="300" cy="64" r="22" stroke={gold} />
        </g>
      );
  }
}

/** Branded stand-in graphic used while a photography slot has no photo yet. */
function BlueprintArt({ art }: { art: Art }) {
  const id = `grid-${useId()}`;
  return (
    <div className="absolute inset-0 bg-navy" aria-hidden="true">
      {/* Grid fills any frame; the drawing is centred and never cropped. */}
      <svg className="absolute inset-0 size-full">
        <defs>
          <pattern id={id} width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M20 0H0V20" fill="none" stroke="#2563eb" strokeOpacity="0.28" strokeWidth="0.6" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${id})`} />
      </svg>
      <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid meet" className="absolute inset-0 size-full p-[6%]">
        <Drawing art={art} />
      </svg>
    </div>
  );
}

/**
 * Fills its positioned parent. Parent needs `relative` and a size or aspect ratio.
 */
export default function Photo({
  name,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  priority = false,
  className = "",
}: {
  name: PhotoKey;
  sizes?: string;
  priority?: boolean;
  className?: string;
}) {
  const p = photos[name];
  if (!p.src) return <BlueprintArt art={artFor[name]} />;
  return (
    <Image src={p.src} alt={p.alt} fill sizes={sizes} priority={priority} className={`object-cover ${className}`} />
  );
}
