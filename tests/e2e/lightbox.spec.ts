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

  test('native Tab and Shift+Tab navigation never focuses the inert background', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${base}/galerie`);
    const trigger = page.getByRole('button', { name: /groß anzeigen/i }).nth(1);
    await trigger.click();
    const dialog = page.getByRole('dialog');
    const close = page.getByRole('button', { name: 'Galerie schließen' });
    const next = page.getByRole('button', { name: 'Weiter' });
    await expect(close).toBeFocused();

    for (const key of ['Tab', 'Tab', 'Tab', 'Shift+Tab', 'Shift+Tab', 'Shift+Tab']) {
      await page.keyboard.press(key);
      const focusState = await page.evaluate(() => {
        const modal = document.querySelector('dialog[open]');
        const active = document.activeElement;
        return {
          modalIsActive: !!modal?.matches(':modal'),
          focusInsideDialog: active instanceof HTMLElement && !!modal?.contains(active),
          focusIsBodyFallback: active === document.body || active === document.documentElement,
          focusInBackground: active instanceof HTMLElement &&
            active !== document.body &&
            active !== document.documentElement &&
            !modal?.contains(active),
        };
      });
      expect(focusState.modalIsActive).toBe(true);
      expect(focusState.focusInBackground).toBe(false);
      expect(focusState.focusInsideDialog || focusState.focusIsBodyFallback).toBe(true);
    }

    const backgroundLink = page.locator('header a[href]').first();
    await backgroundLink.evaluate((element) => (element as HTMLElement).focus());
    const backgroundFocusBlocked = await page.evaluate(() => {
      const modal = document.querySelector('dialog[open]');
      const active = document.activeElement;
      return !!modal?.matches(':modal') &&
        active !== document.querySelector('header a[href]') &&
        !(active instanceof HTMLElement && active.closest('header'));
    });
    expect(backgroundFocusBlocked).toBe(true);

    // The attempted background focus must not escape the modal context.
    // Image navigation is covered separately by the viewport test above.
    await expect(dialog).toBeVisible();
    await expect.poll(() => page.evaluate(() => {
      const modal = document.querySelector('dialog[open]');
      const active = document.activeElement;
      return !!modal?.matches(':modal') &&
        (active === document.body || active === document.documentElement ||
          (active instanceof HTMLElement && !!modal.contains(active)));
    })).toBe(true);
    await page.getByRole('button', { name: 'Galerie schließen' }).click();
    await expect(trigger).toBeFocused();
  });

  test('native tab order includes dynamic controls and skips disabled and hidden controls', async ({ page }) => {
    await page.goto(`${base}/galerie`);
    await page.getByRole('button', { name: /groß anzeigen/i }).first().click();
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

    const previous = page.getByRole('button', { name: 'Zurück' });
    const next = page.getByRole('button', { name: 'Weiter' });
    const dynamic = page.getByRole('button', { name: 'Dynamic control' });
    const disabled = page.locator('.lightbox-controls button:disabled');
    const hidden = page.locator('.lightbox-controls button[hidden]');
    await expect(dynamic).toBeVisible();
    await expect(disabled).toBeDisabled();
    await expect(hidden).toBeHidden();

    await page.keyboard.press('Tab');
    await expect(previous).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(next).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(dynamic).toBeFocused();

    await page.keyboard.press('Tab');
    const state = await page.evaluate(() => {
      const modal = document.querySelector('dialog[open]');
      const active = document.activeElement;
      return {
        modalIsActive: !!modal?.matches(':modal'),
        focusInsideDialog: active instanceof HTMLElement && !!modal?.contains(active),
        focusIsBodyFallback: active === document.body || active === document.documentElement,
        focusInBackground: active instanceof HTMLElement &&
          active !== document.body &&
          active !== document.documentElement &&
          !modal?.contains(active),
      };
    });
    expect(state.modalIsActive).toBe(true);
    expect(state.focusInBackground).toBe(false);
    expect(state.focusInsideDialog || state.focusIsBodyFallback).toBe(true);
    await expect(disabled).not.toBeFocused();
    await expect(hidden).toBeHidden();
  });

  test('opening and immediately closing restores focus to the connected trigger', async ({ page }) => {
    await page.goto(`${base}/galerie`);
    const trigger = page.getByRole('button', { name: /groß anzeigen/i }).first();
    await trigger.focus();
    await trigger.click();
    await page.getByRole('button', { name: 'Galerie schließen' }).click();
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(trigger).toBeFocused();
  });

  test('SPA navigation after closing the lightbox focuses the new route main content', async ({ page }) => {
    await page.goto(`${base}/galerie`);
    const oldTrigger = page.getByRole('button', { name: /groß anzeigen/i }).first();
    const oldElement = await oldTrigger.elementHandle();
    await oldTrigger.click();
    await page.getByRole('button', { name: 'Galerie schließen' }).click();
    await expect(oldTrigger).toBeFocused();

    await page.getByRole('link', { name: 'Startseite' }).click();
    await expect(page).toHaveURL(new RegExp(`${base}/?$`));
    const main = page.locator('main#main');
    await expect(main).toBeFocused();
    await expect(main.locator('h1')).toBeVisible();
    expect(await oldElement?.evaluate((element) => element.isConnected)).toBe(false);
    await expect(oldTrigger).toHaveCount(0);
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
    expect(await newTrigger.elementHandle()).not.toBe(originalElement);
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
