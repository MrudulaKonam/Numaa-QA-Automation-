/**
 * NuMaa Meet (Telecommunication modal) — mobile layout + functional checks
 * Drop into ~/Desktop/numaa-test-suite/tests/
 *
 * Add these projects to playwright.config.ts:
 *
 *   import { devices } from '@playwright/test';
 *   projects: [
 *     { name: 'iphone', use: { ...devices['iPhone 13'] } },          // WebKit — layout tests
 *     { name: 'iphone-se', use: { ...devices['iPhone SE'] } },       // narrowest width
 *     {
 *       name: 'android-media',                                       // Chromium — media/clipboard tests
 *       use: {
 *         ...devices['Pixel 7'],
 *         permissions: ['camera', 'microphone', 'clipboard-read', 'clipboard-write'],
 *         launchOptions: {
 *           args: ['--use-fake-ui-for-media-stream', '--use-fake-device-for-media-stream'],
 *         },
 *       },
 *     },
 *   ]
 *
 * Run:  npx playwright test numaa-meet --project=iphone
 *       npx playwright test numaa-meet --project=android-media
 *
 * .env:  TEST_EMAIL=...   TEST_PASSWORD="..."   (quote if special characters)
 *
 * Selectors verified against the live site (iPhone 13 / WebKit) on 2026-11-03.
 * F04, F08, F09 are Chromium-only (android-media project).
 */
import { test, expect, Page, Locator } from '@playwright/test';
import 'dotenv/config';

const BASE = process.env.NUMAA_URL ?? 'https://numaa.ai';

// ---------- helpers ----------

async function login(page: Page) {
  // verified: go straight to /login (on mobile the header only has "Open menu", no login link)
  await page.goto(`${BASE}/login`);
  await page.getByRole('button', { name: /^accept all$/i }).click({ timeout: 5000 }).catch(() => {}); // cookie banner
  await page.getByLabel(/email/i).fill(process.env.TEST_EMAIL!);
  await page.getByLabel(/password/i).fill(process.env.TEST_PASSWORD!);
  await page.getByRole('button', { name: /^continue/i }).click(); // button text: "CONTINUE →"
  await expect(page.getByText(/welcome/i).first()).toBeVisible({ timeout: 20_000 });
}

async function openMeetModal(page: Page): Promise<Locator> {
  // verified: on mobile the header "NuMaa Meet" button is hidden; it appears inside "Open menu"
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('button', { name: 'NuMaa Meet' }).locator('visible=true').first().click();
  const modal = page.getByRole('dialog'); // verified: real role=dialog, heading "NuMaa Telecommunication"
  await expect(modal).toBeVisible();
  await expect(modal).toHaveCSS('opacity', '1'); // verified: fades in from opacity 0 (~300 ms); wait so screenshots aren't mid-fade
  return modal;
}

// verified: the passcode is a read-only <span> showing 8 digits (not an input); "Generate new" button next to it
const passcodeText = (m: Locator) => m.getByText(/^\d{8}$/);
const passcodeBox = (m: Locator) => m.getByRole('checkbox', { name: /passcode/i });
// verified: textboxes are Meeting Title (1st) then Display Name (placeholder "Your full name")
const displayNameInput = (m: Locator) => m.getByPlaceholder('Your full name');
const startBtn = (m: Locator) => m.getByRole('button', { name: /start instant meeting/i });

/** From "Meeting Room Ready!" go to the pre-join page (/meet/<code>), where camera/mic are requested. */
async function enterPreJoin(page: Page) {
  await page.getByRole('button', { name: 'Enter Meeting Room Now' }).click(); // verified button name
  await expect(page).toHaveURL(/\/meet\/numaa-[a-z0-9]{3}-[a-z0-9]{4}$/);
}

