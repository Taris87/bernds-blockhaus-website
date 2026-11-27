import { useRef, useState, type FormEvent } from 'react';
import { getContact, phoneHref } from '../../data/contacts';
import { apartments } from '../../data/apartments';

const contact = getContact('blockhaus');

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

interface Props {
  /** Preselected apartment id (set by “Anfrage für diese Wohnung”). */
  apartment?: string;
  onApartmentChange?: (id: string) => void;
}

export function ApartmentInquiryForm({ apartment, onApartmentChange }: Props) {
  const [status, setStatus] = useState('');
  const [ownApartment, setOwnApartment] = useState('');
  const selectedApartment = apartment ?? ownApartment;

  function changeApartment(id: string) {
    if (onApartmentChange) onApartmentChange(id);
    else setOwnApartment(id);
  }
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
    <section id="anfrage" className="form-section" tabIndex={-1}>
      <div className="wrap form-layout">
        <div>
          <p className="label">Ihre Auszeit</p>
          <h2 className="section-title" data-reveal="text">Ferien&shy;wohnung <em>anfragen.</em></h2>
          <p>
            {contact.responsibility}: {contact.name}, Telefon{' '}
            <a href={phoneHref(contact.phone)}>{contact.phone}</a>, E-Mail{' '}
            <a href={`mailto:${contact.email}`}>{contact.email}</a>
          </p>
        </div>
        <form className="inquiry-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <label>Name<input name="name" autoComplete="name" required /></label>
            <label>E-Mail<input name="email" type="email" autoComplete="email" required /></label>
            <label className="form-wide">
              Ferienwohnung
              <select name="apartment" value={selectedApartment} onChange={(event) => changeApartment(event.target.value)}>
                <option value="">Bitte wählen</option>
                {apartments.map((entry) => (
                  <option key={entry.id} value={entry.id}>
                    {entry.name}
                  </option>
                ))}
              </select>
            </label>
            <label className="form-wide">Gewünschter Zeitraum<input name="period" placeholder="[PLATZHALTER: Zeitraum]" /></label>
            <label className="form-wide">Nachricht<textarea name="message" rows={5} required /></label>
          </div>
          <p className="form-note">[PLATZHALTER: Datenschutz- und Kontaktinformation vor Veröffentlichung ergänzen.]</p>
          <button className="button button-primary" type="submit" disabled={submitting}>
            {submitting ? 'Wird gesendet …' : 'Anfrage senden'} <span aria-hidden="true">→</span>
          </button>
          {status && <p className="form-status" role="status" aria-live="polite">{status}</p>}
        </form>
      </div>
    </section>
  );
}
