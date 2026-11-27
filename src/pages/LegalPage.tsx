import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from './PageIntro';
export function ImprintPage() {
  usePageMeta('Impressum', 'Impressum von Bernd’s Blockhaus.');
  return <><PageIntro eyebrow="Rechtliches" title={<>Impressum</>} copy="Anbieterkennzeichnung und Kontaktangaben." /><section className="content-section section-wrap"><h2>Angaben gemäß § 5 DDG</h2><p>[PLATZHALTER: Vollständiger Betreibername und ladungsfähige Anschrift]</p><p>[PLATZHALTER: Kontaktangaben, Vertretungsberechtigte, Registerangaben falls zutreffend]</p></section></>;
}
export function PrivacyPage() {
  usePageMeta('Datenschutz', 'Datenschutzhinweise von Bernd’s Blockhaus.');
  return <><PageIntro eyebrow="Rechtliches" title={<>Datenschutz</>} copy="[PLATZHALTER: Datenschutzerklärung anhand der tatsächlich eingesetzten Dienste erstellen und rechtlich prüfen lassen.]" /><section className="content-section section-wrap"><p>[PLATZHALTER: Verantwortliche Stelle, Datenverarbeitung, Rechtsgrundlagen, Speicherdauer und Betroffenenrechte ergänzen.]</p></section></>;
}
