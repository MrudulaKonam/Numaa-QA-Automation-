import 'dotenv/config';
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'https://numaa.ai',
    permissions: ['camera', 'microphone'],
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
});
