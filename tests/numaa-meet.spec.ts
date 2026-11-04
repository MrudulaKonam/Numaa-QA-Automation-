/**
 * NuMaa Meet (Telecommunication) – Web
 * Every test states its EXPECTED result. Playwright fails the test automatically
 * whenever an expect() does not match the ACTUAL result.
 *
 * Locators verified against live numaa.ai on 2026-10-29 (see "verified" / "UNVERIFIED" comments).
 *
 * .env:  NUMAA_BASE_URL, TEST_EMAIL, TEST_PASSWORD, NUMAA_USER_NAME (e.g. "Mrudula Reddy")
 *        TEST_EMAIL_2, TEST_PASSWORD_2   (OPTIONAL second account – P5, P6, N10 are
 *        skipped until these are added)
 */
import { test, expect, Page, Browser } from '@playwright/test';
import 'dotenv/config';

const BASE = process.env.NUMAA_BASE_URL ?? 'https://numaa.ai';
const USER = process.env.NUMAA_USER_NAME ?? 'Mrudula Reddy';
// Account 1 = host, Account 2 = joiner. Passwords stay in .env only (never in code).
const EMAIL_1 = process.env.TEST_EMAIL   ?? 'madhu.testqa+numaa01@gmail.com';
const EMAIL_2 = process.env.TEST_EMAIL_2 ?? 'madhu.testqa+numaa02@gmail.com';
const PASS_1  = process.env.TEST_PASSWORD!;
const PASS_2  = process.env.TEST_PASSWORD_2;
const HAS_2ND = !!PASS_2;
const SKIP_MSG = 'Needs TEST_PASSWORD_2 in .env for the second account';
const CODE_RE = /numaa-[a-z0-9]{3}-[a-z0-9]{4}/i;            // from placeholder "numaa-8gf-3y2k"

