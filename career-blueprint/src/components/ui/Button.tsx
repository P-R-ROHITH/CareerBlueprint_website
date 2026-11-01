import Link from "next/link";
import { ArrowRight, Phone } from "lucide-react";
import WhatsAppIcon from "./WhatsAppIcon";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "outlineLight";
type Icon = "arrow" | "whatsapp" | "phone" | "none";

const variants: Record<Variant, string> = {
  primary: "bg-navy text-white hover:bg-royal",
  gold: "bg-gold text-navy-deep hover:bg-white",
  outline: "border border-navy/30 text-navy hover:border-navy hover:bg-sky",
  outlineLight: "border border-white/40 text-white hover:border-white hover:bg-white/10",
};

export default function Button({
  href,
  children,
  variant = "primary",
  icon = "arrow",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: Variant;
  icon?: Icon;
  className?: string;
}) {
  const cls = cn(
    "group inline-flex min-h-11 items-center justify-center gap-2.5 rounded-sm px-5 py-3 text-sm font-semibold transition-colors duration-200 active:translate-y-px",
    variants[variant],
    className,
  );
  const content = (
    <>
      {icon === "whatsapp" && <WhatsAppIcon className="size-[18px]" />}
      {icon === "phone" && <Phone className="size-[17px]" strokeWidth={1.75} aria-hidden />}
      <span>{children}</span>
      {icon === "arrow" && (
        <ArrowRight
          className="size-4 transition-transform duration-300 ease-(--ease-out) group-hover:translate-x-1"
          strokeWidth={1.75}
          aria-hidden
        />
      )}
    </>
  );
  if (href.startsWith("/")) {
    return (
      <Link href={href} className={cls}>
        {content}
      </Link>
    );
  }
  const external = href.startsWith("http");
  return (
    <a href={href} className={cls} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
      {content}
    </a>
  );
}
