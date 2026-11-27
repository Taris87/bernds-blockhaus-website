import { useEffect, useLayoutEffect, useRef, type SyntheticEvent } from 'react';
import type { GalleryItem } from '../../data/gallery';
import { PlaceholderImage } from '../ui/PlaceholderImage';

interface Props {
  item: GalleryItem;
  onClose: () => void;
  onPrevious: () => void;
  onNext: () => void;
}

export function Lightbox({ item, onClose, onPrevious, onNext }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  const lifecycle = useRef(0);
  const callbacks = useRef({ onClose, onPrevious, onNext });

  useLayoutEffect(() => {
    callbacks.current = { onClose, onPrevious, onNext };
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    const token = ++lifecycle.current;
    if (!previousFocus.current && document.activeElement instanceof HTMLElement) {
      previousFocus.current = document.activeElement;
    }

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

    // Deferring modal activation prevents Strict Mode's effect replay from
    // opening, closing and reopening the native dialog during the same mount.
    queueMicrotask(() => {
      if (lifecycle.current !== token || !dialog.isConnected) return;
      if (!dialog.open) dialog.showModal();
      closeRef.current?.focus();
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (lifecycle.current === token) lifecycle.current += 1;
      if (dialog.open) dialog.close();

      // Strict Mode immediately re-runs this effect. Restore only if this
      // cleanup remains the latest lifecycle by the time the microtask runs.
      const cleanupToken = lifecycle.current;
      queueMicrotask(() => {
        if (lifecycle.current === cleanupToken) {
          previousFocus.current?.focus();
          previousFocus.current = null;
        }
      });
    };
  }, []);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    callbacks.current.onClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="lightbox-dialog"
      aria-label={item.title}
      onCancel={handleCancel}
      onClick={(event) => {
        if (event.target === event.currentTarget) callbacks.current.onClose();
      }}
    >
      <section className="lightbox-panel" aria-label="Bildansicht">
        <button
          ref={closeRef}
          className="lightbox-close"
          type="button"
          onClick={() => callbacks.current.onClose()}
          aria-label="Galerie schließen"
        >
          ×
        </button>
        <div className="lightbox-controls">
          <button className="button button-outline" type="button" onClick={() => callbacks.current.onPrevious()}>
            Zurück
          </button>
          <button className="button button-outline" type="button" onClick={() => callbacks.current.onNext()}>
            Weiter
          </button>
        </div>
        <PlaceholderImage label={item.description} className="lightbox-image" />
        <p className="lightbox-caption">{item.title}</p>
      </section>
    </dialog>
  );
}
