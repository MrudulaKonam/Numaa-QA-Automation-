import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: PAT  |  2 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("PAT - patterns", () => {

  // ID: PAT-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to "Physical Activity Tracker"
  // Expected: Description plus 6 feature cards render: Safe Exercise Monitoring, Personalized Recommendations, Progress Tracking, Expert Guidance, Wellness Reminders, Health Integration
  test("PAT-01: Detail section renders with 6 feature cards", async ({ page }) => {
    await gotoPublic(page, '/services');
    await expect(page.getByRole('heading', { name: 'Physical Activity Tracker' })).toBeVisible();
    for (const label of ['Safe Exercise Monitoring', 'Personalized Recommendations', 'Progress Tracking', 'Expert Guidance', 'Wellness Reminders', 'Health Integration']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  // ID: PAT-02 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Compare the detail section title "Physical Activity Tracker" against the corresponding card in the top grid on the same page and on the home page
  // Expected: The same feature should use one consistent name across the page
  test("PAT-02: Feature name inconsistent with grid label", async ({ page }) => {
    await gotoPublic(page, '/services');
    await expect(page.getByText('Physical Activity Agent', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Physical Activity Tracker' })).toBeVisible();
  });

});
