import {
  useEffect,
  useLayoutEffect,
  useRef,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent,
  type SyntheticEvent,
} from 'react';
import type { Photo as PhotoData } from '../../types/content';
import { Photo } from '../ui/Photo';
import { useGSAP } from '../../motion/gsap';
import {
  closeLightbox,
  dragLightbox,
  openLightbox,
  snapBackLightbox,
  stepLightbox,
} from '../../motion/lightboxMotion';
import { useSwipe } from '../../motion/useSwipe';

export interface LightboxItem {
  id: string;
  title: string;
  /** Category or context line under the title. */
  label?: string;
  photo: PhotoData;
}

interface Props {
  items: LightboxItem[];
  index: number;
  onSelect: (index: number) => void;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

function pad(value: number) {
  return String(value).padStart(2, '0');
}

/**
 * Native modal dialog for photos: dark surface, print frame, counter,
 * endless arrows, thumbnail strip, keyboard ← → Esc, swipe (Pointer Events).
 * Motion (src/motion/lightboxMotion.ts): open/close with Flip between the
 * gallery tile and the frame (shared `data-flip-id`), slide on next/previous.
 * Closing waits for the close animation, then unmounts; focus handling is the
 * same as without motion.
 */
export function Lightbox({ items, index, onSelect, onClose, onPrevious, onNext }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const closing = useRef(false);
  const openAnimation = useRef<gsap.core.Timeline | null>(null);
  const previousIndex = useRef(index);
  const previousFocus = useRef<HTMLElement | null>(null);
  const lifecycle = useRef(0);
  const restoreFocusOnClose = useRef(false);
  const callbacks = useRef({ onClose, onPrevious, onNext });
  const item = items[index];
  const itemId = useRef(item?.id ?? '');
  const { contextSafe } = useGSAP({ scope: dialogRef });
  const runOpen = useRef<(dialog: HTMLDialogElement) => void>(() => undefined);

  useLayoutEffect(() => {
    callbacks.current = { onClose, onPrevious, onNext };
    itemId.current = item?.id ?? '';
    runOpen.current = contextSafe((dialog: HTMLDialogElement) => {
      openAnimation.current = openLightbox(dialog, itemId.current);
    });
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const token = ++lifecycle.current;
    restoreFocusOnClose.current = false;
    previousFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey || closing.current) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        callbacks.current.onPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        callbacks.current.onNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    queueMicrotask(() => {
      if (lifecycle.current !== token || !dialog.isConnected) return;
      if (!dialog.open) dialog.showModal();
      closeRef.current?.focus();
      runOpen.current(dialog);
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (lifecycle.current === token) lifecycle.current += 1;
      if (dialog.open) dialog.close();

      const cleanupToken = lifecycle.current;
      const focusTarget = previousFocus.current;
      const shouldRestoreFocus = restoreFocusOnClose.current;
      previousFocus.current = null;
      restoreFocusOnClose.current = false;

      // Only a user-driven close is allowed to restore focus. A parent-driven
      // unmount (including route changes) must never refocus a stale trigger.
      if (shouldRestoreFocus) {
        queueMicrotask(() => {
          if (
            lifecycle.current === cleanupToken &&
            focusTarget?.isConnected &&
            document.contains(focusTarget)
          ) {
            focusTarget.focus();
          }
        });
      }
    };
  }, []);

  // Keep the current thumbnail visible inside the strip (no page scroll).
  // Roving tabindex (QA-113): if focus is in the strip, it follows the photo.
  useEffect(() => {
    const film = filmRef.current;
    const thumb = film?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!film || !thumb) return;
    film.scrollLeft = thumb.offsetLeft - (film.clientWidth - thumb.offsetWidth) / 2;
    if (film.contains(document.activeElement) && document.activeElement !== thumb) {
      thumb.focus({ preventScroll: true });
    }
  }, [index]);

