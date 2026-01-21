import { test, expect } from '@fixtures/fixture.init';
import { faker } from '@faker-js/faker';
import { Messages } from '@objects/constants/error.messages';
import { Titles } from '@objects/constants/titles.messages';

test.describe('User testing Suite', () => {

    test.beforeEach(async ({ loginPage }) => {
        await loginPage.loginUser(`tea@test.com`, `temp123`); //MOVE THIS
        await loginPage.page.waitForSelector('//h1', {timeout: 5000});
    });
    
    
    test('User logged in successfully', async ({ dashboardPage }) => {
        expect(await dashboardPage.getDashboardTitle()).toBe(Titles.DASHBOARD_TITLE);//MOVE THIS - DONE
    });

    test('Validate mandatory fields', async ({ dashboardPage }) => {
        await dashboardPage.clickAddBook();
        await dashboardPage.clickCreate();
        await dashboardPage.popupMessageLocator.waitFor({ state: 'visible', timeout: 5000 });

        expect(await dashboardPage.getErrorMessage()).toBe(Messages.ADD_BOOK_FIELD_VALIDATION_MESSAGE);//MOVE THIS - DONE
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

        expect(await dashboardPage.getPopupMessageText()).toBe(Messages.ADD_PERSON_SUCCESS_MESSAGE); //MOVE THIS - DONE
    });

    test('Manage people', async ({ dashboardPage }) => {
        const randomPersonName = faker.person.fullName();
        await dashboardPage.addPerson(randomPersonName);
        const text = await dashboardPage.getPopupMessageText();
        expect(text).toBe(Messages.ADD_PERSON_SUCCESS_MESSAGE); //MOVE THIS - DONE

        await dashboardPage.clickManagePerson();
        expect(await dashboardPage.isPersonInList(randomPersonName)).toBeTruthy();
    });
 

    test('User logged out successfully', async ({ dashboardPage }) => {
        await dashboardPage.clickSignOut()
        await dashboardPage.page.waitForSelector('//h3', { timeout: 5000 });

        expect(await dashboardPage.getLoginPageTitle()).toBe(Titles.LOGIN_PAGE_TITLE);//MOVE THIS - DONE
    });
});
