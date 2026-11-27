import { Link } from 'react-router';
import { formatAddress, getContact, phoneHref } from '../../data/contacts';

const contact = getContact('blockhaus');

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-grid">
        <div>
          <div className="footer-brand">Bernd’s Blockhaus</div>
          <p>Ein Ort zum Ankommen und Genießen.</p>
        </div>
        <div className="footer-links">
          <strong>Entdecken</strong>
          <Link to="/gaststaette">Gaststätte</Link>
          <Link to="/ferienwohnungen">Ferienwohnungen</Link>
          <Link to="/eichwieserhof">Eichwieserhof</Link>
        </div>
        <div className="footer-links">
          <strong>Kontakt</strong>
          {contact.address && <span>{formatAddress(contact.address)}</span>}
          <a href={phoneHref(contact.phone)}>{contact.phone}</a>
          <a href={`mailto:${contact.email}`}>{contact.email}</a>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Bernd’s Blockhaus</span>
        <span>
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
        </span>
      </div>
    </footer>
  );
}
