import { test, expect } from '@playwright/test';

// Module: HERO  |  1 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe('HERO - hero', () => {

  // ID: HERO-04 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect strip below hero CTAs
  // Expected: "No credit card required", "Trusted by 10,000+ moms", "Personalized AI insights", "Smart nutrition plans", "Mental wellness support", "Baby growth tracking" all visible with icons
  test.skip('HERO-04: Trust badges render', async ({ page }) => {
    // TODO: implement navigation + assertions for this case
    // await page.goto('https://numaa.ai/...');
    // await expect(page.locator('...')).toBeVisible();
  });

});
