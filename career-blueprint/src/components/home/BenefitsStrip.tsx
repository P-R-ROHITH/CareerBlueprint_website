import { Laptop, ShieldCheck, Target, UserRound } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Reveal";

const benefits = [
  { icon: Target, title: "Practical Training", text: "Real-world skills" },
  { icon: UserRound, title: "Personalised Guidance", text: "Support for your goals" },
  { icon: Laptop, title: "Flexible Learning Options", text: "Choose what fits you" },
  { icon: ShieldCheck, title: "Career Preparation", text: "Build confidence" },
];

export default function BenefitsStrip() {
  return (
    <section aria-label="What we offer" className="border-y border-navy/10 bg-sky/60">
      <Stagger className="container-page grid grid-cols-2 gap-y-6 py-7 lg:grid-cols-4 lg:divide-x lg:divide-navy/10" gap={0.08}>
        {benefits.map(({ icon: Icon, title, text }) => (
          <StaggerItem key={title} className="flex items-start gap-3 lg:px-6 lg:first:pl-0">
            <Icon className="mt-0.5 size-7 shrink-0 text-royal" strokeWidth={1.5} aria-hidden />
            <div>
              <p className="text-base font-semibold text-navy">{title}</p>
              <p className="mt-0.5 text-base text-ink/80">{text}</p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </section>
  );
}
