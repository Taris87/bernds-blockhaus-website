import { Link } from 'react-router';
import { usePageMeta } from '../hooks/usePageMeta';
import { gastronomyText, site } from '../data/site';
import { photos } from '../data/photos';
import { eichwieserhofSummary } from '../data/eichwieserhof';
import { apartmentsTeaser } from '../data/apartments';
import { Photo } from '../components/ui/Photo';

const pillars = [
  {
    title: 'Gaststätte',
    text: gastronomyText.kitchen,
    to: '/gaststaette',
    photo: photos.blockhausLavendel,
  },
  {
    title: 'Ferienwohnungen',
    text: apartmentsTeaser,
    to: '/ferienwohnungen',
    photo: photos.fewoGrossSchlafzimmer,
  },
  {
    title: 'Eichwieserhof',
    text: eichwieserhofSummary,
    to: '/eichwieserhof',
    photo: photos.islaenderWiese,
  },
];

export function HomePage() {
  usePageMeta(
    'Startseite',
    'Bernd’s Blockhaus in Weilerbach: Gaststätte mit Pfälzer Küche, zwei Ferienwohnungen und der Eichwieserhof mit Islandpferden und Anguszucht.',
  );
  return (
    <>
      <section className="hero">
        <div className="hero-image" aria-hidden="true" />
        <div className="hero-shade" />
        <figure className="hero-photo">
          <Photo photo={photos.blockhausRosen} />
        </figure>
        <div className="hero-content">
          <p className="eyebrow">{site.heroEyebrow}</p>
          <h1>{site.heroTitle}</h1>
          <p>{site.heroDescription}</p>
          <Link className="button button-light" to="/kontakt">
            Kontakt aufnehmen <span>↗</span>
          </Link>
        </div>
        <span className="hero-index">01 / BERND’S BLOCKHAUS</span>
      </section>
      <section className="intro-section section-wrap">
        <div>
          <p className="eyebrow">Willkommen</p>
          <h2>
            Ein Platz zum Bleiben.
            <br />
            <em>Ein Moment zum Genießen.</em>
          </h2>
        </div>
        <p className="intro-copy">{gastronomyText.celebrations}</p>
      </section>
      <section className="pillars-section">
        <div className="section-wrap">
          <div className="section-heading">
            <p className="eyebrow">Entdecken</p>
            <h2>
              Drei Seiten eines
              <br />
              <em>besonderen Ortes.</em>
            </h2>
          </div>
          <div className="pillar-grid">
            {pillars.map((pillar) => (
              <article className="pillar-card" key={pillar.to}>
                <div className="pillar-image">
                  <Photo photo={pillar.photo} className="photo-cover" />
                </div>
                <div className="pillar-copy">
                  <h3>{pillar.title}</h3>
                  <p>{pillar.text}</p>
                  <Link to={pillar.to}>Mehr erfahren ↗</Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="quote-section">
        <p className="eyebrow">Bernd’s Blockhaus</p>
        <blockquote>
          „Ein Platz zum Bleiben.
          <br />
          <em>Ein Moment zum Genießen.“</em>
        </blockquote>
        <Link to="/galerie" className="text-link">
          Eindrücke sammeln ↗
        </Link>
      </section>
    </>
  );
}
