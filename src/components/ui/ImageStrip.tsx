import { useCallback, useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import type { Photo as PhotoData } from '../../types/content';
import { Photo } from './Photo';

interface Props {
  items: { photo: PhotoData; title: string }[];
  /** Id of the visible heading that names the strip. */
  labelledBy: string;
  size?: 'default' | 'small';
  /** Optional link next to the controls (e.g. to the gallery). */
  action?: ReactNode;
}

interface ScrollState {
  atStart: boolean;
  atEnd: boolean;
  progress: number;
}

function prefersReducedMotion() {
  return typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Horizontal picture strip (pattern M3): photos at a fixed height in their
 * natural aspect ratio, scrollable inside the section (never the page),
 * scroll snap, arrow buttons (disabled at the ends) and a progress line.
 * Motion hooks: `data-reveal="clip"` per image, `data-strip-track` for the
 * scroll-bound shift, `--progress` drives the progress line.
 */
export function ImageStrip({ items, labelledBy, size = 'default', action }: Props) {
  const scroller = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<ScrollState>({ atStart: true, atEnd: false, progress: 0 });

  const measure = useCallback(() => {
    const element = scroller.current;
    if (!element) return;
    const max = element.scrollWidth - element.clientWidth;
    const left = element.scrollLeft;
    setState({
      atStart: left <= 1,
      atEnd: left >= max - 1,
      progress: max > 0 ? Math.min(1, Math.max(0, left / max)) : 1,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [measure]);

  function scrollByPage(direction: 1 | -1) {
    const element = scroller.current;
    if (!element) return;
    element.scrollBy({
      left: direction * element.clientWidth * 0.8,
      behavior: prefersReducedMotion() ? 'auto' : 'smooth',
    });
  }

  return (
    <div className={`strip strip-${size}`}>
      <div
        ref={scroller}
        className="strip-scroller"
        role="region"
        aria-labelledby={labelledBy}
        tabIndex={0}
        onScroll={measure}
        data-strip-track
      >
        {items.map((item, index) => (
          <figure className="strip-item" key={item.photo.src}>
            <div className="strip-image" data-reveal="clip">
              <Photo photo={item.photo} />
            </div>
            <figcaption>
              <span className="strip-number">{String(index + 1).padStart(2, '0')}</span>
              {item.title}
            </figcaption>
          </figure>
        ))}
      </div>
      <div className="wrap strip-foot">
        <div className="strip-progress" aria-hidden="true" style={{ '--progress': state.progress } as CSSProperties} />
        <div className="strip-controls">
          <button
            type="button"
            className="icon-button"
            aria-label="Zurück blättern"
            disabled={state.atStart}
            onClick={() => scrollByPage(-1)}
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className="icon-button"
            aria-label="Weiter blättern"
            disabled={state.atEnd}
            onClick={() => scrollByPage(1)}
          >
            <span aria-hidden="true">→</span>
          </button>
        </div>
        {action}
      </div>
    </div>
  );
}
