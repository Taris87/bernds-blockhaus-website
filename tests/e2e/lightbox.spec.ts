import { expect, test } from '@playwright/test';

const base = '/bernds-blockhaus-website';

test.describe('native gallery lightbox', () => {
  test('fits viewport and restores focus after keyboard navigation', async ({ page }) => {
    for (const width of [320, 375, 390, 600, 768, 900, 1024, 1280]) {
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
      await expect(page.getByRole('button', { name: 'Weiter' })).toBeFocused();

      await page.keyboard.press('ArrowRight');
      await expect(dialog).toHaveAttribute('aria-label', 'Ferienwohnungen');
      await expect(page.getByRole('button', { name: 'Weiter' })).toBeFocused();

      await page.keyboard.press('Escape');
      await expect(dialog).not.toBeVisible();
      await expect(trigger).toBeFocused();
    }
  });

  test('uses native Tab and Shift+Tab navigation without a competing key handler', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/galerie`);
    const trigger = page.getByRole('button', { name: /groß anzeigen/i }).nth(1);
    await trigger.click();

    const dialog = page.getByRole('dialog');
    const close = page.getByRole('button', { name: 'Galerie schließen' });
    const previous = page.getByRole('button', { name: 'Zurück' });
    const next = page.getByRole('button', { name: 'Weiter' });

    await expect(close).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(previous).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(next).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dialog).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(next).toBeFocused();

    await next.click();
    await expect(close).not.toBeFocused();
    await expect(next).toBeFocused();
    await page.getByRole('button', { name: 'Galerie schließen' }).click();
    await expect(trigger).toBeFocused();
  });

  test('keeps focus in the native modal when controls are dynamically disabled', async ({ page }) => {
    await page.goto(`${base}/galerie`);
    await page.getByRole('button', { name: /groß anzeigen/i }).first().click();

    const dialog = page.getByRole('dialog');
    const controls = page.locator('.lightbox-controls');
    await controls.evaluate((element) => {
      const disabled = document.createElement('button');
      disabled.type = 'button';
      disabled.disabled = true;
      disabled.textContent = 'Disabled control';
      element.append(disabled);

      const hidden = document.createElement('button');
      hidden.type = 'button';
      hidden.textContent = 'Hidden control';
      hidden.hidden = true;
      element.append(hidden);

      const dynamic = document.createElement('button');
      dynamic.type = 'button';
      dynamic.textContent = 'Dynamic control';
      element.append(dynamic);
    });

    const dynamic = page.getByRole('button', { name: 'Dynamic control' });
    await dynamic.focus();
    await page.keyboard.press('Tab');
    await expect(dialog).toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect(dynamic).toBeFocused();

    await page.keyboard.press('Tab');
    await expect(dialog).toBeFocused();
    await expect(page.getByRole('button', { name: 'Disabled control' })).not.toBeFocused();
    await expect(page.getByRole('button', { name: 'Hidden control' })).not.toBeFocused();
  });

  test('opening and immediately closing does not restore focus to a stale trigger', async ({ page }) => {
    await page.goto(`${base}/galerie`);
    const trigger = page.getByRole('button', { name: /groß anzeigen/i }).first();
    await trigger.focus();
    await trigger.click();
    await page.getByRole('button', { name: 'Galerie schließen' }).click();

    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('does not restore focus after the lightbox unmounts with its gallery', async ({ page }) => {
    await page.goto(`${base}/galerie`);
    await page.getByRole('button', { name: /groß anzeigen/i }).first().click();
    await expect(page.getByRole('dialog')).toBeVisible();

    await page.getByRole('link', { name: 'Startseite' }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('dialog')).toHaveCount(0);

    const activeIsDetached = await page.evaluate(() => {
      const active = document.activeElement;
      return active instanceof HTMLElement && !active.isConnected;
    });
    expect(activeIsDetached).toBe(false);
  });

  test('remounts the gallery and opens a fresh lightbox without focusing the old trigger', async ({ page }) => {
    await page.goto(`${base}/galerie`);
    const original = page.getByRole('button', { name: /groß anzeigen/i }).first();
    await original.click();
    await page.getByRole('link', { name: 'Startseite' }).click();
    await page.getByRole('link', { name: 'Galerie' }).click();

    const newTrigger = page.getByRole('button', { name: /groß anzeigen/i }).first();
    await newTrigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Galerie schließen' })).toBeFocused();

    await page.getByRole('button', { name: 'Galerie schließen' }).click();
    await expect(newTrigger).toBeFocused();
    await expect(original).not.toBeFocused();
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
