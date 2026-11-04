import { BrowserContext, expect, Page, test } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

export function hasCredentials(): boolean {
  return Boolean(process.env.TEST_EMAIL && process.env.TEST_PASSWORD);
}

export function requireCredentials(): void {
  test.skip(!hasCredentials(), 'Set TEST_EMAIL and TEST_PASSWORD to run authenticated tests; this flow requires a real Numaa account');
}

export function requireBrowserPermission(feature: string, reason?: string): void {
  test.skip(true, reason ?? `Requires browser ${feature} permissions and a live interactive session`);
}

export function requireLiveFeature(feature: string, reason?: string): void {
  test.skip(true, reason ?? `Requires the live ${feature} feature in the current environment`);
}

export async function dismissCookieBanner(page: Page) {
  const acceptCookies = page.getByRole('button', { name: 'Accept All', exact: true });
  if (await acceptCookies.isVisible({ timeout: 3000 }).catch(() => false)) {
    await acceptCookies.click();
  }
}

export async function gotoPublic(page: Page, path: string) {
  await page.goto(path, { waitUntil: 'domcontentloaded' });
  await page.locator('body').waitFor({ state: 'visible' });
  await dismissCookieBanner(page);
}

// numaa.ai allows one active session per account, and logging in for every
// test floods the login API (it starts returning 503). So the first test in
// each spec file logs in through the UI and saves the context's storageState;
// later tests in that file reuse it. Auth lives in localStorage
// (token / refreshToken), which storageState captures.
//
// The state is saved to disk, not memory, because Playwright starts a new
// worker after every failed test. It goes under the output dir
// (test-results/), which Playwright empties at the start of each run.
type StorageState = Awaited<ReturnType<BrowserContext['storageState']>>;

function sessionFile(): string {
  const info = test.info();
  return path.join(info.project.outputDir, '.auth', `${path.basename(info.file)}.json`);
}

function savedSession(): StorageState | undefined {
  try {
    return JSON.parse(fs.readFileSync(sessionFile(), 'utf8'));
  } catch {
    return undefined;
  }
}

// The access token in localStorage is a JWT that expires 10 minutes after
// login, and the saved refreshToken goes stale once the app refreshes it. The
// dashboard URL can't tell us whether a saved session still works, because
// numaa.ai shows the dashboard even when logged out. So before reusing a saved
// session, check the token: it must have at least 2 minutes left, and the
// server must accept it on an authenticated endpoint (this also catches a
// session ended by a login elsewhere, since one session per account is allowed).
const MIN_TOKEN_LIFE_MS = 2 * 60 * 1000;

async function sessionIsValid(page: Page, state: StorageState): Promise<boolean> {
  const token = state.origins
    .flatMap((o) => o.localStorage)
    .find((item) => item.name === 'token')?.value;
  if (!token) return false;
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64url').toString('utf8'));
    if (typeof payload.exp !== 'number' || payload.exp * 1000 - Date.now() < MIN_TOKEN_LIFE_MS) return false;
  } catch {
    return false;
  }
  const res = await page.request.get('/chat/notifications', {
    headers: { Authorization: `Bearer ${token}` },
    failOnStatusCode: false,
  });
  return res.ok();
}

async function restoreSession(page: Page, state: StorageState): Promise<boolean> {
  await page.context().addCookies(state.cookies);
  // localStorage can only be written from a page on the same origin
  await gotoPublic(page, '/login');
  await page.evaluate((origins) => {
    const saved = origins.find((o) => o.origin === location.origin);
    for (const { name, value } of saved?.localStorage ?? []) localStorage.setItem(name, value);
  }, state.origins);
  await page.goto('/dashboard');
  return page.waitForURL(/dashboard/, { timeout: 10000 }).then(() => true, () => false);
}

export async function login(page: Page): Promise<boolean> {
  requireCredentials();

  const saved = savedSession();
  if (saved && await sessionIsValid(page, saved) && await restoreSession(page, saved)) {
    await dismissCookieBanner(page);
    return true;
  }

  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  await gotoPublic(page, '/login');
  await page.locator('input[type="email"]').fill(email!);
  await page.locator('input[type="password"]').fill(password!);
  await page.getByRole('button', { name: /continue/i }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 20000 });
  await dismissCookieBanner(page);
  fs.mkdirSync(path.dirname(sessionFile()), { recursive: true });
  await page.context().storageState({ path: sessionFile() });
  return true;
}