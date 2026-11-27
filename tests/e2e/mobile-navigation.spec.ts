import { expect, test } from '@playwright/test';

const pagesBase = '/bernds-blockhaus-website';

test.describe('mobile navigation dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${pagesBase}/`);
  });

  test('uses native dialog keyboard navigation and restores focus after Escape', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Menü öffnen' });
    await toggle.click();

    const dialog = page.getByRole('dialog', { name: 'Mobile Navigation' });
    const closeButton = page.getByRole('button', { name: 'Menü schließen' });
    const navLinks = page.locator('#mobile-navigation nav a');

    await expect(dialog).toBeVisible();
    await expect(closeButton).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(navLinks.first()).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(closeButton).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(dialog).not.toBeVisible();
    await expect(toggle).toBeFocused();
  });

  test('restores focus after the close button is activated', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Menü öffnen' });
    await toggle.click();
    await page.getByRole('button', { name: 'Menü schließen' }).click();

    await expect(page.getByRole('dialog', { name: 'Mobile Navigation' })).not.toBeVisible();
    await expect(toggle).toBeFocused();
  });

  test('keeps programmatic focus inside the dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Menü öffnen' }).click();
    const closeButton = page.getByRole('button', { name: 'Menü schließen' });
    await page.locator('.brand').focus();
    await expect(closeButton).toBeFocused();
  });

  test('closes after link navigation and restores focus to the menu toggle', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Menü öffnen' });
    await toggle.click();
    await page.getByRole('link', { name: 'Anfragen ↗' }).click();

    await expect(page).toHaveURL(/\/bernds-blockhaus-website\/kontakt\/?$/);
    await expect(page.getByRole('dialog', { name: 'Mobile Navigation' })).not.toBeVisible();
    await expect(toggle).toBeFocused();
  });

  for (const width of [320, 390, 768, 900]) {
    test(`has no horizontal page overflow at ${width}px viewport width`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      const dimensions = await page.evaluate(() => ({
        viewport: document.documentElement.clientWidth,
        content: document.documentElement.scrollWidth,
      }));
      expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
    });
  }
});
