import { test, expect } from '@playwright/test';

// Module: CTA  |  1 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe('CTA - cta', () => {

  // ID: CTA-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to "Start Your Health Journey Here"
  // Expected: Headline, "Start free 14 days trial" button, and "Learn More ->" button visible
  test.skip('CTA-01: Bottom CTA renders', async ({ page }) => {
    // TODO: implement navigation + assertions for this case
    // await page.goto('https://numaa.ai/...');
    // await expect(page.locator('...')).toBeVisible();
  });

});
