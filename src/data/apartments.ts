import type { Apartment } from '../types/content';
import { photos } from './photos';

export const apartmentsTeaser =
  'In unserem allein stehenden Blockhaus stehen Ihnen zwei rustikale Ferienwohnungen zur Verfügung.';

export const apartmentsIntro = `${apartmentsTeaser} In sehr ruhiger Lage (Ortsrand), mit herrlichem Weitblick, Wochenendgastronomie, Wanderreiterstation und Radweganbindung.`;

export const horseHolidayText = [
  'Auf Anfrage können Sie auch gerne mit Ihren Pferden bei uns Urlaub machen.',
  'Dafür stehen Ihnen Koppeln oder Boxen rund ums Haus zur Verfügung.',
];

export const surroundingsText = [
  'Unternehmungslustige und Gäste mit sportlichen Ambitionen finden in Weilerbach ein vielfältiges Angebot: Kegeln, Tennis, Squash, Fitness-Center, Waldschwimmbad mit Minigolfanlage.',
  'Aber besonders die Naturliebhaber kommen hier auf ihre Kosten: Die Landschaft des Pfälzer Berglandes bietet Natur pur – ein Paradies für Wanderer und Radfahrer.',
];

export const apartments: Apartment[] = [
  {
    id: 'gross-sued',
    name: 'Große Ferienwohnung (Süd)',
    size: '60 qm',
    beds: 'bis zu 5 Betten',
    features: [
      'Schlafzimmer mit Doppel- & Beistellbett',
      'Etagenbett in Flurnische',
      'Komplett ausgestattete Küche mit Wohn- & Essbereich',
      'Dusche / WC / Fön',
      'Balkon',
      'Bettwäsche, Hand- & Geschirrtücher werden gestellt',
      'Sat-TV, DVD-Player, Radio',
      'Nichtraucherwohnung',
    ],
    prices: [
      { label: '1–2 Personen', amount: '85,- € pro Nacht' },
      { label: 'Jede weitere Person', amount: '15,- € pro Nacht' },
    ],
    priceNote: 'ab Buchung von 3 Tagen',
    photo: photos.fewoGrossWohnzimmer,
    gallery: [
      photos.fewoGrossSchlafzimmer,
      photos.fewoGrossKueche,
      photos.fewoGrossEtagenbett,
      photos.fewoGrossWohnbereich,
    ],
  },
  {
    id: 'klein-nord',
    name: 'Kleine Ferienwohnung (Nord)',
    size: '30 qm',
    beds: 'bis zu 2 Betten',
    features: [
      'Wohnraum mit zwei Einzelbetten',
      'Separate komplett ausgestattete Küche',
      'Badewanne / WC / Fön',
      'Bettwäsche, Hand- & Geschirrtücher werden gestellt',
      'Sat-TV, DVD-Player, Radio',
      'Balkon',
      'Nichtraucherwohnung',
    ],
    prices: [{ label: '1–2 Personen', amount: '70,- € pro Nacht' }],
    priceNote: 'ab Buchung von 3 Tagen',
    photo: photos.fewoKleinWohnraum,
    gallery: [
      photos.fewoKleinEingang,
      photos.fewoKleinBalkon,
      photos.fewoKleinFlur,
      photos.fewoKleinBad,
    ],
  },
];
