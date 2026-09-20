import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: FEA  |  1 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("FEA - features", () => {

  // ID: FEA-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to "Why NuMaa?" section
  // Expected: "Smart Guidance", "Pregnancy Map", "Community Care" blocks with description text
  test("FEA-01: Three feature blocks render", async ({ page }) => {
    await gotoPublic(page, '/');
    for (const label of ['Smart Guidance', 'Pregnancy Map', 'Community Care']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

});
