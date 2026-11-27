import { useState } from 'react';
import { NavLink, Link } from 'react-router';
import { site } from '../../data/site';
export function Header() {
  const [open, setOpen] = useState(false);
  return <><header className="site-header"><div className="header-strip"><span>Gaststätte · Ferienwohnungen · Eichwieserhof</span><span>[PLATZHALTER: Region]</span></div><div className="header-inner"><Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="Bernd’s Blockhaus – Startseite"><span className="brand-mark">BB</span><strong>Bernd’s Blockhaus</strong></Link><nav className="primary-nav" aria-label="Hauptnavigation">{site.navigation.map((item) => <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>{item.label}</NavLink>)}<NavLink className="nav-cta" to="/kontakt">Anfragen</NavLink></nav><button className="menu-toggle" aria-label="Menü öffnen" aria-expanded={open} onClick={() => setOpen(true)}>☰</button></div></header>{open && <nav className="mobile-menu" aria-label="Mobile Navigation"><button aria-label="Menü schließen" onClick={() => setOpen(false)}>×</button>{site.navigation.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>{item.label}</NavLink>)}<Link to="/kontakt" onClick={() => setOpen(false)}>Anfragen ↗</Link></nav>}</>;
}
