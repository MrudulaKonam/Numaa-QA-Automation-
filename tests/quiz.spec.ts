import { test, expect } from '@playwright/test';
import { gotoPublic, requireLiveFeature } from './helpers';

// Module: QUIZ  |  4 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("QUIZ - quiz", () => {

  // ID: QUIZ-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the 4-bullet benefits list below the quiz cards
  // Expected: 4 benefit statements render (self-paced, progress tracking, evidence-based, engaging)
  test("QUIZ-02: \"Why Take Our Quizzes?\" benefits render", async ({ page }) => {
    await gotoPublic(page, '/services');
    await expect(page.getByRole('heading', { name: 'Why Take Our Quizzes?', exact: true })).toBeVisible();
    for (const label of ['Learn at your own pace with instant feedback', 'Track your progress and knowledge growth', 'Access evidence-based information from medical experts', 'Fun and engaging way to build confidence']) {
      await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
  });

});
