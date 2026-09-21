import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Module: Misc  |  10 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx
// NOTE: Journal Agent tests are now covered by journal.spec.ts (JRN-01..)
// and Travel Agent tests are now covered by travel.spec.ts (TRV-01..).
// Duplicated/outdated versions of those tests were removed from here to
// avoid maintaining two conflicting copies of the same coverage.

test.describe("Misc - misc", () => {

  // ID:  Journal Agent — Cross-Cutting | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Check the browser tab title while on /journal-agent
  // Expected: Should read something distinct, e.g. "Journal | Numaa"
  test(" Journal Agent — Cross-Cutting: Page <title> is unique to Journal", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    await expect(page).toHaveTitle(/Journal.*Numaa/i);
  });

  // ID:  Travel Agent — Cross-Cutting | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Check the browser tab title while on /travel-agent
  // Expected: Should read something distinct, e.g. "Travel Advisor | Numaa"
  test(" Travel Agent — Cross-Cutting: Page <title> is unique to Travel Agent", async ({ page }) => {
    await login(page);
    await page.goto('/travel-agent');
    await expect(page).toHaveTitle(/Travel.*Numaa/i);
  });

});