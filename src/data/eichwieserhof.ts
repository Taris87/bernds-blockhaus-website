import type { SaleHorseGroup, Stallion } from '../types/content';

/**
 * Short summary built only from facts of the former website (no original
 * short text exists) – to be confirmed by the operator, see PLACEHOLDERS.md.
 */
export const eichwieserhofSummary =
  'Islandpferdezucht „Isländer vom Eichwieserhof“, Anguszucht und Rindfleisch aus eigener Anguszucht auf Vorbestellung.';

/** Stallions listed on the former page “Deckhengste (Väter unserer Isländer)”. */
export const stallions: Stallion[] = [
  {
    id: 'kann-fra-haga',
    name: 'Kann fra Haga',
    born: '1996',
    details: 'Stockmaß: 142 cm',
    stud: 'Familie Scheffler / Gestüt Sommerberg',
  },
  { id: 'galsi-vom-sommerberg', name: 'Galsi vom Sommerberg', born: '2001' },
  {
    id: 'flekkur',
    name: 'Flekkur v.d. Sickingerhöhe',
    born: '1996',
    stud: 'Herr Werner Leib / Gestüt Sickingerhöhe',
  },
];

export function getStallionName(id: string): string {
  const stallion = stallions.find((entry) => entry.id === id);
  if (!stallion) throw new Error(`Unbekannter Deckhengst: ${id}`);
  return stallion.name;
}

/** Status of the sale list as published on the former website – intentionally not updated. */
export const saleHorsesAsOf = 'Stand: März 2021';

function horsePhoto(file: string, alt: string, width: number, height: number) {
  return { src: `pferde/${file}.jpg`, alt, width, height };
}

export const saleHorseGroups: SaleHorseGroup[] = [
  {
    id: 'stuten-2007',
    title: 'Stuten 2007',
    horses: [
      {
        name: 'Feila v. Eichwieserhof',
        born: 'geb. 2007',
        dam: 'Fenja v. Eichwieserhof',
        sireId: 'kann-fra-haga',
        photo: horsePhoto(
          'feila',
          'Dunkelbraune Stute Feila stehend vor einer Holzwand',
          332,
          273,
        ),
      },
      {
        name: 'Genta v. Eichwieserhof',
        born: 'geb. 2007',
        dam: 'Adda v. Eichwieserhof',
        sireId: 'kann-fra-haga',
        photo: horsePhoto(
          'genta',
          'Stute Genta mit heller Mähne auf der Weide',
          273,
          182,
        ),
      },
      {
        name: 'Bibi v. Eichwieserhof',
        born: 'geb. 2007',
        dam: 'Blesa v. Eichwieserhof',
        sireId: 'kann-fra-haga',
        photo: horsePhoto(
          'bibi',
          'Gescheckte Stute Bibi mit heller Mähne vor einer Holzwand',
          498,
          357,
        ),
      },
      {
        name: 'Menja v. Eichwieserhof',
        born: 'geb. 2007',
        dam: 'Möri v. Eichwieserhof',
        sireId: 'kann-fra-haga',
        photo: horsePhoto(
          'menja',
          'Braune Stute Menja mit hellem Schweif vor einer Hecke',
          282,
          198,
        ),
      },
      {
        name: 'Bara v. Eichwieserhof',
        born: 'geb. 2007',
        dam: 'Gola v. Eichwieserhof',
        sireId: 'kann-fra-haga',
        photo: horsePhoto(
          'bara',
          'Helle Stute Bara im Schritt vor einer Hecke',
          449,
          323,
        ),
      },
      {
        name: 'Baga v. Eichwieserhof',
        born: 'geb. 2007',
        dam: 'Brana v. Eichwieserhof',
        sireId: 'kann-fra-haga',
        photo: horsePhoto(
          'baga',
          'Stute Baga im Trab vor einer Hecke',
          573,
          388,
        ),
      },
      {
        name: 'Asa v. Eichwieserhof',
        born: 'geb. 2007',
        dam: 'Katla v. Eichwieserhof',
        sireId: 'kann-fra-haga',
        photo: horsePhoto(
          'asa',
          'Braune Stute Asa stehend vor einer Holzwand',
          348,
          232,
        ),
      },
    ],
  },
  {
    id: 'stuten-2010',
    title: 'Stuten 2010',
    horses: [
      {
        name: 'Elfa v. Eichwieserhof',
        born: 'geb. 2010',
        dam: 'Elva v. Eichwieserhof',
        sireId: 'flekkur',
        photo: horsePhoto(
          'elfa',
          'Fuchsfarbene Stute Elfa mit heller Mähne im Grünen',
          307,
          223,
        ),
      },
      {
        name: 'Bjalla v. Eichwieserhof',
        born: 'geb. 2010',
        dam: 'Bära v. Eichwieserhof',
        sireId: 'flekkur',
        photo: horsePhoto(
          'bjalla',
          'Fuchsfarbene Stute Bjalla seitlich vor einer Hecke',
          473,
          314,
        ),
      },
      {
        name: 'Glora v. Eichwieserhof',
        born: 'geb. 2010',
        dam: 'Gola v. Eichwieserhof',
        sireId: 'kann-fra-haga',
        photo: horsePhoto(
          'glora',
          'Dunkle Stute Glora seitlich stehend',
          373,
          248,
        ),
      },
    ],
  },
  {
    id: 'wallache-2010',
    title: 'Wallache 2010',
    horses: [
      {
        name: 'Agi v. Eichwieserhof',
        born: 'geb. 25.05.2010',
        dam: 'Abba v. Eichwieserhof',
        sireId: 'flekkur',
        photo: horsePhoto(
          'agi',
          'Kopfporträt des braunen Wallachs Agi mit Halfter',
          385,
          255,
        ),
      },
      {
        name: 'Draumur v. Eichwieserhof',
        born: 'geb. 02.06.2010',
        dam: 'Düna v. Eichwieserhof',
        sireId: 'flekkur',
        photo: horsePhoto(
          'draumur',
          'Schwarz-weiß gescheckter Wallach Draumur vor einem Zaun',
          412,
          273,
        ),
      },
    ],
  },
];

