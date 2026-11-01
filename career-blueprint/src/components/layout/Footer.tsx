import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { contact, legalLinks, nav, site, whatsappLink } from "@/config/site";

const linkCls = "inline-flex min-h-11 items-center gap-2 text-sm text-white/80 transition-colors hover:text-gold";

export default function Footer() {
  return (
    <footer className="bg-navy-deep text-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1.2fr]">
        <div>
          <div className="flex items-center gap-3">
            <Image src="/logo-mark.png" alt="" width={48} height={36} className="h-9 w-auto rounded-sm bg-white px-1.5 py-1" />
            <span className="display text-xl font-bold">{site.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">{site.tagline}</p>
        </div>

        <nav aria-label="Footer">
          <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">Explore</p>
          <ul className="mt-3">
            {nav.map((n) => (
              <li key={n.href}>
                <Link href={n.href} className={linkCls}>
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="text-xs font-semibold tracking-[0.14em] text-gold uppercase">Get in touch</p>
          <ul className="mt-3">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className={linkCls}>
                <WhatsAppIcon className="size-4" /> WhatsApp
              </a>
            </li>
            <li>
              <a href={contact.phoneHref} className={linkCls}>
                <Phone className="size-4" strokeWidth={1.75} aria-hidden /> {contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`} className={linkCls}>
                <Mail className="size-4" strokeWidth={1.75} aria-hidden /> {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-3 py-5 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
          <p>© {site.name}</p>
          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            {legalLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-11 items-center transition-colors hover:text-gold">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
