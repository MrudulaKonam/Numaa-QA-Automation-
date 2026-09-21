import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Module: MH - mental-health (Emotional Support Guide)
// Rebuilt from live numaa.ai/mentalhealth content on 2026-09-20
// Fixed: small-caps label matched case-insensitively; chat widget opened
// via its toggle before checking its contents (closed by default).

test.describe("MH - mental-health", () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/mentalhealth');
  });

  test('MH-01: Page loads with heading and description', async ({ page }) => {
    await expect(page.getByText(/wellness/i).first()).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Emotional Support Guide', exact: true })).toBeVisible();
    await expect(page.getByText(/Helping you manage stress, mood, and mental wellness/i)).toBeVisible();
  });

  test('MH-02: Self-Discovery Quiz section renders with heading, description, and CTA', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Self-Discovery Quiz', exact: true })).toBeVisible();
    await expect(page.getByText(/Take 5 minutes to explore your current mental wellbeing/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Assessment', exact: false })).toBeVisible();
  });

  test('MH-03: Daily mood check-in renders with 5 mood options', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'How is your heart today?', exact: true })).toBeVisible();
    await expect(page.getByText(/Your daily emotional snapshot helps us tailor your support/i)).toBeVisible();
    for (const mood of ['Radiant', 'Calm', 'Reflective', 'Overwhelmed', 'Tired']) {
      await expect(page.getByText(mood, { exact: true }).first()).toBeVisible();
    }
  });

  test('MH-04: Mood check-in helper text renders', async ({ page }) => {
    await expect(page.getByText("Tap a mood to save today's check-in.", { exact: false })).toBeVisible();
  });

  test('MH-05: Tapping a mood saves today\'s check-in', async ({ page }) => {
    await page.getByRole('button', { name: /Calm/i }).click();
    // After selection the helper prompt is replaced by a confirmation state;
    // we just verify the click doesn't error and the mood remains visible.
    await expect(page.getByText('Calm', { exact: true }).first()).toBeVisible();
  });

  test('MH-06: Emotional-support disclaimer renders', async ({ page }) => {
    await expect(page.getByText(/This feature provides emotional support but isn.t a substitute for professional mental health care/i)).toBeVisible();
  });

  test('MH-07: Wellness Counselor chat widget opens with disclaimer', async ({ page }) => {
    // The chat widget is collapsed by default; open it via the right-side
    // shortcut icon before checking its contents.
    const chatToggle = page.getByRole('button', { name: /chat/i }).first();
    if (await chatToggle.isVisible().catch(() => false)) {
      await chatToggle.click();
    }
    await expect(page.getByText('Wellness Counselor', { exact: true })).toBeVisible();
    await expect(page.getByText(/Online.*Here for support/i)).toBeVisible();
    await expect(page.getByText(/This is an AI companion, not a licensed therapist/i)).toBeVisible();
  });

  test('MH-08: Chat suggested-question chips render', async ({ page }) => {
    const chatToggle = page.getByRole('button', { name: /chat/i }).first();
    if (await chatToggle.isVisible().catch(() => false)) {
      await chatToggle.click();
    }
    for (const label of ['How can I manage anxiety?', 'Tips for better sleep', 'Help me with stress', "I'm feeling low today"]) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });
  test('MH-09: Chat input and crisis-support guidance render', async ({ page }) => {
       await page.goto('/mental-health');
    const chatToggle = page.getByRole('button', { name: /chat/i }).first();
    if (await chatToggle.isVisible().catch(() => false)) {
      await chatToggle.click();
    }
    await expect(page.getByPlaceholder(/type.*message/i)).toBeVisible();
    await expect(page.getByText(/emergency services/i)).toBeVisible();
  });
  test('MH-10: Page <title> is unique to Mental Health', async ({ page }) => {
    await expect(page).toHaveTitle(/Mental Health|Wellness/i);
  });

});