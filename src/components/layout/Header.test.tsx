import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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
    <>
      <button type="button" data-testid="outside-control">Outside</button>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </>,
  );
}

describe('Header mobile navigation', () => {
  it('opens the native modal dialog and moves focus to the close button', () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));

    const dialog = screen.getByRole('dialog', { name: 'Mobile Navigation' });
    expect(dialog).toHaveAttribute('open');
    expect(
      screen.getByRole('button', { name: 'Menü schließen' }),
    ).toHaveFocus();
  });

  it('uses native sequential focus order for Tab and Shift+Tab', async () => {
    const user = userEvent.setup();
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    const closeButton = screen.getByRole('button', { name: 'Menü schließen' });
    const links = screen.getAllByRole('link', { name: /Gaststätte|Ferienwohnungen|Eichwieserhof|Anfragen/ });

    expect(closeButton).toHaveFocus();
    await user.tab();
    expect(links[0]).toHaveFocus();
    await user.tab({ shift: true });
    expect(closeButton).toHaveFocus();
  });

  it('closes the dialog with Escape and returns focus to the toggle button', () => {
    renderHeader();

    const toggle = screen.getByRole('button', { name: 'Menü öffnen' });
    fireEvent.click(toggle);

    fireEvent(
      screen.getByRole('dialog', { name: 'Mobile Navigation' }),
      new Event('cancel', { bubbles: false, cancelable: true }),
    );

    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute(
      'open',
    );
    expect(toggle).toHaveFocus();
  });

  it('closes the dialog and restores focus when the close button is selected', () => {
    renderHeader();

    const toggle = screen.getByRole('button', { name: 'Menü öffnen' });
    fireEvent.click(toggle);
    fireEvent.click(screen.getByRole('button', { name: 'Menü schließen' }));

    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute(
      'open',
    );
    expect(toggle).toHaveFocus();
  });

  it('opens and closes safely under React Strict Mode', () => {
    render(
      <StrictMode>
        <MemoryRouter>
          <Header />
        </MemoryRouter>
      </StrictMode>,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    expect(
      screen.getByRole('dialog', { name: 'Mobile Navigation' }),
    ).toHaveAttribute('open');

    fireEvent.click(screen.getByRole('button', { name: 'Menü schließen' }));
    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute(
      'open',
    );
  });

  it('returns focus to the dialog when script-driven focus escapes', () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    const closeButton = screen.getByRole('button', { name: 'Menü schließen' });

    screen.getByTestId('outside-control').focus();

    expect(closeButton).toHaveFocus();
  });

  it('closes the dialog when a navigation link is selected', () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));
    fireEvent.click(screen.getByRole('link', { name: 'Anfragen ↗' }));

    expect(screen.getByRole('dialog', { hidden: true })).not.toHaveAttribute(
      'open',
    );
  });

  it('exposes the menu links inside a labelled navigation landmark', () => {
    renderHeader();

    fireEvent.click(screen.getByRole('button', { name: 'Menü öffnen' }));

    expect(screen.getByRole('navigation', { name: 'Menü' })).toBeInTheDocument();
    expect(screen.getByRole('dialog')).toHaveAttribute(
      'aria-label',
      'Mobile Navigation',
    );
  });
});
