import SectionHeading from "@/components/ui/SectionHeading";
import Stage from "@/components/journey/Stage";
import StepList from "@/components/ui/StepList";
import { Reveal } from "@/components/motion/Reveal";

const steps = [
  { title: "Understand Your Goals", text: "Tell us what you are aiming for and where you are today." },
  { title: "Get the Right Guidance", text: "Choose the program that fits your goal." },
  { title: "Practise and Improve", text: "Build skills step by step with focused practice." },
  { title: "Take the Next Step", text: "Move ahead with more clarity and confidence." },
];

/** The four steps, as a plain list on blueprint paper. */
export default function HowToStart({ heading = "How to get started" }: { heading?: string }) {
  return (
    <section className="relative bg-sky">
      <div aria-hidden className="blueprint-grid absolute inset-0" />
      <div className="container-page relative grid items-center gap-10 py-20 md:py-28 lg:grid-cols-2 lg:gap-16">
        <div>
          <Reveal>
            <SectionHeading>{heading}</SectionHeading>
          </Reveal>
          <div className="mt-8">
            <StepList steps={steps} journey />
          </div>
        </div>
        <Stage station="steps" tall />
      </div>
    </section>
  );
}
