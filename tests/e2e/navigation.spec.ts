import { expect, test } from '@playwright/test';
test('home navigation reaches the gastronomy page', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: /Gaststätte/ }).first().click();
  await expect(page.getByRole('heading', { name: /Speisekarte/i })).toBeVisible();
});
