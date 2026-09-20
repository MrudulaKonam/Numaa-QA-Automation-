import { test, expect } from '@playwright/test';
import { login, requireLiveFeature } from '../helpers';

// Module: CHK  |  12 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("CHK - checklist", () => {

  // ID: CHK-10 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the checklist grid
  // Expected: Diapers & Changing, Baby Bottles & Feeding, Nursery Furniture, Strollers & Car Seats, Baby Clothes & Shoes, Baby Toys & Games each render with image, heading, description, Reschedule, and Shop Now
  test("CHK-10: All 6 checklist category cards render", async ({ page }) => {
    await login(page);
    await page.goto('/check-list');
    for (const label of ['Diapers & Changing', 'Baby Bottles & Feeding', 'Nursery Furniture', 'Strollers & Car Seats', 'Baby Clothes & Shoes', 'Baby Toys & Games']) {
      await expect(page.getByRole('heading', { name: label, exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Reschedule', exact: true })).toBeVisible();
      await expect(page.getByRole('button', { name: 'Shop Now', exact: true })).toBeVisible();
    }
  });

  // ID: CHK-11 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: Log in to numaa.ai with a valid test account
  // Steps: Navigate to https://numaa.ai/check-list
  // Steps: Locate the "Diapers & Changing" item card
  // Steps: Note the current browser URL (https://numaa.ai/check-list) and the number of open tabs
  // Steps: Click the "🛒 Shop Now" button on that card
  // Steps: Immediately check the following three things:
  // Steps: Did a new browser tab open?
  // Steps: Did the URL change in any way?
  // Steps: Did the page content change at all (modal appearing, loading state, any visual difference)?
  // Expected: Opens a relevant product/shop page, likely in a new tab
  test.skip("CHK-11: \"Shop Now\" opens a real, working product page", async () => {
    requireLiveFeature('external product destination', 'Requires validating an external product destination and opening a new tab');
  });

  // ID: CHK-12 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: Log in to numaa.ai with a valid test account
  // Steps: Navigate to https://numaa.ai/check-list
  // Steps: Locate the "Nursery Furniture" item card
  // Steps: Click the "Reschedule" button on that specific card
  // Steps: Observe what appears immediately after clicking — specifically look for:
  // Steps: A calendar or date-picker control (allowing you to select a specific new date)
  // Steps: A week-selector or similar input
  // Steps: If a confirmation modal appears instead (e.g., "Reschedule Reminder"), read its exact text
  // Steps: Note which item name is referenced in that modal — confirm it matches "Nursery Furniture" (the item you actually clicked)
  // Steps: Check if the modal is dismissible in a way that reveals a picker underneath, or if "Got it" simply closes it with no further action available
  // Expected: Clicking "Reschedule" should open a date/week picker, letting the user actively choose when to move this item to.
  test.skip("CHK-12: \"Reschedule\" lets the user pick a new target date/week", async () => {
    requireLiveFeature('account-backed reschedule flow', 'Requires changing reminder state and confirming the account-backed reschedule flow');
  });

  // ID: CHK-14 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to the bottom of the page
  // Expected: "This app suggests products but isn't medical advice. Consult your doctor before use during pregnancy." should render
  test("CHK-14: Product-suggestion disclaimer renders", async ({ page }) => {
    await login(page);
    await page.goto('/check-list');
    await expect(page.getByText("This app suggests products but isn't medical advice. Consult your doctor before use during pregnancy.", { exact: true })).toBeVisible();
  });

  // ID: CHK-16 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the left app sidebar on /check-list
  // Expected: Same sidebar (Dashboard, Calendar, agent shortcuts, etc.) seen on other authenticated pages renders here too
  test("CHK-16: Full authenticated app sidebar renders consistently", async ({ page }) => {
    await login(page);
    await page.goto('/check-list');
    for (const label of ['Dashboard', 'Calendar', 'Ask NuMaa', 'Mom to Mom', 'Nutrition', 'Mental Health', 'Kick Count Agent', 'Baby Checklist', 'Gamifier', 'Medication', 'Physical Activity', 'Content', 'Journal', 'Shopping Agent', 'Travel Advisor']) {
      await expect(page.getByRole('link', { name: label, exact: true }).or(page.getByRole('button', { name: label, exact: true }))).toBeVisible();
    }
  });

  // ID: CHK-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to https://numaa.ai/check-list
  // Expected: "Baby Checklist & Shop" heading and description render
  test("CHK-01: Page loads with heading and description", async ({ page }) => {
    await login(page);
    await page.goto('/check-list');
    await expect(page.getByRole('heading', { name: 'Baby Checklist & Shop', exact: true })).toBeVisible();
  });

  // ID: CHK-04 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the welcome message below the "Baby Checklist" heading
  // Expected: Encouraging, stage-appropriate copy should render
  test("CHK-04: Personalized welcome copy renders", async ({ page }) => {
    await login(page);
    await page.goto('/check-list');
    await expect(page.getByText(/welcome|journey|little one/i).first()).toBeVisible();
  });

  // ID: CHK-05 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the checklist toolbar
  // Expected: "Search checklist items..." text input renders
  test("CHK-05: Search box renders", async ({ page }) => {
    await login(page);
    await page.goto('/check-list');
    await expect(page.getByPlaceholder('Search checklist items...')).toBeVisible();
  });

  // ID: CHK-06 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the checklist toolbar
  // Expected: "Completed", "Buy Now", "Future Purchases" tabs render
  test("CHK-06: 3 filter tabs render", async ({ page }) => {
    await login(page);
    await page.goto('/check-list');
    for (const label of ['Completed', 'Buy Now', 'Future Purchases']) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
  });

  // ID: CHK-07 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Load the page and inspect which of the 3 tabs appears selected
  // Expected: One tab should be clearly highlighted as active by default
  test("CHK-07: The currently active filter tab is visually indicated", async ({ page }) => {
    await login(page);
    await page.goto('/check-list');
    await expect(page.getByRole('button', { name: 'Buy Now', exact: true })).toHaveAttribute('aria-selected', 'true');
  });

  // ID: CHK-08 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Type "stroller" into the search box
  // Expected: Grid narrows to only matching items (e.g. Strollers & Car Seats)
  test("CHK-08: Searching filters the checklist items", async ({ page }) => {
    await login(page);
    await page.goto('/check-list');
    const search = page.getByPlaceholder('Search checklist items...');
    await search.fill('stroller');
    await expect(page.getByRole('heading', { name: 'Strollers & Car Seats', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Diapers & Changing', exact: true })).toBeHidden();
  });

  // ID: CHK-09 | Type: Negative | Severity: High | Last status: PASS
  // Steps: Log in to numaa.ai with a valid test account
  // Steps: Navigate to https://numaa.ai/check-list
  // Steps: Click the "Buy Now" tab
  // Steps: Note the items shown — specifically locate "Baby Bottles & Feeding" and note its exact image and description
  // Steps: Click the "Completed" tab
  // Steps: Look for "Baby Bottles & Feeding" again — compare its image and description against what you noted in step 4
  // Steps: Count and list all items now shown under "Completed"
  // Steps: Compare that full list against what you've seen under "Buy Now" and "Future Purchases" tabs in earlier checks
  // Expected: Each tab should show a distinct, filtered subset of items relevant to that specific status. An item should only appear in one status tab at a time (e.g., something marked "Completed" shouldn't simultaneously appear as "Buy Now").
  test.skip("CHK-09: Switching filter tabs shows the correct subset of items", async () => {
    requireLiveFeature('checklist completion fixture data', 'Requires account-specific checklist completion state and mutation-free fixture data');
  });

});
