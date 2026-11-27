import { expect, test, type Page } from '@playwright/test';

async function completeRequiredInquiryFields(page: Page) {
  await page.getByLabel('Name').fill('Erika Muster');
  await page.getByLabel('E-Mail').fill('erika@example.com');
  await page.getByLabel('Nachricht').fill('Ich interessiere mich für eine Ferienwohnung.');
}

test('invalid HTTPS endpoint shows an error and sends no request', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST') requests.push(request.url());
  });

  await page.goto('/bernds-blockhaus-website/ferienwohnungen');
  await completeRequiredInquiryFields(page);
  await page.getByRole('button', { name: /Anfrage senden/i }).click();

  await expect(page.getByRole('status')).toContainText(
    /nicht korrekt konfiguriert/i,
  );
  expect(requests).toEqual([]);
});
