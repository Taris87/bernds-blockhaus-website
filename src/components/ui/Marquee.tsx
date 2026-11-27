import { useState } from 'react';
import { OakLeaf } from './Ornaments';

interface Props {
  items: string[];
  /** Accessible name of the pause toggle. */
  pauseLabel: string;
}

/**
 * Ticker (Kap. 6 `Marquee`). This component only provides structure and
 * state; the movement is added by the motion layer, which must respect
 * `data-paused` (pause button, WCAG 2.2.2), hover/focus and reduced motion.
 *
 * The facts are read once from the list; the second copy that makes the
 * loop seamless is hidden from assistive technology.
 */
export function Marquee({ items, pauseLabel }: Props) {
  const [paused, setPaused] = useState(false);

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
    <div className="marquee" data-marquee data-paused={paused ? 'true' : 'false'}>
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
