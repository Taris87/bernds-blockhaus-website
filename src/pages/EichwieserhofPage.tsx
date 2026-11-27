import { usePageMeta } from '../hooks/usePageMeta';
import { PageIntro } from './PageIntro';
import { Photo } from '../components/ui/Photo';
import { photos } from '../data/photos';
import { beefOrderPhone, getContact, phoneHref } from '../data/contacts';
import {
  angusText,
  beefOffers,
  eichwieserhofSummary,
  getStallionName,
  saleHorseGroups,
  saleHorsesAsOf,
  stallions,
} from '../data/eichwieserhof';

const sections = [
  { id: 'islandpferde', label: 'Islandpferde' },
  { id: 'deckhengste', label: 'Deckhengste' },
  { id: 'verkaufspferde', label: 'Verkaufspferde' },
  { id: 'anguszucht', label: 'Anguszucht' },
  { id: 'rindfleisch', label: 'Rindfleisch bestellen' },
];

const horsePhotos = [
  photos.islaenderWiese,
  photos.islaenderSonnenblume,
  photos.islaenderAuge,
  photos.islaenderSonnenblumenfeld,
];

export function EichwieserhofPage() {
  usePageMeta(
    'Eichwieserhof',
    'Eichwieserhof in Weilerbach: Islandpferdezucht „Isländer vom Eichwieserhof“, Deckhengste, Verkaufspferde, Anguszucht und Rindfleisch auf Vorbestellung.',
  );
  const horseContact = getContact('islandpferde');
  return (
    <>
      <PageIntro
        eyebrow="Leben auf dem Hof"
        title={
          <>
            Naturverbunden.
            <br />
            <em>Authentisch.</em>
          </>
        }
        copy={eichwieserhofSummary}
      />
      <section className="content-section section-wrap two-column">
        <div>
          <h2>
            Der <em>Eichwieserhof.</em>
          </h2>
          <p>[PLATZHALTER: Hofgeschichte und Besuchsmöglichkeiten]</p>
          <nav className="section-nav" aria-label="Abschnitte dieser Seite">
            {sections.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.label}
              </a>
            ))}
          </nav>
        </div>
        <figure className="framed-photo">
          <Photo photo={photos.eichwieserhof} />
        </figure>
      </section>

      <section
        id="islandpferde"
        className="farm-section farm-section-tinted"
        tabIndex={-1}
      >
        <div className="section-wrap">
          <p className="eyebrow">Islandpferdezucht</p>
          <h2>
            Isländer vom <em>Eichwieserhof.</em>
          </h2>
          <p className="farm-lead">
            Anfragen gerne per E-Mail:{' '}
            <a href={`mailto:${horseContact.email}`}>{horseContact.email}</a>{' '}
            oder unter{' '}
            <a href={phoneHref(horseContact.phone)}>{horseContact.phone}</a> (
            {horseContact.name})
          </p>
          <div className="photo-row">
            {horsePhotos.map((photo) => (
              <Photo key={photo.src} photo={photo} className="photo-cover" />
            ))}
          </div>
        </div>
      </section>

      <section id="deckhengste" className="farm-section" tabIndex={-1}>
        <div className="section-wrap">
          <p className="eyebrow">Väter unserer Isländer</p>
          <h2>
            Deck<em>hengste.</em>
          </h2>
          <ul className="fact-cards">
            {stallions.map((stallion) => (
              <li key={stallion.id}>
                <h3>{stallion.name}</h3>
                <p>* {stallion.born}</p>
                {stallion.details && <p>{stallion.details}</p>}
                {stallion.stud && <p>{stallion.stud}</p>}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="verkaufspferde"
        className="farm-section farm-section-tinted"
        tabIndex={-1}
      >
        <div className="section-wrap">
          <p className="eyebrow">Vom Eichwieserhof</p>
          <h2>
            Verkaufs<em>pferde.</em>
          </h2>
          <p className="as-of">{saleHorsesAsOf}</p>
          <p className="farm-lead">
            Bitte beachten Sie, dass all unsere Verkaufspferde{' '}
            <strong>nicht</strong> eingeritten sind!
          </p>
          {saleHorseGroups.map((group) => (
            <div className="horse-group" key={group.id}>
              <h3>{group.title}</h3>
              <ul className="horse-grid">
                {group.horses.map((horse) => (
                  <li className="horse-card" key={horse.name}>
                    <Photo photo={horse.photo} className="photo-cover" />
                    <div>
                      <h4>{horse.name}</h4>
                      <p>{horse.born}</p>
                      <dl>
                        <div>
                          <dt>M:</dt>
                          <dd>{horse.dam}</dd>
                        </div>
                        <div>
                          <dt>V:</dt>
                          <dd>{getStallionName(horse.sireId)}</dd>
                        </div>
                      </dl>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section id="anguszucht" className="farm-section" tabIndex={-1}>
        <div className="section-wrap two-column farm-columns">
          <div>
            <p className="eyebrow">Deutsch Angus</p>
            <h2>
              Angus<em>zucht.</em>
            </h2>
            {angusText.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="stacked-photos">
            <Photo photo={photos.angusHerde} />
            <Photo photo={photos.angusBlockhaus} />
          </div>
        </div>
      </section>

      <section
        id="rindfleisch"
        className="farm-section farm-section-tinted"
        tabIndex={-1}
      >
        <div className="section-wrap two-column farm-columns">
          <div>
            <p className="eyebrow">Rindfleisch bestellen</p>
            <h2>
              Rindfleisch aus eigener <em>Anguszucht.</em>
            </h2>
            <p className="farm-lead">
              <strong>Rindfleisch nur auf Vorbestellung!</strong>
              <br />
              Bestellung unter{' '}
              <a href={phoneHref(beefOrderPhone)}>{beefOrderPhone}</a>
            </p>
            <ul className="fact-cards fact-cards-compact">
              {beefOffers.map((offer) => (
                <li key={offer.title}>
                  <h3>{offer.title}</h3>
                  <p>{offer.price}</p>
                  <p>({offer.detail})</p>
                </li>
              ))}
            </ul>
          </div>
          <figure className="framed-photo">
            <Photo photo={photos.pusteblume} />
          </figure>
        </div>
      </section>
    </>
  );
}
