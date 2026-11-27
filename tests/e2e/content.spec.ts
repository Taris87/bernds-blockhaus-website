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

for (const width of [375, 600, 768, 1440]) {
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
        // The framed hero photo is hidden (display: none) below 1024px.
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
