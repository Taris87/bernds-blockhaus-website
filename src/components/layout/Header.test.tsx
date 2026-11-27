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

async function getDialog() {
  const dialog = document.querySelector<HTMLDialogElement>('#mobile-navigation');
  expect(dialog).not.toBeNull();

  await waitFor(() => expect(dialog).toHaveAttribute('open'));
  return dialog as HTMLDialogElement;
}

describe('Header mobile navigation', () => {
  it('opens the dialog and moves focus to the close button', async () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));

    const dialog = await getDialog();
    expect(dialog).toHaveAttribute('open');
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Menü schließen' })).toHaveFocus(),
    );
  });

  it('closes the dialog when the React cancel handler receives Escape', async () => {
    renderHeader();

    const toggle = screen.getByRole('button', { name: 'Menü öffnen' });
    fireEvent.click(toggle);
    const dialog = await getDialog();

    // Dispatch the cancel event to exercise React's handler, not native Escape behavior.
    fireEvent(
      dialog,
      new Event('cancel', { bubbles: false, cancelable: true }),
    );

    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes the dialog when the close button is selected', async () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    const dialog = await getDialog();

    fireEvent.click(screen.getByRole('button', { name: 'Menü schließen' }));

    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    expect(screen.getByRole('button', { name: 'Menü öffnen' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('opens and closes safely under React Strict Mode', async () => {
    render(
      <StrictMode>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </StrictMode>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    const dialog = await getDialog();
    const closeButton = screen.getByRole('button', { name: 'Menü schließen' });

    await waitFor(() => expect(closeButton).toHaveFocus());
    expect(dialog).toHaveAttribute('open');

    fireEvent.click(closeButton);
    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    expect(screen.getByRole('button', { name: 'Menü öffnen' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('returns focus to the dialog when script-driven focus escapes', async () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    const dialog = await getDialog();
    const closeButton = screen.getByRole('button', { name: 'Menü schließen' });
    await waitFor(() => expect(closeButton).toHaveFocus());

    screen.getByTestId('outside-control').focus();

    await waitFor(() => expect(closeButton).toHaveFocus());
    expect(dialog).toHaveAttribute('open');
  });

  it('closes the dialog when a navigation link is selected', async () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    const dialog = await getDialog();
    const link = screen.getByRole('link', { name: 'Anfragen ↗' });

    fireEvent.click(link);

    await waitFor(() => expect(dialog).not.toHaveAttribute('open'));
    expect(screen.getByRole('button', { name: 'Menü öffnen' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
  });

  it('exposes the menu links inside a labelled navigation landmark', async () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    await getDialog();

    expect(await screen.findByRole('navigation', { name: 'Menü' })).toBeInTheDocument();
    expect(document.querySelector('#mobile-navigation')).toHaveAttribute(
      'aria-label',
      'Mobile Navigation',
    );
  });
});
