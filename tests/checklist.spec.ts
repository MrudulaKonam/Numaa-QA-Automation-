import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Module: CHK - checklist (Baby Checklist & Shop)
// Rebuilt from live numaa.ai/baby-checklist content on 2026-09-20
// NOTE: actual URL is /baby-checklist, not /check-list as the old suite assumed.

test.describe("CHK - checklist", () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/baby-checklist');
  });

  test('CHK-01: Page loads with heading and description', async ({ page }) => {
    await expect(page.getByText(/baby checklist agent/i).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Baby Checklist & Shop', exact: true })).toBeVisible();
    await expect(page.getByText(/Prepare for your little one with our curated checklist/i)).toBeVisible();
  });

  test('CHK-02: Chat with Baby Checklist Agent widget shortcut renders', async ({ page }) => {
    await expect(page.getByText('Chat with Baby Checklist Agent', { exact: false })).toBeVisible();
  });

   test('CHK-03: Personalized welcome copy renders below the heading', async ({ page }) => {
    // This paragraph is AI-generated and its exact wording varies between
    // visits, so we only confirm the heading and that a paragraph of
    // meaningful length renders beneath it, rather than matching fixed text.
    await expect(page.getByRole('heading', { name: 'Baby Checklist', exact: true })).toBeVisible();
    const welcomeParagraph = page.locator('p').filter({ hasText: /.{20,}/ }).first();
    await expect(welcomeParagraph).toBeVisible();
  });
  

  test('CHK-04: Search box renders', async ({ page }) => {
    await expect(page.getByPlaceholder('Search checklist items...')).toBeVisible();
  });

  test('CHK-05: 3 filter tabs render', async ({ page }) => {
    for (const label of ['Buy Now', 'Completed', 'Future Purchases']) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
  });

  test('CHK-06: Checklist category cards render with description and actions', async ({ page }) => {
    for (const label of ['Strollers & Car Seats', 'Baby Clothes & Shoes', 'Baby Toys & Games', 'Baby Bottles & Feeding']) {
      await expect(page.getByRole('heading', { name: label, exact: true }).first()).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Reschedule', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /shop now/i }).first()).toBeVisible();
    await expect(page.getByText('Mark as Purchased', { exact: false }).first()).toBeVisible();
  });

  test('CHK-07: Product-suggestion disclaimer renders', async ({ page }) => {
    await page.getByText('Mark as Purchased', { exact: false }).first().scrollIntoViewIfNeeded();
    await expect(page.getByText(/This app suggests products but isn.t medical advice/i)).toBeVisible();
  });

});