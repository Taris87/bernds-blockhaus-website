import type { RefObject } from 'react';
import { gsap, useGSAP } from './gsap';
import { canMatchMedia, MOTION_QUERIES, normaliseConditions, type MotionConditions } from './media';

export type MotionSetup = (conditions: MotionConditions, context: gsap.Context) => void | (() => void);

interface Options {
  scope?: RefObject<Element | null>;
  /** Re-run (after a full revert) when one of these changes, e.g. the pathname. */
  dependencies?: unknown[];
}

/**
 * Central motion hook (Kap. 7): `useGSAP` + `gsap.matchMedia()`.
 *
 * `setup` runs once per combination of the media conditions (reduced motion,
 * mobile, parallax). Whenever a condition or a dependency changes, every
 * tween, ScrollTrigger and SplitText created inside is reverted before the
 * setup runs again – inline styles disappear and the static CSS state is
 * back. The same revert runs on unmount (including Strict Mode's replay).
 *
 * Start states are only ever set in here, never in CSS, so content stays
 * visible without JavaScript and with `prefers-reduced-motion: reduce`.
 */
export function useMotion(setup: MotionSetup, { scope, dependencies = [] }: Options = {}) {
  useGSAP(
    () => {
      // JSDOM and very old browsers: no matchMedia, no motion.
      if (!canMatchMedia()) return;
      const media = gsap.matchMedia(scope?.current ?? undefined);
      media.add(MOTION_QUERIES, (context) => setup(normaliseConditions(context.conditions ?? {}), context));
      return () => media.revert();
    },
    { scope, dependencies, revertOnUpdate: true },
  );
}
