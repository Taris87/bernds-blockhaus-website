import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ApartmentInquiryForm } from './ApartmentInquiryForm';
describe('ApartmentInquiryForm', () => {
  it('renders required inquiry fields', () => {
    render(<ApartmentInquiryForm />);
    expect(screen.getByLabelText(/Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/E-Mail/i)).toBeInTheDocument();
  });
});
