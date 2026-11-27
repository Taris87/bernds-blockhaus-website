import type { CSSProperties } from 'react';
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
import { PhotoPrint } from '../components/ui/PhotoPrint';
import { OpeningHoursBoard } from '../components/ui/OpeningHoursBoard';

const cardTilts = [-1, 1, -0.6];

export function ContactPage() {
  usePageMeta(
    'Kontakt & Anfahrt',
    'Kontakt zu Bernd’s Blockhaus und dem Eichwieserhof in 67685 Weilerbach: Ansprechpartner für Gaststätte, Ferienwohnungen, Islandpferde und Anguszucht.',
  );
  return (
    <>
      <PageIntro
        className="page-intro-contact"
        eyebrow="Wir freuen uns auf Sie"
        title={
          <>
            Kontakt &amp;
            <br />
            <em>Anfahrt.</em>
          </>
        }
        copy="Ihre Ansprechpartner für Gaststätte und Ferienwohnungen, Islandpferde und Anguszucht."
        aside={<PhotoPrint photo={photos.blockhausWegweiser} caption="Der Wegweiser" tilt={-3} tape eager />}
      />
      <section className="section contact-section" aria-labelledby="ansprechpartner">
        <div className="wrap">
          <h2 id="ansprechpartner" className="section-title" data-reveal="text">
            Ihre <em>Ansprechpartner.</em>
          </h2>
          <ul className="contact-grid">
            {contactPersons.map((person, index) => (
              <li
                className="contact-card"
                key={person.role}
                style={{ '--tilt': `${cardTilts[index] ?? 0}deg` } as CSSProperties}
                data-reveal="pin"
              >
                <p className="label">{person.group}</p>
                <p className="contact-responsibility">{person.responsibility}</p>
                <h3>{person.name}</h3>
                {person.address && <p>{formatAddress(person.address)}</p>}
                <p className="contact-link">
                  <span className="contact-link-label">Telefon</span>
                  <a href={phoneHref(person.phone)}>{person.phone}</a>
                </p>
                <p className="contact-link">
                  <span className="contact-link-label">E-Mail</span>
                  <a href={`mailto:${person.email}`}>{person.email}</a>
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section visit-section" aria-labelledby="besuchen">
        <div className="wrap visit-grid">
          <div>
            <h2 id="besuchen" className="section-title" data-reveal="text">
              Besuchen Sie <em>uns.</em>
            </h2>
            <p className="visit-address">
              Bernd’s Blockhaus
              <br />
              {formatAddress(operator.address)}
            </p>
            <p className="placeholder-note">{directions}</p>
            <p className="placeholder-note">
              [PLATZHALTER: Karte/Lageplan – erst nach Datenschutz-Entscheidung]
            </p>
          </div>
          <OpeningHoursBoard level={3} />
        </div>
      </section>
    </>
  );
}
