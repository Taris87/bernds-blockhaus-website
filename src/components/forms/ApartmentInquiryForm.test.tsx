import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ApartmentInquiryForm } from './ApartmentInquiryForm';

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function submitForm() {
  const form = screen.getByRole('button', { name: /Anfrage senden/i }).closest('form');
  if (!form) throw new Error('Inquiry form was not found');
  fireEvent.submit(form);
  return form;
}

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText(/Name/i), {
    target: { value: 'Erika Muster' },
  });
  fireEvent.change(screen.getByLabelText(/E-Mail/i), {
    target: { value: 'erika@example.com' },
  });
  fireEvent.change(screen.getByLabelText(/Nachricht/i), {
    target: { value: 'Ich interessiere mich für eine Ferienwohnung.' },
  });
}

describe('ApartmentInquiryForm', () => {
  it('renders required inquiry fields', () => {
    render(<ApartmentInquiryForm />);

    expect(screen.getByLabelText(/Name/i)).toBeRequired();
    expect(screen.getByLabelText(/E-Mail/i)).toBeRequired();
    expect(screen.getByLabelText(/Nachricht/i)).toBeRequired();
  });

  it('explains the fallback when no sending endpoint is configured', async () => {
    vi.stubEnv('VITE_INQUIRY_ENDPOINT', '');

    render(<ApartmentInquiryForm />);
    submitForm();

    expect(await screen.findByRole('status')).toHaveTextContent(
      /noch nicht mit einem Versanddienst verbunden/i,
    );
    expect(fetch).not.toHaveBeenCalled();
  });

  it('rejects non-HTTPS endpoints before sending', async () => {
    vi.stubEnv('VITE_INQUIRY_ENDPOINT', 'http://example.com/inquiry');
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(<ApartmentInquiryForm />);
    submitForm();

    expect(await screen.findByRole('status')).toHaveTextContent(
      /nicht korrekt konfiguriert/i,
    );
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('sends a POST request with FormData and resets only after success', async () => {
    vi.stubEnv('VITE_INQUIRY_ENDPOINT', 'https://example.com/inquiry');
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, status: 200 });
    vi.stubGlobal('fetch', fetchMock);

    render(<ApartmentInquiryForm />);
    fillRequiredFields();
    const form = submitForm();

    await screen.findByText(/erfolgreich versendet/i);

    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://example.com/inquiry');
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(FormData);
    expect((options.body as FormData).get('name')).toBe('Erika Muster');
    expect((options.body as FormData).get('email')).toBe('erika@example.com');
    expect(form.querySelector<HTMLInputElement>('input[name="name"]')?.value).toBe('');
  });

  it('keeps entered values and shows an error after an HTTP failure', async () => {
    vi.stubEnv('VITE_INQUIRY_ENDPOINT', 'https://example.com/inquiry');
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, status: 500 }));

    render(<ApartmentInquiryForm />);
    fillRequiredFields();
    const form = submitForm();

    expect(await screen.findByRole('status')).toHaveTextContent(
      /konnte nicht versendet werden/i,
    );
    expect(form.querySelector<HTMLInputElement>('input[name="name"]')?.value).toBe(
      'Erika Muster',
    );
    expect(screen.queryByText(/erfolgreich versendet/i)).not.toBeInTheDocument();
  });

  it('keeps entered values and shows an error after a network failure', async () => {
    vi.stubEnv('VITE_INQUIRY_ENDPOINT', 'https://example.com/inquiry');
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

    render(<ApartmentInquiryForm />);
    fillRequiredFields();
    const form = submitForm();

    expect(await screen.findByRole('status')).toHaveTextContent(
      /konnte nicht versendet werden/i,
    );
    expect(form.querySelector<HTMLInputElement>('input[name="name"]')?.value).toBe(
      'Erika Muster',
    );
  });

  it('shows a loading state and prevents duplicate submissions', async () => {
    vi.stubEnv('VITE_INQUIRY_ENDPOINT', 'https://example.com/inquiry');

    let resolveRequest!: (value: { ok: boolean; status: number }) => void;
    const pendingRequest = new Promise<{ ok: boolean; status: number }>((resolve) => {
      resolveRequest = resolve;
    });
    const fetchMock = vi.fn().mockReturnValue(pendingRequest);
    vi.stubGlobal('fetch', fetchMock);

    render(<ApartmentInquiryForm />);
    fillRequiredFields();
    const form = screen.getByRole('button', { name: /Anfrage senden/i }).closest('form');
    if (!form) throw new Error('Inquiry form was not found');

    fireEvent.submit(form);
    expect(screen.getByRole('button', { name: /Wird gesendet/i })).toBeDisabled();

    fireEvent.submit(form);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    resolveRequest({ ok: true, status: 200 });
    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent(/erfolgreich versendet/i);
    });
  });
});
