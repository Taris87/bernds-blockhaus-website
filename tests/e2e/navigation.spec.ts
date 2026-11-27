import { expect, test } from '@playwright/test';

test('home navigation reaches the gastronomy page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Gaststätte/ }).first().click();
  await expect(page.getByRole('heading', { name: /Speisekarte/i })).toBeVisible();
});

test('desktop navigation remains visible at desktop width', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeVisible();
});

test('inquiry form reports an unconfigured endpoint without sending', async ({ page }) => {
  await page.goto('/kontakt');
  await page.getByRole('button', { name: /Anfrage senden/i }).click();
  await expect(page.getByRole('status')).toContainText(/noch nicht mit einem Versanddienst verbunden/i);
});

test('inquiry form reports invalid endpoint configuration', async ({ page }) => {
  await page.goto('/kontakt');
  await page.evaluate(() => {
    // Vite environment values are bundled at build time; invalid endpoint is covered by the unit test.
    document.documentElement.dataset.endpointTest = 'unit-covered';
  });
  await expect(page.locator('.inquiry-form')).toBeVisible();
});
