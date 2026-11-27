import { expect, test } from '@playwright/test';

const base = '/bernds-blockhaus-website';
const widths = [320, 375, 390, 600, 768, 900, 1024, 1280];

test.describe('native gallery lightbox', () => {
  for (const width of widths) {
    test(`fits viewport and keeps focus stable at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 740 });
      await page.goto(`${base}/galerie`);

      const trigger = page.getByRole('button', { name: /groß anzeigen/i }).first();
      await trigger.focus();
      await trigger.click();

      const dialog = page.getByRole('dialog');
      const close = page.getByRole('button', { name: 'Galerie schließen' });
      await expect(dialog).toBeVisible();
      await expect(close).toBeFocused();

      const bounds = await dialog.boundingBox();
      expect(bounds).not.toBeNull();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.y).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width + 1);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(741);

      await page.getByRole('button', { name: 'Weiter' }).click();
      await expect(dialog).toHaveAttribute('aria-label', 'Gastbereich');
      await expect(close).toBeFocused();

      await page.keyboard.press('ArrowRight');
      await expect(dialog).toHaveAttribute('aria-label', 'Ferienwohnungen');
      await expect(close).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    });
  }

  test('native modal dialog traps Tab and Shift+Tab and restores focus on close', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/galerie`);
    const trigger = page.getByRole('button', { name: /groß anzeigen/i }).nth(1);
    await trigger.click();

    const close = page.getByRole('button', { name: 'Galerie schließen' });
    const previous = page.getByRole('button', { name: 'Zurück' });
    const next = page.getByRole('button', { name: 'Weiter' });

    await expect(close).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(previous).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(next).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(close).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(next).toBeFocused();

    await next.click();
    await expect(close).not.toBeFocused();
    await expect(next).toBeFocused();
    await page.getByRole('button', { name: 'Galerie schließen' }).click();
    await expect(trigger).toBeFocused();
  });

  test('closes when the backdrop is activated', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/galerie`);
    const trigger = page.getByRole('button', { name: /groß anzeigen/i }).first();
    await trigger.click();
    await page.locator('.lightbox-dialog').click({ position: { x: 8, y: 8 } });
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });
});
