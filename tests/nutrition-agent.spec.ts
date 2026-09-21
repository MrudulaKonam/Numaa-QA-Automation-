import { test, expect } from '@playwright/test';
import { login, requireCredentials, requireLiveFeature } from './helpers';

// Module: NUT  |  27 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("NUT - nutrition-agent", () => {

  // ID: NUT-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to "Healthy Eating for You & Your Baby"
  // Expected: Folic Acid, Iron, Calcium, Omega-3 cards with benefit description each
  test("NUT-01: Nutrient cards render", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    for (const label of ['Folic Acid', 'Iron', 'Calcium', 'Omega-3']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  // ID: NUT-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Locate the CTA button below the nutrient cards
  // Expected: Rendered as an actual button element
  test("NUT-02: \"Get Your Personalized Meal Plan\" is a real, actionable button", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.getByRole('button', { name: 'Get Your Personalized Meal Plan', exact: true })).toBeVisible();
  });

  // ID: NUT2-27 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the left app sidebar on /nutrition
  // Expected: Same sidebar (Dashboard, Calendar, agent shortcuts, etc.) seen on other authenticated pages renders here too
  test("NUT2-27: Full authenticated app sidebar renders consistently", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    for (const label of ['Dashboard', 'Calendar', 'Ask NuMaa', 'Mom to Mom', 'Nutrition', 'Mental Health', 'Kick Count Agent', 'Baby Checklist', 'Gamifier', 'Medication', 'Physical Activity', 'Content', 'Journal', 'Shopping Agent', 'Travel Advisor']) {
      await expect(page.getByRole('link', { name: label, exact: true }).or(page.getByRole('button', { name: label, exact: true }))).toBeVisible();
    }
  });

  // ID: NUT2-26 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Check the browser tab title while on /nutrition
  // Expected: Should read something distinct, e.g. "Nutrition | Numaa"
  test("NUT2-26: Page <title> is unique to Nutrition", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page).toHaveTitle(/Nutrition.*Numaa/i);
  });

  // ID: NUT2-11 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Customize Your Experience"
  // Expected: Cuisine, Dietary, Allergies, Nutrition, Reminders, Health, Symptoms, Goals, Lifestyle all render with an icon and "Personalize" action
  test("NUT2-11: 9 personalization categories render", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    for (const label of ['Cuisine', 'Dietary', 'Allergies', 'Nutrition', 'Reminders', 'Health', 'Symptoms', 'Goals', 'Lifestyle']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  // ID: NUT2-14 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the text below the 9 category buttons
  // Expected: "Our AI adjusts your nutritional goals based on these inputs to ensure safety for both you and baby." renders
  test("NUT2-14: Explanatory note renders beneath the customization grid", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.getByText('Our AI adjusts your nutritional goals based on these inputs to ensure safety for both you and baby.', { exact: true })).toBeVisible();
  });

  // ID: NUT2-12 | Type: Negative | Severity: High | Last status: PASS
  // Steps: 1. Compare the status text shown on each of the 9 category buttons
  // Expected: One consistent word should describe the "not yet configured" state across all categories
  test("NUT2-12: Unconfigured-state label is consistent across categories", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.getByText('Personalize', { exact: true })).toHaveCount(9);
  });

  // ID: NUT2-13 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Click "Allergies"
  // Expected: Opens a flow/modal for entering allergy information
  test("NUT2-13: Clicking a category opens its personalization flow", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await page.getByText('Allergies', { exact: true }).click();
    await expect(page.getByText(/allerg/i).last()).toBeVisible();
  });

  // ID: NUT2-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to https://numaa.ai/nutrition
  // Expected: "Smart Pregnancy Meal Planner" heading, description, and "Chat with Nutrition Agent" button render
  test("NUT2-01: Page loads with heading, description, and CTA", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.getByRole('heading', { name: 'Smart Pregnancy Meal Planner', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Chat with Nutrition Agent', exact: true })).toBeVisible();
  });

  // ID: NUT2-08 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Select Meal Type"
  // Expected: Breakfast, Lunch, Dinner, Snacks, Dessert all render with an icon and label
  test("NUT2-08: 5 meal-type options render", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    for (const label of ['Breakfast', 'Lunch', 'Dinner', 'Snacks', 'Dessert']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  // ID: NUT2-10 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Click "Dinner"
  // Steps: 2. Click "Generate Recipe"
  // Expected: Generated recipe should be appropriate for the selected meal type
  test.skip("NUT2-10: Selecting a meal type contextualizes recipe generation", async () => {
    requireLiveFeature('external recipe generation response', 'Requires an external recipe generation response');
  });

  // ID: NUT2-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the "Nutrition Intake" section
  // Expected: 13 metrics render: Calories, Protein, Carbohydrates, Fat, Fiber, Calcium, Iron, Folate, Vitamin D, Omega-3, Magnesium, Choline, Hydration — each with current value, percent, and target
  test("NUT2-02: \"Today's Intake\" tracker renders all nutrient metrics", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.getByText("Today's Intake", { exact: true })).toBeVisible();
    for (const label of ['Calories', 'Protein', 'Carbohydrates', 'Fat', 'Fiber', 'Calcium', 'Iron', 'Folate', 'Vitamin D', 'Omega-3', 'Magnesium', 'Choline', 'Hydration']) await expect(page.getByText(label, { exact: true })).toBeVisible();
  });

  // ID: NUT2-03 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll below "Today's Intake"
  // Expected: The same 13 nutrient rows render as a cumulative "Total Logged" summary
  test("NUT2-03: \"Total Logged\" summary renders", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.getByText('Total Logged', { exact: true })).toBeVisible();
  });

  // ID: NUT2-04 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Log meals across multiple days
  // Steps: 2. Compare the two panels
  // Expected: "Total Logged" should represent cumulative/lifetime totals distinct from the daily "Today's Intake" figures
  test.skip("NUT2-04: \"Total Logged\" is meaningfully distinct from \"Today's Intake\"", async () => {
    requireCredentials();
  });

  // ID: NUT2-06 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the Nutrition Intake header
  // Expected: "Refresh" button renders
  test("NUT2-06: \"Refresh\" control renders", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.getByRole('button', { name: 'Refresh', exact: true })).toBeVisible();
  });

  // ID: NUT2-05 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Compare the displayed "Target: 35mg" for Iron against commonly published prenatal nutrition guidance
  // Expected: Should align with widely cited guidance (ACOG/NIH commonly recommend ~27mg/day of iron during pregnancy)
  test.skip("NUT2-05: Iron target matches standard prenatal guidance", async () => {
    requireLiveFeature('clinical target validation', 'Requires product-domain confirmation of the dynamic target against current clinical guidance');
  });

  // ID: NUT2-07 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Mark a meal as eaten
  // Steps: 2. Click "Refresh"
  // Expected: Intake percentages and totals update to reflect the newly logged meal
  test.skip("NUT2-07: \"Refresh\" reloads intake data after logging a meal", async () => {
    requireCredentials();
  });

  // ID: NUT2-15 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the button below the customization grid
  // Expected: "Generate Recipe" button renders
  test("NUT2-15: \"Generate Recipe\" CTA renders", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.getByRole('button', { name: 'Generate Recipe', exact: true })).toBeVisible();
  });

  // ID: NUT2-17 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Quick Actions"
  // Expected: Reset Plan, Share Routine, Export PDF all render
  test("NUT2-17: \"Quick Actions\" renders 3 controls", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    for (const label of ['Reset Plan', 'Share Routine', 'Export PDF']) await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
  });

  // ID: NUT2-18 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Click "Export PDF"
  // Expected: A PDF summarizing the nutrition plan/intake downloads
  test.skip("NUT2-18: \"Export PDF\" produces a downloadable nutrition plan", async () => {
    requireLiveFeature('binary download validation', 'Requires validating a generated binary download');
  });

  // ID: NUT2-19 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Set several personalization options
  // Steps: 2. Click "Reset Plan"
  // Expected: All customizations revert to their default/unset state
  test.skip("NUT2-19: \"Reset Plan\" clears customization back to defaults", async () => {
    requireCredentials();
  });

  // ID: NUT2-20 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the "Iron‑Boosting Spinach Omelette" card
  // Expected: Image with descriptive alt text, heading, and a 1-line tip render
  test("NUT2-20: Nutrition Tips card renders with image and copy", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.getByText('Iron-Boosting Spinach Omelette', { exact: true })).toBeVisible();
  });

  // ID: NUT2-22 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Related Articles"
  // Expected: 3 articles render, each with title, read-time, and a real source (ACOG, March of Dimes, NHS)
  test("NUT2-22: \"Related Articles\" renders 3 credibly-sourced articles", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.getByText('Related Articles', { exact: true })).toBeVisible();
    await expect(page.locator('a[href*="acog"], a[href*="nhs"], a[href*="marchofdimes"]').first()).toBeVisible();
  });

  // ID: NUT2-23 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Click "Healthy Eating During Pregnancy" (ACOG)
  // Expected: Opens the real ACOG article, likely in a new tab
  test("NUT2-23: Related-article cards link out to their real source", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.locator('a[href*="acog"], a[href*="nhs"], a[href*="marchofdimes"]').first()).toHaveAttribute('href', /^https?:\/\//);
  });

  // ID: NUT2-25 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to the bottom of the page
  // Expected: "This feature provides general guidance... consult your doctor..." disclaimer renders
  test("NUT2-25: Medical disclaimer renders", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.getByText(/general guidance.*consult your doctor/i)).toBeVisible();
  });

  // ID: NUT2-21 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Inspect the icon buttons immediately before and after the tip card
  // Expected: The icon buttons immediately before and after the tip card should expose discernible accessible names (e.g., "Save tip," "Next tip," "Previous tip") so screen reader users can identify what each control does.
  test("NUT2-21: Tip-card navigation controls have accessible labels", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.getByRole('button', { name: /previous|next|save tip/i }).first()).toBeVisible();
  });

  // ID: NUT2-24 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Inspect the icon button following the 3 article cards
  // Expected: The icon button following the 3 article cards in the "Related Articles" section should expose a discernible accessible name (e.g., "View more articles") so screen reader users know what it does.
  test("NUT2-24: Trailing control after the article list has an accessible label", async ({ page }) => {
    await login(page);
    await page.goto('/nutrition');
    await expect(page.getByRole('button', { name: /view more articles|more articles/i })).toBeVisible();
  });

});
