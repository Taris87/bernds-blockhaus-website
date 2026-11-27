import { usePageMeta } from '../hooks/usePageMeta';
import { menuCategories } from '../data/menu';
import { gastronomyText, site } from '../data/site';
import { photos } from '../data/photos';
import { getContact, phoneHref } from '../data/contacts';
import { PageIntro } from './PageIntro';
import { Photo } from '../components/ui/Photo';
import { MenuTabs } from '../components/menu/MenuTabs';
import { OpeningHours } from '../components/contact/OpeningHours';

const menuPhotos = [
  photos.gerichtHausmacher,
  photos.gerichtSchnitzel,
  photos.gerichtBraten,
];

export function GastronomyPage() {
  usePageMeta(
    'Gaststätte & Speisekarte',
    'Bernd’s Blockhaus, Rad-, Reit- und Wanderhütte in Weilerbach: Pfälzer Küche, Öffnungszeiten, Feiern bis 60 Personen und die Speisekarte.',
  );
  const contact = getContact('blockhaus');
  return (
    <>
      <PageIntro
        eyebrow="Gaststätte · Rad-, Reit- und Wanderhütte"
        title={
          <>
            Genuss in
            <br />
            <em>besonderer Atmosphäre.</em>
          </>
        }
        copy={gastronomyText.kitchen}
      />
      <section className="content-section section-wrap two-column">
        <div>
          <h2>
            Herzlich <em>willkommen.</em>
          </h2>
          <p>{site.heroDescription}</p>
          <p>{gastronomyText.celebrations}</p>
        </div>
        <figure className="framed-photo">
          <Photo photo={photos.blockhausTerrasse} />
        </figure>
      </section>
      <section className="info-band" aria-labelledby="oeffnungszeiten">
        <div className="section-wrap info-band-grid">
          <div>
            <p className="eyebrow">Wann wir für Sie da sind</p>
            <h2 id="oeffnungszeiten">
              Öffnungs<em>zeiten.</em>
            </h2>
          </div>
          <div>
            <OpeningHours />
            <p className="info-band-contact">
              Telefon: <a href={phoneHref(contact.phone)}>{contact.phone}</a>
            </p>
          </div>
        </div>
      </section>
      <section
        className="content-section section-wrap two-column"
        aria-labelledby="feiern"
      >
        <figure className="framed-photo">
          <Photo photo={photos.festtafel} />
        </figure>
        <div>
          <p className="eyebrow">Feiern &amp; Reservierung</p>
          <h2 id="feiern">
            Feste im <em>Blockhaus.</em>
          </h2>
          {gastronomyText.events.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <a className="button button-primary" href={phoneHref(contact.phone)}>
            Reservieren: {contact.phone} <span>↗</span>
          </a>
        </div>
      </section>
      <section className="menu-section">
        <div className="section-wrap">
          <p className="eyebrow">Aus unserer Küche</p>
          <h2>
            Die <em>Speisekarte.</em>
          </h2>
          <MenuTabs categories={menuCategories} />
          <p className="placeholder-note">
            [PLATZHALTER: Preise, Allergene und Zusatzstoffe]
          </p>
          <div className="menu-photos">
            {menuPhotos.map((photo) => (
              <Photo key={photo.src} photo={photo} className="photo-cover" />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
