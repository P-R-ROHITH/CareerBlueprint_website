import HomeHero from "@/components/home/HomeHero";
import BenefitsStrip from "@/components/home/BenefitsStrip";
import AboutPreview from "@/components/home/AboutPreview";
import HowToStart from "@/components/home/HowToStart";
import WhoItsFor from "@/components/home/WhoItsFor";
import ServiceShowcase from "@/components/services/ServiceShowcase";
import ContactCTA from "@/components/contact/ContactCTA";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import { Reveal } from "@/components/motion/Reveal";

export default function Home() {
  return (
    <>
      <HomeHero />
      <BenefitsStrip />
      <section className="bg-white">
        <div className="container-page py-16 md:py-20">
          <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading className="max-w-xl">Focused programs to help you prepare, improve and move forward.</SectionHeading>
            <Button href="/programs" variant="outline">
              View all services
            </Button>
          </Reveal>
          <ServiceShowcase />
        </div>
      </section>
      <AboutPreview />
      <WhoItsFor />
      <HowToStart />
      <ContactCTA />
    </>
  );
}
