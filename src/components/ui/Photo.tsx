import type { Photo as PhotoData } from '../../types/content';
import { photoUrl } from '../../data/photos';

interface Props {
  photo: PhotoData;
  className?: string;
  /** Above-the-fold images load eagerly; everything else lazily. */
  eager?: boolean;
}

export function Photo({ photo, className, eager = false }: Props) {
  return (
    <img
      className={className ? `photo ${className}` : 'photo'}
      src={photoUrl(photo)}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  );
}
