import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Module: Misc  |  10 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("Misc - misc", () => {

  // ID:  Journal Agent — Cross-Cutting | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Check the browser tab title while on /journal-agent
  // Expected: Should read something distinct, e.g. "Journal | Numaa"
  test(" Journal Agent \u2014 Cross-Cutting: Page <title> is unique to Journal", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    await expect(page).toHaveTitle(/Journal.*Numaa/i);
  });

  // ID:  Journal Agent — Entry History / Date Selection | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Select a day"
  // Expected: A date picker (MM/DD/YYYY) plus explanatory text should render
  test(" Journal Agent \u2014 Entry History / Date Selection: Date-selection control renders with helper text", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    await expect(page.getByText('Select a day', { exact: true })).toBeVisible();
    await expect(page.locator('input[type="date"], input[placeholder*="MM/DD/YYYY"]')).toBeVisible();
  });

  // ID:  Journal Agent — Header & Account Identity | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to https://numaa.ai/journal-agent
  // Expected: "Story Companion" heading, description, and "Chat with Journal Agent" button render
  test(" Journal Agent \u2014 Header & Account Identity: Page loads with heading, description, and CTA", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    await expect(page.getByRole('heading', { name: 'Story Companion', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Chat with Journal Agent', exact: true })).toBeVisible();
  });

  // ID:  Journal Agent — Quick Actions | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Quick Actions"
  // Expected: Add Photo, Add Video, Add Text Doc, Add Notes should all render
  test(" Journal Agent \u2014 Quick Actions: 4 quick-action buttons render", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    for (const label of ['Add Photo', 'Add Video', 'Add Text Doc', 'Add Notes']) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
  });

  // ID:  Journal Agent — Today's Entry & Prompts | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Compare the displayed date against the actual current date
  // Expected: Displayed date should match today
  test(" Journal Agent \u2014 Today's Entry & Prompts: Today's date renders correctly", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    const today = new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date());
    await expect(page.getByText(new RegExp(today.replace(',', ',?')))).toBeVisible();
  });

  // ID:  Travel Agent — Aria Chat Assistant | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the chat intro card
  // Expected: Greeting plus 5 capability bullets (flying safety, destination advice, transport, packing, medical access) should render
  test(" Travel Agent \u2014 Aria Chat Assistant: Aria's introduction and capability list render", async ({ page }) => {
    await login(page);
    await page.goto('/travel-agent');
    await expect(page.getByRole('heading', { name: 'Aria · Pregnancy Travel Advisor', exact: true })).toBeVisible();
    for (const label of ['flying', 'destination', 'transport', 'packing', 'medical']) {
      await expect(page.getByText(new RegExp(label, 'i')).first()).toBeVisible();
    }
  });

  // ID:  Travel Agent — Best Time to Travel & Essential Tips | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Best time to travel"
  // Expected: First/Second/Third Trimester cards should each render with a week range and tips
  test(" Travel Agent \u2014 Best Time to Travel & Essential Tips: 3 trimester travel-guidance cards render", async ({ page }) => {
    await login(page);
    await page.goto('/travel-agent');
    for (const label of ['First Trimester', 'Second Trimester', 'Third Trimester']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  // ID:  Travel Agent — Cross-Cutting | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Check the browser tab title while on /travel-agent
  // Expected: Should read something distinct, e.g. "Travel Advisor | Numaa"
  test(" Travel Agent \u2014 Cross-Cutting: Page <title> is unique to Travel Agent", async ({ page }) => {
    await login(page);
    await page.goto('/travel-agent');
    await expect(page).toHaveTitle(/Travel.*Numaa/i);
  });

  // ID:  Travel Agent — Destination Safety Ratings | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Destination safety ratings"
  // Expected: Each destination should be a genuine, operable control, not just static text
  test(" Travel Agent \u2014 Destination Safety Ratings: 10 destination cards render as real, interactive buttons", async ({ page }) => {
    await login(page);
    await page.goto('/travel-agent');
    await expect(page.getByText('Destination Safety Ratings', { exact: true })).toBeVisible();
    await expect(page.getByRole('button').filter({ hasText: /Bali|Dubai|Singapore|Kerala/ }).first()).toBeVisible();
  });

  // ID:  Travel Agent — Header & Account Identity | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to https://numaa.ai/travel-agent
  // Expected: "Aria · Pregnancy Travel Advisor" heading, description, and "Ask Aria" button render
  test(" Travel Agent \u2014 Header & Account Identity: Page loads with heading, description, and CTA", async ({ page }) => {
    await login(page);
    await page.goto('/travel-agent');
    await expect(page.getByRole('heading', { name: 'Aria · Pregnancy Travel Advisor', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ask Aria', exact: true })).toBeVisible();
  });

});
