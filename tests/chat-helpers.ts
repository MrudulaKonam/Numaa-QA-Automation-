import { Locator, Page, test } from '@playwright/test';

// Shared reply check for the AI chat specs (Ask NuMaa, Mom to Mom, agent popups).
//
// Counting <p> elements isn't enough: the Ask NuMaa history sidebar adds the
// question as a new entry, and failed replies are themselves new paragraphs, so
// tests passed while the AI was down. This check instead:
//   1. fails straight away if the new text contains a known error message;
//   2. passes only once there are at least `minChars` characters of new text,
//      not counting the user's own question, and that text has stopped changing.

// Error replies seen on live numaa.ai (2026-11-07):
//   Ask NuMaa:  "NuMaa is temporarily busy and couldn't complete this response. Please try again in a moment."
//   Mom to Mom: "Failed to get response from AI service. Please try again."
// The rest are common generic failure wordings.
export const CHAT_ERROR_PATTERNS: RegExp[] = [
  /temporarily busy/i,
  /couldn['’]t complete this response/i,
  /failed to get (a )?response/i,
  /please try again/i,
  /something went wrong/i,
  /an (unexpected )?error (has )?occurred/i,
  /internal server error/i,
  /service (is )?unavailable/i,
  /network error/i,
  /too many requests|rate limit/i,
  /request (failed|timed out)/i,
  /unable to (get|generate|process|complete)/i,
];

// "Thinking…" / "typing…" indicators shown while a reply is pending
const PENDING_LINE = /^\S*\s*(is\s+)?(thinking|typing|generating|loading)\b.*?(\.\.\.|…)?$/i;

const norm = (s: string) => s.replace(/\s+/g, ' ').trim().toLowerCase();

function textLines(text: string): string[] {
  return text.split('\n').map((l) => l.trim()).filter(Boolean);
}

// Lines in `after` that weren't in `before` (counted, so a repeated line is
// still noticed), leaving out the user's question (including a truncated copy,
// e.g. the sidebar title "How is due date calc…") and pending indicators.
function newReplyText(before: string, after: string, question: string): string {
  const seen = new Map<string, number>();
  for (const l of textLines(before)) seen.set(l, (seen.get(l) ?? 0) + 1);
  const q = norm(question);
  const fresh: string[] = [];
  for (const l of textLines(after)) {
    const n = seen.get(l) ?? 0;
    if (n > 0) { seen.set(l, n - 1); continue; }
    const nl = norm(l).replace(/(\.\.\.|…)$/, '').trim();
    if (nl && q.includes(nl)) continue; // the user's own message
    if (PENDING_LINE.test(l)) continue;
    fresh.push(l);
  }
  return fresh.join('\n');
}

export type ReplyOptions = {
  minChars?: number;  // minimum new characters that count as a real reply
  timeout?: number;   // ms to wait for the reply
  stableMs?: number;  // how long the reply must stay unchanged (streaming finished)
};

// Take `before` with snapshotChat() BEFORE sending, then send, then call this.
// Returns the new reply text.
export async function expectRealReply(
  page: Page,
  scope: Locator,
  before: string,
  question: string,
  { minChars = 50, timeout = 45000, stableMs = 2000 }: ReplyOptions = {},
): Promise<string> {
  // Give the test enough time for the full wait (the default test timeout is
  // 30s), so a missing reply fails with the message below, not a test timeout.
  test.info().setTimeout(test.info().timeout + timeout);
  const deadline = Date.now() + timeout;
  let reply = '';
  let lastChange = Date.now();
  while (true) {
    const now = await scope.innerText().catch(() => before);
    const next = newReplyText(before, now, question);
    if (next !== reply) { reply = next; lastChange = Date.now(); }

    const error = CHAT_ERROR_PATTERNS.find((re) => re.test(reply));
    if (error) {
      throw new Error(`AI chat returned an error instead of a reply (matched ${error}):\n${reply}`);
    }
    // Ask NuMaa (since ~2026-11-09) shows the failure as a toast outside the
    // thread ("Unable to complete response – Please try again in a moment.")
    // and resets the conversation, so check open toasts/alerts too.
    const toast = await errorToastText(page);
    const toastError = toast && CHAT_ERROR_PATTERNS.find((re) => re.test(toast));
    if (toastError) {
      throw new Error(`AI chat showed an error toast instead of a reply (matched ${toastError}):\n${toast}`);
    }
    if (reply.length >= minChars && Date.now() - lastChange >= stableMs) return reply;
    if (Date.now() > deadline) {
      throw new Error(
        `No real AI reply within ${timeout / 1000}s: expected at least ${minChars} characters of new text ` +
        `besides the question, got ${reply.length}${reply ? `:\n${reply}` : '.'}`,
      );
    }
    await page.waitForTimeout(500);
  }
}

// Text of open toast notifications / alerts (Radix toasts render as
// <li data-state="open"> inside an <ol> viewport).
async function errorToastText(page: Page): Promise<string> {
  const texts = await page
    .locator('ol li[data-state="open"], [role="alert"]')
    .allInnerTexts()
    .catch(() => [] as string[]);
  return texts.map((t) => t.replace(/\s+/g, ' ').trim()).filter(Boolean).join('\n');
}

export async function snapshotChat(scope: Locator): Promise<string> {
  return scope.innerText().catch(() => '');
}

// Ask NuMaa (/asknumaa): the conversation pane, without the chat-history sidebar.
export function askNumaaThread(page: Page): Locator {
  const input = page.getByPlaceholder('Ask anything...');
  return page.locator('main div').filter({ has: input }).filter({ hasNot: page.locator('aside') }).first();
}

// Agent chat popups: the fixed panel that holds the given input.
export function popupThread(page: Page, input: Locator): Locator {
  return page.locator('div.fixed', { has: input }).last();
}
