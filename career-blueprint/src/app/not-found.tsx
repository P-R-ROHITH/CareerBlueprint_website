import Link from "next/link";
import Button from "@/components/ui/Button";
import { contact, whatsappLink } from "@/config/site";

export default function NotFound() {
  return (
    <section>
      <div className="container-page py-20 md:py-32">
        <p className="text-xs font-semibold tracking-[0.12em] text-gold-deep uppercase">Error 404</p>
        <h1 className="display mt-4 text-[clamp(2.2rem,4.6vw,3.8rem)] text-navy">This page isn’t on the blueprint.</h1>
        <p className="mt-5 max-w-md text-lg leading-relaxed text-ink/85">
          The link may be old or mistyped. Head back home, see our programs, or ask us directly on WhatsApp or {contact.phoneDisplay}.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button href="/" variant="gold">
            Back to home
          </Button>
          <Button href="/programs" variant="outline">
            View programs
          </Button>
          <Button href={whatsappLink()} variant="outline" icon="whatsapp">
            WhatsApp us
          </Button>
        </div>
        <p className="mt-10 text-sm text-ink/70">
          Or go to <Link href="/contact" className="underline underline-offset-4">Contact</Link>.
        </p>
      </div>
    </section>
  );
}
