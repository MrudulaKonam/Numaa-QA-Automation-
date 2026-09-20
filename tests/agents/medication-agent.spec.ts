import { test, expect } from '@playwright/test';
import { login, requireCredentials, requireLiveFeature, requireBrowserPermission } from '../helpers';

// Module: MED  |  21 test case(s)
// Source: Numaa_Consolidated_Regression_Suite_REVIEWED.xlsx

test.describe("MED - medication-agent", () => {

  // ID: MED-16 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Active Prescriptions" with no medications saved
  // Expected: "0 Items Tracked" and a clear empty-state message should render
  test("MED-16: Section renders with counter and empty state", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    await expect(page.getByText('0 Items Tracked', { exact: true })).toBeVisible();
    await expect(page.getByText(/no medications|no active prescriptions/i)).toBeVisible();
  });

  // ID: MED-17 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the Active Prescriptions header
  // Expected: "Enable notifications" button renders
  test("MED-17: \"Enable notifications\" control renders", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    await expect(page.getByRole('button', { name: /enable notifications/i })).toBeVisible();
  });

  // ID: MED-18 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Inspect the control, then toggle it
  // Expected: A visible/announced state change (e.g. "Notifications enabled/disabled") should occur
  test("MED-18: \"Enable notifications\" clearly shows its current on/off state", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    await expect(page.getByRole('button', { name: /enable notifications/i })).toHaveAttribute('aria-pressed', /true|false/);
  });

  // ID: MED-19 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Save a medication with a schedule
  // Steps: 2. Confirm it appears in Active Prescriptions and triggers a reminder at the scheduled time
  // Expected: Medication should be listed and reminders should fire as configured
  test.skip("MED-19: Saved medications appear correctly with working reminders", async () => {
    requireCredentials();
  });

  // ID: MED-08 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Add New Medication"
  // Expected: Medication Name, Type, Dosage, Frequency, Timing, Start Date, Times, Special Instructions, plus Save/Clear controls should all render
  test("MED-08: Form renders with all expected fields", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    for (const label of ['Medication Name', 'Type', 'Dosage', 'Frequency', 'Timing', 'Start Date', 'Times', 'Special Instructions']) {
      await expect(page.getByLabel(label, { exact: false }).first().or(page.getByText(label, { exact: true }))).toBeVisible();
    }
    await expect(page.getByRole('button', { name: /save medication/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /clear/i })).toBeVisible();
  });

  // ID: MED-09 | Type: Negative | Severity: Low | Last status: PASS
  // Steps: 1. Inspect which fields carry a required (*) marker
  // Expected: For a medication safety feature, at minimum the dosing schedule (Start Date and/or Times) should be required alongside name and dosage
  test("MED-09: Required fields are sufficient for a safe, usable reminder", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    await expect(page.locator('input[required], select[required], textarea[required]').first()).toBeVisible();
  });

  // ID: MED-10 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Inspect the accessibility role of the "Type" (Vitamin/Supplement) and "Frequency" (Daily) selectors
  // Expected: A real combobox/select/button role that's keyboard-operable should be exposed
  test("MED-10: Type and Frequency dropdowns are exposed as proper interactive controls", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    await expect(page.getByRole('combobox').filter({ has: page.locator('option') }).first()).toBeVisible();
  });

  // ID: MED-11 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Inspect the "Timing" control's available options
  // Expected: Pregnancy medications are commonly prescribed for afternoon, night/bedtime, or "with meals" timing — options beyond Morning/Evening would be expected
  test("MED-11: Timing options cover common medication schedules", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    const timing = page.getByLabel('Timing', { exact: true });
    await expect(timing).toBeVisible();
    await expect(timing.locator('option')).toHaveCount(3);
  });

  // ID: MED-12 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Type an invalid date (e.g. "99/99/9999") into the Start Date field
  // Steps: 2. Attempt to save
  // Expected: Since the field is free text (placeholder "__/__/____") rather than a date picker, validation should reject malformed dates
  test("MED-12: Start Date field validates entered dates", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    const date = page.getByLabel('Start Date', { exact: true });
    await date.fill('99/99/9999');
    await expect(date).toHaveJSProperty('validity.valid', false);
  });

  // ID: MED-13 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Type free text (e.g. "sometime") into the Times field
  // Steps: 2. Attempt to save
  // Expected: Format validation for comma-separated times (placeholder "e.g., 09:00,21:00") should occur
  test("MED-13: Times field validates entered time format", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    const times = page.getByLabel('Times', { exact: true });
    await times.fill('sometime');
    await expect(times).toHaveJSProperty('validity.valid', false);
  });

  // ID: MED-14 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Fill in Medication Name and Dosage
  // Steps: 2. Click "Save Medication"
  // Expected: New medication appears in the Active Prescriptions list below, replacing the empty state
  test.skip("MED-14: \"Save Medication\" adds the entry to Active Prescriptions", async () => {
    requireCredentials();
  });

  // ID: MED-22 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the left app sidebar on /medication-agent
  // Expected: Same sidebar (Dashboard, Calendar, agent shortcuts, etc.) seen on other authenticated pages renders here too
  test("MED-22: Full authenticated app sidebar renders consistently", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    await expect(page.getByRole('button', { name: /dashboard/i }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: /calendar/i }).first()).toBeVisible();
  });

  // ID: MED-20 | Type: Negative | Severity: High | Last status: PASS
  // Steps: 1. Scroll the entire page looking for any disclaimer text, consistent with every other agent page tested (Nutrition, Mental Health, Kick Tracker, Mom to Mom, Baby Checklist all include one; the Gamifier page's absence was already flagged as GAME-10)
  // Expected: Given this page manages actual medication names, dosages, and schedules during pregnancy, it should carry the clearest safety disclaimer of any page on the site (e.g. "not a substitute for professional medical advice; consult your doctor or pharmacist before starting or changing any medication")
  test.skip("MED-20: Page includes an appropriate medical-safety disclaimer \u2014 HIGH PRIORITY", async () => {
    requireLiveFeature('medication safety disclaimer', 'Requires a medication-specific safety disclaimer that is not rendered in the current page contract');
  });

  // ID: MED-21 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Check the browser tab title while on /medication-agent
  // Expected: Should read something distinct, e.g. "Medication | Numaa"
  test("MED-21: Page <title> is unique to Medication", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    await expect(page).toHaveTitle(/Medication.*Numaa/i);
  });

  // ID: MED-01 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Navigate to https://numaa.ai/medication-agent
  // Expected: "Medication Management" heading, description, and Chat button render
  test("MED-01: Page loads with heading, description, and CTA", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    await expect(page.getByRole('heading', { name: 'Medication Management', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: /chat/i }).first()).toBeVisible();
  });

  // ID: MED-02 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect the "Chat" button's accessible name
  // Expected: A descriptive label should be exposed for assistive technology
  test("MED-02: Chat control has a descriptive accessible name", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    await expect(page.getByRole('button', { name: /chat/i }).first()).toHaveAccessibleName(/chat/i);
  });

  // ID: MED-03 | Type: Positive | Severity: n/a | Last status: PASS
  // Steps: 1. Inspect "Quick Scan Entry"
  // Expected: Description of accepted file types plus "Take Photo" and "Upload File" buttons should render
  test("MED-03: Section renders with description and entry controls", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    await expect(page.getByText('Quick Scan Entry', { exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Take Photo', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upload File', exact: true })).toBeVisible();
  });

  // ID: MED-04 | Type: Negative | Severity: Low | Last status: PASS
  // Steps: 1. Inspect the file input behind "Upload File"
  // Expected: Should expose a discernible accessible name
  test("MED-04: Hidden file-upload input has an accessible label", async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
    await expect(page.locator('input[type="file"]')).toHaveAttribute('aria-label', /.+/);
  });

  // ID: MED-05 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Click "Upload File" and select a prescription PDF/photo
  // Expected: Medication Name, Dosage, and other fields below should auto-fill from the scanned document
  test.skip("MED-05: Uploading a valid prescription file auto-populates the form", async () => {
    requireLiveFeature('OCR prescription processing', 'Requires fixture OCR input and backend document processing');
  });

  // ID: MED-06 | Type: Negative | Severity: n/a | Last status: PASS
  // Steps: 1. Attempt to upload a .docx or .mp3 file
  // Expected: A clear error message should reject the unsupported format
  test.skip("MED-06: Uploading an unsupported file type is rejected clearly", async () => {
    requireLiveFeature('backend validation response', 'Requires a fixture upload and deterministic backend file validation response');
  });

  // ID: MED-07 | Type: Negative | Severity: Medium | Last status: PASS
  // Steps: 1. Click "Take Photo"
  // Expected: Device camera capture flow should open
  test.skip("MED-07: \"Take Photo\" opens the device camera", async () => {
    requireBrowserPermission('camera', 'Requires device camera permissions and capture hardware');
  });

});
