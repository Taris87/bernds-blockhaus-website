import type { CSSProperties } from 'react';
import type { Photo as PhotoData } from '../../types/content';
import { Photo } from './Photo';

interface Props {
  photo: PhotoData;
  /** Short caption on the paper margin (uppercase sign font). */
  caption?: string;
  /** Final rotation in degrees (−5 … +4; mobile is clamped in CSS). */
  tilt?: number;
  /** Strip of yellow tape on top. */
  tape?: boolean;
  eager?: boolean;
  /** Position class inside a `Collage` preset, e.g. `slot-a`. */
  slot?: string;
  className?: string;
}

/**
 * Photo print (“Fotoabzug”, Kap. 3.4 / M1): paper margin, caption, slight
 * rotation. The print never makes the photo larger than its pixel size –
 * widths come from the collage preset or the natural width.
 *
 * Motion hooks: `data-reveal="pin"` (pinned onto the wall) and
 * `data-parallax` for collage parallax; `--tilt` holds the end rotation.
 */
export function PhotoPrint({ photo, caption, tilt = 0, tape = false, eager = false, slot, className = '' }: Props) {
  const style = {
    '--tilt': `${tilt}deg`,
    '--natural-width': `${photo.width}px`,
  } as CSSProperties;
  return (
    <figure
      className={['print', slot, className].filter(Boolean).join(' ')}
      style={style}
      data-reveal="pin"
      data-parallax={slot ? '' : undefined}
    >
      {tape && <span className="print-tape" aria-hidden="true" />}
      <Photo photo={photo} eager={eager} />
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  );
}
