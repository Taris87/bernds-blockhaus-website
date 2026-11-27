import { Link } from 'react-router';
export function NotFoundPage() {
  return <section className="page-intro"><div className="section-wrap"><p className="eyebrow">404</p><h1>Diese Seite<br /><em>gibt es nicht.</em></h1><Link className="button button-primary" to="/">Zur Startseite</Link></div></section>;
}
