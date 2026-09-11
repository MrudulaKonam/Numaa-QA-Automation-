import { test, expect } from '@playwright/test';

// Module: BLG  |  2 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe('BLG - blog', () => {

  // ID: BLG-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to "Pregnancy Tips & Guides"
  // Expected: Cards show category tag, title, and teaser (Mental Health, Physical Activity, Nutrition, etc.)
  test.skip('BLG-01: Blog preview cards render', async ({ page }) => {
    // TODO: implement navigation + assertions for this case
    // await page.goto('https://numaa.ai/...');
    // await expect(page.locator('...')).toBeVisible();
  });

  // ID: BLG-04 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect each card's category label
  // Expected: "Mental Health", "Physical Activity", "Nutrition" labels shown
  test.skip('BLG-04: Category tags render per card', async ({ page }) => {
    // TODO: implement navigation + assertions for this case
    // await page.goto('https://numaa.ai/...');
    // await expect(page.locator('...')).toBeVisible();
  });

});
