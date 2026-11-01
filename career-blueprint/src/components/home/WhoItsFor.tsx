import { BookOpen, Briefcase, GraduationCap } from "lucide-react";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";

const people = [
  { icon: GraduationCap, title: "Students", text: "Understand your goals and build the right skills early." },
  { icon: BookOpen, title: "NIOS Class 12 students", text: "Academic support, with guidance on subjects and approach." },
  { icon: Briefcase, title: "Job seekers", text: "Prepare for interviews and present yourself with confidence." },
];

/** Who the programs are for, in the same words the rest of the site already uses. */
export default function WhoItsFor() {
  return (
    <section className="bg-mist">
      <div className="container-page py-16 md:py-20">
        <Reveal>
          <SectionHeading className="max-w-xl">Who it is for.</SectionHeading>
        </Reveal>
        <Stagger className="mt-10 grid gap-px bg-navy/10 md:grid-cols-3" gap={0.1}>
          {people.map(({ icon: Icon, title, text }) => (
            <StaggerItem key={title} className="bg-mist py-2 md:px-8 md:first:pl-0 md:last:pr-0">
              <Icon className="size-10 text-royal" strokeWidth={1.4} aria-hidden />
              <h3 className="display mt-5 text-xl text-navy">{title}</h3>
              <p className="mt-2 max-w-xs text-ink/85">{text}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
