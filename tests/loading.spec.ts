import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: LOAD  |  1 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("LOAD - loading", () => {

  // ID: LOAD-01 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Load /services
  // Steps: 2. Wait for visible content to finish rendering
  // Steps: 3. Attempt DOM-level automation/accessibility queries against the page
  // Expected: Page should settle to a network/script-idle state shortly after content renders, allowing normal browser tooling (accessibility scanners, automation, some browser extensions) to interact with it
  test("LOAD-01: Page reaches a stable idle state after loading", async ({ page }) => {
    await gotoPublic(page, '/services');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('heading', { name: 'Our Services' })).toBeVisible();
  });

});
