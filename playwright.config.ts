import 'dotenv/config';
import { defineConfig, devices } from '@playwright/test';

// NuMaa Meet specs are run on demand only, never in the daily CI run.
const ON_CI = !!process.env.CI;
const MEET_SPECS = /numaa-meet(-mobile)?\.spec\.ts/;
const MOBILE_MEET_SPEC = /numaa-meet-mobile\.spec\.ts/;

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
    // Desktop: every spec except the mobile Meet spec (and, on CI, except both Meet specs),
    // with the same defaults as before projects were added.
    { name: 'chromium', testIgnore: ON_CI ? MEET_SPECS : MOBILE_MEET_SPEC },
    // Mobile: only the NuMaa Meet mobile spec. Not created on CI, so the daily run never includes them.
    ...(ON_CI ? [] : [
      { name: 'iphone', testMatch: MOBILE_MEET_SPEC, use: { ...devices['iPhone 13'] } },     // WebKit - layout
      { name: 'iphone-se', testMatch: MOBILE_MEET_SPEC, use: { ...devices['iPhone SE'] } },  // narrowest width
      {
        name: 'android-media', // Chromium - media / clipboard tests
        testMatch: MOBILE_MEET_SPEC,
        use: {
          ...devices['Pixel 7'],
          permissions: ['camera', 'microphone', 'clipboard-read', 'clipboard-write'],
          launchOptions: { args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] },
        },
      },
    ]),
  ],
});