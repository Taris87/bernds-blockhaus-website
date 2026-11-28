/**
 * Media conditions of the motion layer (Kap. 7). Every animation lives inside
 * one of these contexts; with `prefers-reduced-motion: reduce` nothing moves
 * and all content keeps its static, fully visible end state.
 */
export const MOTION_QUERIES = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  mobile: '(max-width: 767px)',
  /** Parallax and scroll-bound shifts: wide screens with a precise pointer. */
  parallax: '(min-width: 1024px) and (pointer: fine)',
} as const;

export type MotionConditions = Record<keyof typeof MOTION_QUERIES, boolean>;

export function canMatchMedia() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function';
}

function matches(query: string) {
  return canMatchMedia() && window.matchMedia(query).matches;
}

/** True only when the user did not ask for reduced motion (and it can be checked). */
export function motionAllowed() {
  return matches(MOTION_QUERIES.motion) && !matches(MOTION_QUERIES.reduce);
}

export function isMobile() {
  return matches(MOTION_QUERIES.mobile);
}

/** Normalises the raw matchMedia conditions: `reduce` always wins. */
export function normaliseConditions(raw: Partial<Record<string, boolean>>): MotionConditions {
  const reduce = !!raw.reduce;
  return {
    motion: !!raw.motion && !reduce,
    reduce,
    mobile: !!raw.mobile,
    parallax: !!raw.parallax && !!raw.motion && !reduce,
  };
}
