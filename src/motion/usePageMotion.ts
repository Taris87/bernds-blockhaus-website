import { useRef, type RefObject } from 'react';
import { useLocation } from 'react-router';
import { gsap, remeasureScrollTriggers } from './gsap';
import { fontsReady, setupPageMotion } from './reveals';
import { useMotion } from './useMotion';

/**
 * Motion for the routed page inside `main` (replaces the former `Reveal`).
 *
 * Re-runs per pathname only – query and hash changes (gallery filter,
 * anchors) keep the running page motion. Must be called after
 * `useRouteScroll` in the same component: its layout effect resets the
 * scroll position first, then the ScrollTriggers measure. ScrollTrigger
 * never scrolls here (no pinning, no global refresh); triggers re-measure after the
 * layout settled (next frame, fonts).
 */
export function usePageMotion(mainRef: RefObject<HTMLElement | null>) {
  const { pathname } = useLocation();
  const lastPath = useRef<string | null>(null);

  useMotion(
    (conditions, context) => {
      const main = mainRef.current;
      if (!main) return;
      // A page change (not the first load and not Strict Mode's replay) fades the new page in.
      const pageChange = lastPath.current !== null && lastPath.current !== pathname;
      lastPath.current = pathname;
      // Re-measure after layout and fonts – also with reduced motion, where
      // functional triggers (Eichwieserhof section marker) still exist.
      let alive = true;
      const frame = requestAnimationFrame(() => remeasureScrollTriggers());
      void fontsReady().then(() => {
        if (alive) remeasureScrollTriggers();
      });
      const cleanup = conditions.motion ? setupPageMotion(main, conditions, context) : undefined;
      if (conditions.motion && pageChange) {
        // Opacity only: main receives focus right after (useRouteScroll); visibility:hidden would block that.
        gsap.from(main, { opacity: 0, duration: 0.35, ease: 'power2.out', clearProps: 'opacity' });
      }
      return () => {
        alive = false;
        cancelAnimationFrame(frame);
        cleanup?.();
      };
    },
    { scope: mainRef, dependencies: [pathname] },
  );
}
