import { test, expect } from '@playwright/test';

// Module: SEO  |  2 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("SEO - seo", () => {

  // ID: SEO-03 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Check the browser tab title while on /Resource
  // Expected: Should read something distinct, e.g. "Resources | Numaa"
  test.skip("SEO-03: Page <title> is unique to the Resources page", async ({ page }) => {
    // TODO: implement navigation + assertions for this case
    // await page.goto('https://numaa.ai/...');
    // await expect(page.locator('...')).toBeVisible();
  });

  // ID: SEO-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Check the browser tab title while on /services
  // Expected: Should read something distinct, e.g. "Services | Numaa"
  test.skip("SEO-02: Page <title> is unique to /services", async ({ page }) => {
    // TODO: implement navigation + assertions for this case
    // await page.goto('https://numaa.ai/...');
    // await expect(page.locator('...')).toBeVisible();
  });

});
