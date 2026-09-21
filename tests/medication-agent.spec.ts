import { test, expect } from '@playwright/test';
import { login } from './helpers';

// Module: MED - medication-agent
// Rebuilt from live numaa.ai/medication-agent content on 2026-09-20

test.describe("MED - medication-agent", () => {

  test.beforeEach(async ({ page }) => {
    await login(page);
    await page.goto('/medication-agent');
  });

  test('MED-01: Page loads with heading and description', async ({ page }) => {
    await expect(page.getByText('MEDICATION SUPPORT', { exact: true })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Medication Management', exact: true })).toBeVisible();
    await expect(page.getByText(/Update your medication schedule and log any changes/i)).toBeVisible();
  });

  test('MED-02: Medication safety disclaimer renders', async ({ page }) => {
    await expect(page.getByText(/Medication safety disclaimer:/i)).toBeVisible();
    await expect(page.getByText(/not a substitute for professional/i)).toBeVisible();
  });

  test('MED-03: Quick Scan Entry section renders with Take Photo and Upload File', async ({ page }) => {
    await expect(page.getByText('QUICK SCAN ENTRY', { exact: true })).toBeVisible();
    await expect(page.getByText(/Take a clear prescription photo/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Take Photo', exact: true })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Upload File', exact: true })).toBeVisible();
  });

  test('MED-04: Add New Medication form renders with all fields', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Add New Medication', exact: true })).toBeVisible();
    await expect(page.getByText('MEDICATION NAME', { exact: false })).toBeVisible();
    await expect(page.getByPlaceholder('e.g., Prenatal Plus')).toBeVisible();
    await expect(page.getByText('DOSAGE', { exact: false })).toBeVisible();
    await expect(page.getByPlaceholder('e.g., 500mg')).toBeVisible();
    await expect(page.getByText('TYPE', { exact: true })).toBeVisible();
    await expect(page.getByText('FREQUENCY', { exact: true })).toBeVisible();
    await expect(page.getByText('TIMING', { exact: true })).toBeVisible();
    await expect(page.getByText('Start Date', { exact: false })).toBeVisible();
    await expect(page.getByText('TIMES', { exact: false })).toBeVisible();
    await expect(page.getByPlaceholder(/e.g., 09:00,21:00/i)).toBeVisible();
    await expect(page.getByText('SPECIAL INSTRUCTIONS', { exact: true })).toBeVisible();
    await expect(page.getByPlaceholder(/Take with food, avoid dairy/i)).toBeVisible();
  });

  test('MED-05: Type dropdown defaults to Vitamin/Supplement', async ({ page }) => {
    await expect(page.getByText('Vitamin/Supplement', { exact: true })).toBeVisible();
  });

  test('MED-06: Frequency dropdown defaults to Daily', async ({ page }) => {
    await expect(page.getByText('Daily', { exact: true })).toBeVisible();
  });

  test('MED-07: Save Medication button renders', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Save Medication', exact: true })).toBeVisible();
  });

  test('MED-08: Active Prescriptions section renders with tracked count', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Active Prescriptions', exact: true })).toBeVisible();
    await expect(page.getByText(/Items Tracked/i)).toBeVisible();
  });

  test('MED-09: Browser notification status and next dose renders', async ({ page }) => {
    await expect(page.getByText(/Browser notifications on/i)).toBeVisible();
    await expect(page.getByText(/Next:/i)).toBeVisible();
    await expect(page.getByRole('button', { name: 'Test', exact: true })).toBeVisible();
  });

  test('MED-10: Prescription cards render with dosage, schedule, and actions', async ({ page }) => {
    await expect(page.getByText('Prenatal Vitamin Plus 400 mg', { exact: true })).toBeVisible();
    await expect(page.getByText(/taken today/i).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Edit', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Delete', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Mark taken', exact: true }).first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'Snooze reminder', exact: true }).first()).toBeVisible();
  });

  test('MED-11: Medication Assistant chat widget renders with disclaimer and input', async ({ page }) => {
    await expect(page.getByText('Medication Assistant', { exact: true })).toBeVisible();
    await expect(page.getByText(/Online.*General guidance/i)).toBeVisible();
    await expect(page.getByText(/Confirm prescriptions, dosage changes, interactions/i)).toBeVisible();
    await expect(page.getByPlaceholder('Ask me anything...')).toBeVisible();
  });

});