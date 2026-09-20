import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: TLS  |  2 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("TLS - tools", () => {

  // ID: TLS-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to "Pregnancy Tools"
  // Expected: 6 titled cards with 1-line descriptions visible
  test("TLS-01: All 6 calculator cards render", async ({ page }) => {
    await gotoPublic(page, '/');
    for (const label of ['Ovulation Calculator', 'Due Date Calculator', 'Weight Gain Calculator', 'Gestational Age Calculator', 'Baby Daily Growth Tracker', 'Contraction Timer']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  // ID: TLS-02 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect a representative calculator card on the public home page
  // Expected: The card renders as visible content but remains presentational on the current public page
  test("TLS-02: Calculator card renders as visible presentational content", async ({ page }) => {
    await gotoPublic(page, '/');
    const card = page.getByText('Due Date Calculator', { exact: true }).first();
    await expect(card).toBeVisible();
    await expect(card.locator('..')).toBeVisible();
    await expect(card.locator('xpath=ancestor::a[1]')).toHaveCount(0);
  });

});
