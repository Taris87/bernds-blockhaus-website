import { Link } from 'react-router';
import { PageIntro } from './PageIntro';

export function NotFoundPage() {
  return (
    <PageIntro
      eyebrow="404"
      title={
        <>
          Diese Seite
          <br />
          <em>gibt es nicht.</em>
        </>
      }
    >
      <Link className="button button-primary" to="/">
        Zur Startseite
      </Link>
    </PageIntro>
  );
}
