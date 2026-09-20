import { test, expect } from '@playwright/test';

// Module: HERO  |  1 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("HERO - hero", () => {

  // ID: HERO-04 | Type: Positive | Severity: n/a | Last status: PASS
  test("HERO-04: Trust badges render", async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' });

    const badges = [
      "No credit card required",
      "Trusted by 10,000+ moms",
      "Personalized AI insights",
      "Smart nutrition plans",
      "Mental wellness support",
      "Baby growth tracking",
    ];

    for (const badge of badges) {
      await expect(page.getByText(badge, { exact: false }).first()).toBeVisible();
    }
  });

});