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
  const restoreFocusOnClose = useRef(false);
  const callbacks = useRef({ onClose, onPrevious, onNext });

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

  function requestClose() {
    restoreFocusOnClose.current = true;
    callbacks.current.onClose();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    requestClose();
  }

  return (
    <dialog
      ref={dialogRef}
      className="lightbox-dialog"
      aria-label={item.title}
      onCancel={handleCancel}
      onClick={(event) => {
        if (event.target === event.currentTarget) requestClose();
      }}
    >
      <section className="lightbox-panel" aria-label="Bildansicht">
        <button
          ref={closeRef}
          className="lightbox-close"
          type="button"
          onClick={requestClose}
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
