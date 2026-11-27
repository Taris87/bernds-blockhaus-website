import type { ReactNode } from 'react';
import type { Photo } from '../../types/content';
import { Collage } from './Collage';
import { PhotoPrint } from './PhotoPrint';
import { Sign } from './Sign';

interface Props {
  /** Running number (“01”) – optional. */
  number?: string;
  title: ReactNode;
  titleId?: string;
  level?: 2 | 3;
  children: ReactNode;
  link?: { to: string; label: string };
  photos: [{ photo: Photo; caption: string }, { photo: Photo; caption: string }];
  /** Mirror the photo pair (every second row). */
  mirrored?: boolean;
}

/** Index row with a photo pair (pattern M2): number, big title, text, signpost link. */
export function IndexRow({ number, title, titleId, level = 3, children, link, photos, mirrored = false }: Props) {
  const Heading = level === 2 ? 'h2' : 'h3';
  const [first, second] = photos;
  return (
    <article className={`index-row${number ? '' : ' index-row-plain'}`} aria-labelledby={titleId}>
      {number && (
        <span className="index-number" aria-hidden="true">
          {number}
        </span>
      )}
      <div className="index-copy">
        <Heading id={titleId} className="index-title" data-reveal="text">
          {title}
        </Heading>
        {children}
        {link && <Sign to={link.to}>{link.label}</Sign>}
      </div>
      <Collage preset={mirrored ? 'pair-mirrored' : 'pair'} className="index-photos">
        <PhotoPrint photo={first.photo} caption={first.caption} slot="slot-a" tilt={mirrored ? 2 : -2} />
        <PhotoPrint photo={second.photo} caption={second.caption} slot="slot-b" tilt={mirrored ? -3 : 3} />
      </Collage>
    </article>
  );
}
