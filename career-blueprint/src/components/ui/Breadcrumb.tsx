import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function Breadcrumb({ trail }: { trail: { label: string; href?: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-ink/70">
      <ol className="flex flex-wrap items-center gap-1.5">
        {trail.map((t, i) => (
          <li key={t.label} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="size-3" aria-hidden />}
            {t.href ? (
              <Link href={t.href} className="underline-offset-4 hover:text-royal hover:underline">
                {t.label}
              </Link>
            ) : (
              <span aria-current="page" className="font-medium text-navy">
                {t.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
