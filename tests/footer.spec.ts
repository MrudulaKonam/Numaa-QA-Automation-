import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: FTR  |  5 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("FTR - footer", () => {

  // ID: FTR-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Scroll to page bottom
  // Expected: Logo, tagline, and (c) 2026 Numaa(R) copyright line visible
  test("FTR-01: Footer company info renders", async ({ page }) => {
    await gotoPublic(page, '/');
    await expect(page.getByRole('contentinfo')).toContainText('NuMaa');
    await expect(page.getByRole('contentinfo')).toContainText('Personalized AI-powered pregnancy care');
    await expect(page.getByRole('contentinfo')).toContainText('© 2026 NuMaa');
  });

  // ID: FTR-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Click Home, About Us, Services links in footer
  // Expected: Each link navigates to the corresponding page
  test("FTR-02: Footer \"Company\" links resolve", async ({ page }) => {
    await gotoPublic(page, '/');
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('link', { name: 'Home', exact: true })).toHaveAttribute('href', '/');
    await expect(footer.getByRole('link', { name: 'About Us', exact: true })).toHaveAttribute('href', '/about');
    await expect(footer.getByRole('link', { name: 'Services', exact: true })).toHaveAttribute('href', '/services');
  });

  // ID: FTR-03 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Explore" column
  // Expected: Meal Plans, Mental Wellness, Kick Tracker, Pregnancy Calendar links listed
  test("FTR-03: Footer \"Explore\" section renders", async ({ page }) => {
    await gotoPublic(page, '/');
    const footer = page.getByRole('contentinfo');
    for (const label of ['Meal Plans', 'Mental Wellness', 'Kick Tracker', 'Pregnancy Calendar']) {
      await expect(footer.getByRole('button', { name: label })).toBeVisible();
    }
  });

  // ID: FTR-04 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Click each Support link
  // Expected: Each resolves to a real, populated page
  test("FTR-04: Footer \"Support\" links (Contact Us, Privacy Policy, Terms of Service, FAQs)", async ({ page }) => {
    await gotoPublic(page, '/');
    const footer = page.getByRole('contentinfo');
    for (const label of ['Contact Us', 'Privacy Policy', 'Terms of Service', 'FAQs']) {
      await expect(footer.getByRole('link', { name: label })).toHaveAttribute('href', /\/.+/);
    }
  });

  // ID: FTR-06 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the "JOIN US" column in the footer
  // Expected: Should contain social links, a newsletter signup, or similar join-related content matching the other three columns
  test("FTR-06: \"JOIN US\" footer section is incomplete", async ({ page }) => {
    await gotoPublic(page, '/');
    const footer = page.getByRole('contentinfo');
    await expect(footer.getByRole('heading', { name: 'Join Us' })).toBeVisible();
    await expect(footer.getByRole('link', { name: /NuMaa on (YouTube|Facebook|LinkedIn|Instagram)/ })).toHaveCount(4);
  });

});
