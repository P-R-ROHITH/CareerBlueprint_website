# Career Blueprint website

Next.js (App Router), TypeScript (strict), Tailwind CSS v4, Motion, lucide-react.
Fonts (Libre Caslon Text, Hanken Grotesk) are self-hosted through `@fontsource`.

## Run

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm run lint
npx tsc --noEmit
```

## Routes

| Route | Page |
| --- | --- |
| `/` | Home |
| `/programs` | Programs & Services |
| `/programs/interview-training` | Interview Training |
| `/programs/resume-preparation` | Resume Preparation |
| `/about` | About |
| `/contact` | Contact |

NIOS Coaching (Class 12) and Personality Development are enquiry-only services with no dedicated pages.

## Where things live

- `src/config/site.ts`: business name, tagline, navigation, and the confirmed contact details (phone, WhatsApp, email). Change contact details here only.
- `src/data/services.ts`: the four services.
- `src/data/images.ts`: the nine photography slots.
- `src/components/ui/Photo.tsx`: renders a slot's photo, or a branded blueprint graphic while the slot is empty.
- `src/components/home/HowToStart.tsx`: the plain four-step "How to get started" section.
- `src/components/contact/OpeningDoor.tsx`: the door that opens at the end of every contact section.
- `src/components/journey/`: the page-long journey. `Journey.tsx` is the engine (one connecting line (drawn as a trail that fades out behind him) and a stickman who walks it, the hero plays on its own when the page opens, then every scene is tied to the scrollbar (`plan.ts` decides where in the scroll each one plays)); `scenes.ts` holds the scenes (hero underline, interview desk, resume, personality steps, NIOS book, About lightbulb, the four-step climb in "How to get started", contact flag with its closing line); `Stage.tsx` is the empty area on the page that holds a scene (`data-station`). `src/lib/stick.ts` is the stickman's poses.
- `src/components/motion/`: shared reveal and parallax components. `src/lib/motion.ts` holds the shared durations and easing.
- `src/app/globals.css`: brand colour tokens, fonts, hero entrance animation, reduced-motion rules.

## Replacing the placeholder graphics with photos

1. Put the image in `public/images/` (WebP or JPEG, roughly the width x height listed for the slot in `src/data/images.ts`).
2. In `src/data/images.ts`, set that slot's `src` to `"/images/your-file.webp"` and write real `alt` text.
3. Nothing else changes: crops, sizes and the hero's priority loading are already handled.

Slots: `hero`, `interview`, `nios`, `resume`, `personality`, `about`, `interviewHero`, `resumeHero`, `workspace`.
Use photos you own or are licensed to use commercially.

## Verified so far

- `npx tsc --noEmit`, `npm run lint` and `npm run build` pass; all six routes prerender as static pages.
- The Impeccable design detector reported no findings on `src/app` and `src/components`.

## Not yet verified

- No browser was available in the build environment, so the final pages have not been re-inspected at phone, tablet and desktop widths after the last change. Screenshots in `.impeccable/review/` come from an earlier pass.
- No Lighthouse or Core Web Vitals measurement, no accessibility audit tool run, no browser-console check, no link check beyond the build.
- Reduced-motion handling and keyboard focus styles are implemented in code but were not tested in a browser.

## Owner decisions still open

- Photography: licensed or original photos for the nine slots.
- Phone and WhatsApp: one number (+91 70124 97529) is used for both; confirm or provide a separate WhatsApp number.
- Location or address: none supplied, so none is shown.
- Founder or team details, service deliverables, durations and pricing: not supplied, so not published.
- "7 years of industry experience": deliberately left off the site until you approve it.
- Service details on the Interview Training and Resume Preparation pages are draft content until you approve them.

## Deploy

Works on Vercel or any host that supports Next.js and permits commercial use. Run `npm run build` first and fix anything it reports.
