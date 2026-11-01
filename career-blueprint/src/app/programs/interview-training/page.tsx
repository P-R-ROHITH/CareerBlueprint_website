import type { Metadata } from "next";
import { Check } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import Photo from "@/components/ui/Photo";
import SectionHeading from "@/components/ui/SectionHeading";
import StepList from "@/components/ui/StepList";
import ContactCTA from "@/components/contact/ContactCTA";
import { ImageReveal, Reveal } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Interview Training",
  description: "Interview preparation to help you communicate clearly and approach interviews with confidence.",
};

// DRAFT content: topics below are suggested focus areas. Owner to confirm what is actually included.
const topics = [
  "Understanding common interview questions",
  "Preparing clear, honest answers about yourself",
  "Communicating with clarity and composure",
  "Presenting yourself professionally",
];

const steps = [
  { title: "Understand", text: "We start with the role you want and where you are today." },
  { title: "Prepare", text: "Work out what to say and how to say it." },
  { title: "Practise", text: "Rehearse your answers until they feel natural." },
  { title: "Improve", text: "Refine what needs work and build steady confidence." },
];

export default function InterviewTraining() {
  return (
    <>
      <PageHero
        trail={[{ label: "Home", href: "/" }, { label: "Programs & Services", href: "/programs" }, { label: "Interview Training" }]}
        title="Prepare with Confidence. Perform with Clarity."
        intro="Structured preparation to help you approach interviews with a clear head and a clear message."
        photo="interviewHero"
        imageSide="right"
        message="Hi Career Blueprint, I'd like to enquire about Interview Training."
      />

      <section className="bg-mist">
        <div className="container-page grid gap-12 py-20 md:py-24 lg:grid-cols-12 lg:gap-16">
          <ImageReveal className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden bg-navy">
              <Photo name="interview" sizes="(min-width: 1024px) 40vw, 100vw" />
            </div>
          </ImageReveal>
          <Reveal className="lg:col-span-6 lg:col-start-7 lg:self-center">
            <SectionHeading>What you will work on</SectionHeading>
            <p className="mt-5 max-w-lg text-ink/85">
              Interview training focuses on practical preparation, clear communication and building confidence.
            </p>
            <ul className="mt-8 max-w-lg divide-y divide-navy/10 border-y border-navy/10">
              {topics.map((t) => (
                <li key={t} className="flex items-start gap-3 py-4 text-ink">
                  <Check className="mt-1 size-4 shrink-0 text-royal" strokeWidth={2} aria-hidden />
                  {t}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <section>
        <div className="container-page grid gap-10 py-20 md:py-24 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-4">
            <SectionHeading>How preparation works</SectionHeading>
          </Reveal>
          <div className="lg:col-span-7 lg:col-start-6">
            <StepList steps={steps} />
          </div>
        </div>
      </section>

      <ContactCTA
        title="Ready to prepare?"
        text="Message us on WhatsApp or call to talk about your interview goals."
        message="Hi Career Blueprint, I'd like to enquire about Interview Training."
      />
    </>
  );
}
