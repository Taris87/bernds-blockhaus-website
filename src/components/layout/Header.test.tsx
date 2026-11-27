import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Header } from './Header';

beforeEach(() => {
  HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute('open', '');
  };
  HTMLDialogElement.prototype.close = function () {
    this.removeAttribute('open');
  };
});

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
  it('opens the native modal dialog and moves focus to the close button', () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));

    const dialog = screen.getByRole('dialog', { name: 'Mobile Navigation' });
    expect(dialog).toHaveAttribute('open');
    expect(screen.getByRole('button', { name: 'Menü schließen' })).toHaveFocus();
  });

  it('closes the dialog with Escape and returns focus to the toggle button', () => {
    renderHeader();

    const toggle = screen.getByRole('button', { name: 'Menü öffnen' });
    fireEvent.click(toggle);

    fireEvent.cancel(screen.getByRole('dialog', { name: 'Mobile Navigation' }));

    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
    expect(toggle).toHaveFocus();
  });

  it('closes the dialog when the close button is selected', () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    fireEvent.click(screen.getByRole('button', { name: 'Menü schließen' }));

    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it('closes the dialog when a navigation link is selected', () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    fireEvent.click(screen.getByRole('link', { name: 'Anfragen ↗' }));

    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open');
  });

  it('exposes the menu links inside a labelled navigation landmark', () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));

    expect(screen.getByRole('navigation', { name: 'Menü' })).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Mobile Navigation');
  });
});
