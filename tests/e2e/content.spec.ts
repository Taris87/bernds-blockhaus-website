import { expect, test } from '@playwright/test';

const base = '/bernds-blockhaus-website';
const routes = [
  '/',
  '/gaststaette',
  '/ferienwohnungen',
  '/galerie',
  '/eichwieserhof',
  '/kontakt',
];

for (const width of [320, 375, 600, 768, 1100, 1440]) {
  for (const route of routes) {
    test(`all photos on ${route} at ${width}px load with alt text and are not upscaled beyond 1.5x`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}${route}`);
      await expect(page.locator('main h1')).toBeVisible();

      const images = page.locator('main img');
      const count = await images.count();
      expect(count, `photos on ${route}`).toBeGreaterThan(0);

      for (let index = 0; index < count; index += 1) {
        const image = images.nth(index);
        // Hidden images (e.g. the menu photo below 1100px) are skipped.
        if (!(await image.isVisible())) continue;
        await image.scrollIntoViewIfNeeded();
        await expect
          .poll(() =>
            image.evaluate(
              (element: HTMLImageElement) =>
                element.complete && element.naturalWidth > 0,
            ),
          )
          .toBe(true);
        const info = await image.evaluate((element: HTMLImageElement) => {
          const box = element.getBoundingClientRect();
          const scale = Math.max(
            box.width / element.naturalWidth,
            box.height / element.naturalHeight,
          );
          return { alt: element.alt, scale, src: element.currentSrc };
        });
        expect(info.alt, info.src).not.toBe('');
        expect(
          info.scale,
          `${info.src} scaled ${info.scale.toFixed(2)}x`,
        ).toBeLessThanOrEqual(1.5);
      }
    });
  }
}

test('Eichwieserhof section links jump to the horse sale list with its status date', async ({
  page,
}) => {
  await page.goto(`${base}/eichwieserhof`);
  await page
    .getByRole('navigation', { name: 'Abschnitte dieser Seite' })
    .getByRole('link', { name: 'Verkaufspferde' })
    .click();
  await expect(page).toHaveURL(/#verkaufspferde$/);
  const section = page.locator('#verkaufspferde');
  await expect(section.getByText('Stand: März 2021')).toBeInViewport();
  await expect(section.getByRole('listitem')).toHaveCount(12);
});

test('contact page offers phone and e-mail links for every contact person', async ({
  page,
}) => {
  await page.goto(`${base}/kontakt`);
  const cards = page.locator('.contact-card');
  await expect(cards).toHaveCount(3);
  for (const [name, email] of [
    ['Tanja Schellhaas', 'ts@eichwieserhof.de'],
    ['Anna Schellhaas', 'anna@eichwieserhof.de'],
    ['Bernd Schellhaas', 'bs@eichwieserhof.de'],
  ] as const) {
    const card = cards.filter({ has: page.getByRole('heading', { name }) });
    await expect(card.getByRole('link', { name: email })).toHaveAttribute(
      'href',
      `mailto:${email}`,
    );
    await expect(card.getByRole('link', { name: /^0/ })).toHaveAttribute(
      'href',
      /^tel:\+49\d+$/,
    );
  }
});

test('home hero shows the photo collage within the first mobile viewport', async ({
  page,
}) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${base}/`);
  const heroPhoto = page.locator('.hero-collage .slot-a img');
  await expect(heroPhoto).toBeVisible();
  await expect(heroPhoto).toHaveAttribute('loading', 'eager');
  const box = await heroPhoto.boundingBox();
  expect(box).not.toBeNull();
  expect(box!.y, 'collage photo starts inside the first viewport').toBeLessThan(812);
  await expect
    .poll(() =>
      heroPhoto.evaluate(
        (element: HTMLImageElement) =>
          element.complete && element.naturalWidth > 0,
      ),
    )
    .toBe(true);
});

test('home page shows the hero slogan only once', async ({ page }) => {
  await page.goto(`${base}/`);
  await expect(page.locator('main h1')).toContainText('Ankommen.');
  await expect(page.getByText(/Ein Platz zum Bleiben/)).toHaveCount(0);
  await expect(page.locator('main').getByText('Wohlfühlen.', { exact: false })).toHaveCount(1);
});

for (const route of [...routes, '/impressum', '/datenschutz']) {
  test(`heading levels on ${route} start at h1 and never skip a level`, async ({
    page,
  }) => {
    await page.goto(`${base}${route}`);
    await expect(page.locator('main h1')).toBeVisible();
    const levels = await page
      .locator('main :is(h1, h2, h3, h4, h5, h6)')
      .evaluateAll((headings) =>
        headings.map((heading) => Number(heading.tagName.slice(1))),
      );
    expect(levels[0]).toBe(1);
    if (routes.includes(route)) {
      expect(levels, `content page ${route} has an h2`).toContain(2);
    }
    levels.forEach((level, index) => {
      if (index === 0) return;
      expect(
        level - levels[index - 1]!,
        `h${levels[index - 1]} -> h${level} on ${route}`,
      ).toBeLessThanOrEqual(1);
    });
  });
}
