import { expect, test, type Page } from '@playwright/test';

/*
 * QA-111: after a breakpoint change gsap.matchMedia reverts and rebuilds the
 * motion layer. Everything that was already shown must stay fully visible:
 * no inline opacity < 1, no leftover transform or clip-path from a reveal.
 */

const base = '/bernds-blockhaus-website';
const routes = ['/', '/gaststaette', '/ferienwohnungen', '/galerie', '/eichwieserhof', '/kontakt'];
const resizes: [number, number][] = [
  [1440, 1000],
  [1000, 1440],
  [1440, 700],
  [700, 1440],
  [375, 900],
  [900, 375],
];

/** Scrolls through the whole page in viewport steps (instant), then waits for reveals to finish. */
async function scrollThrough(page: Page) {
  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  const step = await page.evaluate(() => Math.round(window.innerHeight * 0.6));
  for (let top = 0; top <= height; top += step) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), top);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1600);
}

async function leftovers(page: Page) {
  return page.locator('main [data-reveal], main .print, main [data-counter]').evaluateAll((elements) =>
    elements
      .map((element) => {
        const style = (element as HTMLElement).style;
        return {
          name: `${element.tagName.toLowerCase()}.${String(element.className).split(' ')[0]} ${(element.textContent ?? '').trim().slice(0, 24)}`,
          opacity: getComputedStyle(element).opacity,
          inlineOpacity: style.opacity,
          clip: style.clipPath,
          // Prints on wide screens with a fine pointer keep the parallax translate.
          transform: element.matches('[data-parallax]') && window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches ? '' : style.transform,
          split: element.querySelectorAll('.split-line').length,
        };
      })
      .filter((state) => state.opacity !== '1' || state.inlineOpacity !== '' || state.clip !== '' || state.transform !== '' || state.split > 0),
  );
}

for (const route of routes) {
  for (const [from, to] of resizes) {
    test(`${route}: everything shown stays visible after resizing ${from} → ${to}`, async ({ page }) => {
      test.slow(); // two full scroll passes over a long page
      await page.setViewportSize({ width: from, height: 900 });
      await page.goto(`${base}${route}`);
      await page.evaluate(() => document.fonts.ready);
      await scrollThrough(page);
      await page.setViewportSize({ width: to, height: 900 });
      await page.waitForTimeout(400);
      await scrollThrough(page);
      expect(await leftovers(page)).toEqual([]);
    });
  }
}
