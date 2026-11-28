import { useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import {
  apartments,
  apartmentsIntro,
  horseHolidayText,
  surroundingsText,
} from '../data/apartments';
import { photos } from '../data/photos';
import { galleryTitle } from '../data/gallery';
import { microTexts } from '../data/site';
import type { Apartment } from '../types/content';
import { ApartmentInquiryForm } from '../components/forms/ApartmentInquiryForm';
import { Lightbox, type LightboxItem } from '../components/gallery/Lightbox';
import { PageIntro } from './PageIntro';
import { Photo } from '../components/ui/Photo';
import { PhotoPrint } from '../components/ui/PhotoPrint';
import { Counters } from '../components/ui/Counters';
import { IndexRow } from '../components/ui/IndexRow';
import { ImageStrip } from '../components/ui/ImageStrip';
import { OakLeaf } from '../components/ui/Ornaments';
import { Sign } from '../components/ui/Sign';

/** Facts named in `apartmentsIntro`, shown as signposts. */
const introFacts = ['Sehr ruhige Lage', 'Weitblick', 'Wanderreiterstation', 'Radweganbindung'];

const surroundings = [
  { photo: photos.mohnblumen, title: 'Mohnblumen' },
  { photo: photos.blockhausWeitblick, title: 'Weitblick' },
  { photo: photos.pusteblume, title: 'Pusteblume' },
  { photo: photos.blockhausGetreide, title: 'Zwischen den Feldern' },
];

/** “60 qm” → value “60”, label “qm”. */
function splitSize(size: string) {
  const match = /^(\S+)\s+(.+)$/.exec(size);
  return match ? { value: match[1] ?? size, label: match[2] ?? '' } : { value: size, label: '' };
}

function lightboxItems(apartment: Apartment): LightboxItem[] {
  return apartment.gallery.map((photo) => ({
    id: photo.src,
    title: photo.alt,
    label: apartment.name,
    photo,
  }));
}

interface ApartmentSectionProps {
  apartment: Apartment;
  mirrored: boolean;
  onInquire: (id: string) => void;
  onOpenPhoto: (apartment: Apartment, index: number) => void;
}

function ApartmentSection({ apartment, mirrored, onInquire, onOpenPhoto }: ApartmentSectionProps) {
  const size = splitSize(apartment.size);
  const titleId = `fewo-${apartment.id}`;
  return (
    <article className={`apartment${mirrored ? ' apartment-mirrored' : ''}`} aria-labelledby={titleId}>
      <div className="apartment-media">
        <PhotoPrint photo={apartment.photo} tilt={mirrored ? 1.5 : -1.5} className="apartment-main" />
        <div className="contact-sheet">
          {apartment.gallery.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              className="contact-sheet-thumb"
              aria-label={`${photo.alt} – vergrößern`}
              onClick={() => onOpenPhoto(apartment, index)}
            >
              <Photo photo={photo} />
            </button>
          ))}
        </div>
      </div>
      <div className="apartment-body">
        <h3 id={titleId} className="apartment-title" data-reveal="text">
          {apartment.name}
        </h3>
        <div className="apartment-facts">
          <Counters items={[{ value: size.value, label: size.label }]} />
          <p className="apartment-beds">{apartment.beds}</p>
        </div>
        <h4>Ausstattung</h4>
        <ul className="leaf-list">
          {apartment.features.map((feature) => (
            <li key={feature}>
              <OakLeaf />
              {feature}
            </li>
          ))}
        </ul>
        <div className="price-board">
          <h4>Preise pro Nacht</h4>
          <dl className="apartment-prices">
            {apartment.prices.map((price) => (
              <div key={price.label}>
                <dt>{price.label}</dt>
                <dd>{price.amount}</dd>
              </div>
            ))}
          </dl>
          <p className="apartment-price-note">{apartment.priceNote}</p>
        </div>
        <button type="button" className="button button-primary" onClick={() => onInquire(apartment.id)}>
          {microTexts.inquiryForApartment} <span aria-hidden="true">→</span>
        </button>
      </div>
    </article>
  );
}

export function ApartmentsPage() {
  usePageMeta(
    'Ferienwohnungen',
    'Zwei rustikale Ferienwohnungen im Blockhaus in Weilerbach: Große Ferienwohnung (Süd, 60 qm) und Kleine Ferienwohnung (Nord, 30 qm) mit Preisen und Ausstattung.',
  );
  const [selectedApartment, setSelectedApartment] = useState('');
  const [viewer, setViewer] = useState<{ items: LightboxItem[]; index: number } | null>(null);

  function inquire(id: string) {
    setSelectedApartment(id);
    const form = document.getElementById('anfrage');
    form?.scrollIntoView({ block: 'start' });
    form?.querySelector<HTMLSelectElement>('select[name="apartment"]')?.focus({ preventScroll: true });
  }

  return (
    <>
      <PageIntro
        eyebrow="Übernachten"
        title={
          <>
            Zeit zum
            <br />
            <em>Durchatmen.</em>
          </>
        }
        copy={apartmentsIntro}
      >
        <p className="fact-signs">
          {introFacts.map((fact) => (
            <Sign key={fact}>{fact}</Sign>
          ))}
        </p>
      </PageIntro>

      <section className="section apartments-section" aria-labelledby="fewo-uebersicht">
        <h2 id="fewo-uebersicht" className="sr-only">
          Unsere Ferienwohnungen
        </h2>
        <div className="wrap apartment-list">
          {apartments.map((apartment, index) => (
            <ApartmentSection
              key={apartment.id}
              apartment={apartment}
              mirrored={index % 2 === 1}
              onInquire={inquire}
              onOpenPhoto={(entry, photoIndex) => setViewer({ items: lightboxItems(entry), index: photoIndex })}
            />
          ))}
        </div>
      </section>

      <section className="section horses-section">
        <div className="wrap">
          <p className="label">Urlaub mit Pferd</p>
          <IndexRow
            level={2}
            titleId="mit-pferden"
            title={
              <>
                Mit Ihren <em>Pferden.</em>
              </>
            }
            photos={[
              { photo: photos.islaenderZaun, caption: galleryTitle(photos.islaenderZaun) },
              { photo: photos.islaenderWiese, caption: 'Löwenzahnwiese' },
            ]}
          >
            {horseHolidayText.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </IndexRow>
        </div>
      </section>

      <section className="section surroundings-section" aria-labelledby="umgebung">
        <div className="wrap">
          <p className="label">Umgebung</p>
          <h2 id="umgebung" className="section-title" data-reveal="text">
            Weilerbach &amp; <em>Pfälzer Bergland.</em>
          </h2>
        </div>
        <ImageStrip items={surroundings} labelledBy="umgebung" size="small" />
        <div className="wrap text-columns">
          {surroundingsText.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <ApartmentInquiryForm apartment={selectedApartment} onApartmentChange={setSelectedApartment} />

      {viewer && (
        <Lightbox
          items={viewer.items}
          index={viewer.index}
          onSelect={(index) => setViewer((current) => (current ? { ...current, index } : current))}
          onClose={() => setViewer(null)}
          onPrevious={() =>
            setViewer((current) =>
              current ? { ...current, index: (current.index + current.items.length - 1) % current.items.length } : current,
            )
          }
          onNext={() =>
            setViewer((current) => (current ? { ...current, index: (current.index + 1) % current.items.length } : current))
          }
        />
      )}
    </>
  );
}
