import { getContact, phoneHref } from '../../data/contacts';
import { photos } from '../../data/photos';
import { gastronomyText } from '../../data/site';
import { Collage } from '../ui/Collage';
import { Counters } from '../ui/Counters';
import { PhotoPrint } from '../ui/PhotoPrint';
import { Sign } from '../ui/Sign';

interface Props {
  /** Short merged text (home) or all original sentences (Gaststätte). */
  variant: 'short' | 'full';
}

/** “Feste im Blockhaus” – print + numbers (pattern M4). */
export function CelebrationSection({ variant }: Props) {
  const contact = getContact('blockhaus');
  return (
    <section className="celebration" aria-labelledby="feiern">
      <div className="wrap celebration-grid">
        <Collage preset="duo">
          <PhotoPrint photo={photos.festtafel} caption="Festtafel im Gastraum" slot="slot-a" tilt={-2.5} tape />
          <PhotoPrint photo={photos.gerichtBraten} caption="Braten mit Knödel" slot="slot-b" tilt={4} />
        </Collage>
        <div className="celebration-copy">
          <Sign variant="raps">Feiern &amp; Reservierung</Sign>
          <h2 id="feiern" data-reveal="text">
            Feste im <em>Blockhaus.</em>
          </h2>
          <Counters items={gastronomyText.seats} />
          {variant === 'short' ? (
            <p>{gastronomyText.eventsShort}</p>
          ) : (
            gastronomyText.events.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
          )}
          <a className="button button-primary" href={phoneHref(contact.phone)}>
            Reservieren: {contact.phone} <span aria-hidden="true">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
