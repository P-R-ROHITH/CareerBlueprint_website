import type { Metadata } from "next";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import ContactCTA from "@/components/contact/ContactCTA";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "About",
  description: "Career Blueprint is a career guidance and training business focused on practical preparation.",
};

const principles = [
  { title: "Practical", text: "Focus on skills you can use, not preparation for its own sake." },
  { title: "Personalised", text: "Support shaped around your goals and where you are today." },
  { title: "Flexible", text: "Programs that can fit around your situation. Ask us what suits you." },
  { title: "Supportive", text: "Honest guidance and steady encouragement as you improve." },
];

export default function About() {
  return (
    <>
      <PageHero
        tone="navy"
        trail={[{ label: "Home", href: "/" }, { label: "About" }]}
        title="Guidance Today for a Stronger Tomorrow."
        intro="Career Blueprint is a career guidance and training business that helps students and job seekers prepare for opportunities with practical skills and confidence."
        photo="about"
        imageSide="right"
        actions={false}
      />

      <section>
        <div className="container-page grid gap-12 py-20 md:py-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading>Our approach</SectionHeading>
            <p className="mt-5 max-w-sm text-ink/85">We keep it simple, practical and focused on you.</p>
          </Reveal>
          <Stagger className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6" gap={0.1}>
            {principles.map((p) => (
              <StaggerItem key={p.title} className="border-t border-gold pt-5">
                <h3 className="display text-xl text-navy">{p.title}</h3>
                <p className="mt-2 text-ink/85">{p.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <ContactCTA
        title="Talk to us about your goals."
        text="Get in touch via WhatsApp or phone and we will help you find a place to start."
      />
    </>
  );
}
