import { useRef, type RefObject } from 'react';
import { countUp } from './counter';
import { Flip, gsap, reachableStart, ScrollTrigger, useGSAP } from './gsap';
import { isMobile, motionAllowed } from './media';
import { settleShown } from './reveals';
import { useMotion } from './useMotion';

const TILE = '.masonry-tile';
const CLEAR = 'transform,opacity,visibility';

/**
 * Gallery masonry motion (Kap. 7.1):
 * - tiles fade up in batches when they enter the viewport (once),
 * - a filter change lets the remaining tiles glide to their new place (Flip)
 *   and fades the new ones in; the photo counter counts to the new number.
 *
 * Flip runs with transforms only (`absolute: false`): the grid keeps its
 * layout and height during the transition, so the page cannot jump
 * (QA-043, together with `overflow-anchor: none` on the section).
 */
export function useGalleryMotion(
  list: RefObject<HTMLElement | null>,
  count: RefObject<HTMLElement | null>,
  category: string | null,
) {
  const pendingTiles = useRef(new Set<Element>());
  /** Tiles that already faded in – a rebuild (breakpoint change) keeps them static. */
  const shownTiles = useRef(new WeakSet<Element>());
  const triggers = useRef<ScrollTrigger[]>([]);
  const flipState = useRef<Flip.FlipState | null>(null);
  const previous = useRef({ category, count: -1 });

  useMotion(
    (conditions, context) => {
      const root = list.current;
      if (!conditions.motion || !root) return;
      const all = [...root.querySelectorAll<HTMLElement>(`${TILE}[data-reveal="tile"]`)];
      settleShown(
        context,
        all.filter((tile) => shownTiles.current.has(tile)),
      );
      const tiles = all.filter((tile) => !shownTiles.current.has(tile));
      tiles.forEach((tile) => pendingTiles.current.add(tile));
      // Tiles already on screen at load only fade (they belong to the page
      // entry and must not move under a first click); later ones also rise.
      const fold = window.innerHeight;
      const rising = new Set(tiles.filter((tile) => tile.getBoundingClientRect().top > fold));
      gsap.set(tiles, { opacity: 0 });
      gsap.set([...rising], { y: 30 });
      triggers.current = ScrollTrigger.batch(tiles, {
        // Reachable at the page end (QA-111), active at once on screen (QA-119).
        start: reachableStart(0.92),
        // No `once`: it breaks ScrollTrigger's refresh when restored deep in the page (see reveals.ts).
        onEnter: (entered) => {
          const batch = entered.filter((tile) => pendingTiles.current.has(tile));
          if (!batch.length) return;
          batch.forEach((tile) => {
            pendingTiles.current.delete(tile);
            shownTiles.current.add(tile);
          });
          gsap.to(batch, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power3.out',
            stagger: conditions.mobile ? 0.04 : 0.05,
            clearProps: CLEAR,
          });
        },
      });
      return () => {
        triggers.current = [];
        pendingTiles.current.clear();
      };
    },
    { scope: list },
  );

  // After a filter change (layout effect: before paint).
  useGSAP(
    () => {
      const root = list.current;
      const before = previous.current;
      const items = root ? [...root.querySelectorAll<HTMLElement>(TILE)] : [];
      const photoCount = root ? root.querySelectorAll(`${TILE}[data-reveal="tile"]`).length : 0;
      previous.current = { category, count: photoCount };
      if (!root || before.category === category) return;

      // Tiles that never revealed would stay hidden at stale trigger positions.
      triggers.current.forEach((trigger) => trigger.kill());
      triggers.current = [];
      if (pendingTiles.current.size) {
        gsap.set([...pendingTiles.current], { clearProps: CLEAR });
        pendingTiles.current.forEach((tile) => shownTiles.current.add(tile));
        pendingTiles.current.clear();
      }
      items.forEach((tile) => shownTiles.current.add(tile));

      const state = flipState.current;
      flipState.current = null;
      if (!motionAllowed()) return;

      const counter = count.current;
      if (counter && before.count >= 0) countUp(counter, { from: before.count, duration: 0.6 });
      if (!state) return;
      Flip.from(state, {
        targets: items,
        duration: isMobile() ? 0.45 : 0.6,
        ease: 'power3.inOut',
        stagger: 0.02,
        absolute: false,
        scale: true,
        simple: true,
        onEnter: (entering) =>
          gsap.fromTo(
            entering,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.45, delay: 0.15, ease: 'power3.out', clearProps: CLEAR },
          ),
        onComplete: () => {
          gsap.set(items, { clearProps: CLEAR });
        },
      });
    },
    { scope: list, dependencies: [category] },
  );

  return {
    /** Call right before the filter changes: records where the tiles are now. */
    beforeFilter() {
      const root = list.current;
      flipState.current = root && motionAllowed() ? Flip.getState(root.querySelectorAll(TILE)) : null;
    },
  };
}
