import { useState } from 'react';
import { galleryItems } from '../../data/gallery';
import { Lightbox } from './Lightbox';
import { PlaceholderImage } from '../ui/PlaceholderImage';
export function GalleryGrid() {
  const [active, setActive] = useState<number | null>(null);
  return <><div className="gallery-grid">{galleryItems.map((item, index) => <button className="gallery-tile" key={item.id} onClick={() => setActive(index)} aria-label={`${item.title} groß anzeigen`}><PlaceholderImage label={item.description} /><span className="gallery-tile-caption">{item.title}</span></button>)}</div>{active !== null && <Lightbox item={galleryItems[active]} onClose={() => setActive(null)} onPrevious={() => setActive((active + galleryItems.length - 1) % galleryItems.length)} onNext={() => setActive((active + 1) % galleryItems.length)} />}</>;
}
