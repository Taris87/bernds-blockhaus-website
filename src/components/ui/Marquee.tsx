import { useRef, useState } from 'react';
import { useMarqueeMotion } from '../../motion/useMarqueeMotion';
import { OakLeaf } from './Ornaments';

interface Props {
  items: string[];
  /** Accessible name of the pause toggle. */
  pauseLabel: string;
}

/**
 * Ticker (Kap. 6 `Marquee`): structure and pause state here, the loop in
 * `useMarqueeMotion` (pause button, WCAG 2.2.2, hover/focus, viewport and
 * reduced motion).
 *
 * The facts are read once from the list; the second copy that makes the
 * loop seamless is hidden from assistive technology.
 */
export function Marquee({ items, pauseLabel }: Props) {
  const [paused, setPaused] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  useMarqueeMotion(root, paused);

  function renderList(copy: boolean) {
    return (
      <ul className="marquee-list" aria-hidden={copy || undefined}>
        {items.map((item) => (
          <li key={item}>
            {item}
            <OakLeaf />
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div ref={root} className="marquee" data-marquee data-paused={paused ? 'true' : 'false'}>
      <div className="marquee-viewport">
        <div className="marquee-track" data-marquee-track>
          {renderList(false)}
          {renderList(true)}
        </div>
      </div>
      <button
        type="button"
        className="marquee-toggle"
        aria-pressed={paused}
        aria-label={pauseLabel}
        onClick={() => setPaused((value) => !value)}
      >
        <span aria-hidden="true">{paused ? '▶' : '❚❚'}</span>
      </button>
    </div>
  );
}
