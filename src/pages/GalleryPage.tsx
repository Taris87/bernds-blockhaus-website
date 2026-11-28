import { useRef } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from './PageIntro';
import { GalleryMasonry } from '../components/gallery/GalleryMasonry';
import { galleryItemsFor, useGalleryCategory } from '../components/gallery/useGalleryCategory';
import { categoryLabel } from '../data/gallery';

export function GalleryPage() {
  usePageMeta(
    'Galerie',
    'Fotos von Bernd’s Blockhaus in Weilerbach: Gaststätte und Gerichte, Ferienwohnungen, Islandpferde und Angus-Rinder vom Eichwieserhof.',
  );
  const [category, setCategory] = useGalleryCategory();
  const countRef = useRef<HTMLElement>(null);
  const count = galleryItemsFor(category).length;

  return (
    <>
      <PageIntro
        className="page-intro-gallery"
        eyebrow="Einblicke"
        title={
          <>
            Ein Ort voller
            <br />
            <em>Geschichten.</em>
          </>
        }
        aside={
          // Lead and photo counter beside the title (mockup neu-galerie-1440/375).
          <>
            <p className="lead" data-reveal="fade">
              Eindrücke von Bernd’s Blockhaus, aus der Küche, den Ferienwohnungen und vom Eichwieserhof.
            </p>
            <p className="gallery-count" aria-live="polite">
              <b ref={countRef} data-counter={count}>
                {count}
              </b>{' '}
              Fotos
              {category && <span className="sr-only"> in {categoryLabel(category)}</span>}
            </p>
          </>
        }
      />
      <section className="gallery-section" aria-labelledby="galerie-fotos">
        <h2 id="galerie-fotos" className="sr-only">
          Fotos
        </h2>
        <GalleryMasonry category={category} onCategoryChange={setCategory} countRef={countRef} />
      </section>
    </>
  );
}
