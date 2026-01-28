import { test, expect } from '@fixtures/fixture.init';
import { da, faker } from '@faker-js/faker';
import { DASHBOARD } from '@objects/enums/dashboard';

test.describe('User testing Suite', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.loginUser(process.env.EMAIL, process.env.PASSWORD);
        await loginPage.waitForHeader();
    });
    
    
    test('User logged in successfully', async ({ dashboardPage }) => {
        expect(await dashboardPage.getDashboardTitle()).toBe(DASHBOARD.DASHBOARD_TITLE);
    });

    test('Validate mandatory fields', async ({ dashboardPage }) => {
        await dashboardPage.clickAddBook();
        await dashboardPage.clickCreate();
        await dashboardPage.waitForSuccessPopup();

        expect(await dashboardPage.getErrorMessage()).toBe(DASHBOARD.ERROR_MESSAGE);
    });

    test('Add a book', async ({ dashboardPage }) => {
        const randomAuthor = faker.person.fullName();
        const randomTitle = faker.word.words(3);
        
        await dashboardPage.clickAddBook();
        await dashboardPage.fillAuthor(randomAuthor);
        const bookTitle = await dashboardPage.fillTitle(randomTitle);
        await dashboardPage.clickCreate();
        
        await dashboardPage.waitForBookHeader(bookTitle);
        expect(await dashboardPage.getBookByTitle(randomTitle)).toBeVisible();
    });

    test('Add a person', async ({ dashboardPage }) => {
        const randomPersonName = faker.person.fullName();
        await dashboardPage.addPerson(randomPersonName);
        await dashboardPage.waitForSuccessPopup();

        expect(await dashboardPage.getPopupMessageText()).toBe(DASHBOARD.PERSON_ADDED);
    });

    test('Manage people', async ({ dashboardPage }) => {
        const randomPersonName = faker.person.fullName();
        await dashboardPage.addPerson(randomPersonName);
        const text = await dashboardPage.getPopupMessageText();
        expect(text).toBe(DASHBOARD.PERSON_ADDED);

        await dashboardPage.clickManagePerson();
        expect(await dashboardPage.isPersonInList(randomPersonName)).toBeTruthy();
    });
 

    test('User logged out successfully', async ({ dashboardPage }) => {
        await dashboardPage.clickSignOut()
        expect(await dashboardPage.getLoginPageTitle()).toBe(DASHBOARD.LOGIN_PAGE_TITLE);
    });
});
