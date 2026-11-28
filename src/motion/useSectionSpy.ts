import { useState } from 'react';
import { ScrollTrigger, useGSAP } from './gsap';

/**
 * Marks the section currently in view (Eichwieserhof sticky signpost bar,
 * Kap. 5.4 / 7.1). This is orientation, not decoration, so it also runs with
 * reduced motion – it never animates and never scrolls the page.
 *
 * A section counts as active while it covers the line just below the sticky
 * header + bar (top 35 % of the viewport).
 */
export function useSectionSpy(ids: string[]) {
  const [active, setActive] = useState<string | null>(null);
  const key = ids.join('|');

  useGSAP(
    () => {
      const triggers = key
        .split('|')
        .map((id) => document.getElementById(id))
        .filter((element): element is HTMLElement => !!element)
        .map((section) =>
          ScrollTrigger.create({
            trigger: section,
            start: 'top 35%',
            end: 'bottom 35%',
            onToggle: (self) => {
              if (self.isActive) setActive(section.id);
              else setActive((current) => (current === section.id ? null : current));
            },
          }),
        );
      return () => triggers.forEach((trigger) => trigger.kill());
    },
    { dependencies: [key] },
  );

  return active;
}
