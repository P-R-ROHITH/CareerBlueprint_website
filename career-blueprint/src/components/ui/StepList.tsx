import { Stagger, StaggerItem } from "@/components/motion/Reveal";

/** Vertical numbered process. The order is the content. */
export default function StepList({ steps, journey = false }: { steps: { title: string; text: string }[]; journey?: boolean }) {
  return (
    <Stagger className="relative" gap={0.12}>
      <span aria-hidden className="absolute top-3 bottom-3 left-[1.05rem] w-px bg-gold/60" />
      <ol data-journey-steps={journey ? "" : undefined} suppressHydrationWarning>
        {steps.map((s, i) => (
          <StaggerItem key={s.title} className="relative flex gap-5 pb-8 last:pb-0">
            <li className="contents" data-journey-step={journey ? i : undefined} suppressHydrationWarning>
              <span className="display relative z-10 inline-flex size-[2.15rem] shrink-0 items-center justify-center border border-gold bg-white text-sm text-gold-deep">
                {i + 1}
              </span>
              <div>
                <h3 className="display text-lg text-navy">{s.title}</h3>
                <p className="mt-1 max-w-md text-sm leading-relaxed text-ink/85">{s.text}</p>
              </div>
            </li>
          </StaggerItem>
        ))}
      </ol>
    </Stagger>
  );
}
