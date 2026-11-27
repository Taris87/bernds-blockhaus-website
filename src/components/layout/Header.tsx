import {
  useEffect,
  useRef,
  useState,
  type SyntheticEvent,
} from 'react';
import { NavLink, Link } from 'react-router';
import { site } from '../../data/site';

export function Header() {
  const [open, setOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    let cancelled = false;
    let focusListener: ((event: FocusEvent) => void) | undefined;
    let dialogForCleanup: HTMLDialogElement | null = null;

    // Strict Mode's development replay cancels this first setup before focus moves.
    queueMicrotask(() => {
      if (cancelled) return;
      const dialogElement = dialogRef.current;
      if (!dialogElement) return;

      const activeDialog: HTMLDialogElement = dialogElement;
      dialogForCleanup = activeDialog;
      if (!activeDialog.open) activeDialog.showModal();

      const closeButton =
        activeDialog.querySelector<HTMLButtonElement>('.mobile-menu-close');
      closeButton?.focus();

      function keepFocusInside(event: FocusEvent) {
        if (
          event.target instanceof Node &&
          !activeDialog.contains(event.target)
        ) {
          closeButton?.focus();
        }
      }

      focusListener = keepFocusInside;
      document.addEventListener('focusin', keepFocusInside);
    });

    return () => {
      cancelled = true;
      if (focusListener) {
        document.removeEventListener('focusin', focusListener);
      }
      if (dialogForCleanup?.open) dialogForCleanup.close();
      // Cleanup is not necessarily a user close: Strict Mode replays it on mount.
    };
  }, [open]);

  function restoreToggleFocus() {
    toggleRef.current?.focus();
  }

  function handleCancel(event: SyntheticEvent<HTMLDialogElement>) {
    event.preventDefault();
    setOpen(false);
    restoreToggleFocus();
  }

  function handleClose() {
    setOpen(false);
    restoreToggleFocus();
  }

  return (
    <>
      <header className="site-header">
        <div className="header-strip">
          <span>Gaststätte · Ferienwohnungen · Eichwieserhof</span>
          <span>{site.region}</span>
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
          onClick={handleClose}
        >
          ×
        </button>
        <nav aria-label="Menü">
          {site.navigation.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={handleClose}>
              {item.label}
            </NavLink>
          ))}
          <Link to="/kontakt" onClick={handleClose}>
            Anfragen ↗
          </Link>
        </nav>
      </dialog>
    </>
  );
}
