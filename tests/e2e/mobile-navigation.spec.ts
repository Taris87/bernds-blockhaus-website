import { expect, test } from '@playwright/test';

test.describe('mobile navigation dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/bernds-blockhaus-website/');
    await page.getByRole('button', { name: 'Menü öffnen' }).click();
  });

  test('traps Tab and Shift+Tab within the native modal dialog', async ({ page }) => {
    const closeButton = page.getByRole('button', { name: 'Menü schließen' });
    const lastMenuLink = page.locator('#mobile-navigation nav a').last();

    await expect(closeButton).toBeFocused();

    await page.keyboard.press('Shift+Tab');
    await expect(lastMenuLink).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(closeButton).toBeFocused();
  });

  test('keeps programmatic focus inside the dialog', async ({ page }) => {
    const closeButton = page.getByRole('button', { name: 'Menü schließen' });

    await page.locator('.brand').focus();

    await expect(closeButton).toBeFocused();
  });

  test('closes with Escape and restores focus to the menu toggle', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Menü öffnen' });

    await page.keyboard.press('Escape');

    await expect(page.getByRole('dialog', { name: 'Mobile Navigation' })).not.toBeVisible();
    await expect(toggle).toBeFocused();
  });
});
