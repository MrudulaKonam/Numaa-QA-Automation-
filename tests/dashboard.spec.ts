import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Module: DASH - dashboard
// Rebuilt from live numaa.ai/dashboard content on 2026-09-20

test.describe("DASH - dashboard", () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/dashboard');
  });

  test('DASH-01: Page loads with personalized welcome heading', async ({ page }) => {
    await expect(page.getByText(/Welcome Mrudula/i)).toBeVisible();
    await expect(page.getByText(/Let's continue your journey/i)).toBeVisible();
  });

  test('DASH-02: Top navigation renders all main links', async ({ page }) => {
    for (const label of ['Home', 'Services', 'Resources', 'About', 'Mom to Mom', 'Ask NuMaa']) {
      await expect(page.getByRole('link', { name: label, exact: true })).toBeVisible();
    }
  });

  test('DASH-03: User profile info renders in sidebar', async ({ page }) => {
    await expect(page.getByText('Hello Mrudula', { exact: true })).toBeVisible();
    await expect(page.getByText(/mrudula\.konam@gmail\.com/i)).toBeVisible();
  });

  test('DASH-04: Sidebar quick-access tiles render', async ({ page }) => {
    for (const label of ['Dashboard', 'Calendar', 'Your Body and Baby', 'Essential Testing', 'Preparation for the Baby', 'Message']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test('DASH-05: Pregnancy journey progress renders with week and due date', async ({ page }) => {
    await expect(page.getByText('YOUR JOURNEY', { exact: true })).toBeVisible();
    await expect(page.getByText(/Week \d+ of 40 Weeks/i)).toBeVisible();
    await expect(page.getByText(/Days to Due Date/i)).toBeVisible();
    for (const label of ['CONCEPTION', 'FIRST TRI', 'SECOND TRI', 'THIRD TRIMESTER', 'BIRTH']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test('DASH-06: Overall Wellness card renders score and metrics', async ({ page }) => {
    await expect(page.getByText('Overall Wellness', { exact: true })).toBeVisible();
    await expect(page.getByText('SCORE', { exact: true })).toBeVisible();
    await expect(page.getByText('WEIGHT TRACKING', { exact: true })).toBeVisible();
    await expect(page.getByText('Physical Health', { exact: true })).toBeVisible();
    await expect(page.getByText('Mental Calm', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Routine', exact: true })).toBeVisible();
  });

  test('DASH-07: Nutrition card renders with meal plan and water intake', async ({ page }) => {
    await expect(page.getByText('Nutrition', { exact: true })).toBeVisible();
    await expect(page.getByText('Day To Day Meals', { exact: false })).toBeVisible();
    await expect(page.getByText("Today's Meal Plan:", { exact: true })).toBeVisible();
    await expect(page.getByText('Calories Target:', { exact: true })).toBeVisible();
    await expect(page.getByText("Water Intake:", { exact: true })).toBeVisible();
  });

  test('DASH-08: Fitness card renders steps and active minutes with quick-add buttons', async ({ page }) => {
    await expect(page.getByText('Fitness', { exact: true })).toBeVisible();
    await expect(page.getByText('Steps :', { exact: true })).toBeVisible();
    await expect(page.getByText('Active Minutes :', { exact: true })).toBeVisible();
    for (const label of ['+10 min', '+15 min', '+30 min']) {
      await expect(page.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
  });

  test('DASH-09: To-Do List renders with default tasks and Add Task control', async ({ page }) => {
    await expect(page.getByText('To - Do List', { exact: false })).toBeVisible();
    for (const label of ['Take Prenatal Vitamin', 'Drink 8 glasses of Water', 'Eat Healthy Breakfast', "Log Today's Meal", 'Take a 15-min Walk']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
    await expect(page.getByText('Add Task', { exact: true })).toBeVisible();
    await expect(page.getByText('View All', { exact: false })).toBeVisible();
  });

  test('DASH-10: Appointments & Medications section renders upcoming items', async ({ page }) => {
    await expect(page.getByText('Appointments & Medications', { exact: true })).toBeVisible();
    await expect(page.getByText('OB/GYN Checkup', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Manage Full Calendar', { exact: false })).toBeVisible();
  });

  test('DASH-11: AI Support panel lists all agent shortcuts', async ({ page }) => {
    await expect(page.getByText('AI Support', { exact: true })).toBeVisible();
    for (const label of ['Ask NuMaa', 'Nutrition Agent', 'Physical Activity Agent', 'Wellness', 'Kick Count Agent', 'Shopping Agent', 'Travel Advisor']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test('DASH-12: Baby Movements card renders with tracker and counts', async ({ page }) => {
    await expect(page.getByText('Baby Movements', { exact: true })).toBeVisible();
    await expect(page.getByText('Open Tracker', { exact: false })).toBeVisible();
    await expect(page.getByText('TOTAL MOVEMENTS LOGGED TODAY', { exact: true })).toBeVisible();
    for (const label of ['Kicks : 0', 'Hiccups : 0', 'Rolls : 0']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

  test('DASH-13: Support Network card renders with add-provider prompt', async ({ page }) => {
    await expect(page.getByText('Your Support Network', { exact: true })).toBeVisible();
    await expect(page.getByText('Add Healthcare Provider', { exact: false })).toBeVisible();
  });

  test('DASH-14: Suggested Readings renders 4 article cards', async ({ page }) => {
    await expect(page.getByText('Suggested Readings', { exact: true })).toBeVisible();
    for (const title of ['Safe Yoga Poses for Your Third Trimester', 'The Iron-Rich Superfoods Every Mom Needs', 'Sustainable Nursery Essential: A Checklist', 'Better Sleep Strategies During Pregnancy']) {
      await expect(page.getByText(title, { exact: true })).toBeVisible();
    }
    await expect(page.getByText('View All Library', { exact: true })).toBeVisible();
  });

});