export const angusText = [
  'Entstanden ist die Rinderrasse in den 1950er-Jahren durch eine Kombinationskreuzung aus Deutsche Holstein oder Fleckvieh mit dem schottischen Aberdeen Angus. So entstand das Deutsch Angus als Fleischrasse. Merkmale dieser gezüchteten Rasse sind Robustheit, Leichtkalbigkeit und Hornlosigkeit.',
  'Deutsch Angus Rinder sind meist einfarbig schwarz, braun oder rot. Die Tiere sind auch die idealen Landschaftspfleger und werden daher auch oft auf offene Brachflächen oder verwilderte Weideflächen gestellt, sodass diese als optimaler Lebensraum für verschiedenste Tier- und Pflanzenarten erhalten bleiben.',
  'Deutsch Angus Rinder besitzen feste Klauen, die ihnen eine ganzjährige Weidehaltung im Freien auch bei Wind und Wetter ermöglichen. Selbst schlechte bzw. sehr extreme Weidestandorte machen der Robustrasse wenig aus, zumindest leidet ihre Gesundheit und die Fleischqualität nicht darunter.',
  'Die hornlose Rinderrasse Deutsch Angus ist weniger krankheitsanfällig als andere Fleischrassen und deutlich robuster, was Tierarztbehandlungen und Medikamenteneinsatz nahezu überflüssig macht.',
  'Dank ihres gutmütigen und ruhigen Wesens ist der Umgang mit ihnen relativ leicht und erfordert wenig Arbeitsaufwand für den Halter.',
];

export const beefOffers = [
  {
    title: 'Rindfleisch ab 1/8',
    price: 'Preis auf Anfrage',
    detail: 'etwa 20 bis 25 kg Fleisch ohne Knochen',
  },
  {
    title: 'Rindfleisch 10 kg',
    price: 'Preis auf Anfrage',
    detail: 'Braten-, Suppen- und Hackfleisch zerlegt',
  },
];
