import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Header } from './Header';

afterEach(() => {
  cleanup();
});

function renderHeader() {
  return render(
    <MemoryRouter>
      <Header />
    </MemoryRouter>,
  );
}

describe('Header mobile navigation', () => {
  it('opens the menu and moves focus to the close button', () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));

    expect(
      screen.getByRole('dialog', { name: 'Mobile Navigation' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Menü schließen' }),
    ).toHaveFocus();
  });

  it('closes the menu with Escape and returns focus to the toggle button', () => {
    renderHeader();

    const toggle = screen.getByRole('button', { name: 'Menü öffnen' });
    fireEvent.click(toggle);
    fireEvent.keyDown(document, { key: 'Escape' });

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    expect(toggle).toHaveFocus();
  });

  it('closes the menu when a navigation link is selected', () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    fireEvent.click(screen.getByRole('link', { name: 'Anfragen ↗' }));

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('keeps keyboard focus inside the menu when tabbing forward from the last item', () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));

    const dialog = screen.getByRole('dialog');
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable.item(0);
    const last = focusable.item(focusable.length - 1);

    last.focus();
    fireEvent.keyDown(document, { key: 'Tab' });

    expect(first).toHaveFocus();
  });

  it('keeps keyboard focus inside the menu when tabbing backward from the first item', () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));

    const dialog = screen.getByRole('dialog');
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable.item(0);
    const last = focusable.item(focusable.length - 1);

    first.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });

    expect(last).toHaveFocus();
  });
});
