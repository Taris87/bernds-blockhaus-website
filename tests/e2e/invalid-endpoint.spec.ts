import { expect, test } from '@playwright/test';

test('invalid HTTPS endpoint shows an error and sends no request', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', request => {
    if (request.method() === 'POST') requests.push(request.url());
  });

  await page.goto('/bernds-blockhaus-website/ferienwohnungen');
  await page.getByRole('button', { name: /Anfrage senden/i }).click();

  await expect(page.getByRole('status')).toContainText(
    /nicht korrekt konfiguriert/i,
  );
  expect(requests).toEqual([]);
});
