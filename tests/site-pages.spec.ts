import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: SITE - public pages linked from the footer that had no coverage
// Built from a walk-through of the live numaa.ai site on 2026-11-05
// (screenshots: .playwright-mcp/screens-2026-11-05/).

test.describe('SITE - footer-linked pages', () => {
  test('SITE-01: Contact Us form renders all fields', async ({ page }) => {
    await gotoPublic(page, '/contact');
    await expect(page.getByRole('heading', { name: 'Send Us a Message', exact: true })).toBeVisible();
    for (const placeholder of ['Enter your name', 'Enter your email', 'Enter your phone number', 'Enter subject', 'Message']) {
      await expect(page.getByPlaceholder(placeholder, { exact: true })).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Submit', exact: true })).toBeVisible();
  });

  test('SITE-02: Privacy Policy renders its numbered sections', async ({ page }) => {
    await gotoPublic(page, '/privacy-policy');
    await expect(page.getByRole('heading', { name: 'Privacy Policy', level: 1 })).toBeVisible();
    for (const section of ['1. Contact Information', '4. AI Features & Medical Disclaimer', '9. Account Deletion', '13. Contact Us']) {
      await expect(page.getByRole('heading', { name: section, exact: true })).toBeVisible();
    }
  });

  test('SITE-03: Terms of Service renders its numbered sections', async ({ page }) => {
    await gotoPublic(page, '/terms-of-service');
    await expect(page.getByRole('heading', { name: 'Terms of Service', level: 1 })).toBeVisible();
    for (const section of ['1. Introduction', '5. Use of AI and User Consent', '8. Limitation of Liability', '11. Contact Information']) {
      await expect(page.getByRole('heading', { name: section, exact: true })).toBeVisible();
    }
  });

  test('SITE-04: FAQ renders search and expandable questions', async ({ page }) => {
    await gotoPublic(page, '/faq');
    await expect(page.getByRole('heading', { name: 'Frequently asked questions', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Search for a question')).toBeVisible();
    for (const q of ['What is NuMaa?', 'Is NuMaa medically accurate?', 'How much does NuMaa cost?']) {
      await expect(page.getByRole('button', { name: q, exact: true })).toBeVisible();
    }
  });

  test('SITE-05: Footer Support links open their pages', async ({ page }) => {
    const pages: [string, string, RegExp][] = [
      ['Contact Us', '/contact', /Send Us a Message/],
      ['Privacy Policy', '/privacy-policy', /Privacy Policy/],
      ['Terms of Service', '/terms-of-service', /Terms of Service/],
      ['FAQs', '/faq', /Frequently asked questions/],
    ];
    for (const [label, url, heading] of pages) {
      await gotoPublic(page, '/');
      await page.getByRole('contentinfo').getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(`${url}$`));
      await expect(page.getByRole('heading', { name: heading, level: 1 })).toBeVisible();
    }
  });

  test('SITE-06: Forgot Password page renders the reset form', async ({ page }) => {
    await gotoPublic(page, '/forgot-password');
    await expect(page.getByRole('heading', { name: 'Forgot Password?', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('johndoe@email.com')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Send Reset Link', exact: true })).toBeVisible();
  });

  test('SITE-07: "Forgot Password?" on the login page opens the reset page', async ({ page }) => {
    await gotoPublic(page, '/login');
    await page.getByRole('button', { name: 'Forgot Password?', exact: true }).click();
    await expect(page).toHaveURL(/\/forgot-password$/);
  });
});
