import { Link } from 'react-router';
import { contacts } from '../../data/contacts';
export function Footer() {
  return <footer className="site-footer"><div className="footer-grid"><div><div className="footer-brand">Bernd’s Blockhaus</div><p>Ein Ort zum Ankommen und Genießen.</p></div><div className="footer-links"><strong>Entdecken</strong><Link to="/gaststaette">Gaststätte</Link><Link to="/ferienwohnungen">Ferienwohnungen</Link><Link to="/eichwieserhof">Eichwieserhof</Link></div><div className="footer-links"><strong>Kontakt</strong><span>{contacts.address}</span><span>{contacts.phone}</span><span>{contacts.email}</span></div></div><div className="footer-bottom"><span>© {new Date().getFullYear()} Bernd’s Blockhaus</span><span><Link to="/impressum">Impressum</Link><Link to="/datenschutz">Datenschutz</Link></span></div></footer>;
}
