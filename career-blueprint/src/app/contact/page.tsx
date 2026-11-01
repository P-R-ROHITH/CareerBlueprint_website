import type { Metadata } from "next";
import { ArrowUpRight, Mail, Phone } from "lucide-react";
import Breadcrumb from "@/components/ui/Breadcrumb";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import SectionHeading from "@/components/ui/SectionHeading";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/Reveal";
import { contact, whatsappLink } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Reach Career Blueprint on WhatsApp, phone or email.",
};

const channels = [
  { label: "WhatsApp", value: "Start a chat", href: whatsappLink(), icon: WhatsAppIcon, external: true },
  { label: "Phone", value: contact.phoneDisplay, href: contact.phoneHref, icon: Phone, external: false },
  { label: "Email", value: contact.email, href: `mailto:${contact.email}`, icon: Mail, external: false },
];

const include = ["The service you are interested in", "Your goal or the role you are aiming for", "A good time to reach you"];

export default function Contact() {
  return (
    <section>
      <div className="container-page grid gap-14 py-10 md:py-16 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-5">
          <div className="rise" style={{ "--i": 0 } as React.CSSProperties}>
            <Breadcrumb trail={[{ label: "Home", href: "/" }, { label: "Contact" }]} />
          </div>
          <h1 className="display rise mt-6 text-[clamp(2.2rem,4.6vw,3.8rem)] text-navy" style={{ "--i": 1 } as React.CSSProperties}>
            We’re Here <span className="text-gold-deep">to Help.</span>
          </h1>
          <p className="rise mt-5 max-w-sm text-lg leading-relaxed text-ink/85" style={{ "--i": 2 } as React.CSSProperties}>
            Have a question or want to know more about our programs? Reach us on WhatsApp, phone or email.
          </p>
          <Reveal className="mt-12 hidden lg:block">
            <p className="display text-lg text-navy">In your first message, it helps to share:</p>
            <ul className="mt-4 max-w-xs divide-y divide-navy/10 border-y border-navy/10 text-sm text-ink/85">
              {include.map((i) => (
                <li key={i} className="py-3">
                  {i}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="lg:col-span-6 lg:col-start-7">
          <SectionHeading as="h2" className="sr-only">
            Contact options
          </SectionHeading>
          <Stagger className="divide-y divide-navy/10 border-y border-navy/10" gap={0.1}>
            {channels.map(({ label, value, href, icon: Icon, external }) => (
              <StaggerItem key={label}>
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="group flex min-h-24 items-center gap-5 py-6"
                >
                  <span className="inline-flex size-12 shrink-0 items-center justify-center bg-sky text-royal transition-colors group-hover:bg-navy group-hover:text-white">
                    <Icon className="size-5" {...(Icon === WhatsAppIcon ? {} : { strokeWidth: 1.5 })} aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-semibold tracking-[0.12em] text-gold-deep uppercase">{label}</span>
                    <span className="display mt-1 block text-lg [overflow-wrap:anywhere] text-navy sm:text-2xl">{value}</span>
                  </span>
                  <ArrowUpRight
                    className="size-5 shrink-0 text-navy transition-transform duration-300 ease-(--ease-out) group-hover:translate-x-1 group-hover:-translate-y-1"
                    strokeWidth={1.5}
                    aria-hidden
                  />
                </a>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-10 lg:hidden">
            <p className="display text-lg text-navy">In your first message, it helps to share:</p>
            <ul className="mt-4 divide-y divide-navy/10 border-y border-navy/10 text-sm text-ink/85">
              {include.map((i) => (
                <li key={i} className="py-3">
                  {i}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
