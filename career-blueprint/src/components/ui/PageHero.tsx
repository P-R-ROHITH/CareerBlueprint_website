import Breadcrumb from "@/components/ui/Breadcrumb";
import Button from "@/components/ui/Button";
import Photo from "@/components/ui/Photo";
import { cn } from "@/lib/utils";
import { contact, whatsappLink } from "@/config/site";
import type { PhotoKey } from "@/data/images";

const d = (i: number) => ({ "--i": i }) as React.CSSProperties;

/** Inner-page hero. Tone and image side change per page so pages do not look alike. */
export default function PageHero({
  trail,
  title,
  intro,
  photo,
  tone = "light",
  imageSide = "right",
  message,
  actions = true,
}: {
  trail: { label: string; href?: string }[];
  title: React.ReactNode;
  intro: string;
  photo: PhotoKey;
  tone?: "light" | "navy";
  imageSide?: "left" | "right";
  message?: string;
  actions?: boolean;
}) {
  const dark = tone === "navy";
  return (
    <section className={cn("overflow-hidden", dark ? "bg-navy text-white" : "bg-white")}>
      <div
        className={cn(
          "container-page grid items-center gap-10 py-10 md:py-16 lg:grid-cols-2 lg:gap-16",
          imageSide === "left" && "lg:[&>*:first-child]:order-2",
        )}
      >
        <div>
          <div className={cn("rise", dark && "[&_*]:!text-white/75 [&_[aria-current]]:!text-white")} style={d(0)}>
            <Breadcrumb trail={trail} />
          </div>
          <h1 className={cn("display rise mt-6 text-[clamp(2rem,4vw,3.4rem)]", dark ? "text-white" : "text-navy")} style={d(1)}>
            {title}
          </h1>
          <p className={cn("rise mt-5 max-w-lg text-lg leading-relaxed", dark ? "text-white/80" : "text-ink/85")} style={d(2)}>
            {intro}
          </p>
          {actions && (
            <div className="rise mt-8 flex flex-wrap gap-3" style={d(3)}>
              <Button href={whatsappLink(message)} variant={dark ? "gold" : "primary"} icon="whatsapp">
                Enquire on WhatsApp
              </Button>
              <Button href={contact.phoneHref} variant={dark ? "outlineLight" : "outline"} icon="phone">
                Call Us
              </Button>
            </div>
          )}
        </div>
        <div className="unveil relative aspect-[4/3] overflow-hidden bg-navy-deep lg:aspect-[5/4]">
          <Photo name={photo} priority sizes="(min-width: 1024px) 45vw, 100vw" />
        </div>
      </div>
    </section>
  );
}
