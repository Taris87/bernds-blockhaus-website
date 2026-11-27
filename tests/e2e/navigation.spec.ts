import { expect, test } from '@playwright/test';

const pagesBase = '/bernds-blockhaus-website';

async function completeRequiredInquiryFields(page: import('@playwright/test').Page) {
  await page.getByLabel('Name').fill('Erika Muster');
  await page.getByLabel('E-Mail').fill('erika@example.com');
  await page.getByLabel('Nachricht').fill('Ich interessiere mich für eine Ferienwohnung.');
}

test('home navigation reaches the gastronomy page', async ({ page }) => {
  await page.goto(`${pagesBase}/`);
  await page.getByRole('link', { name: /Gaststätte/ }).first().click();
  await expect(page).toHaveURL(/\/bernds-blockhaus-website\/gaststaette\/?$/);
  await expect(page.getByRole('heading', { name: /Speisekarte/i })).toBeVisible();
});

test('desktop navigation remains visible at desktop width', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto(`${pagesBase}/`);
  await expect(page.getByRole('navigation', { name: 'Hauptnavigation' })).toBeVisible();
});

test('inquiry form reports an unconfigured endpoint without sending', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST') requests.push(request.url());
  });

  await page.goto(`${pagesBase}/ferienwohnungen`);
  await completeRequiredInquiryFields(page);
  await page.getByRole('button', { name: /Anfrage senden/i }).click();

  await expect(page.getByRole('status')).toContainText(
    /noch nicht mit einem Versanddienst verbunden/i,
  );
  expect(requests).toEqual([]);
});
