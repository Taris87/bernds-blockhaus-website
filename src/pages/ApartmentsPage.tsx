import { usePageMeta } from '../hooks/usePageMeta';
import {
  apartments,
  apartmentsIntro,
  horseHolidayText,
  surroundingsText,
} from '../data/apartments';
import { photos } from '../data/photos';
import { ApartmentInquiryForm } from '../components/forms/ApartmentInquiryForm';
import { PageIntro } from './PageIntro';
import { Photo } from '../components/ui/Photo';

export function ApartmentsPage() {
  usePageMeta(
    'Ferienwohnungen',
    'Zwei rustikale Ferienwohnungen im Blockhaus in Weilerbach: Große Ferienwohnung (Süd, 60 qm) und Kleine Ferienwohnung (Nord, 30 qm) mit Preisen und Ausstattung.',
  );
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
      />
      <section className="content-section section-wrap">
        <div className="apartment-grid">
          {apartments.map((apartment) => (
            <article
              className="apartment-card"
              key={apartment.id}
              aria-labelledby={`fewo-${apartment.id}`}
            >
              <div className="apartment-photo">
                <Photo photo={apartment.photo} className="photo-cover" />
              </div>
              <div className="apartment-body">
                <h3 id={`fewo-${apartment.id}`}>{apartment.name}</h3>
                <p className="apartment-facts">
                  {apartment.size} · {apartment.beds}
                </p>
                <h4>Ausstattung</h4>
                <ul>
                  {apartment.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
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
                <div className="apartment-thumbs">
                  {apartment.gallery.map((photo) => (
                    <Photo
                      key={photo.src}
                      photo={photo}
                      className="photo-cover"
                    />
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="content-section section-wrap two-column">
        <div>
          <p className="eyebrow">Urlaub mit Pferd</p>
          <h2>
            Mit Ihren <em>Pferden.</em>
          </h2>
          {horseHolidayText.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        <figure className="framed-photo">
          <Photo photo={photos.islaenderZaun} />
        </figure>
      </section>
      <section className="content-section section-wrap two-column">
        <figure className="framed-photo">
          <Photo photo={photos.mohnblumen} />
        </figure>
        <div>
          <p className="eyebrow">Umgebung</p>
          <h2>
            Weilerbach &amp; <em>Pfälzer Bergland.</em>
          </h2>
          {surroundingsText.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>
      <ApartmentInquiryForm />
    </>
  );
}
