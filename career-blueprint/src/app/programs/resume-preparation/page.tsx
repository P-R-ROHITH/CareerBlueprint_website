import type { Metadata } from "next";
import { Check } from "lucide-react";
import PageHero from "@/components/ui/PageHero";
import SectionHeading from "@/components/ui/SectionHeading";
import StepList from "@/components/ui/StepList";
import ContactCTA from "@/components/contact/ContactCTA";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Resume Preparation",
  description: "Help preparing a clear, professional resume that presents your skills and strengths.",
};

const audience = [
  { who: "Students", text: "Putting together a first resume." },
  { who: "Freshers", text: "Presenting education and skills well." },
  { who: "Professionals", text: "Updating a resume for the next step." },
];

// DRAFT content: owner to confirm the actual deliverables before they are treated as promises.
const focus = ["Reviewing your current resume", "Clear structure and formatting", "Presenting your strengths and skills", "Wording that fits the role you want"];

const steps = [
  { title: "Review", text: "We look at your current resume and your goal." },
  { title: "Improve", text: "Shape a clearer structure and stronger wording." },
  { title: "Refine", text: "Adjust it to suit the roles you are targeting." },
  { title: "Finalise", text: "Settle on a version you are happy to send." },
];

const faqs = [
  { q: "Who is this for?", a: "Students, freshers and working professionals who want a clearer, more professional resume." },
  { q: "How do I get started?", a: "Send us a message on WhatsApp or call. Tell us your goal and we will take it from there." },
  { q: "Will this guarantee shortlisting?", a: "No. A stronger resume helps you present yourself well, but no one can promise interviews or jobs." },
];

export default function ResumePreparation() {
  return (
    <>
      <PageHero
        trail={[{ label: "Home", href: "/" }, { label: "Programs & Services", href: "/programs" }, { label: "Resume Preparation" }]}
        title="A Stronger Resume for Better Opportunities."
        intro="A clear, professional resume that highlights your skills, strengths and potential."
        photo="resumeHero"
        imageSide="left"
        message="Hi Career Blueprint, I'd like to enquire about Resume Preparation."
      />

      <section className="bg-sky/60">
        <div className="container-page py-16 md:py-20">
          <Reveal>
            <SectionHeading>Who it is for</SectionHeading>
          </Reveal>
          <Stagger className="mt-10 grid gap-8 md:grid-cols-3 md:divide-x md:divide-navy/10">
            {audience.map((a) => (
              <StaggerItem key={a.who} className="md:px-8 md:first:pl-0">
                <h3 className="display text-xl text-navy">{a.who}</h3>
                <p className="mt-2 text-ink/85">{a.text}</p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section>
        <div className="container-page grid gap-14 py-20 md:py-24 lg:grid-cols-2 lg:gap-20">
          <Reveal>
            <SectionHeading>What we work on</SectionHeading>
            <ul className="mt-8 max-w-md divide-y divide-navy/10 border-y border-navy/10">
              {focus.map((f) => (
                <li key={f} className="flex items-start gap-3 py-4 text-ink">
                  <Check className="mt-1 size-4 shrink-0 text-royal" strokeWidth={2} aria-hidden />
                  {f}
                </li>
              ))}
            </ul>
          </Reveal>
          <div>
            <Reveal>
              <SectionHeading>The process</SectionHeading>
            </Reveal>
            <div className="mt-8">
              <StepList steps={steps} />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-mist">
        <div className="container-page max-w-3xl py-16 md:py-20">
          <Reveal>
            <SectionHeading>Common questions</SectionHeading>
            <div className="mt-8 divide-y divide-navy/10 border-y border-navy/10">
              {faqs.map((f) => (
                <details key={f.q} className="group py-4">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 font-semibold text-navy [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden className="text-xl text-gold-deep transition-transform duration-300 group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 max-w-xl text-ink/85">{f.a}</p>
                </details>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <ContactCTA
        title="Let’s improve your resume."
        text="Message us on WhatsApp or call to get started."
        message="Hi Career Blueprint, I'd like to enquire about Resume Preparation."
      />
    </>
  );
}
