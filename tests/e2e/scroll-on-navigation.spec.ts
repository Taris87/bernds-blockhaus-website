import { expect, test, type Page } from '@playwright/test';

const pagesBase = '/bernds-blockhaus-website';

const viewports = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'desktop', width: 1440, height: 900 },
] as const;

function scrollY(page: Page) {
  return page.evaluate(() => window.scrollY);
}

/** Scrolls far down the long page and waits until the position is reached. */
async function scrollFarDown(page: Page) {
  await page.evaluate(() =>
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'instant',
    }),
  );
  await expect.poll(() => scrollY(page)).toBeGreaterThan(1000);
  // Let the scroll event fire so the position is recorded for this entry.
  await page.evaluate(
    () =>
      new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      ),
  );
  return scrollY(page);
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

/**
 * Records the largest scrollY seen until the next check. A smooth scroll to
 * the top would pass through intermediate positions; an instant jump does not.
 */
async function trackScroll(page: Page) {
  await page.evaluate(() => {
    const w = window as Window & { __scrollSamples?: number[] };
    w.__scrollSamples = [];
    window.addEventListener(
      'scroll',
      () => w.__scrollSamples?.push(window.scrollY),
      { passive: true },
    );
  });
}

async function intermediateScrollSamples(page: Page) {
  return page.evaluate(() =>
    (
      (window as Window & { __scrollSamples?: number[] }).__scrollSamples ?? []
    ).filter((y) => y > 0),
  );
}

async function expectAtTopWithMainFocused(page: Page) {
  await expect.poll(() => scrollY(page)).toBe(0);
  await expect(page.getByRole('main')).toBeFocused();
  expect(await isSameDocument(page)).toBe(true);
}

test.describe('new page starts at the top (QA-107)', () => {
  for (const viewport of viewports) {
    test.describe(`${viewport.name} ${viewport.width}px`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        await page.goto(`${pagesBase}/eichwieserhof`);
        await expect(page.getByRole('main')).toBeVisible();
        await markDocument(page);
      });

      test('header navigation link opens the new page at the top', async ({
        page,
      }) => {
        await scrollFarDown(page);
        await trackScroll(page);

        if (viewport.width < 768) {
          await page.getByRole('button', { name: 'Menü öffnen' }).click();
          await page
            .locator('#mobile-navigation')
            .getByRole('link', { name: /Gaststätte/ })
            .click();
        } else {
          await page
            .getByRole('navigation', { name: 'Hauptnavigation' })
            .getByRole('link', { name: /Gaststätte/ })
            .click();
        }

        await expect(page).toHaveURL(/\/gaststaette\/?$/);
        await expectAtTopWithMainFocused(page);
        // Instant jump: no smooth-scroll frames between the old position and 0.
        expect(await intermediateScrollSamples(page)).toEqual([]);
      });

      test('footer link opens the new page at the top', async ({ page }) => {
        await scrollFarDown(page);
        await trackScroll(page);

        await page
          .getByRole('contentinfo')
          .getByRole('link', { name: 'Ferienwohnungen' })
          .click();

        await expect(page).toHaveURL(/\/ferienwohnungen\/?$/);
        await expectAtTopWithMainFocused(page);
        expect(await intermediateScrollSamples(page)).toEqual([]);
      });

      test('back restores the previous position, forward the next one', async ({
        page,
      }) => {
        const leftAt = await scrollFarDown(page);

        await page
          .getByRole('contentinfo')
          .getByRole('link', { name: 'Gaststätte' })
          .click();
        await expect(page).toHaveURL(/\/gaststaette\/?$/);
        await expectAtTopWithMainFocused(page);

        await page.goBack();
        await expect(page).toHaveURL(/\/eichwieserhof\/?$/);
        await expect.poll(() => scrollY(page)).toBeGreaterThan(leftAt - 2);
        expect(await scrollY(page)).toBeLessThan(leftAt + 2);
        await expect(page.getByRole('main')).toBeFocused();

        await page.goForward();
        await expect(page).toHaveURL(/\/gaststaette\/?$/);
        await expectAtTopWithMainFocused(page);
      });
    });
  }

  test('skip link still reaches main after a page change', async ({ page }) => {
    await page.goto(`${pagesBase}/eichwieserhof`);
    await markDocument(page);
    await scrollFarDown(page);
    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: 'Gaststätte' })
      .click();
    await expectAtTopWithMainFocused(page);

    await page.getByRole('link', { name: 'Zum Inhalt springen' }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/gaststaette#main$/);
    expect(await isSameDocument(page)).toBe(true);
    await expect(page.getByRole('main')).toBeFocused();
  });

  test('reduced motion: page change still jumps to the top', async ({
    page,
  }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${pagesBase}/eichwieserhof`);
    await markDocument(page);
    await scrollFarDown(page);

    await page
      .getByRole('contentinfo')
      .getByRole('link', { name: 'Ferienwohnungen' })
      .click();

    await expect(page).toHaveURL(/\/ferienwohnungen\/?$/);
    await expectAtTopWithMainFocused(page);
  });
});
