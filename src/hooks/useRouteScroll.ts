import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react';
import { useLocation, useNavigationType, type Location } from 'react-router';

/**
 * Key for one history entry. React Router gives every entry it creates its own
 * key; entries created outside the router (native hash changes, the initial
 * load) all share "default", so the pathname keeps those apart.
 */
function entryKey(location: Location) {
  return `${location.key}|${location.pathname}`;
}

function hashTarget(hash: string) {
  if (!hash || hash === '#') return null;
  try {
    return document.getElementById(decodeURIComponent(hash.slice(1)));
  } catch {
    return null;
  }
}

/**
 * Scroll and focus handling for route changes (see docs/qa-remediation.md,
 * QA-043 and QA-107).
 *
 * - New pathname via PUSH/REPLACE: jump to the top (or to the hash target)
 *   instantly, bypassing the global `scroll-behavior: smooth`.
 * - New pathname via POP (back/forward): restore the position the entry had
 *   when it was left; without a saved position behave like PUSH.
 * - Same pathname (only query or hash changed): no scrolling and no focus
 *   change by the app; native fragment navigation stays with the browser.
 * - Every pathname change moves focus to `main` without scrolling.
 */
export function useRouteScroll(mainRef: RefObject<HTMLElement | null>) {
  const location = useLocation();
  const navigationType = useNavigationType();
  const positions = useRef(new Map<string, number>());
  const currentKey = useRef(entryKey(location));
  const previousPath = useRef(location.pathname);
  const pendingFocus = useRef(false);

  useEffect(() => {
    const { history } = window;
    const takeOver = () => {
      history.scrollRestoration = 'manual';
    };
    // On reload or when leaving the site the browser restores natively again.
    const handBack = () => {
      history.scrollRestoration = 'auto';
    };
    const remember = () => {
      positions.current.set(currentKey.current, window.scrollY);
    };

    takeOver();
    window.addEventListener('scroll', remember, { passive: true });
    window.addEventListener('pagehide', handBack);
    window.addEventListener('pageshow', takeOver);
    return () => {
      window.removeEventListener('scroll', remember);
      window.removeEventListener('pagehide', handBack);
      window.removeEventListener('pageshow', takeOver);
      handBack();
    };
  }, []);

  // Layout effect: the new page must not paint at the old scroll position.
  useLayoutEffect(() => {
    const key = entryKey(location);
    currentKey.current = key;

    if (previousPath.current !== location.pathname) {
      previousPath.current = location.pathname;
      const saved =
        navigationType === 'POP' ? positions.current.get(key) : undefined;
      const target = hashTarget(location.hash);

      if (saved !== undefined) {
        window.scrollTo({ top: saved, left: 0, behavior: 'instant' });
      } else if (target) {
        target.scrollIntoView({ behavior: 'instant', block: 'start' });
      } else {
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
      pendingFocus.current = true;
    }

    positions.current.set(key, window.scrollY);
  }, [location, navigationType]);

  // Focus runs as a passive effect so it comes after other components' effect
  // cleanups (e.g. the mobile menu dialog returning focus on close).
  useEffect(() => {
    if (!pendingFocus.current) return;
    pendingFocus.current = false;
    mainRef.current?.focus({ preventScroll: true });
  }, [location, mainRef]);
}
