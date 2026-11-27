import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from './PageIntro';
import { GalleryGrid } from '../components/gallery/GalleryGrid';
export function GalleryPage() {
  usePageMeta('Galerie', 'Fotos von Bernd’s Blockhaus in Weilerbach: Gaststätte und Gerichte, Ferienwohnungen, Islandpferde und Angus-Rinder vom Eichwieserhof.');
  return <><PageIntro eyebrow="Einblicke" title={<>Ein Ort voller<br /><em>Geschichten.</em></>} copy="Eindrücke von Bernd’s Blockhaus, aus der Küche, den Ferienwohnungen und vom Eichwieserhof." /><section className="content-section section-wrap"><GalleryGrid /></section></>;
}
