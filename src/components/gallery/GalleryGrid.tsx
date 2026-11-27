import { useState } from 'react';
import { galleryItems } from '../../data/gallery';
import { Lightbox } from './Lightbox';
import { PlaceholderImage } from '../ui/PlaceholderImage';

export function GalleryGrid() {
  const [active, setActive] = useState<number | null>(null);
  const activeItem = active === null ? undefined : galleryItems[active];

  return (
    <>
      <div className="gallery-grid">
        {galleryItems.map((item, index) => (
          <button
            className="gallery-tile"
            key={item.id}
            onClick={() => setActive(index)}
            aria-label={`${item.title} groß anzeigen`}
          >
            <PlaceholderImage label={item.description} />
            <span className="gallery-tile-caption">{item.title}</span>
          </button>
        ))}
      </div>
      {activeItem && (
        <Lightbox
          item={activeItem}
          onClose={() => setActive(null)}
          onPrevious={() =>
            setActive((current) =>
              current === null
                ? null
                : (current + galleryItems.length - 1) % galleryItems.length,
            )
          }
          onNext={() =>
            setActive((current) =>
              current === null ? null : (current + 1) % galleryItems.length,
            )
          }
        />
      )}
    </>
  );
}
