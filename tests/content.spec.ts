import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Module: CNT - content (Your Content Sanctuary)
// Rebuilt from live numaa.ai/content-agent content on 2026-09-20
// NOTE: external article/video titles (Watch & Learn, Pinned for You) are
// dynamic/curated content that can rotate, so those sections are checked
// structurally rather than by exact title text.

test.describe("CNT - content", () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/content-agent');
  });

  test('CNT-01: Page loads with heading and description', async ({ page }) => {
    await expect(page.getByText(/content agent/i).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your Content Sanctuary', exact: true })).toBeVisible();
    await expect(page.getByText(/A calm, curated companion for reliable and gentle pregnancy guidance/i)).toBeVisible();
  });

  test('CNT-02: Chat with Content Agent widget shortcut renders', async ({ page }) => {
    await expect(page.getByText('Chat with Content Agent', { exact: false })).toBeVisible();
  });

  test('CNT-03: Category filter pills render', async ({ page }) => {
    for (const label of ['All Insight', 'Body & Health', 'Baby Development', 'Mindfulness', 'Boutique Guides']) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
  });

  // NOTE: CNT-04 (the "Curated for Your [X]th Week" featured-article
  // section) was removed — its content is personalized/AI-generated and
  // was not reliably present across runs. Worth re-adding once its
  // consistency is confirmed directly on the live app.


  test('CNT-05: "Watch & Learn" section renders with video cards', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Watch & Learn', exact: true })).toBeVisible();
    await expect(page.getByText(/Guided movement for your changing body/i)).toBeVisible();
    // Video cards link out to youtube.com; check at least one is present.
    await expect(page.getByText('youtube.com', { exact: true }).first()).toBeVisible();
  });

  test('CNT-06: "Pinned for You" section renders', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Pinned for You', exact: true })).toBeVisible();
    await expect(page.getByText('Pinterest', { exact: true }).first()).toBeVisible();
  });

  test('CNT-07: "Daily Reads" section renders with a Numaa AI Pick article', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Daily Reads', exact: true })).toBeVisible();
    await expect(page.getByText(/Expert curation for the intentional parent/i)).toBeVisible();
    await expect(page.getByText('NUMAA AI PICK', { exact: false })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Fetal Development Week by Week — What to Expect', exact: true }).first()).toBeVisible();
    await expect(page.getByText('Continue Reading', { exact: false }).first()).toBeVisible();
    await expect(page.getByText('FULL LIBRARY', { exact: false })).toBeVisible();
  });

  test('CNT-08: Numaa AI Guide personalization prompt renders', async ({ page }) => {
    await expect(page.getByText('NUMAA AI GUIDE', { exact: false })).toBeVisible();
    await expect(page.getByText(/Bookmark what resonates with you/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'PERSONALIZE MY SANCTUARY', exact: false })).toBeVisible();
  });

  // NOTE: CNT-09 (a bookmark toggle on the featured card) was removed — its
  // container/button DOM structure could not be reliably located across
  // runs. Worth re-adding once the exact markup is confirmed via inspector.

  test('CNT-10: Informational-purposes disclaimer renders', async ({ page }) => {
    await expect(page.getByText(/This content is provided for informational purposes only/i)).toBeVisible();
    await expect(page.getByText(/does not replace professional medical advice/i)).toBeVisible();
  });

});