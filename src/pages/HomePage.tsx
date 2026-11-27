import { Link } from 'react-router';
import { usePageMeta } from '../hooks/usePageMeta';
import { gastronomyText, marqueeFacts, microTexts, site } from '../data/site';
import { photos } from '../data/photos';
import { eichwieserhofSummary } from '../data/eichwieserhof';
import { apartmentsTeaser } from '../data/apartments';
import { galleryItems, galleryTitle } from '../data/gallery';
import { Collage, Stamp } from '../components/ui/Collage';
import { PhotoPrint } from '../components/ui/PhotoPrint';
import { Sign } from '../components/ui/Sign';
import { Marquee } from '../components/ui/Marquee';
import { IndexRow } from '../components/ui/IndexRow';
import { ImageStrip } from '../components/ui/ImageStrip';
import { PanoramaBand } from '../components/ui/PanoramaBand';
import { OpeningHoursBoard } from '../components/ui/OpeningHoursBoard';
import { CelebrationSection } from '../components/sections/CelebrationSection';

const stripPhotos = [
  photos.blockhausTeichSommer,
  photos.blockhausTeichSchilf,
  photos.blockhausAbendlicht,
  photos.blockhausGetreide,
  photos.blockhausWinterNah,
  photos.festtafel,
  photos.blockhausWinterFern,
  photos.blockhausWeitblick,
].map((photo) => ({ photo, title: galleryTitle(photo) }));

/** Hero title “Ankommen. Wohlfühlen. Genießen.” as one line per word; last word accented. */
function HeroTitle({ text }: { text: string }) {
  const words = text.split(/\s+/);
  return (
    <h1 className="hero-title" data-reveal="text">
      {words.map((word, index) => (
        <span className="hero-title-line" key={word}>
          {index === words.length - 1 ? <em>{word}</em> : word}
          {index < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </h1>
  );
}

export function HomePage() {
  usePageMeta(
    'Startseite',
    'Bernd’s Blockhaus in Weilerbach: Gaststätte mit Pfälzer Küche, zwei Ferienwohnungen und der Eichwieserhof mit Islandpferden und Anguszucht.',
  );
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div className="hero-head">
            <Sign>{microTexts.heroLabel}</Sign>
            <p className="hero-eyebrow" data-reveal="fade">
              {site.heroEyebrow}
            </p>
            <HeroTitle text={site.heroTitle} />
          </div>
          <Collage preset="hero" panel className="hero-collage">
            <PhotoPrint photo={photos.blockhausRosen} caption="Rosen und Lavendel" slot="slot-a" tilt={-2} tape eager />
            <PhotoPrint photo={photos.gerichtHausmacher} caption="Hausmacher Platte" slot="slot-b" tilt={4} eager />
            <PhotoPrint photo={photos.blockhausWegweiser} caption="Der Wegweiser" slot="slot-c" tilt={-5} />
            <PhotoPrint photo={photos.islaenderSonnenblume} caption="Isländer" slot="slot-d" tilt={3} />
            <Stamp value={microTexts.stampValue} label={microTexts.stampLabel} />
          </Collage>
          <div className="hero-body">
            <p className="lead" data-reveal="fade">
              {site.heroDescription}
            </p>
            <div className="button-row" data-reveal="fade">
              <Link className="button button-primary" to="/kontakt">
                Kontakt aufnehmen <span aria-hidden="true">→</span>
              </Link>
              <Link className="button button-ghost" to="/gaststaette#speisekarte">
                {microTexts.toMenu}
              </Link>
            </div>
            <OpeningHoursBoard level={2} />
          </div>
        </div>
      </section>

      <Marquee items={marqueeFacts} pauseLabel={microTexts.pauseTicker} />

      <section className="section index-section" aria-labelledby="drei-seiten">
        <div className="wrap">
          <p className="label">Entdecken</p>
          <h2 id="drei-seiten" className="section-title" data-reveal="text">
            Drei Seiten eines
            <br />
            <em>besonderen Ortes.</em>
          </h2>
          <div className="index-list">
            <IndexRow
              number="01"
              title="Gaststätte"
              link={{ to: '/gaststaette', label: 'Zur Gaststätte' }}
              photos={[
                { photo: photos.blockhausTerrasse, caption: 'Die Terrasse' },
                { photo: photos.gerichtSchnitzel, caption: 'Schnitzel mit Pommes' },
              ]}
            >
              <p>{gastronomyText.kitchen}</p>
            </IndexRow>
            <IndexRow
              number="02"
              title={<>Ferien&shy;wohnungen</>}
              link={{ to: '/ferienwohnungen', label: 'Zu den Ferienwohnungen' }}
              photos={[
                { photo: photos.fewoGrossSchlafzimmer, caption: 'Schlafzimmer (Süd)' },
                { photo: photos.fewoKleinBalkon, caption: 'Balkon (Nord)' },
              ]}
              mirrored
            >
              <p>{apartmentsTeaser}</p>
            </IndexRow>
            <IndexRow
              number="03"
              title="Eichwieserhof"
              link={{ to: '/eichwieserhof', label: 'Zum Eichwieserhof' }}
              photos={[
                { photo: photos.islaenderWiese, caption: 'Löwenzahnwiese' },
                { photo: photos.angusBlockhaus, caption: 'Angus-Rinder' },
              ]}
            >
              <p>{eichwieserhofSummary}</p>
            </IndexRow>
          </div>
        </div>
      </section>

      <section className="section strip-section" aria-labelledby="geschichten">
        <div className="wrap">
          <p className="label">Galerie</p>
          <h2 id="geschichten" className="section-title" data-reveal="text">
            Ein Ort voller
            <br />
            <em>Geschichten.</em>
          </h2>
        </div>
        <ImageStrip
          items={stripPhotos}
          labelledBy="geschichten"
          action={
            <Sign to="/galerie">
              Alle {galleryItems.length} Fotos
            </Sign>
          }
        />
      </section>

      <CelebrationSection variant="short" />

      <PanoramaBand
        labelledBy="hof-teaser"
        panorama={{ photo: photos.angusHerde, caption: 'Angus-Herde' }}
        prints={[
          { photo: photos.islaenderSonnenblumenfeld, caption: 'Im Sonnenblumenfeld' },
          { photo: photos.islaenderAuge, caption: 'Nahaufnahme' },
        ]}
      >
        <Sign variant="raps">Leben auf dem Hof</Sign>
        <h2 id="hof-teaser" data-reveal="text">
          Isländer vom <em>Eichwieserhof.</em>
        </h2>
        <p>{eichwieserhofSummary}</p>
        <div className="sign-stack">
          <Sign variant="ivory" to="/eichwieserhof#deckhengste">
            Deckhengste
          </Sign>
          <Sign variant="ivory" to="/eichwieserhof#verkaufspferde">
            Verkaufspferde
          </Sign>
          <Sign variant="ivory" to="/eichwieserhof#rindfleisch">
            Rindfleisch bestellen
          </Sign>
        </div>
      </PanoramaBand>
    </>
  );
}