  // The strip is one tab stop; ← → (handled for the whole dialog) switch the
  // photo, Home/End jump to the first/last one.
  function handleFilmKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.altKey || event.ctrlKey || event.metaKey || closing.current) return;
    if (event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    onSelect(event.key === 'Home' ? 0 : items.length - 1);
  }

  // Slide the new photo in from the side it came from (not on mount).
  useGSAP(
    () => {
      const dialog = dialogRef.current;
      const before = previousIndex.current;
      previousIndex.current = index;
      if (!dialog || before === index || closing.current) return;
      const count = items.length;
      const forward =
        (before + 1) % count === index ? true : (before + count - 1) % count === index ? false : index > before;
      stepLightbox(dialog, forward ? 1 : -1);
    },
    { scope: dialogRef, dependencies: [index] },
  );

  const swipe = useSwipe(stageRef, {
    onSwipe: (direction) => {
      if (closing.current) return;
      if (direction < 0) callbacks.current.onNext();
      else callbacks.current.onPrevious();
    },
    onDrag: (dx) => {
      const dialog = dialogRef.current;
      if (dialog && !closing.current) contextSafe(() => dragLightbox(dialog, dx))();
    },
    onCancel: () => {
      const dialog = dialogRef.current;
      if (dialog) contextSafe(() => snapBackLightbox(dialog))();
    },
  });

  function requestClose() {
    if (closing.current) return;
    closing.current = true;
    restoreFocusOnClose.current = true;
    const dialog = dialogRef.current;
    if (!dialog) {
      callbacks.current.onClose();
      return;
    }
    // Inside the GSAP context: an unmount mid-animation reverts it cleanly.
    contextSafe(() => {
      openAnimation.current?.kill();
      openAnimation.current = null;
      closeLightbox(dialog, itemId.current, () => callbacks.current.onClose());
    })();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    requestClose();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
    // The click that ends a swipe is not a backdrop click.
    if (swipe.consumeSwipe()) return;
    const target = event.target as HTMLElement;
    if (target === event.currentTarget || target.dataset.backdrop !== undefined) requestClose();
  }

  if (!item) return null;

  const frameStyle = {
    '--nw': item.photo.width,
    '--ratio': item.photo.width / item.photo.height,
  } as CSSProperties;

  return (
    <dialog ref={dialogRef} className="lightbox-dialog" aria-label={item.title} onCancel={handleCancel} onClick={handleBackdropClick}>
      <div className="lightbox-scrim" aria-hidden="true" data-backdrop />
      <section className="lightbox-panel" aria-label="Bildansicht" data-backdrop>
        <div className="lightbox-top" data-backdrop>
          <p className="lightbox-counter">
            {pad(index + 1)} / {pad(items.length)}
            {item.label && <span> · {item.label}</span>}
          </p>
          <button ref={closeRef} className="lightbox-close icon-button" type="button" onClick={requestClose} aria-label="Galerie schließen">
            <span aria-hidden="true">✕</span>
          </button>
        </div>
        <div className="lightbox-stage" ref={stageRef} data-backdrop>
          <div className="lightbox-controls" data-backdrop>
            <button className="icon-button lightbox-arrow" type="button" aria-label="Zurück" onClick={() => callbacks.current.onPrevious()}>
              <span aria-hidden="true">←</span>
            </button>
            <button className="icon-button lightbox-arrow" type="button" aria-label="Weiter" onClick={() => callbacks.current.onNext()}>
              <span aria-hidden="true">→</span>
            </button>
          </div>
          <figure className="lightbox-figure">
            <div className="lightbox-frame" style={frameStyle} data-flip-id={item.id}>
              <Photo photo={item.photo} className="lightbox-image" eager />
            </div>
            <figcaption className="lightbox-caption">
              <b>{item.title}</b>
              {item.label && <span>{item.label}</span>}
            </figcaption>
          </figure>
        </div>
        <div
          className="lightbox-film"
          ref={filmRef}
          role="group"
          aria-label="Miniaturen – Pfeiltasten wechseln das Foto"
          onKeyDown={handleFilmKeyDown}
          data-lightbox-film
        >
          {items.map((entry, entryIndex) => (
            <button
              key={entry.id}
              type="button"
              className="lightbox-thumb"
              aria-label={`Foto ${entryIndex + 1}: ${entry.title}`}
              aria-current={entryIndex === index ? 'true' : undefined}
              tabIndex={entryIndex === index ? 0 : -1}
              onClick={() => onSelect(entryIndex)}
            >
              <Photo photo={entry.photo} />
            </button>
          ))}
        </div>
      </section>
    </dialog>
  );
}
