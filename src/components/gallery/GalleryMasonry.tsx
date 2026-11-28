import { Fragment, useEffect, useRef, useState, type CSSProperties, type RefObject } from 'react';
import { categoryLabel, galleryCategories, galleryItems, type GalleryCategory } from '../../data/gallery';
import { openingHours } from '../../data/contacts';
import { microTexts } from '../../data/site';
import { Lightbox } from './Lightbox';
import { Photo } from '../ui/Photo';
import { useGalleryMotion } from '../../motion/useGalleryMotion';

/** Height of one implicit grid row in px (see `.masonry` in index.css). */
const ROW_UNIT = 4;
/** Estimate before measuring: column width 300 px, caption 52 px, gap 36 px. */
function estimatedSpan(width: number, height: number) {
  return Math.ceil((300 * (height / width) + 52 + 36) / ROW_UNIT);
}

/** Index after which the opening-hours tile is inserted. */
const NOTE_AFTER = 9;

/**
 * Masonry in reading order (pattern M6): CSS grid with 4 px implicit rows,
 * every tile spans as many rows as its measured height needs. Unlike CSS
 * columns, DOM order, tab order and visual order stay row-wise.
 *
 * Motion (useGalleryMotion): tiles fade up once (`data-reveal="tile"`), a
 * filter change uses Flip; `data-flip-id` on the tile button is shared with
 * the lightbox frame for the open/close transition.
 */
interface Props {
  /** Active filter from the query string (see useGalleryCategory). */
  category: GalleryCategory | null;
  onCategoryChange: (next: GalleryCategory | null) => void;
  /** The photo counter in the page intro (counts to the new number on filter changes). */
  countRef: RefObject<HTMLElement | null>;
}

export function GalleryMasonry({ category, onCategoryChange: setCategory, countRef }: Props) {
  const [active, setActive] = useState<number | null>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const motion = useGalleryMotion(listRef, countRef, category);

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

  /**
   * A short filter result must not make the page so short that the browser
   * clamps the scroll position (QA-043): the section keeps exactly the height
   * the current scroll position needs, nothing more.
   */
  function keepScrollPosition() {
    const section = listRef.current?.closest<HTMLElement>('.gallery-section');
    if (!section) return;
    const root = document.documentElement;
    const outside = root.scrollHeight - section.offsetHeight;
    const needed = Math.ceil(window.scrollY + window.innerHeight - outside);
    if (needed > 0) section.style.minHeight = `${needed}px`;
    else section.style.removeProperty('min-height');
  }

  function select(next: GalleryCategory | null) {
    keepScrollPosition();
    if (next !== category) motion.beforeFilter();
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
