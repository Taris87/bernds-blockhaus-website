import { expect, test } from '@playwright/test';

test.describe('mobile navigation dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bernds-blockhaus-website/');
  });

  test('opens the dialog, supports keyboard navigation and closes on Escape', async ({ page }) => {
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

  test('keeps programmatic focus inside the dialog', async ({ page }) => {
    await page.getByRole('button', { name: 'Menü öffnen' }).click();
    const closeButton = page.getByRole('button', { name: 'Menü schließen' });

    await page.locator('.brand').focus();
    await expect(closeButton).toBeFocused();
  });

  test('closes when a mobile navigation link is selected', async ({ page }) => {
    await page.getByRole('button', { name: 'Menü öffnen' }).click();
    await page.getByRole('link', { name: 'Anfragen ↗' }).click();

    await expect(
      page.getByRole('dialog', { name: 'Mobile Navigation' }),
    ).not.toBeVisible();
  });

  for (const width of [320, 390, 768, 900]) {
    test(`keeps navigation controls usable at ${width}px viewport width`, async ({ page }) => {
      await page.setViewportSize({ width, height: 844 });
      if (width <= 900) {
        await expect(page.getByRole('button', { name: 'Menü öffnen' })).toBeVisible();
      }
      await expect(page.locator('body')).toHaveJSProperty(
        'scrollWidth',
        await page.evaluate(() => document.documentElement.clientWidth),
      );
    });
  }
});