// Fake camera/mic so the browser never blocks on a permission prompt
test.use({
  permissions: ['camera', 'microphone'],
  launchOptions: { args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'] },
});

// ---------- helpers ----------
async function login(page: Page, email = EMAIL_1, pw = PASS_1) {
  await page.goto(`${BASE}/login`);                                        // verified 2026-10-29
       // Cookie banner backdrop intercepts all clicks until dismissed – accept it if shown
     const acceptAll = page.getByRole('button', { name: /^accept all$/i });
     await acceptAll.waitFor({ state: 'visible', timeout: 10_000 })
       .then(() => acceptAll.click())
       .catch(() => {});
  await page.getByLabel(/email/i).fill(email);                              // verified: label "EMAIL *"
  await page.getByLabel(/password/i).fill(pw);                              // verified: label "PASSWORD *"
  await page.getByRole('button', { name: /^continue/i }).click();           // verified: "CONTINUE →" (/log in/ hit Google/Facebook buttons)
  await expect(page).toHaveURL(/dashboard/, { timeout: 20_000 });
}

// verified: dialog has no accessible name, so match on its heading
const dialog = (page: Page) => page.getByRole('dialog')
  .filter({ has: page.getByRole('heading', { name: /numaa telecommunication/i }) });

async function openMeet(page: Page) {
  await page.getByRole('button', { name: /numaa meet/i }).click();
  await expect(dialog(page)).toBeVisible();
}

// verified: tabs are plain buttons; exact name so 'Schedule' doesn't also hit "Schedule & Generate Invitation"
const tab = (page: Page, name: 'New Meeting' | 'Join with Code' | 'Schedule') =>
  dialog(page).getByRole('button', { name, exact: true });

// verified: <label> is not linked to its <input> (no for/id); input is the label's next sibling
const field = (page: Page, label: RegExp) =>
  dialog(page).locator('label').filter({ hasText: label }).locator('xpath=following-sibling::input[1]');

async function expectError(page: Page) {
  // EXPECTED: a visible validation/error message (site renders plain text, e.g. "Please enter a meeting link or code.")
  await expect(page.getByRole('alert').or(page.getByText(/please enter|required|invalid|not found|error/i)).first())
    .toBeVisible();
}

// verified 2026-11-03: label is "Require unique 8-digit security passcode" and it is CHECKED by default
const passcodeBox = (page: Page) => dialog(page).getByRole('checkbox', { name: /passcode/i });
const PASSCODE_RE = /\b\d{8}\b/;

// verified 2026-11-03: the lobby (/meet/<code>) "Join Meeting" button stays disabled until a role is picked
// (no role is selected by default). Protected meetings also need the passcode typed into the lobby.
async function lobbyJoin(p: Page, role = 'Patient / Mom', passcode?: string) {
  await p.getByRole('button', { name: role, exact: true }).click();
  if (passcode !== undefined) await p.getByPlaceholder(/enter meeting passcode/i).fill(passcode);
  await p.getByRole('button', { name: /^join meeting/i }).click();
}

async function startInstant(page: Page, passcode = false): Promise<{ code: string; passcode?: string }> {
  await openMeet(page);
  await passcodeBox(page).setChecked(passcode);               // set explicitly: the default is now ON
  await dialog(page).getByRole('button', { name: /start instant meeting/i }).click();
  // verified flow: "Meeting Room Ready!" step -> lobby /meet/<code> -> Join Meeting -> /meet/<code>/room
  const ready = dialog(page).getByText(/meeting room ready/i);
  await expect(ready).toBeVisible();
  // verified 2026-11-03: Room Ready shows "Meeting passcode (share separately): 12345678"; host lobby pre-fills it
  const pc = passcode ? (await dialog(page).innerText()).match(PASSCODE_RE)?.[0] : undefined;
  await dialog(page).getByRole('button', { name: /enter meeting room now/i }).click();
  await lobbyJoin(page, 'Patient / Mom');
  await expect(page).toHaveURL(/\/meet\/[^/]+\/room/, { timeout: 20_000 });
  await expect(page.getByText(CODE_RE).first()).toBeVisible({ timeout: 20_000 }); // verified: code in room banner
  const code = (await page.getByText(CODE_RE).first().innerText()).match(CODE_RE)![0];
  return { code, passcode: pc };
}

async function secondUser(browser: Browser) {
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  await login(p, EMAIL_2, PASS_2!);
  return { ctx, p };
}

// =====================================================================
test.describe('NuMaa Meet – POSITIVE', () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test('P1 – NuMaa Meet button opens modal with 3 tabs, New Meeting selected', async ({ page }) => {
    await openMeet(page);
    // EXPECTED: title, subtitle, three tabs, New Meeting active
    await expect(dialog(page)).toContainText('Secure video calling & meeting');
    await expect(tab(page, 'New Meeting')).toBeVisible();
    await expect(tab(page, 'Join with Code')).toBeVisible();
    await expect(tab(page, 'Schedule')).toBeVisible();
    await expect(dialog(page).getByRole('button', { name: /start instant meeting/i })).toBeVisible();
  });

  test('P2 – New Meeting defaults are pre-filled', async ({ page }) => {
    await openMeet(page);
    // EXPECTED: title "NuMaa Teleconsultation", display name = logged-in user, passcode unchecked
    await expect(field(page, /meeting title/i)).toHaveValue('NuMaa Teleconsultation');
    await expect(field(page, /display name/i)).toHaveValue(USER);
    // NOTE 2026-11-03: the site now defaults this to CHECKED. Expectation kept as "unchecked" until product
    // confirms the new default – this assertion is expected to fail until then.
    await expect(passcodeBox(page)).not.toBeChecked();
  });

  test('P3 – Start Instant Meeting opens a meeting room with a code', async ({ page }) => {
    const { code } = await startInstant(page);
    // EXPECTED: modal closes, meeting code shown, own video tile visible
    await expect(dialog(page)).toBeHidden();
    expect(code).toMatch(CODE_RE);
    await expect(page.locator('video').first()).toBeVisible();              // verified: own tile is a visible <video>
  });

  test('P4 – Passcode option generates an 8-digit passcode', async ({ page }) => {
    const { passcode } = await startInstant(page, true);
    // EXPECTED: an 8-digit passcode is displayed to the host (verified 2026-11-03 on the Meeting Room Ready step)
    expect(passcode).toMatch(/^\d{8}$/);
  });

  test('P5 – Second user joins with meeting CODE', async ({ page, browser }) => {
    test.skip(!HAS_2ND, SKIP_MSG);
    const { code } = await startInstant(page);
    const { ctx, p } = await secondUser(browser);
    await openMeet(p);
    await tab(p, 'Join with Code').click();
    await field(p, /link or code/i).fill(code);
    await dialog(p).getByRole('button', { name: /join meeting/i }).click();
    // verified: dialog Join only reaches the lobby /meet/<code>; lobby "Join Meeting" (after picking a role) enters /room
    await lobbyJoin(p, 'Doctor / Expert');
    await expect(p).toHaveURL(new RegExp(`/meet/${code}/room`), { timeout: 20_000 });
    // EXPECTED: joiner enters the same room; host sees 2 participants
    await expect(p.getByText(code)).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('video')).toHaveCount(2, { timeout: 20_000 });  // verified: host shows 2 <video> once joiner is in
    await ctx.close();
  });

  test('P6 – Second user joins with full meeting URL', async ({ page, browser }) => {
    test.skip(!HAS_2ND, SKIP_MSG);
    const { code } = await startInstant(page);
    const url = `${BASE}/meet/${code}`;                          // verified: shareable link format (page.url() is now /room)
    const { ctx, p } = await secondUser(browser);
    await openMeet(p);
    await tab(p, 'Join with Code').click();
    await field(p, /link or code/i).fill(url);
    await dialog(p).getByRole('button', { name: /join meeting/i }).click();
    await lobbyJoin(p, 'Doctor / Expert');                                    // verified: lobby -> /room
    await expect(p).toHaveURL(new RegExp(`/meet/${code}/room`), { timeout: 20_000 });
    // EXPECTED: same meeting joined
    await expect(p.getByText(code)).toBeVisible({ timeout: 20_000 });
    await ctx.close();
  });

  test('P7 – Schedule a future meeting generates an invitation', async ({ page }) => {
    await openMeet(page);
    await tab(page, 'Schedule').click();
    const d = new Date(Date.now() + 2 * 86_400_000);
    const iso = d.toISOString().slice(0, 10);
    await field(page, /meeting topic/i).fill('QA Schedule Test');
    await field(page, /^date$/i).fill(iso);
    await field(page, /^time$/i).fill('11:00');
    await expect(field(page, /host name/i)).toHaveValue(USER);
    await dialog(page).getByRole('button', { name: /schedule & generate invitation/i }).click();
    // EXPECTED: invitation shows topic, date, time, host and a join link/code
    // verified: "Meeting Scheduled!" heading + invitation text lives in a read-only textarea (getByText can't see it)
    await expect(dialog(page).getByRole('heading', { name: /meeting scheduled/i })).toBeVisible();
    const invite = dialog(page).getByRole('textbox');
    await expect(invite).toHaveValue(/invitation/i);
    await expect(invite).toHaveValue(/QA Schedule Test/);
    await expect(invite).toHaveValue(CODE_RE);
    await expect(invite).toHaveValue(/11:00/);
  });

  test('P8 – Tabs switch to the correct form fields', async ({ page }) => {
    await openMeet(page);
    await tab(page, 'Join with Code').click();
    // EXPECTED: code field + Join Meeting button
    await expect(field(page, /link or code/i)).toHaveAttribute('placeholder', /numaa-8gf-3y2k/);
    await expect(dialog(page).getByRole('button', { name: /join meeting/i })).toBeVisible();
    await tab(page, 'Schedule').click();
    // EXPECTED: topic, date, time, host + schedule button
    await expect(field(page, /meeting topic/i)).toHaveValue('NuMaa Teleconsultation');
    await expect(dialog(page).getByRole('button', { name: /schedule & generate invitation/i })).toBeVisible();
  });

  test('P9 – Close (X) and Escape close the modal', async ({ page }) => {
    await openMeet(page);
    await dialog(page).getByRole('button', { name: /close/i }).click();    // verified: aria-label="Close"
    await expect(dialog(page)).toBeHidden();
    await openMeet(page);
    await page.keyboard.press('Escape');
    // EXPECTED: modal closed both times
    await expect(dialog(page)).toBeHidden();
  });
});

