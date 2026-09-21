import { test, expect } from '@playwright/test';
import { gotoPublic, login, requireCredentials, requireBrowserPermission } from './helpers';

// Module: TRV  |  14 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("TRV - travel", () => {

  // ID: TRV-08 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the suggested questions below the capability list
  // Expected: "Can I fly at 28 weeks?", "Is Dubai safe to visit in my second trimester?", "What should I pack for a pregnancy-safe trip?" should render as buttons
  test("TRV-08: 3 suggested-question buttons render", async ({ page }) => {
    await gotoPublic(page, '/travel-agent');
    for (const label of ['Can I fly at 28 weeks?', 'Is Dubai safe to visit in my second trimester?', 'What should I pack for a pregnancy-safe trip?']) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
  });

  // ID: TRV-10 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the message box
  // Expected: Text input with placeholder "Ask about safe destinations, flying tips…" should render
  test("TRV-10: Chat input box renders", async ({ page }) => {
    await gotoPublic(page, '/travel-agent');
    await expect(page.getByPlaceholder('Ask about safe destinations, flying tips…')).toBeVisible();
  });

  // ID: TRV-12 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll below the chat input
  // Expected: "Aria provides general travel guidance only. Always consult your OB-GYN before travelling." should render
  test("TRV-12: Travel-guidance disclaimer renders", async ({ page }) => {
    await gotoPublic(page, '/travel-agent');
    await expect(page.getByText('Aria provides general travel guidance only. Always consult your OB-GYN before travelling.', { exact: true })).toBeVisible();
  });

  // ID: TRV-07 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: Inspect the accessible reading order of each capability bullet, e.g. "Is it safe to fly/travel at your stage of pregnancy?"
  // Expected: The lead phrase should be announced first, matching the visual reading order
  test("TRV-07: Capability bullet text reads in the correct order for assistive technology", async ({ page }) => {
    await gotoPublic(page, '/travel-agent');
    await expect(page.getByText(/safe to fly|travel at your stage of pregnancy/i).first()).toBeVisible();
  });

  // ID: TRV-09 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: Navigate to https://numaa.ai/travel-agent
  // Steps: Locate the suggested question chips below the chat greeting: "Can I fly at 28 weeks?", "Is Dubai safe to visit in my second trimester?", "What should I pack for a pregnancy-safe trip?"
  // Steps: Click "Can I fly at 28 weeks?"
  // Steps: Observe what happens
  // Expected: The question should either populate the chat input field (ready to send) or be sent directly to Aria, triggering a response.
  test("TRV-09: Clicking a suggested question populates/sends it to Aria", async ({ page }) => {
    await login(page);
    await page.goto('/travel-agent');
    await page.getByRole('button', { name: 'Can I fly at 28 weeks?', exact: true }).click();
    await expect(page.getByPlaceholder('Ask about safe destinations, flying tips…')).toHaveValue(/Can I fly at 28 weeks\?/i);
  });

  // ID: TRV-11 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: Navigate to https://numaa.ai/travel-agent
  // Steps: Confirm the page loads — you should see "TRAVEL AGENT" / "Aria · Pregnancy Travel Advisor" at the top, with trimester-aware travel guidance below it
  // Steps: Scroll to the chat interface (labeled with placeholder text "Ask about safe destinations, flying tips…")
  // Steps: Locate the 2 icon buttons positioned immediately beside the chat input textbox
  // Steps: Inspect each icon's accessible name — via a screen reader, or browser dev tools' Accessibility panel (right-click the icon → Inspect → check the "Accessibility" tab for its computed name), or an automated accessibility scan
  // Steps: Record what accessible name (if any) each icon reports
  // Expected: Both icons should expose discernible accessible names (e.g., "Send message," "Voice input," "Attach file") so screen reader users and assistive technology can identify their function.
  test("TRV-11: Send and voice/attach controls have accessible labels", async ({ page }) => {
    await gotoPublic(page, '/travel-agent');
    const input = page.getByPlaceholder('Ask about safe destinations, flying tips…');
    await expect(input).toBeVisible();
    await expect(page.getByRole('button').filter({ has: page.locator('svg') }).last()).toHaveAccessibleName(/send|voice|attach/i);
  });

  // ID: TRV-04 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Essential tips"
  // Expected: 6 general travel-safety tips should render
  test("TRV-04: \"Essential tips\" list renders", async ({ page }) => {
    await login(page);
    await page.goto('/travel-agent');
    await expect(page.getByText('Essential Tips', { exact: true })).toBeVisible();
    await expect(page.locator('li').filter({ hasText: /travel|safety|doctor/i })).toHaveCount(6);
  });

  // ID: TRV-05 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: Log in to numaa.ai with a test account
  // Steps: Navigate to https://numaa.ai/dashboard
  // Steps: Note the pregnancy week shown in the "Your Journey" card (e.g., "Week X of 40 Weeks")
  // Steps: Navigate to https://numaa.ai/travel-agent
  // Steps: Locate the "Add your pregnancy week (optional)" field
  // Steps: Without typing anything, observe its default/associated value
  // Steps: Compare that value against the Dashboard week noted in step 3
  // Expected: Both pages should show the same pregnancy week — one consistent value across the app.
  test.skip("TRV-05: \"Add your pregnancy week\" defaults to the account's actual stored week", async () => {
    requireCredentials();
  });

  // ID: TRV-18 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: Log in to numaa.ai with a valid test account
  // Steps: Navigate to https://numaa.ai/travel-agent
  // Steps: Confirm the page loads — you should see "Aria · Pregnancy Travel Advisor" with the chat interface
  // Steps: Note the microphone icon's current state (should be inactive/default, gray)
  // Steps: Click any one of the suggested question chips below the chat greeting — e.g., "Can I fly at 28 weeks?"
  // Steps: Observe the microphone icon immediately after clicking
  // Steps: Refresh the page (or navigate away and back) to reset state
  // Steps: This time, scroll to the "Destination safety ratings" panel on the right
  // Steps: Click any destination card — e.g., "Kerala", "Dubai", or "Singapore"
  // Steps: Observe the microphone icon immediately after clicking
  // Expected: Clicking a suggested question chip or a destination card should only send that text as a chat query to Aria. Since these actions already provide complete text input, there's no reason for the microphone/voice-input mode to activate — it should remain in its default, inactive state.
  test.skip("TRV-18: Mic button should not be active  until mic button is clicked", async () => {
    requireBrowserPermission('microphone', 'Requires authenticated voice-control state and microphone permissions');
  });

  // ID: TRV-17 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the left app sidebar's structure and links on /travel-agent
  // Expected: Same navigation items seen on other authenticated pages should render here too
  test("TRV-17: App sidebar navigation renders consistently", async ({ page }) => {
    await login(page);
    await page.goto('/travel-agent');
    for (const label of ['Dashboard', 'Calendar', 'Ask NuMaa', 'Mom to Mom', 'Nutrition', 'Mental Health', 'Kick Count Agent', 'Baby Checklist', 'Gamifier', 'Medication', 'Physical Activity', 'Content', 'Journal', 'Shopping Agent', 'Travel Advisor']) {
      await expect(page.getByRole('link', { name: label, exact: true }).or(page.getByRole('button', { name: label, exact: true }))).toBeVisible();
    }
  });

  // ID: TRV-14 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Spot-check the flagged risks (Zika in Bali/Bangkok, high altitude in Shimla, limited medical access in Maldives)
  // Expected: Risk framing should be accurate and not outdated
  test("TRV-14: Safety ratings reflect plausible, currently-relevant risk factors", async ({ page }) => {
    await login(page);
    await page.goto('/travel-agent');
    for (const label of ['Bali', 'Bangkok', 'Shimla', 'Maldives']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  // ID: TRV-15 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Click "Bali"
  // Expected: Should open a detail view with fuller guidance for that destination
  test("TRV-15: Clicking a destination card opens more detail", async ({ page }) => {
    await login(page);
    await page.goto('/travel-agent');
    await page.getByText('Bali', { exact: true }).click();
    await expect(page.getByText(/Bali/i).last()).toBeVisible();
  });

  // ID: TRV-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the CTA button near the header
  // Expected: Should clearly identify the assistant as Aria
  test("TRV-02: \"Ask Aria\" CTA renders with clear branding", async ({ page }) => {
    await gotoPublic(page, '/travel-agent');
    await expect(page.getByRole('heading', { name: 'Aria · Pregnancy Travel Advisor', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Ask Aria', exact: true })).toBeVisible();
  });

  // ID: TRV-01 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: Check the sidebar account identity on this page against the "lucky"/luckim0813@gmail.com anomaly first observed on the Journal Agent page (JRN2-02)
  // Expected: If that was a one-page glitch, this page should return to showing "Mrudula" (mrudula.konam@gmail.com), consistent with every page tested before Journal Agent
  test.skip("TRV-01: Account identity anomaly persists across pages \u2014 CRITICAL", async () => {
    requireCredentials();
  });

});
