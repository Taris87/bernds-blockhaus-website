import { expect, test, type Page } from '@playwright/test';

const pagesBase = '/bernds-blockhaus-website';

/**
 * Navigates within the SPA without a document reload: pushState updates the
 * URL and the popstate event lets React Router pick up the new location (POP),
 * exactly as it does for browser back/forward.
 */
async function routerNavigate(page: Page, url: string) {
  await page.evaluate((target) => {
    window.history.pushState(null, '', target);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, url);
}

async function markDocument(page: Page) {
  await page.evaluate(() => {
    (window as Window & { __sameDocument?: boolean }).__sameDocument = true;
  });
}

async function isSameDocument(page: Page) {
  return page.evaluate(
    () =>
      (window as Window & { __sameDocument?: boolean }).__sameDocument === true,
  );
}

async function scrollToBottom(page: Page) {
  await page.evaluate(() =>
    window.scrollTo(0, document.documentElement.scrollHeight),
  );
  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(200);
  return page.evaluate(() => window.scrollY);
}

/**
 * Waits two animation frames plus a short grace period. scroll-behavior is
 * smooth on this site, so an unwanted programmatic scroll would only become
 * visible after it has had time to start.
 */
async function settle(page: Page) {
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(() => setTimeout(resolve, 400)),
        ),
      ),
  );
}

test.describe('same-route navigation (QA-043)', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 600 });
    await page.goto(`${pagesBase}/galerie`);
    await expect(page.getByRole('main')).toBeVisible();
    await markDocument(page);
  });

  test('query change keeps scroll position and focus', async ({ page }) => {
    const scrollBefore = await scrollToBottom(page);
    const footerLink = page.getByRole('contentinfo').getByRole('link').last();
    await footerLink.focus();

    await routerNavigate(page, `${pagesBase}/galerie?ansicht=raster`);
    await settle(page);

    await expect(page).toHaveURL(/\/galerie\?ansicht=raster$/);
    expect(await isSameDocument(page)).toBe(true);
    await expect(footerLink).toBeFocused();
    await expect(page.getByRole('main')).not.toBeFocused();
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
  });

  test('native hash navigation scrolls to and focuses the target without a reload', async ({
    page,
  }) => {
    const scrollBefore = await scrollToBottom(page);
    const footerLink = page.getByRole('contentinfo').getByRole('link').last();
    await footerLink.focus();

    await page.evaluate(() => {
      window.location.hash = 'main';
    });

    await expect(page).toHaveURL(/\/galerie#main$/);
    expect(await isSameDocument(page)).toBe(true);
    // scroll-behavior is smooth, so wait until the target has arrived at the top.
    await expect
      .poll(() =>
        page
          .getByRole('main')
          .evaluate((element) => Math.abs(element.getBoundingClientRect().top)),
      )
      .toBeLessThan(2);
    expect(await page.evaluate(() => window.scrollY)).toBeLessThan(
      scrollBefore,
    );
    // Chromium focuses a focusable fragment target (main has tabindex="-1").
    // This is browser behavior; the app adds no extra focus handling for hashes.
    await expect(page.getByRole('main')).toBeFocused();
  });

  test('router hash change keeps focus and scroll position for the app', async ({
    page,
  }) => {
    const scrollBefore = await scrollToBottom(page);
    const footerLink = page.getByRole('contentinfo').getByRole('link').last();
    await footerLink.focus();

    await routerNavigate(page, `${pagesBase}/galerie?ansicht=raster#bilder`);
    await settle(page);

    await expect(page).toHaveURL(/\/galerie\?ansicht=raster#bilder$/);
    expect(await isSameDocument(page)).toBe(true);
    await expect(footerLink).toBeFocused();
    await expect(page.getByRole('main')).not.toBeFocused();
    expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);
  });

  test('skip link reaches main via hash and continues keyboard navigation there', async ({
    page,
  }) => {
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Zum Inhalt springen' });
    await expect(skipLink).toBeFocused();

    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/galerie#main$/);
    expect(await isSameDocument(page)).toBe(true);

    await page.keyboard.press('Tab');
    const focusedInMain = await page.evaluate(
      () =>
        document.querySelector('#main')?.contains(document.activeElement) ??
        false,
    );
    expect(focusedInMain).toBe(true);
  });

  test('pathname change still moves focus to main', async ({ page }) => {
    await page
      .getByRole('navigation', { name: 'Hauptnavigation' })
      .getByRole('link', { name: /Gaststätte/ })
      .click();

    await expect(page).toHaveURL(/\/gaststaette\/?$/);
    expect(await isSameDocument(page)).toBe(true);
    await expect(page.getByRole('main')).toBeFocused();
  });

  test('pathname change after a query change still moves focus to main', async ({
    page,
  }) => {
    await routerNavigate(page, `${pagesBase}/galerie?ansicht=raster`);
    await settle(page);
    await expect(page.getByRole('main')).not.toBeFocused();

    await routerNavigate(page, `${pagesBase}/kontakt`);
    await expect(page).toHaveURL(/\/kontakt$/);
    await expect(page.getByRole('main')).toBeFocused();
  });
});
