import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from './PageIntro';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
export function GalleryPage() {
  usePageMeta('Galerie', 'Bilder aus Gaststätte, Ferienwohnungen und Eichwieserhof.');
  return <><PageIntro eyebrow="Einblicke" title={<>Ein Ort voller<br /><em>Geschichten.</em></>} copy="[PLATZHALTER: Einleitung zur Bildergalerie.]" /><section className="content-section section-wrap"><GalleryGrid /></section></>;
}
