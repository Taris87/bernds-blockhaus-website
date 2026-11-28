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
