import { useRef, useState, type FormEvent } from 'react';

const fallbackMessage =
  'Das Anfrageformular ist noch nicht mit einem Versanddienst verbunden. Bitte kontaktieren Sie uns telefonisch oder per E-Mail.';
const invalidEndpointMessage =
  'Der Anfrageversand ist derzeit nicht korrekt konfiguriert. Bitte kontaktieren Sie uns telefonisch oder per E-Mail.';
const errorMessage =
  'Ihre Anfrage konnte nicht versendet werden. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.';

function getSecureEndpoint(value: string | undefined): string | null {
  if (!value?.trim()) return null;

  try {
    const endpoint = new URL(value.trim());
    if (endpoint.protocol !== 'https:' || !endpoint.hostname) return null;
    return endpoint.toString();
  } catch {
    return null;
  }
}

export function ApartmentInquiryForm() {
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const submittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submittingRef.current) return;

    const form = event.currentTarget;
    const configuredEndpoint = import.meta.env.VITE_INQUIRY_ENDPOINT;

    if (!configuredEndpoint?.trim()) {
      setStatus(fallbackMessage);
      return;
    }

    const endpoint = getSecureEndpoint(configuredEndpoint);
    if (!endpoint) {
      setStatus(invalidEndpointMessage);
      return;
    }

    submittingRef.current = true;
    setSubmitting(true);
    setStatus('');

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Anfrageversand fehlgeschlagen (HTTP ${response.status}).`);
      }

      form.reset();
      setStatus('Vielen Dank! Ihre Anfrage wurde erfolgreich versendet.');
    } catch {
      setStatus(errorMessage);
    } finally {
      submittingRef.current = false;
      setSubmitting(false);
    }
  }

  return (
    <section className="form-section">
      <div className="section-wrap form-layout">
        <div>
          <p className="eyebrow">Ihre Auszeit</p>
          <h2>Ferienwohnung <em>anfragen.</em></h2>
          <p>[PLATZHALTER: Hinweise zu Buchung und Kontakt ergänzen.]</p>
        </div>
        <form className="inquiry-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>Name<input name="name" autoComplete="name" required /></label>
            <label>E-Mail<input name="email" type="email" autoComplete="email" required /></label>
            <label className="form-wide">Gewünschter Zeitraum<input name="period" placeholder="[PLATZHALTER: Zeitraum]" /></label>
            <label className="form-wide">Nachricht<textarea name="message" rows={5} required /></label>
          </div>
          <p className="form-note">[PLATZHALTER: Datenschutz- und Kontaktinformation vor Veröffentlichung ergänzen.]</p>
          <button className="button button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Wird gesendet …' : 'Anfrage senden'} <span>↗</span>
          </button>
          {status && <p className="form-status" role="status" aria-live="polite">{status}</p>}
        </form>
      </div>
    </section>
  );
}
