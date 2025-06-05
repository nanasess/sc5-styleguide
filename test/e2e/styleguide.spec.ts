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

test('navigation functionality', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Test navigation to Colors and typography section
  await page.getByRole('link', { name: 'Colors and typography' }).click();
  await expect(page).toHaveURL('http://localhost:3000/section/1');
  await expect(page).toHaveTitle('1 Colors and typography - SC5 Styleguide');

  // Verify the section content is displayed
  await expect(page.getByRole('heading', { name: 'Colors and typography 1 styleguide-app.css' })).toBeVisible();
  await expect(page.getByText('This section describes base colors and typography')).toBeVisible();

  // Test navigation to Buttons section via direct URL (to avoid click issues)
  await page.goto('http://localhost:3000/section/2.3');
  await expect(page).toHaveTitle('2.3 Buttons - SC5 Styleguide');
  await expect(page.getByRole('heading', { name: 'Buttons 2.3 styleguide-app.css' })).toBeVisible();

  // Verify button examples are displayed
  await expect(page.getByRole('button', { name: 'Button text' }).first()).toBeVisible();
});

test('styleguide components display', async ({ page }) => {
  await page.goto('http://localhost:3000/section/1.1');

  // Verify main colors section displays correctly
  await expect(page.getByRole('heading', { name: 'Main colors 1.1 styleguide-app.css' })).toBeVisible();

  // Check that color values are shown - these are unique on the page
  await expect(page.getByText('#1C3849')).toBeVisible();
  await expect(page.getByText('#E4E4E4')).toBeVisible();
  await expect(page.getByText('#EB7F00')).toBeVisible();

  // Test button section components
  await page.goto('http://localhost:3000/section/2.3');
  
  // Verify button section heading
  await expect(page.getByRole('heading', { name: 'Buttons 2.3 styleguide-app.css' })).toBeVisible();
  
  // Verify at least one button is present
  await expect(page.locator('button').first()).toBeVisible();
});

test('search functionality', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Test search for "button"
  await page.getByRole('searchbox', { name: 'Search styles' }).fill('button');
  
  // Verify the search results page is displayed
  await expect(page).toHaveURL('http://localhost:3000/search/all');
  await expect(page).toHaveTitle('All sections - SC5 Styleguide');

  // Verify search results contain button-related sections
  await expect(page.getByRole('heading', { name: 'Buttons and inputs 2 styleguide-app.css' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Buttons 2.3 styleguide-app.css' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Action footer 4.2 styleguide-app.css' })).toBeVisible();

  // Verify button components are displayed in search results
  await expect(page.getByRole('button', { name: 'Button text' }).first()).toBeVisible();
  await expect(page.getByRole('button', { name: 'Primary action' })).toBeVisible();
});

test('angular directives section', async ({ page }) => {
  await page.goto('http://localhost:3000/section/6.1');

  // Verify Angular directive section displays
  await expect(page).toHaveTitle('6.1 Test directive - SC5 Styleguide');
  await expect(page.getByRole('heading', { name: 'Test directive 6.1 styleguide-app.css' })).toBeVisible();

  // Verify Designer Tools section is present
  await expect(page.getByText('Designer Tools')).toBeVisible();
  await expect(page.getByText('This section does not contain any related variables.')).toBeVisible();
});

test('responsive design', async ({ page }) => {
  // Test tablet size (768px)
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto('http://localhost:3000/');

  // Verify layout adapts to tablet size
  await expect(page.getByRole('heading', { name: 'SC5 Styleguide', level: 1 })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();
  await expect(page.getByRole('searchbox', { name: 'Search styles' })).toBeVisible();

  // Test mobile size (480px)
  await page.setViewportSize({ width: 480, height: 800 });

  // Verify layout still works on mobile
  await expect(page.getByRole('heading', { name: 'SC5 Styleguide', level: 1 })).toBeVisible();
  await expect(page.getByRole('navigation')).toBeVisible();

  // Test navigation still works on mobile
  await page.getByRole('link', { name: 'Colors and typography' }).click();
  await expect(page).toHaveURL('http://localhost:3000/section/1');

  // Reset to desktop size
  await page.setViewportSize({ width: 1280, height: 720 });
});

test('footer and branding', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  // Verify footer content
  await expect(page.getByText('Generated with the')).toBeVisible();
  await expect(page.getByRole('link', { name: 'styleguide engine' })).toBeVisible();

  // Verify SC5 logo is present
  await expect(page.getByRole('img', { name: 'SC5' })).toBeVisible();
});
