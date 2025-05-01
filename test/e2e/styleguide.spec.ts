// filepath: /home/nanasess/git-repos/sc5-styleguide/test/e2e/styleguide.spec.ts
import { test, expect, Page } from '@playwright/test';

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expect a title "to contain" a substring.
  await expect(page).toHaveTitle(/SC5 Styleguide/);
});

test('get started link', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Expects page to have a heading with the name of the project
  await expect(page.getByRole('heading', { name: 'SC5 style guide generator' })).toBeVisible();
});
