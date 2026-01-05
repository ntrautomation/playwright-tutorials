import LoginPage from '@objects/pages/login.page';
import { expect, test } from '@playwright/test';

test.describe('User testing Suite', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await page.goto('http://localhost:8080/login');
        await loginPage.loginUser(`automation@test.com`, `temp123`);
        await page.waitForSelector('//h1', {timeout: 5000});
    })
    
    
    test('User logged in successfully', async ({ page }) => {
        expect(await page.locator('//h1').textContent()).toBe('Dashboard');
    });

    test('Validate mandatory fields', async ({ page }) => {
        await page.locator(`//button/span[text() = 'Add a Book']`).click();
        await page.locator(`//button[text() = 'Create']`).click();
        await page.waitForSelector(`div#root li div div:nth-child(2)`, {timeout: 5000});

        expect(await page.locator(`div#root li div div:nth-child(2)`).first().innerText()).toBe(`Please fill in both title and author fields`);
    });

    test('Add a book', async ({ page }) => {
        await page.locator(`//button/span[text() = 'Add a Book']`).click();
        await page.locator(`//input[@placeholder = 'Enter author name']`).fill(`Automation`);
        await page.locator(`//input[@placeholder = 'Enter book title']`).fill(`QA`);
        await page.locator(`//button[text() = 'Create']`).click();

        expect(await page.locator(`//h3[text() = 'QA']`)).toBeVisible();
    });
});
