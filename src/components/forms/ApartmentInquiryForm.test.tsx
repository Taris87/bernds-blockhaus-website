import { afterEach, describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import { ApartmentInquiryForm } from './ApartmentInquiryForm';

afterEach(() => {
  vi.unstubAllEnvs();
});

describe('ApartmentInquiryForm', () => {
  it('renders required inquiry fields', () => {
    render(<ApartmentInquiryForm />);

    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-Mail/i)).toBeInTheDocument();
  });

  it('explains the fallback when no sending endpoint is configured', async () => {
    vi.stubEnv('VITE_INQUIRY_ENDPOINT', '');

    render(<ApartmentInquiryForm />);

    fireEvent.submit(
      screen
        .getByRole('button', {
          name: /Anfrage senden/i,
        })
        .closest('form')!,
    );

    expect(await screen.findByRole('status')).toHaveTextContent(
      /noch nicht mit einem Versanddienst verbunden/i,
    );
  });
});
