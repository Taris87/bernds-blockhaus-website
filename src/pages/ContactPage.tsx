import { usePageMeta } from '../hooks/usePageMeta';
import { contacts } from '../data/contacts';
import { PageIntro } from './PageIntro';
export function ContactPage() {
  usePageMeta('Kontakt & Anfahrt', 'Kontaktinformationen und Anfahrt zu Bernd’s Blockhaus.');
  return <><PageIntro eyebrow="Wir freuen uns auf Sie" title={<>Kontakt &<br /><em>Anfahrt.</em></>} copy="[PLATZHALTER: Anschrift und Anfahrtsbeschreibung ergänzen.]" /><section className="content-section section-wrap two-column"><div><h2>Besuchen Sie <em>uns.</em></h2><p>{contacts.address}</p><p>Telefon: {contacts.phone}</p><p>E-Mail: {contacts.email}</p><p>Öffnungszeiten: {contacts.openingHours}</p></div><div className="image-placeholder"><span className="placeholder-mark">⌖</span><span>{contacts.directions}</span></div></section></>;
}
