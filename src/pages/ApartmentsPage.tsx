import { usePageMeta } from '../hooks/usePageMeta';
import { apartments } from '../data/apartments';
import { ApartmentInquiryForm } from '../components/forms/ApartmentInquiryForm';
import { PageIntro } from './PageIntro';
import { PlaceholderImage } from '../components/ui/PlaceholderImage';
export function ApartmentsPage() {
  usePageMeta('Ferienwohnungen', 'Informationen zu den Ferienwohnungen und Anfrage.');
  return <><PageIntro eyebrow="Übernachten" title={<>Zeit zum<br /><em>Durchatmen.</em></>} copy="[PLATZHALTER: Bestätigte Informationen zu den Ferienwohnungen.]" /><section className="content-section section-wrap"><div className="apartment-grid">{apartments.map((apartment) => <article className="apartment-card" key={apartment.id}><PlaceholderImage label={apartment.imageLabel} /><div><h3>{apartment.name}</h3><p>{apartment.description}</p><p>{apartment.capacity}</p><ul>{apartment.features.map((feature) => <li key={feature}>{feature}</li>)}</ul></div></article>)}</div></section><ApartmentInquiryForm /></>;
}
