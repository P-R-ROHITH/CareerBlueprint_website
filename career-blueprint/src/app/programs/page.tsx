import type { Metadata } from "next";
import { Check } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import Button from "@/components/ui/Button";
import ContactCTA from "@/components/contact/ContactCTA";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";
import { whatsappLink } from "@/config/site";
import { services } from "@/data/services";

export const metadata: Metadata = {
  title: "Programs & Services",
  description: "Interview training, resume preparation, NIOS coaching for Class 12 and personality development.",
};

export default function Programs() {
  return (
    <>
      <PageHero
        tone="navy"
        trail={[{ label: "Home", href: "/" }, { label: "Programs & Services" }]}
        title="Practical Programs for Real Opportunities"
        intro="Focused programs to help you build skills, gain confidence and prepare for what comes next."
        photo="workspace"
        actions={false}
      />

      <div className="container-page divide-y divide-navy/10">
        {services.map((s, i) => (
          <section key={s.slug} className="grid items-center gap-8 py-14 md:py-20 lg:grid-cols-12 lg:gap-16">
            <ImageReveal className={`lg:col-span-6 ${i % 2 ? "lg:order-2" : ""}`}>
              <div className="relative aspect-[4/3] overflow-hidden bg-navy">
                <Photo name={s.art} sizes="(min-width: 1024px) 45vw, 100vw" />
              </div>
            </ImageReveal>
            <Reveal className={`lg:col-span-5 ${i % 2 ? "lg:order-1 lg:col-start-1" : "lg:col-start-8"}`}>
              <h2 className="display text-[clamp(1.6rem,3vw,2.2rem)] text-navy">{s.title}</h2>
              <p className="mt-4 max-w-md text-ink/85">{s.short}</p>
              <ul className="mt-6 max-w-md divide-y divide-navy/10 border-y border-navy/10">
                {s.focus.map((f) => (
                  <li key={f} className="flex items-center gap-3 py-3 text-sm text-ink">
                    <Check className="size-4 shrink-0 text-royal" strokeWidth={2} aria-hidden />
                    {f}
                  </li>
                ))}
              </ul>
              <div className="mt-7">
                {s.href ? (
                  <Button href={s.href}>Learn more</Button>
                ) : (
                  <Button
                    href={whatsappLink(`Hi Career Blueprint, I'd like to enquire about ${s.title}.`)}
                    icon="whatsapp"
                    variant="outline"
                  >
                    Enquire on WhatsApp
                  </Button>
                )}
              </div>
            </Reveal>
          </section>
        ))}
      </div>

      <ContactCTA
        title="Not sure which program is right for you?"
        text="Tell us your goal and we will help you choose a place to start."
        message="Hi Career Blueprint, I'm not sure which program is right for me. Can you help?"
      />
    </>
  );
}
