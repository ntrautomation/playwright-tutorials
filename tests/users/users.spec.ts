import LoginPage from '@objects/pages/login.page';
import DashboardPage from '@objects/pages/dashboard.page';
import { expect, test } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('User testing Suite', () => {

    test.beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);
        await page.goto('http://localhost:8080/login');
        await loginPage.loginUser(`automation@test.com`, `temp123`);
        await page.waitForSelector('//h1', {timeout: 5000});
    })
    
    
    test('User logged in successfully', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        expect(await dashboardPage.getDashboardTitle()).toBe('Dashboard');
    });

    test('Validate mandatory fields', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.clickAddBook();
        await dashboardPage.clickCreate();
        await page.waitForSelector(`div#root li div div:nth-child(2)`, {timeout: 5000});

        expect(await dashboardPage.getErrorMessage()).toBe(`Please fill in both title and author fields`);
    });

    test('Add a book', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        const randomAuthor = faker.person.fullName();
        const randomTitle = faker.word.words(3);
        
        await dashboardPage.clickAddBook();
        await dashboardPage.fillAuthor(randomAuthor);
        await dashboardPage.fillTitle(randomTitle);
        await dashboardPage.clickCreate();
        
        await page.waitForTimeout(1000);
        expect(await dashboardPage.getBookByTitle(randomTitle)).toBeVisible();
    });

    test('Add a person', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        const randomPersonName = faker.person.fullName();
        
        await dashboardPage.addPerson(randomPersonName);
        await page.waitForSelector('//h3', { timeout: 5000 });

        expect(await dashboardPage.isPopupVisible()).toBeTruthy();
        expect(await dashboardPage.getPopupMessageText()).toBe(`Person added`);
    });

    test('Manage people', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        const randomPersonName = faker.person.fullName();

        await dashboardPage.addPerson(randomPersonName);
        await dashboardPage.clickManagePerson();
        await page.waitForSelector('//h3', { timeout: 5000 });

        expect(await dashboardPage.isPersonInList(randomPersonName)).toBeTruthy();
    });

    test('User logged out successfully', async ({ page }) => {
        const dashboardPage = new DashboardPage(page);
        await dashboardPage.clickSignOut()
        await page.waitForSelector('//h3', { timeout: 5000 });

        expect(await dashboardPage.getLoginPageTitle()).toBe('Automation Tutorials');
    });
});
