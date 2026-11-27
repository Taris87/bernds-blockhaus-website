import { act } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { SiteLayout } from './SiteLayout';

beforeEach(() => {
  // JSDOM has no matchMedia. Reporting reduced motion keeps GSAP out of the
  // layout tests; only the router focus behavior is under test here.
  vi.stubGlobal(
    'matchMedia',
    (query: string): MediaQueryList =>
      ({
        matches: true,
        media: query,
        onchange: null,
        addEventListener: () => undefined,
        removeEventListener: () => undefined,
        addListener: () => undefined,
        removeListener: () => undefined,
        dispatchEvent: () => false,
      }) as MediaQueryList,
  );
});

function renderLayout(initialEntry = '/galerie') {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <SiteLayout />,
        children: [
          { index: true, element: <h1>Startseite</h1> },
          {
            path: 'galerie',
            element: (
              <>
                <h1>Galerie</h1>
                <button type="button">Filter</button>
                <section id="bilder" tabIndex={-1}>
                  Bilder
                </section>
              </>
            ),
          },
        ],
      },
    ],
    { initialEntries: [initialEntry] },
  );
  render(<RouterProvider router={router} />);
  return router;
}

describe('SiteLayout focus management on navigation', () => {
  it('does not move focus to main on initial render', () => {
    renderLayout();
    expect(screen.getByRole('main')).not.toHaveFocus();
  });

  it('keeps focus in place when only the query string changes', async () => {
    const router = renderLayout();
    const control = screen.getByRole('button', { name: 'Filter' });
    control.focus();

    await act(() => router.navigate('/galerie?ansicht=raster'));

    expect(router.state.location.pathname).toBe('/galerie');
    expect(router.state.location.search).toBe('?ansicht=raster');
    expect(control).toHaveFocus();
    expect(screen.getByRole('main')).not.toHaveFocus();
  });

  it('keeps focus in place when only the hash changes', async () => {
    const router = renderLayout();
    const control = screen.getByRole('button', { name: 'Filter' });
    control.focus();

    await act(() => router.navigate('/galerie#bilder'));

    expect(router.state.location.pathname).toBe('/galerie');
    expect(router.state.location.hash).toBe('#bilder');
    expect(control).toHaveFocus();
    expect(screen.getByRole('main')).not.toHaveFocus();
  });

  it('keeps focus in place when query and hash change together', async () => {
    const router = renderLayout('/galerie?ansicht=liste');
    const control = screen.getByRole('button', { name: 'Filter' });
    control.focus();

    await act(() => router.navigate('/galerie?ansicht=raster#bilder'));

    expect(control).toHaveFocus();
    expect(screen.getByRole('main')).not.toHaveFocus();
  });

  it('moves focus to main when the pathname changes', async () => {
    const router = renderLayout();
    screen.getByRole('button', { name: 'Filter' }).focus();

    await act(() => router.navigate('/'));

    expect(screen.getByRole('heading', { name: 'Startseite' })).toBeVisible();
    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('moves focus to main after a query change followed by a pathname change', async () => {
    const router = renderLayout();
    const control = screen.getByRole('button', { name: 'Filter' });
    control.focus();

    await act(() => router.navigate('/galerie?ansicht=raster'));
    expect(control).toHaveFocus();

    await act(() => router.navigate('/?quelle=galerie'));
    expect(screen.getByRole('main')).toHaveFocus();
  });
});
