import { useEffect, useRef, useState } from 'react';
import { NavLink, Link } from 'react-router';
import { site } from '../../data/site';

export function Header() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const menu = menuRef.current;
    const closeButton = menu?.querySelector<HTMLButtonElement>('.mobile-menu-close');
    closeButton?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        setOpen(false);
        toggleRef.current?.focus();
        return;
      }

      if (event.key !== 'Tab' || !menu) return;
      const focusable = menu.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      const first = focusable.item(0);
      const last = focusable.item(focusable.length - 1);

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      toggleRef.current?.focus();
    };
  }, [open]);

  return (
    <>
      <header className="site-header">
        <div className="header-strip">
          <span>Gaststätte · Ferienwohnungen · Eichwieserhof</span>
          <span>[PLATZHALTER: Region]</span>
        </div>
        <div className="header-inner">
          <Link to="/" className="brand" onClick={() => setOpen(false)} aria-label="Bernd’s Blockhaus – Startseite">
            <span className="brand-mark">BB</span>
            <strong>Bernd’s Blockhaus</strong>
          </Link>
          <nav className="primary-nav" aria-label="Hauptnavigation">
            {site.navigation.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>
                {item.label}
              </NavLink>
            ))}
            <NavLink className="nav-cta" to="/kontakt">Anfragen</NavLink>
          </nav>
          <button
            ref={toggleRef}
            className="menu-toggle"
            type="button"
            aria-label="Menü öffnen"
            aria-expanded={open}
            aria-controls="mobile-navigation"
            aria-haspopup="dialog"
            onClick={() => setOpen(true)}
          >
            ☰
          </button>
        </div>
      </header>
      {open && (
        <nav
          ref={menuRef}
          id="mobile-navigation"
          className="mobile-menu"
          aria-label="Mobile Navigation"
          role="dialog"
          aria-modal="true"
        >
          <button className="mobile-menu-close" type="button" aria-label="Menü schließen" onClick={() => setOpen(false)}>
            ×
          </button>
          {site.navigation.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <Link to="/kontakt" onClick={() => setOpen(false)}>Anfragen ↗</Link>
        </nav>
      )}
    </>
  );
}
