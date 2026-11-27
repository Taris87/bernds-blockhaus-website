import { act } from 'react';
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type Mock,
  type MockInstance,
} from 'vitest';
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

let scrollTo: Mock<typeof window.scrollTo>;
let scrollIntoView: Mock<Element['scrollIntoView']>;
let focusSpy: MockInstance<HTMLElement['focus']>;

beforeEach(() => {
  scrollTo = vi.fn<typeof window.scrollTo>();
  vi.stubGlobal('scrollTo', scrollTo);
  scrollIntoView = vi.fn<Element['scrollIntoView']>();
  Element.prototype.scrollIntoView = scrollIntoView;
  focusSpy = vi.spyOn(HTMLElement.prototype, 'focus');
  setScrollY(0);
});

afterEach(() => {
  focusSpy.mockRestore();
  vi.unstubAllGlobals();
});

/** JSDOM does not scroll; simulate a user scroll position plus its event. */
function setScrollY(value: number) {
  Object.defineProperty(window, 'scrollY', {
    configurable: true,
    value,
  });
  window.dispatchEvent(new Event('scroll'));
}

function renderLayout(initialEntry = '/galerie') {
  const router = createMemoryRouter(
    [
      {
        path: '/',
        element: <SiteLayout />,
        children: [
          {
            index: true,
            element: (
              <>
                <h1>Startseite</h1>
                <section id="willkommen">Willkommen</section>
              </>
            ),
          },
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

describe('SiteLayout scroll handling on navigation (QA-107)', () => {
  const toTop = { top: 0, left: 0, behavior: 'instant' };

  it('does not scroll on initial render', () => {
    renderLayout();
    expect(scrollTo).not.toHaveBeenCalled();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('jumps instantly to the top and focuses main without scrolling when the pathname changes', async () => {
    const router = renderLayout();
    setScrollY(1800);

    await act(() => router.navigate('/'));

    expect(scrollTo).toHaveBeenCalledTimes(1);
    expect(scrollTo).toHaveBeenCalledWith(toTop);
    const main = screen.getByRole('main');
    expect(main).toHaveFocus();
    expect(focusSpy.mock.contexts).toContain(main);
    expect(focusSpy).toHaveBeenLastCalledWith({ preventScroll: true });
  });

  it('jumps to the top on a replace navigation to a new pathname', async () => {
    const router = renderLayout();
    setScrollY(900);

    await act(() => router.navigate('/', { replace: true }));

    expect(scrollTo).toHaveBeenCalledWith(toTop);
  });

  it('scrolls to the hash target instead of the top for a new pathname with hash', async () => {
    const router = renderLayout();
    setScrollY(1800);

    await act(() => router.navigate('/#willkommen'));

    expect(scrollTo).not.toHaveBeenCalled();
    expect(scrollIntoView).toHaveBeenCalledTimes(1);
    expect(scrollIntoView.mock.contexts[0]).toBe(
      document.getElementById('willkommen'),
    );
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'instant',
      block: 'start',
    });
    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('falls back to the top when the hash target does not exist', async () => {
    const router = renderLayout();

    await act(() => router.navigate('/#gibt-es-nicht'));

    expect(scrollIntoView).not.toHaveBeenCalled();
    expect(scrollTo).toHaveBeenCalledWith(toTop);
  });

  it('does not scroll when only the query string changes', async () => {
    const router = renderLayout();
    setScrollY(1200);

    await act(() => router.navigate('/galerie?ansicht=raster'));

    expect(scrollTo).not.toHaveBeenCalled();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('does not scroll when only the hash changes', async () => {
    const router = renderLayout();
    setScrollY(1200);

    await act(() => router.navigate('/galerie#bilder'));
    await act(() => router.navigate('/galerie?ansicht=raster#bilder'));

    expect(scrollTo).not.toHaveBeenCalled();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('restores the previous position on back navigation (POP)', async () => {
    const router = renderLayout();
    setScrollY(1500);

    await act(() => router.navigate('/'));
    expect(scrollTo).toHaveBeenLastCalledWith(toTop);
    setScrollY(0);

    await act(() => router.navigate(-1));

    expect(router.state.location.pathname).toBe('/galerie');
    expect(scrollTo).toHaveBeenLastCalledWith({
      top: 1500,
      left: 0,
      behavior: 'instant',
    });
    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('restores the position on forward navigation (POP)', async () => {
    const router = renderLayout();
    await act(() => router.navigate('/'));
    setScrollY(700);

    await act(() => router.navigate(-1));
    setScrollY(0);
    await act(() => router.navigate(1));

    expect(router.state.location.pathname).toBe('/');
    expect(scrollTo).toHaveBeenLastCalledWith({
      top: 700,
      left: 0,
      behavior: 'instant',
    });
  });
});
