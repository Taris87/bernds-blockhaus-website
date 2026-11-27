import type { Photo } from '../types/content';
import { photos } from './photos';

export type GalleryCategory =
  'gaststaette' | 'ferienwohnungen' | 'eichwieserhof';

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  photo: Photo;
}

const entries: [keyof typeof photos, string, GalleryCategory][] = [
  ['blockhausLavendel', 'Das Blockhaus', 'gaststaette'],
  ['blockhausRosen', 'Rosen und Lavendel', 'gaststaette'],
  ['blockhausTeichSommer', 'Am Teich', 'gaststaette'],
  ['blockhausAbendlicht', 'Abendlicht', 'gaststaette'],
  ['blockhausWinterNah', 'Winter am Blockhaus', 'gaststaette'],
  ['blockhausWinterFern', 'Verschneite Landschaft', 'gaststaette'],
  ['blockhausTerrasse', 'Die Terrasse', 'gaststaette'],
  ['blockhausTeichSchilf', 'Schilf am Teich', 'gaststaette'],
  ['blockhausWegweiser', 'Der Wegweiser', 'gaststaette'],
  ['blockhausKirschbaum', 'Fernblick', 'gaststaette'],
  ['blockhausGetreide', 'Zwischen den Feldern', 'gaststaette'],
  ['blockhausWeitblick', 'Weitblick', 'gaststaette'],
  ['blockhausBaeume', 'Wiesen und Bäume', 'gaststaette'],
  ['festtafel', 'Festtafel', 'gaststaette'],
  ['gerichtHausmacher', 'Hausmacher Platte', 'gaststaette'],
  ['gerichtSchnitzel', 'Schnitzel mit Pommes', 'gaststaette'],
  ['gerichtJaegerschnitzel', 'Jägerschnitzel', 'gaststaette'],
  ['gerichtRahmschnitzel', 'Rahmschnitzel', 'gaststaette'],
  ['gerichtSteak', 'Steak mit Pommes', 'gaststaette'],
  ['gerichtBratwurstKraut', 'Bratwurst mit Kraut', 'gaststaette'],
  ['gerichtBratwurstPommes', 'Bratwurst mit Pommes', 'gaststaette'],
  ['gerichtLeberknoedel', 'Leberknödel mit Kraut', 'gaststaette'],
  [
    'gerichtWildschweinbratwurst',
    'Bratwürste mit Bratkartoffeln',
    'gaststaette',
  ],
  ['gerichtRinderbraten', 'Rinderbraten mit Spätzle', 'gaststaette'],
  ['gerichtRindfleisch', 'Rindfleisch mit Meerrettich', 'gaststaette'],
  ['gerichtBraten', 'Braten mit Knödel & Rotkraut', 'gaststaette'],
  ['gerichtWurstsalat', 'Wurstsalat', 'gaststaette'],
  ['gerichtSalatPute', 'Salat mit Putenstreifen', 'gaststaette'],
  ['gerichtSalatKroketten', 'Salat mit Kroketten', 'gaststaette'],
  ['fewoGrossWohnzimmer', 'Große Ferienwohnung', 'ferienwohnungen'],
  ['fewoGrossSchlafzimmer', 'Schlafzimmer (Süd)', 'ferienwohnungen'],
  ['fewoKleinWohnraum', 'Kleine Ferienwohnung', 'ferienwohnungen'],
  ['islaenderZaun', 'Islandpferde am Blockhaus', 'eichwieserhof'],
  ['islaenderWiese', 'Isländer auf der Löwenzahnwiese', 'eichwieserhof'],
  ['islaenderAuge', 'Nahaufnahme', 'eichwieserhof'],
  ['angusHerde', 'Angus-Herde', 'eichwieserhof'],
  ['angusBlockhaus', 'Angus-Rinder vor dem Blockhaus', 'eichwieserhof'],
  ['eichwieserhof', 'Eichwieserhof', 'eichwieserhof'],
  ['mohnblumen', 'Mohnblumen', 'eichwieserhof'],
];

export const galleryItems: GalleryItem[] = entries.map(
  ([key, title, category]) => ({
    id: key,
    title,
    category,
    photo: photos[key],
  }),
);