// =====================================================================
test.describe('NuMaa Meet – NEGATIVE', () => {
  test.beforeEach(async ({ page }) => { await login(page); });

  test('N1 – Empty meeting title is rejected', async ({ page }) => {
    await openMeet(page);
    await field(page, /meeting title/i).fill('');
    await dialog(page).getByRole('button', { name: /start instant meeting/i }).click();
    // EXPECTED: error shown, modal stays open, no meeting started
    await expectError(page);
    await expect(dialog(page)).toBeVisible();
  });

  test('N2 – Empty display name is rejected (New Meeting)', async ({ page }) => {
    await openMeet(page);
    await field(page, /display name/i).fill('');
    await dialog(page).getByRole('button', { name: /start instant meeting/i }).click();
    await expectError(page);
    await expect(dialog(page)).toBeVisible();
  });

  test('N3 – Join with empty code is blocked', async ({ page }) => {
    await openMeet(page);
    await tab(page, 'Join with Code').click();
    const join = dialog(page).getByRole('button', { name: /join meeting/i });
    // EXPECTED: button disabled OR error on click
    if (await join.isEnabled()) { await join.click(); await expectError(page); }
    else await expect(join).toBeDisabled();
  });

  test('N4 – Join with non-existent code shows "not found"', async ({ page }) => {
    await openMeet(page);
    await tab(page, 'Join with Code').click();
    await field(page, /link or code/i).fill('numaa-zzz-0000');
    await dialog(page).getByRole('button', { name: /join meeting/i }).click();
    // EXPECTED: "meeting not found / invalid code", user stays on modal
    await expect(page.getByText(/not found|invalid|does not exist/i)).toBeVisible();
    await expect(dialog(page)).toBeVisible();
  });

  test('N5 – Malformed / script input in code field is rejected safely', async ({ page }) => {
    let popup = false;
    page.on('dialog', d => { popup = true; d.dismiss(); });
    await openMeet(page);
    await tab(page, 'Join with Code').click();
    await field(page, /link or code/i).fill('<script>alert(1)</script>');
    await dialog(page).getByRole('button', { name: /join meeting/i }).click();
    // EXPECTED: validation error, NO script executed
    await expectError(page);
    expect(popup).toBe(false);
  });

  test('N6 – Empty display name is rejected (Join)', async ({ page }) => {
    await openMeet(page);
    await tab(page, 'Join with Code').click();
    await field(page, /link or code/i).fill('numaa-8gf-3y2k');
    await field(page, /display name/i).fill('');
    await dialog(page).getByRole('button', { name: /join meeting/i }).click();
    await expectError(page);
  });

  test('N7 – Schedule with a past date is rejected', async ({ page }) => {
    await openMeet(page);
    await tab(page, 'Schedule').click();
    const yesterday = new Date(Date.now() - 86_400_000).toISOString().slice(0, 10);
    await field(page, /^date$/i).fill(yesterday);
    await dialog(page).getByRole('button', { name: /schedule & generate invitation/i }).click();
    // EXPECTED: error, no invitation generated
    await expectError(page);
    await expect(page.getByText(/invitation (created|generated)/i)).toHaveCount(0);
  });

  test('N8 – Schedule with empty topic or host is rejected', async ({ page }) => {
    await openMeet(page);
    await tab(page, 'Schedule').click();
    await field(page, /meeting topic/i).fill('');
    await dialog(page).getByRole('button', { name: /schedule & generate invitation/i }).click();
    await expectError(page);
    await field(page, /meeting topic/i).fill('QA');
    await field(page, /host name/i).fill('');
    await dialog(page).getByRole('button', { name: /schedule & generate invitation/i }).click();
    await expectError(page);
  });

  test('N9 – Very long title (300 chars) is limited or rejected, no crash', async ({ page }) => {
    await openMeet(page);
    await field(page, /meeting title/i).fill('A'.repeat(300));
    const v = await field(page, /meeting title/i).inputValue();
    // EXPECTED: input capped (maxlength) OR error on submit
    if (v.length === 300) {
      await dialog(page).getByRole('button', { name: /start instant meeting/i }).click();
      await expectError(page);
    } else {
      expect(v.length).toBeLessThan(300);
    }
  });

  test('N10 – Wrong passcode cannot enter a protected meeting', async ({ page, browser }) => {
    test.skip(!HAS_2ND, SKIP_MSG);
    const { code, passcode } = await startInstant(page, true);
    const wrong = passcode === '00000000' ? '11111111' : '00000000';       // 8 digits, guaranteed not the real one
    const { ctx, p } = await secondUser(browser);
    await openMeet(p);
    await tab(p, 'Join with Code').click();
    await field(p, /link or code/i).fill(code);
    await dialog(p).getByRole('button', { name: /join meeting/i }).click();
    // verified 2026-11-03: joiner lobby has an "Enter meeting passcode" field; wrong code shows
    // "Invalid passcode. Please check and try again." and stays in the lobby
    await lobbyJoin(p, 'Doctor / Expert', wrong);
    // EXPECTED: "invalid passcode", joiner NOT admitted
    await expect(p.getByText(/incorrect|invalid|wrong/i)).toBeVisible();
    await expect(p).not.toHaveURL(/\/room/);
    await expect(page.locator('video')).toHaveCount(1);                    // host alone
    await ctx.close();
  });
});

// =====================================================================
test('N11 – Logged-out user cannot use NuMaa Meet', async ({ page }) => {
  await page.goto(BASE);
  const btn = page.getByRole('button', { name: /numaa meet/i });
  // EXPECTED: button hidden, or clicking it redirects to login
  if (await btn.isVisible()) {
    await btn.click();
    await expect(page).toHaveURL(/login|signin/i);
  } else {
    await expect(btn).toBeHidden();
  }
});