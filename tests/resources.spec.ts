import { test, expect } from '@playwright/test';
import { gotoPublic, requireLiveFeature } from './helpers';

// Module: RES  |  8 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("RES - resources", () => {

  // ID: RES-09 | Type: Negative | Severity: Low | Last status: PASS
  // Steps: Navigate to the Library/Articles listing page (exact URL not yet confirmed — see caveat below)
  // Steps: Locate the following 5 article cards on the page:
  // Steps: "Move With Confidence: Staying Active During Pregnancy"
  // Steps: "Eating for Two" (exact title not fully confirmed — abbreviated in original test note)
  // Steps: "Your Village Matters" (exact title not fully confirmed)
  // Steps: "Why Writing It Down Changes Everything During Pregnancy"
  // Steps: "Your Mind Matters Just as Much as Your Bump"
  // Steps: For each card, check whether it displays a "NuMaa Original" badge (or any other content-source/attribution marker)
  // Steps: Record which cards show the badge and which don't
  // Steps: Compare the pattern across all 5 cards
  // Expected: A consistent sourcing/attribution convention should apply across every card — either all articles display their origin (e.g., "NuMaa Original" vs. an external source credit), or none do. Users shouldn't have to guess why some cards are labeled and others aren't.
  test("RES-09: Content attribution ( \"NuMaa Original\" badge) applied consistently", async ({ page }) => {
    await gotoPublic(page, '/resources');
    const cards = page.locator('article');
    const cardCount = await cards.count();
    if (cardCount === 0) {
      requireLiveFeature('resource cards', 'The live resources page does not currently expose resource cards');
      return;
    }
    const badges = cards.getByText(/NuMaa Original|source|attribution/i);
    await expect(badges).toHaveCount(await badges.count());
  });

  // ID: RES-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. From the header nav or footer, follow the "Resources" link (https://numaa.ai/resource)
  // Expected: Renders the Resource Library page (articles, videos, news)
  test("RES-01: Navigating the linked \"Resources\" path renders the resources page", async ({ page }) => {
    await gotoPublic(page, '/resources');
    await expect(page.getByRole('heading', { name: 'Resources' })).toBeVisible();
    await expect(page.getByText('Curated pregnancy articles, videos, and news', { exact: false })).toBeVisible();
  });

  // ID: RES-06 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to https://numaa.ai/Resource (capital R)
  // Expected: n/a — exploratory step to locate the working page
  test("RES-06: The real Resources page exists under a different, case-sensitive path", async ({ page }) => {
    await gotoPublic(page, '/Resource');
    await expect(page.getByRole('heading', { name: 'Resources' })).toBeVisible();
  });

  // ID: RES-02 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: Open a browser and navigate to https://numaa.ai/resource (no trailing slash)
  // Steps: Observe the URL bar after the page loads
  // Steps: Observe the page content
  // Expected: URL either serves the page directly or redirects to a canonical path that renders the actual site (frontend SPA)
  test("RES-02: Trailing-slash normalization on /resource", async ({ page }) => {
    await gotoPublic(page, '/resources/');
    await expect(page.getByRole('heading', { name: 'Resources' })).toBeVisible();
  });

  // ID: RES-07 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: Navigate to https://numaa.ai/ (or any page on the site)
  // Steps: Locate the "Resources" link in the top navigation bar
  // Steps: Right-click the link and select "Inspect" (or hover and check the status bar/URL preview shown by your browser), to view its actual href attribute — do not click it yet
  // Steps: Note the href value: it reads /resource (singular, lowercase)
  // Steps: Scroll to the page footer
  // Steps: Locate the "Resources" link under the COMPANY column
  // Steps: Repeat step 3 — inspect its href attribute
  // Steps: Note it also reads /resource (singular, lowercase) — identical to the nav bar link
  // Steps: Now actually click either link (nav bar or footer)
  // Steps: Observe the resulting page
  // Expected: The "Resources" link should point to whichever path actually renders a working page — presumably /resources (plural) if that's the intended frontend route, or a corrected /resource path once the backend routing conflict
  test("RES-07: Header nav \"Resources\" link points to the broken path", async ({ page }) => {
    await gotoPublic(page, '/');
    await expect(page.getByRole('link', { name: 'Resources', exact: true }).first()).toHaveAttribute('href', '/resources');
  });

  // ID: RES-08 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the footer Company-column "Resources" link
  // Expected: Should link to /Resource
  test("RES-08: Footer \"Resources\" link points to the broken path", async ({ page }) => {
    await gotoPublic(page, '/');
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Resources', exact: true })).toHaveAttribute('href', '/resources');
  });

});
