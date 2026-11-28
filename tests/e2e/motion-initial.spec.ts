import { expect, test, type Page } from '@playwright/test';

/*
 * QA-119: everything inside the first viewport plays its entry right after
 * loading – without any scrolling – and ends fully visible. QA-120: no GSAP
 * warnings in the console.
 */

const base = '/bernds-blockhaus-website';
const routes = [
  '/',
  '/gaststaette',
  '/ferienwohnungen',
  '/galerie',
  '/galerie?kategorie=hof-tiere',
  '/eichwieserhof',
  '/kontakt',
  '/impressum',
  '/datenschutz',
  '/gibt-es-nicht',
];

/** Motion leftovers on elements that intersect the viewport. */
function hiddenInViewport(page: Page) {
  return page.evaluate(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      'main [data-reveal], main .print, main [data-counter], main [data-reveal="clip"] img, main .split-line',
    );
    const problems: string[] = [];
    for (const element of targets) {
      const box = element.getBoundingClientRect();
      if (box.bottom <= 0 || box.top >= window.innerHeight || box.width === 0) continue;
      const style = element.style;
      const parallax =
        element.matches('[data-parallax]') && window.matchMedia('(min-width: 1024px) and (pointer: fine)').matches;
      const issues = [
        getComputedStyle(element).opacity !== '1' && `opacity ${getComputedStyle(element).opacity}`,
        style.opacity && `inline opacity ${style.opacity}`,
        style.clipPath && 'clip',
        !parallax && style.transform && `transform ${style.transform}`,
        element.matches('.split-line') && 'split',
      ].filter(Boolean);
      if (issues.length) {
        problems.push(`${element.tagName.toLowerCase()}.${String(element.className).split(' ')[0]} "${(element.textContent ?? '').trim().slice(0, 20)}": ${issues.join(', ')}`);
      }
    }
    return problems;
  });
}

for (const width of [375, 768, 1440]) {
  for (const route of routes) {
    test(`${route} at ${width}px: first viewport is fully visible after load without scrolling`, async ({ page }) => {
      const warnings: string[] = [];
      page.on('console', (message) => {
        if (['warning', 'error'].includes(message.type()) && /gsap|GSAP|ScrollTrigger|SplitText|Flip/.test(message.text())) {
          warnings.push(message.text());
        }
      });
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`${base}${route}`);
      await expect(page.locator('main h1')).toBeVisible();
      const scrollBefore = await page.evaluate(() => window.scrollY);
      await expect.poll(() => hiddenInViewport(page), { timeout: 4000 }).toEqual([]);
      // The check itself never scrolled.
      expect(await page.evaluate(() => window.scrollY)).toBe(scrollBefore);

      if (route.startsWith('/galerie')) {
        const tiles = await page.locator('.masonry-tile:not(.masonry-note)').count();
        await expect(page.locator('.gallery-count b')).toHaveText(String(tiles));
        await expect(page.locator('.counter-overlay')).toHaveCount(0);
      }
      expect(warnings).toEqual([]);
    });
  }
}
