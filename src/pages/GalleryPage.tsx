import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from './PageIntro';
import { GalleryMasonry } from '../components/gallery/GalleryMasonry';

export function GalleryPage() {
  usePageMeta(
    'Galerie',
    'Fotos von Bernd’s Blockhaus in Weilerbach: Gaststätte und Gerichte, Ferienwohnungen, Islandpferde und Angus-Rinder vom Eichwieserhof.',
  );
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
        copy="Eindrücke von Bernd’s Blockhaus, aus der Küche, den Ferienwohnungen und vom Eichwieserhof."
      />
      <section className="gallery-section" aria-labelledby="galerie-fotos">
        <h2 id="galerie-fotos" className="sr-only">
          Fotos
        </h2>
        <GalleryMasonry />
      </section>
    </>
  );
}
