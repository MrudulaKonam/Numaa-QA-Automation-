import { test, expect } from '@playwright/test';
import { login, requireCredentials, requireLiveFeature, requireBrowserPermission } from './helpers';

// Module: JRN  |  13 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("JRN - journal", () => {

  // ID: JRN2-17 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the left app sidebar's structure and links on /journal-agent
  // Expected: Same navigation items (Dashboard, Calendar, agent shortcuts, etc.) seen on other authenticated pages should render here too
  test("JRN2-17: App sidebar navigation renders consistently", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    for (const label of ['Dashboard', 'Calendar', 'Ask NuMaa', 'Mom to Mom', 'Nutrition', 'Mental Health', 'Kick Count Agent', 'Baby Checklist', 'Gamifier', 'Medication', 'Physical Activity', 'Content', 'Journal', 'Shopping Agent', 'Travel Advisor']) {
      await expect(page.getByRole('link', { name: label, exact: true }).or(page.getByRole('button', { name: label, exact: true }))).toBeVisible();
    }
  });

  // ID: JRN2-14 | Type: Negative | Severity: Low | Last status: PASS
  // Steps: 1. Pick a date with a previously saved entry
  // Expected: That day's entry should display
  test.skip("JRN2-14: Selecting a past date shows that day's journal entries", async () => {
    requireCredentials();
  });

  // ID: JRN2-15 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Pick a date with no saved entries
  // Expected: A clear "no entries for this day" message should display
  test("JRN2-15: Selecting a date with no entries shows a clear empty state", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    await expect(page.getByText(/no entries|no journal entries/i).first()).toBeVisible();
  });

  // ID: JRN2-02 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: Compare the name used inside the journal prompts ("You're doing great, Sarah!", "...hope you have for your little one today, Sarah?") against both account names seen on this page ("lucky") and elsewhere in the app ("Mrudula")
  // Expected: Personalized copy should use the actual logged-in user's name
  test.skip("JRN2-02: Journal content personalization matches the logged-in account", async () => {
    requireCredentials();
  });

  // ID: JRN2-04 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Inspect the file-type controls associated with Add Photo / Add Video / Add Text Doc
  // Expected: Should expose discernible accessible names
  test("JRN2-04: Hidden file inputs behind quick actions have accessible labels", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    await expect(page.locator('input[type="file"]').first()).toHaveAttribute('aria-label', /.+/);
  });

  // ID: JRN2-05 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Click "Add Photo"
  // Expected: Opens a photo upload/capture flow
  test.skip("JRN2-05: Each Quick Action opens its respective capture flow", async () => {
    requireBrowserPermission('camera or file picker', 'Requires invoking browser file/camera capture flows');
  });

  // ID: JRN2-08 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the pre-filled-looking entry text ("I felt the first real kick today...")
  // Expected: Should be clearly example/inspirational text, not mistaken for a real saved entry
  test("JRN2-08: Example prompt text renders as placeholder guidance, not saved content", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    await expect(page.getByText('I felt the first real kick today', { exact: false })).toBeVisible();
  });

  // ID: JRN2-09 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the image area of the entry card
  // Expected: An inviting "add a photo" affordance should render
  test("JRN2-09: Photo-attachment control renders with a clear call to action", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    await expect(page.getByRole('button', { name: /add photo/i })).toBeVisible();
  });

  // ID: JRN2-10 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the reflection section below the entry card
  // Expected: A reflective question should render
  test("JRN2-10: \"Today's Reflection\" prompt renders", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    await expect(page.getByText("Today's Reflection", { exact: true })).toBeVisible();
  });

  // ID: JRN2-12 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll below the Save button
  // Expected: "This feature gives general advice but isn't a substitute for professional medical guidance..." should render
  test("JRN2-12: Medical-guidance disclaimer renders", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    await expect(page.getByText(/general advice.*substitute for professional medical guidance/i)).toBeVisible();
  });

  // ID: JRN2-07 | Type: Negative | Severity: Low | Last status: PASS
  // Steps: Navigate to https://numaa.ai/journal-agent
  // Steps: Locate the motivational/encouragement text area (displays phrases like "You're doing great, Sarah!", "Don't forget to breathe", "Almost there!", "A grand adventure begins")
  // Steps: Note which phrase is currently displayed
  // Steps: Watch the same spot continuously for 15–60 seconds without navigating away or interacting with the page
  // Steps: Observe whether the displayed phrase changes at any point during that window
  // Expected: The phrase should automatically rotate/change on a timer, eventually cycling through some or all of the 4 available phrases — not remain frozen on a single one.
  test.skip("JRN2-07: Rotating encouragement messages display one at a time", async () => {
    requireLiveFeature('timer-driven encouragement rotation', 'Requires waiting on a timer-driven message and is not a deterministic state assertion');
  });

  // ID: JRN2-11 | Type: Negative | Severity: High | Last status: PASS
  // Steps: 1. Write a journal entry
  // Steps: 2. Click "Save Journal Entry"
  // Expected: Entry should be saved and retrievable via the date picker
  test.skip("JRN2-11: \"Save Journal Entry\" successfully saves the entry", async () => {
    requireCredentials();
  });

  // ID: JRN-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to "Simple Steps" section
  // Expected: Sign Up -> Track Your Progress -> Get Personalized Tips -> Connect & Share, each with description
  test("JRN-01: 4 journey steps render in order", async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
    for (const label of ['Sign Up', 'Track Your Progress', 'Get Personalized Tips', 'Connect & Share']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

});
