import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import HeroFrame from "./HeroFrame";
import { contact, whatsappLink } from "@/config/site";

export default function HomeHero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <div className="container-page relative grid items-center gap-10 py-10 md:py-14 lg:min-h-[calc(100svh-72px)] lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-10">
        <div>
          <h1 data-station="hero" className="display text-[clamp(1.95rem,3.7vw,3.3rem)] text-navy">
            <span className="rise block" style={{ "--i": 0 } as React.CSSProperties}>
              Build the Skills.
            </span>
            <span className="rise block" style={{ "--i": 1 } as React.CSSProperties}>
              Gain the Confidence.
            </span>
            <span className="rise block text-gold-deep" style={{ "--i": 2 } as React.CSSProperties}>
              Move Closer to Your Dream Job.
            </span>
          </h1>
          <p className="rise mt-6 max-w-md text-lg leading-relaxed text-ink/85" style={{ "--i": 4 } as React.CSSProperties}>
            Practical guidance and focused training to help you prepare for future opportunities.
          </p>
          <div className="rise mt-8 flex flex-wrap gap-3" style={{ "--i": 5 } as React.CSSProperties}>
            <Button href={whatsappLink()} variant="gold" icon="whatsapp">
              Enquire on WhatsApp
            </Button>
            <Button href={contact.phoneHref} variant="outline" icon="phone">
              Call Us
            </Button>
          </div>
        </div>

        <div data-bp="hero-photo" className="relative lg:justify-self-end lg:w-full lg:max-w-[34rem]">
          <span aria-hidden className="pointer-events-none absolute -inset-10 -z-10 bg-[radial-gradient(closest-side,rgb(37_99_235/0.14),transparent)]" />
          <span aria-hidden className="absolute -top-3 -right-3 hidden h-full w-full border border-gold lg:block" />
          <HeroFrame
            photo={<Photo name="hero" priority sizes="(min-width: 1024px) 34rem, 100vw" />}
            badge={
              <p className="absolute bottom-4 left-4 border border-white/40 bg-navy/70 px-4 py-2.5 text-sm font-medium text-white supports-[backdrop-filter]:bg-white/15 supports-[backdrop-filter]:backdrop-blur-md supports-[backdrop-filter]:backdrop-saturate-150 sm:bottom-5 sm:left-5">
                The Blueprint to Your Dream Job.
              </p>
            }
          />
        </div>
      </div>
    </section>
  );
}
