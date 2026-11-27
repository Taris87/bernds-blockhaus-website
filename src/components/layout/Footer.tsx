import { Link } from 'react-router';
import { formatAddress, getContact, phoneHref } from '../../data/contacts';
import { site } from '../../data/site';
import { ContourLines } from '../ui/Ornaments';

const contact = getContact('blockhaus');

export function Footer() {
  return (
    <footer className="site-footer">
      <ContourLines className="footer-contours" />
      <div className="wrap footer-grid">
        <div>
          <p className="footer-brand" aria-hidden="true">
            Bernd’s
            <br />
            <em>Blockhaus</em>
          </p>
          <p className="sr-only">{site.name}</p>
          <p>{site.region}</p>
        </div>
        <nav className="footer-links" aria-label="Entdecken">
          <h2 className="footer-heading">Entdecken</h2>
          <ul>
            {site.navigation
              .filter((item) => item.to !== '/kontakt')
              .map((item) => (
                <li key={item.to}>
                  <Link to={item.to}>{item.label}</Link>
                </li>
              ))}
          </ul>
        </nav>
        <div className="footer-links">
          <h2 className="footer-heading">Kontakt</h2>
          <ul>
            {contact.address && <li>{formatAddress(contact.address)}</li>}
            <li>
              <a href={phoneHref(contact.phone)}>{contact.phone}</a>
            </li>
            <li>
              <a href={`mailto:${contact.email}`}>{contact.email}</a>
            </li>
          </ul>
        </div>
      </div>
      <div className="wrap footer-bottom">
        <span>© {new Date().getFullYear()} Bernd’s Blockhaus</span>
        <span className="footer-legal">
          <Link to="/impressum">Impressum</Link>
          <Link to="/datenschutz">Datenschutz</Link>
        </span>
      </div>
    </footer>
  );
}
