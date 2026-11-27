import { useState } from 'react';
import { usePageMeta } from '../hooks/usePageMeta';
import { menuCategories } from '../data/menu';
import { PageIntro } from './PageIntro';
import { PlaceholderImage } from '../components/ui/PlaceholderImage';
export function GastronomyPage() {
  usePageMeta('Gaststätte & Speisekarte', 'Informationen zur Gaststätte und Speisekarte.');
  const [active, setActive] = useState(menuCategories[0]?.id ?? '');
  const category = menuCategories.find((item) => item.id === active) ?? menuCategories[0];
  return <><PageIntro eyebrow="Gaststätte" title={<>Genuss in<br /><em>besonderer Atmosphäre.</em></>} copy="[PLATZHALTER: Bestätigte Beschreibung der Gaststätte.]" /><section className="content-section section-wrap two-column"><div><h2>Herzlich <em>willkommen.</em></h2><p>[PLATZHALTER: Informationen zum Gastraum, Angebot und Reservierungen.]</p></div><PlaceholderImage label="[PLATZHALTER: Foto der Gaststätte]" /></section><section className="menu-section"><div className="section-wrap"><p className="eyebrow">Aus unserer Küche</p><h2>Die <em>Speisekarte.</em></h2><div className="menu-tabs" role="tablist" aria-label="Speisekarten-Kategorien">{menuCategories.map((item) => <button key={item.id} role="tab" aria-selected={active === item.id} onClick={() => setActive(item.id)}>{item.title}</button>)}</div>{category && <div className="menu-list"><h3>{category.title}</h3>{category.items.map((item) => <article className="menu-item" key={item.name}><div><h4>{item.name}</h4><p>{item.description}</p></div><span>{item.price}</span></article>)}</div>}</div></section></>;
}
