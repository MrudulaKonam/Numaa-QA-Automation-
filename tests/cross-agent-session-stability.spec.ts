import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Module: SESSION - cross-agent-session-stability
//
// Purpose: reproduce an intermittent bug where switching between agents
// forces the user back to the login page mid-session. Logs in ONCE, then
// bounces across every agent in sequence, doing a small activity where we
// have a confirmed selector, and otherwise just confirming the page body
// rendered. After every navigation, it checks whether the app silently
// logged the user out (redirected to /login or shows a login form).
//
// If a step fails with "Unexpectedly logged out after visiting <agent>",
// that pinpoints which agent transition triggers the forced logout.
//
// NOTE ON PATHS: only Dashboard, Ask NuMaa, Mom to Mom, and Physical
// Activity (Numaa Fitness) have been manually confirmed. The rest are
// best-guess URLs based on button labels — verify each by clicking
// through the app manually and correct any that are wrong. A wrong path
// will 404, which looks like a failure but isn't the logout bug we're
// hunting for. Activities for unconfirmed agents just check the page
// body rendered (a low bar, but avoids false failures from guessed
// selectors while still catching an actual forced logout).

test.describe("SESSION - cross-agent-session-stability", () => {

  const bodyRendered = async (page) => {
    await expect(page.locator('body')).toBeVisible({ timeout: 10000 });
  };

  const agents = [
    // --- Confirmed ---
    {
      label: 'Dashboard',
      path: '/dashboard',
      activity: async (page) => {
        await expect(page.getByText(/hello/i).first()).toBeVisible({ timeout: 10000 });
      },
    },
    {
      label: 'Ask NuMaa',
      path: '/asknumaa',
      activity: async (page) => {
        const input = page.getByPlaceholder('Ask anything...');
        await input.fill('What foods are rich in iron?');
        await page.getByRole('button', { name: 'Send message', exact: true }).click();
        await expect(input).toHaveValue('', { timeout: 5000 });
      },
    },
    {
      label: 'Mom to Mom',
      path: '/mom-to-mom',
      activity: async (page) => {
        const chatButton = page.getByRole('button', { name: /chat/i }).first();
        await chatButton.click();
        await expect(page.getByPlaceholder('Ask me anything...')).toBeVisible({ timeout: 10000 });
      },
    },
    {
      label: 'Numaa Fitness (Physical Activity)',
      path: '/physical-agent',
      activity: async (page) => {
        await expect(page.getByText('Daily Steps', { exact: true })).toBeVisible({ timeout: 10000 });
      },
    },

    // --- Unconfirmed paths — verify these before trusting results ---
    { label: 'Calendar', path: '/calendar', activity: bodyRendered },
    { label: 'Your Body and Baby', path: '/your-body-and-baby', activity: bodyRendered },
    { label: 'Essential Testing', path: '/essential-tests', activity: bodyRendered },
    { label: 'Preparation for the Baby', path: '/preparation-for-the-baby', activity: bodyRendered },
    { label: 'Message', path: '/message', activity: bodyRendered },
    { label: 'Nutrition', path: '/nutrition-agent', activity: bodyRendered },
    { label: 'Wellness', path: '/wellness-agent', activity: bodyRendered },
    { label: 'Kick Count Agent', path: '/kick-count-agent', activity: bodyRendered },
    { label: 'Baby Checklist', path: '/baby-checklist', activity: bodyRendered },
    { label: 'Gamifier Agent', path: '/gamifier-agent', activity: bodyRendered },
    { label: 'Medication Support', path: '/medication-agent', activity: bodyRendered },
    { label: 'Content', path: '/content-agent', activity: bodyRendered },
    { label: 'Journal', path: '/journal', activity: bodyRendered },
    { label: 'Shopping Agent', path: '/shopping-agent', activity: bodyRendered },
    { label: 'Travel Advisor', path: '/travel-agent', activity: bodyRendered },
  ];

  // Detects whether the app has silently logged the user out: either the
  // URL redirected to /login, or a login form is visible on the page.
  async function assertStillLoggedIn(page, afterLabel) {
    const loggedOut =
      page.url().includes('/login') ||
      (await page.getByPlaceholder(/email/i).isVisible().catch(() => false)) ||
      (await page.getByRole('button', { name: /^log in$|^sign in$/i }).isVisible().catch(() => false));

    expect(
      loggedOut,
      `Unexpectedly logged out after visiting "${afterLabel}" (current URL: ${page.url()})`
    ).toBe(false);
  }

  test('SESSION-01: session survives navigating across every agent with an activity on each', async ({ page }) => {
    await login(page);

    for (const agent of agents) {
      await test.step(`Navigate to ${agent.label} and perform activity`, async () => {
        await page.goto(agent.path);
        await assertStillLoggedIn(page, `navigating to ${agent.label}`);

        await agent.activity(page);
        await assertStillLoggedIn(page, `performing activity on ${agent.label}`);
      });
    }
  });

  // Rapid-switch variant: bounces back and forth between several agents
  // repeatedly without pausing on activities, in case the bug is
  // specifically about switching speed/frequency rather than activity.
  test('SESSION-02: session survives rapid back-and-forth agent switching', async ({ page }) => {
    await login(page);

    const pingPong = [
      '/asknumaa',
      '/mom-to-mom',
      '/physical-agent',
      '/nutrition-agent',
      '/baby-checklist',
    ];

    for (let round = 0; round < 3; round++) {
      for (const path of pingPong) {
        await test.step(`Round ${round + 1}: visit ${path}`, async () => {
          await page.goto(path);
          await assertStillLoggedIn(page, `round ${round + 1} visit to ${path}`);
        });
      }
    }
  });

});
