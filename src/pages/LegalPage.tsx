import { usePageMeta } from '../hooks/usePageMeta';
import { operator, phoneHref } from '../data/contacts';
import { PageIntro } from './PageIntro';

export function ImprintPage() {
  usePageMeta(
    'Impressum',
    'Impressum von Bernd’s Blockhaus – Tanja und Bernd Schellhaas GbR, Weilerbach.',
  );
  return (
    <>
      <PageIntro
        eyebrow="Rechtliches"
        title={<>Impressum</>}
        copy="Anbieterkennzeichnung und Kontaktangaben."
      />
      <section className="content-section section-wrap legal-text">
        <h2>{operator.name}</h2>
        <p>
          {operator.address.street}
          <br />
          {operator.address.postalCode} {operator.address.city}
        </p>
        <p>
          Telefon: <a href={phoneHref(operator.phone)}>{operator.phone}</a>
        </p>
        <p>
          E-Mail: <a href={`mailto:${operator.email}`}>{operator.email}</a>
        </p>
        <p>
          Umsatzsteuer-Identifikationsnummer:
          <br />
          {operator.vatId}
        </p>
        <h3>Haftungsausschluss</h3>
        <p>
          Der Inhalt dieser Webseite wurde mit größter Sorgfalt, nach bestem
          Wissen und Gewissen erstellt. Als Anbieter dieser Webseite übernehmen
          wir keine Haftung für Vollständigkeit, Richtigkeit, Aktualität oder
          Verlässlichkeit der bereitgestellten Inhalte. Wir stellen die Inhalte
          auf der Webseite zum Abruf bereit. Für die Brauchbarkeit der Inhalte
          übernehmen wir keine Gewähr. Inhalte mit namentlich genannten Autoren
          sind die Meinung des Autors, aber nicht zwingend die Meinung des
          Anbieters.
        </p>
      </section>
    </>
  );
}

export function PrivacyPage() {
  usePageMeta('Datenschutz', 'Datenschutzhinweise von Bernd’s Blockhaus.');
  return (
    <>
      <PageIntro
        eyebrow="Rechtliches"
        title={<>Datenschutz</>}
        copy="[PLATZHALTER: Datenschutzerklärung anhand der tatsächlich eingesetzten Dienste erstellen und rechtlich prüfen lassen.]"
      />
      <section className="content-section section-wrap">
        <p>
          [PLATZHALTER: Verantwortliche Stelle, Datenverarbeitung,
          Rechtsgrundlagen, Speicherdauer und Betroffenenrechte ergänzen.]
        </p>
      </section>
    </>
  );
}
