import type { ReactElement } from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { ContactPage } from './ContactPage';
import { ImprintPage } from './LegalPage';
import { EichwieserhofPage } from './EichwieserhofPage';
import { ApartmentsPage } from './ApartmentsPage';
import { GastronomyPage } from './GastronomyPage';

function renderPage(page: ReactElement) {
  return render(<MemoryRouter>{page}</MemoryRouter>);
}

describe('content taken over from the former website', () => {
  it('contact page lists all three contact persons with working links', () => {
    renderPage(<ContactPage />);
    const cards = screen.getAllByRole('listitem');
    expect(cards).toHaveLength(3);

    const [blockhaus, horses, angus] = cards as [
      HTMLElement,
      HTMLElement,
      HTMLElement,
    ];
    expect(
      within(blockhaus).getByRole('heading', { name: 'Tanja Schellhaas' }),
    ).toBeVisible();
    expect(
      within(blockhaus).getByRole('link', { name: 'ts@eichwieserhof.de' }),
    ).toHaveAttribute('href', 'mailto:ts@eichwieserhof.de');
    expect(
      within(blockhaus).getByRole('link', { name: '06374-992911' }),
    ).toHaveAttribute('href', 'tel:+496374992911');
    expect(
      within(horses).getByRole('heading', { name: 'Anna Schellhaas' }),
    ).toBeVisible();
    expect(
      within(horses).getByRole('link', { name: '0176-85072834' }),
    ).toBeVisible();
    expect(
      within(angus).getByRole('heading', { name: 'Bernd Schellhaas' }),
    ).toBeVisible();
    expect(
      within(angus).getByText('Eichwieserhof 4, 67685 Weilerbach'),
    ).toBeVisible();
    expect(
      within(angus).getByRole('link', { name: 'bs@eichwieserhof.de' }),
    ).toBeVisible();
  });

  it('imprint names the operator, address and contact details', () => {
    renderPage(<ImprintPage />);
    expect(
      screen.getByRole('heading', { name: 'Tanja und Bernd Schellhaas GbR' }),
    ).toBeVisible();
    expect(screen.getByText(/Eichwieserhof 10/)).toBeVisible();
    expect(screen.getByText(/67685 Weilerbach/)).toBeVisible();
    expect(screen.getByRole('link', { name: '06374-992911' })).toBeVisible();
    expect(
      screen.getByRole('link', { name: 'bs@eichwieserhof.de' }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: 'Haftungsausschluss' }),
    ).toBeVisible();
    expect(document.body.textContent).not.toContain('PLATZHALTER');
  });

  it('Eichwieserhof page shows stallions, sale horses with their status date, Angus and beef order', () => {
    renderPage(<EichwieserhofPage />);
    expect(screen.getByText('Stand: März 2021')).toBeVisible();
    for (const name of [
      'Kann fra Haga',
      'Galsi vom Sommerberg',
      'Flekkur v.d. Sickingerhöhe',
    ]) {
      expect(screen.getByRole('heading', { name })).toBeVisible();
    }
    const horseNames = screen
      .getAllByRole('heading', { level: 4 })
      .map((heading) => heading.textContent);
    expect(horseNames).toHaveLength(12);
    expect(horseNames).toContain('Draumur v. Eichwieserhof');
    expect(screen.getByRole('heading', { name: 'Anguszucht.' })).toBeVisible();
    expect(
      screen.getByText(/feste Klauen, die ihnen eine ganzjährige Weidehaltung/),
    ).toBeVisible();
    expect(
      screen.getByText('Rindfleisch nur auf Vorbestellung!'),
    ).toBeVisible();
    expect(screen.getByRole('link', { name: '06374/992911' })).toHaveAttribute(
      'href',
      'tel:+496374992911',
    );
  });

  it('apartments page shows both apartments with size and prices', () => {
    renderPage(<ApartmentsPage />);
    const big = screen.getByRole('article', {
      name: 'Große Ferienwohnung (Süd)',
    });
    // Size is shown as counter (number + unit), beds as separate fact.
    expect(within(big).getByText('60')).toBeVisible();
    expect(within(big).getByText('qm')).toBeVisible();
    expect(within(big).getByText('bis zu 5 Betten')).toBeVisible();
    expect(within(big).getByText('85,- € pro Nacht')).toBeVisible();
    expect(within(big).getByText('15,- € pro Nacht')).toBeVisible();
    const small = screen.getByRole('article', {
      name: 'Kleine Ferienwohnung (Nord)',
    });
    expect(within(small).getByText('30')).toBeVisible();
    expect(within(small).getByText('bis zu 2 Betten')).toBeVisible();
    expect(within(small).getByText('70,- € pro Nacht')).toBeVisible();
  });

  it('gastronomy page shows opening hours and reservation phone without the expired holiday notice', () => {
    renderPage(<GastronomyPage />);
    expect(screen.getByText('Freitag')).toBeVisible();
    expect(screen.getByText('ab 15:00 Uhr')).toBeVisible();
    expect(
      screen.getByRole('link', { name: /Reservieren: 06374-992911/ }),
    ).toBeVisible();
    expect(document.body.textContent).not.toMatch(/Betriebsurlaub/);
  });

  it('every photo has an alt text and fixed dimensions', () => {
    renderPage(<EichwieserhofPage />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(10);
    for (const image of images) {
      expect(image.getAttribute('alt')).toBeTruthy();
      expect(Number(image.getAttribute('width'))).toBeGreaterThan(0);
      expect(Number(image.getAttribute('height'))).toBeGreaterThan(0);
    }
  });
});
