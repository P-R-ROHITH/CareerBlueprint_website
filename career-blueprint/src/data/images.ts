/**
 * Photography slots. Drop a file into /public/images and set `src` to use a real photo.
 * While `src` is null the slot renders the branded blueprint graphic instead.
 * Always write meaningful `alt` text when adding a photo.
 */
export type Slot = {
  src: string | null;
  alt: string;
  width: number;
  height: number;
};

export const photos = {
  hero: {
    src: "/images/hero.png",
    alt: "A confident young professional looking ahead",
    width: 2000,
    height: 2000,
  },
  interview: {
    src: "/images/interview.png",
    alt: "An interview conversation across a table",
    width: 2000,
    height: 2000,
  },
  nios: {
    src: "/images/nios.png",
    alt: "Books and a graduation cap",
    width: 2000,
    height: 2000,
  },
  resume: {
    src: "/images/resume.png",
    alt: "A resume on a desk beside a laptop",
    width: 1600,
    height: 1200,
  },
  personality: {
    src: "/images/personality.png",
    alt: "A person standing confidently on a hilltop",
    width: 1600,
    height: 1200,
  },
  about: {
    src: "/images/about.png",
    alt: "A thoughtful young professional at a desk",
    width: 1600,
    height: 1200,
  },
  interviewHero: {
    src: "/images/interview-hero.png",
    alt: "A young professional preparing for an interview",
    width: 1800,
    height: 1440,
  },
  resumeHero: {
    src: "/images/resume-hero.png",
    alt: "A resume and pen on a wooden desk",
    width: 1800,
    height: 1440,
  },
  workspace: {
    src: "/images/workspace.png",
    alt: "A laptop and coffee on a work desk",
    width: 1800,
    height: 1440,
  },
} satisfies Record<string, Slot>;

export type PhotoKey = keyof typeof photos;
