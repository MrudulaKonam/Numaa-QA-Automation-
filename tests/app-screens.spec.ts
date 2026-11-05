import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Module: APP - signed-in screens that had no coverage
// Built from a walk-through of the live numaa.ai app on 2026-11-05
// (screenshots: .playwright-mcp/screens-2026-11-05/). Each test opens the
// screen the way a user does, from the dashboard sidebar or AI Agents tiles,
// where that's how the screen is reached.

test.describe('APP - signed-in screens', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  // Sidebar tiles are buttons whose accessible name also includes the icon,
  // so match on the visible label text.
  async function openFromSidebar(page: import('@playwright/test').Page, label: string) {
    await page.goto('/dashboard');
    await page.locator('button').filter({ hasText: new RegExp(`^\\s*${label}\\s*$`) }).locator('visible=true').first().click();
  }

  test('APP-01: Calendar opens from the sidebar with views and Add Appointment', async ({ page }) => {
    await openFromSidebar(page, 'Calendar');
    await expect(page).toHaveURL(/\/calendar$/);
    await expect(page.getByRole('heading', { name: 'Calendar Buddy', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Pregnancy Timeline', exact: true })).toBeVisible();
    for (const view of ['Month', 'Week', 'Trimester', '9 Months']) {
      await expect(page.getByRole('button', { name: view, exact: true }).first()).toBeVisible();
    }
    await expect(page.getByRole('button', { name: 'Add Appointment', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Connect Google Calendar', exact: true })).toBeVisible();
  });

  test('APP-02: Your Body & Baby opens from the sidebar with topic cards', async ({ page }) => {
    await openFromSidebar(page, 'Your Body and Baby');
    await expect(page).toHaveURL(/\/your-body-and-baby$/);
    await expect(page.getByRole('heading', { name: 'Your Body & Baby', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Explore pregnancy topics', exact: true })).toBeVisible();
    for (const topic of ['Baby Development', 'Healthy Nutrition', 'Body Changes', 'Sleep & Rest', 'Prenatal Care', 'Labor Preparation']) {
      await expect(page.getByRole('heading', { name: topic, exact: true })).toBeVisible();
    }
  });

  test('APP-03: Essential Testing opens from the sidebar with vitals and tests', async ({ page }) => {
    await openFromSidebar(page, 'Essential Testing');
    await expect(page).toHaveURL(/\/essential-tests$/);
    await expect(page.getByRole('heading', { name: 'Your Vitals, Tracked Daily', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: "Mother's Vitals", exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Essential Tests for You', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Log now', exact: true })).toBeVisible();
  });

  test('APP-04: Preparation for the Baby opens from the sidebar with product search', async ({ page }) => {
    await openFromSidebar(page, 'Preparation for the Baby');
    await expect(page).toHaveURL(/\/preparation$/);
    await expect(page.getByRole('heading', { name: 'Find the Perfect Baby Products', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Search baby bottles, diapers...')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Popular Baby Products', exact: true })).toBeVisible();
  });

  test('APP-05: Message opens from the sidebar with conversation search', async ({ page }) => {
    await openFromSidebar(page, 'Message');
    await expect(page).toHaveURL(/\/mom-to-message$/);
    await expect(page.getByRole('heading', { name: 'Messages', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Search conversations…')).toBeVisible();
  });

  test('APP-06: Send Feedback form renders all fields', async ({ page }) => {
    await page.goto('/send-feedback');
    await expect(page.getByRole('heading', { name: 'Share Your Feedback', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Feedback Form', exact: true })).toBeVisible();
    await expect(page.getByPlaceholder('Sarah Johnson')).toBeVisible();
    await expect(page.getByPlaceholder('sarah@example.com')).toBeVisible();
    await expect(page.getByPlaceholder('Share your experience, suggestions, or concerns...')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Submit Feedback', exact: true })).toBeVisible();
  });

  test('APP-07: Profile shows Personal Information form and section tabs', async ({ page }) => {
    await page.goto('/profile');
    // The page heading is the user's full name once the profile is filled in (or "Profile"
    // when it's empty), so anchor on the Edit Profile button and the section heading instead.
    await expect(page.getByRole('button', { name: 'Edit Profile', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Personal Information', exact: true })).toBeVisible();
    for (const tab of ['Pregnancy Status', 'Lifestyle and Preferences', 'Support System', 'Settings', 'Billing']) {
      await expect(page.getByRole('button', { name: tab, exact: true })).toBeVisible();
    }
    await expect(page.getByPlaceholder('Enter your first name')).toBeVisible();
    await expect(page.getByPlaceholder('Enter your last name')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Save Changes', exact: true })).toBeVisible();
  });

  test('APP-08: Gamifier opens from AI Agents with the quiz assessment', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('button').filter({ hasText: /^\s*Gamifier\s*$/ }).locator('visible=true').first().click();
    await expect(page).toHaveURL(/\/game-agent$/);
    await expect(page).toHaveTitle('Gamifier Agent | Numaa');
    await expect(page.getByRole('heading', { name: 'Gamifier Quiz Assessment', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Flashcard Assessment', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Assessment', exact: true })).toBeVisible();
  });

  test('APP-09: Shopping Partner opens from AI Agents with cart and favorites', async ({ page }) => {
    await page.goto('/dashboard');
    await page.locator('button').filter({ hasText: /^\s*Shopping Partner\s*$/ }).locator('visible=true').first().click();
    await expect(page).toHaveURL(/\/shopping-agent$/);
    await expect(page).toHaveTitle('Shopping Agent | Numaa');
    await expect(page.getByRole('heading', { name: 'Shopping Partner', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Your Cart', exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Favorites', exact: true })).toBeVisible();
  });

  test('APP-10: Every AI Agents tile opens its agent page', async ({ page }) => {
    test.setTimeout(120_000);
    const agents: [string, RegExp][] = [
      ['Ask NuMaa', /\/asknumaa$/],
      ['Mom to Mom', /\/mom-to-mom$/],
      ['Nutrition', /\/nutrition\/?$/],
      ['Wellness', /\/mentalhealth$/],
      ['Count Kicks', /\/baby-kick-tracker$/],
      ['Baby Checklist', /\/baby-checklist$/],
      ['Gamifier', /\/game-agent$/],
      ['Medication Support', /\/medication-agent$/],
      ['NuMaa Fitness', /\/physical-agent$/],
      ['Content', /\/content-agent$/],
      ['Journal', /\/journal-agent$/i],
      ['Shopping Partner', /\/shopping-agent$/],
      ['Travel Advisor', /\/travel-agent\/?$/],
    ];
    for (const [label, url] of agents) {
      await page.goto('/dashboard');
      await page.locator('button').filter({ hasText: new RegExp(`^\\s*${label}\\s*$`) }).locator('visible=true').first().click();
      await expect(page, `${label} tile`).toHaveURL(url);
    }
  });
});
