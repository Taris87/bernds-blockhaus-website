import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
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
  const [dialogReady, setDialogReady] = useState(false);
  const [callbacks, setCallbacks] = useState({ onClose, onPrevious, onNext });

  useEffect(() => {
    setCallbacks({ onClose, onPrevious, onNext });
  }, [onClose, onPrevious, onNext]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || dialogReady) return;

    const token = ++lifecycle.current;
    const trigger = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    previousFocus.current = trigger;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.ctrlKey || event.metaKey) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        callbacks.onPrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        callbacks.onNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    queueMicrotask(() => {
      if (lifecycle.current !== token || !dialog.isConnected) return;
      if (!dialog.open) dialog.showModal();
      closeRef.current?.focus();
      setDialogReady(true);
    });

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (lifecycle.current === token) lifecycle.current += 1;
      if (dialog.open) dialog.close();
      const cleanupToken = lifecycle.current;
      const focusTarget = previousFocus.current;
      queueMicrotask(() => {
        if (lifecycle.current !== cleanupToken) return;
        previousFocus.current = null;
        if (focusTarget?.isConnected && document.contains(focusTarget)) focusTarget.focus();
      });
    };
  }, [dialogReady, callbacks]);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    callbacks.onClose();
  }

  return (
    <dialog ref={dialogRef} className="lightbox-dialog" aria-label={item.title} onCancel={handleCancel}
      onClick={(event) => { if (event.target === event.currentTarget) callbacks.onClose(); }}>
      <section className="lightbox-panel" aria-label="Bildansicht">
        <button ref={closeRef} className="lightbox-close" type="button" onClick={callbacks.onClose} aria-label="Galerie schließen">×</button>
        <div className="lightbox-controls">
          <button className="button button-outline" type="button" onClick={callbacks.onPrevious}>Zurück</button>
          <button className="button button-outline" type="button" onClick={callbacks.onNext}>Weiter</button>
        </div>
        <PlaceholderImage label={item.description} className="lightbox-image" />
        <p className="lightbox-caption">{item.title}</p>
      </section>
    </dialog>
  );
}
