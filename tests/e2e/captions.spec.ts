import { expect, test, type Page } from '@playwright/test';

/*
 * QA-115: captions on the collage prints are fully readable – not cut off
 * (no ellipsis/overflow) and not covered by another print or the stamp.
 * Static layout is checked (reduced motion: no tweens in between).
 */

const base = '/bernds-blockhaus-website';
test.use({ reducedMotion: 'reduce' });

async function captionProblems(page: Page, selector: string) {
  return page.locator(selector).evaluateAll((captions) =>
    captions.flatMap((caption) => {
      const problems: string[] = [];
      const name = caption.textContent?.trim() ?? '';
      if (caption.scrollWidth > caption.clientWidth + 1 || caption.scrollHeight > caption.clientHeight + 1) {
        problems.push(`${name}: cut off`);
      }
      // Probe points along the rendered text: each must hit the caption itself.
      const range = document.createRange();
      range.selectNodeContents(caption);
      for (const rect of range.getClientRects()) {
        for (const fraction of [0.1, 0.5, 0.9]) {
          const x = rect.left + rect.width * fraction;
          const y = rect.top + rect.height / 2;
          const hit = document.elementFromPoint(x, y);
          if (!hit || !(caption === hit || caption.contains(hit))) {
            problems.push(`${name}: covered at ${Math.round(fraction * 100)}% by ${hit?.className ?? 'nothing'}`);
          }
        }
      }
      return problems;
    }),
  );
}

for (const width of [320, 375, 430]) {
  test(`hero collage captions are readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 1400 });
    await page.goto(`${base}/`);
    await page.evaluate(() => document.fonts.ready);
    await page.locator('.hero-collage').scrollIntoViewIfNeeded();
    expect(await captionProblems(page, '.hero-collage .print figcaption')).toEqual([]);
  });
}

for (const width of [375, 768, 1100, 1440]) {
  test(`index row captions are readable at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto(`${base}/`);
    await page.evaluate(() => document.fonts.ready);
    const rows = page.locator('.index-row');
    for (let index = 0; index < (await rows.count()); index += 1) {
      await rows.nth(index).locator('.index-photos').evaluate((element) =>
        element.scrollIntoView({ block: 'center', behavior: 'instant' }),
      );
      expect(await captionProblems(page, `.index-row:nth-of-type(${index + 1}) .print figcaption`)).toEqual([]);
    }
  });
}

test('gallery intro: display-xl title on phones and the photo count beside the lead', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${base}/galerie`);
  await expect(page.locator('main h1')).toHaveCSS('font-size', '58px');
  const count = page.locator('.page-intro .gallery-count');
  await expect(count).toHaveText(/39\s*Fotos/);
  await expect(count).toHaveAttribute('aria-live', 'polite');
});
