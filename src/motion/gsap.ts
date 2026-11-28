import { gsap } from 'gsap';
import { Flip } from 'gsap/Flip';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { useGSAP } from '@gsap/react';

/**
 * Single place that registers the GSAP plugins (Kap. 7: ScrollTrigger,
 * SplitText and Flip are part of gsap 3.15 – no extra dependency).
 */
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);

/*
 * Scroll restoration belongs to useRouteScroll (QA-043/QA-107): it sets
 * `history.scrollRestoration = 'manual'` and restores positions itself.
 * ScrollTrigger remembers the value it saw when it registered ('auto') and
 * writes it back after every refresh – the browser would then restore an old
 * position on back/forward over ours. Tell ScrollTrigger the app's value.
 */
if (typeof window !== 'undefined' && window.history) ScrollTrigger.clearScrollMemory('manual');

// No global refresh on DOMContentLoaded/load (it scrolls to 0 and back, see
// remeasureScrollTriggers); the motion layer re-measures after mount and fonts.
ScrollTrigger.config({ autoRefreshEvents: 'visibilitychange,resize' });

export { gsap, Flip, ScrollTrigger, SplitText, useGSAP };

/**
 * Re-measures every ScrollTrigger after a layout change (route change, fonts).
 * Not `ScrollTrigger.refresh()`: the global refresh scrolls the window to 0
 * and back, which cancels a smooth scroll or anchor jump that is in progress
 * (QA-043/QA-107). Without pinning, each trigger can measure in place.
 */
export function remeasureScrollTriggers() {
  ScrollTrigger.getAll().forEach((trigger) => trigger.refresh());
  ScrollTrigger.update();
}

/**
 * Start line for a one-time reveal: “element top at `fraction` of the
 * viewport height”, but never beyond the last scroll position, so elements at
 * the end of the page still trigger (QA-111).
 *
 * Not `clamp(top 85%)`: clamp also lifts negative starts to 0, and a trigger
 * that starts at exactly 0 is not active at scrollY 0 – everything in the
 * first viewport stayed hidden until the first scroll (QA-119).
 * Elements already (partly) on screen when the trigger is measured start
 * right away – nothing visible waits for a scroll.
 */
export function reachableStart(fraction: number) {
  return (self: ScrollTrigger) => {
    const element = self.trigger;
    if (!element) return 0;
    const top = element.getBoundingClientRect().top;
    const raw = top + window.scrollY - window.innerHeight * fraction;
    const onScreen = top < window.innerHeight;
    return Math.min(raw, ScrollTrigger.maxScroll(window) - 1, onScreen ? window.scrollY - 1 : Infinity);
  };
}
