export interface MenuItem { name: string; description: string; price: string; }
export interface MenuCategory { id: string; title: string; items: MenuItem[]; }
export const menuCategories: MenuCategory[] = [
  { id: 'speisen', title: 'Speisen', items: [{ name: '[PLATZHALTER: Gericht]', description: '[PLATZHALTER: Beschreibung]', price: '[PLATZHALTER: Preis]' }] },
  { id: 'getraenke', title: 'Getränke', items: [{ name: '[PLATZHALTER: Getränk]', description: '[PLATZHALTER: Beschreibung]', price: '[PLATZHALTER: Preis]' }] },
];
