import { test } from '@playwright/test';

test.describe('User testing Suite', () => {
    
    test('User logged in successfully', async ({ page }) => {
        await page.goto('http://localhost:8080/login');
        await page.fill(`input#email`, 'automation@test.com');
        await page.fill('input#password', 'temp123');
        await page.locator(`//button[text() = 'Sign In']`).click();
        await page.waitForSelector('//h1', {timeout: 5000});
    });
});
