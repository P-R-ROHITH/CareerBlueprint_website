/**
 * Plans where in the scroll each scene plays. Scenes play one after another in page order, each over a stretch of
 * scrolling (its window), with the stickman walking the connecting line in the gaps between windows.
 * The hero is not scroll-driven: it plays by itself when the page opens, so its window is empty.
 */
export type Slot = { key: string; y: number; h: number; span?: number };
export type Win = { A: number; D: number };

/** Smallest gap of scrolling between one scene ending and the next starting, for the walk between them. */
const WALK = 60;
const MIN_PLAY = 160;

/**
 * @param slots  the stations in the order they play, with where their drawing area sits on the page
 * @param vh     viewport height
 * @param maxScroll  how far the page can scroll
 */
export function planWindows(slots: Slot[], vh: number, maxScroll: number): Win[] {
  const play = Math.min(440, Math.max(300, vh * 0.4));
  const wins: Win[] = [];
  let cursor = 0;
  for (const s of slots) {
    if (s.key === "hero") {
      wins.push({ A: 0, D: 0 });
      continue;
    }
    // Start when its area is a little way up from the bottom of the screen; never before the previous scene is done.
    const A = Math.max(s.y - vh * 0.78, cursor + WALK);
    // Ideally finish while its area is still on screen.
    const last = s.y + s.h * 0.5 - vh * 0.1;
    const L = Math.max(MIN_PLAY, Math.min(play * (s.span ?? 1), last - A));
    wins.push({ A, D: A + L });
    cursor = A + L;
  }
  // The last scene must be reachable: pull it back so it finishes before the end of the page.
  const n = wins.length - 1;
  if (n >= 0 && slots[n].key !== "hero" && wins[n].D > maxScroll - 20) {
    const floor = n > 0 ? wins[n - 1].D + 30 : 0;
    const D = Math.max(maxScroll - 20, floor + MIN_PLAY);
    wins[n] = { A: Math.max(floor, D - Math.min(play * (slots[n].span ?? 1), wins[n].D - wins[n].A)), D };
  }
  return wins;
}
