import { usePageMeta } from '../hooks/usePageMeta';
import {
  contactPersons,
  directions,
  formatAddress,
  operator,
  phoneHref,
} from '../data/contacts';
import { photos } from '../data/photos';
import { PageIntro } from './PageIntro';
import { Photo } from '../components/ui/Photo';
import { OpeningHours } from '../components/contact/OpeningHours';

export function ContactPage() {
  usePageMeta(
    'Kontakt & Anfahrt',
    'Kontakt zu Bernd’s Blockhaus und dem Eichwieserhof in 67685 Weilerbach: Ansprechpartner für Gaststätte, Ferienwohnungen, Islandpferde und Anguszucht.',
  );
  return (
    <>
      <PageIntro
        eyebrow="Wir freuen uns auf Sie"
        title={
          <>
            Kontakt &amp;
            <br />
            <em>Anfahrt.</em>
          </>
        }
        copy="Ihre Ansprechpartner für Gaststätte und Ferienwohnungen, Islandpferde und Anguszucht."
      />
      <section className="content-section section-wrap">
        <h2>
          Ihre <em>Ansprechpartner.</em>
        </h2>
        <ul className="contact-grid">
          {contactPersons.map((person) => (
            <li className="contact-card" key={person.role}>
              <p className="eyebrow">{person.group}</p>
              <p className="contact-responsibility">{person.responsibility}</p>
              <h3>{person.name}</h3>
              {person.address && <p>{formatAddress(person.address)}</p>}
              <p>
                Telefon: <a href={phoneHref(person.phone)}>{person.phone}</a>
              </p>
              <p>
                E-Mail: <a href={`mailto:${person.email}`}>{person.email}</a>
              </p>
            </li>
          ))}
        </ul>
      </section>
      <section className="content-section section-wrap two-column">
        <div>
          <h2>
            Besuchen Sie <em>uns.</em>
          </h2>
          <p>Bernd’s Blockhaus, {formatAddress(operator.address)}</p>
          <h3 className="subheading">Öffnungszeiten der Gaststätte</h3>
          <OpeningHours />
          <p className="placeholder-note">{directions}</p>
        </div>
        <figure className="framed-photo">
          <Photo photo={photos.blockhausWegweiser} />
        </figure>
      </section>
    </>
  );
}
