import { test, expect } from '@playwright/test';

// Module: SOON  |  2 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe('SOON - coming-soon', () => {

  // ID: SOON-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to "Coming Up Soon"
  // Expected: Journal Agent, Financial Wellness, E-commerce Shop cards render, each tagged "In Development"
  test.skip('SOON-01: 3 "Coming Up Soon" cards render', async ({ page }) => {
    // TODO: implement navigation + assertions for this case
    // await page.goto('https://numaa.ai/...');
    // await expect(page.locator('...')).toBeVisible();
  });

  // ID: SOON-02 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Attempt to click/tab to a "Coming Up Soon" card
  // Expected: Cards should be clearly disabled (no pointer cursor, not keyboard-focusable, no click handler) since the feature isn't released
  test.skip('SOON-02: In-development cards are visibly non-interactive', async ({ page }) => {
    // TODO: implement navigation + assertions for this case
    // await page.goto('https://numaa.ai/...');
    // await expect(page.locator('...')).toBeVisible();
  });

});
