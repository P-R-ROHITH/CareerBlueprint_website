"use client";

import { useRef, useState } from "react";
import * as m from "motion/react-m";
import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { cn } from "@/lib/utils";

/**
 * The door from the logo, closing the page: it swings open as it scrolls into view,
 * light spills out and a WhatsApp button appears in the doorway.
 * Decorative. The real buttons sit beside it and never depend on the animation.
 */
export default function OpeningDoor({ href, className }: { href: string; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);

  // 0 when the door's top edge enters the screen, 1 once its bottom is 12% up from the screen's bottom edge.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end 88%"] });
  const angle = useTransform(scrollYProgress, [0.15, 0.85], [0, 76]);
  const light = useTransform(scrollYProgress, [0.3, 0.85], [0, 1]);
  const button = useTransform(scrollYProgress, [0.65, 0.95], [0, 1]);
  const buttonScale = useTransform(scrollYProgress, [0.65, 0.95], [0.7, 1]);

  useMotionValueEvent(scrollYProgress, "change", (v) => setReady(v > 0.8));
  const tappable = reduce || ready;

  return (
    <div ref={ref} aria-hidden className={cn("relative h-56 w-36 sm:h-72 sm:w-48", className)}>
      <m.div
        style={reduce ? { opacity: 0.5 } : { opacity: light }}
        className="pointer-events-none absolute -inset-8 rounded-full bg-gold/40 blur-3xl"
      />

      <div className="absolute inset-0 border-[5px] border-gold bg-navy-deep">
        <div className="relative size-full" style={{ perspective: "900px" }}>
          <m.div
            style={reduce ? undefined : { opacity: light }}
            className="absolute inset-0 bg-linear-to-t from-gold to-[#fbefc4]"
          />

          <m.div
            style={reduce ? undefined : { opacity: button, scale: buttonScale }}
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              tabIndex={-1}
              className={cn(
                "inline-flex size-14 items-center justify-center rounded-full bg-navy text-gold shadow-lg shadow-navy-deep/30 transition-colors hover:bg-royal",
                tappable ? "pointer-events-auto" : "pointer-events-none",
              )}
            >
              <WhatsAppIcon className="size-7" />
            </a>
          </m.div>

          <m.div
            style={reduce ? { rotateY: 76 } : { rotateY: angle }}
            className="absolute inset-0 origin-left bg-linear-to-r from-royal to-[#1d4fd0] will-change-transform"
          >
            <span className="absolute inset-x-3 top-4 bottom-1/2 border border-white/15" />
            <span className="absolute inset-x-3 top-1/2 bottom-4 mt-2 border border-white/15" />
            <span className="absolute top-1/2 right-3 size-2.5 rounded-full bg-gold" />
          </m.div>
        </div>
      </div>
    </div>
  );
}
