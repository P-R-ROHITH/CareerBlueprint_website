import type { StationKey } from "@/components/journey/scenes";
import { cn } from "@/lib/utils";

/**
 * An empty, decorative area that holds one scene of the journey (see Journey.tsx). It reserves the space so the
 * drawing never sits on top of the real content. `tone="dark"` is for navy backgrounds.
 */
export default function Stage({ station, tone = "light", tall = false, wide = false, className }: { station: StationKey; tone?: "light" | "dark"; tall?: boolean; wide?: boolean; className?: string }) {
  const size = tall ? "h-[15rem] sm:h-[19rem] lg:h-[23rem]" : wide ? "h-[11rem] sm:h-[13rem] lg:h-[15rem]" : "h-[9rem] sm:h-[10rem] lg:h-[11.5rem]";
  return <div aria-hidden data-station={station} data-tone={tone} className={cn(size, className)} />;
}
