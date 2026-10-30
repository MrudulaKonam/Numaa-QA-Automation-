import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: CTA  |  1 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("CTA - cta", () => {

  // ID: CTA-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to "Start Your Health Journey Here"
  // Expected: Headline, "Start free 14 days trial" button, and "Learn More ->" button visible
  test("CTA-01: Bottom CTA renders", async ({ page }) => {
    await gotoPublic(page, '/');
    await expect(page.locator('h2').filter({ hasText: 'Start Your Health' })).toBeVisible();
    // Relabelled from "Start free 14 days trial" (live check 2026-10-30)
    await expect(page.getByRole('button', { name: 'Start Free Trial', exact: true })).toBeVisible();
    await expect(page.getByText(/Learn More/i)).toBeVisible();
  });

});
