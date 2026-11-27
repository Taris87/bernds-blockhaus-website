import { useEffect, useRef } from 'react';
import { useLocation, Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { Reveal } from '../motion/Reveal';

export function SiteLayout() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const previousPath = useRef(location.pathname);

  useEffect(() => {
    if (previousPath.current !== location.pathname) {
      mainRef.current?.focus();
      previousPath.current = location.pathname;
    }
  }, [location.pathname]);

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
