import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Module: KICK - kick-counter (Baby Movement Tracker)
// Rebuilt from live numaa.ai/baby-kick-tracker content on 2026-09-20

test.describe("KICK - kick-counter", () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/baby-kick-tracker');
  });

  test('KICK-01: Page loads with heading and description', async ({ page }) => {
    await expect(page.getByText('KICK COUNT AGENT', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Baby Movement Tracker', exact: true })).toBeVisible();
    await expect(page.getByText(/Track kicks, review movement patterns/i)).toBeVisible();
  });

  test('KICK-02: Today section renders with current date', async ({ page }) => {
    await expect(page.getByText('Today', { exact: true })).toBeVisible();
    await expect(page.getByText(/\w+ \d{1,2}, \d{4}/)).toBeVisible();
  });

  test('KICK-03: Total Kicks Today counter and View History link render', async ({ page }) => {
    await expect(page.getByText('Total Kicks Today', { exact: true })).toBeVisible();
    await expect(page.getByText('View History', { exact: false })).toBeVisible();
  });

  test('KICK-04: Kick Count Summary renders with empty-state message', async ({ page }) => {
    await expect(page.getByText('Your Kick Count Summary', { exact: true })).toBeVisible();
    await expect(page.getByText(/No kicks recorded yet/i)).toBeVisible();
  });

  test('KICK-05: Start Session button renders', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Start Session', exact: true })).toBeVisible();
  });

  test('KICK-06: Kick Types Distribution chart renders with range toggle', async ({ page }) => {
    const section = page.getByText('Kick Types Distribution', { exact: true }).locator('..');
    await expect(page.getByText('Kick Types Distribution', { exact: true })).toBeVisible();
    for (const label of ['Day', 'Week', 'Month']) {
      await expect(section.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
    await expect(page.getByText('Nothing to plot yet', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('Record a kick to see movement types here.', { exact: true })).toBeVisible();
  });

  test('KICK-07: Daily Kick Count chart renders with range toggle', async ({ page }) => {
    const section = page.getByText('Daily Kick Count', { exact: true }).locator('..');
    await expect(page.getByText('Daily Kick Count', { exact: true })).toBeVisible();
    for (const label of ['Day', 'Week', 'Month']) {
      await expect(section.getByRole('button', { name: label, exact: true })).toBeVisible();
    }
    await expect(page.getByText('Nothing to plot yet', { exact: true }).last()).toBeVisible();
    await expect(page.getByText('Record a kick to see daily activity here.', { exact: true })).toBeVisible();
  });

  test('KICK-08: Not-a-medical-device disclaimer renders', async ({ page }) => {
    await expect(page.getByText(/This app is not a medical device/i)).toBeVisible();
    await expect(page.getByText(/contact your healthcare provider immediately/i)).toBeVisible();
  });

  test('KICK-09: Kick Count Agent chat widget shortcut renders', async ({ page }) => {
    await expect(page.getByText('Chat', { exact: true })).toBeVisible();
  });

});