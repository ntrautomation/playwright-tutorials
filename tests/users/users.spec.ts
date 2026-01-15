import { test, expect } from '@fixtures/fixture.init';
import { da, faker } from '@faker-js/faker';

test.describe('User testing Suite', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.loginUser(`automation@test.com`, `temp123`);
        await loginPage.page.waitForSelector('//h1', {timeout: 5000});
    })
    
    
    test('User logged in successfully', async ({ dashboardPage }) => {
        expect(await dashboardPage.getDashboardTitle()).toBe('Dashboard');
    });

    test('Validate mandatory fields', async ({ dashboardPage }) => {
        await dashboardPage.clickAddBook();
        await dashboardPage.clickCreate();
        await dashboardPage.page.waitForSelector(`div#root li div div:nth-child(2)`, {timeout: 5000});

        expect(await dashboardPage.getErrorMessage()).toBe(`Please fill in both title and author fields`);
    });

    test('Add a book', async ({ dashboardPage }) => {
        const randomAuthor = faker.person.fullName();
        const randomTitle = faker.word.words(3);
        
        await dashboardPage.clickAddBook();
        await dashboardPage.fillAuthor(randomAuthor);
        await dashboardPage.fillTitle(randomTitle);
        await dashboardPage.clickCreate();
        
        await dashboardPage.page.waitForTimeout(1000);
        expect(await dashboardPage.getBookByTitle(randomTitle)).toBeVisible();
    });

    test('Add a person', async ({ dashboardPage }) => {
        const randomPersonName = faker.person.fullName();
        
        await dashboardPage.addPerson(randomPersonName);
        await dashboardPage.page.waitForSelector('//h3', { timeout: 5000 });

        //expect(await dashboardPage.getPopupMessageText()).toBe();
        
        expect(await dashboardPage.getPopupMessageText()).toBe(`Person added`);
    });

    test.only('Manage people', async ({ dashboardPage }) => {
        const randomPersonName = faker.person.fullName();
        await dashboardPage.addPerson(randomPersonName);
        const text = await dashboardPage.getPopupMessageText()
        console.log(text);
        expect(text).toBe(`Person added`);
        await dashboardPage.clickManagePerson();
        expect(await dashboardPage.isPersonInList(randomPersonName)).toBeTruthy();
    });
 

    test('User logged out successfully', async ({ dashboardPage }) => {
        await dashboardPage.clickSignOut()
        await dashboardPage.page.waitForSelector('//h3', { timeout: 5000 });

        expect(await dashboardPage.getLoginPageTitle()).toBe('Automation Tutorials');
    });
});
