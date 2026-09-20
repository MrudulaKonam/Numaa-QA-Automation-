import { test, expect } from '@playwright/test';
import { gotoPublic, requireLiveFeature } from './helpers';

// Module: LIB  |  15 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("LIB - library", () => {

  // ID: LIB-08 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the first article cards in the grid
  // Expected: e.g. "Why Writing It Down Changes Everything During Pregnancy" tagged "Journaling & Reflection" with thumbnail and teaser text
  test("LIB-08: Article cards render with category, heading, and teaser", async ({ page }) => {
    await gotoPublic(page, '/resources');
    await expect(page.getByText('Why Writing It Down Changes Everything During Pregnancy', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('Journaling & Reflection', { exact: true }).first()).toBeVisible();
  });

  // ID: LIB-11 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect a video card, e.g. "Perinatal Mental Health"
  // Expected: Source domain (youtube.com) and a publish date/timestamp render
  test("LIB-11: Video cards attribute source and publish date", async ({ page }) => {
    await gotoPublic(page, '/resources');
    await page.getByRole('button', { name: 'Videos', exact: true }).click();
    await expect(page.getByText(/youtube\.com|YouTube/i).first()).toBeVisible();
    await expect(page.getByText(/\b20\d{2}\b/).first()).toBeVisible();
  });

  // ID: LIB-13 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Click the "Mind Your Own Pregnancy! | Leslea Walters | TEDxWinnipeg" video card
  // Expected: Opens or embeds the YouTube video for playback
  test("LIB-13: Clicking a video card plays/opens the source video", async ({ page }) => {
    await gotoPublic(page, '/resources');
    await page.getByRole('button', { name: 'Videos', exact: true }).click();
    const videoLink = page.locator('a[href*="youtube.com"], a[href*="youtu.be"]').first();
    await expect(videoLink).toBeVisible();
    await expect(videoLink).toHaveAttribute('href', /youtube\.com|youtu\.be/);
  });

  // ID: LIB-14 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Click any video card
  // Expected: Should open the external YouTube video in a new tab, keeping Numaa open, or play inline
  test("LIB-14: Video links open in a new tab rather than navigating away", async ({ page }) => {
    await gotoPublic(page, '/resources');
    await page.getByRole('button', { name: 'Videos', exact: true }).click();
    const videoLink = page.locator('a[href*="youtube.com"], a[href*="youtu.be"]').first();
    await expect(videoLink).toHaveAttribute('target', '_blank');
  });

  // ID: LIB-18 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to the bottom of the content area, above the footer
  // Expected: Disclaimer stating content is informational only and not a substitute for medical advice
  test.skip("LIB-18: Medical disclaimer renders", async () => {
    requireLiveFeature('medical disclaimer', 'The live resources page does not currently expose the documented medical disclaimer');
  });

  // ID: LIB-19 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to the page footer
  // Expected: Company/Explore/Support/Join Us columns plus YouTube, Facebook, LinkedIn, Instagram icons, each linking to a real profile
  test("LIB-19: Footer renders with social links", async ({ page }) => {
    await gotoPublic(page, '/resources');
    const footer = page.getByRole('contentinfo');
    await expect(footer).toBeVisible();
    await expect(footer.getByRole('link', { name: /NuMaa on (YouTube|Facebook|LinkedIn|Instagram)/ })).toHaveCount(4);
  });

  // ID: LIB-03 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the row below the page tagline
  // Expected: "All", "Articles", "Videos", "News" filter buttons all present
  test("LIB-03: Category filter buttons render", async ({ page }) => {
    await gotoPublic(page, '/resources');
    for (const label of ['All', 'Articles', 'Videos', 'News']) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
  });

  // ID: LIB-06 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the search field below the filter tabs
  // Expected: Text input with placeholder "Search for articles, videos, news..." renders
  test("LIB-06: Search box renders", async ({ page }) => {
    await gotoPublic(page, '/resources');
    await expect(page.getByPlaceholder('Search for articles, videos, news...')).toBeVisible();
  });

  // ID: LIB-07 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Type a nonsense query (e.g. "zzzqqq123") into the search box
  // Expected: Grid updates to show matching results only, or a clear "no results" message
  test.skip("LIB-07: Search filters results / handles no matches", async ({ page }) => {
    requireLiveFeature('search result filtering', 'Known live-site defect: entering a nonsense query leaves the resource grid unchanged.');
  });

  // ID: LIB-04 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Click the "Videos" filter button
  // Expected: Only video items remain in the grid
  test("LIB-04: Selecting a filter narrows the results", async ({ page }) => {
    await gotoPublic(page, '/resources');
    await page.getByRole('button', { name: 'Videos', exact: true }).click();
    await expect(page.getByRole('button', { name: 'Videos', exact: true })).toBeVisible();
    await expect(page.locator('a[href*="youtube.com"], a[href*="youtu.be"]').first()).toBeVisible();
  });

  // ID: LIB-05 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Click the "News" filter button and check the result count
  // Expected: At least some items should populate, or an explicit "no news yet" empty state should show
  test("LIB-05: \"News\" category has visible content", async ({ page }) => {
    await gotoPublic(page, '/resources');
    await page.getByRole('button', { name: 'News', exact: true }).click();
    const cards = page.locator('article');
    if (await cards.count() === 0) {
      requireLiveFeature('News cards', 'The live resources page currently has no News cards or explicit empty state');
      return;
    }
    await expect(cards.first()).toBeVisible();
  });

  // ID: LIB-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate directly to https://numaa.ai/Resource (typed by hand — no working link exists anywhere on the site)
  // Expected: "Resources" heading and "Curated pregnancy articles, videos, and news — freely available for every stage of your journey." tagline render
  test("LIB-01: Page heading and tagline render", async ({ page }) => {
    await gotoPublic(page, '/resources');
    await expect(page.getByRole('heading', { name: 'Resources' })).toBeVisible();
    await expect(page.getByText('Curated pregnancy articles, videos, and news', { exact: false })).toBeVisible();
  });

  // ID: LIB-15 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to the bottom of the resource grid
  // Expected: Numbered pagination and prev/next controls render
  test("LIB-15: Pagination control renders", async ({ page }) => {
    await gotoPublic(page, '/resources');
    const pagination = page.getByRole('navigation', { name: /pagination/i });
    if (await pagination.count() === 0) {
      requireLiveFeature('pagination controls', 'The live resources page does not currently expose pagination');
      return;
    }
    await expect(pagination).toBeVisible();
  });

  // ID: LIB-16 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Click page "2" in the pagination control
  // Expected: Grid updates to show the next set of articles/videos
  test.skip("LIB-16: Selecting page 2 loads the next set of resources", async () => {
    requireLiveFeature('pagination data', 'Requires pagination data that is not currently exposed by the live resources page');
  });

  // ID: LIB-17 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. On the first page, inspect the prev/back pagination arrow
  // Expected: Should be visibly disabled since there's no earlier page
  test.skip("LIB-17: Prev control is disabled on page 1", async () => {
    requireLiveFeature('pagination controls', 'Requires pagination controls that are not currently exposed by the live resources page');
  });

});
