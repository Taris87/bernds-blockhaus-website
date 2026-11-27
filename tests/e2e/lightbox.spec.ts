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

  test('native Tab and Shift+Tab navigation never moves focus to the inert background', async ({ page }) => {
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
    await expect.poll(() => page.evaluate(() => {
      const active = document.activeElement;
      const modal = document.querySelector('dialog[open]');
      return active instanceof HTMLElement && !!modal?.matches(':modal') && !active.closest('#main');
    })).toBe(true);
    const backgroundFocusable = page.locator('#main a[href], #main button').first();
    await backgroundFocusable.focus();
    await expect.poll(() => page.evaluate(() => {
      const active = document.activeElement;
      const modal = document.querySelector('dialog[open]');
      return active instanceof HTMLElement && !!modal?.contains(active);
    })).toBe(true);
    await expect(trigger).not.toBeFocused();
    await page.keyboard.press('Shift+Tab');
    await expect.poll(() => page.evaluate(() => {
      const active = document.activeElement;
      const modal = document.querySelector('dialog[open]');
      return active instanceof HTMLElement && !!modal?.contains(active);
    })).toBe(true);
    await next.click();
    await expect(page.getByRole('dialog')).toHaveAttribute('aria-label', 'Gastbereich');
    await expect(next).toBeFocused();
    await page.getByRole('button', { name: 'Galerie schließen' }).click();
    await expect(trigger).toBeFocused();
  });

  test('native tab order includes dynamic controls and skips disabled and hidden controls', async ({ page }) => {
    await page.goto(`${base}/galerie`);
    await page.getByRole('button', { name: /groß anzeigen/i }).first().click();
    const controls = page.locator('.lightbox-controls');
    await controls.evaluate((element) => {
      const disabled = document.createElement('button');
      disabled.type = 'button'; disabled.disabled = true; disabled.textContent = 'Disabled control'; element.append(disabled);
      const hidden = document.createElement('button');
      hidden.type = 'button'; hidden.textContent = 'Hidden control'; hidden.hidden = true; element.append(hidden);
      const dynamic = document.createElement('button');
      dynamic.type = 'button'; dynamic.textContent = 'Dynamic control'; element.append(dynamic);
    });
    const previous = page.getByRole('button', { name: 'Zurück' });
    const next = page.getByRole('button', { name: 'Weiter' });
    const dynamic = page.getByRole('button', { name: 'Dynamic control' });
    await expect(dynamic).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(previous).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(next).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dynamic).toBeFocused();
    await page.keyboard.press('Tab');
    await expect.poll(() => page.evaluate(() => {
      const active = document.activeElement;
      const modal = document.querySelector('dialog[open]');
      return active instanceof HTMLElement && !!modal?.contains(active);
    })).toBe(true);
    await expect(page.getByRole('button', { name: 'Disabled control' })).not.toBeFocused();
    await expect(page.getByRole('button', { name: 'Hidden control' })).not.toBeFocused();
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('opening and immediately closing does not restore focus to a stale trigger', async ({ page }) => {
    await page.goto(`${base}/galerie`);
    const trigger = page.getByRole('button', { name: /groß anzeigen/i }).first();
    await trigger.focus(); await trigger.click();
    await page.getByRole('button', { name: 'Galerie schließen' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('navigation after closing the lightbox focuses the new route main content', async ({ page }) => {
    await page.goto(`${base}/galerie`);
    const oldTrigger = page.getByRole('button', { name: /groß anzeigen/i }).first();
    await oldTrigger.click();
    await page.getByRole('button', { name: 'Galerie schließen' }).click();
    await expect(oldTrigger).toBeFocused();
    await page.getByRole('link', { name: 'Startseite' }).click();
    await expect(page).toHaveURL(new RegExp(`${base}/?$`));
    const main = page.locator('main#main');
    await expect(main).toBeFocused();
    await expect(main.locator('h1')).toBeVisible();
    expect(await oldTrigger.count()).toBe(0);
  });

  test('remounts the gallery and opens with the new trigger after ordinary navigation', async ({ page }) => {
    await page.goto(`${base}/galerie`);
    const original = page.getByRole('button', { name: /groß anzeigen/i }).first();
    const originalElement = await original.elementHandle();
    await original.click();
    await page.getByRole('button', { name: 'Galerie schließen' }).click();
    await page.getByRole('link', { name: 'Startseite' }).click();
    await expect(page).toHaveURL(new RegExp(`${base}/?$`));
    await expect(page.locator('main#main')).toBeFocused();
    await page.getByRole('link', { name: 'Galerie' }).click();
    await expect(page).toHaveURL(new RegExp(`${base}/galerie/?$`));
    const newTrigger = page.getByRole('button', { name: /groß anzeigen/i }).first();
    await newTrigger.click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Galerie schließen' })).toBeFocused();
    await page.getByRole('button', { name: 'Galerie schließen' }).click();
    await expect(newTrigger).toBeFocused();
    expect(await originalElement?.evaluate((element) => element.isConnected)).toBe(false);
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
