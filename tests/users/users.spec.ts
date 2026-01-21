import { test, expect } from '@fixtures/fixture.init';
import { da, faker } from '@faker-js/faker';
import Constants from '@objects/constants/constants';

test.describe('User testing Suite', () => {

    test.beforeEach(async ({ loginPage, dashboardPage }) => {
        await loginPage.loginUser(`automation@test.com`, `temp123`);
        await dashboardPage.waitForDashboardTitle();
    })
    
    
    test('User logged in successfully', async ({ dashboardPage }) => {
        expect(await dashboardPage.getDashboardTitle()).toBe(Constants.expectedDashboardTitle);
    });

    test('Validate mandatory fields', async ({ dashboardPage }) => {
        await dashboardPage.clickAddBook();
        await dashboardPage.clickCreate();
        await dashboardPage.waitForErrorMessage();

        expect(await dashboardPage.getErrorMessage()).toBe(Constants.expectedErrorMessage);
    });

    test('Add a book', async ({ dashboardPage }) => {
        const randomAuthor = faker.person.fullName();
        const randomTitle = faker.word.words(3);
        const bookLocator = await dashboardPage.getBookByTitle(randomTitle);
        
        await dashboardPage.clickAddBook();
        await dashboardPage.fillAuthor(randomAuthor);
        await dashboardPage.fillTitle(randomTitle);
        await dashboardPage.clickCreate();

        await bookLocator.waitFor({ state: 'visible' });

        expect(bookLocator).toBeVisible();
    });

    test('Add a person', async ({ dashboardPage }) => {
        const randomPersonName = faker.person.fullName();
        
        await dashboardPage.addPerson(randomPersonName);
        await dashboardPage.waitForPopup();
        
        expect(await dashboardPage.getPopupMessageText()).toBe(Constants.expectedPopupMessagePersonAdded);
    });

    test('Manage people', async ({ dashboardPage }) => {
        const randomPersonName = faker.person.fullName();
        await dashboardPage.addPerson(randomPersonName);
        const text = await dashboardPage.getPopupMessageText();
        console.log(text);
        expect(text).toBe(`Person added`);
        await dashboardPage.clickManagePerson();
        expect(await dashboardPage.isPersonInList(randomPersonName)).toBeTruthy();
    });
 

    test('User logged out successfully', async ({ dashboardPage }) => {
        await dashboardPage.clickSignOut()
        await dashboardPage.waitForLoginPageTitle();

        expect(await dashboardPage.getLoginPageTitle()).toBe(Constants.expectedLoginPageTitle);
    });
});
