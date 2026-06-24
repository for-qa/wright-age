import { test, expect } from '@playwright/test';

test.describe('Playwright Learning Path', () => {
  test('home page loads topic grid', async ({ page }) => {
    await page.goto('/#/');
    await expect(page.getByRole('heading', { name: /Playwright Learning Path/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Why Playwright/i }).first()).toBeVisible();
  });

  test('topic page loads migrated content and quiz', async ({ page }) => {
    await page.goto('/#/pages/pw-why-playwright.html');
    await expect(page.getByRole('heading', { level: 1, name: /Why Playwright/i })).toBeVisible({ timeout: 20_000 });
    await expect(page.locator('#self-test')).toBeVisible();
    const quizOption = page.locator('.quiz-opt').first();
    await expect(quizOption).toBeVisible();
    await quizOption.click();
    await expect(page.locator('.quiz-fb')).toBeVisible();
  });

  test('skip link targets main content', async ({ page }) => {
    await page.goto('/#/');
    await page.keyboard.press('Tab');
    const skip = page.getByRole('link', { name: /skip to main content/i });
    await expect(skip).toBeFocused();
    await skip.click();
    await expect(page.locator('#main-content')).toBeVisible();
  });
});
