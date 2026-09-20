import { test, expect } from '@playwright/test';
import { login } from '../helpers';

// Module: GAME  |  11 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("GAME - gamifier", () => {

  // ID: GAME-12 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the left app sidebar on /game-agent
  // Expected: Same sidebar (Dashboard, Calendar, agent shortcuts, etc.) seen on other authenticated pages renders here too
  test("GAME-12: Full authenticated app sidebar renders consistently", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    for (const label of ['Dashboard', 'Calendar', 'Ask NuMaa', 'Mom to Mom', 'Nutrition', 'Mental Health', 'Kick Count Agent', 'Baby Checklist', 'Gamifier', 'Medication', 'Physical Activity', 'Content', 'Journal', 'Shopping Agent', 'Travel Advisor']) {
      await expect(page.getByRole('link', { name: label, exact: true }).or(page.getByRole('button', { name: label, exact: true }))).toBeVisible();
    }
  });

  // ID: GAME-10 | Type: Negative | Severity: Low | Last status: PASS
  // Steps: 1. Scroll the full page looking for a disclaimer, consistent with every other agent page tested (Nutrition, Mental Health, Kick Tracker, Mom to Mom, Baby Checklist all include one)
  // Expected: Some acknowledgment that quiz content is educational/general in nature, consistent with the site's established pattern
  test("GAME-10: Educational content includes an appropriate disclaimer", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    await expect(page.getByText(/Disclaimer: Gamifier Agent provides educational content and motivational support only/i)).toBeVisible();
  });

  // ID: GAME-11 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Check the browser tab title while on /game-agent
  // Expected: Should read something distinct, e.g. "Gamifier | Numaa"
  test("GAME-11: Page <title> is unique to Gamifier", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    await expect(page).toHaveTitle(/Gamifier.*Numaa/i);
  });

  // ID: GAME-04 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Flashcard Assessment"
  // Expected: "Start a quick 3-card practice session..." description and "Start Assessment" button should render
  test("GAME-04: Section renders with description and CTA", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    await expect(page.getByText('Start a quick 3-card practice session', { exact: false })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Start Assessment', exact: true })).toBeVisible();
  });

  // ID: GAME-05 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Click "Start Assessment"
  // Expected: Begins the flashcard session, presenting the first of 3 cards
  test("GAME-05: \"Start Assessment\" launches the 3-card practice session", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    await page.getByRole('button', { name: 'Start Assessment', exact: true }).click();
    await expect(page.getByText(/Daily Flashcards — 3 Questions/i)).toBeVisible();
    await expect(page.getByText(/Why might a healthcare provider recommend prenatal vitamins|What is one way a partner or support person can help|True or False:/i).first()).toBeVisible();
  });

  // ID: GAME-06 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. During an active session, click/flip a card
  // Expected: The answer side of the card displays
  test("GAME-06: Flipping a flashcard reveals its answer", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    await page.getByRole('button', { name: 'Start Assessment', exact: true }).click();
    await page.getByRole('button', { name: /next|flip|show answer|view answer|continue/i }).first().click();
    await expect(page.getByText(/support ongoing nutrient needs|help track symptoms|Emotional changes can be common|Correct answer:/i).first()).toBeVisible();
  });

  // ID: GAME-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to https://numaa.ai/game-agent
  // Expected: "Gamifier Quiz Assessment" heading, description, and Chat button render
  test("GAME-01: Page loads with heading, description, and CTA", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    await expect(page.getByRole('heading', { name: 'Gamifier Quiz Assessment', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /chat/i }).first()).toBeVisible();
  });

  // ID: GAME-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the "Chat" button's accessible name
  // Expected: A descriptive label should be exposed for assistive technology
  test("GAME-02: Chat control has a descriptive accessible name", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    await expect(page.getByRole('button', { name: /chat/i }).first()).toHaveAccessibleName(/chat/i);
  });

  // ID: GAME-08 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Learning Snapshot"
  // Expected: Explanatory copy about the 3-card session and coach should render
  test("GAME-08: \"Learning Snapshot\" section renders", async ({ page }) => {
    await login(page);
    await page.goto('/game-agent');
    await expect(page.getByText('Learning Snapshot', { exact: true })).toBeVisible();
  });

});
