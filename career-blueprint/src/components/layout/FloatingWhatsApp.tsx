import WhatsAppIcon from "@/components/ui/WhatsAppIcon";
import { whatsappLink } from "@/config/site";

/** Phones only: WhatsApp is the main way people enquire, so it stays one tap away. */
export default function FloatingWhatsApp() {
  return (
    <a
      href={whatsappLink()}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Enquire on WhatsApp"
      className="fixed right-4 bottom-4 z-[60] inline-flex size-14 items-center justify-center rounded-full bg-gold text-navy-deep shadow-lg shadow-navy/30 transition-transform active:scale-95 lg:hidden"
    >
      <WhatsAppIcon className="size-7" />
    </a>
  );
}
