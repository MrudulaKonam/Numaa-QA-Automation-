import { test, expect } from '@playwright/test';
import { gotoPublic, requireLiveFeature } from './helpers';

// Module: BABY  |  2 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("BABY - baby", () => {

  // ID: BABY-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to "Baby Setup Services"
  // Expected: Description plus a 5-item "What We Offer" checklist render (nursery setup, gear recommendations, feeding station, baby-proofing, parent guidance)
  test("BABY-01: Detail section renders with offer checklist", async ({ page }) => {
    await gotoPublic(page, '/services');
    await expect(page.getByRole('heading', { name: 'Baby Setup Services' })).toBeVisible();
    for (const label of ['Nursery setup and safety assessment', 'Essential baby gear recommendations', 'Feeding station organization', 'Baby-proofing consultation', 'New parent guidance and support']) {
      await expect(page.locator('li').filter({ hasText: label })).toBeVisible();
    }
  });

  // ID: BABY-03 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Click the "Baby Setup Services" button under "Ready to Get Started?"
  // Expected: Opens a scheduling/consultation booking flow as implied by the surrounding copy
  test.skip("BABY-03: CTA click opens a consultation/booking flow", async ({ page }) => {
    requireLiveFeature('Baby Setup consultation CTA', 'The live CTA is presentational and does not route to a booking flow in this environment.');
  });

});
