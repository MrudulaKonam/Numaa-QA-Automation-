import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: CASE  |  1 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("CASE - case", () => {

  // ID: CASE-01 | Type: Negative | Severity: medium | Last status: PASS
  // Steps: Open a browser and navigate to https://numaa.ai/resource (all lowercase)
  // Steps: Observe the response: raw JSON {"message":"Resource Page API"} — no site styling, no nav, no content (confirmed separately in RES-02–RES-05)
  // Steps: Now navigate to https://numaa.ai/Resource (capital R — same URL, only the "R" is capitalized)
  // Steps: Observe the response
  // Expected: A single canonical path should serve the page consistently regardless of casing — URLs are frequently treated as case-sensitive on the path segment, but the site's own links should point to whichever path is actually correct and functional.
  test("CASE-01: Root cause: route casing mismatch makes the Resources feature unreachable", async ({ page }) => {
    await page.goto('/resource', { waitUntil: 'domcontentloaded' });
    await expect(page).toHaveURL(/\/resource\/?$/);
    await expect(page.locator('body')).toHaveText(/Resource Page API/);
    await gotoPublic(page, '/Resource');
    await expect(page).toHaveURL(/\/resources\/?$/);
    await expect(page.getByRole('heading', { name: 'Resources' })).toBeVisible();
  });

});
