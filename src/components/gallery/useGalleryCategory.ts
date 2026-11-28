import { useSearchParams } from 'react-router';
import { galleryItems, isGalleryCategory, type GalleryCategory } from '../../data/gallery';

/** Query parameter for the active filter, e.g. `?kategorie=kueche-feiern`. */
export const FILTER_PARAM = 'kategorie';

/** Photos of a category (all for `null`). */
export function galleryItemsFor(category: GalleryCategory | null) {
  return category ? galleryItems.filter((item) => item.category === category) : galleryItems;
}

/** Active gallery filter, stored in the query string. */
export function useGalleryCategory(): [GalleryCategory | null, (next: GalleryCategory | null) => void] {
  const [params, setParams] = useSearchParams();
  const value = params.get(FILTER_PARAM) ?? '';
  const active = isGalleryCategory(value) ? value : null;

  function setActive(next: GalleryCategory | null) {
    setParams(
      (current) => {
        const updated = new URLSearchParams(current);
        if (next) updated.set(FILTER_PARAM, next);
        else updated.delete(FILTER_PARAM);
        return updated;
      },
      // Same pathname: useRouteScroll keeps the scroll position (QA-043/QA-107).
      { replace: true, preventScrollReset: true },
    );
  }

  return [active, setActive];
}
