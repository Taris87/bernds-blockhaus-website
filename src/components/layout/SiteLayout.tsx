import { useRef } from 'react';
import { Outlet } from 'react-router';
import { Header } from './Header';
import { Footer } from './Footer';
import { useRouteScroll } from '../../hooks/useRouteScroll';
import { usePageMotion } from '../../motion/usePageMotion';

export function SiteLayout() {
  const mainRef = useRef<HTMLElement>(null);
  // Order matters: scroll reset first, then the motion layer measures.
  useRouteScroll(mainRef);
  usePageMotion(mainRef);

  return (
    <>
      <a className="skip-link" href="#main">Zum Inhalt springen</a>
      <Header />
      <main id="main" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
