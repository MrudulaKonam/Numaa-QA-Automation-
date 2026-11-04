import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 1,
  // numaa.ai allows one active session per account and every test shares one
  // account, so parallel workers log each other out. Run serially on CI.
  workers: process.env.CI ? 1 : undefined,
  reporter: [['html', { open: 'never' }]],
  use: {
    baseURL: 'https://numaa.ai',
    permissions: ['camera', 'microphone'],
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    // Desktop: every spec except the mobile Meet spec, with the same defaults as before projects were added.
    { name: 'chromium', testIgnore: /numaa-meet-mobile\.spec\.ts/ },
    // Mobile: only the NuMaa Meet mobile spec.
    { name: 'iphone', testMatch: /numaa-meet-mobile\.spec\.ts/, use: { ...devices['iPhone 13'] } },     // WebKit - layout
    { name: 'iphone-se', testMatch: /numaa-meet-mobile\.spec\.ts/, use: { ...devices['iPhone SE'] } },  // narrowest width
    {
      name: 'android-media', // Chromium - media / clipboard tests
      testMatch: /numaa-meet-mobile\.spec\.ts/,
      use: {
        ...devices['Pixel 7'],
        permissions: ['camera', 'microphone', 'clipboard-read', 'clipboard-write'],
        launchOptions: { args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] },
      },
    },
  ],
});