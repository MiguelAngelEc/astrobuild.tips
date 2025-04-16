// @ts-check
import { test, expect } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  await expect(page).toHaveTitle(/Astro/);
});

test('about page works', async ({ page }) => {
  await page.goto('http://localhost:3000/about');
  await expect(page.locator('h2')).toBeVisible();
});
