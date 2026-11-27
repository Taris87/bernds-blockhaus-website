import { useEffect, useRef } from 'react';
import type { GalleryItem } from '../../data/gallery';
import { PlaceholderImage } from '../ui/PlaceholderImage';
interface Props { item: GalleryItem; onClose: () => void; onPrevious: () => void; onNext: () => void; }
export function Lightbox({ item, onClose, onPrevious, onNext }: Props) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const previousFocus = useRef<HTMLElement | null>(null);
  useEffect(() => {
    previousFocus.current = document.activeElement as HTMLElement; closeRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowLeft') onPrevious();
      if (event.key === 'ArrowRight') onNext();
      if (event.key === 'Tab') {
        const focusable = document.querySelectorAll<HTMLElement>('.lightbox button');
        const first = focusable[0]; const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
        else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
      }
    };
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('keydown', onKey); previousFocus.current?.focus(); };
  }, [onClose, onPrevious, onNext]);
  return <div className="lightbox-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><section className="lightbox" role="dialog" aria-modal="true" aria-label={item.title}><button className="lightbox-close" ref={closeRef} onClick={onClose} aria-label="Galerie schließen">×</button><button className="button button-outline" onClick={onPrevious}>Zurück</button><PlaceholderImage label={item.description} className="lightbox-image" /><button className="button button-outline" onClick={onNext}>Weiter</button><p className="lightbox-caption">{item.title}</p></section></div>;
}
