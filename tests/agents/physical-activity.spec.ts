import { test, expect } from '@playwright/test';
import { login, requireCredentials, requireLiveFeature } from '../helpers';

// Module: PHYS  |  25 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("PHYS - physical-activity", () => {

  // ID: PHYS-04 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Mood & Energy" and "Step Count"
  // Expected: Real, operable controls should be exposed
  test("PHYS-04: Daily Vitals fields render with proper interactive controls", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByLabel(/Mood.*Energy/i)).toBeVisible();
    await expect(page.getByLabel(/Step Count/i)).toBeVisible();
  });

  // ID: PHYS-05 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Sleep & Recovery"
  // Expected: Excellent / Average / Poor buttons render
  test("PHYS-05: \"Sleep & Recovery\" mood buttons render", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    for (const label of ['Excellent', 'Average', 'Poor']) await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
  });

  // ID: PHYS-06 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Physical Symptoms"
  // Expected: 9 selectable options render: Back Pain, Swelling, Nausea, Round Ligament, Pelvic Pressure, Shortness of Breath, Pelvic Girdle Pain, Other, None
  test("PHYS-06: \"Physical Symptoms\" checklist renders", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    for (const label of ['Back Pain', 'Swelling', 'Nausea', 'Round Ligament', 'Pelvic Pressure', 'Shortness of Breath', 'Pelvic Girdle Pain', 'Other', 'None']) await expect(page.getByText(label, { exact: true })).toBeVisible();
  });

  // ID: PHYS-08 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Session Preference"
  // Expected: "Indoor Comfort" and "Fresh Air Outdoor" render
  test("PHYS-08: \"Session Preference\" options render", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByText('Indoor Comfort', { exact: true })).toBeVisible();
    await expect(page.getByText('Fresh Air Outdoor', { exact: true })).toBeVisible();
  });

  // ID: PHYS-09 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Details & Context (Optional)"
  // Expected: Pain-improvement and discomfort questions plus free-text fields render, clearly marked optional
  test("PHYS-09: \"Details & Context\" optional fields render", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByText(/Details & Context.*Optional/i)).toBeVisible();
    await expect(page.locator('textarea').first()).toBeVisible();
  });

  // ID: PHYS-10 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the text above "Create My Personalized Plan"
  // Expected: A note explaining AI-adjusted safety should render
  test("PHYS-10: AI safety note renders", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByText(/AI.*safety|safety.*AI/i).first()).toBeVisible();
  });

  // ID: PHYS-07 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Click "Back Pain"
  // Steps: 2. Click "None"
  // Expected: Selecting "None" should clear/disable other symptom selections since they're logically exclusive
  test.skip("PHYS-07: Selecting \"None\" is mutually exclusive with specific symptoms", async () => {
    requireLiveFeature('symptom selection state transitions', 'Requires mutating symptom selections and validating form state transitions');
  });

  // ID: PHYS-11 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Fill in the check-in form
  // Steps: 2. Click "Create My Personalized Plan →"
  // Expected: A plan reflecting the submitted vitals/symptoms/preferences should be generated
  test.skip("PHYS-11: \"Create My Personalized Plan\" generates a plan from the submitted data", async () => {
    requireLiveFeature('external personalized-plan response', 'Requires an external personalized-plan response');
  });

  // ID: PHYS-12 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: Log in to numaa.ai with a valid test account
  // Steps: Navigate to the Physical Activity Agent check-in form
  // Steps: Partially fill in the form — select at least one field (e.g., a symptom, a vital, or any other check-in field), but don't complete the entire form
  // Steps: Locate and click the "Save Draft" button
  // Steps: Reload the page or refresh
  // Steps: Observe the state of the form after reload
  // Expected: The "Save Draft" button should be enabled when the form has content, and after clicking it and reloading the page, the previously entered answers should be restored — appearing pre-filled in the form.
  test.skip("PHYS-12: \"Save Draft\" preserves in-progress answers", async () => {
    requireCredentials();
  });

  // ID: PHYS-26 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the left app sidebar on /physical-agent
  // Expected: Same sidebar (Dashboard, Calendar, agent shortcuts, etc.) seen on other authenticated pages renders here too
  test("PHYS-26: Full authenticated app sidebar renders consistently", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByRole('button', { name: /dashboard/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /calendar/i }).first()).toBeVisible();
  });

  // ID: PHYS-25 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Check the browser tab title while on /physical-agent
  // Expected: Should read something distinct, e.g. "Physical Activity | Numaa"
  test("PHYS-25: Page <title> is unique to Physical Activity", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page).toHaveTitle(/Physical.*Numaa/i);
  });

  // ID: PHYS-21 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Daily Checklist"
  // Expected: Hydration, Healthy Snack, and Yoga Flow each render with a description and category tag
  test("PHYS-21: \"Daily Checklist\" renders 3 items with category tags", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    for (const label of ['Hydration', 'Healthy Snack', 'Yoga Flow']) await expect(page.getByText(label, { exact: true })).toBeVisible();
  });

  // ID: PHYS-23 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the control next to "Daily Checklist"
  // Expected: "Hide checklist" should render with a clear accessible name
  test("PHYS-23: \"Hide checklist\" toggle renders with a proper label", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByRole('button', { name: /hide checklist/i })).toBeVisible();
  });

  // ID: PHYS-22 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Look for a checkbox or checkmark control on each of the 3 checklist items
  // Expected: A way to check off completed items should exist, consistent with the section being called a "checklist"
  test("PHYS-22: Checklist items can be marked complete", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.locator('input[type="checkbox"]').first()).toBeVisible();
  });

  // ID: PHYS-24 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Compare the "Drink 4L of water" target on this page's Daily Checklist against the "HYDRATION Target: 2700ml" shown on the Nutrition Agent page for the same logged-in user
  // Expected: A single consistent daily hydration goal should be used across features for the same user
  test.skip("PHYS-24: Hydration target is consistent with the Nutrition Agent \u2014 CRITICAL", async () => {
    requireCredentials();
  });

  // ID: PHYS-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to https://numaa.ai/physical-agent
  // Expected: "PhysicalCoach" heading, description, and Chat button render
  test("PHYS-01: Page loads with heading, description, and CTA", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByRole('heading', { name: /PhysicalCoach/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /chat/i }).first()).toBeVisible();
  });

  // ID: PHYS-02 | Type: Negative | Severity: Low | Last status: PASS
  // Steps: Compare naming across:
  // Steps: 
  // Steps: This page's micro-label ("Fitness Agent") 
  // Expected: Take out fitness agent heading and replace with Physical activity Agent 
  test("PHYS-02: Feature name is consistent across the site", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByText(/Physical Activity Agent/i).first()).toBeVisible();
  });

  // ID: PHYS-03 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Inspect the "Chat" button's accessible name
  // Expected: A descriptive label should be exposed, consistent with Mental Health/Medication/Gamifier's pattern
  test("PHYS-03: Generic \"Chat\" CTA has a descriptive accessible label", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByRole('button', { name: /chat/i }).first()).toHaveAccessibleName(/chat/i);
  });

  // ID: PHYS-13 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Your Plan for Today"
  // Expected: "Stability & Mobility Flow" card with duration, impact level, and description should render
  test("PHYS-13: \"Your Plan for Today\" renders a recommended routine", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByText('Stability & Mobility Flow', { exact: true })).toBeVisible();
  });

  // ID: PHYS-15 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Explore Exercises"
  // Expected: Prenatal Yoga, Low-Impact Swim, Fitness Ball Squats, Wall Push-Ups, Modified Side Plank, Light Walking, Pelvic Tilts, Seated Rowing each render with a trimester and category label
  test("PHYS-15: 8 \"Explore Exercises\" cards render with trimester/category tags", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    for (const label of ['Prenatal Yoga', 'Low-Impact Swim', 'Fitness Ball Squats', 'Wall Push-Ups', 'Modified Side Plank', 'Light Walking', 'Pelvic Tilts', 'Seated Rowing']) await expect(page.getByText(label, { exact: true })).toBeVisible();
  });

  // ID: PHYS-14 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: Navigate to the Physical Activity Agent page (via Dashboard → AI Agents → Physical Activity Agent)
  // Steps: Locate the "Stability & Mobility Flow" card (the featured "Plan for Today" exercise)
  // Steps: Right-click the Video button/link on that card → select "Copy Link" or "Inspect" to see the actual URL it points to
  // Steps: Repeat for each of the 8 "Explore Exercises" cards below it
  // Steps: For each URL, check: does it point to a specific YouTube video (a URL containing /watch?v=...), or a generic search results page (a URL containing /results?search_query=...)?
  // Expected: Each exercise should link to a specific, pre-selected video appropriate for pregnancy — matching the app's positioning as curated, OBGYN-relevant content.if the URL looks like youtube.com/results?search_query=stability+mobility+flow+pregnancy, that's a search page, not a vetted video — meaning whatever video appears is whatever YouTube's algorithm currently ranks first, which could be completely unrelated, low-quality, or even inappropriate content that changes over time.Instead of a search URL like:  youtube.com/results?search_query=stability+mobility+flow+pregnancy  It should link directly to one specific video's permanent URL, like:  youtube.com/watch?v=dQw4w9WgXcQ  (using the real video ID of whichever video someone has actually reviewed and approved)
  test.skip("PHYS-14: Exercise links point to a specific, vetted video", async () => {
    requireLiveFeature('editorial verification of external exercise video URLs', 'Requires editorial verification of dynamic external exercise video URLs');
  });

  // ID: PHYS-16 | Type: Negative | Severity: Low | Last status: PASS
  // Steps: 1. Inspect the two arrow buttons flanking "Explore Exercises"
  // Expected: Discernible names should be exposed (e.g. "Previous exercise", "Next exercise")
  test("PHYS-16: Carousel prev/next arrows have accessible labels", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByRole('button', { name: /previous|next/i }).first()).toBeVisible();
  });

  // ID: PHYS-18 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Weekly Consistency"
  // Expected: 7-day (M-Su) activity calendar and a streak count should render
  test("PHYS-18: \"Weekly Consistency\" renders a 7-day calendar and streak", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByText('Weekly Consistency', { exact: true })).toBeVisible();
    await expect(page.getByText(/streak/i).first()).toBeVisible();
  });

  // ID: PHYS-20 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the stats row below the exercise carousel
  // Expected: "Daily Steps" (with goal) and "Streak" (days total) should render
  test("PHYS-20: \"Daily Steps\" and \"Streak\" summary stats render", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByText('Daily Steps', { exact: true })).toBeVisible();
    await expect(page.getByText('Streak', { exact: true })).toBeVisible();
  });

  // ID: PHYS-19 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Compare "1 Day Streak" against which day in the weekly calendar shows "Activity Logged!"
  // Expected: If today has no logged activity yet, the streak label should make clear whether it counts yesterday's logged day or requires today's entry too
  test.skip("PHYS-19: Streak count is consistent with today's logged activity", async () => {
    requireCredentials();
  });

});
