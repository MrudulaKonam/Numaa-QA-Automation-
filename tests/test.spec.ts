import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: TST  |  1 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("TST - test", () => {

  // ID: TST-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to "What Our Moms Say About Us"
  // Expected: 3 testimonials (Leo, Priya, Fatima) with name, role, 5-star rating, quote, and body text
  test("TST-01: Testimonial cards render", async ({ page }) => {
    await gotoPublic(page, '/');
    await expect(page.getByText('What Our Moms Say About Us', { exact: true })).toBeVisible();
    for (const name of ['Leo', 'Priya', 'Fatima']) {
      await expect(page.getByText(name, { exact: true })).toBeVisible();
    }
  });

});
