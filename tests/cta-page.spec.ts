import { test, expect } from '@playwright/test';

// Module: CTAPG  |  2 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe('CTAPG - cta-page', () => {

  // ID: CTAPG-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. While logged in, scroll to "Start Your Health Journey Here" at the bottom of /services
  // Expected: Should recognize the signed-in state and not show a redundant trial signup prompt
  test.skip('CTAPG-01: Authenticated view shows correct messaging', async ({ page }) => {
    // TODO: implement navigation + assertions for this case
    // await page.goto('https://numaa.ai/...');
    // await expect(page.locator('...')).toBeVisible();
  });

  // ID: CTAPG-02 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Log out / open in incognito
  // Steps: 2. Navigate to /services and scroll to the bottom CTA
  // Expected: Should show the same "Start free 14 days trial" CTA seen on the logged-out Home page
  test.skip('CTAPG-02: Logged-out view shows a trial CTA', async ({ page }) => {
    // TODO: implement navigation + assertions for this case
    // await page.goto('https://numaa.ai/...');
    // await expect(page.locator('...')).toBeVisible();
  });

});
