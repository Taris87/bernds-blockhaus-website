export type GalleryCategory = 'gaststaette' | 'ferienwohnungen' | 'eichwieserhof';
export interface GalleryItem { id: string; title: string; category: GalleryCategory; description: string; }
export const galleryItems: GalleryItem[] = [
  { id: 'blockhaus-aussen', title: 'Das Blockhaus', category: 'gaststaette', description: '[PLATZHALTER: Originalfoto des Blockhauses]' },
  { id: 'gastbereich', title: 'Gastbereich', category: 'gaststaette', description: '[PLATZHALTER: Foto des Gastraums]' },
  { id: 'ferienwohnung', title: 'Ferienwohnungen', category: 'ferienwohnungen', description: '[PLATZHALTER: Foto einer Ferienwohnung]' },
  { id: 'hof', title: 'Eichwieserhof', category: 'eichwieserhof', description: '[PLATZHALTER: Foto des Hofes]' },
  { id: 'natur', title: 'Natur & Umgebung', category: 'eichwieserhof', description: '[PLATZHALTER: Landschaftsfoto]' },
  { id: 'details', title: 'Details', category: 'gaststaette', description: '[PLATZHALTER: Detailaufnahme]' },
];
