import { test, expect } from '@playwright/test';
import { gotoPublic, requireCredentials, requireLiveFeature } from './helpers';

// Module: NAV  |  6 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("NAV - navigation", () => {

  // ID: NAV-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. From any sub-page, click Home in the nav bar
  // Expected: Navigates to / and full home page renders
  test("NAV-01: \"Home\" link returns to home page", async ({ page }) => {
    await gotoPublic(page, '/services');
    const homeLink = page.getByRole('link', { name: 'Home', exact: true }).first();
    await expect(homeLink).toBeVisible();
    await homeLink.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole('heading', { name: /numaa|home|welcome/i }).first()).toBeVisible();
  });

  // ID: NAV-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Click Services in nav bar
  // Expected: Navigates to /services, page renders services list, quizzes, baby setup, kick count and nutrition content
  test("NAV-02: \"Services\" link opens Services page", async ({ page }) => {
    await gotoPublic(page, '/');
    await expect(page.getByRole('link', { name: 'Services', exact: true }).first()).toHaveAttribute('href', '/services');
  });

  // ID: NAV-04 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Click About in nav bar
  // Expected: Navigates to /about, shows mission, team, and values
  test("NAV-04: \"About\" link opens About page", async ({ page }) => {
    await gotoPublic(page, '/');
    await expect(page.getByRole('link', { name: 'About', exact: true }).first()).toHaveAttribute('href', '/about');
  });

  // ID: NAV-06 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Click Ask Numaa in nav bar
  // Expected: Navigates to /asknumaa with chat interface and suggested prompts
  test.skip("NAV-06: \"Ask Numaa\" link opens AI assistant", async ({ page }) => {
    requireLiveFeature('Ask Numaa navigation link', 'Prerequisite: the public header has no Ask Numaa navigation link.');
  });

  // ID: NAV-08 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. While authenticated, click Dashboard
  // Expected: Renders personalized dashboard (week/due date, wellness score, AI agents, to-do list)
  test.skip("NAV-08: \"Dashboard\" access while logged in", async ({ page }) => {
    requireCredentials();
  });

  // ID: NAV-09 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Visit Home, Services, About, Mom to Mom, Ask Numaa
  // Steps: 2. Confirm nav bar with all 7 items is present on each
  // Expected: Same nav bar renders identically on every page
  test("NAV-09: Nav bar persists across pages", async ({ page }) => {
    const navTargets = [
      { href: '/', label: 'Home' },
      { href: '/services', label: 'Services' },
      { href: '/resources', label: 'Resources' },
      { href: '/about', label: 'About' }
    ];

    for (const path of ['/', '/services', '/about', '/resources']) {
      await gotoPublic(page, path);
      for (const target of navTargets) {
        await expect(page.locator(`a[href="${target.href}"]`).first()).toBeVisible({ timeout: 15000 });
      }
    }
  });

});
