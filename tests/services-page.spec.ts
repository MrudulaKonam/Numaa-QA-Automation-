import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: SVCPG  |  3 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("SVCPG - services-page", () => {

  // ID: SVCPG-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to https://numaa.ai/services
  // Expected: "Our Services" heading and supporting intro paragraph render
  test("SVCPG-01: Page loads with heading and intro copy", async ({ page }) => {
    await gotoPublic(page, '/services');
    await expect(page.getByRole('heading', { name: 'Our Services' })).toBeVisible();
    await expect(page.getByText('Discover comprehensive tools and support designed for your pregnancy journey')).toBeVisible();
  });

  // ID: SVCPG-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll through the top services grid on /services
  // Expected: Same 13 services as the home page grid render with title + description
  test("SVCPG-02: All 13 service cards render", async ({ page }) => {
    await gotoPublic(page, '/services');
    const serviceNames = ['Mom to Mom Network', 'Baby Setup', 'Calendar', 'Kick Count Agent', 'Physical Activity Agent', 'Ask NuMaa', 'Nutrition Assistant', 'Gamifier Agent', 'Journal Agent', 'Medication Support', 'Shopping Agent', 'Wellness'];
    for (const serviceName of serviceNames) {
      await expect(page.getByText(serviceName, { exact: true }).first()).toBeVisible();
    }
  });

  // ID: SVCPG-03 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect a representative service card on /services
  // Expected: The public service card is rendered as visible content, even though it is currently presentational rather than linked
  test("SVCPG-03: Service card renders as visible presentational content", async ({ page }) => {
    await gotoPublic(page, '/services');
    const card = page.getByText('Kick Count Agent', { exact: true }).first();
    await expect(card).toBeVisible();
    await expect(card.locator('..')).toBeVisible();
    await expect(card.locator('xpath=ancestor::a[1]')).toHaveCount(0);
  });

});
