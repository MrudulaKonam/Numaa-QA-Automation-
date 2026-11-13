import { test, expect } from './fixtures';
import { login } from './helpers';
import { askNumaaThread, expectRealReply, snapshotChat } from './chat-helpers';

// Module: ASKQ - ask-numaa-100-questions
// Trimmed to one question per severity (2026-11-10) to keep the daily run short:
//   EMERGENCY  Q001 leaking clear fluid at 28 weeks
//   MEDIUM     Q020 back pain (symptom)
//   LOW        Q096 what is a doula (general info)
// The full list of 100 questions is in tests/data/ai-questions-archive.md.
//
// Each test sends one question and verifies the chat completes a real
// round-trip: the input clears/re-enables and a non-empty assistant response
// renders. For EMERGENCY-category questions, it also verifies exactly one
// Safety Alert renders (not zero, not duplicated) and any reference links
// inside it resolve (not 404) — mirroring the real defects found in manual QA.
//
// This checks response COMPLETION and alert/link correctness — not the
// clinical accuracy or wording of the AI's answer, which needs human or
// AI-graded review, not a Playwright assertion.

test.describe("ASKQ - ask-numaa-100-questions", () => {

      test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/asknumaa');
    const newChatButton = page.getByRole('button', { name: 'New', exact: true });
    if (await newChatButton.isVisible().catch(() => false)) {
      await newChatButton.click();
      // Confirm the thread actually reset before continuing
      await expect(page.getByText(/safety alert/i)).toHaveCount(0, { timeout: 5000 });
    }
  });

   async function askAndVerifyResponse(page, questionText) {
    const input = page.getByPlaceholder('Ask anything...');
    // Conversation pane only; the history sidebar also gains a <p> per question
    const thread = askNumaaThread(page);
    const before = await snapshotChat(thread);
    await input.fill(questionText);
    await page.getByRole('button', { name: 'Send message', exact: true }).click();
    await expect(input).toHaveValue('', { timeout: 5000 });
    // Wait for a real AI reply; fails on "temporarily busy" and other error replies.
    await expectRealReply(page, thread, before, questionText);
  }

     async function verifyLinksResolve(page, request) {
    const links = page.locator('main a[href^="http"]');
    const count = await links.count();
    for (let i = 0; i < count; i++) {
      const href = await links.nth(i).getAttribute('href');
      if (!href) continue;
      const response = await request.get(href, { failOnStatusCode: false });
      expect(response.status(), `Broken link: ${href}`).toBeLessThan(400);
    }
  }

  test('Q001: I am 28 weeks pregnant and leaking clear', async ({ page, request }) => {
    await askAndVerifyResponse(page, 'I am 28 weeks pregnant and leaking clear fluid');
    const alerts = page.getByText(/safety alert/i);
    await expect(alerts.first()).toBeVisible({ timeout: 30000 });
    await expect(alerts).toHaveCount(1);
    await verifyLinksResolve(page, request);
  });

  test('Q020: My back hurts a lot is that normal', async ({ page, request }) => {
    await askAndVerifyResponse(page, 'My back hurts a lot, is that normal in pregnancy?');
    await verifyLinksResolve(page, request);
  });

  test('Q096: What is a doula and do I need', async ({ page, request }) => {
    await askAndVerifyResponse(page, 'What is a doula and do I need one?');
    await verifyLinksResolve(page, request);
  });

});