import { expect, test, type Page } from '@playwright/test';

/*
 * Motion layer (src/motion, design-system.md Kap. 7). Every test states the
 * motion preference explicitly; the default Playwright context reports
 * `no-preference`, so the other specs already run with motion on.
 */

const base = '/bernds-blockhaus-website';
const routes = ['/', '/gaststaette', '/ferienwohnungen', '/galerie', '/eichwieserhof', '/kontakt'];

/** Instant scroll (bypasses `scroll-behavior: smooth`), centred on the element. */
async function scrollToElement(page: Page, selector: string) {
  await page.locator(selector).first().evaluate((element) => {
    const box = element.getBoundingClientRect();
    window.scrollTo({ top: window.scrollY + box.top - window.innerHeight / 2, behavior: 'instant' });
  });
}

function trackX(page: Page) {
  return page
    .locator('[data-marquee-track]')
    .evaluate((element) => new DOMMatrix(getComputedStyle(element).transform).m41);
}

/** Records whether an element matching `selector` ever got an inline transform. */
async function watchTransforms(page: Page, selector: string) {
  await page.evaluate((watched) => {
    const w = window as Window & { __transformed?: boolean };
    w.__transformed = false;
    new MutationObserver((records) => {
      for (const record of records) {
        const target = record.target as HTMLElement;
        if (target.matches?.(watched) && /translate|matrix|scale/.test(target.style.transform)) {
          w.__transformed = true;
        }
      }
    }).observe(document.body, { attributes: true, attributeFilter: ['style'], subtree: true });
  }, selector);
}

function transformed(page: Page) {
  return page.evaluate(() => (window as Window & { __transformed?: boolean }).__transformed === true);
}

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  for (const route of routes) {
    test(`all motion hooks on ${route} are visible at once, without inline motion styles`, async ({ page }) => {
      await page.goto(`${base}${route}`);
      await expect(page.locator('main h1')).toBeVisible();
      await page.evaluate(() => document.fonts.ready);
      // Two frames: any (wrongly) scheduled start state would be applied by now.
      await page.evaluate(() => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))));

      const states = await page.locator('main [data-reveal], main [data-counter], main [data-parallax]').evaluateAll((elements) =>
        elements.map((element) => {
          const style = getComputedStyle(element);
          const inline = (element as HTMLElement).style;
          return {
            name: `${element.tagName.toLowerCase()}.${element.className}`,
            opacity: style.opacity,
            visibility: style.visibility,
            inlineTransform: inline.transform,
            clipPath: inline.clipPath,
            split: element.querySelectorAll('.split-line').length,
          };
        }),
      );
      expect(states.length).toBeGreaterThan(3);
      for (const state of states) {
        expect(state, state.name).toEqual({ ...state, opacity: '1', visibility: 'visible', inlineTransform: '', clipPath: '', split: 0 });
      }
    });
  }

  test('ticker does not move and shows the facts once, wrapped', async ({ page }) => {
    await page.goto(`${base}/`);
    const before = await trackX(page);
    await page.waitForTimeout(600);
    expect(await trackX(page)).toBe(before);
    expect(before).toBe(0);
    await expect(page.locator('.marquee-list[aria-hidden="true"]')).toBeHidden();
    // Nothing to pause: the toggle is not offered (QA-114).
    await expect(page.getByRole('button', { name: 'Laufband anhalten' })).toHaveCount(0);
  });

  test('counters show the end value without an animated duplicate', async ({ page }) => {
    await page.goto(`${base}/gaststaette`);
    await scrollToElement(page, '.counters');
    await page.waitForTimeout(300);
    await expect(page.locator('.counter-overlay')).toHaveCount(0);
    await expect(page.locator('.counter-value').first()).toHaveText('60');
  });
});

