import type { MenuCategory } from '../types/content';

/**
 * Menu of the former website (no prices were published there).
 * Prices, allergens and additives are still open – see PLACEHOLDERS.md.
 */
export const menuCategories: MenuCategory[] = [
  {
    id: 'kalte-gerichte',
    title: 'Kalte Gerichte',
    items: [
      'Schmalzbrot',
      'Hausmacherbrot (Leber-, Blut-, Bratwurst oder Schwartenmagen)',
      'Rohes Schinkenbrot mit Butter & Gurke',
      'Wildschweinschinkenbrot mit Butter & Gurke',
      'Käsebrot mit Butter & Zwiebeln',
    ],
  },
  {
    id: 'platten',
    title: 'Platten',
    items: [
      'Hausmacher Platte mit Gurke & Brot',
      'Kleine Hausmacher Platte mit Gurke & Brot',
      'Rohe Schinkenplatte mit Butter, Gurke & Brot',
      'Käse- & rohe Schinkenplatte mit Butter, Gurke & Brot',
      'Käseplatte (verschiedene Käsesorten) mit Butter, Zwiebeln & Brot',
    ],
  },
  {
    id: 'salatvariationen',
    title: 'Salatvariationen',
    items: [
      'Kleiner Beilagesalat',
      'Großer Salatteller',
      'Kleiner oder Großer Salatteller mit Putenstreifen',
      'Kleiner oder Großer Salatteller mit Kartoffeltaschen',
    ],
  },
  {
    id: 'burger',
    title: 'Burger',
    items: [
      'Hamburger',
      'Cheeseburger (mit Käse)',
      'Hüttenburger (mit Käse & Schinken)',
    ],
  },
  {
    id: 'kaese',
    title: 'Käse',
    items: [
      '1 gebackener Camembert mit Toast & Butter',
      'Handkäse mit Musik, Butter & Brot',
    ],
  },
  {
    id: 'pfaelzer-gerichte',
    title: 'Pfälzer Gerichte',
    items: [
      '1 Scheibe Saumagen mit Kraut & Brot',
      '1 oder 2 Leberknödel mit Kraut & Brot',
      '1 Leberknödel, 1 Bratwurst mit Kraut & Brot',
      '1 Bratwurst oder 2 Bratwürste mit Kraut & Brot',
      '1 Bratwurst oder 2 Bratwürste mit Pommes',
      'Portion Pommes inkl. 1 Portion Ketchup oder Mayo',
      'Extra Ketchup oder Mayo',
    ],
  },
  {
    id: 'schnitzel-steaks',
    title: 'Schnitzel & Steaks',
    note: 'Auf Wunsch sind alle Gerichte auch mit Bratkartoffeln oder Kroketten erhältlich.',
    items: [
      'Kleines oder großes Schnitzel paniert mit Pommes & Salat',
      'Kleines oder großes Rahmschnitzel mit Pommes & Salat',
      'Kleines oder großes Jägerschnitzel mit Pommes & Salat',
      'Kleines oder großes Hüttenschnitzel mit Pommes & Salat',
      'Eingelegtes Schweinekammsteak mit Pommes',
      'Schweinerückensteak mit Pommes & Salat',
    ],
  },
  {
    id: 'wildgerichte',
    title: 'Wildgerichte',
    items: [
      '1 Wildschweinbratwurst mit Kraut oder Pommes',
      '2 Wildschweinbratwürste mit Kraut oder Pommes',
    ],
  },
  {
    id: 'tageskarte',
    title: 'Tageskarte',
    note: 'Gerichte wechseln wöchentlich! Jede Woche wird mind. ein Rindgericht und ein Wildgericht angeboten.',
    items: [
      'Rinderbraten mit Spätzle & Salat',
      'Rindfleisch mit Kartoffeln & Meerrettich',
      'Rindergulasch mit Nudeln & Salat',
      'Rinderroulade mit Kartoffeln & Rotkraut',
      'Rumpsteak mit Zwiebeln & Kroketten',
      'Paprikaschnitzel mit Pommes & Salat',
      'Wurstsalat mit Brot oder Pommes oder Bratkartoffeln',
      'Wildschweinbraten mit Knödel & Rotkraut',
      'Wildschweingulasch mit Knödel & Rotkraut',
      '2 Wildschweinleberknödel mit Kraut & Brot',
      'Rehbraten mit Knödel & Rotkraut',
      'Rehgulasch mit Knödel & Rotkraut',
    ],
  },
];
