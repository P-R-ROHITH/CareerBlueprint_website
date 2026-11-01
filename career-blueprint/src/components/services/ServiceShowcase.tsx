import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Photo from "@/components/ui/Photo";
import Stage from "@/components/journey/Stage";
import type { StationKey } from "@/components/journey/scenes";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";
import { whatsappLink } from "@/config/site";
import { bySlug, type Service } from "@/data/services";
import type { PhotoKey } from "@/data/images";

const imageClass =
  "absolute inset-0 transition-transform duration-700 ease-(--ease-out) group-hover:scale-[1.04] group-focus-visible:scale-[1.04]";

function Feature({ s, photo, aspect }: { s: Service; photo: PhotoKey; aspect: string }) {
  return (
    <Link href={s.href!} className="group block">
      <ImageReveal>
        <div className={`relative overflow-hidden bg-navy ${aspect}`}>
          <div className={imageClass}>
            <Photo name={photo} sizes="(min-width: 1024px) 55vw, 100vw" />
          </div>
        </div>
      </ImageReveal>
      <div className="mt-5 flex items-start justify-between gap-6">
        <div>
          <h3 className="display text-2xl text-navy">{s.title}</h3>
          <p className="mt-2 max-w-md text-ink/85">{s.short}</p>
        </div>
        <span className="mt-1 inline-flex size-10 shrink-0 items-center justify-center border border-navy/25 text-navy transition-colors group-hover:border-gold group-hover:bg-gold">
          <ArrowRight className="size-4 transition-transform duration-300 ease-(--ease-out) group-hover:translate-x-0.5" strokeWidth={1.75} aria-hidden />
          <span className="sr-only">Learn more about {s.title}</span>
        </span>
      </div>
    </Link>
  );
}

function EnquiryRow({ s }: { s: Service }) {
  return (
    <a
      href={whatsappLink(`Hi Career Blueprint, I'd like to enquire about ${s.title}.`)}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-start justify-between gap-6 border-y border-navy/10 py-6"
    >
      <div>
        <h3 className="display text-2xl text-navy transition-colors group-hover:text-royal">{s.title}</h3>
        <p className="mt-2 max-w-md text-ink/85">{s.short}</p>
      </div>
      <span className="mt-1 inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-navy">
        Enquire
        <ArrowUpRight className="size-4 transition-transform duration-300 ease-(--ease-out) group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={1.75} aria-hidden />
      </span>
    </a>
  );
}

/** One row: the service on one side, its scene of the journey on the other. Sides alternate down the page. */
function Row({ flip, station, children }: { flip?: boolean; station: StationKey; children: ReactNode }) {
  return (
    <Reveal>
      <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-16">
        <div className={flip ? "lg:order-2" : undefined}>{children}</div>
        <Stage station={station} wide />
      </div>
    </Reveal>
  );
}

/** One service under the other, each beside its own scene of the journey. */
export default function ServiceShowcase() {
  return (
    <div className="flex flex-col gap-10">
      <Row station="interview">
        <Feature s={bySlug("interview")} photo="interview" aspect="aspect-[16/10]" />
      </Row>
      <Row station="resume" flip>
        <Feature s={bySlug("resume")} photo="resume" aspect="aspect-[16/10]" />
      </Row>
      <Row station="personality">
        <EnquiryRow s={bySlug("personality")} />
      </Row>
      <Row station="nios" flip>
        <EnquiryRow s={bySlug("nios")} />
      </Row>
    </div>
  );
}
