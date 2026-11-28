import { useEffect, useRef } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { useSectionSpy } from '../motion/useSectionSpy';
import { PageIntro } from './PageIntro';
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
import { Collage } from '../components/ui/Collage';
import { PhotoPrint } from '../components/ui/PhotoPrint';
import { PanoramaBand } from '../components/ui/PanoramaBand';
import { OakLeaf } from '../components/ui/Ornaments';
import { Sign } from '../components/ui/Sign';

const sections = [
  { id: 'islandpferde', label: 'Islandpferde' },
  { id: 'deckhengste', label: 'Deckhengste' },
  { id: 'verkaufspferde', label: 'Verkaufspferde' },
  { id: 'anguszucht', label: 'Anguszucht' },
  { id: 'rindfleisch', label: 'Rindfleisch bestellen' },
];

const saleTilts = [-2, 1.5, -1, 2, -1.5, 1];
const sectionIds = sections.map((section) => section.id);

export function EichwieserhofPage() {
  usePageMeta(
    'Eichwieserhof',
    'Eichwieserhof in Weilerbach: Islandpferdezucht „Isländer vom Eichwieserhof“, Deckhengste, Verkaufspferde, Anguszucht und Rindfleisch auf Vorbestellung.',
  );
  const horseContact = getContact('islandpferde');
  const activeSection = useSectionSpy(sectionIds);
  const signsRef = useRef<HTMLDivElement>(null);

  // Mobile: keep the active sign visible inside the horizontally scrolling bar
  // (scrolls the bar only, never the page).
  useEffect(() => {
    const bar = signsRef.current;
    const sign = activeSection ? bar?.querySelector<HTMLElement>(`[data-section-link="${activeSection}"]`) : null;
    if (!bar || !sign || bar.scrollWidth <= bar.clientWidth) return;
    const offset = sign.getBoundingClientRect().left - bar.getBoundingClientRect().left;
    bar.scrollLeft += offset - (bar.clientWidth - sign.offsetWidth) / 2;
  }, [activeSection]);

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
        aside={<PhotoPrint photo={photos.eichwieserhof} caption="Eichwieserhof" tilt={2} tape eager />}
      >
        <p className="placeholder-note">[PLATZHALTER: Hofgeschichte und Besuchsmöglichkeiten]</p>
      </PageIntro>

      <nav className="section-signs" aria-label="Abschnitte dieser Seite" data-section-nav>
        <div className="wrap section-signs-inner" ref={signsRef}>
          {sections.map((section) => (
            <a
              key={section.id}
              className="section-sign"
              href={`#${section.id}`}
              data-section-link={section.id}
              aria-current={activeSection === section.id ? 'true' : undefined}
            >
              {section.label}
            </a>
          ))}
        </div>
      </nav>

      <section id="islandpferde" className="section farm-section" aria-labelledby="islandpferde-titel" tabIndex={-1}>
        <div className="wrap farm-split">
          <div>
            <p className="label">Islandpferdezucht</p>
            <h2 id="islandpferde-titel" className="section-title" data-reveal="text">
              Isländer vom <em>Eichwieserhof.</em>
            </h2>
            <div className="business-card" data-reveal="pin">
              <p className="business-card-name">{horseContact.name}</p>
              <p>{horseContact.responsibility}</p>
              <p>
                <a href={`mailto:${horseContact.email}`}>{horseContact.email}</a>
              </p>
              <p>
                <a href={phoneHref(horseContact.phone)}>{horseContact.phone}</a>
              </p>
            </div>
          </div>
          <Collage preset="hero">
            <PhotoPrint photo={photos.islaenderWiese} caption="Löwenzahnwiese" slot="slot-a" tilt={-2} tape />
            <PhotoPrint photo={photos.islaenderAuge} caption="Nahaufnahme" slot="slot-b" tilt={4} />
            <PhotoPrint photo={photos.islaenderSonnenblumenfeld} caption="Im Sonnenblumenfeld" slot="slot-c" tilt={-5} />
            <PhotoPrint photo={photos.islaenderSonnenblume} caption="Isländer" slot="slot-d" tilt={3} />
          </Collage>
        </div>
      </section>

      <section id="deckhengste" className="section farm-section farm-section-tinted" aria-labelledby="deckhengste-titel" tabIndex={-1}>
        <div className="wrap">
          <p className="label">Väter unserer Isländer</p>
          <h2 id="deckhengste-titel" className="section-title" data-reveal="text">
            Deck<em>hengste.</em>
          </h2>
          <ol className="stallion-list">
            {stallions.map((stallion, index) => (
              <li key={stallion.id} className="stallion">
                <span className="index-number" aria-hidden="true">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <h3>{stallion.name}</h3>
                <p className="stallion-born">
                  <span className="sr-only">geboren </span>
                  <span aria-hidden="true">* </span>
                  {stallion.born}
                </p>
                <div className="stallion-details">
                  {stallion.details && <p>{stallion.details}</p>}
                  {stallion.stud && <p>{stallion.stud}</p>}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="verkaufspferde" className="section farm-section" aria-labelledby="verkaufspferde-titel" tabIndex={-1}>
        <div className="wrap">
          <div className="sale-head">
            <div>
              <p className="label">Vom Eichwieserhof</p>
              <h2 id="verkaufspferde-titel" className="section-title" data-reveal="text">
                Verkaufs<em>pferde.</em>
              </h2>
            </div>
            <p className="as-of stamp-label">{saleHorsesAsOf}</p>
          </div>
          <p className="note-board">
            Bitte beachten Sie, dass all unsere Verkaufspferde <strong>nicht</strong> eingeritten sind!
          </p>
          {saleHorseGroups.map((group, groupIndex) => (
            <div className="horse-group" key={group.id}>
              <h3 className="horse-group-title">{group.title}</h3>
              <ul className="horse-grid">
                {group.horses.map((horse, horseIndex) => {
                  const tilt = saleTilts[(groupIndex + horseIndex) % saleTilts.length] ?? 0;
                  return (
                    <li className="horse-card" key={horse.name}>
                      <PhotoPrint photo={horse.photo} tilt={tilt} />
                      <h4 className="horse-name">{horse.name}</h4>
                      <p className="horse-born">{horse.born}</p>
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
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <PanoramaBand
        id="anguszucht"
        labelledBy="anguszucht-titel"
        layout="stacked"
        panorama={{ photo: photos.angusHerde, caption: 'Angus-Herde' }}
        prints={[{ photo: photos.angusBlockhaus, caption: 'Angus-Rinder vor dem Blockhaus' }]}
      >
        <Sign variant="raps">Deutsch Angus</Sign>
        <h2 id="anguszucht-titel" data-reveal="text">
          Angus<em>zucht.</em>
        </h2>
        <div className="text-columns">
          {angusText.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </PanoramaBand>

      <section id="rindfleisch" className="section farm-section" aria-labelledby="rindfleisch-titel" tabIndex={-1}>
        <div className="wrap farm-split farm-split-reversed">
          <div className="farm-board">
            <p className="label label-raps">Rindfleisch bestellen</p>
            <h2 id="rindfleisch-titel" data-reveal="text">
              Rindfleisch aus eigener <em>Anguszucht.</em>
            </h2>
            <p className="farm-board-lead">
              <strong>Rindfleisch nur auf Vorbestellung!</strong>
            </p>
            <ul className="offer-list">
              {beefOffers.map((offer) => (
                <li key={offer.title}>
                  <h3>{offer.title}</h3>
                  <p className="offer-price">{offer.price}</p>
                  <p>({offer.detail})</p>
                </li>
              ))}
            </ul>
            <p className="farm-board-order">
              <span>Bestellung unter</span>
              <a className="button button-light" href={phoneHref(beefOrderPhone)}>
                {beefOrderPhone}
              </a>
            </p>
            <OakLeaf className="farm-board-leaf" />
          </div>
          <PhotoPrint photo={photos.pusteblume} caption="Pusteblume" tilt={3} className="farm-print" />
        </div>
      </section>
    </>
  );
}
