import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: Services  |  1 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("Services - services", () => {

  // ID: Services_02 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: Log in to numaa.ai with a valid account.
  // Steps: Navigate to https://numaa.ai/services.
  // Steps: Scroll down to the "Baby Setup Services" section (below Mom to Mom Network, above Kick Count Monitoring).
  // Steps: Continue scrolling to the bottom of that section, to the "Ready to Get Started?" subsection.
  // Steps: Read the subsection's supporting text: "Explore baby preparation tools and product recommendations for your growing family."
  // Steps: Inspect the CTA button directly below that text.
  // Steps: Note the button's actual label.
  // Expected: Button text should describe the action it performs, consistent with the supporting sentence above it.
  test("Services_02: CTA button label is unclear", async ({ page }) => {
    await gotoPublic(page, '/services');
    const section = page.getByRole('heading', { name: 'Baby Setup Services' }).locator('..');
    await expect(section.getByText('Explore baby preparation tools and product recommendations for your growing family.', { exact: true })).toBeVisible();
    await expect(section.getByRole('button', { name: 'Baby Preparation', exact: true })).toBeVisible();
  });

});
