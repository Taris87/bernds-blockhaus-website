import type { ReactNode } from 'react';
import type { Photo } from '../../types/content';
import { Collage } from './Collage';
import { ContourLines } from './Ornaments';
import { PhotoPrint } from './PhotoPrint';

interface PrintData {
  photo: Photo;
  caption: string;
}

interface Props {
  /** The one wide photo (≤ natural width) plus two overlapping prints. */
  panorama: PrintData;
  /** Up to two overlapping prints. */
  prints: PrintData[];
  children: ReactNode;
  id?: string;
  labelledBy?: string;
  /** Photos on the left (default) or on the right. */
  photosFirst?: boolean;
  /** `split`: photos and text side by side; `stacked`: photos above, text in two columns. */
  layout?: 'split' | 'stacked';
}

/** Panorama band (pattern M5): dark forest surface, contour lines, panorama print. */
export function PanoramaBand({ panorama, prints, children, id, labelledBy, photosFirst = true, layout = 'split' }: Props) {
  return (
    <section
      id={id}
      className={['panorama-band', `panorama-band-${layout}`, photosFirst ? '' : 'panorama-band-reversed'].filter(Boolean).join(' ')}
      aria-labelledby={labelledBy}
      tabIndex={id ? -1 : undefined}
    >
      <ContourLines className="panorama-contours" />
      <div className="wrap panorama-grid">
        <Collage preset="panorama">
          <PhotoPrint photo={panorama.photo} caption={panorama.caption} slot="slot-a" tilt={-1} />
          {prints.slice(0, 2).map((print, index) => (
            <PhotoPrint
              key={print.photo.src}
              photo={print.photo}
              caption={print.caption}
              slot={index === 0 && prints.length > 1 ? 'slot-b' : 'slot-c'}
              tilt={index === 0 && prints.length > 1 ? -4 : 3}
              tape={index === prints.length - 1}
            />
          ))}
        </Collage>
        <div className="panorama-copy">{children}</div>
      </div>
    </section>
  );
}
