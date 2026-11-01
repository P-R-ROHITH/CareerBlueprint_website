import { cn } from "@/lib/utils";

export default function SectionHeading({
  children,
  as: Tag = "h2",
  tone = "light",
  className,
}: {
  children: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  tone?: "light" | "dark";
  className?: string;
}) {
  return (
    <Tag className={cn("display text-[clamp(1.75rem,3.4vw,2.6rem)]", tone === "dark" ? "text-white" : "text-navy", className)}>
      {children}
    </Tag>
  );
}
