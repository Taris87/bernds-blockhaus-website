import { expect, test } from '@playwright/test';

const pagesBase = '/bernds-blockhaus-website';

test.describe('mobile navigation dialog', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`${pagesBase}/`);
  });


  test('does not steal focus during initial Strict Mode effect replay', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Menü öffnen' });
    await toggle.focus();
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => resolve())));
    await expect(toggle).toBeFocused();
    await expect(page.getByRole('dialog', { name: 'Mobile Navigation' })).not.toBeVisible();
  });

  test('supports repeated open and close cycles without losing focus', async ({ page }) => {
    const toggle = page.getByRole('button', { name: 'Menü öffnen' });
    const close = page.getByRole('button', { name: 'Menü schließen' });
    const dialog = page.getByRole('dialog', { name: 'Mobile Navigation' });

    for (let cycle = 0; cycle < 4; cycle += 1) {
      await toggle.click();
      await expect(dialog).toBeVisible();
      await expect(close).toBeFocused();
      if (cycle % 2 === 0) await page.keyboard.press('Escape');
      else await close.click();
      await expect(dialog).not.toBeVisible();
      await expect(toggle).toBeFocused();
    }
  });

  test('removes the focus guard after close without accumulating listeners', async ({ page }) => {
    await page.evaluate(() => {
      const originalAdd = document.addEventListener.bind(document);
      const originalRemove = document.removeEventListener.bind(document);
      const active = new Set<EventListenerOrEventListenerObject>();
      const counts = { added: 0, removed: 0 };
      document.addEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions) => {
        if (type === 'focusin') {
          active.add(listener);
          counts.added += 1;
          (window as typeof window & { __focusGuardCounts?: typeof counts }).__focusGuardCounts = counts;
        }
        originalAdd(type, listener, options);
      }) as typeof document.addEventListener;
      document.removeEventListener = ((type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions) => {
        if (type === 'focusin') {
          active.delete(listener);
          counts.removed += 1;
        }
        originalRemove(type, listener, options);
      }) as typeof document.removeEventListener;
      Object.defineProperty(window, '__activeFocusGuards', { get: () => active.size });
    });

    const toggle = page.getByRole('button', { name: 'Menü öffnen' });
    const close = page.getByRole('button', { name: 'Menü schließen' });
    for (let cycle = 0; cycle < 3; cycle += 1) {
      await toggle.click();
      await expect.poll(() => page.evaluate(() => (window as typeof window & { __activeFocusGuards?: number }).__activeFocusGuards ?? 0)).toBe(1);
      await close.click();
      await expect.poll(() => page.evaluate(() => (window as typeof window & { __activeFocusGuards?: number }).__activeFocusGuards ?? 0)).toBe(0);
    }
    const counts = await page.evaluate(() => (window as typeof window & { __focusGuardCounts?: { added: number; removed: number } }).__focusGuardCounts);
    expect(counts).toEqual({ added: 3, removed: 3 });
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
