import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/invalid-endpoint.spec.ts',
  use: {
    baseURL: 'http://127.0.0.1:4174',
    ...devices['Desktop Chrome'],
  },
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1 --port 4174',
    port: 4174,
    reuseExistingServer: false,
    env: { VITE_INQUIRY_ENDPOINT: 'https://%' },
  },
});
