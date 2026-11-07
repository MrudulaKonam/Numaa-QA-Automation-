import { test as base, expect, Page } from '@playwright/test';

// Shared test fixture: every spec imports { test, expect } from './fixtures'
// instead of '@playwright/test', so all of them get the cookie-banner handler.
//
// numaa.ai shows a cookie consent banner ("We use cookies…" with Cookie
// Settings / Reject / Accept All). Until it's answered, a full-page blurred
// overlay intercepts every click. Accepting stores
// localStorage.cookieConsent = "accepted" (no cookie), and the banner stays
// away for that browser context. Verified live 2026-11-07.

export const acceptCookiesButton = (page: Page) =>
  page.getByRole('button', { name: 'Accept All', exact: true });

// Clicks "Accept All" whenever the banner appears, at any step, before
// Playwright performs an action or runs an auto-waiting assertion.
// Use it directly for pages the `page` fixture doesn't create
// (e.g. browser.newContext().newPage()).
export async function autoAcceptCookies(page: Page) {
  await page.addLocatorHandler(acceptCookiesButton(page), async (btn) => {
    await btn.click();
  });
}

export const test = base.extend({
  page: async ({ page }, use) => {
    await autoAcceptCookies(page);
    await use(page);
  },
});

export { expect };
// Types and other helpers (Page, Browser, Locator, devices...) for specs that import them
export * from '@playwright/test';
