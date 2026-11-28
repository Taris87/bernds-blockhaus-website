export const site = {
  name: 'Bernd’s Blockhaus',
  region: 'Weilerbach · Pfälzer Bergland',
  heroEyebrow: 'Herzlich Willkommen bei Familie Schellhaas',
  heroTitle: 'Ankommen. Wohlfühlen. Genießen.',
  heroDescription:
    'Idyllisch gelegen zwischen Wiesen und Wald, umgeben von Islandpferden und Angusmutterkuhherden, bietet unser Blockhaus eine Entspannung, die Sie am Wochenende suchen.',
  navigation: [
    { label: 'Gaststätte', to: '/gaststaette' },
    { label: 'Ferienwohnungen', to: '/ferienwohnungen' },
    { label: 'Galerie', to: '/galerie' },
    { label: 'Eichwieserhof', to: '/eichwieserhof' },
    { label: 'Kontakt', to: '/kontakt' },
  ],
};

/** Texts of the former page “Bernd’s Blockhaus” (Gaststätte). */
export const gastronomyText = {
  kitchen:
    'Auf der sonnigen Terrasse oder am gemütlichen Kachelofen genießen Sie die solide Pfälzer Küche und selbstgebackene Kuchen.',
  celebrations:
    'Für Feste und Feierlichkeiten bis 60 Personen bieten unsere Räume im Blockhaus ein besonderes Ambiente.',
  events: [
    'Für Familien-, Vereins-, Weihnachtsfeiern oder sonstige Veranstaltungen bietet das Blockhaus bis zu 60 Sitzplätze im Innenraum.',
    'Bei schönem Wetter finden weitere ~ 150 Personen einen Sitzplatz im Außenbereich unter freiem Himmel oder unter der Terrasse.',
    'Reservierungen von Terminen sind auch außerhalb der Öffnungszeiten nach Absprache möglich.',
  ],
  /**
   * Short version of `events` for the home page (design concept Kap. 5.1).
   * Merged from the original sentences – confirmation by the operator open
   * (Kap. 11, question 2).
   */
  eventsShort:
    'Für Familien-, Vereins-, Weihnachtsfeiern oder sonstige Veranstaltungen. Reservierungen von Terminen sind auch außerhalb der Öffnungszeiten nach Absprache möglich.',
  /** Seats taken from `events`; shown as counters (pattern M4). */
  seats: [
    { value: '60', label: 'Sitzplätze im Innenraum' },
    { value: '~150', label: 'Plätze im Außenbereich' },
  ],
};

/** Facts for the home page ticker – each one taken from the texts above. */
export const marqueeFacts = [
  'Pfälzer Küche',
  'Selbstgebackene Kuchen',
  'Am gemütlichen Kachelofen',
  'Sonnige Terrasse',
  'Islandpferde',
  'Wanderreiterstation',
  'Deutsch Angus',
  'Radweganbindung',
];

/**
 * New UI micro texts of the design concept (Kap. 11, question 4) – approved
 * together with the concept, collected here so they are easy to review.
 */
export const microTexts = {
  heroLabel: 'Rad-, Reit- und Wanderhütte',
  toMenu: 'Zur Speisekarte',
  stampValue: 'bis 60',
  stampLabel: 'Plätze für Ihre Feier',
  inquiryForApartment: 'Anfrage für diese Wohnung',
  enlarge: 'Vergrößern +',
  pauseTicker: 'Laufband anhalten',
};
