import { useState, type FormEvent } from 'react';

export function ApartmentInquiryForm() {
  const [status, setStatus] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const endpoint = import.meta.env.VITE_INQUIRY_ENDPOINT;

    if (!endpoint) {
      setStatus('Das Anfrageformular ist noch nicht mit einem Versanddienst verbunden. Bitte kontaktieren Sie uns telefonisch oder per E-Mail.');
      return;
    }

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
      setStatus('Ihre Anfrage konnte nicht versendet werden. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns direkt.');
    } finally {
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