/** Elements inside root whose content overflows horizontally or that stick out of root. */
async function findOverflow(root: Locator) {
  return root.evaluate((el) => {
    const rootBox = el.getBoundingClientRect();
    const out: string[] = [];
    el.querySelectorAll<HTMLElement>('*').forEach((n) => {
      const r = n.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return;
      const label = `${n.tagName.toLowerCase()}${n.className ? '.' + String(n.className).split(' ')[0] : ''} "${(n.innerText || (n as HTMLInputElement).value || '').slice(0, 25)}"`;
      if (r.right > rootBox.right + 1 || r.left < rootBox.left - 1) out.push(`sticks out: ${label}`);
      if (n.scrollWidth > n.clientWidth + 1 && getComputedStyle(n).overflowX !== 'auto' && getComputedStyle(n).overflowX !== 'scroll')
        out.push(`clipped text: ${label}`);
    });
    return out;
  });
}

// ---------- tests ----------

test.describe('NuMaa Meet modal', () => {
  let modal: Locator;

  test.beforeEach(async ({ page }) => {
    test.slow(); // login + modal are API-dependent
    await login(page);
    modal = await openMeetModal(page);
  });

  // ===== Layout (run on iphone / iphone-se) =====
  test.describe('layout', () => {
    test('MEET-L01 modal fits inside the viewport', async ({ page }) => {
      const vp = page.viewportSize()!;
      const box = (await modal.boundingBox())!;
      expect(box.x, 'modal left edge off-screen').toBeGreaterThanOrEqual(0);
      expect(box.x + box.width, 'modal right edge off-screen').toBeLessThanOrEqual(vp.width);
      expect(box.width / vp.width, 'modal should use most of the width on mobile').toBeGreaterThan(0.85);
    });

    test('MEET-L02 no clipped or overflowing content inside modal', async () => {
      const issues = await findOverflow(modal);
      expect(issues, issues.join('\n')).toEqual([]);
    });

    test('MEET-L03 both tabs fully visible', async ({ page }) => {
      const vp = page.viewportSize()!;
      // verified: 3 tabs, rendered as plain buttons (no role=tab), all in one row container.
      // Each tab must fit inside the visible part of its row (not just the screen) and the row must not need scrolling.
      const tabs = ['New Meeting', 'Join with Code', 'Schedule'].map((n) => modal.getByRole('button', { name: n, exact: true }));
      for (const t of tabs) {
        await expect(t).toBeVisible();
        const fit = await t.evaluate((el) => {
          const b = el.getBoundingClientRect(), row = el.parentElement!, r = row.getBoundingClientRect();
          const padL = parseFloat(getComputedStyle(row).paddingLeft), padR = parseFloat(getComputedStyle(row).paddingRight);
          return { left: b.left, right: b.right, rowLeft: r.left + padL, rowRight: r.right - padR, rowScroll: row.scrollWidth, rowClient: row.clientWidth };
        });
        const name = await t.innerText();
        expect(fit.right, `"${name}" tab is cut off on the right of its row`).toBeLessThanOrEqual(fit.rowRight + 1);
        expect(fit.left, `"${name}" tab is cut off on the left of its row`).toBeGreaterThanOrEqual(fit.rowLeft - 1);
        expect(fit.right, `"${name}" tab ends off-screen`).toBeLessThanOrEqual(vp.width);
        expect(fit.rowScroll, `tab row overflows: content ${fit.rowScroll}px, visible ${fit.rowClient}px`).toBeLessThanOrEqual(fit.rowClient + 1);
      }
    });

    test('MEET-L04 backdrop dims the whole screen, including the header', async ({ page }) => {
      // The backdrop is the dialog element itself or its closest ancestor with a semi-transparent background (verified: bg-black/60).
      // It must cover the whole viewport and sit above the fixed header.
      // (elementFromPoint is unreliable here in WebKit: it returns <html> at the header, so measure boxes instead.)
      const vp = page.viewportSize()!;
      const r = await modal.evaluate((dlg) => {
        let el: HTMLElement | null = dlg as HTMLElement, bd: HTMLElement | null = null;
        while (el && el !== document.body) {
          const m = getComputedStyle(el).backgroundColor.match(/rgba\(.+,\s*([\d.]+)\)/);
          if (m && +m[1] > 0 && +m[1] < 1) { bd = el; break; }
          el = el.parentElement;
        }
        if (!bd) return null;
        const b = bd.getBoundingClientRect();
        const hdr = document.querySelector('header');
        const z = (e: Element | null) => { let n = e as HTMLElement | null, best = 0; while (n && n !== document.body) { const v = parseInt(getComputedStyle(n).zIndex); if (!isNaN(v)) best = v; n = n.parentElement; } return best; };
        return { x: b.left, y: b.top, w: b.width, h: b.height, backdropZ: z(bd), headerZ: hdr ? z(hdr) : 0 };
      });
      expect(r, 'no semi-transparent backdrop found behind the dialog').not.toBeNull();
      const where = `backdrop box ${Math.round(r!.x)},${Math.round(r!.y)} ${Math.round(r!.w)}x${Math.round(r!.h)} vs screen ${vp.width}x${vp.height}`;
      expect(r!.x, `backdrop does not reach the left edge (${where})`).toBeLessThanOrEqual(0);
      expect(r!.y, `backdrop does not reach the top / header (${where})`).toBeLessThanOrEqual(0);
      expect(r!.x + r!.w, `backdrop does not reach the right edge (${where})`).toBeGreaterThanOrEqual(vp.width);
      expect(r!.y + r!.h, `backdrop does not reach the bottom edge (${where})`).toBeGreaterThanOrEqual(vp.height);
      expect(r!.backdropZ, `header (z ${r!.headerZ}) is above the backdrop (z ${r!.backdropZ})`).toBeGreaterThan(r!.headerZ);
    });

    test('MEET-L05 modal has an accessible close button', async () => {
      await expect(modal.getByRole('button', { name: 'Close' })).toBeVisible(); // verified: aria-label="Close"
    });

    test('MEET-L06 passcode field stays inside its card', async () => {
      const input = passcodeText(modal);
      const card = input.locator('xpath=ancestor::div[.//input[@type="checkbox"]][1]');
      const i = (await input.boundingBox())!;
      const c = (await card.boundingBox())!;
      expect(i.x + i.width).toBeLessThanOrEqual(c.x + c.width);
    });

    test('MEET-L07 buttons do not wrap awkwardly', async () => {
      for (const btn of [startBtn(modal), modal.getByRole('button', { name: /audio/i }), modal.getByRole('button', { name: /video call/i })]) {
        const lines = await btn.evaluate((el) => {
          const cs = getComputedStyle(el);
          const lh = parseFloat(cs.lineHeight) || 20;
          const content = (el as HTMLElement).clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom); // padding is not text
          return Math.round(content / lh);
        });
        expect(lines, `${await btn.innerText()} wraps to ${lines} lines`).toBeLessThanOrEqual(2);
      }
    });

    test('MEET-L08 background page does not scroll while modal is open', async ({ page }) => {
      const before = await page.evaluate(() => window.scrollY);
      await page.evaluate(() => window.scrollBy(0, 400));
      const locked = await page.evaluate(() =>
        ['hidden', 'clip'].includes(getComputedStyle(document.body).overflow) ||
        ['hidden', 'clip'].includes(getComputedStyle(document.documentElement).overflow));
      expect(locked || (await page.evaluate(() => window.scrollY)) === before).toBe(true);
    });
  });

  // ===== Functional =====
  test.describe('passcode', () => {
    test('MEET-F01 passcode is 8 digits when option is checked', async () => {
      await expect(passcodeBox(modal)).toBeChecked();
      await expect(passcodeText(modal)).toHaveText(/^\d{8}$/);
    });

    test('MEET-F02 passcode is unique on reopen', async ({ page }) => {
      const first = await passcodeText(modal).innerText();
      await page.keyboard.press('Escape'); // verified: Escape closes the dialog
      await expect(modal).toBeHidden();
      await page.reload();
      modal = await openMeetModal(page);
      expect(await passcodeText(modal).innerText()).not.toBe(first);
    });

    test('MEET-F03 unchecking hides the passcode', async () => {
      await passcodeBox(modal).uncheck();
      await expect(passcodeText(modal)).toHaveCount(0);
      await expect(modal.getByText(/anyone with the meeting link/i)).toBeVisible(); // verified warning text
    });

    test('MEET-F04 copy passcode puts it on the clipboard', async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'clipboard read needs android-media project');
      // verified on desktop: the modal has no copy button; "Copy passcode" is on the "Meeting Room Ready!" screen
      const code = await passcodeText(modal).innerText();
      await startBtn(modal).click();
      await page.getByRole('button', { name: /copy passcode/i }).click();
      await expect.poll(() => page.evaluate(() => navigator.clipboard.readText())).toBe(code);
    });
  });

  test.describe('display name', () => {
    test('MEET-F05 prefilled with logged-in user name', async () => {
      await expect(displayNameInput(modal)).not.toHaveValue('');
    });

    test('MEET-F06 empty name is blocked', async () => {
      await displayNameInput(modal).fill('');
      await startBtn(modal).click();
      const disabled = await startBtn(modal).isDisabled();
      const error = await modal.getByText(/required|enter.*name/i).isVisible().catch(() => false);
      expect(disabled || error, 'empty display name accepted').toBe(true);
    });

    test('MEET-F07 very long name does not break layout', async () => {
      await displayNameInput(modal).fill('A'.repeat(120));
      const len = (await displayNameInput(modal).inputValue()).length;
      expect(len, 'no maxlength on display name').toBeLessThanOrEqual(60);
      expect(await findOverflow(modal)).toEqual([]);
    });
  });

  test.describe('call type (run on android-media)', () => {
    test.beforeEach(async ({ page, browserName }) => {
      test.skip(browserName !== 'chromium', 'fake media devices need Chromium');
      // record every getUserMedia request
      await page.addInitScript(() => {
        (window as any).__gum = [];
        const orig = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = (c) => { (window as any).__gum.push(c); return orig(c); };
      });
      await page.reload();
      modal = await openMeetModal(page);
    });

    // verified: Start Instant Meeting only shows "Meeting Room Ready!"; camera/mic are requested
    // when the pre-join page (/meet/<code>) opens, after "Enter Meeting Room Now".
    test('MEET-F08 video call requests camera + mic', async ({ page }) => {
      await modal.getByRole('button', { name: /video call/i }).click();
      await startBtn(modal).click();
      await enterPreJoin(page);
      await expect.poll(() => page.evaluate(() => (window as any).__gum.length), { timeout: 15_000 }).toBeGreaterThan(0);
      const c = await page.evaluate(() => (window as any).__gum[0]);
      expect(c.video).toBeTruthy();
      expect(c.audio).toBeTruthy();
    });

    test('MEET-F09 audio-only never requests camera', async ({ page }) => {
      await modal.getByRole('button', { name: /audio/i }).click();
      await startBtn(modal).click();
      await enterPreJoin(page);
      await expect.poll(() => page.evaluate(() => (window as any).__gum.length), { timeout: 15_000 }).toBeGreaterThan(0);
      const all = await page.evaluate(() => (window as any).__gum);
      expect(all.every((c: any) => !c.video), 'audio-only asked for video').toBe(true);
    });
  });

  test.describe('join meeting', () => {
    // verified: the Join tab asks only for a link/code; the passcode is asked later, in the lobby
    // (wrong-passcode is covered by N10 in numaa-meet.spec.ts)
    test('MEET-F10 unknown meeting code shows a clear error', async () => {
      await modal.getByRole('button', { name: 'Join with Code', exact: true }).click();
      await modal.getByPlaceholder(/numaa-8gf-3y2k/).fill('numaa-zzz-zzzz');
      await modal.getByRole('button', { name: 'Join Meeting' }).click();
      await expect(modal.getByText('Meeting room not found. Please verify your meeting link or code.')).toBeVisible({ timeout: 15_000 });
    });
  });
});
