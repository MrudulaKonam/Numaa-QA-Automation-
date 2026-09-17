import { test, expect } from '@playwright/test';
import { gotoPublic } from './helpers';

// Module: AUTH  |  8 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("AUTH - auth", () => {

  // ID: AUTH-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to /login
  // Expected: Email, password, "Forgot Password?", "Continue", Google/Facebook login options all present
  test("AUTH-01: Login page renders required fields", async ({ page }) => {
    await gotoPublic(page, '/login');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Forgot Password?', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'CONTINUE →', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /Login with Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Login with Facebook/i })).toBeVisible();
  });

  // ID: AUTH-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to /signup
  // Expected: Username, email, password, confirm password, social sign-up, and "Already a member? Login" link all present
  test("AUTH-02: Signup page renders required fields", async ({ page }) => {
    await gotoPublic(page, '/signup');
    await expect(page.getByText('UserName *', { exact: true })).toBeVisible();
    await expect(page.locator('input[type="text"]')).toBeVisible();
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toHaveCount(2);
    await expect(page.getByRole('button', { name: /SignUp with Google/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /Sign up with Facebook/i })).toBeVisible();
    await expect(page.getByRole('button', { name: 'LOGIN', exact: true })).toBeVisible();
  });

  // ID: AUTH-03 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Go to /login
  // Steps: 2. Click "Continue" without entering email/password
  // Expected: Inline validation errors, no request sent
  test("AUTH-03: Login with empty fields", async ({ page }) => {
    await gotoPublic(page, '/login');
    const email = page.locator('input[type="email"]');
    const password = page.locator('input[type="password"]');
    await page.getByRole('button', { name: 'CONTINUE →', exact: true }).click();
    await expect(email).toHaveJSProperty('validity.valid', false);
    await expect(password).toHaveJSProperty('validity.valid', false);
  });

  // ID: AUTH-04 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Enter "notanemail" in the email field
  // Steps: 2. Enter any password
  // Steps: 3. Click "Continue"
  // Expected: Inline "invalid email" validation message shown
  test("AUTH-04: Login with invalid email format", async ({ page }) => {
    await gotoPublic(page, '/login');
    await page.locator('input[type="email"]').fill('notanemail');
    await page.locator('input[type="password"]').fill('password');
    await page.getByRole('button', { name: 'CONTINUE →', exact: true }).click();
    await expect(page.getByText("Email can contain only one '@'.", { exact: true })).toBeVisible();
  });

  // ID: AUTH-05 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Enter a valid-format but wrong email/password combo
  // Steps: 2. Click "Continue"
  // Expected: Clear "invalid credentials" error, no account/session details leaked
  test("AUTH-05: Login with incorrect credentials", async ({ page }) => {
    test.skip(!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD, 'Set TEST_EMAIL and TEST_PASSWORD to run credential-dependent tests');
    await gotoPublic(page, '/login');
    await page.locator('input[type="email"]').fill(process.env.TEST_EMAIL!);
    await page.locator('input[type="password"]').fill('definitely-wrong-password');
    await page.getByRole('button', { name: 'CONTINUE →', exact: true }).click();
    await expect(page.getByRole('region', { name: 'Notifications alt+T' })).not.toBeEmpty({ timeout: 3000 });
  });

  // ID: AUTH-06 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Go to /signup
  // Steps: 2. Enter different values in Password and Confirm Password
  // Steps: 3. Submit
  // Expected: Inline validation blocks submission with a clear mismatch error
  test("AUTH-06: Signup with mismatched passwords", async ({ page }) => {
    await gotoPublic(page, '/signup');
    await page.locator('input[type="text"]').fill('Test User');
    await page.locator('input[type="email"]').fill(`mismatch-${Date.now()}@example.com`);
    await page.locator('input[type="password"]').nth(0).fill('Password123!');
    await page.locator('input[type="password"]').nth(1).fill('Different123!');
    await page.getByRole('button', { name: 'START MY FREE TRIAL', exact: true }).click();
    await expect(page.getByText(/passwords? do not match|passwords? must match|password mismatch/i)).toBeVisible();
  });

  // ID: AUTH-07 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Sign up using an email that already has an account
  // Expected: Clear "account already exists" message, suggests logging in instead
  test.skip("AUTH-07: Signup with an already-registered email", async ({ page }) => {
    test.skip(true, 'Requires a controlled, already-registered test account without mutating account state');
  });

  // ID: AUTH-08 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Go to /login
  // Steps: 2. Enter a valid, registered email and correct password
  // Steps: 3. Click "Continue"
  // Expected: User is authenticated and redirected to the Dashboard, session/identity persists on reload
  test("AUTH-08: Login with valid credentials", async ({ page }) => {
    test.skip(!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD, 'Set TEST_EMAIL and TEST_PASSWORD to run authenticated login coverage');
    await gotoPublic(page, '/login');
    const acceptCookies = page.getByRole('button', { name: /accept all/i });
    if (await acceptCookies.isVisible({ timeout: 5000 }).catch(() => false)) {
      await acceptCookies.click();
    }
    await page.locator('input[type="email"]').fill(process.env.TEST_EMAIL!);
    await page.locator('input[type="password"]').fill(process.env.TEST_PASSWORD!);
    const overlay = page.locator('.fixed.inset-0.z-\\[9998\\]');
    if (await overlay.count() > 0) {
      await overlay.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
    await page.getByRole('button', { name: 'CONTINUE →', exact: true }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 20000 });
    await page.reload();
    await expect(page).toHaveURL(/dashboard/, { timeout: 10000 });
  });


});
    test('AUTH-NEW-01: Login with valid credentials redirects to Dashboard', async ({ page }) => {
    test.skip(!process.env.TEST_EMAIL || !process.env.TEST_PASSWORD, 'Set TEST_EMAIL and TEST_PASSWORD to run authenticated tests');
    await page.goto('/login');
        const acceptCookies = page.getByRole('button', { name: /accept all/i });
    if (await acceptCookies.isVisible({ timeout: 5000 }).catch(() => false)) {
      await acceptCookies.click();
    }
    await page.fill('input[type="email"]', process.env.TEST_EMAIL!);
    await page.fill('input[type="password"]', process.env.TEST_PASSWORD!);
    const overlay = page.locator('.fixed.inset-0.z-\\[9998\\]');
    if (await overlay.count() > 0) {
      await overlay.waitFor({ state: 'hidden', timeout: 10000 }).catch(() => {});
    }
    await page.getByRole('button', { name: /continue/i }).click();
    await expect(page).toHaveURL(/dashboard/, { timeout: 20000 });
  });
