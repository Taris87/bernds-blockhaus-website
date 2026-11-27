import type { Photo } from '../types/content';

/**
 * Photos taken over from the former website (owned by the operator).
 * The files are small (screen-size crops), so they are never shown larger
 * than about 1.5 × their pixel width.
 */
export const photos = {
  blockhausRosen: { src: 'blockhaus/blockhaus-rosen-lavendel.jpg', alt: 'Das Blockhaus hinter blühenden roten Rosen und Lavendel an einem sonnigen Tag', width: 432, height: 323 },
  blockhausLavendel: { src: 'blockhaus/blockhaus-lavendel-vorderansicht.jpg', alt: 'Vorderansicht des Blockhauses mit Terrasse, davor Lavendel und Rasen unter blauem Himmel', width: 417, height: 311 },
  blockhausTerrasse: { src: 'blockhaus/blockhaus-vorderansicht-terrasse.jpg', alt: 'Blockhaus mit überdachter Terrasse, Sonnenschirmen und Holzzaun', width: 364, height: 273 },
  blockhausAbendlicht: { src: 'blockhaus/blockhaus-abendlicht-fahne.jpg', alt: 'Das Blockhaus im warmen Abendlicht, davor eine Wiese und eine Fahne', width: 423, height: 317 },
  blockhausBaeume: { src: 'blockhaus/blockhaus-fernansicht-baeume.jpg', alt: 'Blick über eine Wiese mit Baumgruppe auf das Blockhaus in der Ferne', width: 398, height: 276 },
  blockhausGetreide: { src: 'blockhaus/blockhaus-getreidefeld-ferne.jpg', alt: 'Getreidefeld im Vordergrund, dahinter das Blockhaus am Waldrand', width: 415, height: 312 },
  blockhausKirschbaum: { src: 'blockhaus/blockhaus-kirschbaum-fernsicht.jpg', alt: 'Blick zwischen Baumstämmen hindurch auf das Blockhaus mit Solardach', width: 458, height: 343 },
  blockhausTeichSommer: { src: 'blockhaus/blockhaus-teich-sommer.jpg', alt: 'Das Blockhaus im Sommer, vom Teich mit Schilf aus gesehen', width: 410, height: 273 },
  blockhausWeitblick: { src: 'blockhaus/blockhaus-wiese-weitblick.jpg', alt: 'Weiter Blick über Wiesen, am Horizont das Blockhaus', width: 412, height: 308 },
  blockhausWinterFern: { src: 'blockhaus/blockhaus-winter-schnee-fern.jpg', alt: 'Das verschneite Blockhaus im Winter, aus der Ferne gesehen', width: 395, height: 273 },
  blockhausWinterNah: { src: 'blockhaus/blockhaus-winter-schnee-nah.jpg', alt: 'Das Blockhaus im Schnee mit verschneiter Tanne', width: 413, height: 274 },
  blockhausTeichSchilf: { src: 'blockhaus/blockhaus-teich-schilf.jpg', alt: 'Giebelseite des Blockhauses über dem Teich mit Schilf und hohem Gras', width: 310, height: 466 },
  blockhausWegweiser: { src: 'blockhaus/blockhaus-wegweiser.jpg', alt: 'Wegweiser zu Bernd’s Blockhaus, Rad-, Reit- und Wanderhütte, vor einem blühenden Rapsfeld', width: 273, height: 410 },
  festtafel: { src: 'gastronomie/festtafel-innenraum.jpg', alt: 'Lange, festlich gedeckte Tafel mit roten Servietten im holzvertäfelten Gastraum', width: 343, height: 458 },
  gerichtBraten: { src: 'gastronomie/gericht-braten-knoedel-rotkraut.jpg', alt: 'Braten mit Soße, Knödeln und Rotkraut auf einem Teller', width: 398, height: 532 },
  gerichtBratwurstKraut: { src: 'gastronomie/gericht-bratwurst-kraut.jpg', alt: 'Zwei Bratwürste auf Sauerkraut', width: 397, height: 529 },
  gerichtBratwurstPommes: { src: 'gastronomie/gericht-bratwurst-pommes.jpg', alt: 'Zwei Bratwürste mit Pommes und Salatgarnitur', width: 373, height: 498 },
  gerichtHausmacher: { src: 'gastronomie/gericht-hausmacherplatte.jpg', alt: 'Hausmacher Platte mit Wurstspezialitäten und Gurke auf einem Holzbrett', width: 412, height: 552 },
  gerichtJaegerschnitzel: { src: 'gastronomie/gericht-jaegerschnitzel-pommes.jpg', alt: 'Schnitzel mit Pilzrahmsoße und Pommes', width: 390, height: 522 },
  gerichtLeberknoedel: { src: 'gastronomie/gericht-leberknoedel-kraut.jpg', alt: 'Leberknödel mit Sauerkraut und Soße', width: 389, height: 519 },
  gerichtRahmschnitzel: { src: 'gastronomie/gericht-rahmschnitzel-bratkartoffeln.jpg', alt: 'Schnitzel mit heller Rahmsoße und Bratkartoffeln', width: 399, height: 535 },
  gerichtRinderbraten: { src: 'gastronomie/gericht-rinderbraten-spaetzle.jpg', alt: 'Rinderbraten mit dunkler Soße und Spätzle', width: 392, height: 523 },
  gerichtRindfleisch: { src: 'gastronomie/gericht-rindfleisch-meerrettich.jpg', alt: 'Gekochtes Rindfleisch mit Meerrettichsoße, Kartoffeln und Gurke', width: 398, height: 532 },
  gerichtSalatKroketten: { src: 'gastronomie/gericht-salat-kroketten.jpg', alt: 'Bunter Salatteller mit Kroketten', width: 392, height: 523 },
  gerichtSalatPute: { src: 'gastronomie/gericht-salat-putenstreifen.jpg', alt: 'Großer Salatteller mit gebratenen Putenstreifen', width: 397, height: 530 },
  gerichtSchnitzel: { src: 'gastronomie/gericht-schnitzel-zitrone-pommes.jpg', alt: 'Paniertes Schnitzel mit Zitronenscheibe und Pommes', width: 381, height: 508 },
  gerichtSteak: { src: 'gastronomie/gericht-steak-pommes.jpg', alt: 'Gegrilltes Steak mit Pommes und Tomate', width: 389, height: 520 },
  gerichtWildschweinbratwurst: { src: 'gastronomie/gericht-wildschweinbratwurst.jpg', alt: 'Zwei dunkle Bratwürste mit Bratkartoffeln', width: 392, height: 523 },
  gerichtWurstsalat: { src: 'gastronomie/gericht-wurstsalat.jpg', alt: 'Zwei Teller Wurstsalat, einer mit Pommes, einer mit Bratkartoffeln', width: 410, height: 549 },
  fewoGrossEtagenbett: { src: 'ferienwohnungen/gross-etagenbett.jpg', alt: 'Etagenbett in der Flurnische der großen Ferienwohnung', width: 317, height: 210 },
  fewoGrossKueche: { src: 'ferienwohnungen/gross-kueche.jpg', alt: 'Küchenzeile unter der Dachschräge der großen Ferienwohnung', width: 298, height: 198 },
  fewoGrossSchlafzimmer: { src: 'ferienwohnungen/gross-schlafzimmer.jpg', alt: 'Schlafzimmer der großen Ferienwohnung mit Doppel- und Beistellbett unter dem Dachfenster', width: 437, height: 290 },
  fewoGrossWohnbereich: { src: 'ferienwohnungen/gross-wohnbereich.jpg', alt: 'Wohnbereich der großen Ferienwohnung mit Sofa und Esstisch', width: 387, height: 257 },
  fewoGrossWohnzimmer: { src: 'ferienwohnungen/gross-wohnzimmer.jpg', alt: 'Wohn- und Essbereich der großen Ferienwohnung mit Holzschrankwand und Fernseher', width: 457, height: 304 },
  fewoKleinBad: { src: 'ferienwohnungen/klein-bad.jpg', alt: 'Bad der kleinen Ferienwohnung mit WC und Waschbecken', width: 166, height: 342 },
  fewoKleinBalkon: { src: 'ferienwohnungen/klein-balkon.jpg', alt: 'Balkon der kleinen Ferienwohnung mit Blick auf die Wiese', width: 304, height: 147 },
  fewoKleinEingang: { src: 'ferienwohnungen/klein-eingang.jpg', alt: 'Eingangsbereich der kleinen Ferienwohnung mit Blick auf ein Bett', width: 338, height: 253 },
  fewoKleinFlur: { src: 'ferienwohnungen/klein-flur.jpg', alt: 'Blick durch den Flur in den Wohnraum der kleinen Ferienwohnung', width: 223, height: 462 },
  fewoKleinWohnraum: { src: 'ferienwohnungen/klein-wohnraum.jpg', alt: 'Wohnraum der kleinen Ferienwohnung mit zwei Einzelbetten und Holzwänden', width: 605, height: 293 },
  islaenderZaun: { src: 'landschaft/blockhaus-islaender-zaun.jpg', alt: 'Drei Islandpferde am Holzzaun vor dem Blockhaus', width: 398, height: 273 },
  mohnblumen: { src: 'landschaft/mohnblumen.jpg', alt: 'Rote Mohnblumen und Ähren vor bewölktem Himmel', width: 398, height: 308 },
  pusteblume: { src: 'landschaft/pusteblume.jpg', alt: 'Pusteblume vor einer Wiese und Wolkenhimmel', width: 364, height: 487 },
  eichwieserhof: { src: 'hof/eichwieserhof-wohnhaus.jpg', alt: 'Hofgebäude des Eichwieserhofs mit roter Holzfassade, Hortensien und Bank', width: 368, height: 218 },
  angusHerde: { src: 'angus/angus-herde-weide.jpg', alt: 'Herde schwarzer Angus-Rinder auf einer grünen Weide', width: 698, height: 268 },
  angusBlockhaus: { src: 'angus/angus-weide-blockhaus.jpg', alt: 'Angus-Rinder auf der Weide, im Hintergrund das Blockhaus', width: 422, height: 316 },
  islaenderWiese: { src: 'pferde/islaender-loewenzahnwiese.jpg', alt: 'Zwei junge Islandpferde beschnuppern sich auf einer Löwenzahnwiese', width: 373, height: 248 },
  islaenderAuge: { src: 'pferde/islaender-auge.jpg', alt: 'Nahaufnahme eines Pferdeauges unter heller Mähne', width: 448, height: 296 },
  islaenderSonnenblume: { src: 'pferde/islaender-sonnenblume.jpg', alt: 'Dunkles Islandpferd mit einer Sonnenblume im Stirnschopf', width: 227, height: 303 },
  islaenderSonnenblumenfeld: { src: 'pferde/islaender-sonnenblumenfeld.jpg', alt: 'Dunkles Islandpferd mit Trense in einem Sonnenblumenfeld', width: 223, height: 298 },
} satisfies Record<string, Photo>;

export function photoUrl(photo: Photo): string {
  return `${import.meta.env.BASE_URL}images/${photo.src}`;
}
