"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { nav, site, whatsappLink } from "@/config/site";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Close the menu after navigating (state reset during render, not in an effect), and on Escape.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className="sticky top-0 z-50 border-b border-navy/10 bg-white/95 supports-[backdrop-filter]:bg-white/80 backdrop-blur-lg backdrop-saturate-150">
      <div className="container-page flex h-(--header-h) items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3" aria-label={`${site.name}, home`}>
          <Image src="/logo-mark.png" alt="" width={48} height={36} priority className="h-9 w-auto" />
          <span className="leading-none">
            <span className="display block text-[1.15rem] font-bold tracking-tight text-navy">{site.name}</span>
            <span className="mt-1 hidden text-xs tracking-[0.02em] text-gold-deep sm:block">{site.tagline}</span>
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              aria-current={isActive(n.href) ? "page" : undefined}
              className={cn(
                "relative py-3 text-sm font-medium text-ink transition-colors hover:text-royal",
                "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:bg-gold after:transition-transform after:duration-300 after:ease-(--ease-out) hover:after:scale-x-100",
                isActive(n.href) && "text-navy after:scale-x-100",
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Button href={whatsappLink()} variant="gold" icon="whatsapp" className="px-4 py-2.5 max-sm:hidden">
            Enquire on WhatsApp
          </Button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-sm text-navy hover:bg-sky lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" strokeWidth={1.75} /> : <Menu className="size-6" strokeWidth={1.75} />}
          </button>
        </div>
      </div>

      <div
        id="mobile-menu"
        inert={!open}
        className={cn(
          "grid overflow-hidden border-t border-navy/10 bg-white transition-[grid-template-rows,opacity] duration-300 ease-(--ease-out) lg:hidden",
          open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] border-t-0 opacity-0",
        )}
      >
        <div className="min-h-0">
          <nav aria-label="Mobile" className="container-page flex flex-col py-3">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={cn(
                  "display flex min-h-12 items-center justify-between border-b border-navy/10 text-xl text-navy",
                  isActive(n.href) && "text-royal",
                )}
              >
                {n.label}
                {isActive(n.href) && <span className="size-1.5 rounded-full bg-gold" aria-hidden />}
              </Link>
            ))}
            <Button href={whatsappLink()} variant="gold" icon="whatsapp" className="mt-4 mb-2">
              Enquire on WhatsApp
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
