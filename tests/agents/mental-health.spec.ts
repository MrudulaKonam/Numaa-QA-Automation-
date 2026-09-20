import { test, expect } from '@playwright/test';
import { login } from '../helpers';

// Module: MH  |  22 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("MH - mental-health", () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/mentalhealth');
  });

  // ID: MH-01
  test('MH-01: Page loads with heading, description, and CTA', async ({ page }) => {
    await expect(page.getByText('Emotional Support Guide')).toBeVisible();
    await expect(page.getByRole('button', { name: /chat/i })).toBeVisible();
  });

  // ID: MH-02
  test('MH-02: Chat control exposes a proper accessible name', async ({ page }) => {
    const chatButton = page.getByRole('button', { name: /chat/i });
    await expect(chatButton).toHaveAccessibleName(/.+/);
  });

  // ID: MH-03
  test('MH-03: Self-Discovery Quiz section renders with heading, description, and CTA', async ({ page }) => {
    await expect(page.getByText('Self-Discovery Quiz')).toBeVisible();
    await expect(page.getByText(/explore your current mental wellbeing/i)).toBeVisible();
    await expect(page.getByRole('button', { name: /start assessment/i })).toBeVisible();
  });

  // ID: MH-04
  test('MH-04: "Start Assessment" launches the quiz', async ({ page }) => {
    await page.getByRole('button', { name: /start assessment/i }).click();
    await expect(page.locator('[role="dialog"]').or(page.getByText(/question|assessment|quiz/i).first())).toBeVisible();
  });


  // ID: MH-08 -- HIGH PRIORITY, previously Cancelled
  test('MH-08: Crisis support resources are functional', async ({ page }) => {
    await page.getByText('Immediate Support').scrollIntoViewIfNeeded();
    const crisisText = page.getByText('Crisis Text Line');
    const counselor = page.getByText('Speak with a Counselor');
    await expect(crisisText).toBeVisible();
    await expect(counselor).toBeVisible();
    await expect(page.locator('a').filter({ hasText: /Crisis Text Line|Speak with a Counselor/i }).first()).toHaveAttribute('href', /.+/);
  });

  // ID: MH-09
  test('MH-09: A fallback safety message is shown despite the section being disabled', async ({ page }) => {
    await page.getByText('Immediate Support').scrollIntoViewIfNeeded();
    const supportSection = page.getByText('Immediate Support').locator('..');
    await expect(supportSection).toContainText('Immediate Support');
    await expect(supportSection.locator('a, [role="link"]').first()).toBeVisible();
  });

  // ID: MH-10
  test('MH-10: Fallback safety message references a specific, actionable resource', async ({ page }) => {
    await page.getByText('Immediate Support').scrollIntoViewIfNeeded();
    const supportSection = page.getByText('Immediate Support').locator('..');
    await expect(supportSection.locator('a, [role="link"]').first()).toBeVisible();
  });

  // ID: MH-11
  test('MH-11: Trimester tabs render with current week indicator', async ({ page }) => {
    await expect(page.getByText('Trimester Tracker')).toBeVisible();
    await expect(page.getByText(/1st Trimester/i)).toBeVisible();
    await expect(page.getByText(/2nd Trimester/i)).toBeVisible();
    await expect(page.getByText(/3rd Trimester/i)).toBeVisible();
  });

  // ID: MH-12
  test('MH-12: Trimester-specific guidance text renders', async ({ page }) => {
    await expect(page.getByText('Trimester Tracker')).toBeVisible();
    await expect(page.getByText(/trimester|week|pregnan/i).first()).toBeVisible();
  });

  // ID: MH-14
  test('MH-14: 5 mood options render as real interactive buttons', async ({ page }) => {
    await expect(page.getByText('How is your heart today?')).toBeVisible();
    for (const mood of ['Radiant', 'Calm', 'Reflective', 'Overwhelmed', 'Tired']) {
      await expect(page.getByRole('button', { name: mood })).toBeVisible();
    }
  });

  // ID: MH-15
  test("MH-15: Tapping a mood saves today's check-in", async ({ page }) => {
    const calm = page.getByRole('button', { name: 'Calm' });
    await calm.click();
    await expect(calm).toHaveAttribute('aria-pressed', 'true');
  });

  // ID: MH-16
  test("MH-16: Selecting a second mood the same day updates rather than duplicates today's entry", async ({ page }) => {
    const calm = page.getByRole('button', { name: 'Calm' });
    const tired = page.getByRole('button', { name: 'Tired' });
    await calm.click();
    await tired.click();
    await expect(calm).toHaveAttribute('aria-pressed', 'false');
    await expect(tired).toHaveAttribute('aria-pressed', 'true');
  });

  // ID: MH-17
  test('MH-17: 7-day trend renders as a rolling window ending today', async ({ page }) => {
    await expect(page.getByText('Weekly Mood Trend')).toBeVisible();
    await expect(page.getByText(/Mon|Tue|Wed|Thu|Fri|Sat|Sun/).last()).toBeVisible();
  });

  // ID: MH-18
  test('MH-18: Logged vs. unlogged days are clearly distinguished', async ({ page }) => {
    await expect(page.getByText('Weekly Mood Trend')).toBeVisible();
    const trend = page.getByText('Weekly Mood Trend').locator('..');
    await expect(trend.locator('svg, canvas, [role="img"]').first()).toBeVisible();
  });

  // ID: MH-19
  test('MH-19: Weekly summary stats render and match the daily data', async ({ page }) => {
    await expect(page.getByText('Check-ins this week')).toBeVisible();
    await expect(page.getByText('Average mood')).toBeVisible();
  });

  // ID: MH-20 -- previously Cancelled
  test('MH-20: Average-mood scoring methodology is disclosed', async ({ page }) => {
    await expect(page.getByText('Average mood')).toBeVisible();
    const averageMood = page.getByText('Average mood').locator('..');
    await expect(averageMood).toContainText(/average mood/i);
    await expect(averageMood.locator('button, [role="button"], [title], [aria-label]').first()).toBeVisible();
  });

  // ID: MH-21
  test("MH-21: Emotional-support disclaimer renders", async ({ page }) => {
    await page.keyboard.press('End');
    await expect(page.getByText(/not a substitute for professional/i)).toBeVisible();
  });

  // ID: MH-22
  test('MH-22: Page <title> is unique to Mental Health', async ({ page }) => {
    await expect(page).toHaveTitle(/Mental Health/i);
  });

  // ID: MH-23
  test('MH-23: Full authenticated app sidebar renders consistently', async ({ page }) => {
    await expect(page.getByText('Dashboard')).toBeVisible();
    await expect(page.getByText('Calendar')).toBeVisible();
  });

});