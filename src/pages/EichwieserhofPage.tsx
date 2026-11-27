import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from './PageIntro';
import { PlaceholderImage } from '../components/ui/PlaceholderImage';
export function EichwieserhofPage() {
  usePageMeta('Eichwieserhof', 'Einblicke und Informationen zum Eichwieserhof.');
  return <><PageIntro eyebrow="Leben auf dem Hof" title={<>Naturverbunden.<br /><em>Authentisch.</em></>} copy="[PLATZHALTER: Bestätigte Informationen zu Pferden, Angus und Hofangeboten.]" /><section className="content-section section-wrap two-column"><div><h2>Der <em>Eichwieserhof.</em></h2><p>[PLATZHALTER: Hofgeschichte und Angebot beschreiben.]</p><p>[PLATZHALTER: Angaben zu Tieren, Haltung und Besuchsmöglichkeiten bestätigen.]</p></div><PlaceholderImage label="[PLATZHALTER: Authentisches Foto des Eichwieserhofs]" /></section></>;
}
