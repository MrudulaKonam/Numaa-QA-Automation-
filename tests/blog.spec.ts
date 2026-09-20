import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: BLG  |  2 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("BLG - blog", () => {

  // ID: BLG-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to "Pregnancy Tips & Guides"
  // Expected: Cards show category tag, title, and teaser (Mental Health, Physical Activity, Nutrition, etc.)
  test("BLG-01: Blog preview cards render", async ({ page }) => {
    await gotoPublic(page, '/');
    await expect(page.getByRole('heading', { name: 'Pregnancy Tips & Guides' })).toBeVisible();
    for (const title of ['Why Writing It Down Changes Everything During Pregnancy', 'Your Mind Matters Just as Much as Your Bump', 'Move With Confidence: Staying Active During Pregnancy']) {
      await expect(page.getByText(title, { exact: true })).toBeVisible();
    }
  });

  // ID: BLG-04 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect each card's category label
  // Expected: "Mental Health", "Physical Activity", "Nutrition" labels shown
  test("BLG-04: Category tags render per card", async ({ page }) => {
    await gotoPublic(page, '/');
    for (const label of ['Mental Health', 'Physical Activity', 'Nutrition']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

});
