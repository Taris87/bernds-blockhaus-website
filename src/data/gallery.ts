import type { Photo } from '../types/content';
import { photos } from './photos';

/**
 * Gallery categories of the design system “Hüttenwand” (Kap. 5.5). Only a
 * regrouping of the existing photos – approved together with the concept.
 */
export const galleryCategories = [
  { id: 'blockhaus-landschaft', label: 'Blockhaus & Landschaft' },
  { id: 'kueche-feiern', label: 'Küche & Feiern' },
  { id: 'ferienwohnungen', label: 'Ferienwohnungen' },
  { id: 'hof-tiere', label: 'Hof & Tiere' },
] as const;

export type GalleryCategory = (typeof galleryCategories)[number]['id'];

export interface GalleryItem {
  id: string;
  title: string;
  category: GalleryCategory;
  photo: Photo;
}

export function categoryLabel(category: GalleryCategory): string {
  return (
    galleryCategories.find((entry) => entry.id === category)?.label ?? ''
  );
}

export function isGalleryCategory(value: string): value is GalleryCategory {
  return galleryCategories.some((entry) => entry.id === value);
}

const L = 'blockhaus-landschaft';
const K = 'kueche-feiern';
const F = 'ferienwohnungen';
const H = 'hof-tiere';

/** Curated, mixed order (mockup `galerie.html`). */
const entries: [keyof typeof photos, string, GalleryCategory][] = [
  ['blockhausLavendel', 'Das Blockhaus', L],
  ['gerichtHausmacher', 'Hausmacher Platte', K],
  ['blockhausAbendlicht', 'Abendlicht', L],
  ['islaenderWiese', 'Isländer auf der Löwenzahnwiese', H],
  ['festtafel', 'Festtafel', K],
  ['blockhausTeichSchilf', 'Schilf am Teich', L],
  ['fewoGrossWohnzimmer', 'Große Ferienwohnung', F],
  ['blockhausWinterNah', 'Winter am Blockhaus', L],
  ['gerichtRinderbraten', 'Rinderbraten mit Spätzle', K],
  ['angusHerde', 'Angus-Herde', H],
  ['blockhausWegweiser', 'Der Wegweiser', L],
  ['gerichtJaegerschnitzel', 'Jägerschnitzel', K],
  ['blockhausRosen', 'Rosen und Lavendel', L],
  ['islaenderAuge', 'Nahaufnahme', H],
  ['fewoGrossSchlafzimmer', 'Schlafzimmer (Süd)', F],
  ['gerichtBraten', 'Braten mit Knödel & Rotkraut', K],
  ['blockhausGetreide', 'Zwischen den Feldern', L],
  ['eichwieserhof', 'Eichwieserhof', H],
  ['gerichtWurstsalat', 'Wurstsalat', K],
  ['blockhausTeichSommer', 'Am Teich', L],
  ['mohnblumen', 'Mohnblumen', H],
  ['gerichtSchnitzel', 'Schnitzel mit Pommes', K],
  ['blockhausWinterFern', 'Verschneite Landschaft', L],
  ['fewoKleinWohnraum', 'Kleine Ferienwohnung', F],
  ['gerichtSalatPute', 'Salat mit Putenstreifen', K],
  ['islaenderZaun', 'Islandpferde am Blockhaus', H],
  ['blockhausTerrasse', 'Die Terrasse', L],
  ['gerichtSteak', 'Steak mit Pommes', K],
  ['blockhausKirschbaum', 'Fernblick', L],
  ['angusBlockhaus', 'Angus-Rinder vor dem Blockhaus', H],
  ['gerichtLeberknoedel', 'Leberknödel mit Kraut', K],
  ['blockhausWeitblick', 'Weitblick', L],
  ['gerichtBratwurstKraut', 'Bratwurst mit Kraut', K],
  ['blockhausBaeume', 'Wiesen und Bäume', L],
  ['gerichtRahmschnitzel', 'Rahmschnitzel', K],
  ['gerichtRindfleisch', 'Rindfleisch mit Meerrettich', K],
  ['gerichtBratwurstPommes', 'Bratwurst mit Pommes', K],
  ['gerichtWildschweinbratwurst', 'Bratwürste mit Bratkartoffeln', K],
  ['gerichtSalatKroketten', 'Salat mit Kroketten', K],
];

export const galleryItems: GalleryItem[] = entries.map(
  ([key, title, category]) => ({
    id: key,
    title,
    category,
    photo: photos[key],
  }),
);

/** Gallery title of a photo, used as caption wherever the photo appears. */
export function galleryTitle(photo: Photo): string {
  return galleryItems.find((item) => item.photo === photo)?.title ?? '';
}
