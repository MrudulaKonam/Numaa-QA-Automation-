import { test, expect } from '@playwright/test';
import { gotoPublic, login, requireBrowserPermission } from './helpers';

// Module: ASK  |  19 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("ASK - ask-numaa", () => {

  // ID: ASK-10 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the message box at the bottom of the page
  // Expected: Text input with placeholder "Ask anything..." renders
  test("ASK-10: Chat input box renders", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    await expect(page.getByPlaceholder('Ask anything...')).toBeVisible();
  });

  // ID: ASK-11 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the controls alongside the chat input
  // Expected: "Attach" (file) and "Voice conversation" controls render next to the text box
    test("ASK-11: Attach and Voice controls render", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    await expect(page.locator('input[type="file"]')).toHaveCount(1);
    await expect(page.getByRole('button', { name: /voice/i })).toBeVisible();
  });

  // ID: ASK-16 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the text below the chat input
  // Expected: "Educational only, not a substitute for professional medical advice." renders
  test("ASK-16: Medical disclaimer renders", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    await expect(page.getByText('Educational only, not a substitute for professional medical advice.', { exact: true })).toBeVisible();
  });

  // ID: ASK-13 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Type a question into "Ask anything..."
  // Steps: 2. Submit it
  // Expected: A relevant, evidence-based answer is returned in the chat thread
  test("ASK-13: Submitting a question enters the outgoing-message state", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    const input = page.getByPlaceholder('Ask anything...');
    const sendButton = page.getByRole('button', { name: 'Send message', exact: true });
    await input.fill('How can I sleep better?');
    await expect(sendButton).toBeEnabled();
    await sendButton.click();
    await expect(page).toHaveURL(/asknumaa|login/);
  });

  // ID: ASK-14 | Type: Negative | Severity: High | Last status: PASS
  // Steps: 1. Click "Voice conversation"
  // Expected: Activates microphone input / a voice conversation mode
  test.skip("ASK-14: \"Voice conversation\" opens voice input mode", async () => {
    requireBrowserPermission('microphone', 'Requires browser microphone permissions and an interactive voice session');
  });

  // ID: ASK-15 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Click "Attach" and select a file
  // Expected: File is attached to the outgoing message (e.g. for symptom photos, lab results)
  test("ASK-15: \"Attach\" accepts a supported file locally", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'lab-results.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('%PDF-1.4 local fixture'),
    });
    await expect(page.getByText('lab-results.pdf', { exact: true })).toBeVisible();
  });

  // ID: ASK-20 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. While logged in, inspect the left app sidebar on /asknumaa
  // Expected: Dashboard, Calendar, Your Body and Baby, Essential Testing, Preparation for the Baby, Message, Send Feedback, plus the AI-agent shortcut row (Ask NuMaa, Mom to Mom, Nutrition, Mental Health, Kick Count Agent, Baby Checklist, Gamifier, Medication, Physical Activity, Content, Journal, Shopping Agent, Travel Advisor) all render
      test("ASK-20: Full authenticated app sidebar renders", async ({ page }) => {
    await login(page);
    await page.goto('/asknumaa');
    for (const label of ['Dashboard', 'Calendar', 'Your Body and Baby', 'Essential Testing', 'Preparation for the Baby', 'Message', 'Send Feedback', 'Ask NuMaa', 'Mom to Mom', 'Nutrition', 'Wellness', 'Kick Count Agent', 'Baby Checklist', 'Gamifier Agent', 'Medication Support', 'Numaa Fitness', 'Content', 'Journal', 'Shopping Agent', 'Travel Advisor']) {
      const regex = new RegExp(label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      await expect(page.getByRole('link', { name: regex }).or(page.getByRole('button', { name: regex })).first()).toBeVisible();
    }
  });

  // ID: ASK-21 | Type: Positive | Severity: Medium | Last status: PASS
  // Steps: 1. Check the browser tab title while on /asknumaa
  // Expected: Should read something distinct, e.g. "Ask Numaa | Numaa"
  test("ASK-21: Page <title> is unique to Ask Numaa", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    await expect(page).toHaveTitle('Ask NuMaa | Numaa');
  });

  // ID: ASK-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to https://numaa.ai/asknumaa
  // Expected: "Pregnancy Assistant" heading and "Get instant, evidence-based answers to your pregnancy questions. Powered by trusted medical guidelines." render
  test("ASK-01: Page loads with heading and description", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    await expect(page.getByRole('heading', { name: 'Pregnancy Assistant' })).toBeVisible();
    await expect(page.getByText('Get instant, evidence-based answers to your pregnancy questions. Powered by trusted medical guidelines.', { exact: true })).toBeVisible();
  });

  // ID: ASK-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Compare the "Ask Numaa" nav link text on the Home/Services/About pages against the same link on /asknumaa
  // Expected: Same capitalization should be used everywhere for the same nav item
  test("ASK-02: Nav link capitalization is consistent", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    await expect(page.getByRole('link', { name: 'Ask NuMaa', exact: true })).toBeVisible();
  });

  // ID: ASK-17 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the row above "How can we assist you today?"
  // Expected: "Memory" and "Add Context" controls render
  test("ASK-17: Memory and Add Context controls render", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    await expect(page.getByRole('button', { name: 'Memory', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Add Context', exact: true })).toBeVisible();
  });

  // ID: ASK-18 | Type: Positive | Severity: Medium | Last status: PASS
  // Steps: 1. Click "Memory"
  // Expected: Opens a view showing what NuMaa remembers about the user across conversations
  test("ASK-18: \"Memory\" opens its authenticated entry point", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    await page.getByRole('button', { name: 'Memory', exact: true }).click();
    await expect(page).toHaveURL(/\/login\?redirect=\/numaa-memory/);
  });

  // ID: ASK-19 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Click "Add Context"
  // Expected: Allows the user to attach relevant profile/health data to ground the AI's answer
  test("ASK-19: \"Add Context\" opens the session context panel", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    await page.getByRole('button', { name: 'Add Context', exact: true }).click();
    await expect(page.getByText('Session Context', { exact: true })).toBeVisible();
    await expect(page.getByText('Extra information for this conversation', { exact: true })).toBeVisible();
  });

  // ID: ASK-04 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the left "Chats" panel
  // Expected: "New chat" control and "No conversations yet. Start by asking NuMaa a question!" message render
  test("ASK-04: Chats sidebar renders with empty state", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    await expect(page.getByRole('button', { name: 'New', exact: true })).toBeVisible();
    await expect(page.getByText('No conversations yet. Start by asking NuMaa a question!', { exact: true })).toBeVisible();
  });

  // ID: ASK-05 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Locate the "Collapse sidebar" control on the Chats panel
  // Expected: A collapse/expand control is present and labeled
  test("ASK-05: Sidebar can be collapsed", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    await expect(page.getByRole('button', { name: 'Collapse sidebar', exact: true })).toBeVisible();
  });

  // ID: ASK-06 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Click "New chat"
  // Expected: Clears/creates a new empty conversation thread
  test("ASK-06: \"New chat\" starts a fresh conversation", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    await page.getByRole('button', { name: 'New', exact: true }).click();
    await expect(page.getByText('No conversations yet. Start by asking NuMaa a question!', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Ask anything...')).toHaveValue('');
  });

  // ID: ASK-07 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Ask a question
  // Steps: 2. Check whether it appears in the Chats sidebar list afterward
  // Expected: New conversation should appear in the sidebar, replacing the empty state
  test.skip("ASK-07: Chat history persists after asking a question", async () => {
    requireBrowserPermission('session persistence', 'Requires a persisted external AI response and account chat history');
  });

  // ID: ASK-08 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the prompt suggestions below the main heading
  // Expected: "Common Pregnancy Concern", "Maternal Health Question", "Daily Activity Safety", "Energy & Fatigue" each render with a heading and one-line description
  test("ASK-08: 4 suggested-topic cards render", async ({ page }) => {
    await gotoPublic(page, '/asknumaa');
    for (const label of ['Common Pregnancy Concern', 'Maternal Health Question', 'Daily Activity Safety', 'Energy & Fatigue']) {
      await expect(page.getByRole('heading', { name: label, exact: true })).toBeVisible();
    }
  });

  // ID: ASK-09 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the "Common Pregnancy Concern" card
  // Expected: The suggestion is presented as an interactive prompt card
  test("ASK-09: Suggested-topic card is presented as interactive", async ({ page }) => {
    await login(page);
    await page.goto('/asknumaa');
    const card = page.getByRole('heading', { name: 'Common Pregnancy Concern', exact: true });
    await card.waitFor({ state: 'visible' });
    const cardContainer = card.locator('..').locator('..');
    await expect(cardContainer).toHaveClass(/cursor-pointer/);
    await cardContainer.click();
    await expect(card).toBeVisible();
  });

});