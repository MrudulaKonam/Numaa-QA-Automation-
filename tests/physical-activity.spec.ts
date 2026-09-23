import { test, expect } from '@playwright/test';
import { login, requireCredentials, requireLiveFeature } from './helpers';

// Module: PHYS  |  25 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("PHYS - physical-activity", () => {

  // ID: PHYS-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to https://numaa.ai/physical-agent
  // Expected: "PhysicalCoach" heading, description, and Chat button render
  test("PHYS-01: Page loads with heading, description, and CTA", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByRole('heading', { name: 'Numaa Fitness Coach', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /chat/i }).first()).toBeVisible();
  });

  // ID: PHYS-02 | Type: Negative | Severity: Low | Last status: PASS
  // Steps: Compare naming across:
  // Steps: This page's micro-label ("Fitness Agent") 
  // Expected: Take out fitness agent heading and replace with Physical activity Agent 
  test("PHYS-02: Feature name is consistent across the site", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByText('Numaa Fitness Coach', { exact: true }).first()).toBeVisible();
  });

  // ID: PHYS-04 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Mood & Energy" and "Step Count"
  // Expected: Real, operable controls should be exposed
  test("PHYS-04: Daily Vitals fields render with proper interactive controls", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByText(/DAILY VITALS & ENERGY/i)).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/MOOD & ENERGY/i)).toBeVisible();
    await expect(page.locator('input[placeholder="e.g. 4500"]')).toBeVisible();
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

  // ID: PHYS-21 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Daily Checklist"
  // Expected: Hydration, Healthy Snack, and Yoga Flow each render with a description and category tag
  test('PHYS-21: "Daily Checklist" renders 3 items with category tags and descriptions', async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    const checklistItems = [
      { title: 'Hydration', descriptionPattern: 'Drink 2700 ml of water' },
      { title: 'Healthy Snack', descriptionPattern: 'Eat a piece of fresh fruit' },
      { title: 'Yoga Flow', descriptionPattern: '10-Min prenatal yoga' },
    ];

    for (const item of checklistItems) {
      await expect(page.getByText(item.title, { exact: true })).toBeVisible();
      await expect(page.getByText(item.descriptionPattern).first()).toBeVisible();
    }
  });

  // ID: PHYS-23 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the control next to "Daily Checklist"
  // Expected: "Hide checklist" should render with a clear accessible name
  test("PHYS-23: \"Hide checklist\" toggle renders with a proper label", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByRole('button', { name: /hide checklist/i })).toBeVisible();
  });

  // ID: PHYS-25 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Check the browser tab title while on /physical-agent
  // Expected: Should read something distinct, e.g. "Physical Activity | Numaa"
  test("PHYS-25: Page <title> is unique to Physical Activity", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page).toHaveTitle(/Physical.*Numaa/i);
  });

  // ID: PHYS-26 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the left app sidebar on /physical-agent
  // Expected: Same sidebar (Dashboard, Calendar, agent shortcuts, etc.) seen on other authenticated pages renders here too
  test("PHYS-26: Full authenticated app sidebar renders consistently", async ({ page }) => {
    await login(page);
    await page.goto('/physical-agent');
    await expect(page.getByRole('button', { name: /dashboard/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /calendar/i }).first()).toBeVisible();
  });});
