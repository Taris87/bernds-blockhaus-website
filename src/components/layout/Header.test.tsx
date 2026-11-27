import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Header } from './Header';

beforeEach(() => {
  // JSDOM does not implement native modal-dialog keyboard/focus behavior.
  // Those browser semantics are verified separately in Playwright/Chromium.
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
    <>
      <button type="button" data-testid="outside-control">Outside</button>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </>,
  );
}

describe('Header mobile navigation', () => {
  it('opens the dialog and moves focus to the close button', async () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));

    const dialog = screen.getByRole('dialog', { name: 'Mobile Navigation' });
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Menü schließen' })).toHaveFocus());
  });

  it('closes the dialog with Escape and returns focus to the toggle button', async () => {
    renderHeader();

    const toggle = screen.getByRole('button', { name: 'Menü öffnen' });
    fireEvent.click(toggle);

    const dialog = await screen.findByRole('dialog', { name: 'Mobile Navigation' });
    await waitFor(() => expect(dialog).toHaveAttribute('open'));

    fireEvent(
      dialog,
      new Event('cancel', { bubbles: false, cancelable: true }),
    );

    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    expect(toggle).toHaveFocus();
  });

  it('closes the dialog and restores focus when the close button is selected', async () => {
    renderHeader();

    const toggle = screen.getByRole('button', { name: 'Menü öffnen' });
    fireEvent.click(toggle);
    const closeButton = await screen.findByRole('button', { name: 'Menü schließen' });
    await waitFor(() => expect(closeButton).toHaveFocus());
    fireEvent.click(closeButton);

    await waitFor(() =>
      expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open'),
    );
    expect(toggle).toHaveFocus();
  });

  it('opens and closes safely under React Strict Mode', async () => {
    render(
      <StrictMode>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </StrictMode>,
    );

    const toggle = screen.getByRole('button', { name: 'Menü öffnen' });
    fireEvent.click(toggle);
    const dialog = await screen.findByRole('dialog', { name: 'Mobile Navigation' });
    await waitFor(() => expect(dialog).toHaveAttribute('open'));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Menü schließen' })).toHaveFocus());

    fireEvent.click(screen.getByRole('button', { name: 'Menü schließen' }));
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    expect(toggle).toHaveFocus();
  });

  it('returns focus to the dialog when script-driven focus escapes', async () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    const closeButton = await screen.findByRole('button', { name: 'Menü schließen' });
    await waitFor(() => expect(closeButton).toHaveFocus());
    screen.getByTestId('outside-control').focus();

    await waitFor(() => expect(closeButton).toHaveFocus());
  });

  it('closes the dialog when a navigation link is selected', async () => {
    renderHeader();

    const toggle = screen.getByRole('button', { name: 'Menü öffnen' });
    fireEvent.click(toggle);
    const link = await screen.findByRole('link', { name: 'Anfragen ↗' });
    fireEvent.click(link);

    await waitFor(() =>
      expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute('open'),
    );
    expect(toggle).toHaveFocus();
  });

  it('exposes the menu links inside a labelled navigation landmark', async () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    expect(await screen.findByRole('navigation', { name: 'Menü' })).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-label', 'Mobile Navigation');
  });
});
