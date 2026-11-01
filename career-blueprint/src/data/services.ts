export type ServiceSlug = "interview" | "nios" | "resume" | "personality";

export type Service = {
  slug: ServiceSlug;
  title: string;
  short: string;
  /** Detail page, or null while the service is enquiry-only. */
  href: string | null;
  art: "interview" | "nios" | "resume" | "personality";
  /** Draft focus areas; owner to confirm before they are treated as deliverables. */
  focus: string[];
};

export const services: Service[] = [
  {
    slug: "interview",
    title: "Interview Training",
    short: "Structured preparation to help you answer clearly and walk in with confidence.",
    href: "/programs/interview-training",
    art: "interview",
    focus: ["Common interview questions", "Clear communication", "Professional presence"],
  },
  {
    slug: "resume",
    title: "Resume Preparation",
    short: "A clear, professional resume that presents your skills and strengths well.",
    href: "/programs/resume-preparation",
    art: "resume",
    focus: ["Resume review", "Structure and formatting", "Presenting your strengths"],
  },
  {
    slug: "nios",
    title: "NIOS Coaching — Class 12",
    short: "Academic support for NIOS Class 12 students. Ask us about subjects and approach.",
    href: null,
    art: "nios",
    focus: ["Class 12 guidance", "Subject support"],
  },
  {
    slug: "personality",
    title: "Personality Development",
    short: "Build communication, confidence and a professional presence.",
    href: null,
    art: "personality",
    focus: ["Communication", "Confidence", "Professional presence"],
  },
];

export const bySlug = (slug: ServiceSlug) => services.find((s) => s.slug === slug)!;
