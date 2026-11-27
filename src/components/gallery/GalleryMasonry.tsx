import { Fragment, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useSearchParams } from 'react-router';
import {
  categoryLabel,
  galleryCategories,
  galleryItems,
  isGalleryCategory,
  type GalleryCategory,
} from '../../data/gallery';
import { openingHours } from '../../data/contacts';
import { microTexts } from '../../data/site';
import { Lightbox } from './Lightbox';
import { Photo } from '../ui/Photo';

/** Query parameter for the active filter, e.g. `?kategorie=kueche-feiern`. */
const FILTER_PARAM = 'kategorie';

/** Height of one implicit grid row in px (see `.masonry` in index.css). */
const ROW_UNIT = 4;
/** Estimate before measuring: column width 300 px, caption 52 px, gap 36 px. */
function estimatedSpan(width: number, height: number) {
  return Math.ceil((300 * (height / width) + 52 + 36) / ROW_UNIT);
}

/** Index after which the opening-hours tile is inserted. */
const NOTE_AFTER = 9;

function useActiveCategory(): [GalleryCategory | null, (next: GalleryCategory | null) => void] {
  const [params, setParams] = useSearchParams();
  const value = params.get(FILTER_PARAM) ?? '';
  const active = isGalleryCategory(value) ? value : null;

  function setActive(next: GalleryCategory | null) {
    setParams(
      (current) => {
        const updated = new URLSearchParams(current);
        if (next) updated.set(FILTER_PARAM, next);
        else updated.delete(FILTER_PARAM);
        return updated;
      },
      // Same pathname: useRouteScroll keeps the scroll position (QA-043/QA-107).
      { replace: true, preventScrollReset: true },
    );
  }

  return [active, setActive];
}

/**
 * Masonry in reading order (pattern M6): CSS grid with 4 px implicit rows,
 * every tile spans as many rows as its measured height needs. Unlike CSS
 * columns, DOM order, tab order and visual order stay row-wise.
 *
 * Motion hooks: tiles carry `data-reveal="tile"` and `data-flip-id`
 * (shared with the lightbox image for the FLIP transition).
 */
export function GalleryMasonry() {
  const [category, setCategory] = useActiveCategory();
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const items = category ? galleryItems.filter((item) => item.category === category) : galleryItems;
  const activeItem = active === null ? undefined : items[active];

  // Measure each tile and set its row span. Without ResizeObserver (tests,
  // very old browsers) the CSS estimate from the aspect ratio stays.
  useEffect(() => {
    const list = listRef.current;
    if (!list || typeof ResizeObserver === 'undefined') return;
    let frame = 0;
    const pending = new Set<HTMLElement>();
    // Writes are batched into the next frame to avoid ResizeObserver loops.
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) pending.add(entry.target as HTMLElement);
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        // The gap differs per breakpoint, so it is read on every pass.
        const gap = Number.parseFloat(getComputedStyle(list).getPropertyValue('--masonry-gap')) || 0;
        for (const tile of pending) {
          const height = tile.getBoundingClientRect().height;
          tile.style.gridRowEnd = `span ${Math.ceil((height + gap) / ROW_UNIT)}`;
        }
        pending.clear();
      });
    });
    list.querySelectorAll<HTMLElement>(':scope > li').forEach((tile) => observer.observe(tile));
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [category]);

  function select(next: GalleryCategory | null) {
    setActive(null);
    setCategory(next);
  }

  const chips: { id: GalleryCategory | null; label: string; count: number }[] = [
    { id: null, label: 'Alle', count: galleryItems.length },
    ...galleryCategories.map((entry) => ({
      id: entry.id,
      label: entry.label,
      count: galleryItems.filter((item) => item.category === entry.id).length,
    })),
  ];

  return (
    <>
      <div className="gallery-filters">
        <div className="wrap">
          <div className="gallery-filters-inner" role="group" aria-label="Fotos filtern">
            {chips.map((chip) => {
              const pressed = chip.id === category;
              return (
                <button
                  key={chip.id ?? 'alle'}
                  type="button"
                  className="chip"
                  aria-pressed={pressed}
                  onClick={() => select(chip.id)}
                >
                  {chip.label} <small>{chip.count}</small>
                </button>
              );
            })}
          </div>
        </div>
      </div>
      <div className="wrap">
        <p className="gallery-count" aria-live="polite">
          <b data-counter={items.length}>{items.length}</b> Fotos
          {category && <span className="sr-only"> in {categoryLabel(category)}</span>}
        </p>
        <ul className="masonry" ref={listRef} data-reveal="stagger">
          {items.map((item, index) => (
            <Fragment key={item.id}>
              <li
                className="masonry-tile"
                data-reveal="tile"
                style={{ '--span': estimatedSpan(item.photo.width, item.photo.height) } as CSSProperties}
              >
                <figure>
                  <button
                    type="button"
                    className="masonry-button"
                    data-flip-id={item.id}
                    onClick={() => setActive(index)}
                    aria-label={`${item.title} groß anzeigen`}
                  >
                    <Photo photo={item.photo} eager={index < 4} />
                    <span className="masonry-hint" aria-hidden="true">
                      {microTexts.enlarge}
                    </span>
                  </button>
                  <figcaption>
                    <span>
                      <span className="masonry-number">{String(index + 1).padStart(2, '0')}</span>
                      {item.title}
                    </span>
                    <span className="masonry-category">{categoryLabel(item.category)}</span>
                  </figcaption>
                </figure>
              </li>
              {index === NOTE_AFTER - 1 && items.length > NOTE_AFTER && (
                <li className="masonry-tile masonry-note" style={{ '--span': 50 } as CSSProperties}>
                  <p className="masonry-note-title">Öffnungszeiten der Gaststätte</p>
                  <dl>
                    {openingHours.map((entry) => (
                      <div key={entry.days}>
                        <dt>{entry.days}</dt>
                        <dd>{entry.time}</dd>
                      </div>
                    ))}
                  </dl>
                </li>
              )}
            </Fragment>
          ))}
        </ul>
      </div>
      {activeItem && active !== null && (
        <Lightbox
          items={items.map((item) => ({
            id: item.id,
            title: item.title,
            label: categoryLabel(item.category),
            photo: item.photo,
          }))}
          index={active}
          onSelect={setActive}
          onClose={() => setActive(null)}
          onPrevious={() => setActive((current) => (current === null ? null : (current + items.length - 1) % items.length))}
          onNext={() => setActive((current) => (current === null ? null : (current + 1) % items.length))}
        />
      )}
    </>
  );
}
