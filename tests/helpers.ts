import { expect, Page, test } from '@playwright/test';

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

export async function login(page: Page): Promise<boolean> {
  requireCredentials();

  const email = process.env.TEST_EMAIL;
  const password = process.env.TEST_PASSWORD;

  await gotoPublic(page, '/login');
  await page.locator('input[type="email"]').fill(email!);
  await page.locator('input[type="password"]').fill(password!);
  await page.getByRole('button', { name: /continue/i }).click();
  await expect(page).toHaveURL(/dashboard/, { timeout: 20000 });
  await dismissCookieBanner(page);
  return true;
}