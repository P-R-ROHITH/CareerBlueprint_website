import Breadcrumb from "@/components/ui/Breadcrumb";
import { contact } from "@/config/site";
import type { LegalSection } from "@/data/legal";

/** A plain, readable page for policies and terms. */
export default function LegalPage({
  title,
  intro,
  updated,
  sections,
}: {
  title: string;
  intro: string;
  updated: string;
  sections: LegalSection[];
}) {
  return (
    <article>
      <div className="container-page py-10 md:py-16">
        <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: title }]} />
        <h1 className="display mt-6 text-[clamp(2.2rem,4.6vw,3.6rem)] text-navy">{title}</h1>
        <p className="mt-3 text-sm text-ink/70">Last updated: {updated}</p>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-ink/85">{intro}</p>

        <div className="mt-12 max-w-2xl">
          {sections.map((s, i) => (
            <section key={s.heading} className="border-t border-navy/10 py-8 first:border-t-0 first:pt-0">
              <h2 className="display text-xl text-navy md:text-2xl">
                <span className="mr-2 text-gold-deep">{i + 1}.</span>
                {s.heading}
              </h2>
              <div className="mt-4 space-y-4 leading-relaxed text-ink/85">
                {s.body.map((b, j) =>
                  Array.isArray(b) ? (
                    <ul key={j} className="list-disc space-y-1.5 pl-5 marker:text-gold-deep">
                      {b.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    <p key={j}>{b}</p>
                  ),
                )}
              </div>
            </section>
          ))}

          <section className="border-t border-navy/10 py-8">
            <h2 className="display text-xl text-navy md:text-2xl">
              <span className="mr-2 text-gold-deep">{sections.length + 1}.</span>
              Contact us
            </h2>
            <p className="mt-4 leading-relaxed text-ink/85">If you have a question about this page, contact Career Blueprint:</p>
            <ul className="mt-3 space-y-1.5 text-ink/85">
              <li>
                Email:{" "}
                <a href={`mailto:${contact.email}`} className="text-royal underline underline-offset-4 [overflow-wrap:anywhere]">
                  {contact.email}
                </a>
              </li>
              <li>
                Phone or WhatsApp:{" "}
                <a href={contact.phoneHref} className="text-royal underline underline-offset-4">
                  {contact.phoneDisplay}
                </a>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </article>
  );
}
