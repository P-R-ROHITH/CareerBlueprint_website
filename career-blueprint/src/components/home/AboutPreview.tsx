import { Check } from "lucide-react";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import SectionHeading from "@/components/ui/SectionHeading";
import Parallax from "@/components/motion/Parallax";
import Stage from "@/components/journey/Stage";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";

const points = [
  "Preparation built around practice, not theory alone",
  "Guidance shaped around your own goals",
  "Clear next steps, with no inflated promises",
];

export default function AboutPreview() {
  return (
    <section data-bp="about" className="bg-navy text-white">
      <div className="container-page grid items-center gap-12 py-20 md:py-28 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div>
          <ImageReveal>
            <Parallax className="relative aspect-[4/5] max-h-[34rem] overflow-hidden bg-navy-deep">
              <div className="relative size-[112%] -translate-y-[6%]">
                <Photo name="about" sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            </Parallax>
          </ImageReveal>
        </div>
        <Reveal>
          <SectionHeading tone="dark">Guidance that stays practical.</SectionHeading>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/80">
            Career Blueprint is a career guidance and training business. We help students and job seekers understand
            their goals, build the right skills and approach opportunities with more confidence.
          </p>
          <ul className="mt-8 max-w-lg divide-y divide-white/15 border-y border-white/15">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3 py-3.5 text-white/90">
                <Check className="mt-1 size-4 shrink-0 text-gold" strokeWidth={2} aria-hidden />
                {p}
              </li>
            ))}
          </ul>
          <Button href="/about" variant="outlineLight" className="mt-9">
            About Career Blueprint
          </Button>
          <Stage station="about" tone="dark" className="mt-6" />
        </Reveal>
      </div>
    </section>
  );
}
