import { usePageMeta } from '../hooks/usePageMeta';
import { menuCategories } from '../data/menu';
import { gastronomyText, site } from '../data/site';
import { photos } from '../data/photos';
import { galleryTitle } from '../data/gallery';
import { getContact, phoneHref } from '../data/contacts';
import { PageIntro } from './PageIntro';
import { MenuTabs } from '../components/menu/MenuTabs';
import { Collage } from '../components/ui/Collage';
import { PhotoPrint } from '../components/ui/PhotoPrint';
import { ImageStrip } from '../components/ui/ImageStrip';
import { OpeningHoursBoard } from '../components/ui/OpeningHoursBoard';
import { OakLeaf } from '../components/ui/Ornaments';
import { CelebrationSection } from '../components/sections/CelebrationSection';

const dishes = [
  photos.gerichtHausmacher,
  photos.gerichtSchnitzel,
  photos.gerichtJaegerschnitzel,
  photos.gerichtRahmschnitzel,
  photos.gerichtSteak,
  photos.gerichtBratwurstKraut,
  photos.gerichtBratwurstPommes,
  photos.gerichtLeberknoedel,
  photos.gerichtWildschweinbratwurst,
  photos.gerichtRinderbraten,
  photos.gerichtRindfleisch,
  photos.gerichtBraten,
  photos.gerichtWurstsalat,
  photos.gerichtSalatPute,
  photos.gerichtSalatKroketten,
].map((photo) => ({ photo, title: galleryTitle(photo) }));

/** One matching dish photo per menu category (desktop only). */
const menuPhotos = {
  platten: photos.gerichtHausmacher,
  salatvariationen: photos.gerichtSalatPute,
  'pfaelzer-gerichte': photos.gerichtLeberknoedel,
  'schnitzel-steaks': photos.gerichtSchnitzel,
};

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
        aside={
          <Collage preset="hero">
            <PhotoPrint photo={photos.blockhausLavendel} caption="Das Blockhaus" slot="slot-a" tilt={-2} tape eager />
            <PhotoPrint photo={photos.gerichtHausmacher} caption="Hausmacher Platte" slot="slot-b" tilt={4} />
            <PhotoPrint photo={photos.blockhausTerrasse} caption="Die Terrasse" slot="slot-c" tilt={-4} />
          </Collage>
        }
      >
        <OpeningHoursBoard level={2} />
        <p className="intro-phone">
          Telefon: <a href={phoneHref(contact.phone)}>{contact.phone}</a>
        </p>
      </PageIntro>

      <section id="speisekarte" className="section menu-section" aria-labelledby="speisekarte-titel" tabIndex={-1}>
        <div className="wrap">
          <p className="label">Aus unserer Küche</p>
          <h2 id="speisekarte-titel" className="section-title" data-reveal="text">
            Die <em>Speisekarte.</em>
          </h2>
        </div>
        <ImageStrip items={dishes} labelledBy="speisekarte-titel" size="small" />
        <div className="wrap">
          <MenuTabs categories={menuCategories} photos={menuPhotos} />
          <p className="placeholder-note">[PLATZHALTER: Preise, Allergene und Zusatzstoffe]</p>
        </div>
      </section>

      <CelebrationSection variant="full" />

      <section className="section welcome-section" aria-labelledby="willkommen">
        <div className="wrap welcome-column">
          <OakLeaf className="divider-leaf" />
          <h2 id="willkommen" data-reveal="text">
            Herzlich <em>willkommen.</em>
          </h2>
          <p>{site.heroDescription}</p>
          <p>{gastronomyText.celebrations}</p>
        </div>
      </section>
    </>
  );
}
