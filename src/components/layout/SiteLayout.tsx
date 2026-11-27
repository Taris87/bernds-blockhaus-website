import { useRef } from 'react';
import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { Reveal } from '../motion/Reveal';
import { useRouteScroll } from '../../hooks/useRouteScroll';

export function SiteLayout() {
  const mainRef = useRef<HTMLElement>(null);
  useRouteScroll(mainRef);

  return (
    <>
      <a className="skip-link" href="#main">Zum Inhalt springen</a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Reveal><Outlet /></Reveal>
      </main>
      <Footer />
    </>
  );
}
