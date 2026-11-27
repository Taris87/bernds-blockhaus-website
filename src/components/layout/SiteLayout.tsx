import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { Reveal } from '../motion/Reveal';
export function SiteLayout() {
  return <><a className="skip-link" href="#main">Zum Inhalt springen</a><Header /><main id="main"><Reveal><Outlet /></Reveal></main><Footer /></>;
}
