import { expect, test } from '@playwright/test';

const base = '/bernds-blockhaus-website';
const widths = [320, 375, 390, 600, 768, 900, 1024, 1280];
const routes = [
  { path: '/', heading: /Ein Platz zum Bleiben/i },
  { path: '/gaststaette', heading: /Genuss in/i },
  { path: '/ferienwohnungen', heading: /Zeit zum/i },
  { path: '/galerie', heading: /Ein Ort voller/i },
  { path: '/eichwieserhof', heading: /Naturverbunden/i },
  { path: '/impressum', heading: /Impressum/i },
  { path: '/datenschutz', heading: /Datenschutz/i },
];

for (const width of widths) {
  test.describe(`responsive layout at ${width}px`, () => {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
    });

    for (const route of routes) {
      test(`renders ${route.path} without horizontal overflow`, async ({ page }) => {
        await page.goto(`${base}${route.path}`);
        await expect(page.getByRole('heading', { name: route.heading }).first()).toBeVisible();

        const dimensions = await page.evaluate(() => ({
          viewport: document.documentElement.clientWidth,
          content: document.documentElement.scrollWidth,
        }));
        expect(dimensions.content, `horizontal overflow on ${route.path} at ${width}px`)
          .toBeLessThanOrEqual(dimensions.viewport);

        await expect(page.locator('footer.site-footer')).toBeAttached();
        await expect(page.getByRole('link', { name: 'Impressum' }).last()).toBeAttached();
        await expect(page.getByRole('link', { name: 'Datenschutz' }).last()).toBeAttached();
      });
    }
  });
}

test('gastronomy menu tabs remain operable and expose the selected category', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(`${base}/gaststaette`);

  const tabs = page.getByRole('tab');
  await expect(tabs).toHaveCount(3);
  await tabs.nth(1).click();
  await expect(tabs.nth(1)).toHaveAttribute('aria-selected', 'true');
  await expect(page.locator('.menu-list h3')).toHaveText('Getränke');
  await tabs.nth(2).click();
  await expect(tabs.nth(2)).toHaveAttribute('aria-selected', 'true');
});

test('apartment inquiry fields remain visible, usable and within the viewport', async ({ page }) => {
  for (const width of widths) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/ferienwohnungen`);
    const form = page.locator('.inquiry-form');
    await expect(form).toBeVisible();
    for (const label of ['Name', 'E-Mail', 'Gewünschter Zeitraum', 'Nachricht']) {
      const field = form.getByLabel(label);
      await expect(field).toBeVisible();
      const bounds = await field.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.width).toBeGreaterThan(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
    }
  }
});

test('tablet landscape keeps navigation and page content within the viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 768 });
  await page.goto(`${base}/`);
  await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeVisible();
  const dimensions = await page.evaluate(() => ({
    viewport: document.documentElement.clientWidth,
    content: document.documentElement.scrollWidth,
  }));
  expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
});

test('mobile menu toggle and dialog controls meet the minimum 24px target size', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  await page.goto(`${base}/`);
  const toggle = page.getByRole('button', { name: 'Menü öffnen' });
  const toggleBounds = await toggle.boundingBox();
  expect(toggleBounds).not.toBeNull();
  expect(toggleBounds!.width).toBeGreaterThanOrEqual(24);
  expect(toggleBounds!.height).toBeGreaterThanOrEqual(24);

  await toggle.click();
  const close = page.getByRole('button', { name: 'Menü schließen' });
  const closeBounds = await close.boundingBox();
  expect(closeBounds).not.toBeNull();
  expect(closeBounds!.width).toBeGreaterThanOrEqual(24);
  expect(closeBounds!.height).toBeGreaterThanOrEqual(24);
});
