import { test, expect } from '@fixtures/fixture.init';
import { CREDENTIALS } from '../../constants/credentials';
import { TITLES } from '../../constants/titles';
import { MESSAGES } from '../../constants/messages';
import { faker } from '@faker-js/faker';

test.describe('User testing Suite', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.loginUser(  CREDENTIALS.EMAIL, CREDENTIALS.PASSWORD);
        await loginPage.page.waitForSelector('//h1', {timeout: 5000});
    });
    
    
    test('User logged in successfully', async ({ dashboardPage }) => {
        expect(await dashboardPage.getDashboardTitle()).toBe(TITLES.DASHBOARD);
    });

    test('Validate mandatory fields', async ({ dashboardPage }) => {
        await dashboardPage.clickAddBook();
        await dashboardPage.clickCreate();
        await dashboardPage.page.waitForSelector(`div#root li div div:nth-child(2)`, {timeout: 5000});//MOVE THIS css selector

        expect(await dashboardPage.getErrorMessage()).toBe(MESSAGES.MANDATORY_FIELDS);
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

        expect(await dashboardPage.getPopupMessageText()).toBe(MESSAGES.PERSON_ADDED);
    });

    test('Manage people', async ({ dashboardPage }) => {
        const randomPersonName = faker.person.fullName();
        await dashboardPage.addPerson(randomPersonName);
        const text = await dashboardPage.getPopupMessageText();
        expect(text).toBe(MESSAGES.PERSON_ADDED); 

        await dashboardPage.clickManagePerson();
        expect(await dashboardPage.isPersonInList(randomPersonName)).toBeTruthy();
    });
 

    test('User logged out successfully', async ({ dashboardPage }) => {
        await dashboardPage.clickSignOut()
        await dashboardPage.page.waitForSelector('//h3', { timeout: 5000 });

        expect(await dashboardPage.getLoginPageTitle()).toBe(TITLES.LOGIN_PAGE);
    });
});
