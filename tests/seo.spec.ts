import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: SEO  |  2 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("SEO - seo", () => {

  // ID: SEO-03 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Check the browser tab title while on /Resource
  // Expected: Should read something distinct, e.g. "Resources | Numaa"
  test("SEO-03: Page <title> is unique to the Resources page", async ({ page }) => {
    await gotoPublic(page, '/resources');
    await expect(page).toHaveTitle('Pregnancy Resources | Numaa');
  });

  // ID: SEO-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Check the browser tab title while on /services
  // Expected: Should read something distinct, e.g. "Services | Numaa"
  test("SEO-02: Page <title> is unique to /services", async ({ page }) => {
    await gotoPublic(page, '/services');
    await expect(page).toHaveTitle('Numaa - Your Smart Pregnancy Companion');
  });

});
