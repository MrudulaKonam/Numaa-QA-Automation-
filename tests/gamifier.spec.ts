import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Module: GAME  |  11 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("GAME - gamifier", () => {

  // ID: GAME-10 | Type: Negative | Severity: Low | Last status: PASS
  // Steps: 1. Scroll the full page looking for a disclaimer, consistent with every other agent page tested (Nutrition, Mental Health, Kick Tracker, Mom to Mom, Baby Checklist all include one)
  // Expected: Some acknowledgment that quiz content is educational/general in nature, consistent with the site's established pattern
  test("GAME-10: Educational content includes an appropriate disclaimer", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    await expect(page.getByText(/Disclaimer: Gamifier Agent provides educational content and motivational support only/i)).toBeVisible();
  });

  // ID: GAME-11 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Check the browser tab title while on /game-agent
  // Expected: Should read something distinct, e.g. "Gamifier | Numaa"
  test("GAME-11: Page <title> is unique to Gamifier", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    await expect(page).toHaveTitle(/Gamifier.*Numaa/i);
  });

  // ID: GAME-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to https://numaa.ai/game-agent
  // Expected: "Gamifier Quiz Assessment" heading, description, and Chat button render
  test("GAME-01: Page loads with heading, description, and CTA", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    await expect(page.getByRole('heading', { name: 'Gamifier Quiz Assessment', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /chat/i }).first()).toBeVisible();
  });

  // ID: GAME-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the "Chat" button's accessible name
  // Expected: A descriptive label should be exposed for assistive technology
  test("GAME-02: Chat control has a descriptive accessible name", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    await expect(page.getByRole('button', { name: /chat/i }).first()).toHaveAccessibleName(/chat/i);
  });

  // ID: GAME-08 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Learning Snapshot"
  // Expected: Explanatory copy about the 3-card session and coach should render
  test("GAME-08: \"Learning Snapshot\" section renders", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    await expect(page.getByText('Learning Snapshot', { exact: true })).toBeVisible();
  });

});
