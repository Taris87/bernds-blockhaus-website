import { useRef, type RefObject } from 'react';
import { Flip, gsap, useGSAP } from './gsap';
import { isMobile, motionAllowed } from './media';

/**
 * Menu board tab change (Kap. 7.1 “Speisekarten-Tabs”, ≤ 0.5 s): the selected
 * signpost shape glides to the new tab (Flip), the new list fades up, the
 * dish photo (desktop) opens with a clip reveal. Keyboard handling and focus
 * stay in `MenuTabs`; with reduced motion the switch is instant.
 */
export function useMenuTabsMotion(board: RefObject<HTMLElement | null>, activeId: string) {
  const indicatorState = useRef<Flip.FlipState | null>(null);
  const previous = useRef(activeId);

  useGSAP(
    () => {
      // Mount and Strict Mode replay: nothing changed, nothing moves.
      if (previous.current === activeId) return;
      previous.current = activeId;
      const state = indicatorState.current;
      indicatorState.current = null;
      const root = board.current;
      if (!root || !motionAllowed()) return;

      const indicator = root.querySelector('.menu-tab-indicator');
      if (state && indicator) {
        Flip.from(state, { targets: indicator, duration: 0.3, ease: 'power3.inOut', scale: true });
      }
      const list = root.querySelectorAll('.menu-list > h3, .menu-list > .menu-note, .menu-item');
      gsap.fromTo(
        list,
        { opacity: 0, y: 12 },
        {
          opacity: 1,
          y: 0,
          duration: 0.25,
          ease: 'power3.out',
          stagger: { amount: 0.2 },
          clearProps: 'transform,opacity,visibility',
        },
      );
      const photo = root.querySelector('.menu-photo');
      if (photo && !isMobile()) {
        gsap.fromTo(
          photo,
          { clipPath: 'inset(0% 0% 100% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.45, ease: 'power4.out', clearProps: 'clipPath' },
        );
      }
    },
    { scope: board, dependencies: [activeId] },
  );

  return {
    /** Call right before the selected tab changes (records the indicator position). */
    beforeChange() {
      const indicator = board.current?.querySelector('.menu-tab-indicator');
      indicatorState.current = indicator && motionAllowed() ? Flip.getState(indicator) : null;
    },
  };
}
