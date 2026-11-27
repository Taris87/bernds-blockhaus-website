import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MenuTabs } from './MenuTabs';
import { menuCategories } from '../../data/menu';

const expectedCategories = [
  'Kalte Gerichte',
  'Platten',
  'Salatvariationen',
  'Burger',
  'Käse',
  'Pfälzer Gerichte',
  'Schnitzel & Steaks',
  'Wildgerichte',
  'Tageskarte',
];

describe('MenuTabs', () => {
  it('offers one tab per category of the former menu', () => {
    render(<MenuTabs categories={menuCategories} />);
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((tab) => tab.textContent)).toEqual(expectedCategories);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });

  it('renders every dish of every category when its tab is selected', () => {
    render(<MenuTabs categories={menuCategories} />);
    for (const category of menuCategories) {
      fireEvent.click(screen.getByRole('tab', { name: category.title }));
      const panel = screen.getByRole('tabpanel', { name: category.title });
      const items = within(panel)
        .getAllByRole('listitem')
        .map((item) => item.textContent);
      expect(items).toEqual(category.items);
    }
  });

  it('moves between tabs with the arrow, Home and End keys', () => {
    render(<MenuTabs categories={menuCategories} />);
    const first = screen.getByRole('tab', { name: 'Kalte Gerichte' });
    fireEvent.keyDown(first, { key: 'ArrowRight' });
    const second = screen.getByRole('tab', { name: 'Platten' });
    expect(second).toHaveAttribute('aria-selected', 'true');
    expect(second).toHaveFocus();
    expect(second).toHaveAttribute('tabindex', '0');
    expect(first).toHaveAttribute('tabindex', '-1');

    fireEvent.keyDown(second, { key: 'End' });
    expect(screen.getByRole('tab', { name: 'Tageskarte' })).toHaveFocus();
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Tageskarte' }), {
      key: 'ArrowRight',
    });
    expect(screen.getByRole('tab', { name: 'Kalte Gerichte' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
    fireEvent.keyDown(screen.getByRole('tab', { name: 'Kalte Gerichte' }), {
      key: 'ArrowLeft',
    });
    expect(screen.getByRole('tab', { name: 'Tageskarte' })).toHaveAttribute(
      'aria-selected',
      'true',
    );
  });

  it('shows the category notes and publishes no invented prices', () => {
    render(<MenuTabs categories={menuCategories} />);
    fireEvent.click(screen.getByRole('tab', { name: 'Schnitzel & Steaks' }));
    expect(
      screen.getByText(/mit Bratkartoffeln oder Kroketten erhältlich/),
    ).toBeInTheDocument();
    const allText = menuCategories
      .flatMap((category) => category.items)
      .join(' ');
    expect(allText).not.toMatch(/€|EUR|\d+,\d{2}/);
  });
});
