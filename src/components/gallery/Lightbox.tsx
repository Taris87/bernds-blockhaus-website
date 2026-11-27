import { useEffect, useLayoutEffect, useRef, type CSSProperties, type MouseEvent, type SyntheticEvent } from 'react';
import type { Photo as PhotoData } from '../../types/content';
import { Photo } from '../ui/Photo';

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
 * endless arrows, thumbnail strip, keyboard ← → Esc. Motion hooks:
 * `data-flip-id` on the frame (shared with the gallery tile), `data-lightbox-film`.
 */
export function Lightbox({ items, index, onSelect, onClose, onPrevious, onNext }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const filmRef = useRef<HTMLDivElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const lifecycle = useRef(0);
  const restoreFocusOnClose = useRef(false);
  const callbacks = useRef({ onClose, onPrevious, onNext });
  const item = items[index];

  useLayoutEffect(() => {
    callbacks.current = { onClose, onPrevious, onNext };
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const token = ++lifecycle.current;
    restoreFocusOnClose.current = false;
    previousFocus.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
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
  useEffect(() => {
    const film = filmRef.current;
    const thumb = film?.querySelector<HTMLElement>('[aria-current="true"]');
    if (!film || !thumb) return;
    film.scrollLeft = thumb.offsetLeft - (film.clientWidth - thumb.offsetWidth) / 2;
  }, [index]);

  function requestClose() {
    restoreFocusOnClose.current = true;
    callbacks.current.onClose();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    requestClose();
  }

  function handleBackdropClick(event: MouseEvent<HTMLDialogElement>) {
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
        <div className="lightbox-stage" data-backdrop>
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
        <div className="lightbox-film" ref={filmRef} data-lightbox-film>
          {items.map((entry, entryIndex) => (
            <button
              key={entry.id}
              type="button"
              className="lightbox-thumb"
              aria-label={`Foto ${entryIndex + 1}: ${entry.title}`}
              aria-current={entryIndex === index ? 'true' : undefined}
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
