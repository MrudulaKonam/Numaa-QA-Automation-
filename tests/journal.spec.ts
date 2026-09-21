import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Module: JRN - journal (Story Companion)
// Rebuilt from live numaa.ai/journal-agent content on 2026-09-20
// Fixed: small-caps labels matched case-insensitively (CSS text-transform),
// and apostrophe-containing phrases matched by substring to avoid
// straight-quote vs curly-quote mismatches.

test.describe("JRN - journal", () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/journal-agent');
  });

  test('JRN-01: Page loads with heading and description', async ({ page }) => {
    await expect(page.getByText(/journal agent/i).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Story Companion', exact: true })).toBeVisible();
    await expect(page.getByText(/Document your journey, one moment at a time/i)).toBeVisible();
  });

  test('JRN-02: Chat with Journal Agent widget shortcut renders', async ({ page }) => {
    await expect(page.getByText(/chat with journal agent/i)).toBeVisible();
  });

  test('JRN-03: Quick Actions render with all 4 entry types', async ({ page }) => {
    await expect(page.getByText(/quick actions/i)).toBeVisible();
    for (const label of ['ADD PHOTO', 'ADD VIDEO', 'ADD TEXT DOC', 'ADD NOTES']) {
      await expect(page.getByText(new RegExp(label, 'i'))).toBeVisible();
    }
  });

  test('JRN-04: Existing journal entry renders with date, title, and image', async ({ page }) => {
    await expect(page.getByText(/\d{2}\/\d{2}\/\d{4}/).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Fluttering Life', exact: true })).toBeVisible();
  });

  test('JRN-05: Journal entry card renders full content (image, caption, entry body)', async ({ page }) => {
    // Caption/tip wording is tied to specific entries and can rotate, so we
    // verify the entry card structurally renders complete content (image
    // plus surrounding text) rather than matching fixed wording.
    const entryCard = page.getByRole('heading', { name: 'Fluttering Life', exact: true }).locator('..').locator('..');
    await expect(entryCard.locator('img, video').first()).toBeVisible();
    await expect(entryCard.locator('p').first()).toBeVisible();
  });

  test('JRN-07: New Entry / Today\'s Reflection section renders with a prompt question', async ({ page }) => {
    await expect(page.getByText(/new entry/i)).toBeVisible();
    await expect(page.getByRole('heading', { name: "Today's Reflection", exact: true })).toBeVisible();
    await expect(page.getByText(/one small hope you have for your little one today/i).first()).toBeVisible();
  });

  test('JRN-08: Save Journal Entry button renders', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Save Journal Entry', exact: true })).toBeVisible();
  });

  test('JRN-09: General-advice disclaimer renders', async ({ page }) => {
    await page.getByRole('button', { name: 'Save Journal Entry', exact: true }).scrollIntoViewIfNeeded();
    await expect(page.getByText(/This feature gives general advice but isn.t a substitute for professional medical guidance/i)).toBeVisible();
  });

  test('JRN-10: "Select a day" date picker renders with helper text', async ({ page }) => {
    await page.getByText(/select a day/i).scrollIntoViewIfNeeded();
    await expect(page.getByText(/select a day/i)).toBeVisible();
    await expect(page.getByText(/Choose today or an earlier date to view journal entries/i)).toBeVisible();
  });

});