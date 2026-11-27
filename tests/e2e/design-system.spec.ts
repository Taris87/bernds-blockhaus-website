import { expect, test, type Page } from '@playwright/test';

const base = '/bernds-blockhaus-website';

const allRoutes = [
  '/',
  '/gaststaette',
  '/ferienwohnungen',
  '/galerie',
  '/eichwieserhof',
  '/kontakt',
  '/impressum',
  '/datenschutz',
  '/gibt-es-nicht',
];

async function horizontalOverflow(page: Page) {
  return page.evaluate(
    () =>
      document.documentElement.scrollWidth -
      document.documentElement.clientWidth,
  );
}

test('self-hosted fonts are loaded and used (no system fallback)', async ({
  page,
}) => {
  const fontRequests: string[] = [];
  page.on('request', (request) => {
    if (/\.woff2(\?|$)/.test(request.url())) fontRequests.push(request.url());
  });
  await page.goto(`${base}/`);
  await page.evaluate(() => document.fonts.ready);

  const loaded = await page.evaluate(async () => {
    await document.fonts.ready;
    return [...document.fonts]
      .filter((face) => face.status === 'loaded')
      .map((face) => `${face.family.replace(/"/g, '')}|${face.style}`);
  });
  expect(loaded).toEqual(
    expect.arrayContaining([
      'Fraunces Variable|normal',
      'Fraunces Variable|italic',
      'Barlow Condensed|normal',
      'DM Sans Variable|normal',
    ]),
  );
  // Fonts come from the own origin, never from a third-party CDN.
  expect(fontRequests.length).toBeGreaterThanOrEqual(4);
  for (const url of fontRequests) {
    expect(new URL(url).host).toBe('127.0.0.1:4173');
  }

  const families = await page.evaluate(() => ({
    h1: getComputedStyle(document.querySelector('main h1')!).fontFamily,
    body: getComputedStyle(document.body).fontFamily,
    nav: getComputedStyle(document.querySelector('.sign')!).fontFamily,
  }));
  expect(families.h1).toMatch(/^"?Fraunces Variable/);
  expect(families.body).toMatch(/^"?DM Sans Variable/);
  expect(families.nav).toMatch(/^"?Barlow Condensed/);
});

for (const route of allRoutes) {
  test(`no horizontal overflow at 320px on ${route}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.goto(`${base}${route}`);
    await expect(page.locator('main h1')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    expect(await horizontalOverflow(page)).toBe(0);
  });
}

test.describe('gallery masonry', () => {
  test('visual order follows DOM order (row-wise, not column-wise)', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${base}/galerie`);
    const masonry = page.locator('.masonry');
    await expect(masonry).toBeVisible();
    expect(
      await masonry.evaluate((element) => {
        const style = getComputedStyle(element);
        return { display: style.display, columns: style.columnCount };
      }),
    ).toEqual({ display: 'grid', columns: 'auto' });

    const boxes = await page
      .locator('.masonry > li')
      .evaluateAll((tiles) =>
        tiles.map((tile) => {
          const box = tile.getBoundingClientRect();
          return { top: Math.round(box.top), left: Math.round(box.left) };
        }),
      );
    expect(boxes.length).toBe(40); // 39 photos + opening-hours tile
    // Four columns side by side in the first row.
    expect(boxes.slice(0, 4).every((box) => box.top === boxes[0]!.top)).toBe(
      true,
    );
    for (let index = 1; index < boxes.length; index += 1) {
      const previous = boxes[index - 1]!;
      const current = boxes[index]!;
      const readsOn =
        current.top > previous.top ||
        (current.top === previous.top && current.left > previous.left);
      expect(readsOn, `tile ${index + 1} comes after tile ${index}`).toBe(true);
    }
  });

  test('photos keep their aspect ratio (no cropping)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${base}/galerie`);
    const ratios = await page
      .locator('.masonry img')
      .evaluateAll((images) =>
        (images as HTMLImageElement[]).map((image) => {
          const box = image.getBoundingClientRect();
          return Math.abs(
            box.width / box.height -
              Number(image.getAttribute('width')) /
                Number(image.getAttribute('height')),
          );
        }),
      );
    for (const difference of ratios) expect(difference).toBeLessThan(0.02);
  });

  test('filter chips use the query string and never jump to the top', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${base}/galerie`);
    const tiles = page.locator('.masonry-tile:not(.masonry-note)');
    await expect(tiles).toHaveCount(39);

    await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(900);
    await page.evaluate(() => {
      const log: number[] = [];
      (window as Window & { __scrolls?: number[] }).__scrolls = log;
      window.addEventListener('scroll', () => log.push(window.scrollY));
    });

    const chip = page.getByRole('button', { name: /Küche & Feiern/ });
    await expect(chip).toHaveAttribute('aria-pressed', 'false');
    // Keyboard activation: Playwright's click() would scroll the sticky chip
    // to its static position first, which is not what a user does.
    await chip.focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/galerie\?kategorie=kueche-feiern$/);
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await expect(chip).toBeFocused();
    await expect(tiles).toHaveCount(16);
    await expect(page.locator('.gallery-count b')).toHaveText('16');
    await page.waitForTimeout(400);

    const scrolls = await page.evaluate(
      () => (window as Window & { __scrolls?: number[] }).__scrolls ?? [],
    );
    expect(scrolls.filter((y) => y < 800), 'no jump towards the top').toEqual(
      [],
    );
    // Same position (±2 px for sub-pixel scroll anchoring of the browser).
    expect(
      Math.abs((await page.evaluate(() => window.scrollY)) - 900),
    ).toBeLessThanOrEqual(2);

    await page.getByRole('button', { name: /^Alle/ }).focus();
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(/\/galerie$/);
    await expect(tiles).toHaveCount(39);
    // Same position (±2 px for sub-pixel scroll anchoring of the browser).
    expect(
      Math.abs((await page.evaluate(() => window.scrollY)) - 900),
    ).toBeLessThanOrEqual(2);

    // A real pointer click on the sticky chip keeps the position as well.
    const hof = page.getByRole('button', { name: /Hof & Tiere/ });
    const box = await hof.boundingBox();
    expect(box).not.toBeNull();
    await page.mouse.click(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await expect(page).toHaveURL(/\/galerie\?kategorie=hof-tiere$/);
    await expect(tiles).toHaveCount(7);
    expect(
      Math.abs((await page.evaluate(() => window.scrollY)) - 900),
    ).toBeLessThanOrEqual(2);
  });

  test('a filter in the URL is applied on load', async ({ page }) => {
    await page.goto(`${base}/galerie?kategorie=hof-tiere`);
    await expect(
      page.getByRole('button', { name: /Hof & Tiere/ }),
    ).toHaveAttribute('aria-pressed', 'true');
    await expect(page.locator('.masonry-tile:not(.masonry-note)')).toHaveCount(
      7,
    );
    // Unknown values fall back to all photos.
    await page.goto(`${base}/galerie?kategorie=unbekannt`);
    await expect(page.locator('.masonry-tile:not(.masonry-note)')).toHaveCount(
      39,
    );
  });

  test('lightbox navigates within the active filter and shows thumbnails', async ({
    page,
  }) => {
    await page.goto(`${base}/galerie?kategorie=ferienwohnungen`);
    await page.getByRole('button', { name: /groß anzeigen/ }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog).toHaveAttribute('aria-label', 'Große Ferienwohnung');
    await expect(dialog.locator('.lightbox-counter')).toContainText('01 / 03');
    await expect(dialog.locator('.lightbox-thumb')).toHaveCount(3);
    await dialog.getByRole('button', { name: 'Foto 3: Kleine Ferienwohnung' }).click();
    await expect(dialog).toHaveAttribute('aria-label', 'Kleine Ferienwohnung');
    await page.keyboard.press('ArrowRight');
    await expect(dialog).toHaveAttribute('aria-label', 'Große Ferienwohnung');
  });
});

test('ticker pause button toggles aria-pressed (WCAG 2.2.2)', async ({
  page,
}) => {
  await page.goto(`${base}/`);
  const marquee = page.locator('[data-marquee]');
  const toggle = page.getByRole('button', { name: 'Laufband anhalten' });
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(marquee).toHaveAttribute('data-paused', 'false');
  await toggle.click();
  await expect(toggle).toHaveAttribute('aria-pressed', 'true');
  await expect(marquee).toHaveAttribute('data-paused', 'true');
  await toggle.press('Enter');
  await expect(toggle).toHaveAttribute('aria-pressed', 'false');
  await expect(marquee).toHaveAttribute('data-paused', 'false');
  // The facts are exposed once; the loop copy is hidden from assistive tech.
  await expect(marquee.getByRole('listitem')).toHaveCount(8);
});

test('content stays visible without motion (reduced motion)', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(`${base}/`);
  for (const selector of ['main h1', '.hero-collage img', '.index-title']) {
    const opacity = await page
      .locator(selector)
      .first()
      .evaluate((element) => getComputedStyle(element).opacity);
    expect(opacity, selector).toBe('1');
  }
});
