import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Module: BLANK - blank-page-after-chat
//
// Purpose: reproduce the reported bug where several agent chats go to a
// blank white page right after the user submits a question. The answer
// only appears after a manual refresh. This suite sends a real question
// to each affected agent and asserts the page NEVER goes blank while
// waiting for the response — catching the bug without needing a refresh
// workaround.
//
// Affected agents (from the bug report):
//   Ask NuMaa, Mom to Mom, Kick Count Chat, Baby Checklist, NuMaa Fitness,
//   Content, Journal Companion, Shopping Assistant
//
// Scope: web only (no mobile viewport variant).
//
// Ask NuMaa and Mom to Mom were confirmed in earlier testing; the other six
// agents' paths and chat selectors were verified against live numaa.ai on
// 2026-10-30. If one starts failing on a 404 or a missing
// launcher button, re-check the path before treating it as the blank-page
// bug — a wrong path looks like a failure but isn't what we're hunting for.
//
// "Blank white page" detection: immediately after sending a question, we
// poll the page body's visible text. If it ever drops to (near) empty
// before the response renders, that's the bug — the test fails and names
// which agent and how long after sending it went blank.

test.describe("BLANK - blank-page-after-chat", () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // Returns the page's visible text length, used to detect a "gone blank"
  // state. A real blank white page has ~0 visible characters; a normal
  // loading state still has nav, headers, etc.
  async function visibleTextLength(page) {
    return await page.evaluate(() => (document.body.innerText || '').trim().length);
  }

  // Polls the page every `intervalMs` for `durationMs` total, recording
  // whether visible text ever dropped below `blankThreshold`. Returns
  // { wentBlank, minLength } so the caller can assert and report details.
  async function watchForBlankPage(page, durationMs, intervalMs = 250, blankThreshold = 40) {
    const start = Date.now();
    let minLength = Infinity;
    let wentBlank = false;
    while (Date.now() - start < durationMs) {
      const len = await visibleTextLength(page).catch(() => 0);
      if (len < minLength) minLength = len;
      if (len < blankThreshold) {
        wentBlank = true;
        break;
      }
      await page.waitForTimeout(intervalMs);
    }
    return { wentBlank, minLength };
  }

  // --- Pattern A: full-page chat (e.g. Ask NuMaa) ---
  async function askFullPageChat(page, path, questionText, agentLabel) {
    await page.goto(path);
    await expect(page.getByPlaceholder('Ask anything...')).toBeVisible({ timeout: 15000 });

    const input = page.getByPlaceholder('Ask anything...');
    await input.fill(questionText);

    const beforeLen = await visibleTextLength(page);
    await page.getByRole('button', { name: 'Send message', exact: true }).click();

    // Watch for a blank-page regression for up to 20s while the response
    // is expected to stream in.
    const result = await watchForBlankPage(page, 20000);
    expect(
      result.wentBlank,
      `"${agentLabel}" went to a blank page after sending a question (visible text dropped to ${result.minLength} chars). Started at ${beforeLen} chars.`
    ).toBe(false);

    // Also confirm a real response eventually rendered (not just "didn't
    // go blank" — the input should clear and new content should appear).
    await expect(input).toHaveValue('', { timeout: 5000 });
  }

  // --- Pattern B: popup chat (e.g. Mom to Mom) ---
  // Each agent's popup has its own launcher button and input placeholder, so
  // both can be passed per agent; the defaults are Mom to Mom's.
  async function askPopupChat(page, path, questionText, agentLabel,
    { chatButton = /chat/i, placeholder = 'Ask me anything...' } = {}) {
    await page.goto(path);
    await page.getByRole('button', { name: chatButton, exact: typeof chatButton === 'string' }).first().click();
    await expect(page.getByPlaceholder(placeholder, { exact: true })).toBeVisible({ timeout: 15000 });

    const input = page.getByPlaceholder(placeholder, { exact: true });
    await input.fill(questionText);

    const beforeLen = await visibleTextLength(page);
    await input.press('Enter');

    const result = await watchForBlankPage(page, 20000);
    expect(
      result.wentBlank,
      `"${agentLabel}" went to a blank page after sending a question (visible text dropped to ${result.minLength} chars). Started at ${beforeLen} chars.`
    ).toBe(false);

    await expect(input).toHaveValue('', { timeout: 5000 });
  }

  // ───────────────────────────────────────────────────────────
  // Confirmed agents
  // ───────────────────────────────────────────────────────────

  test('BLANK-01: Ask NuMaa does not go blank after sending a question', async ({ page }) => {
    await askFullPageChat(page, '/asknumaa', 'What foods are rich in iron?', 'Ask NuMaa');
  });

  test('BLANK-02: Mom to Mom does not go blank after sending a question', async ({ page }) => {
    await askPopupChat(page, '/mom-to-mom', 'What are good rich foods that give calcium?', 'Mom to Mom');
  });

  // ───────────────────────────────────────────────────────────
  // Popup-chat agents — paths, launcher buttons and placeholders verified
  // against live numaa.ai on 2026-10-30.
  // ───────────────────────────────────────────────────────────

  test('BLANK-03: Kick Count Chat does not go blank after sending a question', async ({ page }) => {
    await askPopupChat(page, '/baby-kick-tracker', 'How many kicks should I feel today?', 'Kick Count Chat',
      { chatButton: 'Chat with Kick Count Agent', placeholder: 'Type a message...' });
  });

  test('BLANK-04: Baby Checklist does not go blank after sending a question', async ({ page }) => {
    await askPopupChat(page, '/baby-checklist', 'What should be on my hospital bag checklist?', 'Baby Checklist',
      { chatButton: 'Chat with Baby Checklist Agent', placeholder: 'Ask about baby gear, timing...' });
  });

  test('BLANK-05: NuMaa Fitness does not go blank after sending a question', async ({ page }) => {
    await askPopupChat(page, '/physical-agent', 'What exercises are safe in the third trimester?', 'NuMaa Fitness',
      { chatButton: 'Chat', placeholder: 'Ask me anything...' });
  });

  test('BLANK-06: Content does not go blank after sending a question', async ({ page }) => {
    await askPopupChat(page, '/content-agent', 'Show me videos about labor and delivery.', 'Content',
      { chatButton: 'Chat with Content Agent', placeholder: 'Ask about pregnancy...' });
  });

  test('BLANK-07: Journal Companion does not go blank after sending a question', async ({ page }) => {
    await askPopupChat(page, '/journal-agent', 'Help me write a journal entry about today.', 'Journal Companion',
      { chatButton: 'Chat with Journal Agent', placeholder: "Share what's on your mind..." });
  });

  test('BLANK-08: Shopping Assistant does not go blank after sending a question', async ({ page }) => {
    // Placeholder uses a single ellipsis character, not three dots
    await askPopupChat(page, '/shopping-agent', 'What baby gear do I actually need?', 'Shopping Assistant',
      { chatButton: 'Chat', placeholder: 'Ask me anything…' });
  });

});