import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: ERR  |  1 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("ERR - errors", () => {

  // ID: ERR-01 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to https://numaa.ai/this-page-does-not-exist-xyz
  // Expected: Custom 404/not-found experience with a way back to the site
  test("ERR-01: Non-existent URL handling", async ({ page }) => {
    await gotoPublic(page, '/this-page-does-not-exist-xyz');
    await expect(page.getByAltText('404 Not Found')).toBeVisible();
    await expect(page.getByRole('link', { name: 'Return to Home' })).toBeVisible();
  });

});
