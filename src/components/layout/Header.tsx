import { useEffect, useRef, useState, type SyntheticEvent } from 'react';
import { NavLink, Link } from 'react-router';
import { site } from '../../data/site';

export function Header() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    const toggleButton = toggleRef.current;

    if (!open || !dialog) return;

    const activeDialog: HTMLDialogElement = dialog;

    if (!activeDialog.open) activeDialog.showModal();

    const closeButton =
      activeDialog.querySelector<HTMLButtonElement>('.mobile-menu-close');
    closeButton?.focus();

    // Native modal dialogs already contain sequential keyboard focus.
    // This guard also restores focus if script-driven focus escapes the dialog.
    function keepFocusInside(event: FocusEvent) {
      if (
        event.target instanceof Node &&
        !activeDialog.contains(event.target)
      ) {
        closeButton?.focus();
      }
    }

    document.addEventListener('focusin', keepFocusInside);

    return () => {
      document.removeEventListener('focusin', keepFocusInside);
      if (activeDialog.open) activeDialog.close();
      toggleButton?.focus();
    };
  }, [open]);

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    setOpen(false);
  }

  return (
    <>
      <header className="site-header">
        <div className="header-strip">
          <span>Gaststätte · Ferienwohnungen · Eichwieserhof</span>
          <span>[PLATZHALTER: Region]</span>
        </div>
        <div className="header-inner">
          <Link
            to="/"
            className="brand"
            onClick={() => setOpen(false)}
            aria-label="Bernd’s Blockhaus – Startseite"
          >
            <span className="brand-mark">BB</span>
            <strong>Bernd’s Blockhaus</strong>
          </Link>
          <nav className="primary-nav" aria-label="Hauptnavigation">
            {site.navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) => (isActive ? 'active' : '')}
              >
                {item.label}
              </NavLink>
            ))}
            <NavLink className="nav-cta" to="/kontakt">
              Anfragen
            </NavLink>
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
      <dialog
        ref={dialogRef}
        id="mobile-navigation"
        className="mobile-menu"
        aria-label="Mobile Navigation"
        onCancel={handleCancel}
      >
        <button
          className="mobile-menu-close"
          type="button"
          aria-label="Menü schließen"
          onClick={() => setOpen(false)}
        >
          ×
        </button>
        <nav aria-label="Menü">
          {site.navigation.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>
              {item.label}
            </NavLink>
          ))}
          <Link to="/kontakt" onClick={() => setOpen(false)}>
            Anfragen ↗
          </Link>
        </nav>
      </dialog>
    </>
  );
}
