import Button from "@/components/ui/Button";
import OpeningDoor from "@/components/contact/OpeningDoor";
import Stage from "@/components/journey/Stage";
import { Reveal } from "@/components/motion/Reveal";
import { contact, whatsappLink } from "@/config/site";

export default function ContactCTA({
  title = "We’re Here to Help.",
  text = "Get in touch via WhatsApp or phone to learn more about our services.",
  message,
}: {
  title?: string;
  text?: string;
  message?: string;
}) {
  return (
    <section className="overflow-hidden bg-navy text-white">
      <div className="container-page grid items-center gap-12 py-20 md:grid-cols-[minmax(0,1fr)_auto] md:gap-20 md:py-24">
        <Reveal className="max-w-2xl">
          <span aria-hidden className="mb-6 block h-0.5 w-14 bg-gold" />
          <h2 className="display text-[clamp(2rem,4.4vw,3.25rem)]">{title}</h2>
          <p className="mt-5 max-w-xl text-lg leading-relaxed text-white/80">{text}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={whatsappLink(message)} variant="gold" icon="whatsapp">
              Enquire on WhatsApp
            </Button>
            <Button href={contact.phoneHref} variant="outlineLight" icon="phone">
              Call {contact.phoneDisplay}
            </Button>
          </div>
          <Stage station="contact" tone="dark" className="mt-8" />
          <p data-journey-note suppressHydrationWarning className="display -mt-2 text-right text-xl text-gold italic" style={{ opacity: 0 }}>
            With you till the end.
          </p>
          <p className="mt-1 text-right text-xl font-medium text-white">Let’s plan your next step.</p>
        </Reveal>
        <OpeningDoor href={whatsappLink(message)} className="order-first justify-self-start md:order-none md:justify-self-center" />
      </div>
    </section>
  );
}