test.describe('motion on', () => {
  test.use({ reducedMotion: 'no-preference' });

  test('a print below the fold waits hidden and is revealed when scrolled into view', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${base}/`);
    const print = page.locator('.index-photos .print').first();
    // Start state is set by JS only – and only while out of view.
    await expect.poll(() => print.evaluate((element) => getComputedStyle(element).opacity)).toBe('0');
    await scrollToElement(page, '.index-photos');
    await expect.poll(() => print.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
    // Once revealed, scrolling back up and down again does not hide it again.
    await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
    await page.waitForTimeout(200);
    await scrollToElement(page, '.index-photos');
    await page.waitForTimeout(100);
    expect(await print.evaluate((element) => getComputedStyle(element).opacity)).toBe('1');
  });

  test('headings reveal line by line and keep their accessible name', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${base}/`);
    const heading = page.locator('#drei-seiten');
    await expect(page.getByRole('heading', { level: 2, name: 'Drei Seiten eines besonderen Ortes.' })).toHaveCount(1);
    await scrollToElement(page, '#drei-seiten');
    await expect.poll(() => heading.locator('.split-line').count()).toBe(0);
    await expect(heading).toHaveCSS('opacity', '1');
    // After the reveal the original markup is back (no aria-label, no line wrappers).
    expect(await heading.getAttribute('aria-label')).toBeNull();
    await expect(page.getByRole('heading', { level: 2, name: 'Drei Seiten eines besonderen Ortes.' })).toHaveCount(1);
  });

  test('counter keeps the end value in the DOM while a hidden duplicate counts', async ({ page }) => {
    await page.goto(`${base}/gaststaette`);
    const value = page.locator('.counter-value').first();
    await scrollToElement(page, '.counters');
    await expect(page.locator('.counter-overlay').first()).toHaveAttribute('aria-hidden', 'true');
    await expect(value).toHaveText(/^60/);
    expect(await value.evaluate((element) => element.firstChild?.textContent)).toBe('60');
    await expect(page.locator('.counter-overlay')).toHaveCount(0);
    await expect(value).toHaveText('60');
  });

  test('ticker moves, stops with the pause button and moves again', async ({ page }) => {
    await page.goto(`${base}/`);
    await page.mouse.move(5, 5);
    await scrollToElement(page, '.marquee');
    const toggle = page.getByRole('button', { name: 'Laufband anhalten' });
    const start = await trackX(page);
    await expect.poll(() => trackX(page)).toBeLessThan(start - 5);

    await toggle.focus();
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-pressed', 'true');
    const stopped = await trackX(page);
    await page.waitForTimeout(600);
    expect(await trackX(page)).toBe(stopped);

    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-pressed', 'false');
    await expect.poll(() => trackX(page)).toBeLessThan(stopped - 5);
  });

  test('ticker pauses while hovered and while out of view', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${base}/`);
    await scrollToElement(page, '.marquee');
    const box = await page.locator('.marquee-viewport').boundingBox();
    await page.mouse.move(box!.x + 100, box!.y + box!.height / 2);
    await page.waitForTimeout(100);
    const hovered = await trackX(page);
    await page.waitForTimeout(500);
    expect(await trackX(page)).toBe(hovered);

    await page.mouse.move(5, 5);
    await expect.poll(() => trackX(page)).toBeLessThan(hovered - 5);

    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(200);
    const hidden = await trackX(page);
    await page.waitForTimeout(500);
    expect(await trackX(page)).toBe(hidden);
  });

  test('lightbox opens and closes with Flip by keyboard and keeps focus handling', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${base}/galerie`);
    const trigger = page.getByRole('button', { name: /groß anzeigen/ }).first();
    await scrollToElement(page, '.masonry');
    await expect.poll(() => trigger.evaluate((element) => getComputedStyle(element.closest('li')!).opacity)).toBe('1');
    await watchTransforms(page, '.lightbox-frame');

    await trigger.focus();
    await page.keyboard.press('Enter');
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByRole('button', { name: 'Galerie schließen' })).toBeFocused();
    await expect.poll(() => transformed(page)).toBe(true);
    // After the opening the frame is back to its static CSS state.
    await expect.poll(() => dialog.locator('.lightbox-frame').evaluate((element) => (element as HTMLElement).style.transform)).toBe('');

    await page.keyboard.press('ArrowRight');
    await expect(dialog).toHaveAttribute('aria-label', 'Hausmacher Platte');
    await page.keyboard.press('Escape');
    await expect(dialog).toBeHidden();
    await expect(trigger).toBeFocused();
  });

  test('lightbox follows a swipe beyond the threshold, ignores a short one', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${base}/galerie`);
    await page.getByRole('button', { name: /groß anzeigen/ }).first().click();
    const dialog = page.getByRole('dialog');
    await expect(dialog.locator('.lightbox-counter')).toContainText('01 / 39');
    await page.waitForTimeout(700);
    const first = await dialog.getAttribute('aria-label');
    const frame = await dialog.locator('.lightbox-frame').boundingBox();
    const y = frame!.y + frame!.height / 2;
    const x = frame!.x + frame!.width / 2;

    // Short drag (below 50 px): stays on the same photo and does not close.
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 20, y, { steps: 4 });
    await page.mouse.up();
    await page.waitForTimeout(400);
    await expect(dialog.locator('.lightbox-counter')).toContainText('01 / 39');
    await expect(dialog).toHaveAttribute('aria-label', first!);

    // Swipe to the left: next photo; the dialog stays open.
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x - 160, y, { steps: 8 });
    await page.mouse.up();
    await expect(dialog.locator('.lightbox-counter')).toContainText('02 / 39');
    await expect(dialog).toBeVisible();

    // Swipe to the right: back again.
    await page.waitForTimeout(400);
    await page.mouse.move(x, y);
    await page.mouse.down();
    await page.mouse.move(x + 160, y, { steps: 8 });
    await page.mouse.up();
    await expect(dialog.locator('.lightbox-counter')).toContainText('01 / 39');
    await expect(dialog).toHaveAttribute('aria-label', first!);
  });

  test('gallery filter glides with Flip and never moves the page', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${base}/galerie`);
    await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(900);
    await page.waitForTimeout(800);
    await page.evaluate(() => {
      const log: number[] = [];
      (window as Window & { __scrolls?: number[] }).__scrolls = log;
      window.addEventListener('scroll', () => log.push(window.scrollY));
    });
    await watchTransforms(page, '.masonry-tile');

    const chip = page.getByRole('button', { name: /Blockhaus & Landschaft/ });
    await chip.focus();
    await page.keyboard.press('Enter');
    await expect(chip).toHaveAttribute('aria-pressed', 'true');
    await expect.poll(() => transformed(page)).toBe(true);
    await expect(page.locator('.gallery-count b')).toHaveText(/^13/);
    await page.waitForTimeout(900);

    expect(await page.evaluate(() => (window as Window & { __scrolls?: number[] }).__scrolls)).toEqual([]);
    expect(await page.evaluate(() => window.scrollY)).toBe(900);
    // Every tile is visible and back to its static state after the transition.
    const tiles = await page.locator('.masonry-tile').evaluateAll((elements) =>
      elements.map((element) => [getComputedStyle(element).opacity, (element as HTMLElement).style.transform]),
    );
    for (const tile of tiles) expect(tile).toEqual(['1', '']);
  });

  test('Eichwieserhof marks the section in view (aria-current)', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${base}/eichwieserhof`);
    const nav = page.getByRole('navigation', { name: 'Abschnitte dieser Seite' });
    await expect(nav.locator('[aria-current]')).toHaveCount(0);
    await scrollToElement(page, '#verkaufspferde-titel');
    await expect(nav.getByRole('link', { name: 'Verkaufspferde' })).toHaveAttribute('aria-current', 'true');
    await expect(nav.locator('[aria-current]')).toHaveCount(1);
    await scrollToElement(page, '#rindfleisch-titel');
    await expect(nav.getByRole('link', { name: 'Rindfleisch bestellen' })).toHaveAttribute('aria-current', 'true');
    await expect(nav.locator('[aria-current]')).toHaveCount(1);
  });

  test('Eichwieserhof marks the section in view with reduced motion as well', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(`${base}/eichwieserhof`);
    await page.evaluate(() => document.getElementById('deckhengste')?.scrollIntoView({ behavior: 'instant' }));
    await expect(page.getByRole('navigation', { name: 'Abschnitte dieser Seite' }).getByRole('link', { name: 'Deckhengste' })).toHaveAttribute('aria-current', 'true');
  });

  test('menu tabs keep keyboard behaviour while the content cross-fades', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto(`${base}/gaststaette`);
    const first = page.getByRole('tab', { name: 'Kalte Gerichte' });
    await first.focus();
    await page.keyboard.press('ArrowRight');
    const second = page.getByRole('tab', { name: 'Platten' });
    await expect(second).toBeFocused();
    await expect(second).toHaveAttribute('aria-selected', 'true');
    await expect(page.getByRole('tabpanel', { name: 'Platten' })).toBeVisible();
    await expect(second.locator('.menu-tab-indicator')).toHaveCount(1);
    await expect(first.locator('.menu-tab-indicator')).toHaveCount(0);
    await expect
      .poll(() => page.locator('.menu-item').first().evaluate((element) => getComputedStyle(element).opacity))
      .toBe('1');
  });

  test('a deep reload restores the page without errors from the motion layer', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (error) => errors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') errors.push(message.text());
    });
    await page.goto(`${base}/eichwieserhof`);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(300);
    await page.reload();
    await page.waitForTimeout(800);
    await expect(page.locator('main h1')).toBeVisible();
    expect(errors).toEqual([]);
  });
});
